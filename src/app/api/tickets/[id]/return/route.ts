import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { returnTicket } from "@/lib/tickets";

/**
 * POST /api/tickets/[id]/return — return at face value; the freed ticket is
 * offered to the head of the waitlist. (No peer-to-peer transfer — ever.)
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = getSessionUser(req);
  if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });

  const result = await returnTicket({ user, ticketId: id });
  if (!result.ok) return NextResponse.json({ ok: false, message: result.message }, { status: 409 });
  return NextResponse.json({
    ok: true,
    offered: !!result.offeredUserId,
    message: result.offeredUserId
      ? "Returned at face value — the next verified human on the waitlist has been offered your spot."
      : "Returned at face value — the ticket is back in the drop.",
  });
}
