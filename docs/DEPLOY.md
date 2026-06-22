# Deploying the FaceValue pilot (Railway + SQLite volume)

The pilot runs on **SQLite (`better-sqlite3`)**, so it needs a host with a **persistent disk**.
Railway gives us that with near-zero config and keeps the codebase exactly as built (all 20 Playwright
specs stay valid). This is the right choice for pilot scale; a Postgres migration is a later, post-validation step.

> **Why not Vercel?** Vercel's serverless filesystem is ephemeral — the SQLite file would be wiped on
> every cold start. Moving to Vercel means rewriting the whole data layer to async Turso/Postgres first.
> Don't do that until the pilot has earned it.

---

## One-time setup (~15 min)

### 1. Create the project
1. Go to **railway.app** → sign in with GitHub.
2. **New Project → Deploy from GitHub repo →** pick `Dphantom-x/facevalue.store`.
3. Railway auto-detects Next.js (Nixpacks): it runs `npm ci` → `npm run build` → `npm start`.
   `better-sqlite3` ships prebuilt Linux binaries, so no native compile step is needed.

### 2. Add the persistent volume (this is the important part)
1. In the service → **Settings → Volumes → New Volume**.
2. Mount path: **`/data`**.
3. This disk survives redeploys — it's where the SQLite DB lives.

### 3. Set environment variables
In the service → **Variables**, add (see `.env.example` for the full list):

| Variable | Value | Why |
|---|---|---|
| `FV_DB_PATH` | `/data/facevalue.db` | points the DB at the volume (without this, data is lost on redeploy) |
| `QR_SECRET` | a long random string | signs ticket QRs — set once, keep stable |
| `WORLDID_SIM_SECRET` | a random string | salts the simulated nullifier |
| `FV_VENDOR_PASSWORD` | a strong password | **override the public default** |
| `FV_ADMIN_PASSWORD` | a strong password | **override the public default** |
| `FV_VENDOR_CODE` | your vendor signup code | gate for new vendor accounts |
| `PAYMENTS_MODE` | `mock` | no real money until Stripe go-live |

> ⚠️ The seeded vendor/admin passwords default to values published in `CLAUDE.md`. **You must set
> `FV_VENDOR_PASSWORD` and `FV_ADMIN_PASSWORD`** before sharing the URL, or anyone can log into Studio/admin.
> Likewise set `QR_SECRET`/`WORLDID_SIM_SECRET` to real random values — the dev defaults are public.

### 4. Deploy + smoke-test
1. Railway builds and gives you a URL like `facevalue-store.up.railway.app`.
2. Visit `/drops` — the three seeded drops should render.
3. Log into `/studio` with `vendor@facevalue.store` + your `FV_VENDOR_PASSWORD`.
4. Create a drop with an **Access code** → copy the invite link → open it in a private window →
   confirm the gate card asks for the code, and the right code unlocks it.

### 5. Point the domain (optional, when ready)
- Railway service → **Settings → Networking → Custom Domain** → add `facevalue.store`
  (or a `pilot.` subdomain) and follow the CNAME instructions at your registrar.

---

## After the pilot validates — go-live checklist (not pilot-1 scope)

- **Real World ID** — register a World ID app (device-level = non-biometric, legal in NYC), set
  `WORLDID_REAL=1` + app creds. The IDKit wiring is the next code task (currently `/api/world-id/verify`
  returns 501 when `WORLDID_REAL=1`).
- **Stripe** — set `PAYMENTS_MODE=stripe` + keys; finish the client SetupIntent/Elements card flow and
  Stripe Connect **direct charges** (`application_fee_amount`) for zero-custody payouts.
- **Backups** — schedule a periodic copy of `/data/facevalue.db` off the volume.
- **Postgres migration** — when we outgrow a single instance, swap `better-sqlite3` → Postgres/Turso
  (async); the 20 specs are the safety net.

---

## Resetting pilot data
`POST /api/dev/reset` wipes and reseeds the whole DB (including users) — handy locally to start the
funnel numbers clean. It **already returns 403 when `NODE_ENV=production`** (Railway sets this), so it's
inert on the live deploy; no extra hardening needed. To reseed the deployed DB intentionally, delete the
volume's `facevalue.db` and redeploy.
