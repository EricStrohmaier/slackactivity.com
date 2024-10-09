// app/api/ms/auth/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.AZURE_CLIENT_ID;
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_MS_TEAMS_REDIRECT_URI!
  );

  // Use officially documented scopes for Microsoft Graph API
  const scopes = encodeURIComponent(
    "openid profile offline_access email User.Read Presence.Read Presence.ReadWrite"
  );

  // Determine the account type (common for both, organizations for work accounts only)
  const tenantId =
    req.nextUrl.searchParams.get("accountType") === "work"
      ? "organizations"
      : "common";

  const msTeamsAuthUrl =
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?` +
    `client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${redirectUri}` +
    `&response_mode=query` +
    `&scope=${scopes}` +
    `&prompt=consent`; // Added to ensure consent is always requested

  return NextResponse.redirect(msTeamsAuthUrl);
}
