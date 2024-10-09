// app/api/ms/set-presence/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Client } from "@microsoft/microsoft-graph-client";
import { v4 as uuidv4 } from "uuid";
import { jwtDecode } from "jwt-decode";

export async function POST(req: NextRequest) {
  const { accessToken, availability, activity } = await req.json();

  if (!accessToken || !availability || !activity) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  // Decode the token to check its contents
  try {
    const decodedToken: any = jwtDecode(accessToken);
    console.log("Token scopes:", decodedToken.scp || decodedToken.scope);
    console.log(
      "Token expiration:",
      new Date(decodedToken.exp * 1000).toISOString()
    );

    // Check if token is expired
    if (decodedToken.exp * 1000 < Date.now()) {
      return NextResponse.json(
        { error: "Access token has expired" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return NextResponse.json(
      { error: "Invalid access token" },
      { status: 400 }
    );
  }

  const authProvider = {
    getAccessToken: async () => accessToken,
  };

  const graphClient = Client.initWithMiddleware({ authProvider });

  try {
    // First, let's get the user's profile to ensure the token is valid and get the user ID
    console.log("Attempting to fetch user profile...");
    const user = await graphClient.api("/me").get();
    console.log("User profile retrieved successfully:", user.displayName);

    // Now, let's set the presence using the user's ID
    console.log(`Attempting to set presence for user ${user.id}...`);
    await graphClient.api(`/users/${user.id}/presence/setPresence`).post({
      sessionId: uuidv4(),
      availability: availability,
      activity: activity,
      expirationDuration: "PT1H",
    });

    return NextResponse.json(
      { message: "Presence updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating presence:", error);
    let errorMessage = "Failed to update presence";
    if (error.code === "InvalidAuthenticationToken") {
      errorMessage = "The access token is invalid or has expired";
    } else if (error.code === "AccessDenied") {
      errorMessage = "The application doesn't have the necessary permissions";
    }
    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
        fullError: JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
