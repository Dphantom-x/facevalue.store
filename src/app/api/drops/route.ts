import { NextResponse } from "next/server";
import { listDrops } from "@/lib/store";

/** GET /api/drops — list current drops and their remaining inventory. */
export async function GET() {
  return NextResponse.json({ drops: listDrops() });
}
