import type { WorkingHours } from "@/types/db";

/**
 * Whether a given local day/hour falls inside the configured working hours.
 * Supports overnight windows (startHour > endHour, e.g. 22 -> 6): the
 * post-midnight part belongs to the shift that started the previous day.
 */
export function isWithinWorkingHours(
  workHours: WorkingHours,
  day: number, // 0 = Sunday ... 6 = Saturday
  hour: number // 0-23
): boolean {
  const { startHour, endHour, daysOfWeek } = workHours;

  if (!Array.isArray(daysOfWeek)) return false;

  if (startHour < endHour) {
    return daysOfWeek.includes(day) && hour >= startHour && hour < endHour;
  }

  // Overnight window (e.g. 22 -> 6). startHour === endHour means 24h.
  if (hour >= startHour) {
    return daysOfWeek.includes(day);
  }
  if (hour < endHour || startHour === endHour) {
    // Early-morning part of a shift that started yesterday.
    return daysOfWeek.includes((day + 6) % 7);
  }
  return false;
}

/** Hours per configured workday, handling overnight windows. */
export function configuredHoursPerDay(workHours: WorkingHours): number {
  const { startHour, endHour } = workHours;
  if (startHour === endHour) return 24;
  return startHour < endHour ? endHour - startHour : 24 - startHour + endHour;
}

/**
 * Current weekday and hour in an IANA timezone.
 *
 * Uses Intl parts rather than the `new Date(date.toLocaleString())` round-trip,
 * which misparses in several locales and drifts across DST boundaries.
 */
export function localNow(timezone?: string): { day: number; hour: number } {
  const now = new Date();
  if (!timezone) return { day: now.getDay(), hour: now.getHours() };

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour12: false,
      weekday: "short",
      hour: "numeric",
    }).formatToParts(now);

    const days: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    const weekday = parts.find((p) => p.type === "weekday")?.value;
    const hourRaw = parts.find((p) => p.type === "hour")?.value;

    return {
      day: weekday && weekday in days ? days[weekday] : now.getDay(),
      // en-US hour12:false can render midnight as "24".
      hour: hourRaw ? parseInt(hourRaw, 10) % 24 : now.getHours(),
    };
  } catch {
    return { day: now.getDay(), hour: now.getHours() };
  }
}
