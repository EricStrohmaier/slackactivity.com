import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";
import { backfillUserProfile, createUser, getUserByEmail } from "@/lib/db/queries";
import { getErrorRedirect } from "@/utils/helpers";
import { GOOGLE_STATE_COOKIE, fetchGoogleProfile, googleEnabled } from "@/lib/google";

export const dynamic = "force-dynamic";

function fail(description: string) {
  return redirect(getErrorRedirect("/signin", "You could not be signed in.", description));
}

/**
 * Google OAuth callback. Signs into the account with the same (verified) email,
 * or creates one. A brand-new account has no workspace yet, so the dashboard
 * prompts for "Connect Slack Workspace".
 */
export async function GET(req: NextRequest) {
  if (!googleEnabled()) return fail("Google sign-in is not available.");

  const params = req.nextUrl.searchParams;
  const expected = cookies().get(GOOGLE_STATE_COOKIE)?.value;
  cookies().set(GOOGLE_STATE_COOKIE, "", { path: "/api/auth/google", maxAge: 0 });

  if (params.get("error")) return fail(params.get("error")!);
  const code = params.get("code");
  if (!code || !expected || params.get("state") !== expected) {
    return fail("The sign-in link expired. Please try again.");
  }

  let profile;
  try {
    profile = await fetchGoogleProfile(code);
  } catch (err) {
    console.error("Google sign-in failed:", err);
  }
  if (!profile) return fail("Google did not confirm a verified email address.");

  const existing = await getUserByEmail(profile.email);
  let userId: string;
  if (existing) {
    userId = existing.id;
    await backfillUserProfile(userId, profile);
  } else {
    userId = crypto.randomUUID();
    await createUser({ id: userId, ...profile });
  }

  await setSessionCookie(userId);
  return redirect("/dashboard");
}
