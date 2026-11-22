import { NextResponse } from "next/server";

import { sendSlackNotification } from "@/lib/slackHook";

const TOPIC_LABELS: Record<string, string> = {
  setup: "Setup help",
  bug: "Something is broken",
  feature: "Feature request",
  account: "Account or workspace",
  privacy: "Privacy & data",
  other: "Something else",
};

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!email || !message) {
      return NextResponse.json(
        { success: false, error: "Email and message are required" },
        { status: 400 }
      );
    }

    const lines = [
      name ? `*From:* ${name} <${email}>` : `*From:* ${email}`,
      subject ? `*Topic:* ${TOPIC_LABELS[subject] ?? subject}` : null,
      "",
      message,
    ].filter((line) => line !== null);

    const delivered = await sendSlackNotification(lines.join("\n"));
    if (!delivered) {
      return NextResponse.json(
        { success: false, error: "Failed to send feedback" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending Slack notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send feedback" },
      { status: 500 }
    );
  }
}
