import { z } from "zod/v4";

export const createWeightSchema = z.object({
  date: z.iso.date(),
  weightKg: z.number().positive().max(500),
});

export const updateWeightSchema = z.object({
  date: z.iso.date().optional(),
  weightKg: z.number().positive().max(500).optional(),
});

export const weightQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});
