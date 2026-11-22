"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { setSessionCookie } from "@/lib/auth/session";
import { normalizeEmail, rateLimited, verifyPassword } from "@/lib/auth/password";
import { getPasswordLogin } from "@/lib/db/queries";

function to(path: string, params: Record<string, string>): never {
  redirect(`${path}?${new URLSearchParams(params).toString()}`);
}

function clientIp(): string {
  return headers().get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * Email + password sign-in for accounts whose password was imported from
 * Supabase Auth. There is no email sending (no reset link, no email sign-up):
 * anyone without a password, or who forgot it, signs in with Slack or Google,
 * which match the account by email. One generic error, so it doesn't reveal
 * which emails exist.
 */
export async function signInWithPasswordAction(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const fail = (msg = "Wrong email or password.") =>
    to("/signin", { error_description: msg, ...(email ? { email } : {}) });

  if (!email || !password) fail();
  if (
    rateLimited(`login:ip:${clientIp()}`, 30, 15 * 60_000) ||
    rateLimited(`login:email:${email}`, 8, 15 * 60_000)
  ) {
    fail("Too many attempts. Wait 15 minutes, or continue with Slack or Google.");
  }

  const account = await getPasswordLogin(email!);
  const ok = await verifyPassword(password, account?.password_hash ?? null);
  if (!ok || !account) fail();

  await setSessionCookie(account!.id);
  redirect("/dashboard");
}
