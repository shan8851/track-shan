import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { exerciseEntries } from "@/db/schema";
import type { ExerciseStats } from "@/types/exercise";

const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0] ?? "";
};

const GET = async () => {
  try {
    const entries = await db
      .select()
      .from(exerciseEntries)
      .orderBy(desc(exerciseEntries.date));

    if (entries.length === 0) {
      const emptyStats: ExerciseStats = {
        sessions7d: 0,
        sessions30d: 0,
        sessions90d: 0,
        duration7d: 0,
        duration30d: 0,
        duration90d: 0,
        typeBreakdown: {},
        currentStreak: 0,
        averageEffort: null,
        totalEntries: 0,
      };
      return NextResponse.json({ data: emptyStats });
    }

    const cutoff7 = daysAgo(7);
    const cutoff30 = daysAgo(30);
    const cutoff90 = daysAgo(90);

    const last7d = entries.filter((e) => e.date >= cutoff7);
    const last30d = entries.filter((e) => e.date >= cutoff30);
    const last90d = entries.filter((e) => e.date >= cutoff90);

    const typeBreakdown: Record<string, number> = {};
    for (const entry of entries) {
      const key = entry.exerciseType;
      typeBreakdown[key] = (typeBreakdown[key] ?? 0) + 1;
    }

    const effortMap = { low: 1, medium: 2, high: 3 } as const;
    const effortSum = entries.reduce(
      (acc, e) => acc + effortMap[e.effortLevel],
      0
    );
    const avgEffortNum = effortSum / entries.length;
    const averageEffort =
      avgEffortNum < 1.5 ? "low" : avgEffortNum < 2.5 ? "medium" : "high";

    const uniqueDates = [...new Set(entries.map((e) => e.date))].sort().reverse();
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < uniqueDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      const expectedStr = expectedDate.toISOString().split("T")[0];
      if (uniqueDates[i] === expectedStr) {
        currentStreak++;
      } else {
        break;
      }
    }

    const stats: ExerciseStats = {
      sessions7d: last7d.length,
      sessions30d: last30d.length,
      sessions90d: last90d.length,
      duration7d: last7d.reduce((a, e) => a + e.durationMinutes, 0),
      duration30d: last30d.reduce((a, e) => a + e.durationMinutes, 0),
      duration90d: last90d.reduce((a, e) => a + e.durationMinutes, 0),
      typeBreakdown,
      currentStreak,
      averageEffort,
      totalEntries: entries.length,
    };

    return NextResponse.json({ data: stats });
  } catch {
    return NextResponse.json(
      { error: "Failed to compute stats" },
      { status: 500 }
    );
  }
};

export { GET };
