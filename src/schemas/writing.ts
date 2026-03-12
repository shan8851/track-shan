import { z } from "zod/v4";

import { WRITING_TYPES } from "@/lib/constants";

export const createWritingSchema = z.object({
  date: z.iso.date(),
  writingType: z.enum(WRITING_TYPES),
  title: z.string().trim().min(1).max(200),
  url: z.string().url().max(500).nullable().optional(),
  published: z.boolean().default(false),
});

export const updateWritingSchema = z.object({
  date: z.iso.date().optional(),
  writingType: z.enum(WRITING_TYPES).optional(),
  title: z.string().trim().min(1).max(200).optional(),
  url: z.string().url().max(500).nullable().optional(),
  published: z.boolean().optional(),
});

export const writingQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});
