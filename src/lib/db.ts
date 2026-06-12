/**
 * FaceValue — SQLite persistence layer (pilot).
 *
 * better-sqlite3 (synchronous, transaction-safe) with a file DB under /data.
 * Single source of truth for BOTH the legacy demo routes (store.ts re-implemented
 * on top of this) and the real pilot system (auth, tickets, payments, waitlist).
 */
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { mkdirSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = process.env.FV_DB_PATH || path.join(DB_DIR, "facevalue.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'fan',
  nullifierHash TEXT UNIQUE,
  verifiedAt INTEGER,
  paymentMethodRef TEXT,
  stripeCustomerId TEXT,
  createdAt INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  expiresAt INTEGER NOT NULL,
  createdAt INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS drops (
  id TEXT PRIMARY KEY,
  vendorId TEXT,
  artist TEXT NOT NULL,
  event TEXT NOT NULL,
  venue TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  opensAt TEXT,
  faceValueCents INTEGER NOT NULL,
  feeCents INTEGER NOT NULL DEFAULT 100,
  totalInventory INTEGER NOT NULL,
  remaining INTEGER NOT NULL,
  maxPerHuman INTEGER NOT NULL DEFAULT 1,
  mode TEXT NOT NULL DEFAULT 'full',
  status TEXT NOT NULL DEFAULT 'live',
  createdAt INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  dropId TEXT NOT NULL,
  userId TEXT,
  nullifierHash TEXT NOT NULL,
  priceCents INTEGER NOT NULL,
  feeCents INTEGER NOT NULL,
  status TEXT NOT NULL,            -- held | confirmed | returned | checked_in | canceled
  paymentId TEXT,
  qrToken TEXT UNIQUE,
  createdAt INTEGER NOT NULL,
  checkedInAt INTEGER
);
CREATE TABLE IF NOT EXISTS legacy_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dropId TEXT NOT NULL,
  humanId TEXT NOT NULL,
  agentId TEXT NOT NULL,
  ticketId TEXT NOT NULL,
  at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS waitlist (
  id TEXT PRIMARY KEY,
  dropId TEXT NOT NULL,
  userId TEXT NOT NULL,
  position INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting',   -- waiting | offered | claimed
  createdAt INTEGER NOT NULL,
  UNIQUE(dropId, userId)
);
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  userId TEXT,
  dropId TEXT,
  amountCents INTEGER NOT NULL,
  status TEXT NOT NULL,            -- authorized | captured | canceled | refunded | failed
  provider TEXT NOT NULL,          -- mock | stripe
  providerRef TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  type TEXT NOT NULL,
  userId TEXT,
  dropId TEXT,
  ticketId TEXT,
  detail TEXT
);
CREATE INDEX IF NOT EXISTS idx_tickets_drop ON tickets(dropId);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(userId);
CREATE INDEX IF NOT EXISTS idx_tickets_null ON tickets(nullifierHash);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(userId);
CREATE INDEX IF NOT EXISTS idx_waitlist_drop ON waitlist(dropId);
CREATE INDEX IF NOT EXISTS idx_audit_ts ON audit(ts);
`;

function open(): Database.Database {
  mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const d = new Database(DB_PATH);
  d.pragma("journal_mode = WAL");
  d.pragma("foreign_keys = ON");
  d.exec(SCHEMA);
  seedIfEmpty(d);
  return d;
}

// Survive Next dev hot-reloads within a process.
const g = globalThis as unknown as { __fvdb?: Database.Database };
export function db(): Database.Database {
  if (!g.__fvdb) g.__fvdb = open();
  return g.__fvdb;
}

export const now = () => Date.now();
export const uid = () => randomUUID();

/* ---------------- seed ---------------- */

export function seedIfEmpty(d: Database.Database) {
  const drops = d.prepare("SELECT COUNT(*) c FROM drops").get() as { c: number };
  if (drops.c === 0) seedDrops(d);
  const vendors = d
    .prepare("SELECT COUNT(*) c FROM users WHERE role IN ('vendor','admin')")
    .get() as { c: number };
  if (vendors.c === 0) seedUsers(d);
}

function seedDrops(d: Database.Database) {
  const ins = d.prepare(
    `INSERT INTO drops (id, vendorId, artist, event, venue, date, opensAt, faceValueCents, feeCents,
      totalInventory, remaining, maxPerHuman, mode, status, createdAt)
     VALUES (@id, @vendorId, @artist, @event, @venue, @date, @opensAt, @faceValueCents, @feeCents,
      @totalInventory, @remaining, @maxPerHuman, @mode, @status, @createdAt)`
  );
  // Legacy demo drop — keeps the hackathon routes/tests green (5 @ $60).
  ins.run({
    id: "midnight-echo-nyc",
    vendorId: null,
    artist: "Midnight Echo",
    event: "Midnight Echo — Live at The Forum",
    venue: "The Forum, NYC",
    date: "2026-09-12",
    opensAt: null,
    faceValueCents: 6000,
    feeCents: 100,
    totalInventory: 5,
    remaining: 5,
    maxPerHuman: 1,
    mode: "full",
    status: "live",
    createdAt: now() + 2, // newest seed → stays drops[0] for the legacy demo pages/tests
  });
  // Pilot party drop — live now (150 @ $20 + $1 fee).
  ins.run({
    id: "fv-humans-only-001",
    vendorId: "vendor-seed",
    artist: "FaceValue",
    event: "FaceValue: Humans Only — Vol. 001",
    venue: "TBA Warehouse, Brooklyn",
    date: "2026-08-22",
    opensAt: null,
    faceValueCents: 2000,
    feeCents: 100,
    totalInventory: 150,
    remaining: 150,
    maxPerHuman: 1,
    mode: "full",
    status: "live",
    createdAt: now() + 1,
  });
  // Pre-drop demo — opens in the future (countdown state).
  ins.run({
    id: "fv-humans-only-002",
    vendorId: "vendor-seed",
    artist: "FaceValue",
    event: "FaceValue: Humans Only — Vol. 002",
    venue: "TBA Loft, Ridgewood",
    date: "2026-10-03",
    opensAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    faceValueCents: 2500,
    feeCents: 100,
    totalInventory: 120,
    remaining: 120,
    maxPerHuman: 2,
    mode: "full",
    status: "live",
    createdAt: now(),
  });
}

function seedUsers(d: Database.Database) {
  const ins = d.prepare(
    `INSERT OR IGNORE INTO users (id, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)`
  );
  ins.run(
    "vendor-seed",
    "vendor@facevalue.store",
    bcrypt.hashSync(process.env.FV_VENDOR_PASSWORD || "pilot-vendor-2026", 10),
    "vendor",
    now()
  );
  ins.run(
    "admin-seed",
    "admin@facevalue.store",
    bcrypt.hashSync(process.env.FV_ADMIN_PASSWORD || "pilot-admin-2026", 10),
    "admin",
    now()
  );
}

/** Dev/test only — wipe everything and reseed to a known state. */
export function resetDb() {
  const d = db();
  const wipe = d.transaction(() => {
    d.exec(
      "DELETE FROM tickets; DELETE FROM legacy_purchases; DELETE FROM waitlist; DELETE FROM payments; DELETE FROM audit; DELETE FROM sessions; DELETE FROM users; DELETE FROM drops;"
    );
    seedDrops(d);
    seedUsers(d);
  });
  wipe();
}

export function audit(
  type: string,
  fields: { userId?: string | null; dropId?: string | null; ticketId?: string | null; detail?: string }
) {
  db()
    .prepare("INSERT INTO audit (ts, type, userId, dropId, ticketId, detail) VALUES (?, ?, ?, ?, ?, ?)")
    .run(now(), type, fields.userId ?? null, fields.dropId ?? null, fields.ticketId ?? null, fields.detail ?? null);
}
