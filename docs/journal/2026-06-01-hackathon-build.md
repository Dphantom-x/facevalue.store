# 2026-06-01 → 06-08 · Hackathon build (Phases 0–4 + x402 + design integration)

> Migrated from the original single-file `docs/JOURNAL.md` when the journal moved to
> one-file-per-session (2026-06-11). Covers the entire hackathon build arc.

---

## Phase 0 — Prove the Valiron trust call ✅

**Goal:** Before building anything, prove Valiron returns a real ALLOW vs DENY — the one thing we can't fake.

**What we did**
- Scaffolded Next.js 15 + React 19 + TypeScript + Tailwind v4 (`create-next-app@15`, App Router, `src/`).
- Installed `@valiron/sdk` + `tsx`. Added `scripts/prove-valiron.ts` (`npm run prove:valiron`).
- Probed Valiron's sample agents across chains.

**Key decisions**
- **Decision:** Stack = Next 15 / React 19 / Tailwind v4 / lucide / framer-motion — to match what Claude Design exports (minimal porting at integration time).
- **Decision:** Trust check = `getAgentProfile()`, NOT `gate()` (see bugs).
- **Decision:** Hero "verified fan" agent = `25459` (ethereum) — Valiron's own "Good Agent (Demo)", score 92, World ID verified. Scalper = low/zero-rep agent (`1226` solana / `1` ethereum). Agent IDs kept in config for easy swap.
- **Decision:** Operator key stored in `.env.local` (gitignored), but NOT needed for trust reads — only for the paywall stretch.

**Bugs & fixes**
- **Bug:** `create-next-app _scaffold` — npm names can't start with `_`. **Fix:** normal temp name.
- **Bug:** Scaffolding into `.` failed — `.claude` (session config) counts as a conflict. **Fix:** scaffolded into a temp subdir, moved files up, removed temp. Never touched `.claude`.
- **Bug:** `gate()` returns `identity_required` — needs agent-side challenge-response auth, unusable for server-side checks. **Fix:** switched to `getAgentProfile()` (richer data anyway: route + score + `reasons[]`).
- **Bug:** Valiron edge proxy on Render free tier → cold starts ~30–60s. **Fix:** warm up `GET /operator/health` before calls; generous timeouts.
- **Bug:** Raw-HTTP neighbor probe (PowerShell `Invoke-RestMethod`) returned "not found" for all IDs incl. known-good 25459 — a PowerShell URL quirk, and demo agents aren't sequentially numbered. **Fix:** not pursued; SDK path works. Official labeled good/bad IDs live in the dashboard Playground if needed later.

**Result:** `ALLOW ✅` on 25459 (route `prod`, World ID verified), `DENY ⛔` on 1226/1 (route `sandbox`). Phase 0 hard-gate cleared.

---

## Phase 1 — Valiron module + drop API ✅

**Files**
- `src/lib/valiron.ts` — `checkAgentTrust({agentId, chain})` → normalized `TrustResult` (allow, route, score, tier, `reasons[]`, `worldIdVerified`). `warmupValiron()` health ping. **Fails CLOSED** on error. Optional `VALIRON_MOCK=1` offline fallback (default off).
- `src/lib/store.ts` — in-memory drops + purchases on `globalThis` (survives hot-reload). Seed drop "Midnight Echo" (5 tickets, $60, 1/human). `recordPurchase` enforces one-per-human + inventory. `resetStore()` for tests.
- `src/app/api/drop/purchase/route.ts` — POST: TRUST gate (Valiron) → 403 if denied; AUTHORITY gate (one-per-human + inventory) → 409 if blocked; else approved ticket at face value.
- `src/app/api/drops/route.ts` (GET list) + `src/app/api/dev/reset/route.ts` (POST reseed, non-prod only).
- Playwright: `playwright.config.ts` (auto-starts `npm run dev`; API tests; generous timeouts for cold start) + `e2e/drop-purchase.spec.ts`.

**Decisions**
- **Decision:** Response carries `stage` ("trust" | "policy") + full `trust` object + `reasons[]` so the UI/audit log can render exactly why each purchase cleared or was blocked.
- **Decision:** `humanId` defaults to `agentId`; Phase 3 swaps in the World ID `nullifier_hash` as the real one-per-human key.
- **Decision:** API tests use Playwright's `request` fixture — no browser binaries needed.

**Result:** `3 passed` — verified agent ALLOWED · scalper DENIED at trust gate (403) · second buy BLOCKED (409 LIMIT_REACHED). No bugs; passed first run.

---

## Phase 2 — Split-screen simulation ✅

**Files**
- `src/app/simulation/page.tsx` — two grids reveal in parallel: Mode A (scalpers grab 36/40 across fake accounts) vs Mode B (all 40 → verified fans; swarm of 24 blocked). "Live Valiron trust check" panel makes REAL calls (25459 → ALLOW with World ID, 1226 → DENY) — the "not scripted" anchor.
- `src/app/api/trust-check/route.ts` — read-only Valiron check (no purchase) so the live panel is repeatable without consuming inventory.
- `src/app/page.tsx` — replaced default scaffold with a FaceValue hub.

**Decisions**
- **Decision:** Live panel uses non-mutating `/api/trust-check` so repeated demo runs don't exhaust the drop or hit one-per-human.
- **Decision:** Tile animation is deterministic client-side (illustrative scale); credibility comes from the two real Valiron calls alongside.

**Result:** `4 passed` (3 API + 1 browser; Chromium installed one-time).

---

## Phase 3 — Fan verify + buy flow ✅

**Files**
- `src/app/fan/page.tsx` — Step 1 Verify → Step 2 Buy (agent 25459 + nullifier as `humanId`). Face-value, identity-bound ticket; second buy blocked; "verify as a different person" reset.
- `src/app/api/world-id/verify/route.ts` — SIMULATED World ID; returns a `nullifierHash`. Real path gated behind `WORLDID_REAL=1` (verifyCloudProof + Valiron.verifyWorldId) — TODO if/when we wire the staging widget.

**Decisions**
- **Decision:** World ID simulated (no blocker on creating a staging app), behind a real server route so a live IDKit widget swaps in with no client refactor. `nullifierHash` is the one-per-human key.

**Bugs & fixes**
- **Bug:** Test isolation — spec files ran in parallel across 3 workers sharing the single dev-server in-memory store; a concurrent `beforeEach` reset wiped the fan test's first purchase, so the one-per-human block didn't fire. **Fix:** `workers: 1` in playwright.config — the store is a singleton, so tests must run serially.

**Result:** `5 passed` in ~15s.

---

## Phase 4 — Vendor dashboard ✅

**Files**
- `src/lib/store.ts` — `createDrop()` (+ `slugify`); new drops `unshift` to the front (newest = active drop fans see).
- `src/app/api/vendor/drops/route.ts` — GET list + POST create/launch.
- `src/app/vendor/page.tsx` — config form (artist/event/venue/date/face value/inventory/max-per-human/mode: full|hybrid|lottery) + launch + live list. Defaults for one-click demo.

**Decisions**
- **Decision:** Single-store model — a launched drop is prepended and becomes the active drop (`drops[0]`). Release modes captured in data; lottery/hybrid behavior is post-MVP.

**Result:** `6 passed`.

---

## UI handoff checkpoint 🎨 + idle work during the design pass

- Produced the Claude Design handoff package in `design/` (BUSINESS_CONTEXT, BRAND, SCREENS with `data-testid` contract, HANDOFF, screenshots).
- **Decision:** Redesign is cosmetic-only; functional version stays as a safe fallback. Integration contract = preserve `data-testid`s + API field names.
- Idle work (durable across the redesign): `e2e/demo-flow.spec.ts` (full run-of-show E2E), `scripts/warm.ts` + `npm run warm` (wakes Valiron + primes demo agents), `docs/DEMO.md` (run-of-show + smoke checklist), `docs/PITCH.md` (pitch + judge Q&A). `7 passed`.

---

## Stretch — x402 paywall handshake ✅

**Files:** `src/lib/operator.ts` (ValironOperator singleton; trust gate through the operator-keyed SDK), `src/app/api/x402/checkout/route.ts` (trust gate → 402 with payment requirements → `X-Payment` → mock-settle + one-per-human + 200), `e2e/x402.spec.ts`.

**Decisions**
- **Decision:** Operator `paywall()` is Express-only; on Next we run the gate via `operator.getSDK()` and implement the 402/pay/200 in the route. Settlement mocked — the handshake is real, no funds move.
- **Decision:** `/api/drop/purchase` untouched; x402 is a separate route.

**Result:** `8 passed` + production build clean (15 routes).

---

## UI integration — Claude Design ported onto the engine ✅

**What we did**
- Design shipped as standalone `.jsx` + mock `store.js` + CSS (per-page styles in the `.html` files). It preserved every `data-testid` and mirrored our API shapes exactly.
- Ported to Next: `src/lib/types.ts`, `src/lib/format.ts`, `src/lib/api-client.ts` (real fetch replacing the `FV.api` mock), `src/components/ui.tsx`, 4 routes as client components. `globals.css` = design system + all 4 page style blocks. `layout.tsx` simplified.
- Aligned two server messages the new UI surfaces directly (approved → "…face value … non-transferable."; LIMIT_REACHED → "One ticket per verified human — you already have yours.").

**Bugs & fixes**
- **Bug:** Build lint `@next/next/no-html-link-for-pages` (internal `<a>` links). **Fix:** converted internal nav to `next/link`.
- **Bug:** New pages render the API `message` (old pages hardcoded copy) → testid text assertions would drift. **Fix:** updated the server messages to the canonical copy.

**Result:** `9 passed` (incl. new `e2e/demo-video.spec.ts` proving the 120s video beats) + production build clean.
