import { Temporal } from 'temporal-polyfill';

export const DEFAULT_APP_TIMEZONE = process.env.DEFAULT_TIMEZONE || 'Asia/Kolkata';

/**
 * Normalizes an AI-provided date/time string into a true UTC ISO 8601 string.
 *
 * When an AI voice assistant (like Bland AI) or human caller specifies "9:30 AM",
 * they mean 9:30 AM in the salon's local timezone (e.g. Asia/Kolkata, UTC+5:30).
 * External LLMs often append "Z" directly to the wall-clock time (e.g. "2026-11-27T09:30:00.000Z"),
 * which naively treats local 9:30 AM as 9:30 AM UTC.
 *
 * This function extracts the wall-clock date and time (YYYY-MM-DD and HH:mm:ss)
 * and anchors them to the salon's designated timezone, returning the correct UTC instant.
 *
 * Example:
 *   wallClockToUtc("2026-11-27T09:30:00.000Z", "Asia/Kolkata") -> "2026-11-27T04:00:00Z"
 */
export function wallClockToUtc(input: string, timeZone: string = DEFAULT_APP_TIMEZONE): string {
  if (!input) return input;

  const trimmed = input.trim();
  const match = trimmed.match(/(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2}(?::\d{2})?)/);

  if (!match) {
    // If not matching standard YYYY-MM-DDTHH:mm pattern, return as-is
    return trimmed;
  }

  const datePart = match[1];
  let timePart = match[2];
  if (timePart.length === 5) {
    timePart += ':00';
  }

  try {
    const zdt = Temporal.ZonedDateTime.from(`${datePart}T${timePart}[${timeZone}]`);
    return zdt.toInstant().toString();
  } catch (err) {
    console.warn(`[wallClockToUtc] Failed to parse with timezone ${timeZone}, falling back to UTC`, err);
    return new Date(`${datePart}T${timePart}Z`).toISOString();
  }
}

/**
 * Generates slot start and end UTC timestamps for business hours in a given timezone.
 */
export function createSlotInTimezone(
  dateStr: string,
  hour: number,
  minute: number,
  durationMinutes: number,
  timeZone: string = DEFAULT_APP_TIMEZONE
): { startIso: string; endIso: string; formattedTime: string } {
  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${pad(hour)}:${pad(minute)}:00`;

  const startZdt = Temporal.ZonedDateTime.from(`${dateStr}T${timeStr}[${timeZone}]`);
  const endZdt = startZdt.add({ minutes: durationMinutes });

  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const formattedTime = `${pad(hour12)}:${pad(minute)} ${ampm}`;

  return {
    startIso: startZdt.toInstant().toString(),
    endIso: endZdt.toInstant().toString(),
    formattedTime,
  };
}
