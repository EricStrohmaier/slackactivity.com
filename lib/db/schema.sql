-- Slackactivity schema (Turso / libSQL).
--
-- Conventions:
--   * ids are UUID text (carried over verbatim from the old Supabase rows)
--   * booleans are INTEGER 0/1
--   * JSON columns are TEXT holding JSON
--   * timestamps are ISO-8601 UTC text, always 'YYYY-MM-DDTHH:MM:SS.sssZ'.
--     Fixed-width UTC text sorts and range-scans correctly as a string, and
--     substr(timestamp, 1, 13) / substr(timestamp, 1, 10) give free hour and
--     day buckets without any date function calls.

create table if not exists users (
  id            text primary key,
  email         text,
  full_name     text,
  avatar_url    text,
  created_at    text not null,
  -- bcrypt; null for Slack/Google-only accounts. Existing databases get this
  -- column from scripts/migrate-passwords.mjs (SQLite has no ADD COLUMN IF NOT EXISTS).
  password_hash text
);


create index if not exists users_email_idx on users (email);

create table if not exists workspace (
  id               text primary key,
  user_id          text not null references users (id) on delete cascade,
  team_id          text,
  team_name        text,
  -- Slack user ids are scoped to a workspace, so identity is (team_id,
  -- slack_user_id). This is what re-links a returning user to their existing
  -- account when they sign in with Slack.
  slack_user_id    text,
  slack_auth_token text,
  is_active        integer not null default 1,
  working_hours    text,
  enterprise       text,
  created_at       text not null
);

create index if not exists workspace_user_idx on workspace (user_id);
create index if not exists workspace_active_idx on workspace (is_active);
create unique index if not exists workspace_slack_identity_idx
  on workspace (team_id, slack_user_id)
  where team_id is not null and slack_user_id is not null;

create table if not exists activity_logs (
  id           integer primary key autoincrement,
  workspace_id text references workspace (id) on delete cascade,
  action       text not null,
  details      text,
  timestamp    text not null
);

-- Per-workspace history (dashboard stats) and global scans (admin, public stats).
create index if not exists activity_logs_ws_ts_idx on activity_logs (workspace_id, timestamp);
create index if not exists activity_logs_ts_idx on activity_logs (timestamp);

-- ------------------------------------------------------------------ rollups
--
-- activity_logs is append-only and grows by ~3k rows/day, so aggregating over
-- it directly meant scanning the whole table on every dashboard read. Turso
-- bills row *scans*, not rows returned, and a bare `count(*)` over ~800k rows
-- ran on every homepage cache miss — by far the largest cost in the app.
--
-- The two tables below hold those aggregates precomputed. Nothing writes to
-- them directly: the `activity_logs_rollup` trigger maintains them inside the
-- same transaction as the insert, so they cannot drift from the log.
--
-- Buckets are UTC hours ('YYYY-MM-DDTHH'), not days. SQLite has no timezone
-- database, and hours are the grain `foldHoursIntoLocalDays` needs to produce
-- DST-correct local days.

create table if not exists activity_rollup (
  workspace_id text not null references workspace (id) on delete cascade,
  hour         text not null,
  active       integer not null default 0,
  away         integer not null default 0,
  errors       integer not null default 0,
  deactivated  integer not null default 0,
  -- Newest log timestamp in this bucket, so "last seen" keeps full precision
  -- instead of being rounded down to the hour.
  last_log     text not null,
  primary key (workspace_id, hour)
) without rowid;

-- Covering for the global (all-workspace) reads: a WITHOUT ROWID index also
-- carries the primary key, so a 30-day range scan never touches the table.
create index if not exists activity_rollup_hour_idx
  on activity_rollup (hour, active, away, errors, deactivated);

-- Whole-table scalars, which no index can make cheap on activity_logs itself.
-- Values are text: 'logs_total' holds a number, 'first_log' / 'last_log' hold
-- ISO-8601 timestamps — fixed-width UTC text, so max() orders them correctly.
create table if not exists counters (
  key   text primary key,
  value text not null
) without rowid;

-- workspace_id is nullable, and a bucket is keyed by it, so orphan logs are
-- counted (below) but not bucketed.
create trigger if not exists activity_logs_rollup
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
end;

-- These are lifetime figures, deliberately monotonic: `logs_total` is "ticks
-- we have ever served" and `first_log` is "operating since", both shown on the
-- landing page. Neither is walked back when old rows are pruned out of
-- activity_logs or a workspace is deleted, so neither equals a live count(*).
create trigger if not exists activity_logs_counters
after insert on activity_logs
begin
  insert into counters (key, value) values ('logs_total', '1')
    on conflict (key) do update set value = cast(value as integer) + 1;

  insert into counters (key, value) values ('first_log', new.timestamp)
    on conflict (key) do update set value = min(value, excluded.value);

  insert into counters (key, value) values ('last_log', new.timestamp)
    on conflict (key) do update set value = max(value, excluded.value);
end;
