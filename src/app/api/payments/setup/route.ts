import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, setPaymentMethod } from "@/lib/auth";
import { paymentsMode } from "@/lib/payments";

/**
 * POST /api/payments/setup — attach a payment method to the logged-in user.
 *
 * mock mode (default): instantly attaches a simulated card.
 *   body { simulate?: "ok" | "declined" } — "declined" attaches a card that
 *   fails authorization (lets tests exercise the decline path).
 * stripe mode: TODO wire client-side SetupIntent (Stripe Elements) — the server
 *   flow (off_session manual-capture PaymentIntents) is already implemented.
 */
export async function POST(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });

  let body: { simulate?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body ok */
  }

  if (paymentsMode() === "stripe") {
    return NextResponse.json(
      { error: "Stripe SetupIntent flow not wired yet — run PAYMENTS_MODE=mock for the pilot demo" },
      { status: 501 }
    );
  }

  const ref = body.simulate === "declined" ? "mock_card_declined" : "mock_card_4242";
  setPaymentMethod(user.id, ref);
  return NextResponse.json({ ok: true, ref, last4: ref === "mock_card_4242" ? "4242" : "0341" });
}
