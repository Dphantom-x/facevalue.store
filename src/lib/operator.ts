/**
 * FaceValue — Valiron Operator layer (for the x402 paywall).
 *
 * The operator SDK is what API sellers use to monetize endpoints. Its `paywall()`
 * is Express middleware; since we're on Next.js we run the trust gate through the
 * operator-configured SDK (`operator.getSDK()`) — which carries the val_op_ key —
 * and implement the x402 handshake in the route. In production the same flow is a
 * one-liner: `app.use(path, operator.paywall({ pricePerCall }))`.
 */
import { ValironOperator } from "@valiron/sdk";
import { toTrustResult, failClosed, type TrustResult } from "@/lib/valiron";

const ENDPOINT =
  process.env.VALIRON_ENDPOINT || "https://valiron-edge-proxy.onrender.com";
const KEY = process.env.VALIRON_OPERATOR_KEY;

let operator: ValironOperator | null = null;

function getOperator(): ValironOperator | null {
  if (!KEY) return null;
  if (!operator) {
    operator = new ValironOperator({
      apiKey: KEY,
      endpoint: ENDPOINT,
      chain: "ethereum",
      timeout: 60000,
    });
  }
  return operator;
}

export function hasOperatorKey(): boolean {
  return !!KEY;
}

/** Run the Valiron trust gate through the operator-configured (keyed) SDK. */
export async function operatorTrustCheck(params: {
  agentId: string;
  chain?: string;
}): Promise<TrustResult> {
  const chain = params.chain || "ethereum";
  const op = getOperator();
  if (!op) return failClosed(params.agentId, chain, "No operator key configured");
  try {
    const p = await op.getSDK().getAgentProfile(params.agentId, { chain: chain as never });
    return toTrustResult(p, params.agentId, chain);
  } catch (e) {
    return failClosed(params.agentId, chain, `Trust check failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}
