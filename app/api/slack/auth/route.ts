import { NextResponse } from "next/server";
import { slackRedirectUri } from "@/lib/slack";

/**
 * Kicks off Slack OAuth. This is both "sign in" and "connect a workspace" —
 * there is no other way into the app.
 *
 * Only user scopes are requested (no bot token), which keeps the install
 * lightweight and avoids workspace-admin approval in most orgs:
 *   users:write       — users.setPresence, the entire point of the product
 *   users:read        — users.info, to name the account
 *   users:read.email  — the email shown in the dashboard (optional; the flow
 *                       still completes if a workspace withholds it)
 */
const USER_SCOPES = "users:write,users:read,users:read.email";

export async function GET() {
  const url = new URL("https://slack.com/oauth/v2/authorize");
  url.searchParams.set("client_id", process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!);
  url.searchParams.set("user_scope", USER_SCOPES);
  url.searchParams.set("redirect_uri", slackRedirectUri());

  return NextResponse.redirect(url.toString());
}
