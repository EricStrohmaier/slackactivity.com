/**
 * Transactional email via Resend's HTTP API (no SDK).
 * Needs RESEND_API_KEY and FROM_EMAIL (a sender on a domain verified in Resend).
 */

export function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.FROM_EMAIL);
}

export async function sendEmail(msg: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<boolean> {
  if (!emailEnabled()) {
    console.error("Email is not configured (RESEND_API_KEY / FROM_EMAIL).");
    return false;
  }
  const from = process.env.FROM_NAME
    ? `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`
    : process.env.FROM_EMAIL!;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [msg.to], subject: msg.subject, text: msg.text, html: msg.html }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) {
      console.error("Resend rejected email:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email send failed:", err);
    return false;
  }
}

/** Public base URL for links in emails. Never derived from request headers. */
export function siteUrl(): string {
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://slackactivity.com").replace(/\/+$/, "");
}
