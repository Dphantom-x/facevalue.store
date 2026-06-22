import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDropRow, dropPublic, waitlistState, dropCodeOk } from "@/lib/tickets";
import { db } from "@/lib/db";

/** GET /api/drops/[id] — public drop + (if logged in) my ticket/waitlist state. */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const row = getDropRow(id);
  if (!row) return NextResponse.json({ error: "Drop not found" }, { status: 404 });

  // Invite-only carve-out: without the right code, return a minimal "locked"
  // teaser (HTTP 200) so the page can render an access-code gate, not an error.
  const code = req.nextUrl.searchParams.get("code");
  if (!dropCodeOk(row, code)) {
    return NextResponse.json({
      locked: true,
      teaser: { id: row.id, artist: row.artist, event: row.event, venue: row.venue, date: row.date },
    });
  }

  const user = getSessionUser(req);
  let me: {
    ticket: { id: string; status: string; qrToken: string | null } | null;
    waitlist: { position: number; status: string } | null;
  } | null = null;

  if (user) {
    const t = db()
      .prepare(
        "SELECT id, status, qrToken FROM tickets WHERE dropId = ? AND userId = ? AND status IN ('held','confirmed','checked_in') ORDER BY createdAt DESC LIMIT 1"
      )
      .get(id, user.id) as { id: string; status: string; qrToken: string | null } | undefined;
    me = {
      ticket: t ?? null,
      waitlist: waitlistState(user.id, id) ?? null,
    };
  }

  return NextResponse.json({ drop: dropPublic(row), me });
}
