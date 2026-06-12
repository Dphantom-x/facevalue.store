# FaceValue — Site & Landing Redesign Spec (Track B / market-facing)

> Content & structure spec for the redesign. Visual design (color, type, layout aesthetics) stays with
> the Claude Design pass — this defines WHAT each page contains, for WHOM, and what it must accomplish.

## Strategy — who lands where, and why the root page is fan-first

Three entry paths:
1. **Fans** — QR posters / IG / a friend's link → land on a **drop page** or the **home page**. Mobile.
2. **Promoters/venues** — our outbound DM → check the site for credibility → need a **For venues** page. Desktop.
3. **Judges/partners (Valiron/World)** — deep link → the **demo/simulation**. Keep it alive, demoted in nav.

**The root page is fan-energy, not B2B SaaS.** Reason: fans are the volume audience — and a promoter
evaluating us is really asking "would MY crowd love this?" A scene-brand homepage answers that better
than an enterprise pitch. The venue path must be unmissable (nav + banner) but secondary.

**Language rules (all consumer surfaces):**
- Hero speaks pain/benefit in fan language; mechanism is explained progressively (scroll → FAQ → demo page).
- NO "agent"/"bot" language, NO crypto/web3 words anywhere consumer-facing.
- World ID + Valiron get credited in the footer and the demo page — not the hero.
- Kill the orb fear explicitly: "No eye scans. No crypto. 60 seconds on your phone."
- No invented numbers or logos. Counters and case studies appear only when real.

## Page map (6 surfaces)

| Route | Job | Primary audience |
|---|---|---|
| `/` | Brand + funnel into the Circle / next drop | Fans (mobile) |
| `/circle` | Verify once → membership | Fans (mobile) |
| `/drop/[event]` | THE conversion surface (verify → buy), 5 states | Fans (mobile) |
| `/venues` | Pilot pitch + contact | Promoters/venues (desktop) |
| `/simulation` | Proof/demo ("See it live") + sponsor track | Promoters, judges, press |
| Global | Nav, footer, shared FAQ | All |

---

## 1) Home `/`

**Job:** make a fan want in, in under 10 seconds; route venues out to `/venues`.

Sections in order:
1. **Nav** — logo · Drops · The Circle · For venues · See it live · CTA chip "Verify once".
2. **Hero** — pain+promise headline. Options to test:
   - "Tickets scalpers can't touch."
   - "You got scalped for the last time."
   - "Face value. Every time."
   Subline (mechanism-lite): "Prove you're one human — once — and get first dibs on NYC drops at face
   value." Primary CTA: **"Join the Circle — verify once (60s)"** → `/circle`. Secondary: "How it works"
   (anchor). One primary CTA only.
   Optional proof strip: "● {N} verified humans in NYC" (real counter only).
3. **Next drops rail** — drop cards: event, venue, date, **Face value $X ✓** chip, remaining bar,
   status pill (Verify to unlock / Live now / Sold out). **Empty state** (launch reality): "First drop
   lands soon — get on the list" + email/IG capture.
4. **How it works — fan version, 3 steps:**
   1. *Verify once* — 60 seconds on your phone. No account, no eye scan, no crypto.
   2. *Unlock drops* — members get the first window, always at face value.
   3. *Walk in* — your ticket is bound to you. It can't be flipped, so it can't be scalped.
5. **The problem block** — the $60 → $1,200 visual; "Every defense checks *accounts* — and accounts are
   free to fake. We check *humans*." (Keep 2–3 stats max.)
6. **Privacy block** — header: **"Anonymous to everyone. Accountable at the door."** Bullets: we never
   learn your name · zero-knowledge proof (you prove you're one person, not who you are) · no data
   resale, no ad profile — contrast with big-ticketer data harvesting. This block converts the
   privacy-skeptical AND differentiates.
7. **Perks/status block (the Circle)** — first-dibs windows · face value always · the member line at
   the door · "+1s welcome — they verify too."
8. **Venue banner** — one line: "Run a scalper-proof drop at your venue — costs you $0 →" → `/venues`.
9. **Proof teaser** — "Watch a scalper swarm bounce off the gate — live demo →" → `/simulation`.
10. **FAQ accordion** (shared component, see below).
11. **Footer** — tagline · contact/IG · privacy/terms · "Built on World ID proof-of-personhood ·
    Valiron agent-trust infrastructure" · compliance line: "FaceValue enforces purchase limits
    (BOTS Act 2016) — we never resell."

---

## 2) The Circle `/circle`

**Job:** absorb the one-time verification friction by making it feel like initiation.

Sections:
1. Header: **"The Inner Circle — verified humans only."** + real member counter when meaningful.
2. Value stack — 3 perk cards (first dibs · face value forever · member door line).
3. **The verify module** — the actual World ID device-level flow. States: idle → verifying →
   verified-welcome ("You're in. One human, one ticket — forever."). Show the pseudonymous ID
   (shortened nullifier) as their "member code."
4. **"What we know about you" table** — radical transparency: we store = one anonymous code; we never
   see = name, email (unless you opt into reminders), payment details (Stripe handles), face/iris.
5. Upcoming drops preview — locked → unlocked visual transition once verified.
6. FAQ subset (privacy + "what if I can't make it").

---

## 3) Drop page `/drop/[event]` — THE conversion artifact

**Job:** the teardown's funnel test lives here. Kill metric: **≥15% of visitors complete verify+buy.**
Instrument every step: view → verify-start → verify-done → buy-click → paid.

Sections:
1. **Event hero** — artist/event, venue, date·time, **Face value $X ✓** chip prominent.
2. **Status module** (one of 5 states — see below).
3. **Two-step module** — Step 1 Verify (or "✓ verified" if already a member — members skip straight to
   buy: the retention payoff) → Step 2 Buy (disabled until verified). Stripe payment link/checkout.
4. **Trust badge** — "Every buyer verified live · one ticket per human." Keep the fan UI clean; an
   expandable "see the engine" reveals the live terminal (the existing engine-terminal component) for
   the curious/nerds/press.
5. **Honest scarcity** — "{remaining} of {total}" + bar. Never fake it.
6. FAQ subset + footer.

**The 5 states:**
- **(a) Pre-drop** *(the most important state)* — countdown to open + **"Verify now so you're ready"**
  + reminder capture (SMS/email). This is where the friction gets absorbed DAYS early — the drop moment
  stays one-tap. (Concert Kit's 2-for-1 bribe proves friction must be prepaid; our answer is the
  pre-verification window.)
- **(b) Live** — buy now at face value.
- **(c) Sold out** — **waitlist**: "If a ticket gets returned, the next verified human gets it at face
  value." (Waitlist count = the demand-data product we promised vendors.)
- **(d) Your ticket** (post-purchase) — QR/pass, "bound to you," door instructions, and a
  **"Can't make it? Return at face value"** button (returns feed the waitlist — our legal, fan-friendly
  answer to "what if plans change" — never peer-to-peer transfer).
- **(e) Past event** — recap + "Join the Circle for the next one."

---

## 4) For venues & promoters `/venues`

**Job:** convert a DM'd promoter into a free pilot. Desktop-comfortable, screenshot-able.

Sections:
1. **Hero (pain-first):** "Your show sold out in minutes. Your fans paid a scalper triple." Promise:
   "Run a drop only real humans can buy — and the ticket itself can't be flipped."
2. **The 60-second pitch — 3 steps for them:** (1) Carve out 30–50 tickets of an existing night →
   (2) we run everything (drop page, verification, payments, door list) → (3) you keep 100% of face value.
3. **Economics card:** You pay **$0** · fans pay a ~$1 fair-access fee · you keep all ticket revenue ·
   we'll even staff the check-in for pilot #1.
4. **Differentiation block** (no competitor names): "Presale codes and CAPTCHAs check who gets in
   line. **We bind each ticket to one verified human — through your door.** A gated code still produces
   a ticket someone can flip an hour later. Ours can't be."
5. **Demand-data promise:** verified waitlist counts + post-drop report — "know your real demand
   before you book the next room."
6. **Proof:** live demo link · the smoking-gun visual (a real StubHub listing at 3× face, anonymized)
   · **Pilot #1 case-study slot** (placeholder until real — then it leads this page).
7. **Objection mini-FAQ:** Will my fans verify? (pre-drop window + perks; pilot is a carve-out so
   nothing is at risk) · What if it breaks? (your normal flow still sells the other tickets) ·
   Legal? (we enforce your limits — BOTS Act compliant by design).
8. **CTA:** "Run a free pilot at your next show" → email + IG DM + calendar link. Secondary CTA:
   "Send us a StubHub link of your show being scalped — we'll show you what we'd do."

---

## 5) See it live `/simulation`

Keep the existing simulation + live Valiron cards (it still serves the sponsor/LOI track and is the
best proof asset). Retitle "See it live." Add a top banner routing visitors onward: fans → `/circle`,
venues → `/venues`. The existing `/fan` and `/vendor` app pages remain as working product behind the
marketing layer.

---

## Shared FAQ (the canonical answers)

1. **Is this crypto?** No. You pay with a normal card. We use zero-knowledge identity tech under the
   hood so no one — including us — learns who you are.
2. **Do I have to scan my eyes?** No. Verification is ~60 seconds on your phone (device-level World ID).
3. **What do you know about me?** One anonymous code proving you're a unique human. Not your name.
4. **What if I can't go?** Return your ticket at face value — the next verified human on the waitlist
   gets it. (No peer-to-peer transfers; that's how scalping dies.)
5. **Is this legal?** Yes — the opposite of a bot. We enforce the per-person limits the BOTS Act of
   2016 protects.
6. **Why only some tickets?** Vendors start with a verified allocation and expand as fans verify.

## Build notes
- Mobile-first for `/`, `/circle`, `/drop/*`; desktop-first acceptable for `/venues`.
- Redesign is additive: existing routes/tests stay green; home has no testids today, so it's free to change.
- Funnel instrumentation is part of the build, not an afterthought (the 15% gate depends on it).
