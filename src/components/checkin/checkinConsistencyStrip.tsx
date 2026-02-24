"use client";

import { useMemo } from "react";

import {
  buildRecentCheckinDays,
  checkinMoodColor,
  moodEmoji,
} from "@/lib/checkinUtils";
import { formatDate } from "@/lib/formatters";
import type { DailyCheckinEntry } from "@/types/checkin";

type CheckinConsistencyStripProps = {
  entries: readonly DailyCheckinEntry[];
  days?: number;
};

export const CheckinConsistencyStrip = ({
  entries,
  days = 30,
}: CheckinConsistencyStripProps) => {
  const stripDays = useMemo(
    () => buildRecentCheckinDays(entries, days),
    [days, entries],
  );

  const loggedCount = stripDays.filter((day) => day.status === "logged").length;
  const activeDays = stripDays.filter((day) => day.status !== "pre_start").length;

  const cellColor = (status: "logged" | "missed" | "pre_start", mood: number | null): string => {
    if (status === "pre_start") return "transparent";
    if (status === "missed") return "var(--secondary)";
    return checkinMoodColor(mood as 1 | 2 | 3 | 4 | 5 | null);
  };

  return (
    <div className="border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Consistency ({days}d)
        </h3>
        <p className="text-xs text-muted-foreground">
          {activeDays === 0 ? "No check-ins yet" : `${loggedCount}/${activeDays} logged`}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {stripDays.map((day) => (
            <span
              key={day.date}
              className="inline-block h-4 w-4 border border-border/70 shrink-0"
              style={{ backgroundColor: cellColor(day.status, day.mood) }}
              title={
                day.status === "logged"
                  ? `${formatDate(day.date)}: ${moodEmoji(day.mood ?? 3)} mood ${day.mood}`
                  : day.status === "missed"
                    ? `${formatDate(day.date)}: no check-in`
                    : `${formatDate(day.date)}: before tracking started`
              }
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 border border-border/70 bg-transparent" />
          Pre-start
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 border border-border/70 bg-secondary" />
          Missed
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block h-3 w-3 border border-border/70"
            style={{ backgroundColor: checkinMoodColor(1) }}
          />
          Low mood
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block h-3 w-3 border border-border/70"
            style={{ backgroundColor: checkinMoodColor(5) }}
          />
          High mood
        </span>
        <span>Start: today</span>
      </div>
    </div>
  );
};
