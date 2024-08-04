import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Extract the code parameter from the query string
  const code = req.nextUrl.searchParams.get("code");

  // Check if the code parameter is missing
  if (!code) {
    return new Response(JSON.stringify("Code not provided"), { status: 400 });
  }

  // Make a POST request to Slack's OAuth endpoint to exchange the code for an access token
  const response = await fetch("https://slack.com/api/oauth.v2.access", {
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

  const data = await response.json();
  console.log(data);

  // Check if the response indicates a failure
  if (!data.ok) {
    throw new Error(data.error || "Slack OAuth failed");
  }

  redirect(`/dashboard?token=${data.authed_user.access_token}`);
}
