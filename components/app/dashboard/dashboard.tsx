"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Plus } from "lucide-react";
import { updateWorkspace, updateUserPresence } from "@/app/action";
import { User, ActivityReport, Workspace } from "@/types/supabase";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface DashboardClientProps {
  user: User;
  initialWorkspaces: Workspace[];
  initialActivityReport: ActivityReport;
}

const DashboardClient: React.FC<DashboardClientProps> = ({
  user,
  initialWorkspaces,
  initialActivityReport,
}) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [activityReport, setActivityReport] = useState<ActivityReport>(
    initialActivityReport
  );
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    workspaces[0] || null
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleWorkspaceChange = (workspaceId: string) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    setActiveWorkspace(workspace || null);
  };

  const handleInputChange = useCallback(
    (field: keyof Workspace["working_hours"], value: any) => {
      if (!activeWorkspace) return;
      setWorkspaces((prev) =>
        prev.map((w) =>
          w.id === activeWorkspace.id
            ? {
                ...w,
                working_hours: { ...(w.working_hours as any), [field]: value },
              }
            : w
        )
      );
      setActiveWorkspace((prev) =>
        prev
          ? {
              ...prev,
              working_hours: { ...(prev.working_hours as any), [field]: value },
            }
          : null
      );
      setHasUnsavedChanges(true);
    },
    [activeWorkspace]
  );

  const handleDayChange = useCallback(
    (day: number) => {
      if (!activeWorkspace) return;
      setWorkspaces((prev) =>
        prev.map((w) => {
          if (w.id === activeWorkspace.id) {
            const newDays = w.working_hours.daysOfWeek.includes(day)
              ? w.working_hours.daysOfWeek.filter((d) => d !== day)
              : [...w.working_hours.daysOfWeek, day].sort((a, b) => a - b);
            return {
              ...w,
              working_hours: {
                ...(w.working_hours as any),
                daysOfWeek: newDays,
              },
            };
          }
          return w;
        })
      );
      setActiveWorkspace((prev) => {
        if (!prev) return null;
        const newDays = prev.working_hours.daysOfWeek.includes(day)
          ? prev.working_hours.daysOfWeek.filter((d) => d !== day)
          : [...prev.working_hours.daysOfWeek, day].sort((a, b) => a - b);
        return {
          ...prev,
          working_hours: {
            ...(prev.working_hours as any),
            daysOfWeek: newDays,
          },
        };
      });
      setHasUnsavedChanges(true);
    },
    [activeWorkspace]
  );

  const handleSave = useCallback(async () => {
    if (!activeWorkspace) return;
    try {
      await updateWorkspace(activeWorkspace);

      // add
      await updateUserPresence(activeWorkspace);

      toast.success("Workspace settings updated", {
        description:
          "Your workspace settings have been successfully saved and presence updated.",
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error("Error", {
        description: `Failed to update workspace settings or presence: ${
          (error as Error).message
        }`,
      });
      console.error(error);
    }
  }, [activeWorkspace]);

  const handleToggleWorkspace = useCallback(
    async (workspace: Workspace) => {
      const updatedWorkspace = {
        ...workspace,
        is_active: !workspace.is_active,
      };
      try {
        await updateWorkspace(updatedWorkspace);
        setWorkspaces((prev) =>
          prev.map((w) => (w.id === workspace.id ? updatedWorkspace : w))
        );
        if (activeWorkspace && activeWorkspace.id === workspace.id) {
          setActiveWorkspace(updatedWorkspace);
        }
        toast.success("Workspace status updated", {
          description: `Workspace ${
            updatedWorkspace.is_active ? "activated" : "deactivated"
          } successfully.`,
        });
        setHasUnsavedChanges(true);
      } catch (error) {
        toast.error("Error", {
          description: `Failed to update workspace status: ${
            (error as Error).message
          }`,
        });
      }
    },
    [activeWorkspace]
  );

  // Updated getCurrentActivityStatus function
  const getCurrentActivityStatus = (workspace: Workspace) => {
    if (!workspace.stripe_is_paid) {
      return "Unpaid";
    }
    if (!workspace.is_active) {
      return "Inactive";
    }

    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const { startHour, endHour, daysOfWeek } = workspace.working_hours;

    if (
      daysOfWeek.includes(currentDay) &&
      currentHour >= startHour &&
      currentHour < endHour
    ) {
      return "Active";
    } else {
      return "Away";
    }
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="mx-auto h-full mt-32 max-w-3xl">
      <Card className="w-full mb-2">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Slack Dashboard
            </CardTitle>
            {activeWorkspace && (
              <div className="flex items-center space-x-2">
                {!activeWorkspace.stripe_is_paid && (
                  <Badge variant="destructive">Unpaid</Badge>
                )}
                <Badge
                  variant={activeWorkspace.is_active ? "default" : "default"}
                >
                  {activeWorkspace.is_active ? "Enabled" : "Disabled"}
                </Badge>
                {activeWorkspace.stripe_is_paid && (
                  <Badge
                    variant={
                      getCurrentActivityStatus(activeWorkspace) === "Active"
                        ? "success"
                        : getCurrentActivityStatus(activeWorkspace) === "Away"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {getCurrentActivityStatus(activeWorkspace)}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <CardDescription>
            Manage your Slack workspaces and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-[70%]">
                <Label htmlFor="workspace">Select Workspace</Label>
                <Select
                  value={activeWorkspace?.id}
                  onValueChange={handleWorkspaceChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.id}>
                        {workspace.team_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[30%] flex items-center justify-center space-x-2">
                <Label htmlFor="active-toggle">Workspace Active</Label>
                <Switch
                  id="active-toggle"
                  checked={activeWorkspace?.is_active || false}
                  onCheckedChange={() =>
                    activeWorkspace && handleToggleWorkspace(activeWorkspace)
                  }
                />
              </div>
            </div>
          </div>
          <Tabs className="mt-8" defaultValue="workspaces">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
              <TabsTrigger value="activity">Activity Report</TabsTrigger>
            </TabsList>
            <TabsContent value="workspaces">
              {workspaces.length === 0 ? (
                <Button asChild className="w-full" variant="slim">
                  <Link href="/api/slack/auth">
                    <Clock className="h-4 w-4 mr-2" />
                    Connect Slack Workspace
                  </Link>
                </Button>
              ) : (
                <div className="space-y-4 mt-8">
                  {activeWorkspace && (
                    <>
                      <div className="flex space-x-4 w-full">
                        <div className="w-full">
                          <Label htmlFor="startHour">Start Hour</Label>
                          <Input
                            id="startHour"
                            type="number"
                            value={
                              activeWorkspace?.working_hours.startHour || ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "startHour",
                                parseInt(e.target.value, 10)
                              )
                            }
                            min="0"
                            max="23"
                          />
                        </div>
                        <div className="w-full">
                          <Label htmlFor="endHour">End Hour</Label>
                          <Input
                            id="endHour"
                            type="number"
                            value={activeWorkspace?.working_hours.endHour || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "endHour",
                                parseInt(e.target.value, 10)
                              )
                            }
                            min="0"
                            max="23"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-4 w-full py-4">
                        <div className="w-[60%]">
                          <Label>Work Days</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {days.map((day, index) => (
                              <div
                                key={day}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`day-${index}`}
                                  checked={
                                    activeWorkspace?.working_hours.daysOfWeek.includes(
                                      index
                                    ) || false
                                  }
                                  onCheckedChange={() => handleDayChange(index)}
                                />
                                <Label htmlFor={`day-${index}`}>{day}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="w-[40%]">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select
                            value={
                              activeWorkspace?.working_hours.timezone || ""
                            }
                            onValueChange={(value) =>
                              handleInputChange("timezone", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              {Intl.supportedValuesOf("timeZone").map((tz) => (
                                <SelectItem key={tz} value={tz}>
                                  {tz}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="activity">
              {activityReport && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Activity Report (Last 7 Days)
                  </h3>
                  <p>Total Updates: {activityReport.totalUpdates}</p>
                  <p>Active: {activityReport.activePercentage.toFixed(2)}%</p>
                  <p>Away: {activityReport.awayPercentage.toFixed(2)}%</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col md:flex-row w-full md:space-x-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/api/slack/auth">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Slack Workspace
              </Link>
            </Button>
            {activeWorkspace && (
              <Button
                onClick={handleSave}
                className="w-full mb-4 md:mb-0"
                disabled={!hasUnsavedChanges}
                variant={hasUnsavedChanges ? "default" : "secondary"}
              >
                Save Workspace Settings
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardClient;
