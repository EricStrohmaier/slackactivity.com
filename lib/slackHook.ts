const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL; // Add your Slack webhook URL to your .env file

/**
 * Returns false when the message could not be delivered, so callers (the
 * contact form) can tell the sender to email instead of silently dropping it.
 */
export async function sendSlackNotification(message: string): Promise<boolean> {
  if (!SLACK_WEBHOOK_URL) {
    console.error("Slack webhook URL is not configured.");
    return false;
  }

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
    if (!response.ok) {
      console.error(
        "Slack webhook returned an error",
        response.status,
        await response.text().catch(() => "")
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send Slack notification", error);
    return false;
  }
}
