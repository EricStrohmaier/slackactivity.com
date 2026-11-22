/**
 * "Sign in with Google": plain OAuth 2.0 authorization-code flow, no library.
 *
 * Google sign-in only identifies the person. It never grants Slack access, so a
 * Google-signed-in user still connects Slack from the dashboard. Accounts are
 * matched by verified email, which is how the ~60 accounts that signed up with
 * Google under Supabase Auth get back into their existing account.
 */

import { siteUrl } from "@/lib/email";

const TIMEOUT_MS = 8_000;

export const GOOGLE_STATE_COOKIE = "g_oauth_state";

/** Both values must be set for the Google button and routes to be enabled. */
export function googleEnabled(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

/**
 * Must match an "Authorized redirect URI" on the Google OAuth client exactly:
 * <site>/api/auth/google/callback, where <site> is NEXT_PUBLIC_SITE_URL
 * (localhost in development). GOOGLE_REDIRECT_URI overrides it.
 */
export function googleRedirectUri(): string {
  return process.env.GOOGLE_REDIRECT_URI || `${siteUrl()}/api/auth/google/callback`;
}

export function googleAuthorizeUrl(state: string): string {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
  url.searchParams.set("redirect_uri", googleRedirectUri());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

export interface GoogleProfile {
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

/**
 * Exchange the code and read the profile. Returns null unless Google reports a
 * *verified* email: an unverified address must never be able to claim an
 * existing account.
 */
export async function fetchGoogleProfile(code: string): Promise<GoogleProfile | null> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: googleRedirectUri(),
      grant_type: "authorization_code",
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const token = await tokenRes.json().catch(() => null);
  if (!tokenRes.ok || !token?.access_token) {
    console.error("Google token exchange failed:", token?.error, token?.error_description);
    return null;
  }

  // Server-to-server over TLS with the token Google just issued, so the
  // userinfo response is trusted without verifying the id_token signature.
  const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const info = await infoRes.json().catch(() => null);
  if (!infoRes.ok || !info?.email || info.email_verified !== true) {
    console.error("Google userinfo rejected:", infoRes.status, info?.email_verified);
    return null;
  }

  return {
    email: String(info.email).toLowerCase(),
    full_name: info.name ?? null,
    avatar_url: info.picture ?? null,
  };
}
