# FaceValue — Pitch & Judge Q&A

## 30-second pitch
Scalpers beat ticketing because the defenses check *accounts*, and accounts are trivial to fake.
**FaceValue requires proof-of-personhood — one real human, one ticket — and runs every fan's verified
agent through Valiron's trust gate before any purchase clears.** Real fans get in at face value;
scalper swarms are structurally locked out; tickets are identity-bound so they can't be resold.
We're the consumer application of Valiron's agent-identity infrastructure.

## The problem
- Hot tickets vanish in seconds and reappear on resale at 5–10× face value.
- Scalpers win by running **bot swarms across dozens of fake accounts**.
- It's illegal (BOTS Act of 2016) and still rampant — incumbent defenses verify accounts, not people.

## The solution — two gates on every purchase
1. **Trust gate (Valiron):** is this a trustworthy, identity-backed agent, not a Sybil swarm?
2. **Authority gate (FaceValue):** one ticket per verified human, at face value, identity-bound (non-transferable).

Proof-of-personhood makes it Sybil-proof; the verified agent makes it instant and effortless.

## How it works (what we built — and demo live)
- **Vendor** opts in and launches a drop (full / hybrid / lottery release modes).
- **Fan** proves personhood (World ID) → their verified agent buys one ticket at face value.
- Every purchase runs a **real Valiron `getAgentProfile()` trust check** (allow/deny) + our one-per-human policy.
- On stage: verified fan → **ALLOW** (World ID verified); scalper swarm → **DENY**. Real calls, live.

## Why Valiron (the LOI hook)
Valiron is our **core mechanism, not a bolt-on**: agent trust scoring + World ID proof-of-personhood.
Every FaceValue drop drives verified agents and identity checks through Valiron's system. We're the
buyer-side consumer app that puts their infrastructure to work on a multi-billion-dollar problem.
Every FaceValue purchase can also run through Valiron's **operator paywall (x402)** — so we drive
*both* halves of their product: the trust gate **and** the monetization rail.

## Business model
Opt-in SaaS for vendors: a per-event fee or a small % of **primary, face-value** sales — never resale
(we kill resale, we don't tax it). Vendors get real buyers, scalpers excluded, resale on their product
killed, and a clean demand signal (verified registrations = real demand).

## Why now
Agents are about to do our buying; the regulatory + cultural moment is peak (executive order, state
"Taylor Swift" bills, fan rage); and the identity infrastructure to do it (Valiron, World ID) now exists.

## The ask
A pilot with an indie venue or Web3 ticketer — and an **LOI from Valiron to integrate**.

---

## Judge Q&A — hard questions, honest answers
- **"How is this different from Ticketmaster Verified Fan?"** Theirs is account- and registration-based
  and still gets gamed with multiple accounts/cards. Ours is **cryptographic proof-of-personhood** —
  Sybil-resistant in a way accounts never are.
- **"Won't Ticketmaster just build it?"** Maybe — but they're conflicted (they profit from their own
  resale market). Our wedge is being the **neutral, vendor-agnostic layer** plus the agent-identity
  integration. Beachhead: indie venues, smaller/mid artists, crypto-native ticketing.
- **"Does verification create more tickets?"** No — it makes allocation **fair and scalp-proof**. Most
  fans still won't get a hot show, but scalpers won't either, and the ones who get in paid face value.
- **"Isn't a racing agent just a bot — illegal?"** The opposite. We're sanctioned and opt-in, and we
  **enforce** purchase limits (BOTS Act), not circumvent them. One verified human, one ticket.
- **"What's real vs. mocked in the demo?"** The **Valiron trust call is real** (live allow/deny on real
  sample agents, including World ID), and the **x402 paywall handshake is real** (402 → pay → 200, with
  trust-based pricing). Only the settlement and the World ID widget are mocked for the MVP; both swap in
  (a real x402 facilitator + a World ID staging widget) with no refactor.
- **"Custody / money-transmitter risk?"** We're the **control/authorization layer — we never custody
  funds.** Settlement comes from the agent's own wallet (x402) or the fan's card via an issuer. (The MVP
  simulates settlement.)

## One-liner
**"Real fans. Real tickets. Face value."** — built on Valiron's agent-identity infrastructure.
