# 2026-06-22 · Built the pilot's kill-metric instrument (code-gate + conversion funnel)

**Focus:** Turn the locked pilot plan into motion. The whole Phase-1 go/no-go is *"≥15% of clickers
verify"* — but there was no way to run an invite-only carve-out or to measure that rate. Built both.

## What we did
- **Access-code gate (invite-only carve-outs).** Nullable `drops.accessCode` (+ idempotent `migrate()`
  for existing DBs). `dropCodeOk()` (case-insensitive). `/api/drops/[id]?code=` returns a
  `{locked, teaser}` shape when the code is missing/wrong; the drop page renders an "Enter your access
  code" gate card. The **claim path also enforces it** (`NEED_CODE` → 403) so the carve-out can't be
  bypassed by POSTing directly. Open drops (no code) are completely unaffected.
- **Conversion-funnel instrument.** New `events` table + `/api/track` beacon keyed by an anonymous
  `fv_vid` cookie (so a logged-OUT clicker still counts). Stages: `drop_view` (page mount),
  `verify_start`/`verify_done` (wizard, now takes a `dropId` prop), `claim_done` (server-truthed in the
  claim route from the cookie). `funnelFor(dropId)` returns unique-visitor counts +
  `verifyRate = verifies/views`.
- **Studio surfaces it.** Each drop row now shows `views → verified → claimed` and a verify-rate chip
  with a **PASS ✓ / below-15%** verdict, plus a copy-invite-link button. Create-drop form gained an
  optional access-code field.
- **Tests.** New `e2e/pilot-funnel.spec.ts` (2 specs): gate enforcement (locked w/o code, unlocks
  case-insensitively, `NEED_CODE` on claim, open drops still claim) + funnel math (10 distinct visitors,
  3 verify+claim → views=10, verifies=3, claims=3, rate=0.30). **Full suite: 20/20 green.**
- **Browser-verified** the two new React surfaces via accessibility snapshots: the Studio funnel strip
  (`1 views → 0 verified → 0 claimed`, 🔒 invite-only chip, Copy invite link) and the drop gate card
  (renders *instead of* the wizard; a valid `?code=` unlocks the full claim UI → wizard takes over). No
  console errors.

## Decisions
- **Decision:** Enforce the code on the **claim** endpoint, not just the page fetch. *Why:* the page gate
  is UX/attribution; without a server-side claim check a carve-out is trivially bypassable.
- **Decision:** `claim_done` is emitted **server-side** (authoritative), while `drop_view`/`verify_*` are
  client beacons. *Why:* the bottom-of-funnel number must equal real allocations; top-of-funnel can be
  approximate for a pilot.
- **Decision:** Count funnel stages as `COUNT(DISTINCT vid)`. *Why:* one human reloading shouldn't
  inflate "clickers"; the ≥15% metric must be per-person.
- **Decision:** Anonymous `fv_vid` cookie (httpOnly, 180d) minted on the first beacon. *Why:* a clicker
  who bounces before signup must still count in the denominator, or the verify rate is meaningless.

## Bugs & fixes
- **Bug:** schema changes (new column/table) don't reach an already-open DB — the `globalThis.__fvdb`
  singleton survives Next HMR, so `open()`/`migrate()` never re-runs. **Fix:** restarted the dev server
  (kill :3000 → let Playwright boot fresh) so the migration runs; `migrate()` ALTERs existing DBs idempotently.

## State at end
- 20/20 Playwright specs green; `tsc --noEmit` clean. Code-gate + funnel committed.
- Preview `preview_screenshot` still times out (known tool flakiness) — used accessibility snapshots
  + the e2e suite as proof instead.

## Next / open threads
- **Decision needed from Aldo:** deploy host. SQLite (`better-sqlite3`, sync) runs on any host with a
  **persistent disk** (`FV_DB_PATH` override already exists) — Railway/Fly = ~no code change; Vercel
  (the old default) would force a Turso/Postgres async rewrite. Recommend Railway/Fly + volume.
- **Phase 0 manual (Aldo):** register a World ID app (app_id + action) so I can wire real IDKit
  (`WORLDID_REAL=1` currently 501); stand up @NYCScalpWatch.
- Then Phase 1: hand a booker a coded invite link, watch the Studio funnel, kill/continue on ≥15%.
