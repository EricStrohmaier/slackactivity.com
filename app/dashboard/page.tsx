import React from "react";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { generateActivityReport, getUser } from "@/app/action";
import DashboardSelector from "@/components/app/dashboard/dashboard";
import { getUserWorkSpaces } from "@/lib/get/getUserWorkSpaces";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { token?: string; session_id?: string };
}) {
  const supabase = supabaseAdmin();

  const user = await getUser();

  if (!user) redirect("/signin");

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

  // Fetch workspaces and activity report
  const workspaces = await getUserWorkSpaces(user.id);
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 7);
  const activityReport = await generateActivityReport(
    user.id,
    startDate,
    endDate
  );

  return (
    <div className="h-screen">
      <DashboardSelector
        user={currentUser}
        workspaces={workspaces}
        activityReport={activityReport}
      />
    </div>
  );
}
