import { test, expect } from "@playwright/test";

/**
 * Phase 3 — fan verify + buy flow.
 * Verify (proof-of-personhood) gates the buy; the verified agent purchases at face value;
 * a second buy by the same verified human is blocked (one ticket per human).
 */
test.describe("Phase 3 — fan verify + buy", () => {
  test.beforeEach(async ({ request }) => {
    await request.post("/api/dev/reset");
  });

  test("verify unlocks buy; ticket is face-value + non-transferable; second buy blocked", async ({
    page,
  }) => {
    await page.goto("/fan");

    // Buy is gated until verified.
    await expect(page.getByTestId("buy-button")).toBeDisabled();

    await page.getByTestId("verify-button").click();
    await expect(page.getByTestId("verified-badge")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("buy-button")).toBeEnabled();

    // First purchase — approved at face value, identity-bound.
    await page.getByTestId("buy-button").click();
    await expect(page.getByTestId("purchase-result")).toContainText(/face value/i, {
      timeout: 90_000,
    });
    await expect(page.getByTestId("purchase-result")).toContainText(/non-transferable/i);

    // Second purchase, same verified human — blocked.
    await page.getByTestId("buy-button").click();
    await expect(page.getByTestId("purchase-result")).toContainText(
      /one ticket per verified human/i,
      { timeout: 90_000 }
    );
  });
});
