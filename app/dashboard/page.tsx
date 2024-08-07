"use client";

import { useEffect, useState } from "react";
import slackOperations, { UserConfig } from "../action";
import { useRouter, useSearchParams } from "next/navigation";

const Dashboard = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<string>("");
  const [startHour, setStartHour] = useState<number>(9);
  const [endHour, setEndHour] = useState<number>(17);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]);

  useEffect(() => {
    if (token) {
      const config: UserConfig = {
        token: token as string,
        workHours: { startHour, endHour, daysOfWeek },
      };

      slackOperations(config)
        .then(() => {
          setStatus("Status updated successfully!");
        })
        .catch((error) => {
          console.error(error);
          setStatus("Failed to update status.");
        });
    }
  }, [token, startHour, endHour, daysOfWeek]);

  const handleDayChange = (day: number) => {
    setDaysOfWeek((prevDays) => {
      if (prevDays.includes(day)) {
        return prevDays.filter((d) => d !== day);
      } else {
        return [...prevDays, day];
      }
    });
  };

  return (
    <div className="w-full h-screen flex justify-center mt-10">
      <h1>Dashboard</h1>
      <p>{status}</p>
      {!token && <a href="/api/slack/auth">Authenticate with Slack</a>}
      {token && (
        <div>
          <h2>Set Work Hours</h2>
          <label>
            Start Hour:
            <input
              type="number"
              value={startHour}
              onChange={(e) => setStartHour(parseInt(e.target.value, 10))}
              min="0"
              max="23"
            />
          </label>
          <label>
            End Hour:
            <input
              type="number"
              value={endHour}
              onChange={(e) => setEndHour(parseInt(e.target.value, 10))}
              min="0"
              max="23"
            />
          </label>
          <div>
            <label>Days of Week:</label>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    checked={daysOfWeek.includes(index)}
                    onChange={() => handleDayChange(index)}
                  />
                  {day}
                </label>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
