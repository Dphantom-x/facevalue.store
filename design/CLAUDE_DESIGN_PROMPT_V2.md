# Paste this into Claude Design (Redesign v2 — market-facing site)

---

You are redesigning and extending the UI for **FaceValue**, a live Next.js app. You designed v1 (the
current site); this v2 turns it from a demo into the real market-facing site. There are **4 pages to
design/build** — `/` (home, redesign), `/circle` (new), `/drop/[id]` (new), `/venues` (new) — plus
small edits to `/simulation`. Below is the complete functional/content specification.

**All visual design is yours** — but **extend the existing FaceValue design system from v1** (same
fonts: Newsreader display / Hanken Grotesk body / JetBrains Mono; same palette: fan-green, accent-blue,
scalper-red, soft editorial light theme; same CSS variable names in `globals.css`) so new pages drop
into the existing stylesheet. I'm attaching screenshots of the current site for continuity.

## What FaceValue is now (context)
FaceValue is proof-of-personhood ticketing for the NYC scene: **one real human = one ticket, at face
value.** Fans verify once (~60 seconds, phone only — no eye scan, no crypto) and join "the Circle" — a
verified-humans-only access layer that gets first dibs on small high-demand drops (shows, parties,
underground fashion). Tickets are bound to the verified identity, so they can't be resold. Venues and
promoters run "verified drops" through us; it costs them $0 (fans pay ~$1 fair-access fee).

**Audiences:** fans arrive on PHONES (QR posters, IG, drop links); promoters arrive on DESKTOP (from
our DM, checking credibility). The root page is fan-energy/scene-brand — NOT enterprise SaaS — with an
unmissable path to `/venues`.

## Language rules (strict, all consumer-facing copy)
- Fan language: pain + benefit. The mechanism explains itself progressively (scroll → FAQ).
- NEVER use: "bot", "agent", "crypto", "web3", "blockchain", "wallet", "token", "stealth".
- Kill the orb fear explicitly: "No eye scans. No crypto. 60 seconds on your phone."
- World ID + Valiron are credited ONLY in the footer + demo page, never in heroes.
- NO invented numbers, member counts, logos, or testimonials. Counters render only when real data is
  provided; otherwise hide them.

## Technical requirements (required for integration — keep exactly)
- Next.js 15 App Router + React 19 + TypeScript. Pages at `src/app/<route>/page.tsx`; the drop page is
  a dynamic route `src/app/drop/[id]/page.tsx`.
- Tailwind v4-compatible plain CSS via the existing `globals.css` design-token system (extend it).
- Interactive pages start with `"use client";` and implement the real behavior (fetch + state) below.
- **Do not change** API endpoints, request/response field names, or the `data-testid`s listed below.
- **Do not redesign `/fan` or `/vendor`** (existing app pages — leave untouched).
- `/simulation`: keep all existing functionality + these testids EXACTLY: `run-button`,
  `modeA-summary`, `modeB-summary`, `live-fan`, `live-scalper` (and their copy: "shut out",
  "verified fans", "blocked", "ALLOW", "DENY"). You may restyle; add a slim top banner: fans →
  "Join the Circle" (`/circle`), venues → "Run a verified drop" (`/venues`). Retitle nav label to "See it live".
- Every page: loading / empty / error / disabled states, mobile-first (`/venues` may be desktop-first).

## Data shapes (mirror exactly)
```ts
type Drop = {
  id: string; artist: string; event: string; venue: string; date: string;        // date = ISO day
  faceValue: number; remaining: number; totalInventory: number; maxPerHuman: number;
  mode: "full" | "hybrid" | "lottery";
  opensAt?: string;  // ISO datetime; in the future ⇒ pre-drop state; absent/past ⇒ on sale
};
type PurchaseResp = {
  decision: "approved" | "denied"; message: string; ticketId?: string;
  remaining?: number; faceValue?: number; stage?: "trust" | "policy";
  code?: "SOLD_OUT" | "LIMIT_REACHED" | "NOT_FOUND";
};
```

## APIs (already live — call exactly)
- `GET  /api/drops` → `{ drops: Drop[] }` (drops[0] = featured; find by id for the drop page)
- `POST /api/world-id/verify` body `{}` → `{ ok, nullifierHash, verificationLevel, simulated }`
- `POST /api/drop/purchase` body `{ dropId, agentId: "25459", chain: "ethereum", humanId: <nullifierHash> }`
  → `PurchaseResp` (HTTP 200 approved · 403 trust-denied · 409 limit/sold-out)
- `POST /api/trust-check` body `{ agentId, chain }` — simulation page only (unchanged).
- **Not built yet (simulate locally with a success state + `// TODO wire` comment):** waitlist signup,
  drop reminders (SMS/email capture), member counter.

## Membership persistence (the cross-page contract)
- localStorage key **`fv_member`** = `JSON.stringify({ nullifierHash, verifiedAt })`.
- `/circle` writes it after a successful verify. Home + drop pages read it: verified members see a
  "✓ You're in the Circle" state and **skip straight to Buy** on drop pages.
- A "Not you? Verify as someone else" action clears it.

---

# PAGE 1 — Home `/` (full redesign)

**Job:** make a fan want in within 10 seconds; route venues out. Mobile-first.

Sections in order:
1. **Nav** — FaceValue brand · links: Drops (anchor to rail) · The Circle (`/circle`) · For venues
   (`/venues`) · See it live (`/simulation`) · CTA chip "Verify once" (`/circle`).
2. **Hero** — headline: **"Tickets scalpers can't touch."** (alts to taste: "You got scalped for the
   last time." / "Face value. Every time.") Subline: "Prove you're one human — once — and get first
   dibs on NYC drops at face value." ONE primary CTA — `data-testid="home-join-cta"` — label
   **"Join the Circle — verify once (60s)"** → `/circle`. Secondary text link "How it works" (anchor).
   If localStorage `fv_member` exists: swap CTA to "✓ You're in — see drops" (anchor to rail).
3. **Next drops rail** — `data-testid="drops-rail"` — cards from `GET /api/drops`: event, venue,
   date, "Face value $X ✓" chip, remaining bar, status pill (Verify to unlock / On sale / Sold out —
   derive from `opensAt`/`remaining`). Card click → `/drop/[id]`. **Empty state:** "First drop lands
   soon — get on the list" + email capture (simulated success).
4. **How it works (fan, 3 steps):** (1) **Verify once** — "60 seconds on your phone. No account, no
   eye scan, no crypto." (2) **Unlock drops** — "Members get the first window, always at face value."
   (3) **Walk in** — "Your ticket is bound to you. It can't be flipped, so it can't be scalped."
5. **Problem block** — $60 → $1,200 visual; copy: "Every defense checks *accounts* — and accounts are
   free to fake. We check *humans*." Max 3 stats.
6. **Privacy block** — header **"Anonymous to everyone. Accountable at the door."** Bullets: "We never
   learn your name" · "Zero-knowledge proof — you prove you're one person, not who you are" · "No data
   resale. No ad profile. Ever."
7. **Circle perks block** — First-dibs windows · Face value, forever · The member line at the door ·
   "+1s welcome — they verify too."
8. **Venue banner** — one line: "Run a scalper-proof drop at your venue — costs you $0 →" → `/venues`.
9. **Proof teaser** — "Watch a scalper swarm bounce off the gate — live →" → `/simulation`.
10. **FAQ accordion** — the 6 canonical Q&As (verbatim section below).
11. **Footer** — tagline · contact + IG placeholders · Privacy/Terms links (stub pages ok) · line:
    "Built on World ID proof-of-personhood · Valiron agent-trust infrastructure." · compliance line:
    "FaceValue enforces purchase limits (BOTS Act 2016). We never resell."

---

# PAGE 2 — The Circle `/circle` (new)

**Job:** make one-time verification feel like initiation, not friction. Mobile-first.

Sections:
1. **Header** — "The Inner Circle — verified humans only." Optional member counter: HIDDEN unless real
   data exists.
2. **Perk cards (3)** — First dibs on every drop · Face value, forever · The member line.
3. **Verify module** — states: idle → button `data-testid="circle-verify-button"` label **"Verify with
   World ID — 60 seconds"** → verifying (spinner, "Verifying you're one human…") → verified:
   `data-testid="circle-verified-badge"` containing **"You're in"**, plus the member code
   `data-testid="member-code"` showing the shortened nullifier (e.g. `0x3f9a…c2d1`) labeled "Your
   anonymous member code". On success write localStorage `fv_member`. If already a member on load,
   show the verified state immediately + "Not you? Verify as someone else" (clears it).
   Behavior: `POST /api/world-id/verify` `{}` → use `nullifierHash`.
   Microcopy under button: "No eye scans. No crypto. Nothing to install."
4. **"What we know about you" table** — two columns. We store: "One anonymous code proving you're a
   unique human." We never see: "Your name · your contacts · your payment details (Stripe handles
   those) · your face."
5. **Upcoming drops preview** — same cards as home rail; locked overlay ("Verify to unlock") that
   visually unlocks when verified.
6. **FAQ subset** — Qs 1, 2, 3, 4 from the canonical list.

---

# PAGE 3 — Drop page `/drop/[id]` (new — the conversion surface)

**Job:** the funnel test lives here (target: ≥15% of visitors complete verify+buy). Mobile-first.
Load the drop via `GET /api/drops` (match `id`); not found → friendly 404 with link home.

Sections:
1. **Event hero** — artist, event, venue, date/time, prominent **"Face value $X ✓"** chip.
2. **Status module** — one of 5 states (below) — `data-testid="drop-status"`.
3. **Two-step module:**
   - Step 1 Verify — `data-testid="drop-verify-button"`. If `fv_member` exists, render as already
     done: "✓ Circle member — you're ready." Otherwise same verify flow as /circle (writes `fv_member`).
   - Step 2 Buy — `data-testid="drop-buy-button"`, label **"Buy 1 ticket at face value"**, DISABLED
     until verified. On click: `POST /api/drop/purchase` with the stored `nullifierHash` as `humanId`.
     Result panel `data-testid="drop-result"`: approved → render API `message` (contains "face value"
     and "non-transferable") + ticketId; `LIMIT_REACHED` → "One ticket per verified human — you already
     have yours."; `SOLD_OUT` → switch to sold-out state; trust-denied → "Blocked at the trust gate."
     On approval ALSO write localStorage `fv_ticket_<dropId>` = `{ ticketId, faceValue }`.
4. **Trust badge** — small line "Every buyer verified live · one ticket per human" with an expandable
   "See the engine" — `data-testid="engine-toggle"` — revealing a terminal-style live log panel
   `data-testid="engine-terminal"` that streams short mono lines during verify/buy (e.g.
   `→ world-id: proof ok · nullifier 0x3f9a…` / `→ trust gate: ALLOW · score 92` / `✓ ticket bound to
   identity`). Design the panel; the live feed wiring exists in our codebase.
5. **Honest scarcity** — `data-testid="drop-remaining"`: "{remaining} of {totalInventory} left" + bar.
6. **FAQ subset** (Qs 4, 5, 6) + footer.

**The 5 states (precedence top→bottom):**
- **(e) Past event** — `date` before today → recap card: "This one's gone. Join the Circle for the
  next." CTA → `/circle`.
- **(d) Your ticket** — localStorage `fv_ticket_<dropId>` exists → ticket card: big QR placeholder,
  event details, "Bound to you — non-transferable", door note ("show this + you're on the verified
  list"), and **"Can't make it? Return at face value"** button → confirm dialog → simulated success:
  "Returned. The next verified human on the waitlist gets it at face value." (clears the ticket,
  `// TODO wire`).
- **(a) Pre-drop** — `opensAt` in the future → **countdown** (`data-testid="drop-countdown"`) +
  banner **"Verify now so you're ready — the drop is one tap when it opens."** + reminder capture
  (email/phone input, simulated success, `// TODO wire`). Step 1 verify is ACTIVE in this state;
  Step 2 buy shows "Opens {time}".
- **(c) Sold out** — `remaining === 0` → **waitlist form** — `data-testid="drop-waitlist-form"` —
  copy: "Sold out — at face value, to real humans. If a ticket is returned, the next verified human
  gets it." Email/phone capture, simulated success ("You're #— we'll text you."), `// TODO wire`.
- **(b) Live** — default → the two-step module active.

---

# PAGE 4 — For venues & promoters `/venues` (new)

**Job:** convert a DM'd promoter into a free pilot. Desktop-comfortable, screenshot-able, calm and
credible (less scene-flash than the fan pages, same design system).

Sections:
1. **Hero** — pain-first: **"Your show sold out in minutes. Your fans paid a scalper triple."**
   Promise: "Run a drop only real humans can buy — and the ticket itself can't be flipped."
   CTA — `data-testid="venues-pilot-cta"` — **"Run a free pilot at your next show"** (anchor to contact).
2. **The 60-second pitch — 3 steps:** (1) "Carve out 30–50 tickets of a night you already have on
   sale." (2) "We run everything — the drop page, verification, payments, the door list." (3) "You
   keep 100% of face value."
3. **Economics card** — "You pay **$0** · Fans pay a ~$1 fair-access fee · You keep all ticket
   revenue · We'll even staff check-in for your first drop."
4. **Differentiation block** (never name competitors) — "Presale codes and CAPTCHAs check who gets in
   line. **We bind each ticket to one verified human — through your door.** A gated code still
   produces a ticket someone can flip an hour later. Ours can't be."
5. **Demand data block** — "Know your real demand: verified waitlist counts and a post-drop report —
   before you book the next room."
6. **Proof row** — link to `/simulation` ("watch the gate work, live") + a framed "smoking gun"
   placeholder image slot (a resale listing at 3× face — we'll supply) + an empty **case-study slot**
   ("Pilot #1 results will live here" — design the container, mark placeholder).
7. **Objection mini-FAQ:** "Will my fans actually verify?" → "We open verification days before the
   drop with member perks — by doors, it's one tap. And the pilot is a carve-out: your normal sale
   runs untouched." · "What if something breaks?" → "Only the carve-out is on us; every other ticket
   sells exactly as it does today." · "Is this legal?" → "It's the opposite of a bot — we enforce
   your per-person limits (BOTS Act 2016)."
8. **Contact/CTA block** — email + IG placeholders + calendar-link placeholder. Secondary CTA:
   "Send us a resale link of your show being scalped — we'll show you what we'd do about it."

---

# Shared FAQ (canonical copy — use verbatim)
1. **Is this crypto?** "No. You pay with a normal card. We use zero-knowledge identity tech under the
   hood, so no one — including us — learns who you are."
2. **Do I have to scan my eyes?** "No. Verification is about 60 seconds on your phone."
3. **What do you know about me?** "One anonymous code that proves you're a unique human. Not your name."
4. **What if I can't go?** "Return your ticket at face value — the next verified human on the waitlist
   gets it. No peer-to-peer transfers; that's how scalping dies."
5. **Is this legal?** "Yes — it's the opposite of a bot. We enforce the per-person limits the BOTS Act
   of 2016 protects."
6. **Why are only some tickets verified?** "Venues start with a verified allocation and expand it as
   more fans verify."

# Integration-critical copy (must contain these substrings)
- Home hero CTA: "Verify once". Privacy block: "Anonymous to everyone".
- Circle verified badge: "You're in".
- Drop approved result: "face value" and "non-transferable". Limit result: "one ticket per verified human".
- Drop pre-drop banner: "Verify now". Sold-out block: "waitlist" (any case).
- Venues economics: "$0". Differentiation: "through your door".
- Simulation (preserved): "shut out", "verified fans", "blocked", "ALLOW", "DENY".

# data-testid attributes that must exist
- `/`: `home-join-cta`, `drops-rail`
- `/circle`: `circle-verify-button`, `circle-verified-badge`, `member-code`
- `/drop/[id]`: `drop-status`, `drop-verify-button`, `drop-buy-button`, `drop-result`,
  `drop-remaining`, `drop-countdown`, `drop-waitlist-form`, `engine-toggle`, `engine-terminal`
- `/venues`: `venues-pilot-cta`
- `/simulation` (unchanged): `run-button`, `modeA-summary`, `modeB-summary`, `live-fan`, `live-scalper`

# Deliverable
- `src/app/page.tsx` (home redesign), `src/app/circle/page.tsx`, `src/app/drop/[id]/page.tsx`,
  `src/app/venues/page.tsx`, updated `src/app/simulation/page.tsx` (banner + retitle only), shared
  components as needed, and the extended `globals.css`.
- Full working behavior (fetch + states + localStorage contract), `"use client"` on interactive pages,
  all testids + API field names preserved. Simulated-success stubs clearly marked `// TODO wire`.
