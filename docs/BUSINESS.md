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

## GTM positioning — "the NYC inner circle" (added 2026-06-12)
- **Flip the friction:** verifying once isn't a chore, it's initiation — a verified-humans-only access
  layer for the NYC scene. Status + perks (first dibs, early windows, member pricing), not just fairness.
  Precedents: DICE's early London scene-app era, AmEx presales, SNKRS, NYC list culture.
- **Lead with scene locals** (repeat events, community, retention); tourists later via comedy-club
  partnerships (tourist-heavy + chronically scalped). Device-level World ID (~60s in-app, no Orb) keeps
  onboarding honest in NYC, where Orb access is pop-up-dependent (NY's crypto rules block WLD tokens,
  NOT World ID verification).
- **Two surfaces, one identity:** the same verified membership gates underground fashion drops AND
  party doors — FaceValue as the scene's verified-access layer, not "a ticketing tool."
- **Privacy as marketing (not "stealth"):** World ID is zero-knowledge — "anonymous to everyone,
  accountable at the door." No accounts, no data harvesting, no name — vs Ticketmaster Verified Fan's
  PII hoover. Never market the crypto; never say "stealth buying" (reads as evasion).
- **Own-party GTM is validated** — TfH launched Concert Kit with exactly this move (1,000+ verified
  fans, The Midway SF). Ours: co-throw with an existing promoter first (they bring crowd+ops, we bring
  ticketing+cash); a solo "Humans Only" party is the v2 stunt (raises spend cap consciously to ~$1.5–3k).

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
- **Tools for Humanity "Concert Kit"** (deep intel 2026-06-12) — launched **April 17, 2026** (~8 weeks
  old) at the "Lift Off" SF event, part of World ID 4.0. **Mechanics: a code-gating layer, not a
  ticketer** — artist creates a Concert Kit page, sets verification requirements, **uploads ticket codes
  from their existing platform** (TM/AXS/Eventbrite); fan verifies World ID → unlocks a code → buys on
  the normal ticketer. **The purchased ticket stays a normal, transferable ticket — nothing at the
  door.** Traction: exactly ONE named artist (Thirty Seconds to Mars, 5 EU/UK cities, **2027** tour,
  with 2-for-1 incentives to get fans orb-verified) + a launch party (DJ Pee .Wee at The Midway SF,
  1,000+ verified fans). No public pricing/stats; onboarding = email-the-team BD. **Reception:** rocky —
  Live Nation and Bruno Mars' management publicly DENIED partnership claims TfH made (retracted as
  "miscommunication"); music press mocking ("scan your eyeballs"). Not a P&L product — TfH is
  token/VC-funded; Concert Kit exists to drive World ID verifications.
  **Our openings:** (1) they gate the *presale*, we bind the *ticket* through the door —
  "Concert Kit checks who gets in line; FaceValue makes the ticket itself un-scalpable";
  (2) their GTM is top-down and slow (first real shows 2027) — the street/long tail is wide open;
  (3) their brand baggage (orb memes, Bruno Mars stumble) — we present fan-first with World ID under
  the hood, device-level (no Orb needed).
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
- **2026-06-12 (later)** — Concert Kit deep intel: 8 weeks old, 1 client (30STM 2027), code-gating only
  (ticket stays transferable — our door-binding is the differentiator), Bruno Mars/Live Nation denial
  scandal, not a P&L product. Added "NYC inner circle" GTM positioning (status framing, locals-first,
  two surfaces one identity, privacy-not-stealth marketing, party-as-GTM validated by TfH's own launch).
- **2026-06-12** — Market research: TfH **Concert Kit** discovered (validates category, takes the
  major tier; our lane = long tail + World ecosystem). Model shifted to fan-pays-fee for GTM.
  $50–100 co-sponsor carve-out pilot approved. Potential scenarios added.
- **2026-06-11** — Doc created. Post-hackathon: YC-style teardown digested; risks ranked with
  validation state; two-track strategy; validation gates; funding stance set.
- **2026-06-01** — (hackathon) Idea locked: proof-of-personhood ticketing on Valiron; trust call proven;
  MVP demo built and tested.
