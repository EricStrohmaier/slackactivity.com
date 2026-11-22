import React from "react";
import SharedWorkspaceDashboard from "./shared";
import { User, Workspace } from "@/types/db";

interface SlackDashboardClientProps {
  user: User;
  initialWorkspaces: Workspace[];
}

const SlackDashboardClient: React.FC<SlackDashboardClientProps> = ({
  user,
  initialWorkspaces,
}) => {
  return (
    <SharedWorkspaceDashboard
      user={user}
      initialWorkspaces={initialWorkspaces}
      platformName="Slack"
      authEndpoint="/api/slack/auth"
    />
  );
};

export default SlackDashboardClient;
