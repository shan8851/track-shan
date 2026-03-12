import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { writingEntries } from "@/db/schema";
import {
  computeWeeklyStreak,
  getMonthRange,
  getWeekRange,
  isDateInRange,
} from "@/lib/dateUtils";
import type { WritingStats, WritingType } from "@/types/writing";

const GET = async () => {
  try {
    const entries = await db
      .select()
      .from(writingEntries)
      .orderBy(desc(writingEntries.date));

    if (entries.length === 0) {
      const emptyStats: WritingStats = {
        thisWeekCount: 0,
        thisMonthCount: 0,
        typeBreakdown: {},
        currentStreak: 0,
        mostActiveType: null,
        totalEntries: 0,
      };
      return NextResponse.json({ data: emptyStats });
    }

    const currentWeekRange = getWeekRange();
    const currentMonthRange = getMonthRange();

    const thisWeekCount = entries.filter((entry) =>
      isDateInRange(entry.date, currentWeekRange.start, currentWeekRange.end),
    ).length;
    const thisMonthCount = entries.filter((entry) =>
      isDateInRange(entry.date, currentMonthRange.start, currentMonthRange.end),
    ).length;

    const typeBreakdown = entries.reduce<Record<string, number>>(
      (breakdown, entry) => ({
        ...breakdown,
        [entry.writingType]: (breakdown[entry.writingType] ?? 0) + 1,
      }),
      {},
    );

    const mostActiveType =
      (Object.entries(typeBreakdown).sort(([, a], [, b]) => b - a)[0]?.[0] as
        | WritingType
        | undefined) ?? null;

    const stats: WritingStats = {
      thisWeekCount,
      thisMonthCount,
      typeBreakdown,
      currentStreak: computeWeeklyStreak(entries.map((entry) => entry.date)),
      mostActiveType,
      totalEntries: entries.length,
    };

    return NextResponse.json({ data: stats });
  } catch {
    return NextResponse.json(
      { error: "Failed to compute stats" },
      { status: 500 },
    );
  }
};

export { GET };
