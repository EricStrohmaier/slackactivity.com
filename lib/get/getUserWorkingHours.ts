"use server";
// lib/auth.ts or utils/user.ts

import { WorkingHours } from "@/types/supabase";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function getUserWorkingHours(
  userId: string
): Promise<WorkingHours> {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("users")
    .select("working_hours")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching working hours:", error);
    throw new Error("Failed to fetch working hours");
  }

  if (!data) {
    // Return default working hours if no data is found
    return {
      startHour: 9,
      endHour: 17,
      daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
      timezone: "UTC",
    };
  }
  // @ts-ignore
  return data.working_hours;
}
