import { z } from "zod/v4";

import { EFFORT_LEVELS, EXERCISE_TYPES } from "@/lib/constants";

export const createExerciseSchema = z
  .object({
    date: z.iso.date(),
    exerciseType: z.enum(EXERCISE_TYPES),
    customLabel: z.string().max(100).nullable().optional(),
    durationMinutes: z.number().int().positive().max(1440),
    effortLevel: z.enum(EFFORT_LEVELS),
  })
  .refine(
    (data) =>
      data.exerciseType !== "other" ||
      (data.customLabel?.trim().length ?? 0) > 0,
    {
      message: "Custom label is required when exercise type is 'other'",
      path: ["customLabel"],
    }
  );

export const updateExerciseSchema = z.object({
  date: z.iso.date().optional(),
  exerciseType: z.enum(EXERCISE_TYPES).optional(),
  customLabel: z.string().max(100).nullable().optional(),
  durationMinutes: z.number().int().positive().max(1440).optional(),
  effortLevel: z.enum(EFFORT_LEVELS).optional(),
});

export const exerciseQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});
