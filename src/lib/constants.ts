export const DEFAULT_PAGE_SIZE = 10;

export const EXERCISE_TYPES = ["football", "strength_training", "other"] as const;

export const WRITING_TYPES = [
  "blog_post",
  "runbook_docs",
  "tweet",
  "other",
] as const;

export const EFFORT_LEVELS = ["low", "medium", "high"] as const;

export const CHECKIN_QUALITY_VALUES = ["bad", "ok", "good"] as const;

export const CHECKIN_QUALITY_LABELS: Record<string, string> = {
  bad: "Bad",
  ok: "OK",
  good: "Good",
};

export const MOOD_OPTIONS = [
  { value: 1, emoji: "😞", label: "Very Low" },
  { value: 2, emoji: "😕", label: "Low" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
] as const;

export const STRESS_OPTIONS = [
  { value: 1, emoji: "😌", label: "Calm" },
  { value: 2, emoji: "🙂", label: "Light" },
  { value: 3, emoji: "😐", label: "Medium" },
  { value: 4, emoji: "😬", label: "High" },
  { value: 5, emoji: "🤯", label: "Maxed" },
] as const;

export const CHECKIN_METRICS = [
  "mood",
  "stressLevel",
  "sleepQuality",
  "productivity",
  "energyLevel",
] as const;

export const CHECKIN_METRIC_LABELS: Record<string, string> = {
  mood: "Mood",
  stressLevel: "Stress",
  sleepQuality: "Sleep",
  productivity: "Productivity",
  energyLevel: "Energy",
};

export const CHECKIN_TIME_RANGES = [
  { label: "30d", days: 30 },
  { label: "60d", days: 60 },
  { label: "90d", days: 90 },
  { label: "1y", days: 365 },
] as const;

export const EFFORT_COLORS: Record<string, string> = {
  low: "border-signal-green/35 bg-signal-green/15 text-signal-green",
  medium: "border-signal-orange/35 bg-signal-orange/15 text-signal-orange",
  high: "border-signal-red/35 bg-signal-red/15 text-signal-red",
};

export const EXERCISE_TYPE_LABELS: Record<string, string> = {
  football: "Football",
  strength_training: "Strength Training",
  other: "Other",
};

export const WRITING_TYPE_LABELS: Record<string, string> = {
  blog_post: "Blog Post",
  runbook_docs: "Runbook / Docs",
  tweet: "Tweet",
  other: "Other",
};

export const HEIGHT_CM = 175;

export const WEIGHT_GOAL_MIN = 70;
export const WEIGHT_GOAL_MAX = 75;

export const WEIGHT_TIME_RANGES = [
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "1y", days: 365 },
  { label: "All", days: null },
] as const;

export type TimeRangeLabel = (typeof WEIGHT_TIME_RANGES)[number]["label"];
export type CheckinTimeRangeLabel = (typeof CHECKIN_TIME_RANGES)[number]["label"];
