import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { weightEntries } from "@/db/schema";

const GET = async () => {
  try {
    const data = await db
      .select({
        date: weightEntries.date,
        weightKg: weightEntries.weightKg,
      })
      .from(weightEntries)
      .orderBy(asc(weightEntries.date));

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch chart data" },
      { status: 500 },
    );
  }
};

export { GET };
