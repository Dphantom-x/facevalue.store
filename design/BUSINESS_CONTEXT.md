# FaceValue — Business Context

> Paste this into Claude Design as the product brief. It explains what FaceValue is,
> who it's for, and the feeling each screen should evoke.

## One-liner
**FaceValue — Real fans. Real tickets. Face value.** Identity-verified, budget-bounded buying
agents that get real fans fair access to scarce ticket drops, and structurally lock scalpers out.

## The problem
Tickets to hot shows vanish in seconds and reappear on resale at 5–10× face value. Scalpers win by
running bot swarms across dozens of fake accounts. It's illegal (the BOTS Act of 2016) and still
rampant, because the defenses verify *accounts*, and accounts are trivial to fake.

## The solution
FaceValue requires **proof-of-personhood** — one real human, one ticket — and runs every fan's
**verified agent** through **Valiron's trust gate** before any purchase clears. Two gates fire on
every buy:
1. **Trust gate (Valiron):** is this a trustworthy, identity-backed agent, not a Sybil swarm?
2. **Authority gate (FaceValue):** is this purchase within policy — one ticket per verified human, at face value?

Tickets are bound to the verified identity (a World ID `nullifier`), so they can't be flipped on resale.

## Who it's for
- **Vendors (the customer):** artists, venues, promoters, ticketers. They opt in, configure a drop,
  and get real buyers, scalpers structurally excluded, resale on their product killed, and a clean
  demand signal. Revenue model: per-event fee or % of *primary* face-value sales (never resale).
- **Fans (the user):** prove you're one real human once, then your verified agent grabs one ticket
  at face value the moment the drop opens — no camping, no swarm, no scalper.

## Why Valiron (the sponsor)
Valiron is agent-trust + World ID proof-of-personhood infrastructure. FaceValue is the consumer
application of it: every drop runs verified agents and proof-of-personhood through Valiron's gate.
Their tech *is* our core mechanism, not a bolt-on.

## The demo (what the screens show)
1. **Simulation** — split screen: "Today" (scalper bots sweep every ticket across fake accounts)
   vs "FaceValue" (verified fans each get one; the scalper swarm bounces off the Valiron gate). A
   live, real Valiron call is shown alongside as the "this isn't scripted" anchor.
2. **Fan** — prove personhood → verified agent buys at face value → ticket is identity-bound,
   non-transferable. A second buy by the same human is blocked.
3. **Vendor** — configure + launch a verified-fan drop.

## Tone & feeling
Trustworthy, modern, a little defiant (we're on the fans' side, against scalpers). The emotional
beat is **fairness restored**: green = the verified fan winning; red = the scalper swarm blocked.
Think confident fintech-meets-live-music, not crypto-bro. Clean, fast, credible to both a concert
fan and a skeptical sponsor judge.
