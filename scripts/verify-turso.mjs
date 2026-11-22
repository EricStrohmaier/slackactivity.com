import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
for (const line of readFileSync(".env.local","utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const db = createClient({url:process.env.TURSO_DATABASE_URL, authToken:process.env.TURSO_AUTH_TOKEN});
const q = async (sql,args=[]) => (await db.execute({sql,args})).rows;

const since30 = new Date(Date.now()-30*864e5).toISOString();
console.log("── overview (admin + public stats path) ──");
console.log(await q(`select
  (select count(*) from users) total_users,
  (select count(*) from workspace) total_workspaces,
  (select count(*) from workspace where is_active=1) active_workspaces,
  (select count(*) from activity_logs) total_logs,
  (select count(*) from activity_logs where timestamp >= ?) logs_30d`, [since30]));

console.log("\n── daily logs, last 5 days (UTC bucket) ──");
console.table(await q(`select substr(timestamp,1,10) day,
  sum(case when action='set_active' then 1 else 0 end) active,
  sum(case when action='set_away' then 1 else 0 end) away,
  count(*) total
  from activity_logs where timestamp >= ? group by 1 order by 1 desc limit 5`,
  [new Date(Date.now()-5*864e5).toISOString()]));

console.log("\n── per-workspace (admin table) ──");
console.table((await q(`select w.team_name, u.email, w.is_active, w.slack_user_id is not null linked,
  max(al.timestamp) last_log,
  sum(case when al.action='set_active' then 1 else 0 end) active_ticks,
  sum(case when al.action in ('set_active','set_away') then 1 else 0 end) total_ticks
  from workspace w left join users u on u.id=w.user_id
  left join activity_logs al on al.workspace_id=w.id and al.timestamp >= ?
  group by w.id order by total_ticks desc`, [since30]))
  .map(r=>({team:r.team_name, active:r.is_active, linked:r.linked,
    ticks:r.total_ticks, share: r.total_ticks? Math.round(100*r.active_ticks/r.total_ticks)+"%":"-",
    last: r.last_log? String(r.last_log).slice(0,16):"never"})));

console.log("\n── hourly->local-day fold for busiest workspace ──");
const [busiest] = await q(`select workspace_id, count(*) c from activity_logs
  where timestamp >= ? group by 1 order by c desc limit 1`, [since30]);
const hours = await q(`select substr(timestamp,1,13) hour,
  sum(case when action='set_active' then 1 else 0 end) active,
  sum(case when action='set_away' then 1 else 0 end) away
  from activity_logs where workspace_id=? and timestamp>=? group by 1 order by 1`,
  [busiest.workspace_id, new Date(Date.now()-3*864e5).toISOString()]);
const tz = JSON.parse((await q(`select working_hours w from workspace where id=?`,[busiest.workspace_id]))[0].w).timezone;
const fmt = new Intl.DateTimeFormat("en-CA",{timeZone:tz,year:"numeric",month:"2-digit",day:"2-digit"});
const byDay = new Map();
for (const h of hours) { const d=fmt.format(new Date(h.hour+":00:00.000Z"));
  const a=byDay.get(d)??{active:0,away:0}; a.active+=h.active; a.away+=h.away; byDay.set(d,a); }
console.log(`timezone=${tz}, ${hours.length} hour buckets ->`);
console.table([...byDay].map(([day,v])=>({day,...v,activeHours:+(v.active*5/60).toFixed(1)})));
