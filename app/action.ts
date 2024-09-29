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

const slackOperations = async (config: UserConfig): Promise<void> => {
  const { token, workHours } = config;
  const web = new WebClient(token);

  //   const profileInfo = await web.users.profile.get();

  if (
    isWithinWorkHours(
      workHours.startHour,
      workHours.endHour,
      workHours.daysOfWeek
    )
  ) {
    await web.users.setPresence({ presence: "auto" });
    // await web.users.profile.set({
    //   profile: {
    //     ...profileInfo.profile,
    //     status_text: "Working",
    //     status_emoji: ":working:",
    //     status_expiration: durationTimestamp,
    //   },
    // });
  } else {
    await web.users.setPresence({ presence: "away" });
    // await web.users.profile.set({
    //   profile: {
    //     ...profileInfo.profile,
    //     status_text: "AFK",
    //     status_emoji: ":afk:",
    //     status_expiration: durationTimestamp,
    //   },
    // });
  }

  console.log("Updated your status.", new Date().getTime());
};

export default slackOperations;

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

export async function updateUserPresence(user: any) {
  const token = user.slack_auth_token;
  const workHours = user.working_hours;

  if (!token || !workHours) {
    console.error(`Missing token or work hours for user ${user.id}`);
    return;
  }

  const slack = new WebClient(token);

  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();

  let action: string;

  if (
    workHours.daysOfWeek.includes(currentDay) &&
    currentHour >= workHours.startHour &&
    currentHour < workHours.endHour
  ) {
    await slack.users.setPresence({ presence: "auto" });
    action = "set_active";
  } else {
    await slack.users.setPresence({ presence: "away" });
    action = "set_away";
  }

  const supabase = supabaseAdmin();
  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: action,
    details: { currentDay, currentHour, workHours },
  });
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
