import { NextResponse } from "next/server";
import { resetStore } from "@/lib/store";

/** POST /api/dev/reset — reseed the in-memory store (tests/demo only). */
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "disabled in production" }, { status: 403 });
  }
  resetStore();
  return NextResponse.json({ ok: true });
}
