"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminStats, getAdminStats } from "@/app/stats-actions";

const PERIODS = [
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
  { value: 365, label: "Last year" },
] as const;

interface AdminDashboardProps {
  initialStats: AdminStats;
  initialDays: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialStats,
  initialDays,
}) => {
  const [days, setDays] = useState(initialDays);
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [loading, setLoading] = useState(false);

  const handlePeriodChange = async (value: string) => {
    const newDays = parseInt(value, 10);
    setDays(newDays);
    setLoading(true);
    try {
      setStats(await getAdminStats(newDays));
    } finally {
      setLoading(false);
    }
  };

  const { overview } = stats;

  const chartData = useMemo(
    () =>
      stats.dailyLogs.map((d) => ({
        label: d.day.slice(5),
        active: d.set_active,
        away: d.set_away,
        errors: d.errors + d.deactivated,
      })),
    [stats.dailyLogs]
  );

  const staleThreshold = Date.now() - 60 * 60 * 1000; // 1 hour

  return (
    <div className="mx-auto mt-10 max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Admin statistics</h1>
          <p className="text-sm text-muted-foreground">
            Data since{" "}
            {overview.first_log
              ? new Date(overview.first_log).toLocaleDateString()
              : "—"}{" "}
            · {overview.total_logs.toLocaleString()} log entries total
          </p>
        </div>
        <Select value={String(days)} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((p) => (
              <SelectItem key={p.value} value={String(p.value)}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <OverviewCard
          label="Users"
          value={overview.total_users}
          hint={`+${overview.signups_30d} in last 30d`}
        />
        <OverviewCard
          label="Workspaces"
          value={overview.total_workspaces}
          hint={`${overview.active_workspaces} active`}
        />
        <OverviewCard label="Signups (30d)" value={overview.signups_30d} />
        <OverviewCard
          label="Presence updates (30d)"
          value={overview.logs_30d.toLocaleString()}
          hint={
            overview.last_log
              ? `last: ${new Date(overview.last_log).toLocaleString()}`
              : undefined
          }
        />
      </div>

      {/* Daily volume chart */}
      <Card className={loading ? "opacity-60" : ""}>
        <CardHeader>
          <CardTitle className="text-lg">Presence updates per day</CardTitle>
          <CardDescription>
            set_active vs set_away ticks across all workspaces (UTC days)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis tick={{ fontSize: 11 }} width={48} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="active"
                  name="Set active"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="away"
                  name="Set away"
                  stackId="1"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.35}
                />
                <Area
                  type="monotone"
                  dataKey="errors"
                  name="Errors / deactivations"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Per-workspace table */}
      <Card className={loading ? "opacity-60" : ""}>
        <CardHeader>
          <CardTitle className="text-lg">Workspaces</CardTitle>
          <CardDescription>
            Usage in the selected period. “Online share” is the portion of all
            presence ticks where the user was kept online.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Workspace</th>
                  <th className="py-2 pr-4 font-medium">Owner</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Last update</th>
                  <th className="py-2 pr-4 font-medium text-right">
                    Online share
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.workspaces.map((w) => {
                  const lastLogTime = w.last_log
                    ? new Date(w.last_log).getTime()
                    : null;
                  const stale =
                    w.is_active &&
                    (lastLogTime === null || lastLogTime < staleThreshold);
                  return (
                    <tr key={w.workspace_id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">
                        {w.team_name || "—"}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {w.user_email || "—"}
                      </td>
                      <td className="py-2 pr-4">
                        <div className="flex flex-wrap gap-1">
                          {w.is_active ? (
                            <Badge variant="success">active</Badge>
                          ) : (
                            <Badge variant="secondary">inactive</Badge>
                          )}
                          {stale && <Badge variant="warning">stale</Badge>}
                          {w.is_active &&
                            w.total_ticks > 0 &&
                            w.active_share === 0 && (
                              <Badge variant="destructive">never online</Badge>
                            )}
                        </div>
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {w.last_log
                          ? new Date(w.last_log).toLocaleString()
                          : "never"}
                      </td>
                      <td className="py-2 pr-4 text-right">
                        {w.active_share !== null ? (
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded bg-muted">
                              <div
                                className="h-full rounded bg-green-500"
                                style={{ width: `${w.active_share}%` }}
                              />
                            </div>
                            <span className="w-12 tabular-nums">
                              {w.active_share}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">no data</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const OverviewCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </CardContent>
  </Card>
);

export default AdminDashboard;
