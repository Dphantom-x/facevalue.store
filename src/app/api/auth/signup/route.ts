import { NextRequest, NextResponse } from "next/server";
import { createUser, createSession, setSessionCookie } from "@/lib/auth";

/**
 * POST /api/auth/signup — { email, password, vendorCode? }
 * A correct vendorCode (env FV_VENDOR_CODE) creates a vendor account.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string; vendorCode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.email || !body.password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }
  const vendorCode = process.env.FV_VENDOR_CODE || "PILOT-VENDOR";
  const role = body.vendorCode && body.vendorCode === vendorCode ? "vendor" : "fan";
  const result = createUser({ email: body.email, password: body.password, role });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 });

  const session = createSession(result.user.id);
  const res = NextResponse.json({
    ok: true,
    user: { id: result.user.id, email: result.user.email, role: result.user.role },
    verified: false,
    hasPaymentMethod: false,
  });
  setSessionCookie(res, session.token, session.expiresAt);
  return res;
}
