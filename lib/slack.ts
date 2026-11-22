import { WebClient } from "@slack/web-api";

/** Hard ceiling for any single HTTP request to Slack. */
export const SLACK_TIMEOUT_MS = 8_000;

/**
 * WebClient with bounded behaviour.
 *
 * The library default retries with `tenRetriesInAboutThirtyMinutes` and waits
 * out 429s, which means a single rate-limited or 5xx call can keep a request
 * alive for half an hour. Here: one quick retry, rate limits fail fast, and
 * each request is capped at SLACK_TIMEOUT_MS. The cron runs again in five
 * minutes anyway, so failing fast is always the right trade.
 */
export function slackClient(token: string): WebClient {
  return new WebClient(token, {
    timeout: SLACK_TIMEOUT_MS,
    rejectRateLimitedCalls: true,
    retryConfig: { retries: 1, factor: 1, minTimeout: 500, maxTimeout: 1_000 },
  });
}

/**
 * Slack OAuth redirect target. Must match a Redirect URL configured on the
 * Slack app exactly, including the scheme and any trailing path.
 *
 * Lives here rather than in the route file because Next.js route modules may
 * only export HTTP method handlers and route config.
 */
export function slackRedirectUri(): string {
  const uri =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI_DEV
      : process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI;

  if (!uri) throw new Error("Slack redirect URI is not configured");
  return uri;
}
