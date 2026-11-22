"use server";

import { redirect } from "next/navigation";
import { slackClient } from "@/lib/slack";
import { getUser as getSessionUser } from "@/lib/auth";
import { clearSessionCookie } from "@/lib/auth/session";
import {
  deleteWorkspace,
  getWorkspaceForUser,
  logActivity,
  updateWorkspaceSettings,
} from "@/lib/db/queries";
import { isWithinWorkingHours, localNow } from "@/lib/workingHours";
import type { Workspace } from "@/types/db";

export async function getUser() {
  return getSessionUser();
}

/**
 * Kept for callers that predate the Turso migration, when the session user and
 * the `users` row were two different objects. They are the same row now.
 */
export async function getRowUser() {
  return getSessionUser();
}

export async function signOutAction() {
  clearSessionCookie();
  redirect("/");
}

export async function updateWorkspace(workspace: Workspace) {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");

  const owned = await getWorkspaceForUser(workspace.id, user.id);
  if (!owned) throw new Error("Workspace not found");

  await updateWorkspaceSettings(workspace.id, user.id, {
    working_hours: workspace.working_hours,
    is_active: workspace.is_active,
  });
}

export async function deleteWorkspaceById(workspaceId: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");

  await deleteWorkspace(workspaceId, user.id);
  return { success: true };
}

/** Push presence to Slack immediately, so saving the form has visible effect. */
export async function updateUserPresence(workspace: Workspace) {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");

  const owned = await getWorkspaceForUser(workspace.id, user.id);
  if (!owned?.slack_auth_token) return;

  const workHours = owned.working_hours;
  const { day, hour } = localNow(workHours.timezone);
  const active = isWithinWorkingHours(workHours, day, hour);

  try {
    const slack = slackClient(owned.slack_auth_token);
    await slack.users.setPresence({ presence: active ? "auto" : "away" });
    // Only `source` is worth storing — the schedule this was derived from is
    // on the workspace row, and day/hour follow from the log's timestamp.
    await logActivity(owned.id, active ? "set_active" : "set_away", {
      source: "manual_save",
    });
  } catch (error) {
    console.error("Error updating user presence:", error);
    throw error;
  }
}
