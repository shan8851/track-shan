export const DEFAULT_PAGE_SIZE = 10;

export const EXERCISE_TYPES = ["football", "strength_training", "other"] as const;

export const EFFORT_LEVELS = ["low", "medium", "high"] as const;

export const EFFORT_COLORS: Record<string, string> = {
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
};

export const EXERCISE_TYPE_LABELS: Record<string, string> = {
  football: "Football",
  strength_training: "Strength Training",
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
