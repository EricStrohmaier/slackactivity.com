"use server";

import { Workspace } from "@/types/supabase";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function getUserWorkSpaces(userId: string): Promise<Workspace[]> {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("workspace")
    .select("id, name, is_active, working_hours")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching working hours:", error);
    throw new Error("Failed to fetch working hours");
  }

  return data as unknown as Workspace[];
}
