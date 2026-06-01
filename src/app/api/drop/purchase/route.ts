import { NextRequest, NextResponse } from "next/server";
import { checkAgentTrust } from "@/lib/valiron";
import { getDrop, recordPurchase } from "@/lib/store";

/**
 * POST /api/drop/purchase
 *
 * The two-gate flow:
 *   1) TRUST gate (Valiron)  — is this a trustworthy, identity-backed agent?
 *   2) AUTHORITY gate (ours) — one ticket per verified human, within inventory.
 *
 * Body: { dropId, agentId, chain?, humanId? }
 */
export async function POST(req: NextRequest) {
  let body: { dropId?: string; agentId?: string; chain?: string; humanId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { dropId, agentId, chain, humanId } = body ?? {};
  if (!dropId || !agentId) {
    return NextResponse.json(
      { error: "dropId and agentId are required" },
      { status: 400 }
    );
  }

  const drop = getDrop(dropId);
  if (!drop) {
    return NextResponse.json({ error: "Drop not found" }, { status: 404 });
  }

  // 1) TRUST gate — Valiron
  const trust = await checkAgentTrust({ agentId, chain });
  if (!trust.allow) {
    return NextResponse.json(
      {
        decision: "denied",
        stage: "trust",
        trust,
        message: `Agent blocked by Valiron trust gate (route: ${trust.route})`,
      },
      { status: 403 }
    );
  }

  // 2) AUTHORITY gate — one per verified human (humanId = World ID nullifier later)
  const human = humanId || agentId;
  const outcome = recordPurchase({ dropId, humanId: human, agentId });
  if (!outcome.ok) {
    return NextResponse.json(
      {
        decision: "denied",
        stage: "policy",
        trust,
        code: outcome.code,
        message: outcome.message,
        remaining: outcome.remaining,
      },
      { status: 409 }
    );
  }

  return NextResponse.json({
    decision: "approved",
    trust,
    ticketId: outcome.ticketId,
    remaining: outcome.remaining,
    faceValue: drop.faceValue,
    message: `Ticket secured at face value $${drop.faceValue} — bound to your verified identity, non-transferable.`,
  });
}
