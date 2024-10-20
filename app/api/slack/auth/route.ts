import { NextResponse } from "next/server";

// This function is used to generate the Slack OAuth URL
// It's called when a user wants to authenticate with Slack
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const priceId = searchParams.get("priceId");
  const mode = searchParams.get("mode");

  const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;

  // Use the development redirect URI when in development mode
  const redirectUri = encodeURIComponent(
    `${
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI_DEV
        : process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI
    }${priceId ? `?priceId=${priceId}` : ""}${mode ? `&mode=${mode}` : ""}`
  );

  // Define the user scope for the Slack OAuth
  const userScope =
    "users.profile:read,users.profile:write,users:read,users:write";

  // Define the scopes for the Slack OAuth
  const scopes = "team:read,users:read,users:write";

  // Construct the Slack OAuth URL
  const slackOAuthUrl = `https://slack.com/oauth/v2/authorize?scope=${scopes}&user_scope=${userScope}&redirect_uri=${redirectUri}&client_id=${clientId}`;

  // Redirect the user to the Slack OAuth URL
  return NextResponse.redirect(slackOAuthUrl);
}
