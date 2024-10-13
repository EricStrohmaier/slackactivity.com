"use client";

import React from "react";
import SharedWorkspaceDashboard from "./shared";
import { User, ActivityReport, Workspace } from "@/types/supabase";

interface MSTeamsDashboardClientProps {
  user: User;
  initialWorkspaces: Workspace[];
  initialActivityReport: ActivityReport;
}

const MSTeamsDashboardClient: React.FC<MSTeamsDashboardClientProps> = ({
  user,
  initialWorkspaces,
  initialActivityReport,
}) => {
  return (
    <SharedWorkspaceDashboard
      user={user}
      initialWorkspaces={initialWorkspaces}
      initialActivityReport={initialActivityReport}
      platformName="MS Teams"
      authEndpoint="/api/ms/auth"
    />
  );
};

export default MSTeamsDashboardClient;
