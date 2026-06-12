import { test, expect, request as pwRequest, type APIRequestContext } from "@playwright/test";

/**
 * Pilot — many buyers at once + waitlist + returns + declined cards.
 * 6 verified humans race for 3 tickets: EXACTLY 3 win (transactional inventory);
 * losers join the waitlist; a return flows to the waitlist head at face value.
 */
const BASE = "http://localhost:3000";

async function newFan(tag: string): Promise<APIRequestContext> {
  const ctx = await pwRequest.newContext({ baseURL: BASE });
  const email = `fan-${tag}-${Date.now()}@test.dev`;
  const s = await ctx.post("/api/auth/signup", { data: { email, password: "password123" } });
  if (s.status() !== 200) throw new Error(`signup failed: ${s.status()}`);
  await ctx.post("/api/world-id/verify", { data: {} });
  await ctx.post("/api/payments/setup", { data: {} });
  return ctx;
}

test.describe("Pilot — burst, waitlist, returns, declines", () => {
  test("6 humans race for 3 tickets; waitlist absorbs the rest; return flows to the head", async ({
    request,
  }) => {
    test.setTimeout(120_000);
    await request.post("/api/dev/reset");

    // Vendor creates a tiny drop.
    const vendor = await pwRequest.newContext({ baseURL: BASE });
    await vendor.post("/api/auth/login", {
      data: { email: "vendor@facevalue.store", password: "pilot-vendor-2026" },
    });
    const createRes = await vendor.post("/api/studio/drops", {
      data: {
        artist: "Burst Test",
        event: `Burst Night ${Date.now()}`,
        venue: "Test Loft",
        date: "2026-12-01",
        faceValue: 10,
        totalInventory: 3,
        maxPerHuman: 1,
        mode: "full",
      },
    });
    expect(createRes.status()).toBe(200);
    const dropId: string = (await createRes.json()).drop.id;

    // 6 verified fans, parallel claims.
    const fans = await Promise.all([1, 2, 3, 4, 5, 6].map((i) => newFan(`b${i}`)));
    const claims = await Promise.all(fans.map((f) => f.post(`/api/drop/${dropId}/claim`)));
    const ok = claims.filter((c) => c.status() === 200);
    const soldOut = claims.filter((c) => c.status() === 409);
    expect(ok.length).toBe(3); // EXACTLY the inventory — no oversell, no undersell
    expect(soldOut.length).toBe(3);

    const winners: APIRequestContext[] = [];
    const losers: APIRequestContext[] = [];
    for (let i = 0; i < claims.length; i++) {
      (claims[i].status() === 200 ? winners : losers).push(fans[i]);
    }

    // Winner double-claim → LIMIT_REACHED (one per human).
    const dup = await winners[0].post(`/api/drop/${dropId}/claim`);
    expect(dup.status()).toBe(409);
    expect((await dup.json()).error).toBe("LIMIT_REACHED");

    // Losers join the waitlist in order.
    const w1 = await (await losers[0].post(`/api/drops/${dropId}/waitlist`)).json();
    const w2 = await (await losers[1].post(`/api/drops/${dropId}/waitlist`)).json();
    expect(w1.position).toBe(1);
    expect(w2.position).toBe(2);

    // Winner 1 returns → head of waitlist is offered the spot.
    const myTickets = await (await winners[0].get("/api/me/tickets")).json();
    const ret = await winners[0].post(`/api/tickets/${myTickets.tickets[0].id}/return`);
    expect(ret.status()).toBe(200);
    expect((await ret.json()).offered).toBe(true);

    // Loser 2 (not offered) still can't claim…
    const stillOut = await losers[1].post(`/api/drop/${dropId}/claim`);
    expect(stillOut.status()).toBe(409);

    // …but the offered head CAN claim, at face value.
    const offered = await losers[0].post(`/api/drop/${dropId}/claim`);
    expect(offered.status()).toBe(200);
    const offeredBody = await offered.json();
    expect(offeredBody.viaWaitlist).toBe(true);
    expect(offeredBody.ticket.status).toBe("confirmed");

    // Vendor stats reflect reality: 3 sold (2 originals + 1 waitlist), 1 waiting.
    const overview = await (await vendor.get("/api/studio/overview")).json();
    const drop = overview.drops.find((d: { id: string }) => d.id === dropId);
    expect(drop.stats.sold).toBe(3);
    expect(drop.stats.waitlistCount).toBe(1);

    await Promise.all([...fans, vendor].map((c) => c.dispose()));
  });

  test("declined card: hold fails, no money taken, inventory untouched", async ({ request }) => {
    await request.post("/api/dev/reset");

    const ctx = await pwRequest.newContext({ baseURL: BASE });
    await ctx.post("/api/auth/signup", {
      data: { email: `declined-${Date.now()}@test.dev`, password: "password123" },
    });
    await ctx.post("/api/world-id/verify", { data: {} });
    await ctx.post("/api/payments/setup", { data: { simulate: "declined" } });

    const before = await (await ctx.get("/api/drops/fv-humans-only-001")).json();
    const claim = await ctx.post("/api/drop/fv-humans-only-001/claim");
    expect(claim.status()).toBe(402);
    expect((await claim.json()).error).toBe("CARD_DECLINED");

    const after = await (await ctx.get("/api/drops/fv-humans-only-001")).json();
    expect(after.drop.remaining).toBe(before.drop.remaining); // nothing consumed
    await ctx.dispose();
  });

  test("pre-drop is closed until opensAt", async ({ request }) => {
    await request.post("/api/dev/reset");
    const ctx = await pwRequest.newContext({ baseURL: BASE });
    await ctx.post("/api/auth/signup", {
      data: { email: `early-${Date.now()}@test.dev`, password: "password123" },
    });
    await ctx.post("/api/world-id/verify", { data: {} });
    await ctx.post("/api/payments/setup", { data: {} });

    const claim = await ctx.post("/api/drop/fv-humans-only-002/claim"); // opensAt in the future
    expect(claim.status()).toBe(409);
    expect((await claim.json()).error).toBe("NOT_OPEN");
    await ctx.dispose();
  });
});
