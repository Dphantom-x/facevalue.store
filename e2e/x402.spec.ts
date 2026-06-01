import { test, expect } from "@playwright/test";

/**
 * Stretch — x402 pay-per-ticket handshake.
 *   no payment → 402 (payment required, with the face-value quote + Valiron trust)
 *   with payment → 200 (ticket issued, mocked settlement)
 *   scalper → 403 at the Valiron trust gate (never reaches payment)
 */
const DROP = "midnight-echo-nyc";

test.describe("x402 paywall — pay-per-ticket handshake", () => {
  test.beforeEach(async ({ request }) => {
    await request.post("/api/dev/reset");
  });

  test("402 → pay → 200; scalper denied at the trust gate", async ({ request }) => {
    // Step 1 — no payment → 402 Payment Required.
    const r1 = await request.post("/api/x402/checkout", {
      data: { dropId: DROP, agentId: "25459", chain: "ethereum", humanId: "x402-human-1" },
    });
    expect(r1.status()).toBe(402);
    const b1 = await r1.json();
    expect(b1.error).toBe("payment_required");
    expect(b1.accepts?.[0]?.maxAmountRequired).toBe("60");
    expect(b1.trust.allow).toBe(true);

    // Step 2 — retry WITH payment → 200 + ticket.
    const r2 = await request.post("/api/x402/checkout", {
      headers: { "x-payment": "mock-payment-proof" },
      data: { dropId: DROP, agentId: "25459", chain: "ethereum", humanId: "x402-human-1" },
    });
    expect(r2.status()).toBe(200);
    const b2 = await r2.json();
    expect(b2.decision).toBe("approved");
    expect(b2.ticketId).toBeTruthy();
    expect(b2.settlement?.mocked).toBe(true);
    expect(r2.headers()["x-payment-response"]).toBeTruthy();

    // Scalper → denied at the trust gate (no 402 ever issued).
    const r3 = await request.post("/api/x402/checkout", {
      data: { dropId: DROP, agentId: "1226", chain: "solana", humanId: "x402-scalper" },
    });
    expect(r3.status()).toBe(403);
    const b3 = await r3.json();
    expect(b3.stage).toBe("trust");
    expect(b3.trust.allow).toBe(false);
  });
});
