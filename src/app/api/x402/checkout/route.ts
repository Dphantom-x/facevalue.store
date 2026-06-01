import { NextRequest, NextResponse } from "next/server";
import { checkAgentTrust } from "@/lib/valiron";
import { operatorTrustCheck, hasOperatorKey } from "@/lib/operator";
import { getDrop, recordPurchase } from "@/lib/store";

/**
 * POST /api/x402/checkout — pay-per-ticket via the x402 handshake.
 *
 *   1) Valiron TRUST gate (via the operator-keyed SDK when available) → 403 if denied.
 *   2) No `X-Payment` header  → 402 Payment Required + x402 payment requirements
 *      (price = face value; Valiron also enables trust-based dynamic pricing).
 *   3) `X-Payment` header present → (mock) settle, enforce one-per-human, issue ticket (200).
 *
 * Body: { dropId, agentId, chain?, humanId? }
 */
const NETWORK = "base-sepolia";
const ASSET = "USDC";
const PAY_TO = "0xFaceValueTreasury000000000000000000000000"; // demo treasury address

export async function POST(req: NextRequest) {
  let body: { dropId?: string; agentId?: string; chain?: string; humanId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { dropId, agentId, chain, humanId } = body ?? {};
  if (!dropId || !agentId) {
    return NextResponse.json({ error: "dropId and agentId are required" }, { status: 400 });
  }

  const drop = getDrop(dropId);
  if (!drop) {
    return NextResponse.json({ error: "Drop not found" }, { status: 404 });
  }

  // 1) TRUST gate — through the operator-keyed SDK when a val_op_ key is present.
  const trust = hasOperatorKey()
    ? await operatorTrustCheck({ agentId, chain })
    : await checkAgentTrust({ agentId, chain });

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

  const price = drop.faceValue; // verified fans pay face value (no gouging)
  const payment = req.headers.get("x-payment");

  // 2) No payment yet → 402 with x402 payment requirements.
  if (!payment) {
    return NextResponse.json(
      {
        x402Version: 1,
        error: "payment_required",
        accepts: [
          {
            scheme: "exact",
            network: NETWORK,
            asset: ASSET,
            maxAmountRequired: String(price),
            payTo: PAY_TO,
            resource: "/api/x402/checkout",
            description: `1 ticket to ${drop.event} at face value`,
            mimeType: "application/json",
            extra: {
              quoteId: `q_${trust.agentId}_${drop.id}`,
              trustTier: trust.tier,
              trustScore: trust.score,
              valironRoute: trust.route,
            },
          },
        ],
        trust,
      },
      { status: 402, headers: { "x-valiron-route": trust.route } }
    );
  }

  // 3) Payment present → enforce one-per-human, (mock) settle, issue ticket.
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

  const settlementTx = `0xmock${Buffer.from(payment).toString("hex").slice(0, 24)}`;
  return NextResponse.json(
    {
      decision: "approved",
      trust,
      ticketId: outcome.ticketId,
      remaining: outcome.remaining,
      faceValue: price,
      settlement: { network: NETWORK, asset: ASSET, amount: price, tx: settlementTx, mocked: true },
      message: `Paid ${price} ${ASSET} via x402 — ticket secured at face value, identity-bound.`,
    },
    { status: 200, headers: { "x-payment-response": settlementTx } }
  );
}
