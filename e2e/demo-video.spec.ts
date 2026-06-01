import { test, expect } from "@playwright/test";

/**
 * Confirms the 120-second demo video is fully doable in the real app — beat by beat.
 * Each assertion maps to a shot in the script (timestamps noted).
 */
test.describe("Demo video — 120s shot-by-shot is doable", () => {
  test.beforeEach(async ({ request }) => {
    await request.post("/api/dev/reset");
  });

  test("every beat maps to a working screen", async ({ page }) => {
    // (0–24s) HOOK + PROBLEM — home
    await page.goto("/");
    await expect(page.locator("h1").first()).toContainText("Real fans");
    await expect(page.locator("h1").first()).toContainText("Face value");
    await expect(page.getByText(/face value on resale/i).first()).toBeVisible(); // 5–10× markup stat
    await expect(page.getByText(/BOTS Act/i).first()).toBeVisible();             // illegal under federal law

    // (24–38s) SOLUTION — one human/one ticket + two gates
    await expect(page.getByText(/one human, one ticket/i).first()).toBeVisible();
    await expect(page.getByText(/two gates/i).first()).toBeVisible();

    // (95–110s) WHY/SPONSOR + (110–120s) CLOSE — sponsor mark + tagline live on home
    await expect(page.getByText(/Built on Valiron/i).first()).toBeVisible();

    // (38–52s) DEMO TODAY + (52–66s) FACEVALUE + (66–88s) MAGIC MOMENT + (88–95s) PAYOFF — simulation
    await page.goto("/simulation");
    await page.getByTestId("run-button").click();
    await expect(page.getByTestId("modeA-summary")).toContainText("shut out", { timeout: 20_000 }); // scalpers sweep
    await expect(page.getByTestId("modeB-summary")).toContainText("verified fans");                  // FaceValue: fans win
    await expect(page.getByTestId("modeB-summary")).toContainText("Resale: 0");                       // payoff: resale killed
    await expect(page.getByTestId("live-fan")).toContainText("ALLOW", { timeout: 90_000 });           // real Valiron: verified ✓
    await expect(page.getByTestId("live-fan")).toContainText(/world\s*id/i);
    await expect(page.getByTestId("live-scalper")).toContainText("DENY", { timeout: 90_000 });         // real Valiron: swarm ✗

    // (52–66s) "the venue flips it on" — vendor pipeline toggle exists & launches
    await page.goto("/vendor");
    await expect(page.getByText("Full pipeline").first()).toBeVisible();
    await page.getByTestId("launch-button").click();
    await expect(page.getByTestId("launched-confirm")).toBeVisible({ timeout: 15_000 });

    // (88–95s) PAYOFF, fan side — identity-bound ticket at face value, can't be resold
    await page.goto("/fan");
    await page.getByTestId("verify-button").click();
    await expect(page.getByTestId("verified-badge")).toBeVisible({ timeout: 30_000 });
    await page.getByTestId("buy-button").click();
    await expect(page.getByTestId("purchase-result")).toContainText(/face value/i, { timeout: 90_000 });
    await expect(page.getByTestId("purchase-result")).toContainText(/non-transferable/i);
  });
});
