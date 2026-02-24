import { describe, expect, it } from "vitest";

import {
  createExerciseSchema,
  exerciseQuerySchema,
  updateExerciseSchema,
} from "@/schemas/exercise";
import { upsertDailyCheckinSchema } from "@/schemas/checkin";
import {
  createWeightSchema,
  updateWeightSchema,
  weightQuerySchema,
} from "@/schemas/weight";

describe("weight schemas", () => {
  it("validates create payloads", () => {
    const valid = createWeightSchema.safeParse({
      date: "2026-02-22",
      weightKg: 74.5,
    });
    const invalid = createWeightSchema.safeParse({
      date: "2026-02-22",
      weightKg: 0,
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });

  it("allows partial updates", () => {
    const parsed = updateWeightSchema.parse({ weightKg: 73.9 });
    expect(parsed).toEqual({ weightKg: 73.9 });
  });

  it("coerces pagination query defaults and values", () => {
    expect(weightQuerySchema.parse({})).toEqual({ page: 1, pageSize: 10 });
    expect(weightQuerySchema.parse({ page: "2", pageSize: "25" })).toEqual({
      page: 2,
      pageSize: 25,
    });
  });
});

describe("exercise schemas", () => {
  it("requires customLabel for 'other' exerciseType", () => {
    const validWithLabel = createExerciseSchema.safeParse({
      date: "2026-02-22",
      exerciseType: "other",
      customLabel: "Cycling",
      durationMinutes: 50,
      effortLevel: "medium",
    });
    const invalidWithoutLabel = createExerciseSchema.safeParse({
      date: "2026-02-22",
      exerciseType: "other",
      customLabel: "",
      durationMinutes: 50,
      effortLevel: "medium",
    });

    expect(validWithLabel.success).toBe(true);
    expect(invalidWithoutLabel.success).toBe(false);
  });

  it("accepts non-other exercise type without custom label", () => {
    const parsed = createExerciseSchema.parse({
      date: "2026-02-22",
      exerciseType: "football",
      durationMinutes: 60,
      effortLevel: "high",
    });

    expect(parsed.customLabel).toBeUndefined();
  });

  it("allows partial update fields", () => {
    const parsed = updateExerciseSchema.parse({
      durationMinutes: 35,
      effortLevel: "low",
    });
    expect(parsed).toEqual({ durationMinutes: 35, effortLevel: "low" });
  });

  it("coerces pagination query defaults and values", () => {
    expect(exerciseQuerySchema.parse({})).toEqual({ page: 1, pageSize: 10 });
    expect(exerciseQuerySchema.parse({ page: "3", pageSize: "20" })).toEqual({
      page: 3,
      pageSize: 20,
    });
  });
});

describe("check-in schemas", () => {
  it("validates the expanded daily check-in payload", () => {
    const valid = upsertDailyCheckinSchema.safeParse({
      date: "2026-02-24",
      mood: 4,
      stressLevel: 2,
      sleepHours: 7.5,
      coffeeCups: 2,
      hadLateMeal: false,
      sleepQuality: "good",
      productivity: "ok",
      energyLevel: "good",
    });

    const invalid = upsertDailyCheckinSchema.safeParse({
      date: "2026-02-24",
      mood: 4,
      stressLevel: 6,
      sleepHours: 30,
      coffeeCups: -1,
      hadLateMeal: false,
      sleepQuality: "good",
      productivity: "ok",
      energyLevel: "good",
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });
});
