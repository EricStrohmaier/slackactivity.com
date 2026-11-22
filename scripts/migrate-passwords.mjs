#!/usr/bin/env node
/**
 * Bring email/password accounts over from Supabase Auth.
 *
 *   SUPABASE_DB_URL=postgresql://... node scripts/migrate-passwords.mjs [--dry]
 *
 * 1. Adds `users.password_hash` and the `email_tokens` table to an existing
 *    Turso database (fresh databases get them from lib/db/schema.sql).
 * 2. Copies bcrypt hashes from auth.users so existing passwords keep working.
 *    Only accounts whose email Supabase confirmed are imported: an unconfirmed
 *    address was never proven, so importing it would let whoever typed someone
 *    else's email sign in as them. Those users can use "Set a password", which
 *    verifies the address by email.
 *
 * Safe to re-run (e.g. at cutover, to pick up password changes made on the old
 * site). Supabase is only read, inside a read-only transaction.
 * SUPABASE_DB_URL may also be set in .env.local.
 */

import { createClient } from "@libsql/client";
import pg from "pg";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const DRY = process.argv.includes("--dry");
for (const name of ["SUPABASE_DB_URL", "TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN"]) {
  if (!process.env[name]) {
    console.error(`Missing ${name}`);
    process.exit(1);
  }
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function ensureSchema() {
  const cols = (await db.execute("pragma table_info(users)")).rows.map((r) => r.name);
  if (!cols.includes("password_hash")) {
    if (DRY) console.log("  would add users.password_hash");
    else {
      await db.execute("alter table users add column password_hash text");
      console.log("✔ added users.password_hash");
    }
  }
  if (!DRY) {
    await db.executeMultiple(`
      create table if not exists email_tokens (
        token_hash    text primary key,
        email         text not null,
        password_hash text not null,
        expires_at    text not null,
        used_at       text,
        created_at    text not null
      );
      create index if not exists email_tokens_email_idx on email_tokens (email, created_at);
    `);
    console.log("✔ email_tokens table ready");
  }
}

async function readSupabaseHashes() {
  const client = new pg.Client({
    connectionString: process.env.SUPABASE_DB_URL,
    connectionTimeoutMillis: 15_000,
    query_timeout: 30_000,
  });
  await client.connect();
  try {
    await client.query("begin read only");
    const { rows } = await client.query(`
      select id, lower(email) as email, encrypted_password as hash, created_at
        from auth.users
       where email is not null
         and email_confirmed_at is not null
         and deleted_at is null
         and (banned_until is null or banned_until < now())
         and encrypted_password like '$2%'`);
    await client.query("rollback");
    return rows;
  } finally {
    await client.end();
  }
}

async function main() {
  console.log(DRY ? "DRY RUN — no writes\n" : "Importing password accounts\n");
  await ensureSchema();

  const accounts = await readSupabaseHashes();
  console.log(`  ${accounts.length} confirmed password accounts in Supabase`);

  let updated = 0;
  let created = 0;
  for (const a of accounts) {
    const byId = await db.execute({ sql: "select id from users where id = ?", args: [a.id] });
    const byEmail = byId.rows.length
      ? byId
      : await db.execute({
          sql: "select id from users where email = ? collate nocase order by created_at limit 1",
          args: [a.email],
        });

    if (byEmail.rows.length) {
      if (!DRY) {
        await db.execute({
          sql: "update users set password_hash = ? where id = ?",
          args: [a.hash, byEmail.rows[0].id],
        });
      }
      updated++;
    } else {
      if (!DRY) {
        await db.execute({
          sql: `insert into users (id, email, created_at, password_hash) values (?, ?, ?, ?)`,
          args: [a.id, a.email, new Date(a.created_at).toISOString(), a.hash],
        });
      }
      created++;
    }
  }

  console.log(
    `${DRY ? "  would set" : "✔ set"} passwords: ${updated} existing users, ${created} new user rows`
  );
}

main().catch((err) => {
  console.error("\n✖ failed:", err.message);
  process.exit(1);
});
