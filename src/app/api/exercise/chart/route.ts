import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { exerciseEntries } from "@/db/schema";

const GET = async () => {
  try {
    const data = await db
      .select({
        date: exerciseEntries.date,
        exerciseType: exerciseEntries.exerciseType,
        durationMinutes: exerciseEntries.durationMinutes,
      })
      .from(exerciseEntries)
      .orderBy(asc(exerciseEntries.date));

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch chart data" },
      { status: 500 },
    );
  }
};

export { GET };
