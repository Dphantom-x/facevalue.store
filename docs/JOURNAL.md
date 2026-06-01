# FaceValue — Project Journal

A chronological log of decisions, choices, issues, and solutions, documented per batch of work.
Companion to `CLAUDE.md` (the living project guide). Newest entries at the bottom.

---

## 2026-06-01 · Phase 0 — Prove the Valiron trust call ✅

**Goal:** Before building anything, prove Valiron returns a real ALLOW vs DENY — the one thing we can't fake.

**What we did**
- Scaffolded Next.js 15 + React 19 + TypeScript + Tailwind v4 (`create-next-app@15`, App Router, `src/`).
- Installed `@valiron/sdk` + `tsx`. Added `scripts/prove-valiron.ts` (`npm run prove:valiron`).
- Probed Valiron's sample agents across chains.

**Key decisions**
- **Stack = Next 15 / React 19 / Tailwind v4 / lucide / framer-motion** to match what Claude Design exports (minimal porting at integration time).
- **Trust check = `getAgentProfile()`**, NOT `gate()` (see issues).
- Hero "verified fan" agent = **`25459` (ethereum)** — Valiron's own "Good Agent (Demo)", score 92, World ID verified. Scalper = low/zero-rep agent (`1226` solana / `1` ethereum). Agent IDs kept in config for easy swap.
- Operator key stored in `.env.local` (gitignored), but NOT needed for trust reads — only for the paywall stretch.

**Issues & solutions**
- `create-next-app _scaffold` → npm names can't start with `_`. Fixed: normal temp name.
- Scaffolding into `.` failed — `.claude` (this session's config) counts as a conflict. Fixed: scaffolded into a temp subdir, moved files up, removed temp. Never touched `.claude`.
- **`gate()` returns `identity_required`** — needs agent-side challenge-response auth, unusable for server-side checks. Switched to `getAgentProfile()` (richer data anyway: route + score + `reasons[]`).
- Valiron edge proxy is on **Render free tier → cold starts ~30–60s**. Solution: warm up `GET /operator/health` before calls; generous timeouts.
- Raw-HTTP neighbor probe (PowerShell `Invoke-RestMethod`) returned "not found" for all IDs incl. known-good 25459 → a PowerShell URL quirk, and demo agents aren't sequentially numbered. Not pursued; SDK path works. Official labeled good/bad IDs are in the dashboard Playground if needed later.

**Result:** `ALLOW ✅` on 25459 (route `prod`, World ID verified), `DENY ⛔` on 1226/1 (route `sandbox`). Phase 0 hard-gate cleared.

**Manual steps for user:** none. (Heads-up: Phase 3 needs a World ID **Staging** app — steps provided then.)

---

## 2026-06-01 · Phase 1 — Valiron module + drop API ✅

**Goal:** A clean trust wrapper + the protected purchase endpoint enforcing the two gates.

**Files**
- `src/lib/valiron.ts` — `checkAgentTrust({agentId, chain})` → normalized `TrustResult` (allow, route, score, tier, `reasons[]`, `worldIdVerified`). `warmupValiron()` health ping. **Fails CLOSED** on error. Optional `VALIRON_MOCK=1` offline fallback (default off).
- `src/lib/store.ts` — in-memory drops + purchases on `globalThis` (survives hot-reload). Seed drop "Midnight Echo" (5 tickets, $60, 1/human). `recordPurchase` enforces one-per-human + inventory. `resetStore()` for tests.
- `src/app/api/drop/purchase/route.ts` — POST: TRUST gate (Valiron) → 403 if denied; AUTHORITY gate (one-per-human + inventory) → 409 if blocked; else approved ticket at face value.
- `src/app/api/drops/route.ts` (GET list) + `src/app/api/dev/reset/route.ts` (POST reseed, non-prod only).
- Playwright: `playwright.config.ts` (auto-starts `npm run dev`; API tests; generous timeouts for cold start) + `e2e/drop-purchase.spec.ts`.

**Decisions**
- Response carries `stage` ("trust" | "policy") + full `trust` object + `reasons[]`, so the eventual UI/audit log can render exactly why each purchase cleared or was blocked.
- `humanId` defaults to `agentId` for now; Phase 3 swaps in the World ID `nullifier_hash` as the real one-per-human key.
- API tests use Playwright's `request` fixture — no browser binaries needed (kept the install light).

**Issues & solutions:** none — passed on first run.

**Result:** `3 passed` — verified agent ALLOWED · scalper DENIED at trust gate (403) · second buy BLOCKED (409 LIMIT_REACHED).

**Manual smoke test:** `npm test` (expect `3 passed`).

**Manual steps for user:** none.

---

## 2026-06-01 · Phase 2 — Split-screen simulation ✅

**Goal:** The demo centerpiece — scalpers sweeping a drop today vs. verified fans winning under FaceValue, anchored by a real Valiron call.

**Files**
- `src/app/simulation/page.tsx` — client component. Two grids reveal in parallel: Mode A (scalpers grab 36/40 across fake accounts) vs Mode B (all 40 → verified fans; swarm of 24 blocked). A "Live Valiron trust check" panel makes REAL calls for the verified fan (25459 → ALLOW, World ID) and a scalper (1226 → DENY) — the "not scripted" anchor.
- `src/app/api/trust-check/route.ts` — read-only Valiron check (no purchase) so the live panel is repeatable without consuming inventory.
- `src/app/page.tsx` — replaced default scaffold with a FaceValue hub.

**Decisions**
- Live panel uses non-mutating `/api/trust-check` (not `/api/drop/purchase`) so repeated demo runs don't exhaust the drop or hit one-per-human.
- Tile animation is deterministic client-side (illustrative scale); credibility comes from the two real Valiron calls shown alongside.
- Installed Chromium for Playwright browser tests (one-time).

**Issues & solutions:** Home overwrite needed a prior Read (Write guard) — read then wrote.

**Result:** `4 passed` (3 API + 1 browser).

**Manual smoke test:** `npm run dev` → http://localhost:3000/simulation → "Run the drop". Or `npm test`.

**Manual steps for user:** none.

---

## 2026-06-01 · Phase 3 — Fan verify + buy flow ✅

**Goal:** The fan path — prove personhood, then a verified agent buys at face value; one ticket per human.

**Files**
- `src/app/fan/page.tsx` — Step 1 "Verify (one human, one ticket)" → Step 2 "Buy with my verified agent" (agent 25459 + the nullifier as `humanId`). Shows ticket at face value, identity-bound/non-transferable; blocks a second buy. "Verify as a different person" resets identity to demo multiple humans.
- `src/app/api/world-id/verify/route.ts` — SIMULATED World ID; returns a `nullifierHash`. Real path gated behind `WORLDID_REAL=1` (verifyCloudProof + Valiron.verifyWorldId) — TODO when we wire the staging widget.

**Decisions**
- World ID simulated for now (no blocker on creating a staging app), behind a real server route so the live IDKit widget swaps in with no client refactor. `nullifierHash` is the one-per-human key.
- Buy is UI-gated on verification.

**Issues & solutions**
- **Test isolation bug:** spec files ran in parallel across 3 workers sharing the single dev-server in-memory store; a concurrent `beforeEach` reset wiped the fan test's first purchase, so the one-per-human block didn't fire (both buys succeeded). **Fix: `workers: 1`** in playwright.config — the store is a singleton, so tests must run serially.

**Result:** `5 passed` in ~15s.

**Manual smoke test:** `npm run dev` → http://localhost:3000/fan → Verify → Buy (twice). Or `npm test`.

**Manual steps for user:** none.

---

## 2026-06-01 · Phase 4 — Vendor dashboard ✅

**Goal:** Vendors configure + launch a verified-fan drop that feeds the fan/sim side.

**Files**
- `src/lib/store.ts` — added `createDrop()` (+ `slugify`); new drops `unshift` to the front (newest = active drop the fan page shows).
- `src/app/api/vendor/drops/route.ts` — GET list + POST create/launch.
- `src/app/vendor/page.tsx` — config form (artist/event/venue/date/face value/inventory/max-per-human/release mode: full|hybrid|lottery) + "Launch drop" + live drops list. Sensible defaults for one-click demo.

**Decisions**
- Single-store model: a launched drop is prepended and becomes the active drop the fan page loads (`drops[0]`). Release modes are captured in data; lottery/hybrid behavior is a post-MVP refinement.

**Issues & solutions:** none.

**Result:** `6 passed`.

**Manual smoke test:** `npm run dev` → http://localhost:3000/vendor → "Launch drop" → see it listed + on /fan. Or `npm test`.

**Manual steps for user:** none.

---

## 2026-06-01 · UI Handoff checkpoint 🎨 (engine complete)

**State:** Phases 0–4 done. `6 passed`, prod build clean. Functional UI live at `/`, `/simulation`, `/fan`, `/vendor`.

**Produced the Claude Design handoff package** in `design/`:
- `BUSINESS_CONTEXT.md`, `BRAND.md`, `SCREENS.md` (data + `data-testid` contract), `HANDOFF.md` (instructions + integration contract), `screenshots/` (4 reference PNGs captured via a temp Playwright spec, since deleted).

**Decisions**
- Redesign is cosmetic-only: the demo already runs + passes tests, so the functional version is a safe fallback.
- Integration contract = preserve `data-testid`s + API field names; restyle everything else. Target Next 15 / React 19 / Tailwind v4 `.tsx`.

**Next (waiting on user):** user runs the Claude Design pass (`design/HANDOFF.md`) and drops the returned zip into the project; then port onto live routes, re-run Playwright, set brand tokens, polish → deploy → demo.

**Manual steps for user:** (1) Run the Claude Design pass per `design/HANDOFF.md`. (2) Optional/later: create a World ID Staging app to make verification live.

---

## 2026-06-01 · Idle work during design — demo-flow E2E + warm + run-of-show ✅

**Goal:** Use the design wait productively with durable assets (survive the redesign — rely only on preserved `data-testid`s + APIs).

**Files**
- `e2e/demo-flow.spec.ts` — full run-of-show in one test: vendor launches → fan verify+buy (face value, non-transferable) → second buy blocked → scalper denied at trust gate (403) → simulation (Mode A/B + live ALLOW/DENY). Real Valiron throughout.
- `scripts/warm.ts` + `npm run warm` — wakes the Valiron Render proxy + primes demo agents (25459→prod, 1226→sandbox) so nothing cold-starts on stage.
- `docs/DEMO.md` — pre-demo checklist, beat-by-beat run-of-show (~75–90s) mapped to our routes/buttons + narration, and a manual smoke-test click-through.
- `docs/PITCH.md` — 30-sec pitch, how-it-works, business model, why-now, the ask, and honest answers to the hard judge questions.

**Result:** `7 passed` (25.7s) with Valiron warm. Warm script: ~1s.

**Manual steps for user:** none (run-of-show + smoke checklist live in `docs/DEMO.md`).

---

## 2026-06-01 · Stretch — x402 paywall handshake ✅

**Goal:** Demonstrate Valiron's monetization rail — the agent pays per ticket via x402 — not just the trust gate. Strengthens the LOI story (drives both halves of Valiron's product).

**Files**
- `src/lib/valiron.ts` — refactored: extracted `toTrustResult()` + `routeAllows()` + `failClosed()` (shared by keyless and operator-keyed paths). Behavior unchanged.
- `src/lib/operator.ts` — `ValironOperator` singleton from `VALIRON_OPERATOR_KEY`; `operatorTrustCheck()` runs the trust gate through the operator-keyed SDK (`operator.getSDK()`). `hasOperatorKey()` guard.
- `src/app/api/x402/checkout/route.ts` — x402 handshake: trust gate → 403 if denied; no `X-Payment` → 402 with payment requirements (price = face value + trust tier/score, payTo, base-sepolia/USDC); `X-Payment` present → mock-settle + one-per-human + 200 ticket with `X-Payment-Response`.
- `e2e/x402.spec.ts` — 402 → pay → 200; scalper 403 at trust gate.

**Decisions**
- Operator `paywall()` is Express-only; on Next we run the trust gate via `operator.getSDK()` (genuinely uses the val_op_ key) and implement the x402 402/pay/200 in the route. Production = `operator.paywall({ pricePerCall })` one-liner or `createValironNextMiddleware`.
- Settlement is mocked (per plan) — the x402 *handshake* is real/demonstrable; no real funds move.
- Kept `/api/drop/purchase` untouched (fan flow + tests unaffected); x402 is a separate route.

**Result:** `8 passed` (30.4s) + production build clean (15 routes).

**Manual steps for user:** none.

---

## 2026-06-01 · UI integration — Claude Design ported onto the engine ✅

**Goal:** Wire the Claude Design export onto the live routes; keep every test green.

**What we did**
- Design shipped as standalone `.jsx` (home/simulation/fan/vendor) + `ui.jsx` + a mock `store.js` + `styles/globals.css`, with per-page CSS in the `.html` `<style>` blocks. It preserved every `data-testid` and mirrored our API shapes exactly.
- Ported to Next: `src/lib/types.ts`, `src/lib/format.ts` (fmtMoney/shortHash/agent consts), `src/lib/api-client.ts` (real `fetch` wrappers replacing the `FV.api` mock), `src/components/ui.tsx` (shared components, `next/link`), and the 4 `src/app/*/page.tsx` routes (`"use client"`, hooks, real API calls). `globals.css` = design system + all 4 page style blocks. `layout.tsx` simplified (design ships its own fonts; dropped Tailwind/Geist).
- Aligned two server messages to what the new pages now surface directly: purchase approved → "…face value … non-transferable."; LIMIT_REACHED → "One ticket per verified human — you already have yours."

**Issues & solutions**
- Build lint error `@next/next/no-html-link-for-pages` (internal `<a>`). Fixed: converted internal nav to `next/link` in `ui.tsx` + home.
- New pages render the API `message` (old pages hardcoded copy) → updated those server messages so the testid text assertions still hold.

**Result:** `9 passed` — added `e2e/demo-video.spec.ts` (the 120s shot-by-shot) — + production build clean (15 routes). Screenshots in `design/screenshots-final/`.

**Manual steps for user:** none.
