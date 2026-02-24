import type { z } from "zod/v4";

import type { upsertDailyCheckinSchema } from "@/schemas/checkin";

export type CheckinQuality = "bad" | "ok" | "good";
export type MoodValue = 1 | 2 | 3 | 4 | 5;
export type CheckinMetric = "mood" | "sleepQuality" | "productivity" | "energyLevel";

export type UpsertDailyCheckinInput = z.infer<typeof upsertDailyCheckinSchema>;

export type DailyCheckinEntry = {
  id: number;
  date: string;
  mood: MoodValue;
  sleepQuality: CheckinQuality;
  productivity: CheckinQuality;
  energyLevel: CheckinQuality;
  createdAt: string;
  updatedAt: string;
};

export type DailyCheckinSummary = {
  today: DailyCheckinEntry | null;
  totalEntries: number;
  streakDays: number;
  logged30d: number;
  activeDays30d: number;
  averageMood30d: number | null;
};

export type CheckinDistributionBucket = {
  key: string;
  label: string;
  count: number;
};

export type CheckinConsistencyDay = {
  date: string;
  mood: MoodValue | null;
  logged: boolean;
  status: "logged" | "missed" | "pre_start";
};
