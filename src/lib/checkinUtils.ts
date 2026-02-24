import { CHECKIN_QUALITY_LABELS, MOOD_OPTIONS } from "@/lib/constants";
import type {
  CheckinConsistencyDay,
  CheckinDistributionBucket,
  CheckinMetric,
  DailyCheckinEntry,
  DailyCheckinSummary,
  MoodValue,
} from "@/types/checkin";

export const moodEmoji = (value: number): string =>
  MOOD_OPTIONS.find((option) => option.value === value)?.emoji ?? "😐";

export const moodLabel = (value: number): string =>
  MOOD_OPTIONS.find((option) => option.value === value)?.label ?? "Unknown";

export const daysAgoString = (days: number, now: Date = new Date()): string => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0] ?? "";
};

export const filterByDays = (
  entries: readonly DailyCheckinEntry[],
  days: number,
  now: Date = new Date(),
): DailyCheckinEntry[] => {
  const cutoff = daysAgoString(days, now);
  return entries.filter((entry) => entry.date >= cutoff);
};

export const computeStreakDays = (
  entries: readonly DailyCheckinEntry[],
  now: Date = new Date(),
): number => {
  if (entries.length === 0) return 0;

  const uniqueDates = new Set(entries.map((entry) => entry.date));
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let streak = 0;

  while (true) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - streak);
    const checkDateString = checkDate.toISOString().split("T")[0] ?? "";
    if (!uniqueDates.has(checkDateString)) break;
    streak += 1;
  }

  return streak;
};

export const computeAverageMood = (
  entries: readonly DailyCheckinEntry[],
): number | null => {
  if (entries.length === 0) return null;
  const sum = entries.reduce((total, entry) => total + entry.mood, 0);
  return Math.round((sum / entries.length) * 10) / 10;
};

export const computeCheckinSummary = (
  entries: readonly DailyCheckinEntry[],
  now: Date = new Date(),
): DailyCheckinSummary => {
  const todayString = now.toISOString().split("T")[0] ?? "";
  const today = entries.find((entry) => entry.date === todayString) ?? null;
  const recent30dDays = buildRecentCheckinDays(entries, 30, now);
  const recent30d = filterByDays(entries, 30, now);

  return {
    today,
    totalEntries: entries.length,
    streakDays: computeStreakDays(entries, now),
    logged30d: recent30d.length,
    activeDays30d: recent30dDays.filter((day) => day.status !== "pre_start").length,
    averageMood30d: computeAverageMood(recent30d),
  };
};

const moodDistribution = (
  entries: readonly DailyCheckinEntry[],
): CheckinDistributionBucket[] =>
  MOOD_OPTIONS.map((option) => ({
    key: String(option.value),
    label: `${option.emoji} ${option.value}`,
    count: entries.filter((entry) => entry.mood === option.value).length,
  }));

const qualityDistribution = (
  entries: readonly DailyCheckinEntry[],
  metric: Exclude<CheckinMetric, "mood">,
): CheckinDistributionBucket[] => {
  const qualityKeys = ["bad", "ok", "good"] as const;

  return qualityKeys.map((quality) => ({
    key: quality,
    label: CHECKIN_QUALITY_LABELS[quality] ?? quality,
    count: entries.filter((entry) => entry[metric] === quality).length,
  }));
};

export const buildMetricDistribution = (
  entries: readonly DailyCheckinEntry[],
  metric: CheckinMetric,
): CheckinDistributionBucket[] =>
  metric === "mood"
    ? moodDistribution(entries)
    : qualityDistribution(entries, metric);

export const buildRecentCheckinDays = (
  entries: readonly DailyCheckinEntry[],
  days: number,
  now: Date = new Date(),
): CheckinConsistencyDay[] => {
  const entryByDate = new Map(entries.map((entry) => [entry.date, entry] as const));
  const firstCheckinDate = entries.reduce<string | null>(
    (minDate, entry) =>
      minDate === null || entry.date < minDate ? entry.date : minDate,
    null,
  );
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: days }).map((_, index) => {
    const current = new Date(today);
    current.setDate(today.getDate() - index);
    const date = current.toISOString().split("T")[0] ?? "";
    const entry = entryByDate.get(date);
    const isBeforeTrackingStart =
      !entry && firstCheckinDate !== null && date < firstCheckinDate;

    return {
      date,
      mood: (entry?.mood ?? null) as MoodValue | null,
      logged: !!entry,
      status: entry ? "logged" : isBeforeTrackingStart ? "pre_start" : "missed",
    };
  });
};

export const checkinMoodColor = (mood: MoodValue | null): string => {
  const colors: Record<number, string> = {
    1: "hsl(0, 75%, 55%, 0.35)",
    2: "hsl(25, 80%, 52%, 0.45)",
    3: "hsl(50, 80%, 50%, 0.55)",
    4: "hsl(120, 55%, 45%, 0.65)",
    5: "hsl(140, 70%, 50%, 0.8)",
  };

  if (mood === null) return "var(--secondary)";
  return colors[mood] ?? "var(--secondary)";
};
