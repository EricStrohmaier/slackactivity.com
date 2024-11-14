import { NextResponse } from "next/server";

import { sendSlackNotification } from "@/lib/slackHook";

export async function POST(request: Request) {
  try {
    const { email, message } = await request.json();

    if (!email || !message) {
      return NextResponse.json(
        { success: false, error: "Email and message are required" },
        { status: 400 }
      );
    }

    await sendSlackNotification(`From: ${email}\n\nMessage: ${message}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending Slack notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send feedback" },
      { status: 500 }
    );
  }
}
