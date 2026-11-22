// Public, sanitized aggregate stats for the landing page.
// Server-side only. Everything here is an explicit whitelist: no per-workspace
// rows, no error/deactivation counts, nothing user-identifying.

import { unstable_cache } from "next/cache";
import { getDailyLogs, getOverviewStats } from "@/lib/db/queries";

export interface PublicStats {
  totalUsers: number;
  activeWorkspaces: number;
  totalWorkspaces: number;
  logs30d: number;
  totalLogs: number;
  firstLog: string | null; // "operating since"
  lastLog: string | null; // health indicator
  hoursOnline30d: number; // sum(set_active) * 5 / 60 over the last 30 days
  daily: { day: string; active: number; away: number }[];
}

async function fetchPublicStats(): Promise<PublicStats | null> {
  try {
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [overview, dailyLogs] = await Promise.all([
      getOverviewStats(),
      getDailyLogs(start, end),
    ]);

    const daily = dailyLogs.map((r) => ({
      day: r.day,
      active: r.set_active,
      away: r.set_away,
    }));

    const activeTicks30d = daily.reduce((sum, d) => sum + d.active, 0);

    return {
      totalUsers: overview.total_users,
      activeWorkspaces: overview.active_workspaces,
      totalWorkspaces: overview.total_workspaces,
      logs30d: overview.logs_30d,
      totalLogs: overview.total_logs,
      firstLog: overview.first_log,
      lastLog: overview.last_log,
      hoursOnline30d: Math.round((activeTicks30d * 5) / 60),
      daily,
    };
  } catch (error) {
    console.error("publicStats fetch failed:", error);
    return null;
  }
}

export const getPublicStats = unstable_cache(
  fetchPublicStats,
  ["public-stats"],
  { revalidate: 600 }
);
