// api/slack/schleude/route.ts
import { NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";
import { getAllUsers } from "@/lib/auth";

async function updateUserPresence(user: any) {
  const { token, workHours } = user;
  if (!token || !workHours) {
    console.error("Missing token or work hours");
    return;
  }
  const slack = new WebClient(token);

  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();

  if (
    workHours.daysOfWeek.includes(currentDay) &&
    currentHour >= workHours.startHour &&
    currentHour < workHours.endHour
  ) {
    await slack.users.setPresence({ presence: "auto" });
  } else {
    await slack.users.setPresence({ presence: "away" });
  }
}

export async function GET() {
  try {
    const users = await getAllUsers();
    if (!users || users.length === 0) {
      console.error("No users found");
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }
    console.log("Updating Slack presence for", users, users.length, "users");

    const updatePromises = users.map(updateUserPresence);
    await Promise.all(updatePromises);

    return NextResponse.json(
      { message: "Slack presence updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Slack presence:", error);
    return NextResponse.json(
      { message: "Error updating Slack presence" },
      { status: 500 }
    );
  }
}
