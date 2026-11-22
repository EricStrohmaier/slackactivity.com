#!/usr/bin/env node
/**
 * Production health snapshot for the weekly check (read-only).
 *
 *   node scripts/weekly-check.mjs [--days=7]
 *
 * Prints JSON: public endpoints, presence-cron ticks from Turso (expected
 * 288/day), Slack errors and deactivations, sign-ups and new workspaces, and,
 * when COOLIFY_* is set in .env.local, recent deployments, cron-task runs and
 * the app status. Changes nothing anywhere.
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const DAYS = Number(process.argv.find((a) => a.startsWith("--days="))?.split("=")[1] ?? 7);
const SITE = "https://slackactivity.com";
const since = new Date(Date.now() - DAYS * 86_400_000).toISOString();
const out = { checkedAt: new Date().toISOString(), windowDays: DAYS, since };

async function timed(url, init = {}) {
  const t = Date.now();
  try {
    const r = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15_000), ...init });
    return { status: r.status, ms: Date.now() - t };
  } catch (e) {
    return { error: String(e?.cause?.code ?? e?.message ?? e), ms: Date.now() - t };
  }
}

// 1. Public endpoints (no secrets sent).
out.endpoints = {
  home: await timed(`${SITE}/`),
  ping: await timed(`${SITE}/api/ping`),
  signin: await timed(`${SITE}/signin`),
  cronRejectsNoSecret: await timed(`${SITE}/api/slack/schleude`), // expect 401
  hubRejectsUnsigned: await timed(`${SITE}/api/hub/health`), // expect 401
};

// 2. Turso: cron ticks and outcomes.
const db = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const rows = async (sql, args = []) => (await db.execute({ sql, args })).rows.map((r) => ({ ...r }));
const scalar = async (sql, args = []) => Number(Object.values((await rows(sql, args))[0] ?? { v: 0 })[0] ?? 0);

out.cron = {
  ticksPerDay: await rows(
    // A tick = a 5-minute slot with any activity (pre-cutover rows each had
    // their own timestamp, so distinct timestamps over-count). Expect ~288/day.
    `select substr(timestamp,1,10) as day,
            count(distinct substr(timestamp,1,14) || (cast(substr(timestamp,15,2) as integer) / 5)) as ticks,
            sum(action='set_active') as active, sum(action='set_away') as away,
            sum(action='error') as errors, sum(action='deactivated') as deactivated
       from activity_logs where timestamp >= ? group by day order by day`,
    [since]
  ),
  lastTick: (await rows(`select max(timestamp) as at from activity_logs`))[0]?.at ?? null,
  activeWorkspaces: await scalar(`select count(*) from workspace where is_active = 1 and slack_auth_token is not null`),
  recentErrors: await rows(
    `select l.timestamp, l.action, w.team_name, l.details from activity_logs l
       join workspace w on w.id = l.workspace_id
      where l.timestamp >= ? and l.action in ('error','deactivated')
      order by l.timestamp desc limit 15`,
    [since]
  ),
};
out.cron.minutesSinceLastTick = out.cron.lastTick
  ? Math.round((Date.now() - new Date(out.cron.lastTick).getTime()) / 60_000)
  : null;

out.growth = {
  signups: await scalar(`select count(*) from users where created_at >= ?`, [since]),
  workspacesConnected: await scalar(`select count(*) from workspace where created_at >= ?`, [since]),
  totalUsers: await scalar(`select count(*) from users`),
};

// 3. Coolify (optional).
const C = process.env.COOLIFY_API_URL?.replace(/\/+$/, "");
const CT = process.env.COOLIFY_API_TOKEN;
if (C && CT) {
  const api = async (path) => {
    try {
      const r = await fetch(`${C}/api/v1/${path}`, {
        headers: { Authorization: `Bearer ${CT}`, Accept: "application/json" },
        signal: AbortSignal.timeout(15_000),
      });
      return r.ok ? r.json() : { error: `HTTP ${r.status}` };
    } catch (e) {
      return { error: String(e?.message ?? e) };
    }
  };
  const app = await api(`applications/${process.env.COOLIFY_APP_UUID}`);
  const deps = await api(`deployments/applications/${process.env.COOLIFY_APP_UUID}?take=10`);
  const runs = await api(
    `applications/${process.env.COOLIFY_APP_UUID}/scheduled-tasks/${process.env.COOLIFY_TASK_UUID}/executions`
  );
  const depList = Array.isArray(deps) ? deps : deps?.deployments ?? [];
  const runList = Array.isArray(runs) ? runs : [];
  out.coolify = {
    appStatus: app?.status ?? app?.error,
    branch: app?.git_branch,
    commit: depList.find((d) => d.status === "finished")?.commit?.slice(0, 7) ?? null,
    deployments: depList
      .filter((d) => d.created_at >= since.slice(0, 10))
      .map((d) => ({ at: d.created_at, status: d.status, commit: (d.commit ?? "").slice(0, 7) })),
    cronRuns: {
      total: runList.filter((e) => e.created_at >= since).length,
      failed: runList.filter((e) => e.created_at >= since && e.status !== "success").length,
      lastFailures: runList
        .filter((e) => e.status !== "success")
        .slice(0, 5)
        .map((e) => ({ at: e.created_at, status: e.status, message: (e.message ?? "").slice(0, 300) })),
    },
  };
} else {
  out.coolify = { skipped: "COOLIFY_API_URL / COOLIFY_API_TOKEN not set" };
}

console.log(JSON.stringify(out, null, 2));
