import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getSessionUser } from "@/lib/auth";
import { trackEvent, type FunnelEvent } from "@/lib/db";

/**
 * POST /api/track — funnel beacon.
 *
 * Records a top-of-funnel event against an anonymous visitor id (the `fv_vid`
 * cookie, minted here on first hit so a logged-OUT clicker still counts). The
 * authoritative `claim_done` event is emitted server-side in the claim route,
 * never here — clients can only fire view/gate/verify stages.
 */
const CLIENT_EVENTS = new Set<FunnelEvent>(["drop_view", "gate_block", "verify_start", "verify_done"]);
const VID_COOKIE = "fv_vid";
const VID_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const type = body?.type as FunnelEvent | undefined;
  if (!type || !CLIENT_EVENTS.has(type)) {
    return NextResponse.json({ error: "bad event" }, { status: 400 });
  }

  let vid = req.cookies.get(VID_COOKIE)?.value;
  const fresh = !vid;
  if (!vid) vid = "v_" + randomBytes(12).toString("hex");

  const user = getSessionUser(req);
  trackEvent(type, {
    dropId: typeof body?.dropId === "string" ? body.dropId : null,
    vid,
    userId: user?.id ?? null,
    detail: typeof body?.detail === "string" ? body.detail.slice(0, 200) : undefined,
  });

  const res = NextResponse.json({ ok: true });
  if (fresh) {
    res.cookies.set(VID_COOKIE, vid, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: VID_MAX_AGE,
    });
  }
  return res;
}
