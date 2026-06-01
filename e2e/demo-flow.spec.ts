import { test, expect } from "@playwright/test";

/**
 * FULL DEMO RUN-OF-SHOW — exercised end to end against the real engine + live Valiron.
 * Mirrors the demo video beat-by-beat, so a green run here means the whole demo works.
 * (Durable across the UI redesign: it relies only on the preserved data-testids + APIs.)
 */
test.describe("Demo flow — full run-of-show", () => {
  test.beforeEach(async ({ request }) => {
    await request.post("/api/dev/reset");
  });

  test("vendor launches → fan verifies & buys → scalper denied → simulation", async ({
    page,
    request,
  }) => {
    // BEAT 1 — Vendor launches a verified-fan drop.
    await page.goto("/vendor");
    await page.getByTestId("launch-button").click();
    await expect(page.getByTestId("launched-confirm")).toBeVisible({ timeout: 20_000 });
    await expect(page.getByTestId("drops-list")).toContainText("Aurora Lane");

    // The launched drop becomes the active drop fans see (drops[0]).
    const dropsRes = await request.get("/api/drops");
    const { drops } = await dropsRes.json();
    const active = drops[0];
    expect(active.event).toContain("Aurora Lane");

    // BEAT 2 — Fan proves personhood; verified agent buys at face value.
    await page.goto("/fan");
    await expect(page.getByTestId("buy-button")).toBeDisabled();
    await page.getByTestId("verify-button").click();
    await expect(page.getByTestId("verified-badge")).toBeVisible({ timeout: 30_000 });
    await page.getByTestId("buy-button").click();
    await expect(page.getByTestId("purchase-result")).toContainText(/face value/i, {
      timeout: 90_000,
    });
    await expect(page.getByTestId("purchase-result")).toContainText(/non-transferable/i);

    // BEAT 3 — Same verified human cannot grab a second ticket.
    await page.getByTestId("buy-button").click();
    await expect(page.getByTestId("purchase-result")).toContainText(
      /one ticket per verified human/i,
      { timeout: 90_000 }
    );

    // BEAT 4 — A scalper agent is denied at the trust gate (API level).
    const scalper = await request.post("/api/drop/purchase", {
      data: { dropId: active.id, agentId: "1226", chain: "solana", humanId: "scalper-x" },
    });
    expect(scalper.status()).toBe(403);
    const scalperBody = await scalper.json();
    expect(scalperBody.stage).toBe("trust");
    expect(scalperBody.trust.allow).toBe(false);

    // BEAT 5 — Split-screen simulation with the live Valiron anchor.
    await page.goto("/simulation");
    await page.getByTestId("run-button").click();
    await expect(page.getByTestId("modeA-summary")).toContainText("shut out", {
      timeout: 20_000,
    });
    await expect(page.getByTestId("modeB-summary")).toContainText("verified fans");
    await expect(page.getByTestId("live-fan")).toContainText("ALLOW", { timeout: 90_000 });
    await expect(page.getByTestId("live-scalper")).toContainText("DENY", { timeout: 90_000 });
  });
});
