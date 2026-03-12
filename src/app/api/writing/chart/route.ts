import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { writingEntries } from "@/db/schema";

const GET = async () => {
  try {
    const data = await db
      .select({
        date: writingEntries.date,
        writingType: writingEntries.writingType,
      })
      .from(writingEntries)
      .orderBy(asc(writingEntries.date));

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch chart data" },
      { status: 500 },
    );
  }
};

export { GET };
