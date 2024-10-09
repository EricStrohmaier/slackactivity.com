// app/api/ms/callback/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const tokenResponse = await fetch(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.AZURE_CLIENT_ID!,
          client_secret: process.env.AZURE_CLIENT_SECRET!,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: process.env.NEXT_PUBLIC_MS_TEAMS_REDIRECT_URI!,
        }),
      }
    );

    const data = await tokenResponse.json();
    console.log("tokenResponse", data);
    if (!tokenResponse.ok) {
      throw new Error(data.error_description || "Failed to get token");
    }

    // Here, you would typically save the token data to your database
    // For this example, we'll just return it
    return NextResponse.json({
      message: "Authentication successful",
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    });
  } catch (error) {
    console.error("Error in MS Teams callback:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
