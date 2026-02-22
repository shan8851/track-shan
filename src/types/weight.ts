import type { z } from "zod/v4";

import type { createWeightSchema, updateWeightSchema } from "@/schemas/weight";

export type CreateWeightInput = z.infer<typeof createWeightSchema>;
export type UpdateWeightInput = z.infer<typeof updateWeightSchema>;

export type WeightEntry = {
  id: number;
  date: string;
  weightKg: number;
  createdAt: string;
  updatedAt: string;
};

export type WeightStats = {
  current: number | null;
  allTimeHigh: number | null;
  allTimeLow: number | null;
  change7d: number | null;
  change30d: number | null;
  change90d: number | null;
  avg30d: number | null;
  avg90d: number | null;
  trend: "up" | "down" | "stable";
  totalEntries: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};
