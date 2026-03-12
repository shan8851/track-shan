import type { WritingType } from "@/types/writing";

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

export type WritingChartEntry = {
  date: string;
  writingType: WritingType;
};

export type WritingTypeBreakdownItem = {
  type: WritingType;
  label: string;
  totalEntries: number;
  fill: string;
};
