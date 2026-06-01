import { test, expect } from "@playwright/test";

/**
 * Phase 4 — vendor dashboard.
 * Launching a drop creates it in the store; it appears in the dashboard list and via the API.
 */
test.describe("Phase 4 — vendor dashboard", () => {
  test.beforeEach(async ({ request }) => {
    await request.post("/api/dev/reset");
  });

  test("launch a drop; it shows in the list and via the API", async ({ page, request }) => {
    await page.goto("/vendor");
    await page.getByTestId("launch-button").click();

    await expect(page.getByTestId("launched-confirm")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("drops-list")).toContainText("Aurora Lane");

    const res = await request.get("/api/drops");
    const body = await res.json();
    const found = (body.drops as { event: string }[]).some((d) =>
      d.event.includes("Aurora Lane")
    );
    expect(found).toBeTruthy();
  });
});
