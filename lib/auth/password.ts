import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

/** Supabase Auth's cost; only used for the timing-equalising dummy hash. */
const BCRYPT_COST = 10;

/**
 * A real hash of a random string. Comparing against it when the account has no
 * password keeps response time the same, so timing doesn't reveal which emails
 * have accounts.
 */
const DUMMY_HASH = bcrypt.hashSync(randomBytes(16).toString("hex"), BCRYPT_COST);

/** Verifies imported Supabase hashes ($2a$10$…) and our own alike. */
export async function verifyPassword(password: string, hash: string | null): Promise<boolean> {
  const ok = await bcrypt.compare(password, hash ?? DUMMY_HASH);
  return ok && hash !== null;
}

export function normalizeEmail(email: unknown): string | null {
  if (typeof email !== "string") return null;
  const e = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254 ? e : null;
}

/**
 * Fixed-window counter, in memory. The app runs as a single container, so this
 * is enough to stop password guessing; it resets on deploy,
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
