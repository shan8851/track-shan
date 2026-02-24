import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { db } from "@/db";
import { dailyCheckins } from "@/db/schema";
import { upsertDailyCheckinSchema } from "@/schemas/checkin";

const todayDateString = (): string => new Date().toISOString().split("T")[0] ?? "";

const GET = async () => {
  try {
    const data = await db.select().from(dailyCheckins).orderBy(desc(dailyCheckins.date));
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch check-ins" },
      { status: 500 },
    );
  }
};

const PUT = async (request: NextRequest) => {
  try {
    const body: unknown = await request.json();
    const parsed = upsertDailyCheckinSchema.parse(body);
    const date = parsed.date ?? todayDateString();

    const [entry] = await db
      .insert(dailyCheckins)
      .values({
        date,
        mood: parsed.mood,
        stressLevel: parsed.stressLevel,
        sleepHours: parsed.sleepHours,
        coffeeCups: parsed.coffeeCups,
        hadLateMeal: parsed.hadLateMeal,
        sleepQuality: parsed.sleepQuality,
        productivity: parsed.productivity,
        energyLevel: parsed.energyLevel,
      })
      .onConflictDoUpdate({
        target: dailyCheckins.date,
        set: {
          mood: parsed.mood,
          stressLevel: parsed.stressLevel,
          sleepHours: parsed.sleepHours,
          coffeeCups: parsed.coffeeCups,
          hadLateMeal: parsed.hadLateMeal,
          sleepQuality: parsed.sleepQuality,
          productivity: parsed.productivity,
          energyLevel: parsed.energyLevel,
          updatedAt: new Date().toISOString(),
        },
      })
      .returning();

    if (!entry) {
      return NextResponse.json({ error: "Failed to save check-in" }, { status: 500 });
    }

    return NextResponse.json({ data: entry });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
};

const DELETE = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date") ?? todayDateString();

    const [entry] = await db
      .delete(dailyCheckins)
      .where(eq(dailyCheckins.date, date))
      .returning();

    if (!entry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: entry });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
};

export { GET, PUT, DELETE };
