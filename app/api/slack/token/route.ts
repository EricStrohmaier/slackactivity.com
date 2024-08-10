import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

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
  console.log(data);

  if (!data.ok) {
    throw new Error(data.error || "Slack OAuth failed");
  }

  // Fetch user information
  const userInfoResponse = await fetch(
    `https://slack.com/api/users.info?user=${data.authed_user.id}`,
    {
      headers: {
        Authorization: `Bearer ${data.authed_user.access_token}`,
      },
    }
  );

  const userInfo = await userInfoResponse.json();

  if (!userInfo.ok) {
    throw new Error(userInfo.error || "Failed to fetch user info");
  }

  const supabase = createClient();

  const { data: user, error } = await supabase
    .from("users")
    .update({
      slack_auth_token: data.authed_user.access_token,
    })
    .eq("slack_user_id", data.authed_user.id);

  if (error) {
    throw new Error(error.message);
  }

  // Redirect to dashboard with access token
  redirect(`/dashboard?token=${data.authed_user.access_token}`);
}
