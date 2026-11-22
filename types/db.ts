export interface WorkingHours {
  startHour: number; // 0-23
  endHour: number; // 0-23
  daysOfWeek: number[]; // 0 = Sunday ... 6 = Saturday
  timezone: string; // IANA name, e.g. "Europe/Vienna"
}

export const DEFAULT_WORKING_HOURS: WorkingHours = {
  startHour: 9,
  endHour: 17,
  daysOfWeek: [1, 2, 3, 4, 5],
  timezone: "UTC",
};

export interface User {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Workspace {
  id: string;
  user_id: string;
  team_id: string | null;
  team_name: string | null;
  slack_user_id: string | null;
  slack_auth_token: string | null;
  is_active: boolean;
  working_hours: WorkingHours;
  created_at: string;
}

/** One cron tick or lifecycle event for a workspace. */
export type ActivityAction =
  | "set_active"
  | "set_away"
  | "error"
  | "deactivated";
