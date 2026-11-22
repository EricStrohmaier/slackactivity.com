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
