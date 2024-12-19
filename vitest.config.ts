import { defineConfig } from "vitest/config";


export default defineConfig({
  test: {
    environment: "jsdom", // Use jsdom for browser-like testing
    globals: true, // Enable Jest-like global APIs (e.g., `describe`, `it`)
    setupFiles: ["./vitest.setup.ts"], // Optional: setup file for mocking, etc.
    coverage: {
      reporter: ["text", "json", "html"], // Enable code coverage reporting
    },
  },
});
