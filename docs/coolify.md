# Deploying slackactivity.com on Coolify

Moving off Vercel. The app is a single Next.js server in one Docker container,
talking to Turso (libSQL) and Slack. No other services.

## 1. Create the application

- **Source:** this repo, branch you deploy from.
- **Build pack:** Dockerfile (repo root `Dockerfile`).
- **Port:** `3000` (exposed by the image).
- **Health check:** the image already has a `HEALTHCHECK` hitting `GET /api/ping`.
  If you set one in Coolify too, use path `/api/ping`, port `3000`.
  `/api/ping` touches neither Turso nor Slack, so it stays green during an
  upstream outage.
- **Domains:** `https://slackactivity.com` (add `https://www.slackactivity.com` too
  if you use www). Coolify/Traefik issues the Let's Encrypt cert, but only after
  DNS points at the server (step 4).

The image builds **without any env vars**. Everything is read at runtime, so set
all variables below as runtime-only variables.

Coolify (4.7) marks new variables **"Available at Buildtime"** by default, and also
creates a preview copy of each one. Untick buildtime on both copies (API:
`is_buildtime: false`). Otherwise every secret is passed to `docker build` as a
build arg, where it can show up in build logs and image history, and
`NEXT_PUBLIC_*` values get baked into the bundle.

## 2. Environment variables

Names only. Copy the values from the current Vercel project / `.env.local`.

| Variable | Required | Notes |
| --- | --- | --- |
| `TURSO_DATABASE_URL` | yes | `libsql://…` URL |
| `TURSO_AUTH_TOKEN` | yes | |
| `SESSION_SECRET` | yes | HMAC key for the session cookie. Keep the current value, or everyone is signed out |
| `NEXT_PUBLIC_SLACK_CLIENT_ID` | yes | |
| `SLACK_CLIENT_SECRET` | yes | |
| `NEXT_PUBLIC_SLACK_REDIRECT_URI` | yes | `https://slackactivity.com/api/slack/token` (unchanged) |
| `SLACK_SCHEDULE_SECRET` | yes | Guards the presence cron. **Use a new value, see below** |
| `NEXT_PUBLIC_SITE_URL` | recommended | `https://slackactivity.com` (the default if unset). Also the base for the Google callback and password-email links |
| `ADMIN_EMAILS` | optional | Comma-separated, gates `/admin` |
| `GROWTH_HUB_SECRET` | optional | HMAC secret for the Growth Hub adapter at `/api/hub` (conversions + page inventory). Same value in the hub's Site adapter connection |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optional | Enables "Continue with Google" (hidden when unset). See section 5 |
| `GOOGLE_REDIRECT_URI` | optional | Override; default `<NEXT_PUBLIC_SITE_URL>/api/auth/google/callback` |
| `CLOUDFLARE_API_TOKEN` | for passwords | Cloudflare Email Sending (token with Email Sending: Edit). Sends the "set a password" links. Email/password sign-in is hidden without it |
| `CLOUDFLARE_ACCOUNT_ID` | for passwords | `53b790c6264d7b1c4afe8a2ab231bb9b` |
| `EMAIL_FROM` | for passwords | `welcome@slackactivity.com` (domain set up for Email Sending in Cloudflare; test send accepted 2026-11-22). Optional `EMAIL_FROM_NAME`, default "Slackactivity" |
| `SLACK_WEBHOOK_URL` | optional | Contact form → Slack |
| `ACTIVITY_LOG_RETENTION_DAYS` | optional | Prune raw logs older than N days; unset/0 keeps all |

Don't set `NODE_ENV`. The image sets `NODE_ENV=production`, and `development`
would switch the OAuth redirect to the `_DEV` URI.
`NEXT_PUBLIC_SLACK_REDIRECT_URI_DEV` is only for local dev.

**No longer used. Don't copy these over:** all `SUPABASE_*` / `NEXT_PUBLIC_SUPABASE_*`,
all `STRIPE_*`, `OPENAI_API_KEY`, `MJ_APIKEY_*`, `RESEND_API_KEY`, `FROM_EMAIL`,
`FROM_NAME`, `AZURE_*`, `NEXT_PUBLIC_MS_TEAMS_REDIRECT_URI`, `MS_SCHEDULE_SECRET`,
`NEXT_PUBLIC_GET_URL`.

### Rotate `SLACK_SCHEDULE_SECRET`

The value currently in use is committed in plain text in this **public**
repo's history (`express/cronJobs.js`, Aug 2024). Anyone can trigger the cron
with it. Generate a new one for Coolify:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Rotating also neutralises the unknown external caller (section 6). Once DNS
points at Coolify, its requests carry the old secret and get `401`, so the two
can never both run, even if the old caller is never found.

## 3. Presence cron: Coolify Scheduled Task

Application → **Scheduled Tasks** → add:

- **Name:** `slack-presence`
- **Frequency:** `*/5 * * * *`
- **Container:** the app container
- **Command:**

  ```sh
  curl -fsS --max-time 70 "http://localhost:3000/api/slack/schleude?secret=$SLACK_SCHEDULE_SECRET"
  ```

The task runs inside the app container (the image ships `curl`), so it calls
the app on localhost. No public round-trip, and it works before DNS moves.
`$SLACK_SCHEDULE_SECRET` expands from the container's env (verified locally).
If your Coolify version doesn't expand it, paste the literal value instead.

**Don't enable this task until the cutover step that says so.** Before that,
the live Vercel app (on Supabase) and this one (on Turso) would both drive
Slack presence.

A tick is time-bounded: Slack calls run 8 at a time, each request has an 8s
timeout with one quick retry, Turso requests time out at 15s, and no new Slack
call starts after 30s. Workspaces not reached are picked up next tick.
`--max-time 70` is a backstop.

## 4. DNS

`slackactivity.com` currently resolves to Vercel. The registrar is elsewhere.

1. **Find out who serves DNS:** `dig NS slackactivity.com +short`.
   - If it returns `ns1/ns2.vercel-dns.com`, the zone is hosted at Vercel.
     Before changing anything, recreate **every** record at the registrar's DNS
     (or wherever you want the zone): MX, TXT (Google / AdSense / Search Console
     verification, SPF/DKIM), and any subdomains. List them in Vercel → Domains
     → slackactivity.com. Then switch the nameservers at the registrar.
   - If it returns the registrar's (or another provider's) nameservers, just
     edit the records there.
2. A day ahead, lower the TTL on the apex/www records to 300s.
3. At cutover, replace the Vercel records (`A 76.76.21.21` and/or
   `CNAME cname.vercel-dns.com`) with:
   - `A  slackactivity.com      → <Coolify server IPv4>`
   - `AAAA slackactivity.com    → <server IPv6>` (only if the server has one)
   - `CNAME www                 → slackactivity.com` (or another A record)
4. Wait for propagation (`dig +short slackactivity.com`) and for Coolify to
   issue the certificate.

## 5. Slack OAuth redirect URL

Same domain, so **the URL doesn't change.** Under **User Token Scopes**, make
sure `users:read.email` is listed next to `users:read` and `users:write`; the new
sign-in requests it, and the old app didn't. Existing tokens keep working for the
presence cron, which only needs `users:write`.

 For peace of mind, check that
`https://slackactivity.com/api/slack/token` is still listed under Slack app →
OAuth & Permissions → Redirect URLs. Don't add the Coolify preview domain there
permanently. If you want to test sign-in on it before cutover, add it
temporarily and remove it afterwards.

### Email + password sign-in

35 Supabase accounts used email; the 16 with a confirmed address had their
bcrypt hashes imported (`scripts/migrate-passwords.mjs`), so their existing
passwords work unchanged. Everyone else, and anyone who forgot their password,
uses "Forgot your password, or never set one?": they choose a password, and it
applies only after they click the emailed link, sent through Cloudflare Email
Sending from `welcome@slackactivity.com`. If sending fails, the form says so
instead of claiming the link is on its way.

### Google sign-in

About 60 of the 125 Supabase-era accounts signed up with Google. "Continue with
Google" signs into the existing account with the same **verified** email (all
migrated users have one, and none are duplicated). A brand-new Google account
has no workspace, so the dashboard asks it to connect Slack.

In Google Cloud Console → APIs & Services → Credentials, use the OAuth client
Supabase used (or create a new "Web application" client). Under **Authorized
redirect URIs**, add:

- `https://slackactivity.com/api/auth/google/callback`
- `http://localhost:3000/api/auth/google/callback` (local dev)
- optionally `https://slackactivity.strohstacks.xyz/api/auth/google/callback`,
  for testing before cutover (while `NEXT_PUBLIC_SITE_URL` points at that domain)

The old Supabase callback (`https://<project>.supabase.co/auth/v1/callback`) can
stay until Supabase is retired.

## 6. The current external cron caller (unknown)

Something outside Vercel calls `/api/slack/schleude?secret=…` every ~5 minutes.
There's no `vercel.json` cron. Clues from the repo:

- Until Oct 2024 the repo had an `express/` app (`express/cronJobs.js`,
  `node-cron`, `*/5 * * * *`) that fetched
  `…/api/slack/schleude?secret=<the current secret>`, first against
  `slacktivity.app`, later `localhost:3001`. It was deleted from the repo in
  commit `98015b8`. A `node-cron` process can't run on Vercel serverless, so if
  it's still alive it's on some always-on box (old VPS, pm2, a home machine).
- Nothing else in the code or docs mentions cron-job.org, pg_cron, QStash,
  GitHub Actions or similar.

How to identify it: open the Vercel project → Logs, filter on
`/api/slack/schleude`, and look at the **User-Agent and source IP**:
`node`/`undici` means a Node process (likely that express app), `cron-job.org`
or EasyCron name themselves, and `pg_net/…` means Supabase `pg_cron`. For pg_cron,
also run `select * from cron.job;` in the Supabase SQL editor.

## 7. Cutover checklist

**Prep (any time before):**

- [ ] Create the Coolify app (section 1) with all env vars (section 2), including
      a **new** `SLACK_SCHEDULE_SECRET`. Deploy it on Coolify's generated domain.
- [ ] Check `GET /` → 200 and `GET /api/ping` → `{"ok":true}` on that domain.
- [ ] Add the Scheduled Task (section 3) but leave it **disabled**.
- [ ] Find out who serves DNS (section 4.1). If it's Vercel DNS, copy all records
      to the new DNS host now.
- [ ] Lower the TTL to 300s at least a day ahead.
- [ ] Try to identify the external cron caller (section 6) so you know what to
      switch off.

**Cutover (in this order):**

1. [ ] **Sync data.** The live Vercel build still writes to Supabase. Pull
       everything since the August migration into Turso. From a checkout with
       `.env.local` containing the Supabase + Turso keys:
       `pnpm migrate --dry`, then `pnpm migrate`, then `pnpm verify:rollup`.
       (Idempotent: upserts users/workspaces, resumes logs from the max id.)
       Then `SUPABASE_DB_URL=… node scripts/migrate-passwords.mjs` for any
       passwords changed on the old site (Supabase → Connect → Session pooler URI).
2. [ ] **Switch DNS** to the Coolify server (section 4.3).
   - [ ] On Coolify, set **`NEXT_PUBLIC_SITE_URL=https://slackactivity.com`**
         (it points at the temporary domain for testing, and Google sign-in and
         password emails build their links from it), then redeploy.
         `GOOGLE_REDIRECT_URI` is set to an empty value (the API token used for
         setup couldn't delete it); empty means "derive from the site URL".
         Delete it in the UI or leave it empty.
   - [ ] On Coolify, set **`NEXT_PUBLIC_SLACK_REDIRECT_URI=https://slackactivity.com/api/slack/token`**
         (it points at the temporary domain for testing). Optionally remove the
         temporary redirect URL from the Slack app afterwards.
3. [ ] **Enable the Coolify Scheduled Task.**
4. [ ] **Turn off the old external cron caller** (whatever section 6 found:
       stop the process / disable the cron-job.org job / `cron.unschedule(...)`).
       After DNS moves its requests already get `401` (old secret), but it should
       not keep running. If Vercel logs still show it hitting the old deployment
       through a cached DNS entry, that also stops once it's disabled.
5. [ ] **Verify:** Scheduled Task logs show `200` every 5 minutes; the response
       body has `"processed": N` with mostly `"success"`; `/admin` (or the homepage
       live stats) shows a fresh last-activity time. Sign in with Slack once on
       `https://slackactivity.com` to confirm OAuth end to end.
6. [ ] **Re-run `pnpm migrate`** (and `migrate-passwords.mjs`) once DNS has
       fully propagated, to catch anything the old app wrote to Supabase in between.
7. [ ] **Remove `slackactivity.com` (and `www`) from the Vercel project**
       (Project → Settings → Domains).
8. [ ] In the Vercel project, **disconnect the Git repo** (or pause the project)
       so future pushes don't trigger builds there. Keep the project for about a week
       as a rollback target, then delete it. Rollback = point DNS back to Vercel
       and disable the Coolify task.
9. [ ] Later: retire Supabase once you're confident nothing reads it.

## 8. Monitoring

- **Coolify email** (team settings): deployment failures, restart limit,
  server unreachable/disk, and **scheduled-task failures** (enabled
  2026-11-22) are emailed. The cron answers 502 when every Slack call in a
  tick fails, and 500 on a database error, so `curl -f` fails and the
  scheduled-task email goes out. Single revoked tokens are handled per
  workspace and do not alert.
- **Weekly check**: `node scripts/weekly-check.mjs [--days=7]` prints a
  read-only JSON snapshot (endpoints, ticks per day, expected 288; errors,
  deactivations, sign-ups, Coolify deployments and cron runs). It needs
  `COOLIFY_API_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_APP_UUID` and
  `COOLIFY_TASK_UUID` in `.env.local` for the Coolify part. A scheduled agent
  runs it every Monday together with Growth Hub (`hub_health`,
  `goals_progress` for project `slackactivity`) and reports with proposed fixes.
