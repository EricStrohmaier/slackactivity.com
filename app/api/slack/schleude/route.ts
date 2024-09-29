import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { WebClient } from "@slack/web-api";

export async function GET(request: NextRequest) {
  const secretToken = request.nextUrl.searchParams.get("secret");

  if (secretToken !== process.env.SLACK_SCHEDULE_SECRET) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = supabaseAdmin();
    const { data: workspaces, error } = await supabase
      .from("workspace")
      .select("*")
      .eq("is_active", true);

    if (!workspaces || workspaces.length === 0) {
      console.error("No active workspaces found");
      return new NextResponse(
        JSON.stringify({ message: "No active workspaces found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log(
      `Updating Slack presence for ${workspaces.length} active workspaces`
    );

    const updateResults = await Promise.all(
      workspaces.map(async (workspace) => {
        try {
          const token = workspace.slack_auth_token;
          const workHours = workspace.working_hours as {
            daysOfWeek: number[];
            startHour: number;
            endHour: number;
            timezone: string;
          } | null;

          if (!token || !workHours) {
            console.error(
              `Missing token or work hours for workspace ${workspace.id}`
            );
            return;
          }

          const slack = new WebClient(token);

          // Get the current time in the workspace's timezone
          const now = new Date();
          const workspaceLocalTime = new Date(
            now.toLocaleString("en-US", { timeZone: workHours.timezone })
          );

          const currentDay = workspaceLocalTime.getDay();
          const currentHour = workspaceLocalTime.getHours();
          const currentMinute = workspaceLocalTime.getMinutes();

          console.log(
            `Workspace ${
              workspace.id
            } local time: ${workspaceLocalTime.toISOString()}`
          );
          console.log(
            `Current day: ${currentDay}, Current hour: ${currentHour}, Current minute: ${currentMinute}`
          );

          // Add this right before the if condition
          console.log(
            `Workspace ${workspace.id} settings:`,
            JSON.stringify(workHours, null, 2)
          );
          console.log(
            `Current day: ${currentDay}, Current time: ${currentHour}:${currentMinute}`
          );
          console.log(
            `Is work day: ${workHours.daysOfWeek.includes(currentDay)}`
          );
          console.log(
            `Is after start time: ${
              currentHour > workHours.startHour ||
              (currentHour === workHours.startHour && currentMinute >= 0)
            }`
          );
          console.log(
            `Is before end time: ${
              currentHour < workHours.endHour ||
              (currentHour === workHours.endHour && currentMinute === 0)
            }`
          );

          let action: string;

          if (
            workHours.daysOfWeek.includes(currentDay) &&
            (currentHour > workHours.startHour ||
              (currentHour === workHours.startHour && currentMinute >= 0)) &&
            (currentHour < workHours.endHour ||
              (currentHour === workHours.endHour && currentMinute === 0))
          ) {
            await slack.users.setPresence({ presence: "auto" });
            action = "set_active";
            console.log(`Setting workspace ${workspace.id} to active`);
          } else {
            await slack.users.setPresence({ presence: "away" });
            action = "set_away";
            console.log(`Setting workspace ${workspace.id} to away`);
          }

          const { data: activityLog, error: activityError } = await supabase
            .from("activity_logs")
            .insert({
              workspace_id: workspace.id,
              action: action,
              details: { currentDay, currentHour, currentMinute, workHours },
            });

          if (activityError) {
            console.error(
              `Error inserting activity log for workspace ${workspace.id}:`,
              activityError
            );
            return {
              id: workspace.id,
              status: "error",
              message: activityError,
            };
          }

          return { id: workspace.id, status: "success" };
        } catch (error) {
          console.error(
            `Error updating presence for workspace ${workspace.id}:`,
            error
          );
          return { id: workspace.id, status: "error", message: error };
        }
      })
    );

    return new NextResponse(
      JSON.stringify({
        message: "Slack presence update complete",
        results: updateResults,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating Slack presence:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Error updating Slack presence",
        error: error,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
