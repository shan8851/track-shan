import { neon } from "@neondatabase/serverless";

const getResetDatabaseUrl = (): string => {
  const url = process.env.TEST_DATABASE_URL_DIRECT ?? process.env.TEST_DATABASE_URL;

  if (!url) {
    throw new Error(
      "Missing E2E database URL. Set TEST_DATABASE_URL_DIRECT (preferred) or TEST_DATABASE_URL."
    );
  }

  return url;
};

const assertDatabaseResetEnabled = (): void => {
  if (process.env.ALLOW_TEST_DB_RESET !== "true") {
    throw new Error(
      "E2E DB reset is disabled. Set ALLOW_TEST_DB_RESET=true to run Playwright tests."
    );
  }
};

export const resetE2eDatabase = async (): Promise<void> => {
  assertDatabaseResetEnabled();
  const sql = neon(getResetDatabaseUrl());
  try {
    await sql`TRUNCATE TABLE daily_checkins RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE exercise_entries RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE weight_entries RESTART IDENTITY CASCADE`;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown DB reset error";
    throw new Error(
      `Failed to reset E2E database. Ensure schema is applied to TEST_DATABASE_URL via 'bun run db:push'. Details: ${message}`,
    );
  }
};
