import { test, expect } from "@playwright/test";

/**
 * Phase 2 — split-screen simulation.
 * Asserts the deterministic client-side outcome (Mode A scalpers win, Mode B verified
 * fans win) AND the live Valiron anchor (real ALLOW for the verified fan, real DENY for
 * the scalper). Live assertions get a long timeout to absorb the edge-proxy cold start.
 */
test.describe("Phase 2 — split-screen simulation", () => {
  test("Mode A scalpers win; Mode B verified fans win; live Valiron blocks the scalper", async ({
    page,
  }) => {
    await page.goto("/simulation");
    await page.getByTestId("run-button").click();

    // Deterministic client-side outcomes (after the ~2s reveal).
    await expect(page.getByTestId("modeA-summary")).toBeVisible({ timeout: 20_000 });
    await expect(page.getByTestId("modeA-summary")).toContainText("shut out");
    await expect(page.getByTestId("modeB-summary")).toContainText("verified fans");
    await expect(page.getByTestId("modeB-summary")).toContainText("blocked");

    // Live Valiron anchor (real network calls).
    await expect(page.getByTestId("live-fan")).toContainText("ALLOW", { timeout: 90_000 });
    await expect(page.getByTestId("live-fan")).toContainText(/world\s*id/i);
    await expect(page.getByTestId("live-scalper")).toContainText("DENY", { timeout: 90_000 });
  });
});
