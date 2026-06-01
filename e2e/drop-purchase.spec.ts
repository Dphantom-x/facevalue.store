import { test, expect } from "@playwright/test";

/**
 * Phase 1 — the two-gate purchase flow, end-to-end through the API.
 * Uses REAL Valiron sample agents:
 *   GOOD = 25459 (ethereum) — "Valiron Good Agent (Demo)", World ID verified → ALLOW
 *   BAD  = 1226  (solana)   — zero reputation → sandbox → DENY
 */
const GOOD = { agentId: "25459", chain: "ethereum" };
const BAD = { agentId: "1226", chain: "solana" };
const DROP = "midnight-echo-nyc";

test.describe("Phase 1 — drop purchase: trust + authority gates", () => {
  test.beforeEach(async ({ request }) => {
    const res = await request.post("/api/dev/reset");
    expect(res.ok()).toBeTruthy();
  });

  test("verified agent is ALLOWED and gets a ticket at face value", async ({
    request,
  }) => {
    const res = await request.post("/api/drop/purchase", {
      data: { dropId: DROP, ...GOOD },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.decision).toBe("approved");
    expect(body.trust.allow).toBe(true);
    expect(body.trust.worldIdVerified).toBe(true);
    expect(body.ticketId).toBeTruthy();
    expect(body.remaining).toBe(4);
    expect(body.faceValue).toBe(60);
  });

  test("untrusted scalper agent is DENIED at the trust gate", async ({
    request,
  }) => {
    const res = await request.post("/api/drop/purchase", {
      data: { dropId: DROP, ...BAD },
    });
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.decision).toBe("denied");
    expect(body.stage).toBe("trust");
    expect(body.trust.allow).toBe(false);
  });

  test("one ticket per verified human — second purchase is blocked", async ({
    request,
  }) => {
    const first = await request.post("/api/drop/purchase", {
      data: { dropId: DROP, ...GOOD },
    });
    expect(first.status()).toBe(200);

    const second = await request.post("/api/drop/purchase", {
      data: { dropId: DROP, ...GOOD },
    });
    expect(second.status()).toBe(409);
    const body = await second.json();
    expect(body.decision).toBe("denied");
    expect(body.stage).toBe("policy");
    expect(body.code).toBe("LIMIT_REACHED");
  });
});
