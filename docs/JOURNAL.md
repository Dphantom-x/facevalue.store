# FaceValue — Project Journal (index + rules)

The documentation system has **three layers**, each with one job:

| Layer | File(s) | Job | Updated |
|---|---|---|---|
| **History** | `docs/journal/YYYY-MM-DD-slug.md` | What happened: work done, decisions *with why*, bugs + fixes | Append-only, one file per working session |
| **Business truth** | `docs/BUSINESS.md` | What the idea/model/strategy IS right now | Edited in place + changelog line |
| **Technical truth** | `CLAUDE.md` | How the system works right now (auto-loaded every session) | Edited in place |

**The rule:** the journal records *what happened and why*; the living docs record *what's true now*.
When a session changes current truth (a pivot, a new constraint, a proven fact), update the living doc
AND journal the change with its reasoning.

## How to write an entry (every session that does real work)

Create `docs/journal/YYYY-MM-DD-short-slug.md`, add a row to the index below, and use this template:

```markdown
# YYYY-MM-DD · Session title

**Focus:** one line.

## What we did
- Bullets of the main work (files touched, features, tests).

## Decisions
- **Decision:** what was decided. *Why:* the reasoning. (One per line — greppable.)

## Bugs & fixes
- **Bug:** symptom + cause. **Fix:** what resolved it. (One pair per line — greppable.)

## State at end
- Tests / build / deploy status, anything uncommitted.

## Next / open threads
- What the next session should pick up.
```

**Conventions that make it searchable:** every decision line starts with `**Decision:**`, every bug with
`**Bug:**` and its solution with `**Fix:**`. Don't paraphrase these prefixes — they're the search keys.

## How to search the history

```bash
grep -ri "bug:" docs/journal          # every bug ever hit
grep -ri "fix:" docs/journal          # every solution
grep -ri "decision:" docs/journal     # every decision + why
grep -ri "cold start" docs/journal    # any topic, e.g. the Valiron cold-start issue
```

(Or in Claude Code, just ask — e.g. "search the journal for how we fixed the Playwright isolation bug.")

## Index (newest first)

| Date | File | Focus |
|---|---|---|
| 2026-06-22 | [2026-06-22-strategy-factcheck.md](journal/2026-06-22-strategy-factcheck.md) | 5-agent fact-check of GTM memo: corrected DICE numbers, confirmed World ID legal in NYC, fixed venue list (Billy Jones deceased), locked code-gate-first pilot plan |
| 2026-06-12 | [2026-06-12-pilot-system-build.md](journal/2026-06-12-pilot-system-build.md) | FULL pilot app: SQLite, auth, locked wizard, hold→capture payments, QR tickets, waitlist, door, Studio — 18 specs + screenshot walkthrough |
| 2026-06-12 | [2026-06-12-market-research-strategy.md](journal/2026-06-12-market-research-strategy.md) | Precedent research (Concert Kit!, DICE, Lyte) · potential scenarios · fan-pays-fee model · co-sponsor pilot approved |
| 2026-06-11 | [2026-06-11-mvp-planning.md](journal/2026-06-11-mvp-planning.md) | Teardown digest · docs system · validation plan + funding stance · fan-terminal/video-script catch-up |
| 2026-06-01 | [2026-06-01-hackathon-build.md](journal/2026-06-01-hackathon-build.md) | Full hackathon arc: Phases 0–4, x402 stretch, demo prep, Claude Design integration (9 tests green) |
