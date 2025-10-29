"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import SlackDashboardClient from "./SlackDashboard";
import { User, ActivityReport, Workspace } from "@/types/supabase";

interface DashboardSelectorProps {
  user: User;
  workspaces: Workspace[];
  activityReport: ActivityReport;
}

const DashboardSelector: React.FC<DashboardSelectorProps> = ({
  user,
  workspaces,
  activityReport,
}) => {
  const slackWorkspaces = workspaces.filter((w) => w.slack_auth_token);

  const renderConnectButtons = () => (
    <div className="flex flex-col space-y-4 items-center">
      <Button asChild variant="outline" className="w-full max-w-md">
        <Link href="/api/slack/auth">
          <Plus className="h-4 w-4 mr-2" />
          Connect Slack Workspace
        </Link>
      </Button>
    </div>
  );

  return (
    <Card className="w-full max-w-3xl mx-auto py-2 mt-10">
      <CardContent className="pt-2">
        {slackWorkspaces.length > 0 ? (
          <SlackDashboardClient
            user={user}
            initialWorkspaces={slackWorkspaces}
            initialActivityReport={activityReport}
          />
        ) : (
          <div className="text-center py-8">
            <p className="mb-4">No Slack workspaces connected.</p>
            {renderConnectButtons()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardSelector;
