import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const vitestConfig = defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    clearMocks: true,
    restoreMocks: true,
  },
});

export default vitestConfig;
