import React from "react";
import SharedWorkspaceDashboard from "./shared";
import { User, ActivityReport, Workspace } from "@/types/supabase";

interface SlackDashboardClientProps {
  user: User;
  initialWorkspaces: Workspace[];
  initialActivityReport: ActivityReport;
}

const SlackDashboardClient: React.FC<SlackDashboardClientProps> = ({
  user,
  initialWorkspaces,
  initialActivityReport,
}) => {
  return (
    <SharedWorkspaceDashboard
      user={user}
      initialWorkspaces={initialWorkspaces}
      initialActivityReport={initialActivityReport}
      platformName="Slack"
      authEndpoint="/api/slack/auth"
    />
  );
};

export default SlackDashboardClient;
