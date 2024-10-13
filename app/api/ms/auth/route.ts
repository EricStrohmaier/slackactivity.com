import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const clientId = process.env.AZURE_CLIENT_ID;
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_MS_TEAMS_REDIRECT_URI!
  );

  const scopes = encodeURIComponent(
    "openid profile offline_access email User.Read Presence.Read Presence.ReadWrite"
  );

  const tenantId =
    req.nextUrl.searchParams.get("accountType") === "work"
      ? "organizations"
      : "common";

  // Generate a unique state value
  const state = uuidv4();

  // TODO: Store this state value in your database or session storage
  // This is crucial for preventing CSRF attacks
  // await storeState(state);

  const msTeamsAuthUrl =
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?` +
    `client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${redirectUri}` +
    `&response_mode=query` +
    `&scope=${scopes}` +
    `&state=${state}` +
    `&prompt=consent`;

  return NextResponse.redirect(msTeamsAuthUrl);
}
