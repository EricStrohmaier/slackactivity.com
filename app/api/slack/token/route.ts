import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { getUser } from "@/app/action";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return new Response(JSON.stringify("Code not provided"), { status: 400 });
  }

  // Exchange code for access token
  const tokenResponse = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI!,
    }),
  });

  const data = await tokenResponse.json();
  console.log("Slack OAuth data tokenResponse:", data);

  if (!data.ok) {
    throw new Error(data.error || "Slack OAuth failed");
  }

  // Get the current user
  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  // Save the workspace info
  const supabase = supabaseAdmin();
  const { error: upsertError } = await supabase.from("workspace").upsert({
    user_id: user.id,
    slack_auth_token: data.authed_user.access_token,
    team_name: data.team.name,
    team_id: data.team.id,
    is_active: true,
    enterprise: data.team.enterprise,
    working_hours: {
      startHour: 9,
      endHour: 17,
      daysOfWeek: [1, 2, 3, 4, 5],
      timezone: "UTC",
    },
  });

  if (upsertError) {
    console.error("Error saving workspace:", upsertError);
    throw new Error("Failed to save workspace information");
  }

  // Redirect to dashboard
  redirect(`/dashboard`);
}
