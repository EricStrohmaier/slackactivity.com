import { NextRequest } from "next/server";
import { Workspace, WorkingHours } from "@/types/supabase";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { TokenManagementService } from "@/services/TokenManagementService";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  const secretToken = request.nextUrl.searchParams.get("secret");

  if (secretToken !== process.env.MS_SCHEDULE_SECRET) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = supabaseAdmin();
  const tokenManagementService = TokenManagementService.getInstance();

  // Fetch active workspaces
  const { data: workspaces, error } = await supabase
    .from("workspace")
    .select("*")
    .eq("is_active", true)
    .eq("team_id", "Ms Teams");

  if (error) {
    console.error("Error fetching active workspaces:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching workspaces" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!workspaces || workspaces.length === 0) {
    console.error("No active workspaces found");
    return new Response(
      JSON.stringify({ message: "No active workspaces found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  console.log(
    `Updating MS Teams presence for ${workspaces.length} active workspaces`
  );

  const updateResults = await Promise.all(
    workspaces.map(async (workspace) => {
      const {
        id: workspaceId,
        user_id: userId,
        working_hours: workHours,
        stripe_is_paid: isPaid,
      } = workspace as Workspace;

      // Log activity for unpaid workspaces
      if (!isPaid) {
        console.log(`Skipping workspace ${workspaceId}: not paid`);
        await logActivity(supabase, workspaceId, "not_paid", {
          message: "Workspace is not paid",
        });
        return { id: workspaceId, status: "not_paid" };
      }

      // Skip if work hours are missing
      if (!workHours) {
        console.error(`Missing work hours for workspace ${workspaceId}`);
        return { id: workspaceId, status: "missing_data" };
      }

      try {
        // Get a valid access token
        const accessToken = await tokenManagementService.getValidAccessToken(
          userId || ""
        );

        // Get the current time in the workspace's timezone
        const now = new Date();
        const workspaceLocalTime = new Date(
          now.toLocaleString("en-US", {
            timeZone: (workHours as WorkingHours).timezone,
          })
        );

        const currentDay = workspaceLocalTime.getDay();
        const currentHour = workspaceLocalTime.getHours();
        const currentMinute = workspaceLocalTime.getMinutes();

        console.log(
          `Workspace ${workspaceId} local time: ${workspaceLocalTime.toISOString()}`
        );
        console.log(
          `Current day: ${currentDay}, Current hour: ${currentHour}, Current minute: ${currentMinute}`
        );

        let availability: string;
        let activity: string;

        if (
          (workHours as WorkingHours).daysOfWeek.includes(currentDay) &&
          (currentHour > (workHours as WorkingHours).startHour ||
            (currentHour === (workHours as WorkingHours).startHour &&
              currentMinute >= 0)) &&
          (currentHour < (workHours as WorkingHours).endHour ||
            (currentHour === (workHours as WorkingHours).endHour &&
              currentMinute === 0))
        ) {
          availability = "Available";
          activity = "Available";
          console.log(`Setting workspace ${workspaceId} to available`);
        } else {
          availability = "Away";
          activity = "Away";
          console.log(`Setting workspace ${workspaceId} to away`);
        }

        // Call the set-presence API route instead of the MS Graph API directly
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/ms/set-presence`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Include any necessary headers for internal API calls
              ...headers(),
            },
            body: JSON.stringify({
              userId,
              availability,
              activity,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update presence");
        }

        await logActivity(
          supabase,
          workspaceId,
          `set_${availability.toLowerCase()}`,
          {
            currentDay,
            currentHour,
            currentMinute,
            workHours,
          }
        );

        return { id: workspaceId, status: "success" };
      } catch (error) {
        console.error(
          `Error updating presence for workspace ${workspaceId}:`,
          error
        );
        await logActivity(supabase, workspaceId, "error", {
          error: (error as Error).message,
        });
        return {
          id: workspaceId,
          status: "error",
          message: (error as Error).message,
        };
      }
    })
  );

  return new Response(
    JSON.stringify({
      message: "MS Teams presence update complete",
      results: updateResults,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

async function logActivity(
  supabase: any,
  workspaceId: string,
  action: string,
  details: any
) {
  const { error: activityError } = await supabase.from("activity_logs").insert({
    workspace_id: workspaceId,
    action,
    details,
  });

  if (activityError) {
    console.error(
      `Error inserting activity log for workspace ${workspaceId}:`,
      activityError
    );
  }
}
