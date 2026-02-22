import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { weightEntries } from "@/db/schema";
import type { WeightStats } from "@/types/weight";

const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0] ?? "";
};

const computeChange = (
  entries: { date: string; weightKg: number }[],
  days: number
): number | null => {
  if (entries.length === 0) return null;
  const cutoff = daysAgo(days);
  const current = entries[0];
  const pastEntries = entries.filter((e) => e.date <= cutoff);
  const past = pastEntries[0];
  if (!current || !past) return null;
  return current.weightKg - past.weightKg;
};

const computeAvg = (
  entries: { date: string; weightKg: number }[],
  days: number
): number | null => {
  const cutoff = daysAgo(days);
  const filtered = entries.filter((e) => e.date >= cutoff);
  if (filtered.length === 0) return null;
  const sum = filtered.reduce((acc, e) => acc + e.weightKg, 0);
  return Math.round((sum / filtered.length) * 10) / 10;
};

const GET = async () => {
  try {
    const entries = await db
      .select({ date: weightEntries.date, weightKg: weightEntries.weightKg })
      .from(weightEntries)
      .orderBy(desc(weightEntries.date));

    if (entries.length === 0) {
      const emptyStats: WeightStats = {
        current: null,
        allTimeHigh: null,
        allTimeLow: null,
        change7d: null,
        change30d: null,
        change90d: null,
        avg30d: null,
        avg90d: null,
        trend: "stable",
        totalEntries: 0,
      };
      return NextResponse.json({ data: emptyStats });
    }

    const weights = entries.map((e) => e.weightKg);
    const current = entries[0]?.weightKg ?? null;
    const allTimeHigh = Math.max(...weights);
    const allTimeLow = Math.min(...weights);

    const recentEntries = entries.slice(0, 7);
    let trend: "up" | "down" | "stable" = "stable";
    if (recentEntries.length >= 2) {
      const first = recentEntries[recentEntries.length - 1]?.weightKg ?? 0;
      const last = recentEntries[0]?.weightKg ?? 0;
      const diff = last - first;
      if (diff > 0.5) trend = "up";
      else if (diff < -0.5) trend = "down";
    }

    const stats: WeightStats = {
      current,
      allTimeHigh,
      allTimeLow,
      change7d: computeChange(entries, 7),
      change30d: computeChange(entries, 30),
      change90d: computeChange(entries, 90),
      avg30d: computeAvg(entries, 30),
      avg90d: computeAvg(entries, 90),
      trend,
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
