import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";

/** POST /api/auth/login — { email, password } */
export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.email || !body.password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }
  const user = verifyPassword(body.email, body.password);
  if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const session = createSession(user.id);
  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, role: user.role },
    verified: !!user.nullifierHash,
    hasPaymentMethod: !!user.paymentMethodRef,
  });
  setSessionCookie(res, session.token, session.expiresAt);
  return res;
}
