import type { z } from "zod/v4";

import type {
  createExerciseSchema,
  updateExerciseSchema,
} from "@/schemas/exercise";

export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;

export type ExerciseEntry = {
  id: number;
  date: string;
  exerciseType: "football" | "strength_training" | "other";
  customLabel: string | null;
  durationMinutes: number;
  effortLevel: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
};

export type ExerciseStats = {
  sessions7d: number;
  sessions30d: number;
  sessions90d: number;
  duration7d: number;
  duration30d: number;
  duration90d: number;
  typeBreakdown: Record<string, number>;
  currentStreak: number;
  averageEffort: string | null;
  totalEntries: number;
};
