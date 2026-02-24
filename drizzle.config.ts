import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const migrationDatabaseUrl =
  process.env.DATABASE_URL_DIRECT ??
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL;

if (!migrationDatabaseUrl) {
  throw new Error(
    "Missing database URL. Set DATABASE_URL_DIRECT, DIRECT_URL, or DATABASE_URL."
  );
}

const drizzleConfig = defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationDatabaseUrl,
  },
});

export default drizzleConfig;
