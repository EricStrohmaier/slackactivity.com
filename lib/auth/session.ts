import { cookies } from "next/headers";

/**
 * Stateless session cookie: `base64url(payload).base64url(hmac)`.
 *
 * Signed with HMAC-SHA256 via Web Crypto (available in both the Node and Edge
 * runtimes), so there is no session table and no auth dependency. Rotating
 * SESSION_SECRET invalidates every outstanding session.
 */

const COOKIE_NAME = "sa_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days

interface SessionPayload {
  uid: string;
  exp: number; // seconds since epoch
}

/**
 * Web Crypto wants a BufferSource. TypeScript's newer generic Uint8Array
 * (`Uint8Array<ArrayBufferLike>`) doesn't satisfy that, so every value handed
 * to subtle.* is copied into a plain ArrayBuffer first.
 */
function bytes(value: string): ArrayBuffer {
  const u8 = new TextEncoder().encode(value);
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength) as ArrayBuffer;
}

function secret(): ArrayBuffer {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set");
  return bytes(value);
}

function b64urlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(value: string): ArrayBuffer {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const u8 = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return u8.buffer.slice(0) as ArrayBuffer;
}

async function key(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    secret(),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signSession(userId: string): Promise<string> {
  const payload: SessionPayload = {
    uid: userId,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  };
  const body = b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const mac = await crypto.subtle.sign(
    "HMAC",
    await key(),
    bytes(body)
  );
  return `${body}.${b64urlEncode(new Uint8Array(mac))}`;
}

export async function verifySession(token: string): Promise<string | null> {
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;

  let valid = false;
  try {
    valid = await crypto.subtle.verify(
      "HMAC",
      await key(),
      b64urlDecode(mac),
      bytes(body)
    );
  } catch {
    return null;
  }
  if (!valid) return null;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(b64urlDecode(body))
    ) as SessionPayload;
    if (!payload.uid || payload.exp * 1000 < Date.now()) return null;
    return payload.uid;
  } catch {
    return null;
  }
}

/** Call only from a Route Handler or Server Action. */
export async function setSessionCookie(userId: string): Promise<void> {
  cookies().set(COOKIE_NAME, await signSession(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(): void {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

/** Verified user id from the request cookie, or null. */
export async function getSessionUserId(): Promise<string | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}
