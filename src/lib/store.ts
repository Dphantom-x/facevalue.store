/**
 * FaceValue — LEGACY store API, now backed by SQLite (single source of truth).
 *
 * The hackathon routes/pages (/api/drop/purchase, /api/vendor/drops, /fan,
 * /simulation, x402) keep their exact contracts; under the hood everything
 * reads/writes the same `drops` table the real pilot system uses.
 */
import { db, now, uid, resetDb } from "./db";
import { getDropRow, listDropRows, dropPublic } from "./tickets";

export type ReleaseMode = "full" | "hybrid" | "lottery";

export type Drop = {
  id: string;
  artist: string;
  event: string;
  venue: string;
  date: string;
  faceValue: number; // dollars (legacy shape)
  totalInventory: number;
  remaining: number;
  maxPerHuman: number;
  mode: ReleaseMode;
  opensAt?: string | null;
};

function toLegacy(d: ReturnType<typeof dropPublic>): Drop {
  return {
    id: d.id,
    artist: d.artist,
    event: d.event,
    venue: d.venue,
    date: d.date,
    faceValue: d.faceValue,
    totalInventory: d.totalInventory,
    remaining: d.remaining,
    maxPerHuman: d.maxPerHuman,
    mode: d.mode as ReleaseMode,
    opensAt: d.opensAt,
  };
}

export function listDrops(): Drop[] {
  return listDropRows().map((r) => toLegacy(dropPublic(r)));
}

export function getDrop(id: string): Drop | undefined {
  const row = getDropRow(id);
  return row ? toLegacy(dropPublic(row)) : undefined;
}

/** Test/demo helper — wipe + reseed the WHOLE database to a known state. */
export function resetStore(): void {
  resetDb();
}

export function purchasesByHuman(dropId: string, humanId: string): number {
  const r = db()
    .prepare("SELECT COUNT(*) c FROM legacy_purchases WHERE dropId = ? AND humanId = ?")
    .get(dropId, humanId) as { c: number };
  return r.c;
}

export type PurchaseOutcome =
  | { ok: true; ticketId: string; remaining: number }
  | {
      ok: false;
      code: "SOLD_OUT" | "LIMIT_REACHED" | "NOT_FOUND";
      message: string;
      remaining?: number;
    };

export function recordPurchase(args: {
  dropId: string;
  humanId: string;
  agentId: string;
}): PurchaseOutcome {
  const d = db();
  let outcome: PurchaseOutcome = { ok: false, code: "NOT_FOUND", message: "Drop not found" };
  const tx = d.transaction(() => {
    const drop = d
      .prepare("SELECT id, totalInventory, remaining, maxPerHuman FROM drops WHERE id = ?")
      .get(args.dropId) as
      | { id: string; totalInventory: number; remaining: number; maxPerHuman: number }
      | undefined;
    if (!drop) {
      outcome = { ok: false, code: "NOT_FOUND", message: "Drop not found" };
      return;
    }
    const mine = d
      .prepare("SELECT COUNT(*) c FROM legacy_purchases WHERE dropId = ? AND humanId = ?")
      .get(args.dropId, args.humanId) as { c: number };
    if (mine.c >= drop.maxPerHuman) {
      outcome = {
        ok: false,
        code: "LIMIT_REACHED",
        message: "One ticket per verified human — you already have yours.",
        remaining: drop.remaining,
      };
      return;
    }
    if (drop.remaining <= 0) {
      outcome = { ok: false, code: "SOLD_OUT", message: "This drop is sold out.", remaining: 0 };
      return;
    }
    d.prepare("UPDATE drops SET remaining = remaining - 1 WHERE id = ?").run(drop.id);
    const seq = drop.totalInventory - drop.remaining + 1;
    const ticketId = `${drop.id}-${seq}`;
    d.prepare(
      "INSERT INTO legacy_purchases (dropId, humanId, agentId, ticketId, at) VALUES (?, ?, ?, ?, ?)"
    ).run(drop.id, args.humanId, args.agentId, ticketId, now());
    outcome = { ok: true, ticketId, remaining: drop.remaining - 1 };
  });
  tx();
  return outcome;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Vendor action — create + "launch" a new drop (becomes the newest/active drop). */
export function createDrop(input: {
  artist: string;
  event: string;
  venue: string;
  date: string;
  faceValue: number;
  totalInventory: number;
  maxPerHuman: number;
  mode: ReleaseMode;
  opensAt?: string | null;
  vendorId?: string | null;
  feeCents?: number;
  accessCode?: string | null;
}): Drop {
  const d = db();
  let id = slugify(input.event) || "drop";
  const clash = d.prepare("SELECT 1 FROM drops WHERE id = ?").get(id);
  if (clash) id = `${id}-${uid().slice(0, 4)}`;
  const accessCode = input.accessCode?.trim() ? input.accessCode.trim() : null;
  d.prepare(
    `INSERT INTO drops (id, vendorId, artist, event, venue, date, opensAt, faceValueCents, feeCents,
       totalInventory, remaining, maxPerHuman, mode, status, accessCode, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'live', ?, ?)`
  ).run(
    id,
    input.vendorId ?? null,
    input.artist,
    input.event,
    input.venue || "",
    input.date || "",
    input.opensAt ?? null,
    Math.round((Number(input.faceValue) || 0) * 100),
    input.feeCents ?? 100,
    Number(input.totalInventory) || 0,
    Number(input.totalInventory) || 0,
    Number(input.maxPerHuman) || 1,
    input.mode || "full",
    accessCode,
    now()
  );
  return getDrop(id)!;
}
