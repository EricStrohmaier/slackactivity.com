"use server";

import moment from "moment";
import { WebClient } from "@slack/web-api";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { Workspace } from "@/types/supabase";

export const getUser = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const getRowUser = async () => {
  const user = await getUser();
  if (!user) return null;
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id as string)
    .single();

  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

export const getSupabaseServer = () => {
  return createClient();
};

export interface UserConfig {
  token: string;
  workHours: {
    startHour: number; // 0-23
    endHour: number; // 0-23
    daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  };
}
const isWithinWorkHours = (
  startHour: number,
  endHour: number,
  daysOfWeek: number[]
): boolean => {
  const now = moment();
  const currentHour = now.hour();
  const currentDay = now.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  const withinHours = currentHour >= startHour && currentHour < endHour;
  const withinDays = daysOfWeek.includes(currentDay);

  return withinHours && withinDays;
};

export async function updateWorkspace(workspace: Workspace) {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("workspace")
    .update({
      working_hours: workspace.working_hours,
      is_active: workspace.is_active,
    })
    .eq("id", workspace.id);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function deleteWorkspaceById(workspaceId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }
  const supabase = supabaseAdmin();
  const { error } = await supabase
    .from("workspace")
    .delete()
    .eq("id", workspaceId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw error;
  }

  return { success: true };
}

export async function updateUserPresence(workspace: Workspace) {
  const token = workspace.slack_auth_token;
  const workHours = workspace.working_hours;
  const isPaid = workspace.stripe_is_paid;

  if (!token || !workHours) {
    console.error(`Missing token or work hours for workspace ${workspace.id}`);
    return;
  }

  if (!isPaid) {
    console.log(`Skipping workspace ${workspace.id}: not paid`);
    return;
  }

  const slack = new WebClient(token);

  // Get the current time in the workspace's timezone
  const now = new Date();
  const workspaceLocalTime = new Date(
    now.toLocaleString("en-US", {
      timeZone: workHours.timezone as any,
    })
  );

  const currentDay = workspaceLocalTime.getDay();
  const currentHour = workspaceLocalTime.getHours();
  const currentMinute = workspaceLocalTime.getMinutes();

  let action: string;

  try {
    if (
      workHours.daysOfWeek.includes(currentDay) &&
      (currentHour > workHours.startHour ||
        (currentHour === workHours.startHour && currentMinute >= 0)) &&
      (currentHour < workHours.endHour ||
        (currentHour === workHours.endHour && currentMinute === 0))
    ) {
      await slack.users.setPresence({ presence: "auto" });
      action = "set_active";
    } else {
      await slack.users.setPresence({ presence: "away" });
      action = "set_away";
    }

    const supabase = supabaseAdmin();
    await supabase.from("activity_logs").insert({
      workspace_id: workspace.id,
      action: action,
      details: { currentDay, currentHour, currentMinute, workHours },
    });
  } catch (error) {
    console.error("Error updating user presence:", error);
    throw error;
  }
}

export async function generateActivityReport(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("timestamp", startDate.toISOString())
    .lte("timestamp", endDate.toISOString());

  if (error) throw error;

  const activeCount = data.filter((log) => log.action === "set_active").length;
  const awayCount = data.filter((log) => log.action === "set_away").length;

  return {
    totalUpdates: data.length,
    activeUpdates: activeCount,
    awayUpdates: awayCount,
    activePercentage: (activeCount / data.length) * 100,
    awayPercentage: (awayCount / data.length) * 100,
  };
}
