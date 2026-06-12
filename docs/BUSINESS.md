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
- **Pilot/GTM pricing (industry-standard direction): the FAN pays, the venue pays $0.** A small
  transparent "fair access fee" (~$1–1.50/ticket) at checkout — still ~95% cheaper than a scalper
  markup, and it dissolves the "why would the venue pay?" objection entirely (DICE's model: booking
  fee on the fan). Per-event SaaS fees (~$250–$1k/drop) come later, once value is proven.
- Always primary, face-value sales. Never touch resale. Never custody funds (control plane, not money mover).
- Lifestyle-scale math: 6–10 small events/month × 200–400 tickets × ~$1.25 ≈ **$2–5k/month**.
  Platform scale only with evidence.

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

## Competition & precedent (researched 2026-06-12)
- **Tools for Humanity "Concert Kit"** — World's OWN verified-human ticketing product: artists reserve a
  pool of seats only proof-of-human buyers can access, routed through Ticketmaster/Eventbrite/AXS
  (Thirty Seconds to Mars reserving verified tickets for the 2027 tour). **Category validated at the
  top; the major-artist tier is taken. Our lane = the long tail Concert Kit won't service** (indie
  promoters, club nights, comedy rooms, locals) — and it makes us an ecosystem play (World grants,
  "Concert Kit for the long tail"), not a lone crusade.
- **Riot Games** — ID-gated anti-scalping for the 2026 LoL World Championship → identity-gated
  ticketing is normalizing mainstream.
- **DICE** — the existence proof: anti-scalping ticketing for independent venues; ~$238M raised,
  $400M valuation (2021), ~$28.5M revenue (2022), **acquired by Fever (June 2025)** → consolidators
  buy fair-ticketing companies.
- **TicketSwap / Tixel / Twickets** — fair (capped) resale works as a business: TicketSwap 18M+ users
  on <$10M raised (capital-efficient), Tixel expanded to the US.
- **Lyte (†2024)** — cautionary: $53M raised, collapsed owing promoters; held money + bad acquisition.
  Reinforces: never custody funds, never inherit complexity.
- **Also:** EQL (raffles), token-gating; indirect: pre-order windows, dynamic pricing, doing nothing.
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
- **Approved tactic (2026-06-12):** a $50–100 co-sponsor sweetener to a venue/promoter to run a
  **verified-fan carve-out** (30–50 tickets of an already-scheduled night) through FaceValue. Cash is
  the closer, never the lead — lead with "costs you $0, we run everything, fans pay $1." Never take
  over a stranger's whole door on pilot #1.
- **Bootstrap** to the few-$k/month goal; per-event revenue funds growth. **No VC by default** — VC
  redefines a few-$k/month success as failure.
- Reconsider raising ONLY if validation is strong AND ambition genuinely upgrades; then raise on pilot
  data, not the demo. Order: World Foundation ecosystem grants (non-dilutive, aligned) → angels/
  strategics in ticketing/identity (Valiron orbit; the LOI is a door) → institutional only if going
  for the platform.

## Potential — honest scenarios (assessed 2026-06-12)
1. **Base (the bet):** NYC fair-drop service for small high-demand nights → **$2–5k/month** within
   ~6–12 months IF discovery validates. Matches the founder's stated goal.
2. **Middle:** regional long-tail verified-ticketing niche ("Concert Kit for the events TM never
   touches") → **$100k–$1M/yr** revenue; requires full-time + small team; DICE/TicketSwap prove the
   category sustains real companies.
3. **Upside:** not "the next Ticketmaster" — TfH occupies the major tier — but **acquisition/partnership**
   (Fever bought DICE; World needs long-tail implementations) → plausible 6–7-figure outcome, not a unicorn path.

## Open questions
- Wedge: merch vs tickets (discovery decides).
- Real World ID staging widget vs simulated (needed before any real pilot — required for the funnel test).
- Pilot payment rails: Stripe account + payout mechanics for the fee-waived pilot.

## Changelog
- **2026-06-12** — Market research: TfH **Concert Kit** discovered (validates category, takes the
  major tier; our lane = long tail + World ecosystem). Model shifted to fan-pays-fee for GTM.
  $50–100 co-sponsor carve-out pilot approved. Potential scenarios added.
- **2026-06-11** — Doc created. Post-hackathon: YC-style teardown digested; risks ranked with
  validation state; two-track strategy; validation gates; funding stance set.
- **2026-06-01** — (hackathon) Idea locked: proof-of-personhood ticketing on Valiron; trust call proven;
  MVP demo built and tested.
