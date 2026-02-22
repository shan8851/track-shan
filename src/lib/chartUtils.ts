import type {
  ExerciseChartEntry,
  HeatmapDayData,
  WeightChartPoint,
} from "@/types/charts";

export const computeMovingAverage = (
  data: readonly WeightChartPoint[],
  windowSize: number,
): (number | null)[] =>
  data.map((_, index) => {
    if (index < windowSize - 1) return null;
    const windowSlice = data.slice(index - windowSize + 1, index + 1);
    const sum = windowSlice.reduce((acc, point) => acc + point.weightKg, 0);
    return Number((sum / windowSize).toFixed(1));
  });

export const filterByTimeRange = <T extends { date: string }>(
  data: readonly T[],
  days: number | null,
): T[] => {
  if (days === null) return [...data];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffString = cutoff.toISOString().split("T")[0] ?? "";
  return data.filter((entry) => entry.date >= cutoffString);
};

export const computeBmi = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};

export const bmiCategory = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

export const aggregateExerciseByDay = (
  entries: readonly ExerciseChartEntry[],
): Map<string, number> => {
  const dayMap = new Map<string, number>();
  entries.forEach((entry) => {
    const existing = dayMap.get(entry.date) ?? 0;
    dayMap.set(entry.date, existing + entry.durationMinutes);
  });
  return dayMap;
};

type YearGridDay = {
  date: string;
  col: number;
  row: number;
};

export const generateYearGrid = (endDate: Date): YearGridDay[] => {
  const days: YearGridDay[] = [];
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  const endDow = end.getDay();
  const startOffset = 52 * 7 + endDow;
  const start = new Date(end);
  start.setDate(end.getDate() - startOffset);

  for (let i = 0; i <= startOffset; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    const dow = current.getDay();
    const col = Math.floor(i / 7);
    days.push({
      date: current.toISOString().split("T")[0] ?? "",
      col,
      row: dow,
    });
  }

  return days;
};

export const computeIntensityLevels = (
  dayMap: Map<string, number>,
): Map<string, number> => {
  const values = [...dayMap.values()].filter((v) => v > 0).sort((a, b) => a - b);
  if (values.length === 0) return new Map();

  const quintiles = [0.2, 0.4, 0.6, 0.8].map((q) => {
    const index = Math.floor(q * values.length);
    return values[Math.min(index, values.length - 1)] ?? 0;
  });

  const intensityMap = new Map<string, number>();
  dayMap.forEach((minutes, date) => {
    if (minutes === 0) {
      intensityMap.set(date, 0);
      return;
    }
    const level =
      minutes <= (quintiles[0] ?? 0) ? 1 :
      minutes <= (quintiles[1] ?? 0) ? 2 :
      minutes <= (quintiles[2] ?? 0) ? 3 :
      minutes <= (quintiles[3] ?? 0) ? 4 : 5;
    intensityMap.set(date, level);
  });

  return intensityMap;
};

export const heatmapColor = (intensity: number): string => {
  const opacities: Record<number, string> = {
    0: "var(--secondary)",
    1: "hsl(140, 70%, 50%, 0.15)",
    2: "hsl(140, 70%, 50%, 0.35)",
    3: "hsl(140, 70%, 50%, 0.55)",
    4: "hsl(140, 70%, 50%, 0.75)",
    5: "hsl(140, 70%, 50%, 0.95)",
  };
  return opacities[intensity] ?? "var(--secondary)";
};

export const buildHeatmapData = (
  grid: YearGridDay[],
  dayMap: Map<string, number>,
  intensityMap: Map<string, number>,
): HeatmapDayData[] =>
  grid.map((day) => ({
    date: day.date,
    totalMinutes: dayMap.get(day.date) ?? 0,
    intensity: intensityMap.get(day.date) ?? 0,
  }));
