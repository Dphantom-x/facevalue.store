import { test, expect, request as pwRequest, type APIRequestContext } from "@playwright/test";

/**
 * Pilot — the access-code carve-out gate + the conversion-funnel instrument.
 *
 * The whole pilot's go/no-go is "≥15% of clickers verify." These tests prove:
 *  1) an invite-only drop is locked without the right code (and the claim is too);
 *  2) the funnel counts unique visitors at each stage and computes the verify rate.
 */
const BASE = "http://localhost:3000";

async function vendorCtx(): Promise<APIRequestContext> {
  const ctx = await pwRequest.newContext({ baseURL: BASE });
  const r = await ctx.post("/api/auth/login", {
    data: { email: "vendor@facevalue.store", password: "pilot-vendor-2026" },
  });
  if (r.status() !== 200) throw new Error(`vendor login failed: ${r.status()}`);
  return ctx;
}

async function createGatedDrop(
  vendor: APIRequestContext,
  code: string,
  inventory: number,
  tag: string
): Promise<string> {
  const res = await vendor.post("/api/studio/drops", {
    data: {
      artist: "Gate Test",
      event: `Gated Night ${tag}-${Date.now()}`,
      venue: "Test Loft",
      date: "2026-12-09",
      faceValue: 20,
      totalInventory: inventory,
      maxPerHuman: 1,
      mode: "full",
      accessCode: code,
    },
  });
  expect(res.status()).toBe(200);
  return (await res.json()).drop.id;
}

/** A distinct anonymous visitor (own cookie jar → own fv_vid) who views, verifies, and claims. */
async function viewVerifyClaim(dropId: string, code: string, tag: string) {
  const ctx = await pwRequest.newContext({ baseURL: BASE });
  await ctx.post("/api/track", { data: { type: "drop_view", dropId } }); // mints fv_vid
  await ctx.post("/api/auth/signup", { data: { email: `buy-${tag}-${Date.now()}@t.dev`, password: "password123" } });
  await ctx.post("/api/track", { data: { type: "verify_start", dropId } });
  await ctx.post("/api/world-id/verify", { data: {} });
  await ctx.post("/api/track", { data: { type: "verify_done", dropId } });
  await ctx.post("/api/payments/setup", { data: {} });
  const claim = await ctx.post(`/api/drop/${dropId}/claim`, { data: { code } });
  return { ctx, claimStatus: claim.status() };
}

/** A distinct anonymous visitor who only views the drop and bounces. */
async function justView(dropId: string): Promise<APIRequestContext> {
  const ctx = await pwRequest.newContext({ baseURL: BASE });
  await ctx.post("/api/track", { data: { type: "drop_view", dropId } });
  return ctx;
}

test.describe("Pilot — code-gate + conversion funnel", () => {
  test("invite-only gate: locked without code, unlocks with it (case-insensitive), claim requires it", async ({
    request,
  }) => {
    await request.post("/api/dev/reset");
    const vendor = await vendorCtx();
    const dropId = await createGatedDrop(vendor, "HUMANS-ONLY", 5, "gate");

    const anon = await pwRequest.newContext({ baseURL: BASE });

    // No code → locked teaser, no drop payload.
    const noCode = await (await anon.get(`/api/drops/${dropId}`)).json();
    expect(noCode.locked).toBe(true);
    expect(noCode.drop).toBeUndefined();
    expect(noCode.teaser.event).toContain("Gated Night");

    // Wrong code → still locked.
    const wrong = await (await anon.get(`/api/drops/${dropId}?code=nope`)).json();
    expect(wrong.locked).toBe(true);

    // Right code → unlocked, full drop.
    const right = await (await anon.get(`/api/drops/${dropId}?code=HUMANS-ONLY`)).json();
    expect(right.locked).toBeFalsy();
    expect(right.drop.id).toBe(dropId);
    expect(right.drop.gated).toBe(true);

    // Case-insensitive.
    const ci = await (await anon.get(`/api/drops/${dropId}?code=humans-only`)).json();
    expect(ci.drop.id).toBe(dropId);

    // A verified fan still can't claim without presenting the code.
    const fan = await pwRequest.newContext({ baseURL: BASE });
    await fan.post("/api/auth/signup", { data: { email: `g-${Date.now()}@t.dev`, password: "password123" } });
    await fan.post("/api/world-id/verify", { data: {} });
    await fan.post("/api/payments/setup", { data: {} });
    const noCodeClaim = await fan.post(`/api/drop/${dropId}/claim`);
    expect(noCodeClaim.status()).toBe(403);
    expect((await noCodeClaim.json()).error).toBe("NEED_CODE");
    // With the code → claim succeeds.
    const okClaim = await fan.post(`/api/drop/${dropId}/claim`, { data: { code: "HUMANS-ONLY" } });
    expect(okClaim.status()).toBe(200);

    // Regression: an OPEN (un-gated) drop still claims with no code at all.
    const fan2 = await pwRequest.newContext({ baseURL: BASE });
    await fan2.post("/api/auth/signup", { data: { email: `o-${Date.now()}@t.dev`, password: "password123" } });
    await fan2.post("/api/world-id/verify", { data: {} });
    await fan2.post("/api/payments/setup", { data: {} });
    const openClaim = await fan2.post(`/api/drop/fv-humans-only-001/claim`);
    expect(openClaim.status()).toBe(200);

    await Promise.all([vendor, anon, fan, fan2].map((c) => c.dispose()));
  });

  test("funnel counts unique visitors per stage and computes the verify rate", async ({ request }) => {
    test.setTimeout(120_000);
    await request.post("/api/dev/reset");
    const vendor = await vendorCtx();
    const dropId = await createGatedDrop(vendor, "GATE-TEST", 10, "funnel");

    // 3 distinct humans view → verify → claim; 7 distinct humans only view.
    const buyers = [];
    for (let i = 0; i < 3; i++) buyers.push(await viewVerifyClaim(dropId, "GATE-TEST", `b${i}`));
    const viewers: APIRequestContext[] = [];
    for (let i = 0; i < 7; i++) viewers.push(await justView(dropId));

    for (const b of buyers) expect(b.claimStatus).toBe(200);

    const overview = await (await vendor.get("/api/studio/overview")).json();
    const drop = overview.drops.find((d: { id: string }) => d.id === dropId);

    expect(drop.funnel.views).toBe(10); // 3 buyers + 7 viewers, deduped by visitor id
    expect(drop.funnel.verifies).toBe(3); // only the 3 buyers verified
    expect(drop.funnel.claims).toBe(3); // server-truthed allocations
    expect(drop.funnel.verifyRate).toBeCloseTo(0.3, 5); // 3/10 — clears the 15% gate
    expect(drop.accessCode).toBe("GATE-TEST"); // vendor sees their own carve-out code

    await Promise.all([vendor, ...buyers.map((b) => b.ctx), ...viewers].map((c) => c.dispose()));
  });
});
