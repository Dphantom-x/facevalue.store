/**
 * Phase 0 — Prove the Valiron trust call is real.
 *
 * Goal: confirm we can get a real ALLOW (high-trust agent) and a real DENY
 * (low/zero-trust agent) from Valiron BEFORE building any UI.
 *
 * Run:  npm run prove:valiron
 *
 * Notes from the SDK docs:
 *  - getAgentProfile() is the recommended server-side trust check (gate() may
 *    require agent challenge-response auth, so we try both and compare).
 *  - No API key is required for these read calls.
 *  - The edge proxy is on Render's free tier and may cold-start (~30-60s), so
 *    we warm it up first with a health ping.
 */
import { ValironSDK } from "@valiron/sdk";

const ENDPOINT =
  process.env.VALIRON_ENDPOINT || "https://valiron-edge-proxy.onrender.com";

const sdk = new ValironSDK({ endpoint: ENDPOINT, chain: "ethereum", timeout: 60000 });

const allowFromRoute = (route?: string) =>
  route === "prod" || route === "prod_throttled";

async function warmup() {
  process.stdout.write(
    "Warming up Valiron edge proxy (Render free tier may cold-start)... "
  );
  const start = Date.now();
  try {
    const res = await fetch(`${ENDPOINT}/operator/health`);
    console.log(`health ${res.status} in ${Date.now() - start}ms`);
  } catch (e) {
    console.log(`health check failed: ${(e as Error).message}`);
  }
}

async function inspect(label: string, agentId: string, chain: string) {
  console.log(`\n──────────────────────────────────────────────────────────`);
  console.log(`${label}   (agentId=${agentId}, chain=${chain})`);
  try {
    const p = await sdk.getAgentProfile(agentId, { chain: chain as any });
    console.log(`  name:          ${p.identity?.name ?? "(none)"}`);
    console.log(`  finalRoute:    ${p.routing?.finalRoute}`);
    console.log(`  decision:      ${p.routing?.decision}`);
    console.log(
      `  onchain score: ${p.onchainReputation?.averageScore} (feedback: ${p.onchainReputation?.totalFeedback})`
    );
    console.log(`  local tier:    ${p.localReputation?.tier ?? "(none)"}`);
    if (p.routing?.reasons?.length)
      console.log(`  reasons:       ${p.routing.reasons.join(" | ")}`);
    const allow = allowFromRoute(p.routing?.finalRoute);
    console.log(`  >> getAgentProfile  ⇒  ${allow ? "ALLOW ✅" : "DENY ⛔"}`);
  } catch (e) {
    console.log(`  getAgentProfile ERROR: ${(e as Error).message}`);
  }
  try {
    const g = await sdk.gate(agentId, { chain: chain as any });
    console.log(
      `  >> gate()           ⇒  allow=${g.allow} score=${g.score} tier=${g.tier} route=${g.route}`
    );
  } catch (e) {
    console.log(`  gate() ERROR (ok if it needs agent auth): ${(e as Error).message}`);
  }
}

async function main() {
  console.log(`Valiron endpoint: ${ENDPOINT}`);
  await warmup();

  // Candidate sample agents pulled from the Valiron docs/examples.
  // We're hunting for one clean ALLOW and one clean DENY.
  await inspect("Candidate GOOD #1 (doc sample)", "25459", "ethereum");
  await inspect("Candidate GOOD #2 (doc sample)", "8348", "monad");
  await inspect("Candidate (Solana 'trusted')", "1226", "solana");
  await inspect("Candidate ZERO/unknown", "999999", "ethereum");
  await inspect("Candidate low id", "1", "ethereum");

  try {
    await sdk.dispose();
  } catch {
    /* ignore */
  }
  console.log(
    "\n✔ Done. We need ONE 'ALLOW ✅' and ONE 'DENY ⛔' above to clear Phase 0."
  );
  console.log(
    "  If none are clearly good/bad, grab a 'good' + 'bad' sample agent ID from"
  );
  console.log("  valiron.co/dashboard/playground and we'll plug them in.");
}

main();
