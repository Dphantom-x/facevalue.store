import { test, expect } from "@playwright/test";

/**
 * Pilot — the FULL user journey in a real browser:
 * locked onboarding wizard (account → verify → payment) → claim at face value →
 * QR ticket → staff door check-in → duplicate scan rejected.
 */
test.describe("Pilot — full fan journey", () => {
  test.beforeEach(async ({ request }) => {
    await request.post("/api/dev/reset");
  });

  test("wizard onboarding → claim → QR → door check-in (once)", async ({ page, browser }) => {
    const email = `fan-${Date.now()}@test.dev`;

    // 1) Drop page locks behind the onboarding wizard.
    await page.goto("/drop/fv-humans-only-001");
    await expect(page.getByTestId("wizard-overlay")).toBeVisible({ timeout: 20_000 });

    // Step 1 — account
    await page.getByTestId("wizard-email").fill(email);
    await page.getByTestId("wizard-password").fill("password123");
    await page.getByTestId("wizard-account-submit").click();

    // Step 2 — verify personhood
    await expect(page.getByTestId("wizard-verify-btn")).toBeVisible({ timeout: 15_000 });
    await page.getByTestId("wizard-verify-btn").click();

    // Step 3 — payment method
    await expect(page.getByTestId("wizard-payment-btn")).toBeVisible({ timeout: 15_000 });
    await page.getByTestId("wizard-payment-btn").click();

    // Done — wizard unlocks the page
    await expect(page.getByTestId("wizard-done-close")).toBeVisible({ timeout: 15_000 });
    await page.getByTestId("wizard-done-close").click();
    await expect(page.getByTestId("wizard-overlay")).toHaveCount(0);

    // 2) Claim at face value (hold → allocate → capture).
    await expect(page.getByTestId("claim-button")).toBeVisible({ timeout: 15_000 });
    await page.getByTestId("claim-button").click();
    await expect(page.getByTestId("claim-result")).toContainText(/face value/i, { timeout: 30_000 });
    await expect(page.getByTestId("claim-result")).toContainText(/non-transferable/i);

    // 3) Ticket is mine — QR rendered on the drop page and /tickets.
    await expect(page.getByTestId("your-ticket")).toBeVisible();
    await page.goto("/tickets");
    await expect(page.getByTestId("ticket-card")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("ticket-qr")).toBeVisible({ timeout: 15_000 });

    // Grab the raw QR token via the API (same cookie jar as the page).
    const tickets = await (await page.request.get("/api/me/tickets")).json();
    const qrToken: string = tickets.tickets[0].qrToken;
    expect(qrToken).toBeTruthy();

    // 4) Staff checks the ticket in at the door (separate browser context).
    const staff = await browser.newContext();
    const door = await staff.newPage();
    await door.goto("/door");
    await door.getByTestId("door-login-email").fill("vendor@facevalue.store");
    await door.getByTestId("door-login-password").fill("pilot-vendor-2026");
    await door.getByTestId("door-login-btn").click();

    await expect(door.getByTestId("door-input")).toBeVisible({ timeout: 15_000 });
    await door.getByTestId("door-input").fill(qrToken);
    await door.getByTestId("door-check").click();
    await expect(door.getByTestId("door-result")).toContainText(/checked in/i, { timeout: 15_000 });

    // 5) Duplicate scan is rejected loudly.
    await door.getByTestId("door-input").fill(qrToken);
    await door.getByTestId("door-check").click();
    await expect(door.getByTestId("door-result")).toContainText(/already checked in/i);

    await staff.close();
  });

  test("/tickets locks behind the wizard when logged out", async ({ page }) => {
    await page.goto("/tickets");
    await expect(page.getByTestId("wizard-overlay")).toBeVisible({ timeout: 20_000 });
  });
});
