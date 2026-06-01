# FaceValue — Hackathon Submission

| | |
|---|---|
| **Project** | FaceValue — *Real fans. Real tickets. Face value.* |
| **Author** | Aldo Hidalgo |
| **Email** | aldohidalgo0319@gmail.com |
| **Repository** | https://github.com/Dphantom-x/facevalue.store |
| **Sponsor tech** | Valiron — AI-agent trust scoring + World ID proof-of-personhood |

## Short description

FaceValue is **proof-of-personhood ticketing that ends scalping.** Scalpers win because
today's ticketing defenses verify *accounts* — and accounts are trivial to fake. FaceValue
instead requires every buyer to prove they're one real human (World ID), and runs each fan's
verified buying agent through **Valiron's trust gate** before any purchase clears.

Two gates fire on every buy:
- **Trust gate (Valiron):** scores the agent's on-chain reputation + proof-of-personhood and
  returns a real ALLOW / DENY — Sybil swarms are blocked, verified humans get through.
- **Authority gate (FaceValue):** one ticket per verified human, at face value. Tickets are
  bound to the verified identity, so they can't be resold.

The result: real fans get in at face value, scalper bot-swarms are structurally excluded, and
resale is killed at the source. Vendors opt in to a verified-fan drop and get real buyers plus
a clean demand signal.

Built with Next.js 15 / React 19 / TypeScript, live `@valiron/sdk` trust calls, and a
demonstrated x402 paywall handshake.
