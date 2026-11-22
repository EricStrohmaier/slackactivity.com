import { cache } from "react";
import { getSessionUserId } from "./session";
import { getUserById } from "@/lib/db/queries";
import type { User } from "@/types/db";

/**
 * Current user, or null. Memoized per request so several server components can
 * call it without re-hitting the database.
 */
export const getUser = cache(async (): Promise<User | null> => {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return getUserById(userId);
});

export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}

export async function isAdminUser(): Promise<boolean> {
  const user = await getUser();
  if (!user?.email) return false;

  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return admins.includes(user.email.toLowerCase());
}
