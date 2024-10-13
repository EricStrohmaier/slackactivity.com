import { NextRequest, NextResponse } from "next/server";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenManagementService } from "@/services/TokenManagementService";

export async function POST(req: NextRequest) {
  const { userId, availability, activity } = await req.json();

  if (!userId || !availability || !activity) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const tokenManagementService = TokenManagementService.getInstance();

  try {
    const accessToken = await tokenManagementService.getValidAccessToken(
      userId
    );

    const authProvider = {
      getAccessToken: async () => accessToken,
    };

    const graphClient = Client.initWithMiddleware({ authProvider });

    console.log("Attempting to fetch user profile...");
    const user = await graphClient.api("/me").get();
    console.log("User profile retrieved successfully:", user.displayName);

    console.log(`Attempting to set presence for user ${user.id}...`);
    await graphClient.api(`/users/${user.id}/presence/setPresence`).post({
      sessionId: process.env.AZURE_CLIENT_ID,
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
    if (error.message.includes("No token found for user")) {
      errorMessage = "User not authenticated";
    } else if (error.code === "InvalidAuthenticationToken") {
      errorMessage = "The access token is invalid or has expired";
    } else if (error.code === "AccessDenied") {
      errorMessage = "The application doesn't have the necessary permissions";
    }
    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
