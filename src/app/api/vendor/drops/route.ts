import { NextRequest, NextResponse } from "next/server";
import { createDrop, listDrops } from "@/lib/store";

/** GET /api/vendor/drops — list drops (same as /api/drops). */
export async function GET() {
  return NextResponse.json({ drops: listDrops() });
}

/** POST /api/vendor/drops — vendor launches a new drop. */
export async function POST(req: NextRequest) {
  let body: {
    artist?: string;
    event?: string;
    venue?: string;
    date?: string;
    faceValue?: number | string;
    totalInventory?: number | string;
    maxPerHuman?: number | string;
    mode?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.artist || !body.event) {
    return NextResponse.json({ error: "artist and event are required" }, { status: 400 });
  }

  const drop = createDrop({
    artist: body.artist,
    event: body.event,
    venue: body.venue || "",
    date: body.date || "",
    faceValue: Number(body.faceValue) || 0,
    totalInventory: Number(body.totalInventory) || 0,
    maxPerHuman: Number(body.maxPerHuman) || 1,
    mode: (body.mode || "full") as "full" | "hybrid" | "lottery",
  });

  return NextResponse.json({ ok: true, drop });
}
