import { count, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { db } from "@/db";
import { writingEntries } from "@/db/schema";
import { createWritingSchema, writingQuerySchema } from "@/schemas/writing";

const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = writingQuerySchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
    });

    const [totalResult] = await db.select({ count: count() }).from(writingEntries);
    const totalItems = totalResult?.count ?? 0;
    const totalPages = Math.ceil(totalItems / query.pageSize);

    const data = await db
      .select()
      .from(writingEntries)
      .orderBy(desc(writingEntries.date))
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
      { status: 400 },
    );
  }
};

const POST = async (request: NextRequest) => {
  try {
    const body: unknown = await request.json();
    const parsed = createWritingSchema.parse(body);

    const [entry] = await db
      .insert(writingEntries)
      .values({
        date: parsed.date,
        writingType: parsed.writingType,
        title: parsed.title,
        url: parsed.url ?? null,
        published: parsed.published,
      })
      .returning();

    return NextResponse.json({ data: entry }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
};

export { GET, POST };
