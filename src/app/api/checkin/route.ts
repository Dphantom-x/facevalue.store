import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { checkinByToken } from "@/lib/tickets";

/** POST /api/checkin — { token } · door staff only (vendor/admin). Single-use. */
export async function POST(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  if (user.role !== "vendor" && user.role !== "admin")
    return NextResponse.json({ error: "STAFF_ONLY" }, { status: 403 });

  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.token) return NextResponse.json({ error: "token is required" }, { status: 400 });

  const result = checkinByToken({ token: body.token, staffUserId: user.id });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, code: result.code, message: result.message },
      { status: result.code === "ALREADY_USED" ? 409 : 404 }
    );
  }
  return NextResponse.json({
    ok: true,
    ticket: { id: result.ticket.id, event: result.ticket.event, status: result.ticket.status },
    message: `✓ Checked in — ${result.ticket.event}`,
  });
}
