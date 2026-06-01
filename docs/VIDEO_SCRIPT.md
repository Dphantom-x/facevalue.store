# FaceValue — 120s Demo Video Script (shot-by-shot)

**Target: ~117 seconds.** Slides = the `FaceValue_Deck.pptx`. App = the live site (`/simulation`, `/fan`).
The two app beats (Sim live cards + Fan terminal) each show a **real Valiron call** — that's the shot a
sponsor judge is watching for, so the captions must say "Valiron" on screen.

## Pre-record checklist
1. `npm run warm` — wakes Valiron so the live calls are instant on camera.
2. Record the app from a **production build** (no dev overlay): `npm run build` then `npm run start` →
   http://localhost:3000. (Re-run `npm run warm` after.)
3. Fresh state: after `npm start` the drop is "Midnight Echo · 5 of 5 tickets." (To reset mid-session:
   `POST http://localhost:3000/api/dev/reset`.)
4. Record desktop width (~1440px) so the simulation panels sit **side-by-side**.
5. Dry-run the two app clips once so the clicks are smooth.
6. Capture slides (fullscreen deck) and the two browser clips separately, then stitch + add VO + captions.

## The single most important shot
**1:05–1:19 — the live Valiron ALLOW vs DENY** (and again in the fan terminal at 1:19–1:35). Put a bold
caption on it: "LIVE — Valiron trust gate." That five seconds *is* the pitch.

---

## Shot list

| # | Time | On screen | Action | Say (voiceover) | Caption overlay |
|---|------|-----------|--------|-----------------|-----------------|
| 1 | 0:00–0:03 | **Slide 1** (Title) | hold | "You waited months for these tickets." | REAL FANS. REAL TICKETS. FACE VALUE. |
| 2 | 0:03–0:13 | **Slide 2** (Problem $60→$1,200) | hold | "Gone in thirty seconds — then resold to real fans for twenty times face value. A sixty-dollar ticket, twelve hundred on resale. You got scalped. Again." | $60 → $1,200 |
| 3 | 0:13–0:25 | **Slide 3** (Why it happens) | hold | "It's a ten-billion-dollar problem. It's illegal under federal law. And it still happens at every hot drop — because every defense checks accounts, not people. And accounts are free to fake." | $10B+ · 7,000% · 5B bot attempts/mo |
| 4 | 0:25–0:34 | **Slide 4** (The Fix) | hold | "FaceValue ends it. We don't fight the bots — we make every buyer prove they're one real person. Fake accounts become useless." | One real human = one ticket |
| 5 | 0:34–0:40 | **Slide 5** (How it works) | hold | "Two checks before any ticket clears: Valiron verifies a real human; FaceValue gives them one, at face value." | Agent → Valiron → FaceValue → Ticket |
| 6 | 0:40–0:53 | **App `/simulation`** | Click **"Run the drop."** Pan the LEFT panel as it fills red. | "Here's a live drop. Watch it today — bots grab every ticket across dozens of fake accounts in seconds. Real fans? Shut out." | Today — no verification |
| 7 | 0:53–1:05 | **App `/simulation`** | Pan to the RIGHT panel (all green) + Mode-B summary. | "Now switch on FaceValue. Every buyer has to be one verified human — so the scalper swarm bounces off the gate, and all five tickets land with real fans." | With FaceValue — verified humans |
| 8 | 1:05–1:19 | **App `/simulation`** | Scroll to the **Live Valiron trust check** cards. | "And this is not scripted — that's a live call to Valiron, right now. The verified fan's agent: allowed. The scalper's twenty fake identities: denied. Instantly." | **LIVE — Valiron** · fan ✓ ALLOW (92) · scalper ✗ DENY |
| 9 | 1:19–1:35 | **App `/fan`** | Click **Verify** → **Send my agent to the drop** → let the **terminal** run to "Ticket secured." | "Here's a real fan. One World ID check. Her agent waits for the drop — and the instant it opens, clears Valiron in milliseconds and locks one ticket at face value, bound to her identity. It can never be resold." | trust gate: ALLOW · World ID ✓ · bound to identity |
| 10 | 1:35–1:41 | **Slide 6** (Result) | hold | "Five tickets. Five real fans. Zero scalpers." | 0 scalpers |
| 11 | 1:41–1:51 | **Slide 7 → Slide 8** | hold (cut between the two) | "Everyone gets one verified agent — no one can fake fifty. Venues opt in to kill scalping and see real demand — all on Valiron's agent-identity infrastructure." | Venues opt in. Scalpers opt out. |
| 12 | 1:51–1:57 | **Slide 9** (Close) | hold | "FaceValue. Real fans. Real tickets. Face value." | facevalue.store |

**Total VO ≈ 275 words ≈ 110s + visual holds ≈ 117s.** If you need to trim under 120 with buffer, cut Slide 5
(beat 5) and fold its line into beat 4 — that buys ~6s.

## Notes
- Beats 6–8 are **one continuous `/simulation` screen-recording** (run → watch both panels → scroll to the
  live cards). Beat 9 is **one `/fan` recording** (verify → send agent → terminal → ticket secured).
- The fan terminal's `(…ms)` timing is the **real** Valiron round-trip — don't fake it; just record the real run.
- Keep the "LIVE — Valiron" caption on beats 8 and 9. That's the sponsor proof.
