import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getUser } from "@/lib/auth";
import { setSessionCookie } from "@/lib/auth/session";
import {
  backfillUserProfile,
  createUser,
  createWorkspace,
  findUnlinkedWorkspaceForUser,
  findWorkspaceBySlackIdentity,
  getUserByEmail,
  linkWorkspaceToSlackUser,
  refreshWorkspaceToken,
} from "@/lib/db/queries";
import { getErrorRedirect } from "@/utils/helpers";
import { slackRedirectUri } from "@/lib/slack";
import { DEFAULT_WORKING_HOURS } from "@/types/db";

interface SlackAccount {
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  /** IANA name from Slack (e.g. "Europe/Vienna"); seeds a new schedule. */
  timezone: string | null;
}

/** Slack sends a sensible `tz`, but a bad one would break every cron tick. */
function validTimezone(tz: unknown): string | null {
  if (typeof tz !== "string" || !tz) return null;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return null;
  }
}

/** Best-effort: a workspace can withhold email, and that must not break login. */
async function fetchSlackAccount(
  token: string,
  slackUserId: string
): Promise<SlackAccount> {
  const empty = {
    email: null,
    full_name: null,
    avatar_url: null,
    timezone: null,
  };
  try {
    const res = await fetch(
      `https://slack.com/api/users.info?user=${encodeURIComponent(slackUserId)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (!data.ok) return empty;

    const profile = data.user?.profile ?? {};
    return {
      email: profile.email ?? null,
      full_name: data.user?.real_name ?? profile.real_name ?? null,
      avatar_url: profile.image_192 ?? profile.image_72 ?? null,
      timezone: validTimezone(data.user?.tz),
    };
  } catch {
    return empty;
  }
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return redirect(
      getErrorRedirect("/signin", "Something went wrong.", "No code provided")
    );
  }

  // 1. Exchange the code for a user token.
  const tokenRes = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      redirect_uri: slackRedirectUri(),
    }),
  });

  const data = await tokenRes.json();

  const accessToken: string | undefined = data?.authed_user?.access_token;
  const slackUserId: string | undefined = data?.authed_user?.id;
  const teamId: string | undefined = data?.team?.id;

  if (!data?.ok || !accessToken || !slackUserId || !teamId) {
    console.error("Slack OAuth failed:", data?.error, data);
    return redirect(
      getErrorRedirect(
        "/signin",
        "You could not be signed in.",
        data?.error ?? "Slack did not return a user token"
      )
    );
  }

  const teamName: string | null = data?.team?.name ?? null;
  const { timezone, ...profile } = await fetchSlackAccount(
    accessToken,
    slackUserId
  );

  // 2. Resolve the account. Slack user ids are per-workspace, so identity is
  //    the (team_id, slack_user_id) pair.
  const existing = await findWorkspaceBySlackIdentity(teamId, slackUserId);
  let userId: string;

  if (existing) {
    // Returning user (or a re-auth after the token was revoked).
    userId = existing.user_id;
    await refreshWorkspaceToken(existing.id, accessToken, teamName);
    await backfillUserProfile(userId, profile);
  } else {
    // A logged-in user connecting an additional workspace keeps their account.
    const current = await getUser();
    // Otherwise fall back to email before minting a second account for someone
    // who already exists but whose Slack identity was never resolved.
    const priorUser =
      current ?? (profile.email ? await getUserByEmail(profile.email) : null);

    if (priorUser) {
      userId = priorUser.id;
      await backfillUserProfile(userId, profile);
    } else {
      userId = crypto.randomUUID();
      await createUser({ id: userId, ...profile });
    }

    // A known user may already have a workspace for this team that predates the
    // Slack identity columns — adopt it rather than shadowing it with a new one.
    const unlinked = priorUser
      ? await findUnlinkedWorkspaceForUser(userId, teamId)
      : null;

    if (unlinked) {
      await linkWorkspaceToSlackUser(
        unlinked.id,
        slackUserId,
        accessToken,
        teamName
      );
    } else {
      await createWorkspace({
        id: crypto.randomUUID(),
        user_id: userId,
        team_id: teamId,
        team_name: teamName,
        slack_user_id: slackUserId,
        slack_auth_token: accessToken,
        // Slack knows the user's timezone; defaulting to UTC would put the
        // schedule hours off by the user's offset on their very first tick.
        working_hours: timezone
          ? { ...DEFAULT_WORKING_HOURS, timezone }
          : undefined,
      });
    }
  }

  // 3. Issue the session and land on the dashboard.
  await setSessionCookie(userId);
  return redirect("/dashboard");
}
