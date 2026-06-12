# 2026-06-12 · Pilot system build — the full production-shaped app

**Focus:** Build everything the party/pilot needs end-to-end: database, accounts, locked onboarding
wizard, hold→capture payments, claim/QR tickets, returns→waitlist, door check-in, vendor portal —
tested at every layer including a screenshot browser walkthrough.

## What we did
- **DB layer** (`src/lib/db.ts`): better-sqlite3 at `data/facevalue.db`, WAL, auto schema+seed
  (3 drops incl. a future-`opensAt` pre-drop; vendor+admin users). `POST /api/dev/reset` reseeds all.
- **Auth** (`src/lib/auth.ts` + `/api/auth/*`): bcryptjs, `fv_session` cookie (30d), roles, vendor
  signup code. **One human = one account**: nullifier bound uniquely; re-verify idempotent.
- **Payments** (`src/lib/payments.ts`): authorize→capture/cancel→refund abstraction; mock mode (default)
  + Stripe manual-capture mode (off_session, saved card). Researched: cancel-before-capture = $0;
  refund-after-capture forfeits processing fees; online holds ~7 days (extended auth up to 30).
- **Domain** (`src/lib/tickets.ts`): claim = hold → atomic allocate → capture (cancel hold on any
  failure); HMAC QR tokens; returns → refund → waitlist head offered; door check-in single-use; stats; audit.
- **Legacy compatibility:** `store.ts` rewritten on the DB with identical exports/messages — all 9
  hackathon specs untouched and green.
- **Pages:** `/drops`, `/drop/[id]` (5 states + locked onboarding wizard overlay), `/tickets` (QR,
  return), `/door` (staff login, check-in, recent log), `/studio` (vendor login, create drop incl.
  `opensAt`, sales/check-in/waitlist stats, audit feed). Nav extended.
- **Tests:** +10 specs — auth round-trip/roles/nullifier-binding; full browser journey (wizard → claim
  → QR → door check-in → duplicate scan rejected); burst (6 humans race 3 tickets → exactly 3 win);
  waitlist offer flow; declined card (no inventory consumed); pre-drop closed. **18 passed** + a
  WALKTHROUGH=1 spec that saves 13 screenshots to `walkthrough/` (visually verified).

## Decisions
- **Decision:** Payment model = Stripe **manual capture** (hold at claim, capture on allocation,
  cancel free on failure). *Why:* canceling an uncaptured hold costs $0 while refunds forfeit
  processing fees — and the hold IS the "agent budget" without custodying anything.
- **Decision:** The user's "agent crypto-wallet balance" idea is implemented as **authorization-as-budget**
  (no stored balances, no custody → no money-transmitter exposure). Crypto/x402 wallets stay in the
  demo/LOI track.
- **Decision:** One human = one account, enforced by unique nullifier binding; per-human ticket limits
  count by nullifier (not user id) — the Sybil guard survives account games.
- **Decision:** Returned inventory is **reserved for waitlist offers** (`available = remaining −
  offered`) — found via the burst test (a sniper could steal the head's ticket otherwise).
- **Decision:** SQLite via better-sqlite3 for the pilot (sync transactions = race-safe allocation,
  zero infra). Deploy path: swap to Postgres/Turso later or run on a persistent box.

## Bugs & fixes
- **Bug:** All 18 specs failed on first run — a STALE dev server (started before `next.config.ts`
  gained `serverExternalPackages: ["better-sqlite3"]`) was reused by Playwright; every DB route 500'd.
  **Fix:** restart the dev server after config changes; with the flag set, everything passes.
- **Bug:** After a return with a non-empty waitlist, any fan could claim the freed ticket before the
  offered person (burst test caught it). **Fix:** offered-reservation logic in claim/joinWaitlist +
  `available` in the public drop shape.
- **Bug:** Build lint — `require()` in db.ts seed + an unused import. **Fix:** top-level bcryptjs
  import; cleanup. (Preview-tool screenshots also timed out — tool quirk, page healthy; switched the
  walkthrough to Playwright screenshots.)

## State at end
- **18 passed, 1 skipped** (walkthrough, opt-in) · prod build clean (26 routes) · screenshots in
  `walkthrough/` · CLAUDE.md updated (architecture + commands + seed creds).

## Next / open threads
- Go-live wiring for a real event: Stripe keys + client SetupIntent (Elements) for real cards; real
  World ID staging widget; deploy on a persistent host (SQLite) or swap to Postgres; camera QR scanner
  for /door (token paste works today).
- Email notifications (waitlist offers, receipts) — currently in-app only.
- Optional: drop-page funnel instrumentation events (view→verify→pay) for the ≥15% gate.
