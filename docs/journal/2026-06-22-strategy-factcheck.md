# 2026-06-22 · Fact-check of the GTM strategy memo + locked pilot plan

**Focus:** A long brainstorm memo (DICE history, Brooklyn venues, MSG scandal, World ID legality, EQL,
Stripe Connect) was full of confident specifics. Ran 5 parallel research agents to separate truth from
fabrication, then locked next steps.

## What we did
- 5 general-purpose research agents fact-checked: (A) DICE corporate history/funding, (B) DICE US/Brooklyn
  expansion + Ticketfly hack, (C) Brooklyn venue ticketers + bookers, (D) MSG breach + NY/World ID
  legality, (E) EQL + Stripe Connect mechanics. Updated `docs/BUSINESS.md` (verified-facts section +
  corrected venue list + sequenced pilot plan + changelog).

## Findings (what was TRUE vs FABRICATED)
- **DICE numbers wrong in the memo:** seed was $1.6M (not $5.6M); total raised ~$187–200M (not $238M);
  2022 revenue $28.5M (not $35.2M; the $51.1M loss is right); "2025 profitability / $1B tickets" is
  unverified (likely Fever's number). Series A/C/2023 rounds, DeepMind backers, Boiler Room→Superstruct/KKR,
  Fever acquisition (June 5 2025) all CONFIRMED.
- **DICE US:** Sept 2017 launch = SF+LA (memo said NY); NY came 2019. Brooklyn exclusives real but
  cluster in 2021. "Ticketfly collapse → DICE won Brooklyn" = unproven (3-yr gap). "Dominates Brooklyn"
  overstated — many rooms on Eventbrite/RA. Ticketfly 2018 hack itself real.
- **Venues:** booker NAMES are real (no hallucinated people) BUT **Billy Jones (Baby's All Right) died
  June 2025** — removed from contacts. Trans-Pecos = RA+TicketWeb (not Eventbrite); Elsewhere =
  Eventbrite-primary; TV Eye ticketer unconfirmed; Baby's ~280 cap on DICE; Paragon nearly closed 2025.
  Best scalping proof = Geese (~$2k resale).
- **MSG breach is REAL** (I had doubted it): ShinyHunters ~June 2026, 45GB incl. facial-recognition
  records + emails; *Avalo v. MSG* $5M class action, SDNY. "26M" is hacker-claimed.
- **World ID legal in NYC (the big de-risk):** IDKit verification available to US devs despite the WLD
  token ban; device-level is non-biometric → outside NYC §22-1201 biometric law. Orbs not in NYC.
- **EQL:** $0 auth → charge winners (= our manual-capture); 5.5% to brand, passed to winners. **Stripe
  Connect:** zero-custody requires DIRECT charges + `application_fee_amount` (not destination charges).

## Decisions
- **Decision:** Never "be a better DICE" (device-locking = their turf; they raised ~$200M and still sold
  to Fever). *Why:* our only edge is personhood (one human, not one device). Lead with POP on top of
  existing ticketers / the Eventbrite-RA rooms DICE doesn't own.
- **Decision:** "Friction Dial" (POP only at hyped drops) and the embedded Stripe-Connect ticketer = v2
  product vision, NOT pilot-1 scope.
- **Decision:** Pilot sequence = Phase 0 deploy + real World ID device-level → Phase 1 $0 code-gate
  (gate ≥15% verify) → Phase 2 party (≤$5k; co-sponsor bar first). *Why:* test the one unknown (will
  humans verify) for ~$0 before spending $3–5k on a party.
- **Decision:** Pricing must be ~$2.99 or ~5%, not $1 (Stripe eats $1). *Why:* margin.

## Bugs & fixes
- None (research/strategy session). Self-correction logged: I had pre-judged the MSG breach as likely
  fabricated; the agent proved it real — corrected in the answer and docs.

## State at end
- BUSINESS.md updated + changelog; repo otherwise unchanged (pilot app still 18 specs green).

## Next / open threads
- Phase 0: deploy the pilot app to a persistent host; wire real World ID device-level (IDKit);
  stand up @NYCScalpWatch.
- Phase 1 outreach: DM real bookers (Todd P / Market Hotel, Alex Gleeson / Baby's, Trans-Pecos booking@)
  for a 30–50-ticket code-gate carve-out at an oversubscribed show.
