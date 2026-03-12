import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { db } from "@/db";
import { writingEntries } from "@/db/schema";
import { updateWritingSchema } from "@/schemas/writing";

type RouteParams = { params: Promise<{ id: string }> };

const GET = async (_request: NextRequest, { params }: RouteParams) => {
  try {
    const { id } = await params;
    const [entry] = await db
      .select()
      .from(writingEntries)
      .where(eq(writingEntries.id, Number(id)));

    if (!entry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: entry });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
};

const PUT = async (request: NextRequest, { params }: RouteParams) => {
  try {
    const { id } = await params;
    const body: unknown = await request.json();
    const parsed = updateWritingSchema.parse(body);

    const [entry] = await db
      .update(writingEntries)
      .set({
        ...parsed,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(writingEntries.id, Number(id)))
      .returning();

    if (!entry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: entry });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
};

const DELETE = async (_request: NextRequest, { params }: RouteParams) => {
  try {
    const { id } = await params;
    const [entry] = await db
      .delete(writingEntries)
      .where(eq(writingEntries.id, Number(id)))
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
