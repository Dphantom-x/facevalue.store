import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { claimTicket, type ClaimError } from "@/lib/tickets";
import { trackEvent } from "@/lib/db";

const STATUS: Record<ClaimError, number> = {
  NEED_VERIFY: 403,
  NO_PAYMENT_METHOD: 402,
  DROP_NOT_FOUND: 404,
  DROP_NOT_LIVE: 409,
  NOT_OPEN: 409,
  NEED_CODE: 403,
  LIMIT_REACHED: 409,
  SOLD_OUT: 409,
  CARD_DECLINED: 402,
  PAYMENT_FAILED: 402,
};

/**
 * POST /api/drop/[id]/claim — the REAL pilot purchase:
 * hold (face value + fee) → atomic allocation → capture → identity-bound QR ticket.
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = getSessionUser(req);
  if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const code = typeof body?.code === "string" ? body.code : null;

  const result = await claimTicket({ user, dropId: id, code });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, message: result.message },
      { status: STATUS[result.error] }
    );
  }

  // Authoritative bottom-of-funnel event (real allocation), attributed to the
  // anonymous visitor cookie so it lines up with the drop_view/verify stages.
  trackEvent("claim_done", {
    dropId: id,
    vid: req.cookies.get("fv_vid")?.value ?? null,
    userId: user.id,
    detail: result.viaWaitlist ? "via_waitlist" : "direct",
  });
  return NextResponse.json({
    ok: true,
    viaWaitlist: result.viaWaitlist,
    ticket: {
      id: result.ticket.id,
      dropId: result.ticket.dropId,
      status: result.ticket.status,
      priceCents: result.ticket.priceCents,
      feeCents: result.ticket.feeCents,
      qrToken: result.ticket.qrToken,
    },
    payment: {
      id: result.payment.id,
      amountCents: result.payment.amountCents,
      provider: result.payment.provider,
    },
    message: `Ticket secured at face value $${(result.ticket.priceCents / 100).toFixed(0)} — bound to your verified identity, non-transferable.`,
  });
}
