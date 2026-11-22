import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getErrorRedirect } from "@/utils/helpers";
import {
  GOOGLE_STATE_COOKIE,
  googleAuthorizeUrl,
  googleEnabled,
} from "@/lib/google";

export const dynamic = "force-dynamic";

/** Starts "Sign in with Google". The state cookie guards the callback (CSRF). */
export async function GET() {
  if (!googleEnabled()) {
    return redirect(
      getErrorRedirect("/signin", "Google sign-in is not available.", "Please continue with Slack.")
    );
  }

  const state = crypto.randomUUID();
  cookies().set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/google",
    maxAge: 600,
  });

  return redirect(googleAuthorizeUrl(state));
}
