"use server";

import { unstable_cache } from "next/cache";
import { getUser, isAdminUser as checkAdmin } from "@/lib/auth";
import {
  foldHoursIntoLocalDays,
  getAdminWorkspaceStats,
  getDailyLogs,
  getHourlyActivity,
  getOverviewStats,
  getWorkspaceForUser,
} from "@/lib/db/queries";
import { configuredHoursPerDay } from "@/lib/workingHours";

/** A cron tick fires every 5 minutes, so each tick stands for 1/12 of an hour. */
const HOURS_PER_TICK = 5 / 60;

export interface DailyStat {
  day: string; // YYYY-MM-DD in workspace timezone
  activeTicks: number;
  awayTicks: number;
  totalTicks: number;
  activeHours: number;
  awayHours: number;
}

export interface ActivitySummary {
  totalActiveHours: number;
  daysCovered: number;
  configuredHoursInPeriod: number | null;
  coveragePercent: number | null;
  currentStreak: number;
}

export interface WorkspaceActivityStats {
  daily: DailyStat[];
  summary: ActivitySummary;
  timezone: string;
}

function countConfiguredDays(
  start: Date,
  end: Date,
  daysOfWeek: number[]
): number {
  let count = 0;
  const d = new Date(start);
  d.setHours(0, 0, 0, 0);
  while (d <= end) {
    if (daysOfWeek.includes(d.getDay())) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

export async function getWorkspaceActivityStats(
  workspaceId: string,
  days: number
): Promise<WorkspaceActivityStats> {
  const user = await getUser();
  if (!user) throw new Error("Not authenticated");
  if (![30, 90, 365].includes(days)) throw new Error("Invalid period");

  const workspace = await getWorkspaceForUser(workspaceId, user.id);
  if (!workspace) throw new Error("Workspace not found");

  const workHours = workspace.working_hours;
  const timezone = workHours?.timezone || "UTC";

  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);

  const hours = await getHourlyActivity(workspaceId, start, end);
  const daily: DailyStat[] = foldHoursIntoLocalDays(hours, timezone).map(
    (d) => ({
      day: d.day,
      activeTicks: d.active,
      awayTicks: d.away,
      totalTicks: d.active + d.away,
      activeHours: Math.round(d.active * HOURS_PER_TICK * 100) / 100,
      awayHours: Math.round(d.away * HOURS_PER_TICK * 100) / 100,
    })
  );

  const totalActiveHours = daily.reduce((sum, d) => sum + d.activeHours, 0);
  const activeDays = new Set(
    daily.filter((d) => d.activeTicks > 0).map((d) => d.day)
  );

  let configuredHoursInPeriod: number | null = null;
  let coveragePercent: number | null = null;
  let currentStreak = 0;

  if (workHours && Array.isArray(workHours.daysOfWeek)) {
    configuredHoursInPeriod =
      configuredHoursPerDay(workHours) *
      countConfiguredDays(start, end, workHours.daysOfWeek);

    if (configuredHoursInPeriod > 0) {
      coveragePercent = Math.min(
        100,
        (totalActiveHours / configuredHoursInPeriod) * 100
      );
    }

    // Consecutive configured workdays (walking back from today) with at least
    // one active tick. Today is skipped if it has no activity yet, e.g. before
    // working hours have started.
    const d = new Date();
    for (let i = 0; i < days; i++) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (workHours.daysOfWeek.includes(d.getDay())) {
        if (activeDays.has(key)) {
          currentStreak++;
        } else if (i > 0) {
          break;
        }
      }
      d.setDate(d.getDate() - 1);
    }
  }

  return {
    daily,
    timezone,
    summary: {
      totalActiveHours: Math.round(totalActiveHours * 10) / 10,
      daysCovered: activeDays.size,
      configuredHoursInPeriod:
        configuredHoursInPeriod !== null
          ? Math.round(configuredHoursInPeriod)
          : null,
      coveragePercent:
        coveragePercent !== null ? Math.round(coveragePercent) : null,
      currentStreak,
    },
  };
}

// ---------------------------------------------------------------- Admin

export interface AdminOverview {
  total_users: number;
  total_workspaces: number;
  active_workspaces: number;
  total_logs: number;
  logs_30d: number;
  first_log: string | null;
  last_log: string | null;
  signups_30d: number;
}

export interface AdminDailyLog {
  day: string;
  set_active: number;
  set_away: number;
  errors: number;
  deactivated: number;
  total: number;
}

export interface AdminWorkspaceStat {
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

export interface AdminStats {
  overview: AdminOverview;
  dailyLogs: AdminDailyLog[];
  workspaces: AdminWorkspaceStat[];
}

export async function isAdminUser(): Promise<boolean> {
  return checkAdmin();
}

/**
 * The admin figures are the same for every admin, and the underlying ticks
 * only move every 5 minutes, so re-running the three queries on each render
 * (or each period-toggle click) buys nothing. Cached separately from the auth
 * check above it, which must stay per-request.
 */
const cachedAdminStats = unstable_cache(
  async (days: number): Promise<AdminStats> => {
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);

    const [overview, dailyLogs, workspaces] = await Promise.all([
      getOverviewStats(),
      getDailyLogs(start, end),
      getAdminWorkspaceStats(start, end),
    ]);

    return { overview, dailyLogs, workspaces };
  },
  ["admin-stats"],
  { revalidate: 300 }
);

export async function getAdminStats(days: number): Promise<AdminStats> {
  if (!(await checkAdmin())) throw new Error("Not authorized");
  if (![30, 90, 365].includes(days)) throw new Error("Invalid period");

  return cachedAdminStats(days);
}
