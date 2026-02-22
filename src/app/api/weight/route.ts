import { desc, count } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { db } from "@/db";
import { weightEntries } from "@/db/schema";
import { createWeightSchema, weightQuerySchema } from "@/schemas/weight";

const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = weightQuerySchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
    });

    const [totalResult] = await db.select({ count: count() }).from(weightEntries);
    const totalItems = totalResult?.count ?? 0;
    const totalPages = Math.ceil(totalItems / query.pageSize);

    const data = await db
      .select()
      .from(weightEntries)
      .orderBy(desc(weightEntries.date))
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize);

    return NextResponse.json({
      data,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
};

const POST = async (request: NextRequest) => {
  try {
    const body: unknown = await request.json();
    const parsed = createWeightSchema.parse(body);

    const [entry] = await db
      .insert(weightEntries)
      .values({
        date: parsed.date,
        weightKg: parsed.weightKg,
      })
      .returning();

    return NextResponse.json({ data: entry }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
};

export { GET, POST };
