import { z } from "zod/v4";

import { CHECKIN_QUALITY_VALUES } from "@/lib/constants";

const moodSchema = z.int().min(1).max(5);
const stressSchema = z.int().min(1).max(5);
const qualitySchema = z.enum(CHECKIN_QUALITY_VALUES);

export const upsertDailyCheckinSchema = z.object({
  date: z.iso.date().optional(),
  mood: moodSchema,
  stressLevel: stressSchema,
  sleepHours: z.number().min(0).max(24),
  coffeeCups: z.int().min(0).max(20),
  hadLateMeal: z.boolean(),
  sleepQuality: qualitySchema,
  productivity: qualitySchema,
  energyLevel: qualitySchema,
});
