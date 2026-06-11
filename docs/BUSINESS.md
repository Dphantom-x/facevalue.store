# FaceValue — Business Context & Development

> **Living document — the CURRENT state of the business thinking.** History and the reasoning behind
> changes live in `docs/journal/`. When the idea/model/strategy changes: update this doc in place AND
> add a line to the changelog at the bottom.

## One-liner
Proof-of-personhood ticketing & drops: **one real human = one item, at face value.**
*"Real fans. Real tickets. Face value."* — facevalue.store

## The problem
Hot tickets/drops vanish in seconds and reappear on resale at 5–10×+. It's illegal (BOTS Act 2016) and
still everywhere, because every existing defense verifies **accounts** — and accounts are free to fake.
Scalpers run swarms across dozens of fake accounts; CAPTCHAs and raffles guess, they don't know.

## The mechanism (core concept)
Two gates before any purchase clears:
1. **Trust gate (Valiron)** — is this buyer/agent identity-backed and trustworthy, not a Sybil swarm?
2. **Authority gate (FaceValue)** — one item per verified human (World ID nullifier), at face value,
   item **bound to the identity** (non-transferable) → resale dies at the source.

**Differentiation:** deterministic cryptographic personhood vs probabilistic guessing.
**vs DICE (closest competitor):** they bind to phone/account and replace your ticketer; we bind to
personhood and can layer onto an existing stack.

## Customers & wedge
- **Customer = vendor** (artist, venue, promoter, creator). **Beneficiary = fan.** This tension is Risk #1.
- **Early adopters:** indie, community-first vendors who personally feel scalper backlash — indie
  promoters/venues, streetwear designers, keyboard group-buys, mid-tier YouTubers (100k–500k).
  **Never** LiveNation / Ticketmaster / Supreme first.
- **Wedge fork (OPEN):** merch drops = fastest to pilot (a tweet + a link); tickets = structurally
  strongest (identity-bound entry kills resale and the sweatshop loophole). Discovery picks the wedge.

## Business model
- **Per-event fee** (~$250–$1,000/drop) or a small % of **primary, face-value** sales. Never touch
  resale. Never custody funds (control plane, not money mover).
- Lifestyle-scale math: ~6–10 indie events/month ≈ **$2–4k/month**. Platform scale only with evidence.

## Top risks (ranked) — and where they stand
1. **Vendor incentive misalignment** *(fatal if true · UNVALIDATED)* — vendors get paid whether a bot or
   a fan buys; fairness is PR, not P&L. Painkiller only where community backlash = lost long-term
   revenue. **Resolve by discovery, not code.**
2. **World ID friction** *(severe · UNVALIDATED)* — app download + verification may crater conversion.
   Mitigation in our design: verify ONCE, ahead of the drop (agent arms in advance). **Kill metric:
   >15% of link-clickers complete verify + purchase.**
3. **Verified-human sweatshops** *(moderate)* — paying real verified humans to click buy. Real for
   reshippable merch; structurally weak for identity-bound tickets (the hired human's identity is ON the
   ticket; they'd have to attend). Honest line: *"we don't make scalping impossible — we make it
   unprofitable and unscalable."*

**Standing rebuttals (armed):** BOTS Act → we *enforce* purchase limits, sanctioned + opt-in (and our
fans have *verified agents*, never "bots") · Ticketmaster Verified Fan → account-based vs cryptographic
personhood · fairness ≠ abundance (we make allocation fair, not tickets plentiful) · speed-vs-lottery →
identity makes it fair, the agent makes it effortless · custody → we never hold funds.

**Killed ideas (stay dead):** consumer impulse-buy blocker · agent marketplace · frugal stockpiler agent ·
surplus savings/investing · agent taste-purchases.

## Competition
- **Direct:** EQL (fair raffles), **DICE** (mobile-tied ticketing), token-gated commerce.
- **Indirect:** pre-order windows (kill scarcity), dynamic pricing (kill scalper margin), doing nothing.
- **The real enemy:** the instant-sellout ego metric — vendors are addicted to "sold out in 1.2s."

## Strategy — two tracks
- **Track A — sponsor/demo (DONE):** hackathon app with live Valiron integration, x402 handshake,
  demo video script, LOI ask. Asset for the Valiron relationship + credibility.
- **Track B — market validation (NOW):** discovery → unpaid pilot → funnel data.
  Launch artifact = **one hardcoded drop page → World ID verify → Stripe link → manual payout.**
  No x402, no dashboard, no Valiron in the funnel test (one friction at a time; the nullifier alone
  enforces one-per-human for human checkout).

## Validation plan & gates
- **Weeks 1–2:** monitor botched drops; ~40 personalized Mom-Test DMs within hours of the pain
  (indie promoters AND creators); 5 discovery calls. Never pitch — ask how they handled the last drop.
- **Validation bar:** ≥3 vendors with concrete lost hours/money AND stated willingness to trade an
  instant sellout for fairness.
- **Week 3:** Pilot #1 — 20–50 units carved out of a real drop, **free (fee waived) — never paid.**
- **Demand proof:** the vendor willingly tells their fans to pre-verify before the drop.
- **Funnel gate:** ≥15% verify+purchase completion, instrumented at every step.
- **Kill/pivot triggers:** no pilot after ~40 genuine attempts, or funnel <15% → pivot (behavioral
  anti-botting that needs no user opt-in, or B2C demand-side) or stop cleanly.

## Funding stance (set 2026-06-11)
- **Pre-validation spend ≈ $0** (domain/hosting only). **Do not buy a pilot** — a paid pilot fakes the
  exact signal we're testing.
- Optional after discovery: ONE self-sponsored micro-event, **hard cap ≤$1k** — counts as a friction
  test + case study, never as vendor validation.
- **Bootstrap** to the few-$k/month goal; per-event revenue funds growth. **No VC by default** — VC
  redefines a few-$k/month success as failure.
- Reconsider raising ONLY if validation is strong AND ambition genuinely upgrades; then raise on pilot
  data, not the demo. Order: World Foundation ecosystem grants (non-dilutive, aligned) → angels/
  strategics in ticketing/identity (Valiron orbit; the LOI is a door) → institutional only if going
  for the platform.

## Open questions
- Wedge: merch vs tickets (discovery decides).
- Real World ID staging widget vs simulated (needed before any real pilot — required for the funnel test).
- Pilot payment rails: Stripe account + payout mechanics for the fee-waived pilot.

## Changelog
- **2026-06-11** — Doc created. Post-hackathon: YC-style teardown digested; risks ranked with
  validation state; two-track strategy; validation gates; funding stance set.
- **2026-06-01** — (hackathon) Idea locked: proof-of-personhood ticketing on Valiron; trust call proven;
  MVP demo built and tested.
