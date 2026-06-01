# FaceValue — Demo Run-of-Show & Smoke Test

## Pre-demo checklist (~2 min before presenting)
1. **`npm run warm`** — wakes the Valiron edge proxy (Render free tier cold-starts ~30–60s) and primes
   the demo agents. Wait for "Valiron is warm".
2. **`npm run dev`** — start the app at http://localhost:3000. Click through `/simulation`, `/fan`,
   `/vendor` once so Next compiles each route (first visit compiles).
3. (Optional) Reset demo state to a clean slate: `POST http://localhost:3000/api/dev/reset`
   (or just restart `npm run dev`).
4. Have the **backup recording** ready in case of venue wifi issues.

## Run-of-show (~75–90s)
| Time | Screen / action | Narration |
|------|-----------------|-----------|
| 0:00 | Home or title | "You waited for your favorite artist's tickets. Gone in 30 seconds — now they're $1,200 on resale. You got scalped." |
| 0:10 | `/simulation` → **Run the drop**, point at the LEFT panel | "Today, bots sweep the whole drop across dozens of fake accounts. Real fans are shut out." |
| 0:25 | Point at the RIGHT panel + the **Live Valiron** cards | "With FaceValue, every buyer must be one verified human. The scalper swarm hits Valiron's gate. And this isn't scripted — that's a real Valiron call: **ALLOW** for the verified human, **DENY** for the scalper, right now." |
| 0:45 | `/fan` → **Verify** → **Buy with my verified agent** | "A real fan proves they're one human, and their verified agent grabs one ticket — at face value, bound to their identity, non-transferable." |
| 1:00 | Click **Buy** again | "Try to grab a second? Blocked. One human, one ticket." |
| 1:10 | `/vendor` → **Launch drop** | "Vendors opt in and launch a verified-fan drop in seconds — real buyers, scalpers structurally excluded, resale killed." |
| 1:20 | Home / close | "Built on Valiron's agent-identity infrastructure. FaceValue — real fans, real tickets, face value." |

## Manual smoke test (click-through, ~2 min)
1. **Home `/`** — name, tagline, and three working links (simulation, fan, vendor).
2. **Vendor `/vendor`** — click **Launch drop** → green "Launched …" banner → the drop appears under "Live drops".
3. **Fan `/fan`** — drop card shows the event + "Face value $X ✓"; **Buy is disabled**. Click **Verify** →
   "✓ Verified human" badge appears; **Buy enables**. Click **Buy** → "Ticket secured at face value … non-transferable".
   Click **Buy** again → "One ticket per verified human". Click **Verify as a different person** → you can buy again.
4. **Simulation `/simulation`** — click **Run the drop** → left fills with scalpers, right fills with verified fans;
   both summaries appear; the Live cards show **ALLOW** (verified fan, World ID) and **DENY** (scalper).

## Automated full-flow test
`npm test` runs the whole suite, including **`e2e/demo-flow.spec.ts`**, which walks this exact run-of-show
end to end against live Valiron. A green run means the demo works.
