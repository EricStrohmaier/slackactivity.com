import React, { useState, useCallback } from "react";
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
import { Clock, Plus, Trash, Check, ChevronsUpDown } from "lucide-react";
import {
  updateWorkspace,
  updateUserPresence,
  deleteWorkspaceById,
} from "@/app/action";
import { User, ActivityReport, Workspace } from "@/types/supabase";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SharedWorkspaceDashboardProps {
  user: User;
  initialWorkspaces: Workspace[];
  initialActivityReport: ActivityReport;
  platformName: "Slack";
  authEndpoint: string;
}

const SharedWorkspaceDashboard: React.FC<SharedWorkspaceDashboardProps> = ({
  user,
  initialWorkspaces,
  platformName,
  authEndpoint,
}) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    workspaces[0] || null
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [tzOpen, setTzOpen] = useState(false);
  const allTimezones = React.useMemo(
    () => Intl.supportedValuesOf("timeZone"),
    []
  );

  // Shared handlers and utility functions
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

  const handleDeleteWorkspace = useCallback(async () => {
    if (!activeWorkspace) return;
    const confirmDelete = window.confirm(
      `Delete workspace "${activeWorkspace.team_name}"? This cannot be undone.`
    );
    if (!confirmDelete) return;
    try {
      await deleteWorkspaceById(activeWorkspace.id);
      const remaining = workspaces.filter((w) => w.id !== activeWorkspace.id);
      setWorkspaces(remaining);
      setActiveWorkspace(remaining[0] || null);
      setHasUnsavedChanges(false);
      toast.success("Workspace deleted", {
        description: "The workspace has been removed from your account.",
      });
    } catch (error) {
      toast.error("Error", {
        description: `Failed to delete workspace: ${(error as Error).message}`,
      });
    }
  }, [activeWorkspace, workspaces]);

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

      // Update user presence only if the workspace is paid
      if (activeWorkspace.stripe_is_paid) {
        await updateUserPresence(activeWorkspace);
        console.log("User presence updated successfully");
      } else {
        console.log("Skipping presence update: workspace not paid");
      }

      toast.success("Workspace settings updated", {
        description:
          "Your workspace settings have been successfully saved" +
          (activeWorkspace.stripe_is_paid ? " and presence updated." : "."),
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast.error("Error", {
        description: `Failed to update workspace settings or presence: ${
          (error as Error).message
        }`,
      });
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

  const getZonedNowInfo = (tz?: string) => {
    try {
      const local = new Date();
      if (!tz) {
        return {
          day: local.getDay(),
          hour: local.getHours(),
          source: "local",
        } as const;
      }
      const fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour12: false,
        weekday: "short",
        hour: "numeric",
      });
      const parts = fmt.formatToParts(new Date());
      const weekdayShort = parts.find((p) => p.type === "weekday")?.value;
      const hourStr = parts.find((p) => p.type === "hour")?.value;
      const dayMap: Record<string, number> = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
      };
      const day =
        weekdayShort && weekdayShort in dayMap
          ? dayMap[weekdayShort]
          : local.getDay();
      const hour = hourStr ? parseInt(hourStr, 10) : local.getHours();
      return { day, hour, source: "tz" as const };
    } catch (e) {
      const fallback = new Date();
      console.warn(
        "[Presence] Timezone conversion failed, using local time",
        e
      );
      return {
        day: fallback.getDay(),
        hour: fallback.getHours(),
        source: "local" as const,
      };
    }
  };

  // Updated getCurrentActivityStatus function
  const getCurrentActivityStatus = (workspace: Workspace) => {
    if (!workspace.is_active) {
      console.log("[Presence] Workspace inactive, skipping status", {
        workspaceId: workspace.id,
        team: workspace.team_name,
        is_active: workspace.is_active,
        stripe_is_paid: workspace.stripe_is_paid,
      });
      return null; // Don't show any status if workspace is not active
    }

    const now = new Date();
    const { startHour, endHour, daysOfWeek, timezone } =
      workspace.working_hours as any;
    const zoned = getZonedNowInfo(timezone);
    const currentDay = zoned.day;
    const currentHour = zoned.hour;

    const decisionInput = {
      workspaceId: workspace.id,
      team: workspace.team_name,
      stripe_is_paid: workspace.stripe_is_paid,
      timezone,
      localNowISO: now.toISOString(),
      currentDay,
      currentHour,
      zonedSource: zoned.source,
      startHour,
      endHour,
      daysOfWeek,
    };

    const inWorkingDay = daysOfWeek?.includes?.(currentDay);
    const inWorkingHour =
      typeof currentHour === "number" &&
      typeof startHour === "number" &&
      typeof endHour === "number" &&
      currentHour >= startHour &&
      currentHour < endHour;

    const status = inWorkingDay && inWorkingHour ? "Online" : "Away";

    console.log("[Presence] Decision", {
      ...decisionInput,
      inWorkingDay,
      inWorkingHour,
      status,
    });

    return status;
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="mx-auto h-full mt-2 max-w-3xl">
      <Card className="w-full mb-2 border-none shadow-none">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              {platformName} Dashboard
            </CardTitle>
            {activeWorkspace && (
              <div className="flex items-center space-x-2">
                {!activeWorkspace.stripe_is_paid && (
                  <Badge variant="destructive">Unpaid</Badge>
                )}
                {activeWorkspace.is_active &&
                  activeWorkspace.stripe_is_paid && (
                    <Badge
                      variant={
                        getCurrentActivityStatus(activeWorkspace) === "Online"
                          ? "success"
                          : "warning"
                      }
                    >
                      {(() => {
                        const s = getCurrentActivityStatus(activeWorkspace);
                        console.log("[Presence] Rendering badge", {
                          workspaceId: activeWorkspace.id,
                          team: activeWorkspace.team_name,
                          status: s,
                        });
                        return s;
                      })()}
                    </Badge>
                  )}
              </div>
            )}
          </div>
          <CardDescription>
            Manage your {platformName} workspaces and settings
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
          <div className="mt-8">
            <div>
              {workspaces.length === 0 ? (
                <Button asChild className="w-full" variant="slim">
                  <Link href={authEndpoint}>
                    <Clock className="h-4 w-4 mr-2" />
                    Connect {platformName} Workspace
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
                          <Popover open={tzOpen} onOpenChange={setTzOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={tzOpen}
                                type="button"
                                className="w-full justify-between text-left font-normal"
                              >
                                {activeWorkspace?.working_hours.timezone ||
                                  "Select timezone"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              side="bottom"
                              align="start"
                              className="z-[9999] p-0 w-[300px] pointer-events-auto rounded-md border bg-popover shadow-md"
                              onCloseAutoFocus={(e) => e.preventDefault()}
                            >
                              <Command className="pointer-events-auto">
                                <CommandInput placeholder="Search timezone..." />
                                <CommandEmpty>No timezone found.</CommandEmpty>
                                <CommandList className="pointer-events-auto">
                                  <CommandGroup>
                                    {allTimezones.map((tz) => (
                                      <CommandItem
                                        key={tz}
                                        value={tz}
                                        className="cursor-pointer data-[disabled]:opacity-100 data-[disabled]:pointer-events-auto"
                                        onSelect={(val) => {
                                          handleInputChange("timezone", val);
                                          setTzOpen(false);
                                        }}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleInputChange("timezone", tz);
                                          setTzOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={`mr-2 h-4 w-4 ${
                                            activeWorkspace?.working_hours
                                              .timezone === tz
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        />
                                        {tz}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col md:flex-row w-full md:space-x-4 space-y-4 md:space-y-0">
            <Button asChild variant="outline" className="w-full">
              <Link href={authEndpoint}>
                <Plus className="h-4 w-4 mr-2" />
                {workspaces.length > 0
                  ? `Add Another ${platformName} Workspace`
                  : `Connect ${platformName} Workspace`}
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
            {activeWorkspace && (
              <Button
                onClick={handleDeleteWorkspace}
                className="w-full"
                variant="destructive"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Workspace
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      <div>
        <p className="text-xs text-text-700 px-4">
          Adding a workspace with Oauth will only keep you online while you are
          at your computer. It will only prevent you from going to away.{" "}
        </p>
      </div>
    </div>
  );
};

export default SharedWorkspaceDashboard;
