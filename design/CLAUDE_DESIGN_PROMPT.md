# Paste this into Claude Design

---

You are designing and building the UI for **FaceValue**, a web app. There are **4 pages**: `/` (home),
`/simulation`, `/fan`, `/vendor`. Below is a complete **functional/content specification** — every
section, card, button, input, state, and message each page must contain and do.

**All visual and layout design is yours** — colors, typography, spacing, components, imagery, motion,
hierarchy, responsiveness. I am only specifying *what each page contains and does*, not how it should look.
Reproduce every element and behavior listed.

## What FaceValue is (context only)
FaceValue gives fans fair access to ticket drops that scalpers normally sweep with bots. It requires
**proof-of-personhood** (one real human = one ticket) and runs each fan's **verified agent** through a
trust service called **Valiron** before any purchase clears. Two checks run on every buy: a **trust gate**
(is this a trustworthy, identity-backed agent, not a bot swarm?) and an **authority gate** (one ticket per
verified human, at face value). Tickets are bound to the verified identity, so they can't be resold.
Vendors (artists/venues) opt in and launch drops. Tone of the product: fan-first, anti-scalper, credible.

## Technical requirements (required for integration — keep these exactly)
- **Next.js 15 App Router + React 19 + TypeScript.** One page component per route at
  `src/app/<route>/page.tsx` (home is `src/app/page.tsx`).
- **Tailwind CSS v4.** Put design tokens in `src/app/globals.css` using `@import "tailwindcss";` and
  `@theme inline { ... }`. Provide that file.
- Interactive pages must start with `"use client";` (they use React hooks + `fetch`).
- **Implement the full behavior** described per page (the `fetch` calls, state, and transitions) — return
  working components, not static mockups.
- **Do not change** the API endpoints, their request/response field names, or the `data-testid`
  attributes listed below. You may restructure and restyle everything else.
- Every page must handle **loading, empty, error, and disabled** states gracefully, and work on **mobile and desktop**.

## Data the pages render (API response shapes)
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

## APIs (already built — call these exactly)
- `GET  /api/drops` → `{ drops: Drop[] }`
- `POST /api/trust-check` body `{ agentId, chain }` → `{ trust: TrustResult }` (read-only, repeatable)
- `POST /api/drop/purchase` body `{ dropId, agentId, chain, humanId }` → `PurchaseResp`
  (HTTP 200 = approved, 403 = trust-denied, 409 = policy-blocked, 404 = drop not found)
- `POST /api/world-id/verify` body `{}` → `{ ok, nullifierHash, verificationLevel, simulated }`
- `POST /api/vendor/drops` body `{ artist, event, venue, date, faceValue, totalInventory, maxPerHuman, mode }` → `{ ok, drop }`

## Fixed values to use
- The fan's verified agent: `agentId: "25459"`, `chain: "ethereum"`.
- Simulation demo agents: verified fan `25459`/`ethereum`; scalper `1226`/`solana`.

---

# PAGE 1 — Home (`/`)

**Purpose:** introduce FaceValue and route to the three experiences.

**Required content**
- Product name: **FaceValue**.
- Tagline: **"Real fans. Real tickets. Face value."**
- A short intro paragraph, e.g.: *"Scalpers win by running bot swarms across fake accounts. FaceValue
  requires proof-of-personhood — one real human, one ticket — and runs every fan's verified agent through
  Valiron's trust gate."*
- **Three navigation actions** (links), each going to a route:
  1. → `/simulation` — label: **"Scalpers vs FaceValue — live simulation"** (this is the primary CTA)
  2. → `/fan` — label: **"Fan — verify & get your ticket"**
  3. → `/vendor` — label: **"Vendor — launch a verified-fan drop"**
- Footer line: **"Built on Valiron agent-identity infrastructure."**

**Recommended optional sections (you may add to make it a real landing page; content provided):**
- *The problem:* tickets vanish in seconds and reappear on resale at 5–10× face value; bots beat
  account-based defenses because accounts are easy to fake. (It's illegal under the BOTS Act of 2016 and
  still rampant.)
- *How it works (3 steps):* (1) Vendor launches a verified-fan drop. (2) Each fan proves they're one real
  human (World ID). (3) Their verified agent buys one ticket at face value the moment it drops.
- *For fans:* one human, one ticket, at face value, no camping, no scalpers.
- *For vendors:* real buyers, scalpers structurally excluded, resale on your product killed, plus a clean
  demand signal.

**States:** static (no data fetching). **Buttons/links:** the 3 nav links above must work.

---

# PAGE 2 — Simulation (`/simulation`)

**Purpose:** the centerpiece. Show, side by side, scalpers sweeping a drop "today" vs. verified fans
winning under FaceValue — plus a **live, real** Valiron trust check as proof it isn't scripted.

**Header**
- Back link "← FaceValue" → `/`.
- Title: **"Scalpers vs FaceValue"**.
- Subtitle: **"One ticket drop, two worlds. Watch what changes when every buyer must be a verified human."**

**Primary control**
- Button **"Run the drop"** — `data-testid="run-button"`. While running, label **"Running…"** and disabled.
  Re-runnable (clicking again restarts the whole simulation).

**Two side-by-side panels** (stack on mobile), each with a grid of **40 ticket tiles** and a summary that
appears only after a run completes:

- **Panel A — "Today — no verification"**
  - Subtitle: "Bots sweep tickets across dozens of fake accounts."
  - 40 tiles; during the run they fill so that **36 tiles = scalper** and **4 tiles = fan** (two visually
    opposed states — one "winning/legit", one "scalper"; you choose the visual language).
  - After done — summary `data-testid="modeA-summary"`, text:
    **"Scalpers grabbed 36/40 tickets across 24 fake accounts. Real fans shut out: 96."**
    (MUST contain the words "shut out".)

- **Panel B — "With FaceValue — verified humans"**
  - Subtitle: "One proven human, one ticket. The scalper swarm hits the Valiron gate."
  - 40 tiles; during the run **all 40 fill as "fan/verified"**.
  - After done — summary `data-testid="modeB-summary"`, text:
    **"All 40 tickets → verified fans (1 each). Scalper swarm blocked: 24. Resale: 0."**
    (MUST contain the words "verified fans" and "blocked".)

**Live Valiron trust check section** (below the panels)
- Heading: **"Live Valiron trust check"** with a smaller note: **"— not scripted; real calls to Valiron"**.
- **Two cards** side by side:
  - **Card 1 — Verified fan's agent** — `data-testid="live-fan"`
    - Loading state: **"Checking with Valiron… (first call may wake the server)"**
    - Result state: a prominent verdict **"ALLOW ✓"** (this card resolves to ALLOW); a detail line
      **"{agentName} · score {score} · {route}"** (e.g. "Valiron Good Agent #1 (Demo) · score 92 · prod");
      and a bulleted list of `reasons[]` (e.g. "Human-agent link verified via World ID (device)",
      "Good on-chain reputation: 5 feedback, 92 avg score").
    - (MUST contain the text "ALLOW" and, in the reasons, "World ID".)
  - **Card 2 — Scalper swarm agent** — `data-testid="live-scalper"`
    - Loading state: **"Checking with Valiron…"**
    - Result state: verdict **"DENY ✗"** (this card resolves to DENY); detail line
      **"{agentName} · score {score} · {route}"** (e.g. "NoahScout_Bot.noah · score 0 · sandbox"); the
      `reasons[]` list.
    - (MUST contain the text "DENY".)

**Behavior**
- On "Run the drop": reset both grids to empty; **in parallel** POST `/api/trust-check` twice — once with
  `{agentId:"25459", chain:"ethereum"}` (→ fills Card 1) and once with `{agentId:"1226", chain:"solana"}`
  (→ fills Card 2). Animate the tiles filling over ~2 seconds, then reveal both summaries. The two live
  cards populate independently when their calls return (show loading until then). If a call returns nothing,
  show a neutral "—".
- The live calls are read-only and safe to repeat.

**States:** idle (empty grids, no summaries) → running (button disabled, tiles filling) → done (summaries
shown). Live cards: loading → result.

---

# PAGE 3 — Fan (`/fan`)

**Purpose:** the fan journey — prove personhood, then a verified agent buys at face value; one ticket per human.

**Header**
- Back link "← FaceValue" → `/`.
- Title: **"Get your ticket"**.
- Subtitle: **"Prove you're one real human, then your verified agent buys at face value."**

**Drop card** (data from `GET /api/drops`, use the first drop `drops[0]`)
- Event name (e.g. "Midnight Echo — Live at The Forum").
- A prominent chip: **"Face value ${faceValue} ✓"**.
- A line: "{venue} · {date}".
- A line — `data-testid="remaining"` — text: **"{remaining} of {totalInventory} tickets left · max
  {maxPerHuman} per verified human"**.
- Empty state: if there is no drop, show a simple "No active drop yet." message instead of the card.

**Step 1 card — "Step 1 — prove personhood"**
- **Before verified:** button **"Verify (one human, one ticket)"** — `data-testid="verify-button"`. While in
  progress, label **"Verifying…"** and disabled.
- **After verified:**
  - A success badge — `data-testid="verified-badge"` — text: **"✓ Verified human · World ID (simulated)"**.
  - A sub-line: **"nullifier {short hash like 0x1234…ab12} · one human, one ticket"**.
  - A reset link/button — `data-testid="new-identity-button"` — label **"Verify as a different person"**
    (clears verification so a different "human" can be demoed).
- Always show a small note: **"Simulated for the demo; a real World ID staging widget drops in here."**

**Step 2 card — "Step 2 — let your agent buy"**
- Button **"Buy with my verified agent"** — `data-testid="buy-button"`. **Disabled until verified.** While in
  progress, label **"Buying…"** and disabled.
- **Result panel** (appears after a buy) — `data-testid="purchase-result"`. Render one of:
  - Approved (`decision === "approved"`): **"🎟 Ticket secured at face value ${faceValue} — bound to your
    verified identity, non-transferable. ({ticketId})"** (MUST contain "face value" and "non-transferable").
  - Blocked, already has one (`code === "LIMIT_REACHED"`): **"One ticket per verified human — you already
    have yours."** (MUST contain "one ticket per verified human").
  - Blocked by trust (`stage === "trust"`): **"Agent blocked by Valiron trust gate."**
  - Sold out (`code === "SOLD_OUT"`): "This drop is sold out."
  - Any other denial: show `message`.

**Behavior**
- On load: `GET /api/drops`, use `drops[0]` as the active drop.
- Verify click: `POST /api/world-id/verify` with `{}`; store the returned `nullifierHash`.
- Buy click: `POST /api/drop/purchase` with `{ dropId: drop.id, agentId: "25459", chain: "ethereum",
  humanId: <the nullifierHash> }`; render the result; then re-fetch the drop so "remaining" updates.
- A second buy with the same nullifier returns 409 / `LIMIT_REACHED` (show the blocked message).

**States:** drop loading / empty; not-verified (buy disabled); verifying; verified; buying; result
(approved / limit / trust-denied / sold-out / other).

---

# PAGE 4 — Vendor (`/vendor`)

**Purpose:** a vendor configures and launches a verified-fan drop.

**Header**
- Back link "← FaceValue" → `/`.
- Title: **"Vendor dashboard"**.
- Subtitle: **"Configure a verified-fan drop. Only identity-verified humans can buy — scalpers are
  structurally excluded."**

**Configuration form** (a card) — 8 fields, pre-filled with sensible defaults:
1. **Artist** — text — default "Aurora Lane"
2. **Event** — text — default "Aurora Lane — Neon Cities Tour"
3. **Venue** — text — default "Brooklyn Steel, NYC"
4. **Date** — text/date — default "2026-10-04"
5. **Face value (USD)** — number — default 75
6. **Total inventory** — number — default 200
7. **Max per verified human** — number — default 1
8. **Release mode** — select — options (label → value): "Full verified pipeline" → `full`,
   "Hybrid (half verified)" → `hybrid`, "Lottery / batch" → `lottery`. Default `full`.

**Launch control**
- Button **"Launch drop"** — `data-testid="launch-button"`. While in progress, label **"Launching…"** and disabled.
- **Success banner** after launch — `data-testid="launched-confirm"` — text: **"✓ Launched {event}. Verified
  fans can now buy at face value —"** followed by a link to `/fan` labeled "open the fan page".

**Live drops list**
- Heading: **"Live drops"**.
- A list — `data-testid="drops-list"` — one row per drop showing: the **event name** and a stats line
  **"${faceValue} · {remaining}/{totalInventory} left · {maxPerHuman}/human · {mode}"**.
- Empty state: "No drops yet."

**Behavior**
- On load: `GET /api/drops` → populate the list.
- Launch click: `POST /api/vendor/drops` with the form values → on `{ok:true}`, show the banner and re-fetch
  the list (the new drop appears at the top).

**Recommended optional content (you may add):** a short "What you get" block — real buyers, scalpers
excluded, resale killed, demand signal.

**States:** form idle; launching; launched (banner); list loading / empty / populated.

---

# Integration-critical copy (must be reproduced verbatim enough to contain these substrings)
- Simulation `modeA-summary`: contains **"shut out"**.
- Simulation `modeB-summary`: contains **"verified fans"** and **"blocked"**.
- Simulation `live-fan`: contains **"ALLOW"** and a reason containing **"World ID"**.
- Simulation `live-scalper`: contains **"DENY"**.
- Fan `purchase-result` (approved): contains **"face value"** and **"non-transferable"**.
- Fan `purchase-result` (limit): contains **"one ticket per verified human"**.
- Fan `buy-button`: disabled until `verified-badge` is shown.

# data-testid attributes that must exist (used by automated tests)
- `/simulation`: `run-button`, `modeA-summary`, `modeB-summary`, `live-fan`, `live-scalper`
- `/fan`: `remaining`, `verify-button`, `verified-badge`, `new-identity-button`, `buy-button`, `purchase-result`
- `/vendor`: `launch-button`, `launched-confirm`, `drops-list`

# Deliverable
- `src/app/page.tsx` (home), `src/app/simulation/page.tsx`, `src/app/fan/page.tsx`, `src/app/vendor/page.tsx`,
  and `src/app/globals.css` (with your Tailwind v4 design tokens). Plus any shared components you create.
- Each interactive page fully implements the behavior above (fetch + state), keeps the `data-testid`s and the
  API field names, and starts with `"use client";`.
