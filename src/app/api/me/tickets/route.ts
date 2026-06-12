import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { listUserTickets } from "@/lib/tickets";

/** GET /api/me/tickets — the logged-in fan's tickets with event info. */
export async function GET(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  const tickets = listUserTickets(user.id).map((t) => ({
    id: t.id,
    dropId: t.dropId,
    event: t.event,
    artist: t.artist,
    venue: t.venue,
    date: t.date,
    priceCents: t.priceCents,
    feeCents: t.feeCents,
    status: t.status,
    qrToken: t.qrToken,
    createdAt: t.createdAt,
    checkedInAt: t.checkedInAt,
  }));
  return NextResponse.json({ tickets });
}
