# FaceValue — Demo Video Script (~120s, conversational cut)

Read the VO in a natural, confident pace. Slides = `submission/FaceValue_Deck.pptx`. App = the live site.
Two app moments show a **real Valiron call** — keep a "LIVE — Valiron" caption on both.

## Pre-record checklist
1. `npm run warm` — wakes Valiron so the live calls are instant on camera.
2. Record the app from a **production build** (no dev overlay): `npm run build` then `npm run start` → localhost:3000. Re-run `npm run warm`.
3. Fresh state = "Midnight Echo · 5 of 5 tickets." (To reset mid-session: `POST /api/dev/reset`.)
4. Record ~1440px wide so the simulation panels sit side-by-side. Capture slides + the two browser clips separately, then stitch with VO + captions.

---

## The script (VO + what to show)

**[0:00–0:03 · Slide 1 — title]**
> "You waited months for these tickets."

**[0:03–0:13 · Slide 2 — $60 → $1,200]**
> "Gone in thirty seconds — then resold to real fans for twenty times face value. A sixty-dollar ticket, twelve hundred on resale. You got scalped. Again."

**[0:13–0:23 · Slide 3 — why it happens]**
> "It's a ten-billion-dollar problem, it's illegal — and it still happens at every drop, because every defense out there checks accounts, not people. And accounts are free to fake."

**[0:23–0:32 · Slide 4 — the fix]**
> "FaceValue ends it. We don't fight the bots — we make every buyer prove they're one real person. And you can't fake being a person."

**[0:32–0:40 · Slide 5 — how it works]**
> "So two checks run before any ticket clears: Valiron confirms one real human — then FaceValue issues a single ticket, at face value, bound to that person."

**[0:40–0:54 · App `/simulation` — click "Run the drop," both panels fill]**
> "Here's a recreation of a real drop. With no verification, a scalper runs a swarm of fake accounts and sweeps the seats right out from under real fans — then relists them at a markup."

**[0:54–1:11 · App `/simulation` — the FaceValue side fills green]**  ← *the Valiron line lands here*
> "Run that same drop through FaceValue, and every buyer has to be one verified human — so the swarm has nothing to hide behind, and the seats go to real people. And Valiron isn't bolted on for show here — proving that each agent is one real human is the piece that makes all of this work."

**[1:11–1:22 · App `/simulation` — scroll to the Live Valiron cards]**  *(MAGIC MOMENT — caption: "LIVE — Valiron")*
> "And that check runs live — a real call to Valiron. The real fan's agent: cleared. The scalper's twenty fake identities: denied, on the spot."

**[1:22–1:40 · App `/fan` — verify → send agent to the drop → terminal streams → "Ticket secured"]**
> "Here's what that feels like as a fan. You head to checkout like normal — but before a ticket is ever yours, two things happen: World ID proves you're one real human, and the instant Valiron clears you, FaceValue locks one ticket to your identity. So it can never be resold."

**[1:40–1:46 · Slide 6 — result]**
> "Five tickets. Five real fans. Zero scalpers."

**[1:46–1:56 · Slide 7 → Slide 8 — why an agent + the business]**
> "Everyone gets one verified agent — no one can fake fifty. Venues opt in to kill scalping and see real demand, all on Valiron's agent-identity infrastructure."

**[1:56–2:02 · Slide 9 — close]**
> "FaceValue. Real fans. Real tickets. Face value."

---

## Notes
- **Total ≈ 290 words ≈ ~120s** with the visual holds. If you want more buffer, trim Slide 5 (its line is implied by the demo) to save ~6s.
- **Simulation wording is side-agnostic on purpose** — it never says "left/right," so it works no matter how the panels land on your recording. (For reference, the app shows the *un-verified* drop on the **left** and *FaceValue* on the **right**; tell me if you'd rather I swap that order.)
- **The two shots that win it:** 1:11–1:22 (live Valiron ALLOW vs DENY) and the `/fan` terminal at 1:22–1:40 (`valiron.getAgentProfile → ALLOW · World ID ✓ · …ms`). Caption both "LIVE — Valiron."
- The fan terminal's `(…ms)` is the **real** round-trip — record the real run, don't fake it.
