/**
 * FaceValue — in-memory drop + purchase store (MVP).
 *
 * Holds ticket drops and records purchases, enforcing one-per-verified-human.
 * State lives on globalThis so it survives Next dev hot-reloads within a process.
 * (No DB needed for the hackathon MVP.)
 */

export type ReleaseMode = "full" | "hybrid" | "lottery";

export type Drop = {
  id: string;
  artist: string;
  event: string;
  venue: string;
  date: string; // ISO date
  faceValue: number; // USD
  totalInventory: number;
  remaining: number;
  maxPerHuman: number;
  mode: ReleaseMode;
};

export type Purchase = {
  dropId: string;
  /** Verified-human key. World ID nullifier_hash later; agentId stand-in for now. */
  humanId: string;
  agentId: string;
  ticketId: string;
  at: number;
};

function seedDrops(): Drop[] {
  return [
    {
      id: "midnight-echo-nyc",
      artist: "Midnight Echo",
      event: "Midnight Echo — Live at The Forum",
      venue: "The Forum, NYC",
      date: "2026-09-12",
      faceValue: 60,
      totalInventory: 5,
      remaining: 5,
      maxPerHuman: 1,
      mode: "full",
    },
  ];
}

type StoreShape = { drops: Drop[]; purchases: Purchase[] };
const g = globalThis as unknown as { __fvStore?: StoreShape };
if (!g.__fvStore) g.__fvStore = { drops: seedDrops(), purchases: [] };
const store = g.__fvStore;

export function listDrops(): Drop[] {
  return store.drops;
}

export function getDrop(id: string): Drop | undefined {
  return store.drops.find((d) => d.id === id);
}

/** Test/demo helper — reseed to a known state. */
export function resetStore(): void {
  store.drops = seedDrops();
  store.purchases = [];
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
}): Drop {
  let id = slugify(input.event) || "drop";
  if (store.drops.some((d) => d.id === id)) id = `${id}-${store.drops.length + 1}`;
  const drop: Drop = { id, ...input, remaining: input.totalInventory };
  store.drops.unshift(drop);
  return drop;
}

export function purchasesByHuman(dropId: string, humanId: string): number {
  return store.purchases.filter((p) => p.dropId === dropId && p.humanId === humanId)
    .length;
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
  const drop = getDrop(args.dropId);
  if (!drop) return { ok: false, code: "NOT_FOUND", message: "Drop not found" };

  if (purchasesByHuman(drop.id, args.humanId) >= drop.maxPerHuman) {
    return {
      ok: false,
      code: "LIMIT_REACHED",
      message: "One ticket per verified human — you already have yours.",
      remaining: drop.remaining,
    };
  }

  if (drop.remaining <= 0) {
    return { ok: false, code: "SOLD_OUT", message: "This drop is sold out.", remaining: 0 };
  }

  drop.remaining -= 1;
  const ticketId = `${drop.id}-${drop.totalInventory - drop.remaining}`;
  store.purchases.push({
    dropId: drop.id,
    humanId: args.humanId,
    agentId: args.agentId,
    ticketId,
    at: Date.now(),
  });
  return { ok: true, ticketId, remaining: drop.remaining };
}
