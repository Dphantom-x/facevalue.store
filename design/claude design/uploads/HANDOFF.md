# Claude Design — Handoff & Integration Guide

The FaceValue **engine is built and tested** (6 Playwright tests green, production build clean). The
app works end-to-end right now with plain functional UI. This folder is everything you need to
redesign the UI in Claude Design and have it drop back onto the working engine.

## What to upload to Claude Design
1. `design/BUSINESS_CONTEXT.md` — the product brief (what/why/feeling).
2. `design/BRAND.md` — colors, type, motifs, per-screen feeling.
3. `design/SCREENS.md` — the screens + the **data/testid contract** (this is what keeps integration clean).
4. `design/screenshots/*.png` — the current working screens (`01-home`, `02-simulation`, `03-fan`,
   `04-vendor`) as "redesign these" reference.
5. (Optional) the current `src/app/*/page.tsx` files for structural reference.

## How to prompt Claude Design (suggested)
> "Redesign these four screens for **FaceValue** (see BUSINESS_CONTEXT + BRAND). Target Next.js 15 +
> React 19 + Tailwind v4. Keep every `data-testid` attribute and the exact data field names from
> SCREENS.md — restyle and restructure everything else freely. Return React + Tailwind (`.tsx`)
> components, one per route (home, simulation, fan, vendor), plus a `globals.css` with the brand tokens."

## The integration contract (so it drops in cleanly)
- **Keep the `data-testid` attributes** listed in SCREENS.md, and the behaviors tied to them
  (e.g. buy button disabled until verified; approved copy contains "face value" + "non-transferable").
- **Keep the API calls and field names** exactly (`/api/drops`, `/api/trust-check`,
  `/api/drop/purchase`, `/api/world-id/verify`, `/api/vendor/drops`).
- Tailwind v4 tokens go in `src/app/globals.css` via `@theme inline` (see the existing file).
- Client pages need `"use client"` (they use hooks + fetch).

## What to send me back
Drop the Claude Design **zip into the project folder** (like the reference one). Tell me it's there,
and I will:
1. Port the returned components onto the live routes (wire the existing state/fetch logic into the new markup).
2. Re-run the full Playwright suite (`npm test`) — if a testid moved, I'll reconnect it.
3. Set up the brand tokens in `globals.css`, then we polish, deploy to Vercel, and record the demo.

## Note
The UI redesign is **cosmetic** — the demo already runs and passes tests today. So there's no risk:
worst case we ship the functional version. The redesign just makes it shine for the judges.
