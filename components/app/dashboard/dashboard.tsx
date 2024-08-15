"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, AlertCircle } from "lucide-react";
import { generateActivityReport, updateWorkingHours } from "@/app/action";
import { User } from "@/types/supabase";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = ({ user }: { user: User }) => {
  const [status, setStatus] = useState("");
  const [startHour, setStartHour] = useState<number>();
  const [endHour, setEndHour] = useState<number>();
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>();
  const [timezone, setTimezone] = useState<string>();
  const [initialSaveDone, setInitialSaveDone] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  const [activityReport, setActivityReport] = useState<{
    totalUpdates: number;
    activeUpdates: number;
    awayUpdates: number;
    activePercentage: number;
    awayPercentage: number;
  } | null>(null);

  useEffect(() => {
    async function fetchActivityReport() {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const response = await generateActivityReport(
        user.id,
        startDate,
        endDate
      );
      setActivityReport(response);
    }

    if (user.id) {
      fetchActivityReport();
    }
  }, [user.id]);

  useEffect(() => {
    if (user.working_hours) {
      setStartHour(
        (user.working_hours as { startHour?: number }).startHour || 9
      );
      setEndHour((user.working_hours as { endHour?: number }).endHour || 17);
      setDaysOfWeek(
        (user.working_hours as { daysOfWeek?: number[] }).daysOfWeek || [
          1, 2, 3, 4, 5,
        ]
      );
      setTimezone(
        (user.working_hours as { timezone?: string }).timezone || "UTC"
      );
    }
  }, [user]);

  useEffect(() => {
    if (!initialSaveDone && user.id) {
      handleSave();
      setInitialSaveDone(true);
    }
  }, [user.id, initialSaveDone]);

  const handleDayChange = (day: number) => {
    setDaysOfWeek((prevDays) =>
      prevDays?.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays!, day].sort((a, b) => a - b)
    );
    handleSave();
  };

  const handleSave = async () => {
    const workingHours = {
      startHour,
      endHour,
      daysOfWeek,
      timezone,
    };

    try {
      await updateWorkingHours(workingHours as any, user.id);
      const now = new Date();
      setLastUpdateTime(now);
      setStatus(
        `Working hours updated successfully at ${now.toLocaleTimeString()}`
      );
    } catch (error) {
      setStatus(`Failed to update working hours: ${(error as Error).message}`);
      console.error(error);
    }
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="mx-auto h-full mt-32">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Slack Dashboard</CardTitle>
          <CardDescription>Manage your Slack work hours</CardDescription>
        </CardHeader>
        <CardContent>
          {!user.slack_auth_token ? (
            <Button asChild className="w-full" variant="slim">
              <Link href="/api/slack/auth">
                <Clock className="h-4 w-4 mr-2" />
                Connect Slack
              </Link>
            </Button>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="startHour">Start Hour</Label>
                    <Input
                      id="startHour"
                      type="number"
                      value={startHour}
                      onChange={(e) => {
                        setStartHour(parseInt(e.target.value, 10));
                        handleSave();
                      }}
                      min="0"
                      max="23"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="endHour">End Hour</Label>
                    <Input
                      id="endHour"
                      type="number"
                      value={endHour}
                      onChange={(e) => {
                        setEndHour(parseInt(e.target.value, 10));
                        handleSave();
                      }}
                      min="0"
                      max="23"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={timezone}
                    onValueChange={(value) => {
                      setTimezone(value);
                      handleSave();
                    }}
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
                          checked={daysOfWeek?.includes(index)}
                          onCheckedChange={() => {
                            handleDayChange(index);
                            handleSave();
                          }}
                        />
                        <Label htmlFor={`day-${index}`}>{day}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          {status && (
            <Alert
              variant={status.includes("success") ? "default" : "destructive"}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Status Update</AlertTitle>
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}
        </CardFooter>

        {activityReport && (
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">
              Activity Report (Last 7 Days)
            </h3>
            <p>Total Updates: {activityReport.totalUpdates}</p>
            <p>Active: {activityReport.activePercentage.toFixed(2)}%</p>
            <p>Away: {activityReport.awayPercentage.toFixed(2)}%</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
