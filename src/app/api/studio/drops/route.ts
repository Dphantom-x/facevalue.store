import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createDrop, type ReleaseMode } from "@/lib/store";

/** POST /api/studio/drops — vendor creates a real drop (auth required). */
export async function POST(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  if (user.role !== "vendor" && user.role !== "admin")
    return NextResponse.json({ error: "VENDOR_ONLY" }, { status: 403 });

  let body: {
    artist?: string;
    event?: string;
    venue?: string;
    date?: string;
    opensAt?: string | null;
    faceValue?: number | string;
    totalInventory?: number | string;
    maxPerHuman?: number | string;
    mode?: string;
    accessCode?: string | null;
  };
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
    opensAt: body.opensAt || null,
    faceValue: Number(body.faceValue) || 0,
    totalInventory: Number(body.totalInventory) || 0,
    maxPerHuman: Number(body.maxPerHuman) || 1,
    mode: (body.mode || "full") as ReleaseMode,
    vendorId: user.id,
    accessCode: body.accessCode ?? null,
  });
  return NextResponse.json({ ok: true, drop });
}
