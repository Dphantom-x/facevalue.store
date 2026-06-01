/**
 * Pre-demo warm-up. Wakes the Valiron edge proxy (Render free tier cold-starts ~30-60s)
 * and primes the two demo agents so nothing hangs on stage.
 *
 * Run ~2 minutes before presenting:  npm run warm
 */
import { ValironSDK } from "@valiron/sdk";

const ENDPOINT =
  process.env.VALIRON_ENDPOINT || "https://valiron-edge-proxy.onrender.com";
const sdk = new ValironSDK({ endpoint: ENDPOINT, chain: "ethereum", timeout: 60000 });

async function main() {
  const t0 = Date.now();
  console.log("Warming Valiron edge proxy + demo agents…");

  try {
    const h = await fetch(`${ENDPOINT}/operator/health`);
    console.log(`  health: ${h.status}`);
  } catch (e) {
    console.log(`  health failed: ${(e as Error).message}`);
  }

  const agents: ReadonlyArray<readonly [string, string]> = [
    ["25459", "ethereum"], // verified fan
    ["1226", "solana"], // scalper
  ];
  for (const [id, chain] of agents) {
    try {
      const p = await sdk.getAgentProfile(id, { chain: chain as never });
      console.log(`  agent ${id} (${chain}) → ${p.routing?.finalRoute}`);
    } catch (e) {
      console.log(`  agent ${id} failed: ${(e as Error).message}`);
    }
  }

  console.log(`Done in ${Date.now() - t0}ms. Valiron is warm — run the demo now.`);
  try {
    await sdk.dispose();
  } catch {
    /* ignore */
  }
}

main();
