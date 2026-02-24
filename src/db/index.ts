import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const createDb = () => {
  const databaseUrl =
    process.env.DATABASE_URL ??
    process.env.DATABASE_URL_DIRECT ??
    process.env.DIRECT_URL;

  if (!databaseUrl) {
    throw new Error(
      "Missing database URL. Set DATABASE_URL (preferred) or DATABASE_URL_DIRECT / DIRECT_URL."
    );
  }

  const sql = neon(databaseUrl);
  return drizzle({ client: sql, schema });
};

type Database = ReturnType<typeof createDb>;

const globalForDb = globalThis as unknown as {
  db: Database | undefined;
};

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
