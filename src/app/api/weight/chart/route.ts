import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { weightEntries } from "@/db/schema";

const GET = async () => {
  try {
    const data = await db
      .select({
        id: weightEntries.id,
        date: weightEntries.date,
        weightKg: weightEntries.weightKg,
        createdAt: weightEntries.createdAt,
      })
      .from(weightEntries)
      .orderBy(
        asc(weightEntries.date),
        asc(weightEntries.createdAt),
        asc(weightEntries.id),
      );

    const latestWeightPerDay = new Map<string, number>();
    data.forEach((entry) => {
      latestWeightPerDay.set(entry.date, entry.weightKg);
    });

    const chartData = [...latestWeightPerDay.entries()].map(([date, weightKg]) => ({
      date,
      weightKg,
    }));

    return NextResponse.json({ data: chartData });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch chart data" },
      { status: 500 },
    );
  }
};

export { GET };
