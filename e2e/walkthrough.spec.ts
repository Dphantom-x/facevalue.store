import { test, expect } from "@playwright/test";

/**
 * Manual-walkthrough simulator — clicks through the ENTIRE pilot journey in a
 * real browser and saves a screenshot at every step to walkthrough/.
 * Run explicitly:  $env:WALKTHROUGH="1"; npx playwright test walkthrough
 */
test.skip(!process.env.WALKTHROUGH, "screenshot walkthrough runs only when WALKTHROUGH=1");

const SHOT = (n: string) => ({ path: `walkthrough/${n}.png`, fullPage: false });

test("full pilot walkthrough with screenshots", async ({ page, browser, request }) => {
  test.setTimeout(180_000);
  await request.post("/api/dev/reset");
  await page.setViewportSize({ width: 1280, height: 800 });

  // 01 — drops list
  await page.goto("/drops");
  await expect(page.getByTestId("pilot-drop-row").first()).toBeVisible({ timeout: 20_000 });
  await page.screenshot(SHOT("01-drops-list"));

  // 02 — drop page locks behind the wizard (account step)
  await page.goto("/drop/fv-humans-only-001");
  await expect(page.getByTestId("wizard-overlay")).toBeVisible({ timeout: 20_000 });
  await page.screenshot(SHOT("02-wizard-account"));

  // 03 — signup → verify step
  await page.getByTestId("wizard-email").fill(`walkthrough-${Date.now()}@test.dev`);
  await page.getByTestId("wizard-password").fill("password123");
  await page.getByTestId("wizard-account-submit").click();
  await expect(page.getByTestId("wizard-verify-btn")).toBeVisible({ timeout: 15_000 });
  await page.screenshot(SHOT("03-wizard-verify"));

  // 04 — verify → payment step
  await page.getByTestId("wizard-verify-btn").click();
  await expect(page.getByTestId("wizard-payment-btn")).toBeVisible({ timeout: 15_000 });
  await page.screenshot(SHOT("04-wizard-payment"));

  // 05 — payment → done
  await page.getByTestId("wizard-payment-btn").click();
  await expect(page.getByTestId("wizard-done-close")).toBeVisible({ timeout: 15_000 });
  await page.screenshot(SHOT("05-wizard-done"));

  // 06 — unlocked drop page, live claim
  await page.getByTestId("wizard-done-close").click();
  await expect(page.getByTestId("claim-button")).toBeVisible({ timeout: 15_000 });
  await page.screenshot(SHOT("06-drop-live"));

  // 07 — claim → confirmed + QR
  await page.getByTestId("claim-button").click();
  await expect(page.getByTestId("claim-result")).toContainText(/face value/i, { timeout: 30_000 });
  await expect(page.getByTestId("ticket-qr")).toBeVisible({ timeout: 15_000 });
  await page.screenshot(SHOT("07-claimed-qr"));

  // 08 — my tickets
  await page.goto("/tickets");
  await expect(page.getByTestId("ticket-qr")).toBeVisible({ timeout: 15_000 });
  await page.screenshot(SHOT("08-my-tickets"));

  // 09 — pre-drop countdown state (Vol. 002)
  await page.goto("/drop/fv-humans-only-002");
  await expect(page.getByTestId("drop-countdown")).toBeVisible({ timeout: 15_000 });
  await page.screenshot(SHOT("09-pre-drop-countdown"));

  // grab the QR token for the door
  const tickets = await (await page.request.get("/api/me/tickets")).json();
  const qrToken: string = tickets.tickets[0].qrToken;

  // 10 — staff door login (separate browser context)
  const staff = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const door = await staff.newPage();
  await door.goto("/door");
  await door.getByTestId("door-login-email").fill("vendor@facevalue.store");
  await door.getByTestId("door-login-password").fill("pilot-vendor-2026");
  await door.getByTestId("door-login-btn").click();
  await expect(door.getByTestId("door-input")).toBeVisible({ timeout: 15_000 });
  await door.screenshot(SHOT("10-door-ready"));

  // 11 — check-in OK
  await door.getByTestId("door-input").fill(qrToken);
  await door.getByTestId("door-check").click();
  await expect(door.getByTestId("door-result")).toContainText(/checked in/i, { timeout: 15_000 });
  await door.screenshot(SHOT("11-door-checkin-ok"));

  // 12 — duplicate scan rejected
  await door.getByTestId("door-input").fill(qrToken);
  await door.getByTestId("door-check").click();
  await expect(door.getByTestId("door-result")).toContainText(/already/i);
  await door.screenshot(SHOT("12-door-duplicate-rejected"));

  // 13 — studio overview (same staff session)
  await door.goto("/studio");
  await expect(door.getByTestId("studio-drops")).toBeVisible({ timeout: 15_000 });
  await door.screenshot(SHOT("13-studio-overview"));

  await staff.close();
});
