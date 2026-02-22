export type WeightChartPoint = {
  date: string;
  weightKg: number;
};

export type ExerciseChartEntry = {
  date: string;
  exerciseType: "football" | "strength_training" | "other";
  durationMinutes: number;
};

export type HeatmapDayData = {
  date: string;
  totalMinutes: number;
  intensity: number;
};

export type TypeBreakdownItem = {
  type: string;
  label: string;
  totalMinutes: number;
  fill: string;
};
