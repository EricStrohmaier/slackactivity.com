import { supabaseAdmin } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

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

  // Redirect to dashboard with access token
  redirect(`/dashboard?token=${data.authed_user.access_token}`);
}
