import { defineConfig } from "@playwright/test";

/**
 * Playwright config. Phase 1 uses API tests (request fixture) — no browser
 * binaries required. UI phases will add browser projects later.
 * Timeouts are generous to absorb the Valiron edge-proxy cold start (~30-60s).
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  // Single worker: the app uses one in-memory store on the dev server, so tests
  // must run serially or their /api/dev/reset calls race and corrupt each other's state.
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
