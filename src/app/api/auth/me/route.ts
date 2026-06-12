import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { paymentsMode } from "@/lib/payments";

/** GET /api/auth/me — session state the onboarding wizard runs on. */
export async function GET(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) {
    return NextResponse.json({
      user: null,
      verified: false,
      hasPaymentMethod: false,
      paymentsMode: paymentsMode(),
    });
  }
  return NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role },
    verified: !!user.nullifierHash,
    nullifierShort: user.nullifierHash
      ? `${user.nullifierHash.slice(0, 10)}…${user.nullifierHash.slice(-4)}`
      : null,
    hasPaymentMethod: !!user.paymentMethodRef,
    paymentsMode: paymentsMode(),
  });
}
