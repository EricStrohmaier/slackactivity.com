import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";

export const MIN_PASSWORD_LENGTH = 8;
/** bcrypt only looks at the first 72 bytes; reject longer instead of truncating silently. */
export const MAX_PASSWORD_BYTES = 72;

/** Same cost Supabase Auth used, so imported and new hashes behave alike. */
const BCRYPT_COST = 10;

/**
 * A real hash of a random string. Comparing against it when the account has no
 * password keeps response time the same, so timing doesn't reveal which emails
 * have accounts.
 */
const DUMMY_HASH = bcrypt.hashSync(randomBytes(16).toString("hex"), BCRYPT_COST);

export function passwordProblem(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
    return "That password is too long.";
  }
  return null;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

/** Verifies imported Supabase hashes ($2a$10$…) and our own alike. */
export async function verifyPassword(password: string, hash: string | null): Promise<boolean> {
  const ok = await bcrypt.compare(password, hash ?? DUMMY_HASH);
  return ok && hash !== null;
}

/** Opaque token for an emailed link; only its hash is stored. */
export function newEmailToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: sha256(token) };
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function normalizeEmail(email: unknown): string | null {
  if (typeof email !== "string") return null;
  const e = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254 ? e : null;
}

/**
 * Fixed-window counter, in memory. The app runs as a single container, so this
 * is enough to stop password guessing and email flooding; it resets on deploy,
 * which is acceptable for a throttle.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  b.count++;
  return b.count > limit;
}
