# FaceValue — project guide for Claude Code

## What this is
**FaceValue** — *"Real fans. Real tickets. Face value."* A hackathon project: an identity-verified,
budget-bounded buying agent that gets real fans fair access to scalped ticket drops.
Sponsor tech: **Valiron** (AI-agent trust scoring + World ID proof-of-personhood). Domain: facevalue.store.

**Thesis:** scalpers win via bot swarms across fake accounts. FaceValue requires proof-of-personhood
(one human = one ticket, Sybil-proof) and runs each fan's *verified agent* through Valiron's trust gate.
Vendors (artists/venues/promoters) opt in to a verified-fan pipeline. Revenue = per-event or % of primary
face-value sales, never resale.

**Language discipline:** never call it a "bot." Scalpers have bots; fans have a *verified agent* in a
sanctioned, vendor-enabled pipeline. We *enforce* purchase limits (BOTS Act of 2016), we don't circumvent them.

## Current status (2026-06-11)
**Two tracks.** Track A — hackathon/demo (DONE): Phases 0–4 + x402 stretch, Claude Design UI integrated,
fan engine terminal, **9 Playwright tests green**, prod build clean, repo pushed; remaining: record the
120s video (`docs/VIDEO_SCRIPT.md`), optional Vercel deploy. Track B — **market validation (NOW)**:
post-hackathon MVP per `docs/BUSINESS.md` — discovery → unpaid pilot → 1-page World ID→Stripe funnel
(no x402/Valiron in the funnel test). Read `docs/BUSINESS.md` before any business/strategy work.

## Documentation system (maintain every session)
- `docs/journal/YYYY-MM-DD-slug.md` — one entry per working session: work done, `**Decision:**` lines
  (with why), `**Bug:**`/`**Fix:**` pairs. Add an index row in `docs/JOURNAL.md` (template + conventions live there).
- `docs/BUSINESS.md` — living business truth (idea, model, risks, gates, funding stance) + changelog.
- `CLAUDE.md` (this file) — living technical truth.
- Rule: journal = what happened and why; living docs = what's true now. When current truth changes,
  update the living doc AND journal it.

## Stack
Next.js 15 (App Router, `src/`) · React 19 · TypeScript · Tailwind v4 (`@theme inline` HSL tokens) ·
`@valiron/sdk` · lucide-react + framer-motion (UI phase) · Playwright (e2e) · deploy: Vercel.
(Stack chosen to match what Claude Design exports, so designed screens drop in with minimal porting.)

## Valiron — PROVEN facts (Phase 0 — do not re-research)
- SDK `@valiron/sdk` v1.0.2. Endpoint `https://valiron-edge-proxy.onrender.com` (Render free tier →
  **COLD STARTS ~30–60s**; always warm up with `GET /operator/health` before tests/demo).
- **Trust check = `getAgentProfile(agentId, { chain })`.** Returns `routing.finalRoute`
  (`prod`/`prod_throttled` ⇒ ALLOW; `sandbox`/`sandbox_only` ⇒ DENY), `routing.reasons[]`
  (human-readable — ideal for the audit log), `onchainReputation.averageScore`, `worldId`.
- **Do NOT use `gate()`** — it returns `identity_required` (needs agent-side challenge-response auth).
- No API key needed for trust reads. The `val_op_` key (`.env.local`, gitignored) is only for the
  paywall/x402 stretch.
- Free-plan trust signals: `8004` + `sandbox`. (`world`/`icebreaker` as gate scoring signals need Pro —
  but we enforce one-human-one-ticket ourselves via the World ID `nullifier_hash`.)

## Demo agents (Valiron sample agents)
- **ALLOW / "verified fan": agentId `25459`, chain `ethereum`** = "Valiron Good Agent #1 (Demo)",
  score 92, **World ID (device) verified** (reason: "Human-agent link verified via World ID"). Also
  `8348` on `monad` = same good demo agent.
- **DENY / "scalper": low/zero-rep agents** — e.g. `1226` (solana, score 0) or `1` (ethereum, score 51) → `sandbox`.
- Keep agent IDs in ONE config constant so they're trivial to swap. TODO (non-blocking): pull the official
  labeled good/bad/zero sample IDs from valiron.co/dashboard/playground for the cleanest stage contrast.

## World ID (proof-of-personhood)
- `verifyWorldId(agentId, { proof, merkle_root, nullifier_hash, verification_level })`.
- `nullifier_hash` = unique per (human, action) → our "one human, one ticket" enforcer.
- Real flow via a World ID **Staging app** (no Orb). NOTE: current World ID 4.0 widget differs from the
  classic proof shape Valiron expects → in Phase 3 use the classic staging IDKit OR simulate the proof.
  The guaranteed-live demo centerpiece is the **trust call**, not the World ID widget.

## Build plan (engine first, then design pause)
- **0. ✅ Prove trust call** — `scripts/prove-valiron.ts` (`npm run prove:valiron`). Cleared.
- **1. Valiron module + drop API** — `lib/valiron.ts` (normalized trust result) + `/api/drop/purchase`
  (inventory + one-per-verified-human). Test: Playwright/API — good agent ALLOW, bad agent DENY.
- **2. Split-screen simulation** — Mode A (scalpers win) vs Mode B (verified win + scalper swarm bounces
  off a real trust call). Test: Playwright asserts outcomes/counters.
- **3. Fan flow + World ID** — verify → nullifier one-per-human → buy. Test: Playwright; 2nd attempt blocked.
- **4. Vendor dashboard** — configure/launch a drop that feeds the fan/sim side.
- **🔻 UI HANDOFF** — produce a FaceValue `BUSINESS_CONTEXT.md` + screen/data contracts + brand-token
  `globals.css` seed → user designs in Claude Design (returns a zip of `.jsx` + `.html` + assets) → integrate.
- **5. Integrate designed UI** + polish + audit log + branding (FaceValue, "Face value ✓").
- **6. Deploy to Vercel** + warm-up + record 75s demo.
- **Stretch:** route purchase through `operator.paywall()` (x402) so the agent pays + is trust-checked in one flow.

**Testing rhythm:** Playwright after each UI phase + a one-line manual smoke test, reported honestly.
**Cut order if short on time:** stretch → vendor polish → Mode-A flourishes.
**Protect (in order):** real trust call → Mode-B "scalpers blocked" → fan verify+pay.

## Commands
- `npm run prove:valiron` — Phase 0 trust-call probe (expect ALLOW on 25459, DENY on 1226/1).
- `npm run dev` — Next dev server.
