import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";

const applicationPort = process.env.PLAYWRIGHT_PORT ?? "3001";
const databaseUrl = process.env.TEST_DATABASE_URL ?? "";
const directDatabaseUrl = process.env.TEST_DATABASE_URL_DIRECT ?? "";

const playwrightConfig = defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://127.0.0.1:${applicationPort}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `PORT=${applicationPort} bun run build && PORT=${applicationPort} bun run start`,
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      DATABASE_URL_DIRECT: directDatabaseUrl,
      DIRECT_URL: directDatabaseUrl,
    },
    url: `http://127.0.0.1:${applicationPort}`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
});

export default playwrightConfig;
