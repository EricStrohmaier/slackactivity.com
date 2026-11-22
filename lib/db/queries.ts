import type { InStatement } from "@libsql/client";
import { getDb, all, one, run, scalar, bool, json, isoNow, iso, hourKey } from "./client";
import {
  DEFAULT_WORKING_HOURS,
  type ActivityAction,
  type User,
  type Workspace,
  type WorkingHours,
} from "@/types/db";

// ---------------------------------------------------------------- row mapping

interface WorkspaceRow {
  id: string;
  user_id: string;
  team_id: string | null;
  team_name: string | null;
  slack_user_id: string | null;
  slack_auth_token: string | null;
  is_active: number;
  working_hours: string | null;
  created_at: string;
}

function toWorkspace(row: WorkspaceRow): Workspace {
  return {
    id: row.id,
    user_id: row.user_id,
    team_id: row.team_id,
    team_name: row.team_name,
    slack_user_id: row.slack_user_id,
    slack_auth_token: row.slack_auth_token,
    is_active: bool(row.is_active),
    working_hours: json<WorkingHours>(row.working_hours, DEFAULT_WORKING_HOURS),
    created_at: row.created_at,
  };
}

const WORKSPACE_COLS = `id, user_id, team_id, team_name, slack_user_id,
  slack_auth_token, is_active, working_hours, created_at`;

// ----------------------------------------------------------------------- users

export async function getUserById(id: string): Promise<User | null> {
  return one<User>(
    `select id, email, full_name, avatar_url, created_at
     from users where id = ?`,
    [id]
  );
}

/**
 * Used to re-link a pre-migration account. Workspaces migrated from Supabase
 * only carry a Slack identity if `auth.test` succeeded during the migration —
 * a token that was already revoked leaves `slack_user_id` null, so email is the
 * only thing tying that person to their existing rows when they sign in again.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return one<User>(
    `select id, email, full_name, avatar_url, created_at
     from users where email = ? order by created_at limit 1`,
    [email]
  );
}

export async function createUser(user: {
  id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
}): Promise<User> {
  await run(
    `insert into users (id, email, full_name, avatar_url, created_at)
     values (?, ?, ?, ?, ?)`,
    [
      user.id,
      user.email ?? null,
      user.full_name ?? null,
      user.avatar_url ?? null,
      isoNow(),
    ]
  );
  return (await getUserById(user.id))!;
}

/**
 * Refresh the profile fields we learn from Slack on each sign-in.
 *
 * Name and avatar track Slack, but email is only ever filled in, never
 * replaced: it is the fallback identity key in `getUserByEmail`, and someone
 * connecting a second workspace under a different address must not silently
 * repoint their account at that address.
 */
export async function backfillUserProfile(
  id: string,
  fields: { email?: string | null; full_name?: string | null; avatar_url?: string | null }
): Promise<void> {
  await run(
    `update users
        set email      = coalesce(email, ?),
            full_name  = coalesce(?, full_name),
            avatar_url = coalesce(?, avatar_url)
      where id = ?`,
    [fields.email ?? null, fields.full_name ?? null, fields.avatar_url ?? null, id]
  );
}

// ------------------------------------------------------------------ workspaces

export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  const rows = await all<WorkspaceRow>(
    `select ${WORKSPACE_COLS} from workspace
      where user_id = ? order by created_at`,
    [userId]
  );
  return rows.map(toWorkspace);
}

/** Every workspace the cron should tick. */
export async function getActiveWorkspaces(): Promise<Workspace[]> {
  const rows = await all<WorkspaceRow>(
    `select ${WORKSPACE_COLS} from workspace
      where is_active = 1 and slack_auth_token is not null`
  );
  return rows.map(toWorkspace);
}

export async function getWorkspaceForUser(
  workspaceId: string,
  userId: string
): Promise<Workspace | null> {
  const row = await one<WorkspaceRow>(
    `select ${WORKSPACE_COLS} from workspace where id = ? and user_id = ?`,
    [workspaceId, userId]
  );
  return row ? toWorkspace(row) : null;
}

/** Identity is (team_id, slack_user_id) — Slack user ids are per-workspace. */
export async function findWorkspaceBySlackIdentity(
  teamId: string,
  slackUserId: string
): Promise<Workspace | null> {
  const row = await one<WorkspaceRow>(
    `select ${WORKSPACE_COLS} from workspace
      where team_id = ? and slack_user_id = ?`,
    [teamId, slackUserId]
  );
  return row ? toWorkspace(row) : null;
}

/**
 * A migrated workspace for this team that never got a Slack user id, because
 * its token was already revoked when the migration ran `auth.test`.
 *
 * Scoped to a user id that has *already* been resolved (by session or by
 * Slack-verified email). Matching on team_id alone would be unsafe: a different
 * colleague from the same workspace would adopt someone else's account.
 */
export async function findUnlinkedWorkspaceForUser(
  userId: string,
  teamId: string
): Promise<Workspace | null> {
  const row = await one<WorkspaceRow>(
    `select ${WORKSPACE_COLS} from workspace
      where user_id = ? and team_id = ? and slack_user_id is null
      order by created_at limit 1`,
    [userId, teamId]
  );
  return row ? toWorkspace(row) : null;
}

/** Adopt a migrated workspace: attach the Slack identity and a fresh token. */
export async function linkWorkspaceToSlackUser(
  workspaceId: string,
  slackUserId: string,
  token: string,
  teamName: string | null
): Promise<void> {
  await run(
    `update workspace
        set slack_user_id = ?, slack_auth_token = ?,
            team_name = coalesce(?, team_name), is_active = 1
      where id = ?`,
    [slackUserId, token, teamName, workspaceId]
  );
}

export async function createWorkspace(ws: {
  id: string;
  user_id: string;
  team_id: string | null;
  team_name: string | null;
  slack_user_id: string | null;
  slack_auth_token: string;
  working_hours?: WorkingHours;
}): Promise<Workspace> {
  await run(
    `insert into workspace
       (id, user_id, team_id, team_name, slack_user_id, slack_auth_token,
        is_active, working_hours, created_at)
     values (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
    [
      ws.id,
      ws.user_id,
      ws.team_id,
      ws.team_name,
      ws.slack_user_id,
      ws.slack_auth_token,
      JSON.stringify(ws.working_hours ?? DEFAULT_WORKING_HOURS),
      isoNow(),
    ]
  );
  return (await getWorkspaceForUser(ws.id, ws.user_id))!;
}

/** Re-connecting an existing workspace: refresh the token and reactivate it. */
export async function refreshWorkspaceToken(
  workspaceId: string,
  token: string,
  teamName: string | null
): Promise<void> {
  await run(
    `update workspace
        set slack_auth_token = ?, team_name = coalesce(?, team_name), is_active = 1
      where id = ?`,
    [token, teamName, workspaceId]
  );
}

export async function updateWorkspaceSettings(
  workspaceId: string,
  userId: string,
  fields: { working_hours: WorkingHours; is_active: boolean }
): Promise<void> {
  await run(
    `update workspace set working_hours = ?, is_active = ?
      where id = ? and user_id = ?`,
    [
      JSON.stringify(fields.working_hours),
      fields.is_active ? 1 : 0,
      workspaceId,
      userId,
    ]
  );
}

export async function deactivateWorkspace(workspaceId: string): Promise<void> {
  await run(`update workspace set is_active = 0 where id = ?`, [workspaceId]);
}

export async function deleteWorkspace(
  workspaceId: string,
  userId: string
): Promise<void> {
  await run(`delete from workspace where id = ? and user_id = ?`, [
    workspaceId,
    userId,
  ]);
}

// --------------------------------------------------------------- activity logs

/**
 * One log row. The `activity_logs_rollup` / `activity_logs_counters` triggers
 * fold it into `activity_rollup` and `counters` in the same transaction, so
 * nothing here has to maintain the aggregates by hand.
 *
 * `details` is for the exception paths only. A routine tick used to store the
 * workspace's whole working-hours object plus the day and hour it was derived
 * from — ~145 bytes per row, every 5 minutes, all of it either already on the
 * workspace row or recoverable from `timestamp`.
 */
export async function logActivity(
  workspaceId: string,
  action: ActivityAction,
  details?: unknown
): Promise<void> {
  await run(
    `insert into activity_logs (workspace_id, action, details, timestamp)
     values (?, ?, ?, ?)`,
    [
      workspaceId,
      action,
      details === undefined ? null : JSON.stringify(details),
      isoNow(),
    ]
  );
}

export interface TickOutcome {
  workspaceId: string;
  action: ActivityAction;
  details?: unknown;
  /** Flip `is_active` off in the same transaction (dead Slack token). */
  deactivate?: boolean;
}

/**
 * Persist one cron tick in a single round trip.
 *
 * A tick used to issue one INSERT per workspace, plus an UPDATE for each dead
 * token, so it cost N sequential round trips to Turso and queued N write
 * transactions on the primary. `batch()` sends them as one implicit
 * transaction: one round trip, all-or-nothing.
 *
 * Losing a whole tick to a failed batch is the right trade. The next tick five
 * minutes later re-derives the same presence state from scratch, whereas a
 * half-applied tick could deactivate a workspace with no log saying why.
 *
 * `prune` is optional log retention, bounded per call so the delete can never
 * outgrow the request budget. The rollup keeps the aggregates the UI reads, so
 * pruned history stays visible in every chart.
 */
export async function commitTick(
  outcomes: TickOutcome[],
  prune?: { before: string; limit: number }
): Promise<void> {
  const statements: InStatement[] = [];
  // One timestamp for the whole tick: these events *are* simultaneous, and it
  // keeps a tick from straddling two hour buckets.
  const timestamp = isoNow();

  for (const outcome of outcomes) {
    if (outcome.deactivate) {
      statements.push({
        sql: `update workspace set is_active = 0 where id = ?`,
        args: [outcome.workspaceId],
      });
    }
    statements.push({
      sql: `insert into activity_logs (workspace_id, action, details, timestamp)
            values (?, ?, ?, ?)`,
      args: [
        outcome.workspaceId,
        outcome.action,
        outcome.details === undefined ? null : JSON.stringify(outcome.details),
        timestamp,
      ],
    });
  }

  if (prune) {
    // The subquery walks activity_logs_ts_idx and stops at `limit`, so the
    // cost is bounded whether there are 10 stale rows or 700,000.
    statements.push({
      sql: `delete from activity_logs
             where id in (select id from activity_logs
                           where timestamp < ? limit ?)`,
      args: [prune.before, prune.limit],
    });
  }

  if (statements.length > 0) await getDb().batch(statements, "write");
}

/**
 * Active/away tick counts bucketed by UTC hour, read straight from
 * `activity_rollup`.
 *
 * SQLite has no timezone database, so we never bucket by local day in SQL.
 * Hour buckets are cheap (<= 24 rows/day/workspace) and the caller folds them
 * into local days with Intl, which is fully DST-correct.
 */
export interface HourBucket {
  hour: string; // "YYYY-MM-DDTHH" (UTC)
  active: number;
  away: number;
}

export async function getHourlyActivity(
  workspaceId: string,
  start: Date,
  end: Date
): Promise<HourBucket[]> {
  const rows = await all<{ hour: string; active: number; away: number }>(
    `select hour, active, away
       from activity_rollup
      where workspace_id = ? and hour >= ? and hour <= ?
      order by hour`,
    [workspaceId, hourKey(start), hourKey(end)]
  );
  return rows.map((r) => ({
    hour: r.hour,
    active: Number(r.active ?? 0),
    away: Number(r.away ?? 0),
  }));
}

/** Fold UTC hour buckets into calendar days in an IANA timezone. */
export function foldHoursIntoLocalDays(
  buckets: HourBucket[],
  timezone: string
): { day: string; active: number; away: number }[] {
  let fmt: Intl.DateTimeFormat;
  try {
    // en-CA formats as YYYY-MM-DD.
    fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  const byDay = new Map<string, { active: number; away: number }>();
  for (const b of buckets) {
    const day = fmt.format(new Date(`${b.hour}:00:00.000Z`));
    const acc = byDay.get(day) ?? { active: 0, away: 0 };
    acc.active += b.active;
    acc.away += b.away;
    byDay.set(day, acc);
  }

  return [...byDay.entries()]
    .map(([day, v]) => ({ day, ...v }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

// ---------------------------------------------------------------------- admin

export interface OverviewStats {
  total_users: number;
  total_workspaces: number;
  active_workspaces: number;
  total_logs: number;
  logs_30d: number;
  first_log: string | null;
  last_log: string | null;
  signups_30d: number;
}

/**
 * Site-wide totals for the admin page and the public landing-page stats.
 *
 * Every figure here used to come off `activity_logs`, and `count(*)` with no
 * WHERE meant scanning the entire table — ~830k row *scans*, which is what
 * Turso bills, on every uncached call. The lifetime scalars now come from
 * `counters` (3 rows) and the 30-day window from `activity_rollup` (~8k
 * covering-index entries instead of ~95k rows).
 */
export async function getOverviewStats(): Promise<OverviewStats> {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  const [totals, counters, logs30d] = await Promise.all([
    one<{
      total_users: number;
      total_workspaces: number;
      active_workspaces: number;
      signups_30d: number;
    }>(
      `select
         (select count(*) from users) as total_users,
         (select count(*) from workspace) as total_workspaces,
         (select count(*) from workspace where is_active = 1) as active_workspaces,
         (select count(*) from users where created_at >= ?) as signups_30d`,
      [iso(thirtyDaysAgo)]
    ),
    all<{ key: string; value: string }>(`select key, value from counters`),
    scalar(
      `select coalesce(sum(active + away + errors + deactivated), 0)
         from activity_rollup where hour >= ?`,
      [hourKey(thirtyDaysAgo)]
    ),
  ]);

  const counter = new Map(counters.map((row) => [row.key, row.value]));

  return {
    total_users: Number(totals?.total_users ?? 0),
    total_workspaces: Number(totals?.total_workspaces ?? 0),
    active_workspaces: Number(totals?.active_workspaces ?? 0),
    signups_30d: Number(totals?.signups_30d ?? 0),
    total_logs: Number(counter.get("logs_total") ?? 0),
    logs_30d: logs30d,
    first_log: counter.get("first_log") ?? null,
    last_log: counter.get("last_log") ?? null,
  };
}

export interface DailyLogRow {
  day: string;
  set_active: number;
  set_away: number;
  errors: number;
  deactivated: number;
  total: number;
}

/**
 * Global daily log volume by action, bucketed by UTC day.
 *
 * Rolls the hour buckets up one more level. `activity_rollup_hour_idx` carries
 * every column this reads, so a 30-day window is a covering-index range scan
 * over ~8k entries rather than ~95k log rows.
 */
export async function getDailyLogs(
  start: Date,
  end: Date
): Promise<DailyLogRow[]> {
  const rows = await all<Record<string, unknown>>(
    `select substr(hour, 1, 10) as day,
            sum(active)      as set_active,
            sum(away)        as set_away,
            sum(errors)      as errors,
            sum(deactivated) as deactivated,
            sum(active + away + errors + deactivated) as total
       from activity_rollup
      where hour >= ? and hour <= ?
      group by 1
      order by 1`,
    [hourKey(start), hourKey(end)]
  );

  return rows.map((r) => ({
    day: String(r.day),
    set_active: Number(r.set_active ?? 0),
    set_away: Number(r.set_away ?? 0),
    errors: Number(r.errors ?? 0),
    deactivated: Number(r.deactivated ?? 0),
    total: Number(r.total ?? 0),
  }));
}

export interface AdminWorkspaceRow {
  workspace_id: string;
  team_name: string | null;
  user_email: string | null;
  is_active: boolean;
  created_at: string;
  last_log: string | null;
  active_ticks: number;
  total_ticks: number;
  active_share: number | null;
}

/**
 * Per-workspace tick totals for the admin table.
 *
 * `last_log` keeps full timestamp precision because each rollup bucket carries
 * the newest log it absorbed, so joining against the hour grain doesn't round
 * "last seen" down to the hour.
 */
export async function getAdminWorkspaceStats(
  start: Date,
  end: Date
): Promise<AdminWorkspaceRow[]> {
  const rows = await all<Record<string, unknown>>(
    `select w.id         as workspace_id,
            w.team_name  as team_name,
            u.email      as user_email,
            w.is_active  as is_active,
            w.created_at as created_at,
            max(r.last_log) as last_log,
            coalesce(sum(r.active), 0)            as active_ticks,
            coalesce(sum(r.active + r.away), 0)   as total_ticks
       from workspace w
       left join users u on u.id = w.user_id
       left join activity_rollup r
              on r.workspace_id = w.id
             and r.hour >= ? and r.hour <= ?
      group by w.id, w.team_name, u.email, w.is_active, w.created_at
      order by total_ticks desc`,
    [hourKey(start), hourKey(end)]
  );

  return rows.map((r) => {
    const active = Number(r.active_ticks ?? 0);
    const total = Number(r.total_ticks ?? 0);
    return {
      workspace_id: String(r.workspace_id),
      team_name: (r.team_name as string) ?? null,
      user_email: (r.user_email as string) ?? null,
      is_active: bool(r.is_active),
      created_at: String(r.created_at),
      last_log: (r.last_log as string) ?? null,
      active_ticks: active,
      total_ticks: total,
      active_share: total > 0 ? Math.round((active / total) * 1000) / 10 : null,
    };
  });
}
