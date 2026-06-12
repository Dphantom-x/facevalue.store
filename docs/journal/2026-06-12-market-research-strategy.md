# 2026-06-12 · Market research: precedent, potential, pilot strategy

**Focus:** Answer "how big can this realistically be, is there precedent, and how do we land the first pilot?"

## What we did
- Researched live market evidence: DICE, Lyte, TicketSwap/Tixel, Riot's ID-gated Worlds tickets, and
  World/Tools for Humanity's product moves. Updated `docs/BUSINESS.md` (competition, model, funding
  stance, potential scenarios).

## Findings
- **Tools for Humanity launched "Concert Kit"** — World's own verified-human ticket pools, routed via
  Ticketmaster/Eventbrite/AXS; Thirty Seconds to Mars reserving verified-human tickets for the 2027
  tour. Validates the exact thesis at the top of the market — and occupies the major-artist tier.
- Riot Games: ID-gated anti-scalping for LoL Worlds 2026 → identity-gated ticketing normalizing.
- DICE: ~$238M raised, $400M valuation (2021), ~$28.5M rev (2022), acquired by Fever (2025) —
  existence proof + consolidation appetite.
- TicketSwap 18M+ users on <$10M raised; Tixel in the US — fair ticketing sustains capital-efficient companies.
- Lyte: $53M raised, dead 2024 owing promoters (held funds, bad acquisition) — cautionary.

## Decisions
- **Decision:** Our lane = the long tail Concert Kit won't service (indie promoters, club nights,
  comedy rooms) + position as World-ecosystem ("Concert Kit for the long tail"). *Why:* can't outbuild
  TfH at the major tier; their push educates the category for us and opens grant/partner doors.
- **Decision:** GTM pricing = fan-pays "fair access fee" (~$1–1.50/ticket), venue pays $0 at pilot
  stage. *Why:* industry-standard direction (DICE charges fans), and it deletes the "why would the
  venue pay" objection while we test demand.
- **Decision:** User's $50–100 venue co-sponsor idea APPROVED inside the ≤$1k cap, structured as a
  30–50-ticket verified-fan carve-out of an existing night; cash is the closer, not the lead; never
  the whole door on pilot #1. *Why:* compensates hassle without buying a fake yes; gathers the ≥15%
  funnel data + a case study.
- **Decision:** Honest potential framing: base = $2–5k/mo local service; middle = $100k–$1M/yr
  long-tail niche; upside = acquisition/partnership, not a unicorn (TfH owns the big seat).

## Bugs & fixes
- None (research/strategy session).

## State at end
- BUSINESS.md updated + changelog; repo pushed. Code untouched (9 tests green as of last run).

## Part 2 (same day) — Concert Kit deep-dive + GTM brainstorm

**Findings (Concert Kit):** launched 2026-04-17 (~8 weeks old); mechanics = code-gating layer (artist
uploads ticket codes from TM/AXS; fan verifies World ID to unlock; buys on the normal ticketer; the
purchased ticket stays transferable, nothing at the door); traction = ONE artist (30STM, 5 EU/UK
cities, 2027, with 2-for-1 verify incentives) + a 1,000-person SF launch party; no public
pricing/stats; BD-by-email onboarding; reception rocky (Live Nation + Bruno Mars publicly denied TfH's
partnership claims; "scan your eyeballs" press mockery); not a P&L product (token/VC-funded; exists to
drive verifications).

**Decisions**
- **Decision:** Differentiation sentence: "Concert Kit checks who gets in line; FaceValue makes the
  ticket itself un-scalpable." *Why:* their gated code still yields a normal transferable ticket; we
  bind the ticket to the nullifier through the door.
- **Decision:** GTM = "NYC inner circle" — verified-humans-only access layer for the scene; friction
  reframed as initiation; perks/status over fairness; locals first, tourists later via comedy clubs;
  device-level World ID (no Orb dependency — NY blocks WLD tokens, not verification).
- **Decision:** Own-party GTM approved in two steps: co-thrown night with an existing promoter first;
  solo "Humans Only" party second (conscious cap raise to ~$1.5–3k; breakeven = success; ROI = funnel
  data + case study + scene cred). *Why:* TfH validated party-as-GTM at their own launch.
- **Decision:** Underground fashion drops = parallel discovery track (cheapest pilots, same scene,
  same verified identity), eyes open re: reshippable-merch loophole + Shopify-bot-app sufficiency.
- **Decision:** Market privacy, never "stealth buying" — "anonymous to everyone, accountable at the
  door"; no crypto language. *Why:* ZK personhood is a real differentiator vs Ticketmaster's PII
  hoover; "stealth" reads as evasion.

## Part 3 (same day) — Landing/site redesign spec
- Wrote `design/LANDING_REDESIGN_SPEC.md` — full Track-B site architecture + per-page content spec.
- **Decision:** Root page is fan-first (scene brand), with an unmissable `/venues` path — a promoter
  judges us by whether their crowd would love it. *Why:* fans are the volume audience; B2B arrives
  pre-pitched via DM and needs credibility, not a SaaS hero.
- **Decision:** Page map = `/` (fan brand) · `/circle` (verify-once membership) · `/drop/[event]`
  (conversion artifact, 5 states incl. pre-drop verify window + sold-out waitlist) · `/venues` (pilot
  pitch) · `/simulation` retitled "See it live" (proof + sponsor track).
- **Decision:** Identity-bound tickets get a "return at face value → waitlist" policy (no peer-to-peer
  transfer) — the fan-friendly answer to "what if I can't go," and waitlist counts become the vendor
  demand-data product.

## Next / open threads
- Pilot-hunting playbook: find scalped SMALL events (StubHub/SeatGeek listings above face for <$60
  NYC shows; comedy rooms; RA club nights), DM the promoter with the screenshot of their own show
  being scalped.
- Decide whether to apply for World Foundation ecosystem grants once a pilot exists.
- Still open: record demo video; optional Vercel deploy; real World ID staging widget before any live pilot.
