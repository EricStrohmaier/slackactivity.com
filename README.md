<div align="center">

<img src="public/logo.png" alt="Slackactivity logo" width="80" />

# Slackactivity — Keep Slack Active & Always Appear Online

**Automatically keep your Slack status green during your work hours.**
Stop Slack from setting you to "away" after 30 minutes of inactivity — no mouse jiggler, no hacks, just the official Slack API.

[**🚀 Use it free online → slackactivity.com**](https://slackactivity.com) · [How It Works](https://slackactivity.com/how-it-works) · [Guides](https://slackactivity.com/guides) · [Pricing](https://slackactivity.com/pricing)

![Slackactivity demo — automatically stay active and online on Slack](public/slackactivity-demo.gif)

</div>

---

## What is Slackactivity?

Slackactivity is a **Slack status automation tool** that keeps you **active and online on Slack** based on your work schedule and timezone. Slack automatically marks you as *away* after 30 minutes without activity — even if you're in a meeting, deep in focused work, or reading docs on another screen. That gray dot makes you look unavailable to your team and clients.

Slackactivity fixes that. Connect your workspace, set your working hours, and your **Slack presence stays green** — automatically, every 5 minutes, all day.

> **Free to use online — no install, no credit card.** Just sign in at [slackactivity.com](https://slackactivity.com) and connect your Slack workspace.

## ✨ Features

- 🟢 **Always appear online on Slack** — automatic active status during your configured hours
- ⏰ **Smart scheduling** — set a start hour, end hour and working days; overnight windows (22:00–06:00) are supported for night shifts
- 🌍 **Timezone aware** — defaults to your Slack profile's timezone on connect; DST is handled for you
- 🗂️ **Multiple Slack workspaces** — connect unlimited workspaces, ideal for freelancers and consultants juggling client Slacks
- 🧩 **Per-workspace schedules** — different work hours for different clients or timezones
- 📊 **Activity history** — daily active/away hours, schedule coverage and streaks, over 30/90/365 days
- 🎛️ **One dashboard** — toggle any workspace on or off instantly, or disconnect it in one click

Not built yet: date-range vacation scheduling, mid-day breaks, Microsoft Teams, and
calendar-driven status text. See [`docs/roadmap.md`](docs/roadmap.md).

## 🔒 Security & Privacy

Slackactivity uses the **official Slack OAuth API** — no browser extensions, no keyboard simulators, no mouse jigglers, no workarounds that violate workspace policies.

It connects with a **user token and no bot token at all**, requesting exactly three scopes:

| Scope | Allows |
| --- | --- |
| `users:write` | Set your own presence to active or away — the entire product |
| `users:read` | Read your own profile, for your display name and timezone default |
| `users:read.email` | Read your own email, used to identify your account across workspaces |

- **Cannot read your messages**, files, channels, or any workspace content — those scopes are never requested
- Disconnect any workspace at any time with one click, or revoke the app from Slack directly

Full detail at [slackactivity.com/security](https://slackactivity.com/security).

## 🚀 How It Works (3 steps)

1. **Connect your workspace** — sign in with Slack OAuth at [slackactivity.com](https://slackactivity.com)
2. **Set your availability** — define working hours and timezone (per workspace if you like)
3. **Stay green** — Slackactivity keeps your Slack status active while you focus on real work

## 💚 Who is it for?

- **Remote workers & digital nomads** who work flexible hours across timezones and want their Slack availability to reflect their real schedule
- **Freelancers & consultants** managing 3–5+ client Slack workspaces who want to look responsive everywhere
- **Team leads & product managers** who are in meetings all day but still want to appear reachable
- Anyone tired of Slack's **auto-away timeout** making them look offline while they're actually working

## 💸 Pricing

**100% free, forever.** Unlimited Slack workspaces, automatic status updates, smart
scheduling, activity history — all of it, at no cost. No credit card, no trial, no catch.

→ [Get started free at slackactivity.com](https://slackactivity.com)

## 🛠️ Tech Stack

Built with [Next.js](https://nextjs.org) (App Router), [Turso](https://turso.tech) (libSQL), [Slack Web API](https://api.slack.com/web), Tailwind CSS, and Radix UI.

Sign-in **is** Slack OAuth — there is no separate account, no password, and no email flow. The session is a stateless HMAC-signed cookie, so there is no auth service and no session table.

### Running it yourself

```bash
pnpm install
cp .env.local.example .env.local   # fill in the values below
pnpm dev
```

This repo pins pnpm via the `packageManager` field — `npm install` will produce a
second, conflicting lockfile.

Required environment variables:

| Variable | What it's for |
| --- | --- |
| `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | libSQL database |
| `SESSION_SECRET` | HMAC key for the session cookie (rotating it signs everyone out) |
| `NEXT_PUBLIC_SLACK_CLIENT_ID` / `SLACK_CLIENT_SECRET` | Slack app credentials |
| `NEXT_PUBLIC_SLACK_REDIRECT_URI` / `..._DEV` | Must match the Slack app's redirect URLs exactly |
| `SLACK_SCHEDULE_SECRET` | Guards the presence cron at `/api/slack/schleude?secret=…` |
| `ADMIN_EMAILS` | Comma-separated emails allowed to see `/admin` |
| `ACTIVITY_LOG_RETENTION_DAYS` | Optional. Prune raw logs older than N days, a bounded slice per tick. Unset or `0` keeps everything |

Apply the schema with `lib/db/schema.sql`. The presence cron should call
`/api/slack/schleude?secret=$SLACK_SCHEDULE_SECRET` every ~5 minutes.

### Stats and the rollup tables

`activity_logs` grows by one row per workspace per tick — a few thousand a day.
Aggregating over it directly meant a full table scan on every dashboard read,
and Turso bills row *scans*, so an uncached homepage hit cost ~830k of them.

`activity_rollup` (per workspace, per UTC hour) and `counters` (lifetime
scalars) hold those aggregates precomputed. Two triggers on `activity_logs`
maintain them in the same transaction as the insert, so the write path is
unchanged and the aggregates can't drift. Every stats query reads the rollup;
nothing reads `activity_logs` any more.

```bash
pnpm migrate:rollup           # create the tables + triggers, backfill
pnpm verify:rollup            # check the rollup against the raw log
pnpm migrate:rollup -- --prune=90   # one-off: delete raw logs older than 90d
```

Pruning is safe for the UI — the rollup keeps every figure the dashboards show,
including the "operating since" date — but it is irreversible, so it is opt-in
in both the script and the cron.

## ❓ FAQ

**Does this keep my Slack status green without a mouse jiggler?**
Yes — Slackactivity is a mouse-jiggler alternative that works through the official Slack API. Nothing runs on your machine; it works even when your laptop is closed.

**Will Slack mark me as away after 30 minutes?**
Not during your configured working hours. Slackactivity refreshes your presence every 5 minutes so you stay online on Slack.

**Can I use it with multiple Slack workspaces?**
Yes, unlimited workspaces — each with its own schedule. And it's completely free.

**Is it safe?**
It uses Slack's official OAuth flow and requests only `users:write`, `users:read` and
`users:read.email` — no bot token. It can't read messages, files or channels, because
those permissions are never requested.

---

<div align="center">

**Keep your Slack status green. Stay visible. Focus on real work.**

[**Get started free at slackactivity.com →**](https://slackactivity.com)

</div>
