import { createClient, type Client, type InValue } from "@libsql/client";

declare global {
  // eslint-disable-next-line no-var
  var __tursoClient: Client | undefined;
}

function build(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) throw new Error("TURSO_DATABASE_URL is not set");

  return createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

/**
 * Shared libSQL client. Cached on globalThis so Next.js dev's module reloading
 * doesn't open a new connection on every request.
 */
export const db: Client =
  global.__tursoClient ?? (global.__tursoClient = build());

/**
 * All rows for a query, typed.
 *
 * A libSQL row is not a plain object: it carries a non-enumerable `length` plus
 * one non-enumerable property per column position, so React refuses to send it
 * to a Client Component ("Only plain objects can be passed..."). Spreading keeps
 * just the named columns, so every caller gets something that can cross the
 * server/client boundary without each one having to remap it by hand.
 */
export async function all<T>(sql: string, args: InValue[] = []): Promise<T[]> {
  const rs = await db.execute({ sql, args });
  return rs.rows.map((row) => ({ ...row })) as unknown as T[];
}

/** First row, or null. */
export async function one<T>(
  sql: string,
  args: InValue[] = []
): Promise<T | null> {
  const rows = await all<T>(sql, args);
  return rows[0] ?? null;
}

/** Statement with no result rows. */
export async function run(sql: string, args: InValue[] = []): Promise<void> {
  await db.execute({ sql, args });
}

/** A single integer aggregate (count/sum), coerced to a number. */
export async function scalar(
  sql: string,
  args: InValue[] = []
): Promise<number> {
  const row = await one<Record<string, unknown>>(sql, args);
  if (!row) return 0;
  return Number(Object.values(row)[0] ?? 0);
}

/** ISO-8601 UTC with milliseconds — the storage format for every timestamp. */
export function isoNow(): string {
  return new Date().toISOString();
}

/** Normalize any date-ish input to the stored timestamp format. */
export function iso(value: Date | string | number): string {
  return new Date(value).toISOString();
}

/**
 * UTC hour-bucket key ('YYYY-MM-DDTHH') — the grain of `activity_rollup`.
 *
 * Range filters on it are inclusive at both ends (`hour >= a and hour <= b`):
 * a bucket is only wholly inside a window if the window happens to land on an
 * hour boundary, and for the ranges these stats use (30/90/365 days) counting
 * the two partial edge buckets is far better than dropping them.
 */
export function hourKey(value: Date | string | number): string {
  return iso(value).slice(0, 13);
}

/** SQLite has no boolean type; columns are 0/1. */
export function bool(value: unknown): boolean {
  return value === 1 || value === true;
}

/** Parse a JSON text column, tolerating nulls and already-parsed values. */
export function json<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== "string") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
