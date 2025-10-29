"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState<string>(
    slackWorkspaces.length > 0 ? "slack" : "connect"
  );

  const renderConnectButtons = () => (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 items-center">
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
      <CardContent>
        <Tabs className="pt-2" value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className={`grid w-full max-w-md mx-auto ${
              slackWorkspaces.length > 0 ? "grid-cols-2" : "grid-cols-1"
            } gap-2`}
          >
            {slackWorkspaces.length > 0 && (
              <TabsTrigger value="slack">Slack</TabsTrigger>
            )}
            <TabsTrigger value="connect">Connect</TabsTrigger>
          </TabsList>
          <TabsContent value="slack">
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
          </TabsContent>

          <TabsContent value="connect">
            <div className="text-center py-8">
              <p className="mb-4">Connect a new workspace:</p>
              {renderConnectButtons()}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardSelector;
