import { NextRequest, NextResponse } from "next/server";
import { checkAgentTrust } from "@/lib/valiron";

/**
 * POST /api/trust-check — read-only Valiron trust evaluation (no purchase).
 * Body: { agentId, chain? }. Used by the simulation's live "this isn't scripted" panel.
 */
export async function POST(req: NextRequest) {
  let body: { agentId?: string; chain?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { agentId, chain } = body ?? {};
  if (!agentId) {
    return NextResponse.json({ error: "agentId is required" }, { status: 400 });
  }
  const trust = await checkAgentTrust({ agentId, chain });
  return NextResponse.json({ trust });
}
