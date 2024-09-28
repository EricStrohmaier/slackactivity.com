import React from "react";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/utils/supabase/admin";

import { generateActivityReport, getUser } from "@/app/action";
import DashboardClient from "@/components/app/dashboard/dashboard";
import { getUserWorkingHours } from "@/lib/get/getUserWorkingHours";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  const supabase = supabaseAdmin();

  const user = await getUser();

  if (!user) redirect("/signin");

  if (token) {
    const { error: updateError } = await supabase
      .from("users")
      .update({
        slack_auth_token: token,
      })
      .eq("id", user.id);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  const { data: currentUser, error: selectError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (selectError) {
    console.error(selectError);
    return (
      <div className="h-screen">
        Error: Couldn&apos;t find you in the system
      </div>
    );
  }

  // Fetch working hours and activity report
  const workingHours = await getUserWorkingHours(user.id);
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 7);
  const activityReport = await generateActivityReport(
    user.id,
    startDate,
    endDate
  );

  console.log("workingHours", workingHours);
  return (
    <div className="h-screen">
      <DashboardClient
        user={currentUser}
        initialWorkingHours={workingHours}
        initialActivityReport={activityReport}
      />
    </div>
  );
}
