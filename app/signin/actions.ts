"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { setSessionCookie } from "@/lib/auth/session";
import {
  hashPassword,
  newEmailToken,
  normalizeEmail,
  passwordProblem,
  rateLimited,
  sha256,
  verifyPassword,
} from "@/lib/auth/password";
import {
  consumeEmailToken,
  createEmailToken,
  createUser,
  getPasswordLogin,
  setUserPassword,
} from "@/lib/db/queries";
import { emailEnabled, sendEmail, siteUrl } from "@/lib/email";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function to(path: string, params: Record<string, string>): never {
  redirect(`${path}?${new URLSearchParams(params).toString()}`);
}

function clientIp(): string {
  return headers().get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** Email + password sign-in. One generic error, so it doesn't reveal which emails exist. */
export async function signInWithPasswordAction(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const fail = (msg = "Wrong email or password.") =>
    to("/signin", { view: "password", error_description: msg, ...(email ? { email } : {}) });

  if (!email || !password) fail();
  if (
    rateLimited(`login:ip:${clientIp()}`, 30, 15 * 60_000) ||
    rateLimited(`login:email:${email}`, 8, 15 * 60_000)
  ) {
    fail("Too many attempts. Wait 15 minutes, or set a new password by email.");
  }

  const account = await getPasswordLogin(email!);
  const ok = await verifyPassword(password, account?.password_hash ?? null);
  if (!ok || !account) fail();

  await setSessionCookie(account!.id);
  redirect("/dashboard");
}

/**
 * "Set a password": covers forgotten passwords, old accounts that never had
 * one, and new sign-ups. Nothing changes until the emailed link is confirmed,
 * which proves the address. The response is the same whether or not the email
 * has an account.
 */
export async function requestPasswordAction(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  if (!email) to("/signin", { view: "set-password", error_description: "Enter a valid email address." });
  const problem = passwordProblem(password);
  if (problem) to("/signin", { view: "set-password", error_description: problem, email: email! });
  if (!emailEnabled()) {
    to("/signin", { view: "set-password", error_description: "Email sign-in is unavailable right now. Please continue with Slack or Google." });
  }

  const throttled =
    rateLimited(`setpw:ip:${clientIp()}`, 10, 60 * 60_000) ||
    rateLimited(`setpw:email:${email}`, 3, 60 * 60_000);

  if (!throttled) {
    const { token, tokenHash } = newEmailToken();
    await createEmailToken({
      tokenHash,
      email: email!,
      passwordHash: await hashPassword(password),
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
    });

    const link = `${siteUrl()}/signin/confirm?token=${token}`;
    // Sent for any address, account or not, so reporting a failed send leaks
    // nothing about which emails have accounts.
    const sent = await sendEmail({
      to: email!,
      subject: "Confirm your Slackactivity password",
      text:
        `Confirm the new password for your Slackactivity account:\n\n${link}\n\n` +
        `The link works once and expires in 1 hour. If you didn't ask for this, ignore this email; nothing changes.`,
      html:
        `<p>Confirm the new password for your Slackactivity account:</p>` +
        `<p><a href="${link}">Confirm and sign in</a></p>` +
        `<p style="color:#666">The link works once and expires in 1 hour. ` +
        `If you didn't ask for this, ignore this email; nothing changes.</p>`,
    });
    if (!sent) {
      to("/signin", {
        view: "set-password",
        email: email!,
        error_description:
          "We couldn't send the email right now. Please try again later, or continue with Slack or Google.",
      });
    }
  }

  to("/signin", {
    view: "password",
    notice: `If ${email} can receive email, a confirmation link is on its way. It expires in 1 hour.`,
  });
}

/**
 * Applies the password from a confirmed link and signs in. A POST from the
 * confirm page, not the link's GET, so email scanners that prefetch links
 * can't use up the token.
 */
export async function confirmPasswordAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const pending = token ? await consumeEmailToken(sha256(token)) : null;
  if (!pending) {
    to("/signin", {
      view: "set-password",
      error_description: "That link is invalid, already used, or expired. Request a new one.",
    });
  }

  const existing = await getPasswordLogin(pending!.email);
  let userId: string;
  if (existing) {
    userId = existing.id;
    await setUserPassword(userId, pending!.password_hash);
  } else {
    userId = crypto.randomUUID();
    await createUser({ id: userId, email: pending!.email });
    await setUserPassword(userId, pending!.password_hash);
  }

  await setSessionCookie(userId);
  redirect("/dashboard");
}
