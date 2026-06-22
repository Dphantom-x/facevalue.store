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
- **Party legal guardrails (researched 2026-06-12):** alcohol = licensed venue (easiest) OR NY SLA
  One-Day Permit ($26, ≥15 days ahead, wholesaler-sourced, max 4/location/yr) OR licensed caterer OR
  dry; NEVER ticketed-BYOB or "free drinks with ticket" unpermitted. Raw space 75+ indoors / 200+
  outdoors needs a DOB **TPA** ($250, ≥10 business days, architect letter, fire guard/100). "Abandoned"
  lots don't exist legally — private lot w/ owner consent (Peerspace ~$500–2k/day) + TPA + sound permit,
  or don't. **No unpermitted guerrilla events under the FaceValue brand** — our entire venue pitch is
  "we're the sanctioned ones." Watch parties: UFC/boxing PPV without a commercial license = lawsuit
  factory (up to ~$110k statutory) — avoid; **esports via Riot's official watch-party programs** (free,
  apply) is the cheap-rights option; K-pop comeback streams / listening parties are low-risk.
- **Friction-tolerant target demos (ranked by PROVEN friction behavior):** K-pop stans (fanclub
  presale culture) · sneakerheads (SNKRS raffle-trained) · TCG collectors (Pokémon restock lines; LGS
  partners already do 1-per-customer) · Broadway-lottery vets (daily lottery discipline) · sample-sale
  fashion crowd (paid line-sitters; Telfar Bag-Security precedent) · underground rave/techno
  (secret-location ritual = extra steps are the culture) · DIY/hardcore (anti-flipper ethos).
- **Outreach engines:** "@NYCScalpWatch" watchdog account (scripted daily face-vs-resale markups on
  small NYC shows → audience + inbound + every post is a warm DM) · bottom-up fandom pressure (Discord
  admins petition promoters for verified allocations) · college ambassadors (NYU/FIT/Columbia) · local
  press (Hell Gate/Gothamist: "scalper-proof party" story) · reservation-scalping angle (NY Restaurant
  Reservation Anti-Piracy Act, Dec 2024 — "one human, one reservation" for supper clubs/pop-ups).

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
  Reinforces: never custody funds, never inherit complexity. **(Funding corrected 2026-06-22:
  DICE raised ~$187–200M total — NOT $238M; 2022 revenue $28.5M on a $51.1M loss; "2025
  profitability / $1B tickets" is unverified and likely Fever's number, not DICE's.)**
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
- **Pilot Mode A — "code-gate" (zero-integration, learned from Concert Kit 2026-06-12):** the venue
  exports 30–50 presale/promo codes from THEIR existing ticketer (Eventbrite etc.); we gate the codes
  behind World ID device-verification on our drop page; fan verifies → unlocks a code → buys on the
  venue's own checkout. We touch NO payments, NO inventory, NO refunds on pilot #1 — collapses ops
  risk and the venue ask. Mode B (full FaceValue checkout + door binding) is the v2 upsell once
  trust exists.
- **Demand proof:** the vendor willingly tells their fans to pre-verify before the drop.
- **Funnel gate:** ≥15% verify+purchase completion, instrumented at every step.
  **BUILT (2026-06-22):** the app now ships an invite-only access-code gate + a conversion funnel
  (`drop_view → verify_start → verify_done → claim_done`, deduped by an anonymous visitor cookie). The
  Studio shows `views → verified → claimed` per drop with a live **PASS ✓ / below-15%** verdict — so a
  coded carve-out link produces the go/no-go number automatically. The instrument is no longer a TODO.
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

## Verified facts & execution plan (fact-check 2026-06-22)

**Five parallel research agents stress-tested a strategy memo. Key verified findings:**

- **World ID is LEGALLY CLEAN in NYC — the biggest unknown is now a green light.** The WLD *token*
  ban in NY does NOT block the World ID *verification* SDK (IDKit) — it's available to US devs.
  **Device-level verification is non-biometric** (trusted-device passkey, no iris/face) → falls
  ENTIRELY outside NYC's biometric law (Admin Code §22-1201) — no signage, no liability. Orbs aren't
  in NYC anyway. ⇒ **Use device-level; the MSG "biometric backlash" is a MARKETING problem, not legal.**
- **MSG breach is REAL** (ShinyHunters ~June 2026, 45GB incl. facial-recognition records + customer
  emails; *Avalo v. MSG*, $5M class action, SDNY). The "26M records" is the hackers' unverified claim.
  Use as a privacy-positioning foil — "anonymous to everyone, accountable at the door."
- **DICE is NOT a Brooklyn monopoly.** Came to US Sept 2017 (SF+LA; NY in 2019); real indie exclusives
  but clustered in 2021; now Fever-owned (June 2025). Many rooms still on Eventbrite/RA/Ticketmaster —
  **that gap is our lane.** Our edge vs DICE = personhood (one *human*, not one *device* → beats
  SIM-farm/burner loophole). Lead with POP *on top of* existing ticketers, never "be a better DICE."
- **EQL model validates our engine:** $0 auth hold → charge only winners (= our manual-capture);
  fee 5.5% to the brand, passed to winners ("Run Fair Fee" from $2.99). A real revenue template.
- **Stripe Connect zero-custody build note:** use **direct charges + `application_fee_amount`** (NOT
  destination charges — those route principal through us first). Each venue = KYC'd connected account
  (Standard = lowest liability). Stay on primary/face-value sales (scalp *resale* is the policy-risk zone).
- **Pricing correction:** a $1 fee barely covers Stripe (2.9%+$0.30). For real margin use ~$2.99 or ~5%.

**Corrected Brooklyn target list (verify links before outreach):**
- 🚨 **Baby's All Right** — on DICE; ~280 cap; booker **Alex Gleeson**. **Billy Jones DIED June 2025 — do NOT contact.**
- **Market Hotel** (RA, ~400) — booker **Todd P (Todd Patrick)**. Strong sellout/scalping pressure.
- **Trans-Pecos** (RA + **TicketWeb**, not Eventbrite) — outreach **booking@thetranspecos.com**.
- **Elsewhere** (**Eventbrite**-primary, DICE secondary) — RFID = drinks, not entry.
- **The Sultan Room** (DICE + Eventbrite). **TV Eye** (ticketer UNCONFIRMED) — bookers Todd Abramson / Caleb Braaten.
- **Paragon** (RA) — nearly closed 2025; verify it's open.
- **Best scalping proof point:** Geese (Brooklyn band) — 2026 tour resale ~$2,000, partnered with CashOrTrade.

**The sequenced pilot plan (≤$5k; the party is move #2, not #1):**
1. **Phase 0 (now, ~$0):** deploy the pilot app (phone-clickable) + wire real World ID device-level +
   stand up @NYCScalpWatch.
2. **Phase 1 (wk 1–2, ~$0): code-gate pilot.** 30–50-ticket carve-out at ONE oversubscribed RA/Eventbrite
   show; gate the venue's codes behind World ID. **Gate: ≥15% of clickers verify.**
3. **Phase 2 (wk 3–6, ≤$5k): the party.** Co-sponsor a licensed-bar carve-out first ($50–100), or our
   own "Humans Only" night if Phase 1 validated. Full system + Stripe Connect + door scanner. A legit
   150-cap Brooklyn weeknight is **$3.4–5k all-in** — treat ≤$3k net loss as tuition; aim to break even on bar.
4. **Kill/pivot:** <15% verify, or no free carve-out after ~40 honest asks → friction is fatal, pivot.

## Changelog
- **2026-06-22** — Fact-checked a strategy memo with 5 research agents. Corrected DICE numbers
  (~$187–200M not $238M; 2022 rev $28.5M; "2025 profitability" unverified). Confirmed World ID
  device-level is legal + non-biometric in NYC (biggest de-risk). MSG breach/Avalo suit real.
  Stripe Connect = direct charges for zero-custody. Fixed venue list (Billy Jones deceased; Trans-Pecos
  on TicketWeb; Elsewhere on Eventbrite). Locked the sequenced code-gate-first pilot plan.
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
