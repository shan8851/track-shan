import type { z } from "zod/v4";

import type {
  createWritingSchema,
  updateWritingSchema,
} from "@/schemas/writing";

export type CreateWritingInput = z.infer<typeof createWritingSchema>;
export type UpdateWritingInput = z.infer<typeof updateWritingSchema>;
export type WritingType = CreateWritingInput["writingType"];

export type WritingEntry = {
  id: number;
  date: string;
  writingType: WritingType;
  title: string;
  url: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WritingStats = {
  thisWeekCount: number;
  thisMonthCount: number;
  typeBreakdown: Record<string, number>;
  currentStreak: number;
  mostActiveType: WritingType | null;
  totalEntries: number;
};
