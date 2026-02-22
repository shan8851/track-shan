export const formatDate = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatWeight = (kg: number): string => `${kg.toFixed(1)} kg`;

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const formatDelta = (value: number, unit: string): string => {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} ${unit}`;
};

export const formatTrend = (trend: "up" | "down" | "stable"): string => {
  const symbols: Record<string, string> = {
    up: "↑",
    down: "↓",
    stable: "→",
  };
  return symbols[trend] ?? "→";
};

export const todayDateString = (): string => {
  return new Date().toISOString().split("T")[0] ?? "";
};
