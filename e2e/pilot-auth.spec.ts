import { test, expect } from "@playwright/test";

/**
 * Pilot — auth API: signup/login/logout/me, duplicate emails, vendor code.
 */
test.describe("Pilot — auth", () => {
  test.beforeEach(async ({ request }) => {
    await request.post("/api/dev/reset");
  });

  test("signup → me → logout → login round-trip", async ({ request }) => {
    const email = `fan-${Date.now()}@test.dev`;

    const signup = await request.post("/api/auth/signup", {
      data: { email, password: "password123" },
    });
    expect(signup.status()).toBe(200);
    const sBody = await signup.json();
    expect(sBody.user.role).toBe("fan");

    // session cookie works
    const me1 = await request.get("/api/auth/me");
    const me1Body = await me1.json();
    expect(me1Body.user.email).toBe(email);
    expect(me1Body.verified).toBe(false);
    expect(me1Body.hasPaymentMethod).toBe(false);

    // duplicate email rejected
    const dup = await request.post("/api/auth/signup", {
      data: { email, password: "password123" },
    });
    expect(dup.status()).toBe(409);

    // logout clears the session
    await request.post("/api/auth/logout");
    const me2 = await (await request.get("/api/auth/me")).json();
    expect(me2.user).toBeNull();

    // wrong password rejected, right password works
    const bad = await request.post("/api/auth/login", {
      data: { email, password: "wrong-password" },
    });
    expect(bad.status()).toBe(401);
    const good = await request.post("/api/auth/login", {
      data: { email, password: "password123" },
    });
    expect(good.status()).toBe(200);
  });

  test("vendor code grants vendor role; studio is role-gated", async ({ request }) => {
    const email = `venue-${Date.now()}@test.dev`;
    const signup = await request.post("/api/auth/signup", {
      data: { email, password: "password123", vendorCode: "PILOT-VENDOR" },
    });
    const body = await signup.json();
    expect(body.user.role).toBe("vendor");

    const overview = await request.get("/api/studio/overview");
    expect(overview.status()).toBe(200);
  });

  test("fan cannot reach studio or door APIs", async ({ request }) => {
    await request.post("/api/auth/signup", {
      data: { email: `fan-${Date.now()}@test.dev`, password: "password123" },
    });
    expect((await request.get("/api/studio/overview")).status()).toBe(403);
    expect((await request.post("/api/checkin", { data: { token: "x.y" } })).status()).toBe(403);
  });

  test("verification binds ONE nullifier per account, idempotently", async ({ request }) => {
    await request.post("/api/auth/signup", {
      data: { email: `fan-${Date.now()}@test.dev`, password: "password123" },
    });
    const v1 = await (await request.post("/api/world-id/verify", { data: {} })).json();
    const v2 = await (await request.post("/api/world-id/verify", { data: {} })).json();
    expect(v1.nullifierHash).toBeTruthy();
    expect(v1.nullifierHash).toBe(v2.nullifierHash); // same human → same nullifier
    const me = await (await request.get("/api/auth/me")).json();
    expect(me.verified).toBe(true);
  });
});
