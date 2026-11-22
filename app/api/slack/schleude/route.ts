import { NextRequest } from "next/server";
import {
  commitTick,
  getActiveWorkspaces,
  type TickOutcome,
} from "@/lib/db/queries";
import { iso } from "@/lib/db/client";
import { isWithinWorkingHours, localNow } from "@/lib/workingHours";
import { slackClient } from "@/lib/slack";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Slack errors that mean the token will never work again. */
const DEAD_TOKEN = new Set([
  "token_revoked",
  "invalid_auth",
  "account_inactive",
  "token_expired",
]);

/**
 * Raw-log retention, in days. Unset or 0 keeps everything forever.
 *
 * `activity_rollup` holds every aggregate the dashboards read, so pruning
 * costs no visible history — it only drops the per-tick rows behind it.
 */
const RETENTION_DAYS = Number(process.env.ACTIVITY_LOG_RETENTION_DAYS ?? 0);

/**
 * Rows to prune per tick. At 288 ticks/day this clears ~575k rows/day, so any
 * backlog drains in a couple of days and steady state is a no-op.
 */
const PRUNE_PER_TICK = 2000;

/** Slack calls in flight at once. Keeps a growing user list from bursting. */
const CONCURRENCY = 8;

/**
 * Stop *starting* Slack calls this long into the tick. A call already running
 * is capped by SLACK_TIMEOUT_MS (plus one quick retry), and the DB commit by
 * its own timeout, so the whole request stays well inside `maxDuration`.
 * Workspaces not reached are simply picked up by the next tick.
 */
const START_DEADLINE_MS = 30_000;

/** Run `fn` over `items` with at most `limit` in flight; order is preserved. */
async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker)
  );
  return out;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Presence cron. Called every ~5 minutes with ?secret=SLACK_SCHEDULE_SECRET.
 * Each tick sets every active workspace to "auto" or "away" depending on
 * whether the workspace's local time falls inside its configured hours, and
 * records one activity_logs row (which is what the stats pages aggregate).
 *
 * Slack is talked to with bounded concurrency and per-call timeouts; the
 * database is touched exactly once, at the end, in a single batched
 * transaction. See START_DEADLINE_MS for how the tick stays time-bounded.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.SLACK_SCHEDULE_SECRET;
  // An unset/empty secret must not turn `?secret=` into a valid credential.
  if (!secret || request.nextUrl.searchParams.get("secret") !== secret) {
    return json({ message: "Unauthorized" }, 401);
  }

  const workspaces = await getActiveWorkspaces();
  if (workspaces.length === 0) {
    return json({ message: "No active workspaces", results: [] });
  }

  const startedAt = Date.now();
  const ticks = await mapPool(workspaces, CONCURRENCY, async (workspace) => {
    if (Date.now() - startedAt > START_DEADLINE_MS) {
      // Out of time this tick: no Slack call, no log row.
      return {
        result: { id: workspace.id, status: "skipped" },
        outcome: null,
      };
    }

    const workHours = workspace.working_hours;
    const { day, hour } = localNow(workHours?.timezone);
    const shouldBeActive = isWithinWorkingHours(workHours, day, hour);
    const action = shouldBeActive ? "set_active" : "set_away";

    try {
      const slack = slackClient(workspace.slack_auth_token!);
      await slack.users.setPresence({
        presence: shouldBeActive ? "auto" : "away",
      });
    } catch (err: any) {
      const slackError: string | undefined = err?.data?.error;
      console.error(
        `Slack error for ${workspace.id} (${workspace.team_name}): ${slackError ?? err?.message}`
      );

      if (slackError && DEAD_TOKEN.has(slackError)) {
        // Stop retrying a token that can't recover. The user reconnects by
        // signing in with Slack again, which refreshes the token in place.
        return {
          result: { id: workspace.id, status: "deactivated", error: slackError },
          outcome: {
            workspaceId: workspace.id,
            action: "deactivated",
            details: { message: `Slack token invalid (${slackError})` },
            deactivate: true,
          } satisfies TickOutcome,
        };
      }

      return {
        result: { id: workspace.id, status: "error", error: slackError },
        outcome: {
          workspaceId: workspace.id,
          action: "error",
          details: { message: `Slack API error: ${slackError ?? err?.message}` },
        } satisfies TickOutcome,
      };
    }

    // No `details` on the happy path: the working hours are already on the
    // workspace row, and day/hour are recoverable from the timestamp.
    return {
      result: { id: workspace.id, status: "success", action },
      outcome: { workspaceId: workspace.id, action } satisfies TickOutcome,
    };
  });

  await commitTick(
    ticks.flatMap((tick) => (tick.outcome ? [tick.outcome] : [])),
    RETENTION_DAYS > 0
      ? {
          before: iso(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000),
          limit: PRUNE_PER_TICK,
        }
      : undefined
  );

  const results = ticks.map((tick) => tick.result);
  return json({
    message: "Slack presence update complete",
    processed: results.length,
    results,
  });
}
