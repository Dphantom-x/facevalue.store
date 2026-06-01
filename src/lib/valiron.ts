/**
 * FaceValue — Valiron trust layer.
 *
 * Wraps @valiron/sdk into a single normalized trust result for the app.
 *
 * Why getAgentProfile() and not gate():
 *   gate() hits a protected endpoint requiring agent-side challenge-response auth
 *   (returns `identity_required`). getAgentProfile() is the recommended server-side
 *   check and returns richer data: routing.finalRoute, routing.reasons[], on-chain
 *   score, and World ID status. See CLAUDE.md / docs/JOURNAL.md (Phase 0).
 */
import { ValironSDK } from "@valiron/sdk";
import type { AgentProfile } from "@valiron/sdk";

const ENDPOINT =
  process.env.VALIRON_ENDPOINT || "https://valiron-edge-proxy.onrender.com";

// Single shared server-side instance. No API key needed for trust reads.
const sdk = new ValironSDK({ endpoint: ENDPOINT, chain: "ethereum", timeout: 60000 });

export type TrustResult = {
  /** true when the agent is trustworthy enough to transact. */
  allow: boolean;
  /** Valiron route: prod | prod_throttled | sandbox | sandbox_only | error */
  route: string;
  /** On-chain reputation average score (0-100), or null. */
  score: number | null;
  /** Moody's-style tier (AAA..C), or null if no local Valiron data. */
  tier: string | null;
  /** GREEN | YELLOW | RED, or null. */
  riskLevel: string | null;
  /** Human-readable explanation lines — ideal for the on-screen audit log. */
  reasons: string[];
  /** Agent display name from on-chain identity. */
  agentName: string | null;
  /** Whether the agent is linked to a verified human via World ID. */
  worldIdVerified: boolean;
  agentId: string;
  chain: string;
  error?: string;
};

const ALLOW_ROUTES = new Set(["prod", "prod_throttled"]);
/** prod / prod_throttled ⇒ allow; sandbox / sandbox_only / error ⇒ deny. */
export const routeAllows = (route?: string) => ALLOW_ROUTES.has(route ?? "");

let warmed = false;

/** Wake the Render free-tier edge proxy (cold start ~30-60s) before real calls. */
export async function warmupValiron(): Promise<boolean> {
  try {
    const res = await fetch(`${ENDPOINT}/operator/health`, { cache: "no-store" });
    warmed = true;
    return res.ok;
  } catch {
    return false;
  }
}

function detectWorldId(reasons: string[], worldId?: { verified?: boolean }): boolean {
  if (worldId?.verified) return true;
  return reasons.some((r) => /world\s*id/i.test(r));
}

/** Normalize a Valiron AgentProfile into our TrustResult. Shared by the keyless
 *  trust check and the operator-keyed path (x402). */
export function toTrustResult(
  p: AgentProfile,
  agentId: string,
  chain: string
): TrustResult {
  const route = p.routing?.finalRoute ?? "sandbox_only";
  const reasons = p.routing?.reasons ?? [];
  return {
    allow: routeAllows(route),
    route,
    score: p.onchainReputation?.averageScore ?? null,
    tier: (p.localReputation?.tier as string) ?? null,
    riskLevel: (p.routing?.signals?.local?.riskLevel as string) ?? null,
    reasons,
    agentName: p.identity?.name ?? null,
    worldIdVerified: detectWorldId(reasons, p.worldId),
    agentId,
    chain,
  };
}

export function failClosed(agentId: string, chain: string, message: string): TrustResult {
  return {
    allow: false,
    route: "error",
    score: null,
    tier: null,
    riskLevel: null,
    reasons: [message],
    agentName: null,
    worldIdVerified: false,
    agentId,
    chain,
    error: message,
  };
}

/**
 * The core trust gate. Fails CLOSED: any error or unknown agent => deny.
 */
export async function checkAgentTrust(params: {
  agentId: string;
  chain?: string;
}): Promise<TrustResult> {
  const { agentId } = params;
  const chain = params.chain || "ethereum";

  // Offline/demo-safety fallback. Default OFF — the live call is the point.
  if (process.env.VALIRON_MOCK === "1") return mockTrust(agentId, chain);

  if (!warmed) await warmupValiron();

  try {
    const p = await sdk.getAgentProfile(agentId, { chain: chain as never });
    return toTrustResult(p, agentId, chain);
  } catch (e) {
    return failClosed(agentId, chain, `Trust check failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

function mockTrust(agentId: string, chain: string): TrustResult {
  const good = agentId === "25459";
  return {
    allow: good,
    route: good ? "prod" : "sandbox",
    score: good ? 92 : 0,
    tier: good ? "AA" : "C",
    riskLevel: good ? "GREEN" : "RED",
    reasons: good
      ? [
          "Human-agent link verified via World ID (device)",
          "Good on-chain reputation: 92 avg score",
        ]
      : [
          "Low on-chain reputation: 0 avg score",
          "No Valiron data - needs sandbox evaluation",
        ],
    agentName: good ? "Valiron Good Agent #1 (Demo)" : `Agent ${agentId}`,
    worldIdVerified: good,
    agentId,
    chain,
  };
}
