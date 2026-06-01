# FaceValue — Screen & Data Contracts (integration spec)

> This is the contract that lets a redesign drop onto the working engine with zero logic changes.
> **Restyle and restructure everything visually — but preserve (a) the `data-testid` attributes
> listed per screen and (b) the data field names.** The app already works against these.

## Stack the design must target
Next.js 15 (App Router, `src/app`) · React 19 · **Tailwind v4** (`@import "tailwindcss"`,
`@theme inline` HSL tokens in `src/app/globals.css`) · components as `.tsx`. lucide-react +
framer-motion are welcome.

## Shared data shapes (returned by the APIs the screens call)
```ts
type Drop = {
  id: string; artist: string; event: string; venue: string; date: string;
  faceValue: number; remaining: number; totalInventory: number; maxPerHuman: number;
  mode: "full" | "hybrid" | "lottery";
};

type TrustResult = {
  allow: boolean; route: string; score: number | null; tier: string | null;
  riskLevel: string | null; reasons: string[]; agentName: string | null;
  worldIdVerified: boolean; agentId: string; chain: string;
};

type PurchaseResp = {
  decision: "approved" | "denied"; message: string;
  ticketId?: string; remaining?: number; faceValue?: number;
  stage?: "trust" | "policy"; code?: "SOLD_OUT" | "LIMIT_REACHED" | "NOT_FOUND";
  trust?: TrustResult;
};
```

## APIs (already built — do not change these calls)
- `GET  /api/drops` → `{ drops: Drop[] }`
- `POST /api/trust-check` `{ agentId, chain? }` → `{ trust: TrustResult }`  (read-only, repeatable)
- `POST /api/drop/purchase` `{ dropId, agentId, chain?, humanId? }` → `PurchaseResp`
  (200 approved · 403 trust-denied · 409 policy-blocked)
- `POST /api/world-id/verify` `{}` → `{ ok, nullifierHash, verificationLevel, simulated }`
- `POST /api/vendor/drops` `{ artist, event, venue, date, faceValue, totalInventory, maxPerHuman, mode }` → `{ ok, drop }`

---

## Screen: `/` — Home / hero
**Purpose:** land the one-liner and route to the three screens.
**Content:** name "FaceValue", tagline "Real fans. Real tickets. Face value.", one-paragraph pitch,
and links to `/simulation`, `/fan`, `/vendor`. Footer line "Built on Valiron agent-identity infrastructure."
**Preserve:** nothing test-critical — just keep working links to the three routes.

## Screen: `/simulation` — Scalpers vs FaceValue (the centerpiece)
**Purpose:** the money shot. Two side-by-side outcomes + a live Valiron anchor.
**Behavior:** a "Run the drop" button animates two grids of ticket tiles. Mode A = scalpers grab most
tiles (red) across fake accounts; Mode B = all tiles go to verified fans (green) and a scalper swarm is
blocked. On run, it also calls `/api/trust-check` for a verified fan and a scalper and shows the real result.
**States:** idle → running (button disabled, tiles filling) → done (summaries appear) ; live panel:
loading → result.
**Preserve these testids + their text semantics:**
- `run-button` — triggers the run.
- `modeA-summary` — appears when done; contains the phrase "shut out".
- `modeB-summary` — appears when done; contains "verified fans" and "blocked".
- `live-fan` — shows "ALLOW" + the World ID reason for the verified agent.
- `live-scalper` — shows "DENY" for the scalper agent.
**Design freedom:** tiles can become anything (seat map, crowd, dots). Keep the red=scalper / green=fan
contrast legible. Make the live Valiron panel feel like proof (badges, the `reasons[]` list, tier/score).

## Screen: `/fan` — Verify & buy
**Purpose:** the fan journey — prove personhood, then the agent buys at face value.
**Flow:** load the active drop (`GET /api/drops`, use `drops[0]`) → Step 1 "Verify" (`POST /api/world-id/verify`,
store `nullifierHash`) → Step 2 "Buy" (`POST /api/drop/purchase` with `agentId:"25459", chain:"ethereum",
humanId: nullifierHash`). Show the result; a 2nd buy by the same human is blocked.
**Preserve these testids:**
- `verify-button` → on success reveals `verified-badge`.
- `verified-badge` — the "verified human" state.
- `buy-button` — **must be disabled until verified**, enabled after.
- `purchase-result` — approved copy must contain "face value" and "non-transferable";
  blocked copy must contain "one ticket per verified human".
- `new-identity-button` — resets to a fresh verified human (demo multiple people).
- `remaining` — "X of Y tickets left".
**Design freedom:** make verification feel premium (World ID motif), make the ticket result feel like a
prize, surface the "Face value $X ✓" chip prominently.

## Screen: `/vendor` — Launch a drop
**Purpose:** the vendor configures + launches a verified-fan drop.
**Form fields → POST /api/vendor/drops:** artist, event, venue, date, faceValue (number),
totalInventory (number), maxPerHuman (number), mode ("full" | "hybrid" | "lottery").
**Preserve these testids:**
- `launch-button` — submits the form.
- `launched-confirm` — success banner after launch.
- `drops-list` — the list of live drops (shows event, face value, remaining, mode).
**Design freedom:** present as a clean dashboard; show the "verified-fan pipeline" value props
(real buyers, scalpers excluded, resale killed, demand signal).
