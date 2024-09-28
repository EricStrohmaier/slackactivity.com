"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Plus } from "lucide-react";
import { updateWorkingHours } from "@/app/action";
import { User, WorkingHours, ActivityReport } from "@/types/supabase";
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

interface DashboardClientProps {
  user: User;
  initialWorkingHours: WorkingHours;
  initialActivityReport: ActivityReport;
}

const DashboardClient: React.FC<DashboardClientProps> = ({
  user,
  initialWorkingHours,
  initialActivityReport,
}) => {
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    ...initialWorkingHours,
    daysOfWeek: initialWorkingHours.daysOfWeek || [],
  });
  const [activityReport, setActivityReport] = useState<ActivityReport>(
    initialActivityReport
  );
  const [status, setStatus] = useState("");
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  const handleInputChange = useCallback(
    (field: keyof WorkingHours, value: any) => {
      setWorkingHours((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleDayChange = useCallback((day: number) => {
    setWorkingHours((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day].sort((a, b) => a - b),
    }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await updateWorkingHours(workingHours, user.id);
      toast.success("Working hours updated", {
        description: "Your working hours have been successfully saved.",
      });
    } catch (error) {
      toast.error("Error", {
        description: `Failed to update working hours: ${
          (error as Error).message
        }`,
      });
      console.error(error);
    }
  }, [workingHours, user.id]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="mx-auto h-full mt-32 max-w-3xl">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Slack Dashboard</CardTitle>
          <CardDescription>
            Manage your Slack settings and view activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="settings">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="activity">Activity Report</TabsTrigger>
            </TabsList>
            <TabsContent value="settings">
              {!user.slack_auth_token ? (
                <Button asChild className="w-full" variant="slim">
                  <Link href="/api/slack/auth">
                    <Clock className="h-4 w-4 mr-2" />
                    Connect Slack
                  </Link>
                </Button>
              ) : (
                <div className="space-y-4 mt-4">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="startHour">Start Hour</Label>
                      <Input
                        id="startHour"
                        type="number"
                        value={workingHours.startHour}
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
                    <div className="flex-1">
                      <Label htmlFor="endHour">End Hour</Label>
                      <Input
                        id="endHour"
                        type="number"
                        value={workingHours.endHour}
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
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={workingHours.timezone}
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
                  <div>
                    <Label>Work Days</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {days.map((day, index) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${index}`}
                            checked={workingHours.daysOfWeek?.includes(index)}
                            onCheckedChange={() => handleDayChange(index)}
                          />
                          <Label htmlFor={`day-${index}`}>{day}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
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
      </Card>

      {user.slack_auth_token && (
        <div className="md:flex md:justify-center md:space-x-2 w-full">
          <Button onClick={handleSave} className="mb-2 md:mb-0 w-full">
            Save Working Hours
          </Button>
          <Button asChild variant="slim" className="w-full">
            <Link href="/api/slack/auth">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Slack Workspace
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardClient;
