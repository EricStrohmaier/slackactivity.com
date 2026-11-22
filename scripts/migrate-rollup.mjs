#!/usr/bin/env node
/**
 * One-shot migration: build the activity_rollup / counters aggregates.
 *
 *   node scripts/migrate-rollup.mjs              # create + backfill
 *   node scripts/migrate-rollup.mjs --dry        # report only, no writes
 *   node scripts/migrate-rollup.mjs --verify     # compare rollup vs raw logs
 *   node scripts/migrate-rollup.mjs --prune=90   # also delete logs older than 90d
 *   node scripts/migrate-rollup.mjs --force      # re-run a backfill that already ran
 *
 * Ordering matters. The trigger is installed in the same transaction that
 * reads max(id), so every row inserted from that moment on is rolled up by the
 * trigger and every row at or below that id is covered by the backfill --
 * a concurrent cron tick can't slip through the gap between the two.
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

for (const line of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const URL = process.env.TURSO_DATABASE_URL;
const TOKEN = process.env.TURSO_AUTH_TOKEN;
if (!URL) {
  console.error("Missing TURSO_DATABASE_URL in .env.local");
  process.exit(1);
}

const DRY = process.argv.includes("--dry");
const FORCE = process.argv.includes("--force");
const VERIFY_ONLY = process.argv.includes("--verify");
const PRUNE_ARG = process.argv.find((a) => a.startsWith("--prune="));
const PRUNE_DAYS = PRUNE_ARG ? Number(PRUNE_ARG.split("=")[1]) : 0;

if (PRUNE_ARG && (!Number.isFinite(PRUNE_DAYS) || PRUNE_DAYS < 1)) {
  console.error("--prune= needs a positive number of days");
  process.exit(1);
}

const db = createClient({ url: URL, authToken: TOKEN });
const q = async (sql, args = []) => (await db.execute({ sql, args })).rows;
const fmt = (n) => Number(n).toLocaleString("en-US");

// Trigger bodies, kept identical to lib/db/schema.sql.
const TRIGGERS = [
  `create trigger if not exists activity_logs_rollup
   after insert on activity_logs
   when new.workspace_id is not null
   begin
     insert into activity_rollup
       (workspace_id, hour, active, away, errors, deactivated, last_log)
     values (
       new.workspace_id,
       substr(new.timestamp, 1, 13),
       new.action = 'set_active',
       new.action = 'set_away',
       new.action = 'error',
       new.action = 'deactivated',
       new.timestamp
     )
     on conflict (workspace_id, hour) do update set
       active      = active      + excluded.active,
       away        = away        + excluded.away,
       errors      = errors      + excluded.errors,
       deactivated = deactivated + excluded.deactivated,
       last_log    = max(last_log, excluded.last_log);
   end`,
  `create trigger if not exists activity_logs_counters
   after insert on activity_logs
   begin
     insert into counters (key, value) values ('logs_total', '1')
       on conflict (key) do update set value = cast(value as integer) + 1;

     insert into counters (key, value) values ('first_log', new.timestamp)
       on conflict (key) do update set value = min(value, excluded.value);

     insert into counters (key, value) values ('last_log', new.timestamp)
       on conflict (key) do update set value = max(value, excluded.value);
   end`,
];

const SCHEMA = [
  `create table if not exists activity_rollup (
     workspace_id text not null references workspace (id) on delete cascade,
     hour         text not null,
     active       integer not null default 0,
     away         integer not null default 0,
     errors       integer not null default 0,
     deactivated  integer not null default 0,
     last_log     text not null,
     primary key (workspace_id, hour)
   ) without rowid`,
  `create index if not exists activity_rollup_hour_idx
     on activity_rollup (hour, active, away, errors, deactivated)`,
  `create table if not exists counters (
     key   text primary key,
     value text not null
   ) without rowid`,
];

// ------------------------------------------------------------------- verify

async function verify() {
  console.log("── verifying rollup against activity_logs ──");

  // Compare only hours strictly newer than the oldest surviving log. Pruning
  // removes raw rows but deliberately leaves the rollup intact, and it lands
  // mid-hour, so the oldest bucket is the one place the two legitimately
  // disagree. Excluding it keeps this check exact before *and* after a prune.
  const [{ edge }] = await q(
    `select substr(min(timestamp), 1, 13) edge from activity_logs`
  );
  if (edge === null) {
    console.log("  activity_logs is empty — nothing to compare.");
    return true;
  }

  const [raw] = await q(
    `select count(*) n,
            sum(action = 'set_active')  active,
            sum(action = 'set_away')    away,
            sum(action = 'error')       errors,
            sum(action = 'deactivated') deactivated,
            max(timestamp)              last_log
       from activity_logs
      where workspace_id is not null and substr(timestamp, 1, 13) > ?`,
    [edge]
  );

  const [roll] = await q(
    `select coalesce(sum(active), 0)      active,
            coalesce(sum(away), 0)        away,
            coalesce(sum(errors), 0)      errors,
            coalesce(sum(deactivated), 0) deactivated,
            max(last_log)                 last_log,
            count(*)                      buckets
       from activity_rollup where hour > ?`,
    [edge]
  );

  let ok = true;
  for (const [label, a, b] of [
    ["set_active", raw.active, roll.active],
    ["set_away", raw.away, roll.away],
    ["error", raw.errors, roll.errors],
    ["deactivated", raw.deactivated, roll.deactivated],
    ["last_log", raw.last_log, roll.last_log],
  ]) {
    const match = String(a) === String(b);
    ok &&= match;
    console.log(`  ${match ? "✔" : "✘"} ${label.padEnd(12)} raw=${a}  rollup=${b}`);
  }
  console.log(`  (compared ${fmt(raw.n)} raw rows over ${fmt(roll.buckets)} buckets, after ${edge})`);

  // Lifetime figures. Monotonic by design, so they are reported, not asserted:
  // logs_total drifts above count(*) once rows are pruned or a workspace is
  // deleted, which is exactly what the landing page wants.
  const counters = Object.fromEntries(
    (await q(`select key, value from counters`)).map((r) => [r.key, r.value])
  );
  const [{ all_logs }] = await q(`select count(*) all_logs from activity_logs`);
  console.log(
    `  · logs_total  ${fmt(counters.logs_total)} lifetime (${fmt(all_logs)} rows retained)`
  );
  console.log(`  · first_log   ${counters.first_log}`);
  console.log(`  · last_log    ${counters.last_log}`);

  return ok;
}

// -------------------------------------------------------------------- prune

async function prune(days) {
  const cutoff = new Date(Date.now() - days * 864e5).toISOString();
  const [{ n }] = await q(
    `select count(*) n from activity_logs where timestamp < ?`,
    [cutoff]
  );

  if (Number(n) === 0) {
    console.log(`\nNothing older than ${days}d to prune.`);
    return;
  }
  console.log(`\n── pruning ${fmt(n)} rows older than ${cutoff} ──`);
  if (DRY) return console.log("  (dry run, skipped)");

  // Bounded batches: one big DELETE would hold a long write transaction and
  // can exceed the request timeout.
  let removed = 0;
  for (;;) {
    const rs = await db.execute({
      sql: `delete from activity_logs where id in (
              select id from activity_logs where timestamp < ? limit 5000)`,
      args: [cutoff],
    });
    if (rs.rowsAffected === 0) break;
    removed += rs.rowsAffected;
    process.stdout.write(`\r  deleted ${fmt(removed)} / ${fmt(n)}`);
  }
  console.log(`\n  ✔ pruned ${fmt(removed)} rows`);
  console.log(
    "  note: Turso disables VACUUM, so freed pages are reused rather than\n" +
      "  returned — reported storage shrinks gradually, not immediately."
  );
}

// --------------------------------------------------------------------- main

if (VERIFY_ONLY) {
  const ok = await verify();
  process.exit(ok ? 0 : 1);
}

console.log(`▸ ${URL}\n`);

const [before] = await q(`select
    (select count(*) from activity_logs) logs,
    (select count(*) from workspace)     workspaces`);
console.log(`activity_logs: ${fmt(before.logs)} rows, ${before.workspaces} workspaces`);

// Already backfilled?
const existing = await q(
  `select name from sqlite_master where name in ('activity_rollup', 'counters')`
);
if (existing.length === 2 && !FORCE) {
  const [{ n }] = await q(`select count(*) n from activity_rollup`);
  if (Number(n) > 0) {
    console.log(
      `\nactivity_rollup already holds ${fmt(n)} buckets — backfill has run.\n` +
        "Use --verify to check it, or --force to rebuild from scratch."
    );
    if (PRUNE_DAYS) await prune(PRUNE_DAYS);
    process.exit(0);
  }
}

if (DRY) {
  console.log("\n(dry run — no writes)");
  console.log("Would create activity_rollup + counters, install the trigger,");
  console.log(`and roll up ${fmt(before.logs)} rows.`);
  if (PRUNE_DAYS) await prune(PRUNE_DAYS);
  process.exit(0);
}

console.log("\n── creating tables ──");
for (const sql of SCHEMA) await db.execute(sql);
console.log("  ✔ activity_rollup, counters");

if (FORCE) {
  await db.execute(`drop trigger if exists activity_logs_rollup`);
  await db.execute(`drop trigger if exists activity_logs_counters`);
  await db.execute(`delete from activity_rollup`);
  await db.execute(`delete from counters`);
  console.log("  ✔ cleared previous rollup (--force)");
}

// Read the high-water mark and install the triggers atomically, so no insert
// lands in the gap between "backfill covers up to here" and "triggers are live".
console.log("\n── installing triggers ──");
const boundary = await db.batch(
  [`select coalesce(max(id), 0) as max_id from activity_logs`, ...TRIGGERS],
  "write"
);
const maxId = Number(boundary[0].rows[0].max_id);
console.log(`  ✔ triggers live; backfilling rows with id <= ${fmt(maxId)}`);

console.log("\n── backfilling ──");
const t0 = Date.now();
await db.batch(
  [
    {
      sql: `insert into activity_rollup
              (workspace_id, hour, active, away, errors, deactivated, last_log)
            select workspace_id,
                   substr(timestamp, 1, 13),
                   sum(action = 'set_active'),
                   sum(action = 'set_away'),
                   sum(action = 'error'),
                   sum(action = 'deactivated'),
                   max(timestamp)
              from activity_logs
             where id <= ? and workspace_id is not null
             group by 1, 2
            on conflict (workspace_id, hour) do update set
              active      = active      + excluded.active,
              away        = away        + excluded.away,
              errors      = errors      + excluded.errors,
              deactivated = deactivated + excluded.deactivated,
              last_log    = max(last_log, excluded.last_log)`,
      args: [maxId],
    },
    {
      sql: `insert into counters (key, value)
            select 'logs_total', count(*) from activity_logs where id <= ?
            on conflict (key) do update set
              value = cast(value as integer) + cast(excluded.value as integer)`,
      args: [maxId],
    },
    {
      sql: `insert into counters (key, value)
            select 'first_log', min(timestamp) from activity_logs where id <= ?
            on conflict (key) do update set value = min(value, excluded.value)`,
      args: [maxId],
    },
    {
      sql: `insert into counters (key, value)
            select 'last_log', max(timestamp) from activity_logs where id <= ?
            on conflict (key) do update set value = max(value, excluded.value)`,
      args: [maxId],
    },
  ],
  "write"
);
console.log(`  ✔ done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

console.log();
const ok = await verify();

if (PRUNE_DAYS) {
  if (!ok) {
    console.error("\n✘ rollup does not match the log — refusing to prune.");
    process.exit(1);
  }
  await prune(PRUNE_DAYS);
}

process.exit(ok ? 0 : 1);
