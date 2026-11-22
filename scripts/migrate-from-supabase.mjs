#!/usr/bin/env node
/**
 * One-shot migration: Supabase (Postgres) -> Turso (libSQL).
 *
 *   node scripts/migrate-from-supabase.mjs           # full run
 *   node scripts/migrate-from-supabase.mjs --logs    # activity_logs only
 *   node scripts/migrate-from-supabase.mjs --dry     # counts, no writes
 *
 * Safe to re-run. Users and workspaces are upserted; activity_logs resume from
 * the highest id already in Turso (Supabase ids are preserved verbatim).
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ------------------------------------------------------------------- env

for (const line of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

for (const [name, value] of Object.entries({
  NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY,
  TURSO_DATABASE_URL: TURSO_URL,
  TURSO_AUTH_TOKEN: TURSO_TOKEN,
})) {
  if (!value) {
    console.error(`Missing ${name} in .env.local`);
    process.exit(1);
  }
}

const DRY = process.argv.includes("--dry");
const LOGS_ONLY = process.argv.includes("--logs");

const db = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

// ------------------------------------------------------------- supabase io

/** Both endpoints are remote and occasionally drop a connection mid-run. */
async function retry(label, fn, attempts = 6) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const wait = Math.min(500 * 2 ** i, 15000);
      process.stdout.write(
        `\n  ⚠ ${label} failed (${err.cause?.code || err.message}), ` +
          `retry ${i + 1}/${attempts} in ${wait}ms\n`
      );
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

async function pg(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase ${path} -> ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function pgCount(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id`, {
    method: "GET",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      Prefer: "count=exact",
      Range: "0-0",
    },
  });
  return Number((res.headers.get("content-range") || "0-0/0").split("/")[1]);
}

// ---------------------------------------------------------------- helpers

/** Every stored timestamp is fixed-width ISO-8601 UTC. */
function ts(value) {
  if (!value) return new Date(0).toISOString();
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString();
}

function jsonOrNull(value) {
  if (value === null || value === undefined) return null;
  return typeof value === "string" ? value : JSON.stringify(value);
}

const fmt = (n) => n.toLocaleString("en-US");

// --------------------------------------------------------------- schema

async function applySchema() {
  // executeMultiple, not split(";"): the rollup triggers contain semicolons
  // inside their bodies. Every statement is `if not exists`, so this is safe
  // to run against an existing database.
  const sql = readFileSync(join(ROOT, "lib/db/schema.sql"), "utf8");
  await db.executeMultiple(sql);
  console.log("✔ schema applied");
}

// ---------------------------------------------------------------- users

async function migrateUsers() {
  const rows = await pg(
    "users?select=id,email,full_name,avatar_url,created_at&order=created_at"
  );
  console.log(`  fetched ${fmt(rows.length)} users from Supabase`);
  if (DRY) return rows.length;

  await db.batch(
    rows.map((u) => ({
      sql: `insert into users (id, email, full_name, avatar_url, created_at)
            values (?, ?, ?, ?, ?)
            on conflict(id) do update set
              email      = coalesce(excluded.email, users.email),
              full_name  = coalesce(excluded.full_name, users.full_name),
              avatar_url = coalesce(excluded.avatar_url, users.avatar_url)`,
      args: [
        u.id,
        u.email ?? null,
        u.full_name ?? null,
        u.avatar_url ?? null,
        ts(u.created_at),
      ],
    })),
    "write"
  );

  console.log(`✔ users: ${fmt(rows.length)}`);
  return rows.length;
}

// ----------------------------------------------------------- workspaces

/** Resolve (team_id, slack_user_id) for each token so returning users re-link. */
async function slackIdentity(token) {
  try {
    const res = await fetch("https://slack.com/api/auth.test", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.ok) return { error: data.error };
    return { userId: data.user_id, teamId: data.team_id, team: data.team };
  } catch (err) {
    return { error: err.message };
  }
}

async function migrateWorkspaces() {
  const rows = await pg(
    "workspace?select=id,user_id,team_id,team_name,slack_auth_token,is_active,working_hours,created_at&order=created_at"
  );
  console.log(`  fetched ${fmt(rows.length)} workspaces from Supabase`);

  const identities = await Promise.all(
    rows.map(async (w) => {
      if (!w.slack_auth_token) return { error: "no_token" };
      return slackIdentity(w.slack_auth_token);
    })
  );

  let resolved = 0;
  identities.forEach((id, i) => {
    const w = rows[i];
    if (id.error) {
      console.log(`    ! ${w.team_name}: slack auth.test -> ${id.error}`);
    } else {
      resolved++;
      console.log(`    · ${w.team_name}: ${id.teamId}/${id.userId}`);
    }
  });
  console.log(`  resolved ${resolved}/${rows.length} Slack identities`);

  if (DRY) return rows.length;

  await db.batch(
    rows.map((w, i) => {
      const id = identities[i];
      return {
        sql: `insert into workspace
                (id, user_id, team_id, team_name, slack_user_id, slack_auth_token,
                 is_active, working_hours, created_at)
              values (?, ?, ?, ?, ?, ?, ?, ?, ?)
              on conflict(id) do update set
                team_id       = coalesce(excluded.team_id, workspace.team_id),
                team_name     = coalesce(excluded.team_name, workspace.team_name),
                slack_user_id = coalesce(excluded.slack_user_id, workspace.slack_user_id),
                -- Supabase is the source of truth until cutover: a user who
                -- reconnected Slack there has a new token we must carry over.
                slack_auth_token = coalesce(excluded.slack_auth_token, workspace.slack_auth_token),
                working_hours = excluded.working_hours,
                is_active     = excluded.is_active`,
        args: [
          w.id,
          w.user_id,
          id.teamId ?? w.team_id ?? null,
          w.team_name ?? null,
          id.userId ?? null,
          w.slack_auth_token ?? null,
          w.is_active ? 1 : 0,
          jsonOrNull(w.working_hours),
          ts(w.created_at),
        ],
      };
    }),
    "write"
  );

  console.log(`✔ workspaces: ${fmt(rows.length)} (${resolved} Slack-linked)`);
  return rows.length;
}

// -------------------------------------------------------- activity_logs

// PostgREST caps a response at 1000 rows (Supabase's default max-rows), so
// asking for more silently returns 1000 — pagination must assume that ceiling.
const PAGE = 1000; // rows per Supabase request
const CHUNK = 500; // rows per multi-values INSERT
const STMTS_PER_BATCH = 4; // -> 2000 rows per Turso round trip

async function migrateActivityLogs() {
  const total = await pgCount("activity_logs");

  const validIds = new Set(
    (await db.execute("select id from workspace")).rows.map((r) => r.id)
  );

  const resumeRow = await db.execute(
    "select coalesce(max(id), 0) as max_id from activity_logs"
  );
  let cursor = Number(resumeRow.rows[0].max_id);

  const already = Number(
    (await db.execute("select count(*) as c from activity_logs")).rows[0].c
  );

  console.log(
    `  ${fmt(total)} rows in Supabase; ${fmt(already)} already in Turso` +
      (cursor > 0 ? ` (resuming after id ${fmt(cursor)})` : "")
  );
  if (DRY) return;

  let inserted = 0;
  let orphaned = 0;
  const startedAt = Date.now();

  for (;;) {
    // workspace_id is null for ~8k pre-launch rows; filtering server-side keeps
    // them out of the transfer entirely.
    const rows = await retry("supabase page", () =>
      pg(
        `activity_logs?select=id,workspace_id,action,details,timestamp` +
          `&workspace_id=not.is.null&id=gt.${cursor}&order=id.asc&limit=${PAGE}`
      )
    );
    if (rows.length === 0) break;

    cursor = rows[rows.length - 1].id;

    // Logs whose workspace was deleted can't satisfy the FK and are invisible
    // to every query in the app, so they're dropped (and counted).
    const keep = rows.filter((r) => {
      if (r.workspace_id && validIds.has(r.workspace_id)) return true;
      orphaned++;
      return false;
    });

    for (let i = 0; i < keep.length; i += CHUNK * STMTS_PER_BATCH) {
      const slice = keep.slice(i, i + CHUNK * STMTS_PER_BATCH);
      const statements = [];

      for (let j = 0; j < slice.length; j += CHUNK) {
        const chunk = slice.slice(j, j + CHUNK);
        const args = [];
        for (const r of chunk) {
          args.push(
            r.id,
            r.workspace_id,
            r.action ?? "unknown",
            jsonOrNull(r.details),
            ts(r.timestamp)
          );
        }
        statements.push({
          sql:
            `insert or ignore into activity_logs (id, workspace_id, action, details, timestamp) values ` +
            chunk.map(() => "(?, ?, ?, ?, ?)").join(", "),
          args,
        });
      }

      if (statements.length) {
        await retry("turso batch", () => db.batch(statements, "write"));
      }
      inserted += slice.length;
    }

    const elapsed = (Date.now() - startedAt) / 1000;
    const rate = inserted / Math.max(elapsed, 0.001);
    const remaining = Math.max(total - already - inserted, 0);
    process.stdout.write(
      `\r  ${fmt(inserted)} inserted, ${fmt(orphaned)} skipped · ` +
        `${Math.round(rate)}/s · ~${Math.round(remaining / Math.max(rate, 1))}s left   `
    );
  }

  process.stdout.write("\n");
  console.log(
    `✔ activity_logs: ${fmt(inserted)} inserted` +
      (orphaned ? `, ${fmt(orphaned)} orphaned rows skipped` : "")
  );
}

// ------------------------------------------------------------------ main

async function verify() {
  const q = async (sql) => Number((await db.execute(sql)).rows[0].c);
  const [users, workspaces, logs, linked] = await Promise.all([
    q("select count(*) as c from users"),
    q("select count(*) as c from workspace"),
    q("select count(*) as c from activity_logs"),
    q("select count(*) as c from workspace where slack_user_id is not null"),
  ]);

  const range = (await db.execute(
    "select min(timestamp) as lo, max(timestamp) as hi from activity_logs"
  )).rows[0];

  console.log("\n── Turso now holds ──────────────────────────────");
  console.log(`  users           ${fmt(users)}`);
  console.log(`  workspace       ${fmt(workspaces)}  (${linked} Slack-linked)`);
  console.log(`  activity_logs   ${fmt(logs)}`);
  console.log(`  log range       ${range.lo} → ${range.hi}`);
}

async function main() {
  console.log(DRY ? "DRY RUN — no writes\n" : "Migrating Supabase → Turso\n");

  if (!LOGS_ONLY) {
    if (!DRY) await applySchema();
    console.log("\n▸ users");
    await migrateUsers();
    console.log("\n▸ workspaces");
    await migrateWorkspaces();
  }

  console.log("\n▸ activity_logs");
  await migrateActivityLogs();

  if (!DRY) await verify();
}

main().catch((err) => {
  console.error("\n✖ migration failed:", err);
  process.exit(1);
});
