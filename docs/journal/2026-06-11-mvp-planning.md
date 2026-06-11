# 2026-06-11 · Post-hackathon: teardown digest, docs system, business plan

**Focus:** Shift from hackathon mode to real-MVP planning; set up the documentation system.

## Catch-up (work since the last entry, ~06-08 → 06-11)
- Fan page upgraded: **live engine terminal** under the drop card streaming the real Valiron
  `getAgentProfile` call + World ID + authority gate with ms timings; agent now "arms and fires at the
  drop" (3-2-1 countdown) so the buy reads as the on-sale moment, not instant. Test asserts the terminal
  surfaces the trust gate. `9 passed`.
- `submission/` added: `SUBMISSION.md` (Aldo Hidalgo · aldohidalgo0319@gmail.com · description) + pitch deck.
- `docs/VIDEO_SCRIPT.md`: 120s shot-by-shot, then revised to a conversational cut on user feedback
  (side-agnostic simulation narration; fan beat reframed as a normal checkout with two checks; "Valiron
  isn't bolted on" line added). Pushed through commit `bec8a25`.
- Laptop setup documented for the user: `npm install` is the only must-do; `.env.local` + Playwright
  Chromium optional.

## What we did today
- **Digested the YC-style teardown** (verdict: "WEAK — pivot required on incentives") and reconciled it
  against all prior rebuttals. Full analysis lives in `docs/BUSINESS.md` (risks section).
- **Created the documentation system** (see `docs/JOURNAL.md` for the rules): journal folder (history),
  `docs/BUSINESS.md` (business truth), `CLAUDE.md` (technical truth).
- **Set the validation plan + funding stance** (recorded in BUSINESS.md).

## Decisions
- **Decision:** Two tracks. Track A (done) = hackathon demo + Valiron LOI. Track B (now) = market
  validation. *Why:* the teardown's #1 flaw (vendor incentive misalignment) is a discovery problem, not
  a code problem — more engineering can't answer it.
- **Decision:** Launch artifact = ONE hardcoded drop page → World ID verify → Stripe link → manual payout.
  Cut x402 AND Valiron from the funnel test. *Why:* one friction at a time; World ID's nullifier alone
  enforces one-per-human for human checkout. Valiron stays in the agent-layer/LOI track.
- **Decision:** Wedge (merch drops vs tickets) stays open — run discovery on both indie promoters/venues
  and community-first creators; let acute pain pick. *Why:* merch pilots faster; tickets are structurally
  stronger (identity-bound entry kills resale + sweatshops).
- **Decision:** Never PAY a vendor to pilot (free/fee-waived is fine). *Why:* a paid pilot manufactures a
  false yes on the exact assumption we're testing.
- **Decision:** Funding stance — bootstrap to the few-$k/month goal; no VC by default; optional
  self-sponsored micro-event capped ≤$1k counts as a friction test + case study only, never as vendor
  validation. Revisit raising only on strong pilot data + upgraded ambition.

## Bugs & fixes
- None (planning/docs session).

## State at end
- Repo: 9 Playwright green, prod build clean. Uncommitted before this session: `docs/VIDEO_SCRIPT.md`
  revision → committed with the docs system in this session's commit.
- Hackathon track remaining: record the video (script ready), optional Vercel deploy.

## Next / open threads
- Draft `docs/MVP_PLAN.md` (week-by-week, DM scripts in promoter + creator variants, funnel
  instrumentation spec, vendor pilot one-pager).
- Record the 120s demo video.
- Optional: Vercel deploy for a live URL.
