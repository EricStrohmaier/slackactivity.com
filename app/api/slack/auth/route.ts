import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI ||
      "https://7979-178-115-78-210.ngrok-free.app/api/slack/token"
  );
  const userScope =
    "users.profile:read,users.profile:write,users:read,users:write";
  const scopes = "team:read,users:read,users:write"; // Add any other scopes you need

  const slackOAuthUrl = `https://slack.com/oauth/v2/authorize?scope=${scopes}&user_scope=${userScope}&redirect_uri=${redirectUri}&client_id=${clientId}`;

  return NextResponse.redirect(slackOAuthUrl);
}
