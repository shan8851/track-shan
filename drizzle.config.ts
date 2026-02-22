import { defineConfig } from "drizzle-kit";

const drizzleConfig = defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "sqlite.db",
  },
});

export default drizzleConfig;
