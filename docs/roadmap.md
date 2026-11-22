# Roadmap

Written 2026-08-11. Ordered by return on effort, not by appeal.

## The evidence this is based on

Pulled from production (16 users — directional, not statistical):

| Observation | Number |
| --- | --- |
| Workspaces whose Slack token was revoked and silently stopped working | **5 of 16 (31%)** |
| `deactivated` events, most recent 29 Jul 2026 | 4 |
| Users with more than one workspace | **0 of 16** |
| Workspaces still on the `UTC` default, i.e. schedule firing at the wrong hours | 3 |
| Workspaces green >75% of the time (implausible presence) | 2 (92%, 79%) |

Two conclusions drive the ordering below:

1. **A third of installs die silently.** Nobody is told. Driving SEO traffic into
   this fills a leaky bucket faster, so retention comes first.
2. **Nobody uses multi-workspace**, which is the headline differentiator on the
   marketing pages. Either the freelancer/agency audience has not arrived yet
   (plausible at ~3 organic visits/month) or the second-workspace flow is not
   discoverable. Re-check after the SEO work lands before investing further.

---

## Phase 1 — Stop the leak

Nothing here adds a capability. All three make existing behaviour visible.

### 1.1 Dashboard health banner
**Problem:** when a token is revoked the cron correctly deactivates the workspace
(`DEAD_TOKEN` in `app/api/slack/schleude/route.ts`) — and the user finds out
never. Five people are in that state right now.

**Change:** on `/dashboard`, per workspace, show last successful tick and state:
- green — "Active · last update 3 minutes ago"
- amber — "Paused by you"
- red — "Stopped on 29 Jul · Slack revoked access — [Reconnect]"

`last_log` per workspace already exists in `activity_rollup`, so this is a read
of data we have. The Reconnect button is just `/api/slack/auth` — the existing
flow already refreshes the token in place and reactivates the row
(`refreshWorkspaceToken`), so no new backend work.

**Effort:** hours. **Files:** `app/dashboard/page.tsx`,
`components/app/dashboard/shared.tsx`, one query in `lib/db/queries.ts`.

**Worked if:** reconnects happen without anyone emailing support. Watch the
`deactivated` → next `set_active` gap per workspace; today it is unbounded.

### 1.2 Token-expiry email
**Problem:** 1.1 only helps people who open the dashboard. Nobody opens a
dashboard for a tool whose entire promise is that you forget about it.

**Change:** when the cron deactivates a workspace, send one email: what stopped,
when, and a reconnect link. Once per event, never repeated.

**Watch out:**
- Needs an email sender again — `resend` was removed as unused. `RESEND_API_KEY`
  is still in `.env.local`.
- `users.email` is nullable. A workspace can withhold email, and the five already
  broken predate the `users:read.email` scope. Some of them cannot be emailed at
  all; those depend on 1.1.
- Send from the cron path, guarded so a retry cannot double-send.

**Effort:** half a day. **Worked if:** reconnect rate after a `deactivated` event
goes above ~50% within a week.

### 1.3 Timezone warning
**Problem:** three workspaces sit on the `UTC` default and never changed it, so a
9–17 schedule is firing at the wrong local hours. Silently wrong output is worse
than no output.

**Change:** if a workspace's timezone is `UTC` **and** the Slack profile reports
something else, show an inline prompt: "Your schedule runs on UTC but Slack says
you are in Europe/Vienna — switch?"

New connections already default from the Slack profile (`fetchSlackAccount` in
`app/api/slack/token/route.ts`), so this is backfill for existing rows only.

**Effort:** ~1 hour.

---

## Phase 2 — The real feature gaps

### 2.1 Vacation mode (date range)
**Problem:** claimed in the README and across ~30 marketing pages, and it does not
exist. `/features` now says so plainly, so the site currently contradicts itself.
Idle Pilot has it.

**Change:** nullable `vacation_until text` column on `workspace` (ISO-8601 UTC).
Prefer a real column over a key in the `working_hours` JSON so the cron can push
the filter into SQL:

```sql
where is_active = 1
  and slack_auth_token is not null
  and (vacation_until is null or vacation_until <= :now)
```

That keeps `getActiveWorkspaces` a single indexed read, which matters because
Turso bills row scans. Dashboard gets a date picker plus a "Back on 14 Aug" chip.

**Effort:** ~half a day including UI. **Unblocks:** removing the contradiction —
after this ships, the ~30 pages claiming vacation mode become true, and the
"not built yet" line in the README and `/features` comes out.

### 2.2 Mid-day breaks
**Problem:** a schedule is one continuous window. Real days have a lunch. Idle
Pilot supports this, and a solid 8-hour green block is less believable than one
with a gap in it — so this overlaps with 3.1.

**Change:** optional `breaks: [{ startHour, endHour }]` inside the existing
`working_hours` JSON. No migration needed — `WorkingHours` is a JSON TEXT column,
and `isWithinWorkingHours` in `lib/workingHours.ts` is already the single
decision point for both the cron and the dashboard preview. Extend that one
function and everything downstream follows.

**Effort:** ~half a day. Add unit coverage for the overnight + break interaction
(a break inside a 22:00–06:00 window is the fiddly case).

### 2.3 Scheduled status text and emoji
**The biggest market expansion available, and the one I would argue hardest for.**

**Problem:** presence (the dot) and status (emoji + text) are different systems,
and Slackactivity only does the first. Status scheduling is the whole of Status
Calendar's business, and the search demand is already proven:

| Keyword | Volume/mo | KD |
| --- | --- | --- |
| slack scheduling app | 170 | 0 |
| status scheduler for slack | 140 | 6 |
| slack schedule status | 90 | 7 |

**Change:** schedule an emoji + text alongside the presence window — "🏠 Working
remotely" 09:00–17:00, cleared outside it — via `users.profile.set`.

**Watch out — this is the catch:** it needs the `users.profile:write` scope, and
**adding a scope forces every existing user to re-authorise.** Do not bundle it
silently into the main OAuth request. Make it opt-in per workspace: an "Also
schedule my status text" toggle that triggers an incremental re-auth only for
people who want it. Existing tokens keep working untouched.

**Effort:** 2–3 days. **Worked if:** the three keywords above start converting;
they are currently unowned by anyone with a real product.

---

## Phase 3 — Natural mode

### 3.1 Believable presence
**Problem:** two workspaces run 01:00–23:00 and 09:00–04:00 across seven days,
producing 92% and 79% green. That is not a person. Competitor content already
says out loud that "a tool that is green 24/7 is a tell", and the top-ranking
queries in this niche include *will I get caught* and *can my company see if I'm
faking my Slack status*.

**Change:** an optional "Natural" mode that perturbs the schedule instead of
holding a solid block:
- fuzz start and end by a few minutes each day
- insert a lunch dip and one or two short breaks
- allow occasional brief away gaps inside the window

**Design constraint that matters:** the decision must be **deterministic**, not
`Math.random()`. The cron runs every 5 minutes and may retry; random per-tick
would flicker you green/grey minute to minute, which looks far worse than a solid
block. Hash `(workspace_id, local date, bucket)` into a stable value and derive
the day's gaps from that — same input, same answer, all day, across retries.

This composes with 2.2: breaks are the user-declared version, natural mode is the
generated one, and both resolve through `isWithinWorkingHours`.

**Effort:** ~1 day given 2.2. **Why it is worth more than it looks:** every
competitor sells "always green". "Believably present" is a better product *and*
the honest answer to the highest-intent queries in the niche, several of which
slack.green already ranks for and we do not.

---

## Explicitly not doing

**Microsoft Teams.** Doubles the addressable market and is the one thing Idle
Pilot genuinely beats us on — but it is a different API, different auth model and
a different presence semantics. Revisit only once the Slack side shows the SEO
work converting. `/compare/slackactivity-vs-idle-pilot` already recommends Idle
Pilot for Teams-only users, which is the honest position until this changes.

---

## Sequencing

```
1.1 health banner ──┬─> 1.2 expiry email        (1.2 is much weaker without 1.1)
                    └─> 1.3 timezone warning     (independent, tiny)

2.1 vacation ──────────> removes the site-wide contradiction; do early
2.2 breaks ────────────> 3.1 natural mode        (shares isWithinWorkingHours)
2.3 status text ───────> independent, largest, needs a re-auth strategy
```

Phase 1 before any of Phase 2. Retention multiplies the value of every SEO win
that follows; shipping features into a product where a third of installs quietly
stop working just loses users faster.
