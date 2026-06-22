import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { listDropRows, dropPublic, dropStats, recentAudit } from "@/lib/tickets";
import { funnelFor } from "@/lib/db";

/** GET /api/studio/overview — vendor portal data: drops + stats + funnel + audit feed. */
export async function GET(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  if (user.role !== "vendor" && user.role !== "admin")
    return NextResponse.json({ error: "VENDOR_ONLY" }, { status: 403 });

  const drops = listDropRows().map((d) => ({
    ...dropPublic(d),
    accessCode: d.accessCode, // vendor sees their own carve-out code
    stats: dropStats(d.id),
    funnel: funnelFor(d.id), // the ≥15%-verify kill-metric instrument
  }));
  return NextResponse.json({ drops, audit: recentAudit(40) });
}
