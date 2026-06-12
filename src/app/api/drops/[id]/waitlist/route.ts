import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { joinWaitlist } from "@/lib/tickets";

/** POST /api/drops/[id]/waitlist — join the sold-out waitlist (verified humans only). */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = getSessionUser(req);
  if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  if (!user.nullifierHash)
    return NextResponse.json({ error: "NEED_VERIFY", message: "Verify first." }, { status: 403 });

  const result = joinWaitlist({ user, dropId: id });
  if (!result.ok) return NextResponse.json({ ok: false, message: result.message }, { status: 409 });
  return NextResponse.json({ ok: true, position: result.position });
}
