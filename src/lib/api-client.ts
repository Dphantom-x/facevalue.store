// Client-side API wrapper. Replaces the design's mock FV.api with real fetches to our
// Next API routes. Returns { status, data } to match how the ported components read responses.
import type { Drop, Trust, PurchaseResp, ApiResp } from "./types";

async function call<T>(url: string, opts?: RequestInit): Promise<ApiResp<T>> {
  const res = await fetch(url, opts);
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON / empty body */
  }
  return { status: res.status, data: data as T };
}

const json = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

export const api = {
  getDrops: () => call<{ drops: Drop[] }>("/api/drops"),

  trustCheck: (agentId: string, chain: string) =>
    call<{ trust: Trust }>("/api/trust-check", json({ agentId, chain })),

  worldIdVerify: () =>
    call<{ ok: boolean; nullifierHash: string; verificationLevel: string; simulated: boolean }>(
      "/api/world-id/verify",
      json({})
    ),

  purchase: (body: { dropId: string; agentId: string; chain: string; humanId: string | null }) =>
    call<PurchaseResp>("/api/drop/purchase", json(body)),

  vendorCreateDrop: (form: Record<string, string>) =>
    call<{ ok: boolean; drop: Drop }>("/api/vendor/drops", json(form)),
};
