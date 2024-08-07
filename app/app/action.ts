"use server";
import moment from "moment";
import { WebClient } from "@slack/web-api";
import { createClient } from "@/utils/supabase/server";

export const getUser = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
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
