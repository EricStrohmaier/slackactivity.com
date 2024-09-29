import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { getUser } from "@/app/action";
import { getErrorRedirect, getStatusRedirect } from "@/utils/helpers";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  let redirectPath;

  if (!code) {
    redirectPath = getErrorRedirect(
      `/`,
      "Hmm... Something went wrong.",
      "Code not provided"
    );
    return redirect(redirectPath); // Ensure redirection
  }

  // Exchange code for access token
  const tokenResponse = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: code || "",
      client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI!,
    }),
  });

  const data = await tokenResponse.json();
  console.log("Slack OAuth data tokenResponse:", data);

  if (!data.ok) {
    redirectPath = getErrorRedirect(
      `/`,
      "You could not be signed in.",
      data.error
    );
    return redirect(redirectPath); // Ensure redirection
  }

  // Get the current user
  const user = await getUser();

  if (!user) {
    console.error("User not found");
    redirectPath = getErrorRedirect(
      `/signin`,
      "You are not authenticated.",
      ""
    );
    return redirect(redirectPath); // Ensure redirection
  }

  // Save the workspace info
  const supabase = supabaseAdmin();
  const { error: upsertError } = await supabase.from("workspace").upsert({
    user_id: user?.id,
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
    redirectPath = getErrorRedirect(
      `/`,
      "Something went wrong.",
      "Workspace could not be saved"
    );
    return redirect(redirectPath); // Ensure redirection
  } else {
    redirectPath = getStatusRedirect(`/dashboard`, "Success!", "");
    return redirect(redirectPath); // Ensure redirection
  }
}
