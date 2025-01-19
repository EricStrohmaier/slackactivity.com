import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { getUser } from "@/app/action";
import { getErrorRedirect, getStatusRedirect } from "@/utils/helpers";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    const redirectPath = getErrorRedirect(
      `/`,
      "Hmm... Something went wrong.",
      "Code not provided"
    );
    return redirect(redirectPath);
  }

  // Exchange code for access token
  const tokenResponse = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: code,
      client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      redirect_uri:
        process.env.NODE_ENV === "development"
          ? process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI_DEV!
          : process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI!,
    }),
  });

  const data = await tokenResponse.json();
  console.log("Slack OAuth data tokenResponse:", data);

  if (!data.ok) {
    const redirectPath = getErrorRedirect(
      `/`,
      "You could not be signed in.",
      data.error
    );
    return redirect(redirectPath);
  }

  // Get the current user
  const user = await getUser();

  if (!user) {
    console.error("User not found");
    const redirectPath = getErrorRedirect(
      `/signin`,
      "You are not authenticated.",
      ""
    );
    return redirect(redirectPath);
  }

  // Check if workspace already exists for this user
  const supabase = supabaseAdmin();
  const { data: existingWorkspace, error: fetchError } = await supabase
    .from("workspace")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching workspace:", fetchError);
    const redirectPath = getErrorRedirect(
      `/`,
      "Something went wrong.",
      "Could not check existing workspace"
    );
    return redirect(redirectPath);
  }

  // If workspace exists, redirect to dashboard
  if (existingWorkspace) {
    const redirectPath = getStatusRedirect(
      `/dashboard`,
      "Workspace already connected",
      "Redirecting to dashboard"
    );
    return redirect(redirectPath);
  }

  // Generate new workspace ID
  const workspaceId = uuidv4();

  // Create new workspace with stripe_is_paid set to true by default
  const { error: upsertError } = await supabase.from("workspace").upsert({
    id: workspaceId,
    user_id: user?.id,
    slack_auth_token: data.authed_user.access_token,
    team_name: data.team.name,
    team_id: data.team.id,
    is_active: true,
    enterprise: data.team.enterprise,
    stripe_is_paid: true, // Set to true by default since it's free
    working_hours: {
      startHour: 9,
      endHour: 17,
      daysOfWeek: [1, 2, 3, 4, 5],
      timezone: "UTC",
    },
  });

  if (upsertError) {
    console.error("Error saving workspace:", upsertError);
    const redirectPath = getErrorRedirect(
      `/`,
      "Something went wrong.",
      "Workspace could not be saved"
    );
    return redirect(redirectPath);
  }

  // Redirect directly to dashboard
  return redirect(`/dashboard`);
}
