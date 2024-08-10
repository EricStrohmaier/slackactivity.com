import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "@/lib/auth";
import { updateUserPresence } from "@/app/action";

export async function GET(request: NextRequest) {
  // Get the secret token from the query parameters
  const secretToken = request.nextUrl.searchParams.get("secret");

  // Check if the secret token matches the environment variable
  if (secretToken !== process.env.SLACK_SCHEDULE_SECRET) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const users = await getAllUsers();
    if (!users || users.length === 0) {
      console.error("No users found");
      return new NextResponse(JSON.stringify({ message: "No users found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    console.log(`Updating Slack presence for ${users.length} users`);

    const updateResults = await Promise.all(
      users.map(async (user) => {
        try {
          await updateUserPresence(user);
          return { id: user.id, status: "success" };
        } catch (error) {
          console.error(`Error updating presence for user ${user.id}:`, error);
          return { id: user.id, status: "error", message: error };
        }
      })
    );

    return new NextResponse(
      JSON.stringify({
        message: "Slack presence update complete",
        results: updateResults,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating Slack presence:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Error updating Slack presence",
        error: error,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
