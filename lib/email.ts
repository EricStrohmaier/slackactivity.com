/**
 * Transactional email via Cloudflare Email Sending (HTTP API, no SDK).
 * Needs CLOUDFLARE_API_TOKEN (Email Sending: Edit), CLOUDFLARE_ACCOUNT_ID and
 * EMAIL_FROM, a sender on a domain set up for Email Sending in Cloudflare.
 */

const TIMEOUT_MS = 8_000;

export function emailEnabled(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_API_TOKEN &&
      process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.EMAIL_FROM
  );
}

export async function sendEmail(msg: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<boolean> {
  if (!emailEnabled()) {
    console.error("Email is not configured (CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID / EMAIL_FROM).");
    return false;
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: { address: process.env.EMAIL_FROM, name: process.env.EMAIL_FROM_NAME || "Slackactivity" },
          to: msg.to,
          subject: msg.subject,
          text: msg.text,
          html: msg.html,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      }
    );
    const body = await res.json().catch(() => null);
    const result = body?.result;
    // Accepted means delivered or queued; a bounce or suppression is a failure.
    const accepted = (result?.delivered?.length ?? 0) + (result?.queued?.length ?? 0) > 0;
    if (!res.ok || !body?.success || !accepted) {
      console.error("Cloudflare Email Sending rejected email:", res.status, JSON.stringify(body?.errors ?? result ?? body));
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
