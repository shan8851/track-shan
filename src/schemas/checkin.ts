import { z } from "zod/v4";

import { CHECKIN_QUALITY_VALUES } from "@/lib/constants";

const moodSchema = z.int().min(1).max(5);
const stressSchema = z.int().min(1).max(5);
const qualitySchema = z.enum(CHECKIN_QUALITY_VALUES);
const hhmmTimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/u, "Use HH:MM format");

export const upsertDailyCheckinSchema = z
  .object({
    date: z.iso.date().optional(),
    mood: moodSchema,
    stressLevel: stressSchema,
    sleepHours: z.number().min(0).max(24),
    coffeeCups: z.int().min(0).max(20),
    lastCoffeeAt: hhmmTimeSchema.nullable().default(null),
    hadLateMeal: z.boolean(),
    sleepQuality: qualitySchema,
    productivity: qualitySchema,
    energyLevel: qualitySchema,
  })
  .refine(
    (value) => !(value.coffeeCups === 0 && value.lastCoffeeAt !== null),
    {
      message: "Last coffee time should be empty when coffee cups is 0",
      path: ["lastCoffeeAt"],
    },
  );
