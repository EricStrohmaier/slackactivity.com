// app/api/ms/get-user-info/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@microsoft/microsoft-graph-client";

export async function POST(req: NextRequest) {
  const { accessToken } = await req.json();

  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing access token" },
      { status: 400 }
    );
  }

  const authProvider = {
    getAccessToken: async () => accessToken,
  };

  const graphClient = Client.initWithMiddleware({ authProvider });

  try {
    const user = await graphClient.api("/me").get();

    return NextResponse.json(
      {
        userId: user.id,
        userPrincipalName: user.userPrincipalName,
        displayName: user.displayName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { error: "Failed to fetch user information" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
