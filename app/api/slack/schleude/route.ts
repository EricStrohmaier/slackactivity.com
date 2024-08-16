import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { WebClient } from "@slack/web-api";
import { createClient } from "@/utils/supabase/server";

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
    const { data: users, error } = await supabase.from("users").select("*");

    if (!users || users.length === 0) {
      console.error("No users found");
      return new NextResponse(JSON.stringify({ message: "No users found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Updating Slack presence for ${users.length} users`);

    const updateResults = await Promise.all(
      users.map(async (user) => {
        try {
          const token = user.slack_auth_token;
          const workHours = user.working_hours as {
            daysOfWeek: number[];
            startHour: number;
            endHour: number;
            timezone: string;
          } | null;

          if (!token || !workHours) {
            console.error(`Missing token or work hours for user ${user.id}`);
            return;
          }

          const slack = new WebClient(token);

          // Get the current time in the user's timezone
          const now = new Date();
          const userLocalTime = new Date(
            now.toLocaleString("en-US", { timeZone: workHours.timezone })
          );

          const currentDay = userLocalTime.getDay();
          const currentHour = userLocalTime.getHours();
          const currentMinute = userLocalTime.getMinutes();

          console.log(
            `User ${user.id} local time: ${userLocalTime.toISOString()}`
          );
          console.log(
            `Current day: ${currentDay}, Current hour: ${currentHour}, Current minute: ${currentMinute}`
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
            console.log(`Setting user ${user.id} to active`);
          } else {
            await slack.users.setPresence({ presence: "away" });
            action = "set_away";
            console.log(`Setting user ${user.id} to away`);
          }

          const { data: activityLog, error: activityError } = await supabase
            .from("activity_logs")
            .insert({
              user_id: user.id,
              action: action,
              details: { currentDay, currentHour, currentMinute, workHours },
            });

          if (activityError) {
            console.error(
              `Error inserting activity log for user ${user.id}:`,
              activityError
            );
            return { id: user.id, status: "error", message: activityError };
          }

          return { id: user.id, status: "success" };
        } catch (error) {
          console.error(`Error updating presence for user ${user.id}:`, error);
          return { id: user.id, status: "error", message: error };
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
