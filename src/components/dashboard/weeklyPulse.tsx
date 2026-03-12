"use client";

import { useCheckinEntries } from "@/hooks/useCheckin";
import { useExerciseChart } from "@/hooks/useExercise";
import { useWeightStats } from "@/hooks/useWeight";
import { useWritingStats } from "@/hooks/useWriting";
import { computeCheckinSummary, moodEmoji } from "@/lib/checkinUtils";
import { WRITING_TYPE_LABELS } from "@/lib/constants";
import { getWeekRange, isDateInRange } from "@/lib/dateUtils";
import { formatDelta, formatDuration, formatTrend } from "@/lib/formatters";

type PulseIndicatorProps = {
  label: string;
  value: string;
  meta?: string;
  valueClassName?: string;
  trendClassName?: string;
};

const PulseIndicator = ({
  label,
  value,
  meta,
  valueClassName = "text-foreground",
  trendClassName = "text-muted-foreground",
}: PulseIndicatorProps) => (
  <div className="bg-background px-4 py-3">
    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
      {label}
    </p>
    <div className="mt-2 flex items-start justify-between gap-3">
      <p className={`text-lg font-bold leading-none ${valueClassName}`}>
        {value}
      </p>
      {meta ? (
        <p className={`text-[11px] uppercase tracking-[0.24em] ${trendClassName}`}>
          {meta}
        </p>
      ) : null}
    </div>
  </div>
);

const formatAverageSleep = (sleepHours: number[]): string =>
  sleepHours.length > 0
    ? `${(sleepHours.reduce((total, value) => total + value, 0) / sleepHours.length).toFixed(1)}h`
    : "—";

const formatMoodValue = (averageMood: number | null): string =>
  averageMood === null ? "—" : `${moodEmoji(Math.round(averageMood))} ${averageMood.toFixed(1)}`;

const moodTrendDirection = (
  currentWeekMood: number | null,
  previousWeekMood: number | null,
): "up" | "down" | "stable" => {
  if (currentWeekMood === null || previousWeekMood === null) return "stable";
  if (currentWeekMood > previousWeekMood) return "up";
  if (currentWeekMood < previousWeekMood) return "down";
  return "stable";
};

const moodTrendClassName = (trend: "up" | "down" | "stable"): string =>
  trend === "up"
    ? "text-signal-green"
    : trend === "down"
      ? "text-signal-red"
      : "text-muted-foreground";

const weightDeltaClassName = (delta: number | null): string =>
  delta === null || delta === 0
    ? "text-foreground"
    : delta < 0
      ? "text-signal-green"
      : "text-signal-red";

export const WeeklyPulse = () => {
  const { data: checkinEntries } = useCheckinEntries();
  const { data: exerciseEntries } = useExerciseChart();
  const { data: weightStats } = useWeightStats();
  const { data: writingStats } = useWritingStats();

  const currentWeekRange = getWeekRange();
  const previousWeekRange = getWeekRange(new Date(), -1);

  const currentWeekCheckins = (checkinEntries ?? []).filter((entry) =>
    isDateInRange(entry.date, currentWeekRange.start, currentWeekRange.end),
  );
  const previousWeekCheckins = (checkinEntries ?? []).filter((entry) =>
    isDateInRange(entry.date, previousWeekRange.start, previousWeekRange.end),
  );
  const currentWeekExerciseEntries = (exerciseEntries ?? []).filter((entry) =>
    isDateInRange(entry.date, currentWeekRange.start, currentWeekRange.end),
  );

  const currentWeekAverageMood =
    currentWeekCheckins.length > 0
      ? currentWeekCheckins.reduce((total, entry) => total + entry.mood, 0) /
        currentWeekCheckins.length
      : null;
  const previousWeekAverageMood =
    previousWeekCheckins.length > 0
      ? previousWeekCheckins.reduce((total, entry) => total + entry.mood, 0) /
        previousWeekCheckins.length
      : null;
  const moodTrend = moodTrendDirection(
    currentWeekAverageMood,
    previousWeekAverageMood,
  );
  const moodTrendLabel =
    currentWeekAverageMood === null || previousWeekAverageMood === null
      ? undefined
      : formatTrend(moodTrend);

  const exerciseSessions = currentWeekExerciseEntries.length;
  const exerciseDuration = currentWeekExerciseEntries.reduce(
    (total, entry) => total + entry.durationMinutes,
    0,
  );
  const sleepAverage = formatAverageSleep(
    currentWeekCheckins.map((entry) => entry.sleepHours),
  );
  const checkinSummary = computeCheckinSummary(checkinEntries ?? []);
  const weightDelta =
    weightStats?.change7d === null || weightStats?.change7d === undefined
      ? "—"
      : formatDelta(weightStats.change7d, "kg");
  const writingPieces = writingStats?.thisWeekCount ?? 0;
  const writingMeta =
    writingStats?.currentStreak ?
      `${writingStats.currentStreak}w streak` :
      writingStats?.mostActiveType ?
        WRITING_TYPE_LABELS[writingStats.mostActiveType] ??
        writingStats.mostActiveType :
        undefined;

  return (
    <section
      className="border border-border bg-chrome-800"
      data-testid="weekly-pulse"
    >
      <div className="border-b border-border px-4 py-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Weekly Pulse
          </p>
          <p className="text-xs text-muted-foreground">
            {currentWeekRange.start} to {currentWeekRange.end}
          </p>
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-6">
        <PulseIndicator
          label="Mood Trend"
          value={formatMoodValue(currentWeekAverageMood)}
          meta={moodTrendLabel}
          valueClassName="text-terminal"
          trendClassName={moodTrendClassName(moodTrend)}
        />
        <PulseIndicator
          label="Weight Delta"
          value={weightDelta}
          valueClassName={weightDeltaClassName(weightStats?.change7d ?? null)}
        />
        <PulseIndicator
          label="Exercise"
          value={`${exerciseSessions} session${exerciseSessions === 1 ? "" : "s"}`}
          meta={exerciseDuration > 0 ? formatDuration(exerciseDuration) : "—"}
        />
        <PulseIndicator
          label="Sleep Avg"
          value={sleepAverage}
        />
        <PulseIndicator
          label="Streak"
          value={`${checkinSummary.streakDays} days`}
          valueClassName="text-terminal"
        />
        <PulseIndicator
          label="Writing"
          value={`${writingPieces} piece${writingPieces === 1 ? "" : "s"}`}
          meta={writingMeta}
        />
      </div>
    </section>
  );
};
