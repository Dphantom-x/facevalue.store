/**
 * FaceValue — ticketing domain: claim (hold → allocate → capture), returns,
 * waitlist, door check-in, stats. The heart of the pilot.
 *
 * Money flow per claim:
 *   1) AUTHORIZE a hold for face value + fee (no money moves; canceling is free)
 *   2) atomically allocate inventory + create the ticket (SQLite transaction)
 *   3) CAPTURE the hold (money moves) and bind the QR to the identity
 *   On any failure after the hold → CANCEL the hold ($0 cost to the fan and us).
 */
import { createHmac } from "crypto";
import { db, now, uid, audit } from "./db";
import type { User } from "./auth";
import {
  authorizePayment,
  capturePayment,
  cancelPayment,
  refundPayment,
  type PaymentRecord,
} from "./payments";

const QR_SECRET = process.env.QR_SECRET || "fv-dev-qr-secret";

/* ---------------- types ---------------- */

export type DropRow = {
  id: string;
  vendorId: string | null;
  artist: string;
  event: string;
  venue: string;
  date: string;
  opensAt: string | null;
  faceValueCents: number;
  feeCents: number;
  totalInventory: number;
  remaining: number;
  maxPerHuman: number;
  mode: string;
  status: string;
  accessCode: string | null;
  createdAt: number;
};

export type TicketRow = {
  id: string;
  dropId: string;
  userId: string | null;
  nullifierHash: string;
  priceCents: number;
  feeCents: number;
  status: "held" | "confirmed" | "returned" | "checked_in" | "canceled";
  paymentId: string | null;
  qrToken: string | null;
  createdAt: number;
  checkedInAt: number | null;
};

export type ClaimError =
  | "NEED_VERIFY"
  | "NO_PAYMENT_METHOD"
  | "DROP_NOT_FOUND"
  | "DROP_NOT_LIVE"
  | "NOT_OPEN"
  | "NEED_CODE"
  | "LIMIT_REACHED"
  | "SOLD_OUT"
  | "CARD_DECLINED"
  | "PAYMENT_FAILED";

/* ---------------- drops ---------------- */

export function getDropRow(id: string): DropRow | undefined {
  return db().prepare("SELECT * FROM drops WHERE id = ?").get(id) as DropRow | undefined;
}

export function listDropRows(): DropRow[] {
  return db()
    .prepare("SELECT * FROM drops ORDER BY createdAt DESC, id ASC")
    .all() as DropRow[];
}

/** Tickets freed by returns are RESERVED for outstanding waitlist offers. */
export function offeredCount(dropId: string): number {
  const r = db()
    .prepare("SELECT COUNT(*) c FROM waitlist WHERE dropId = ? AND status = 'offered'")
    .get(dropId) as { c: number };
  return r.c;
}

/** Public shape (keeps the legacy dollar fields the old pages/tests expect). */
export function dropPublic(d: DropRow) {
  const reserved = offeredCount(d.id);
  return {
    id: d.id,
    artist: d.artist,
    event: d.event,
    venue: d.venue,
    date: d.date,
    opensAt: d.opensAt,
    faceValue: d.faceValueCents / 100,
    feeCents: d.feeCents,
    totalInventory: d.totalInventory,
    remaining: d.remaining,
    /** What a NON-waitlisted fan can actually claim right now. */
    available: Math.max(0, d.remaining - reserved),
    maxPerHuman: d.maxPerHuman,
    mode: d.mode,
    status: d.status,
    /** Invite-only carve-out? (the code itself is never exposed publicly) */
    gated: !!d.accessCode,
  };
}

/** Constant-time-ish access-code check. Open drops (no code) always pass. */
export function dropCodeOk(d: DropRow, code: string | null | undefined): boolean {
  if (!d.accessCode) return true;
  return (code ?? "").trim().toLowerCase() === d.accessCode.trim().toLowerCase();
}

export function isOpen(d: DropRow): boolean {
  if (d.status !== "live") return false;
  if (d.opensAt && new Date(d.opensAt).getTime() > now()) return false;
  return true;
}

/* ---------------- QR tokens ---------------- */

export function qrTokenFor(ticketId: string): string {
  const sig = createHmac("sha256", QR_SECRET).update(ticketId).digest("hex").slice(0, 16);
  return `${ticketId}.${sig}`;
}

export function ticketIdFromQr(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const id = token.slice(0, dot);
  return qrTokenFor(id) === token ? id : null;
}

/* ---------------- claim ---------------- */

export async function claimTicket(params: {
  user: User;
  dropId: string;
  code?: string | null;
}): Promise<
  | { ok: true; ticket: TicketRow; payment: PaymentRecord; viaWaitlist: boolean }
  | { ok: false; error: ClaimError; message: string }
> {
  const { user, dropId, code } = params;
  const d = db();

  if (!user.nullifierHash)
    return { ok: false, error: "NEED_VERIFY", message: "Verify you're one human first." };
  if (!user.paymentMethodRef)
    return { ok: false, error: "NO_PAYMENT_METHOD", message: "Add a payment method first." };

  const drop = getDropRow(dropId);
  if (!drop) return { ok: false, error: "DROP_NOT_FOUND", message: "Drop not found." };
  if (drop.status !== "live")
    return { ok: false, error: "DROP_NOT_LIVE", message: "This drop is not live." };
  if (!dropCodeOk(drop, code))
    return { ok: false, error: "NEED_CODE", message: "This drop is invite-only — an access code is required." };
  if (drop.opensAt && new Date(drop.opensAt).getTime() > now())
    return { ok: false, error: "NOT_OPEN", message: "This drop hasn't opened yet." };

  // Per-human limit (the whole point: one human, maxPerHuman tickets).
  const held = d
    .prepare(
      "SELECT COUNT(*) c FROM tickets WHERE dropId = ? AND nullifierHash = ? AND status IN ('held','confirmed','checked_in')"
    )
    .get(dropId, user.nullifierHash) as { c: number };
  if (held.c >= drop.maxPerHuman)
    return {
      ok: false,
      error: "LIMIT_REACHED",
      message: "One ticket per verified human — you already have yours.",
    };

  // Sold out? Tickets freed by returns are reserved for waitlist OFFERS —
  // a non-offered fan can only claim from unreserved availability.
  const offer = d
    .prepare("SELECT id FROM waitlist WHERE dropId = ? AND userId = ? AND status = 'offered'")
    .get(dropId, user.id) as { id: string } | undefined;
  const reserved = offer ? 0 : offeredCount(dropId);
  if (drop.remaining - reserved <= 0)
    return { ok: false, error: "SOLD_OUT", message: "This drop is sold out." };

  // 1) HOLD the money first (face value + fair-access fee). Canceling is free.
  const amountCents = drop.faceValueCents + drop.feeCents;
  const auth = await authorizePayment({
    userId: user.id,
    dropId,
    amountCents,
    paymentMethodRef: user.paymentMethodRef,
    stripeCustomerId: user.stripeCustomerId,
    description: `FaceValue · ${drop.event} · 1 ticket at face value`,
  });
  if (!auth.ok) {
    const error = auth.error === "CARD_DECLINED" ? "CARD_DECLINED" : "PAYMENT_FAILED";
    return { ok: false, error, message: "Your card was declined — no money was taken." };
  }

  // 2) Atomically allocate inventory + create the ticket.
  const ticketId = uid();
  let viaWaitlist = false;
  const allocate = d.transaction(() => {
    const fresh = d.prepare("SELECT remaining FROM drops WHERE id = ?").get(dropId) as {
      remaining: number;
    };
    const freshReserved = offer ? 0 : offeredCount(dropId);
    if (fresh.remaining - freshReserved <= 0) throw new Error("SOLD_OUT");
    d.prepare("UPDATE drops SET remaining = remaining - 1 WHERE id = ?").run(dropId);
    d.prepare(
      `INSERT INTO tickets (id, dropId, userId, nullifierHash, priceCents, feeCents, status, paymentId, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, 'held', ?, ?)`
    ).run(ticketId, dropId, user.id, user.nullifierHash, drop.faceValueCents, drop.feeCents, auth.payment.id, now());
    if (offer) {
      d.prepare("UPDATE waitlist SET status = 'claimed' WHERE id = ?").run(offer.id);
      viaWaitlist = true;
    }
  });
  try {
    allocate();
  } catch {
    await cancelPayment(auth.payment.id); // hold released — $0 cost
    return { ok: false, error: "SOLD_OUT", message: "This drop is sold out." };
  }

  // 3) CAPTURE — money moves only now that the ticket is truly allocated.
  const cap = await capturePayment(auth.payment.id);
  if (!cap.ok) {
    const revert = d.transaction(() => {
      d.prepare("UPDATE drops SET remaining = remaining + 1 WHERE id = ?").run(dropId);
      d.prepare("UPDATE tickets SET status = 'canceled' WHERE id = ?").run(ticketId);
    });
    revert();
    await cancelPayment(auth.payment.id);
    return { ok: false, error: "PAYMENT_FAILED", message: "Payment failed — no money was taken." };
  }

  const qr = qrTokenFor(ticketId);
  d.prepare("UPDATE tickets SET status = 'confirmed', qrToken = ? WHERE id = ?").run(qr, ticketId);
  audit("ticket.confirmed", {
    userId: user.id,
    dropId,
    ticketId,
    detail: `$${(amountCents / 100).toFixed(2)} captured · bound to ${user.nullifierHash.slice(0, 12)}…`,
  });

  const ticket = d.prepare("SELECT * FROM tickets WHERE id = ?").get(ticketId) as TicketRow;
  return { ok: true, ticket, payment: auth.payment, viaWaitlist };
}

/* ---------------- my tickets / returns ---------------- */

export function listUserTickets(userId: string) {
  return db()
    .prepare(
      `SELECT t.*, d.event, d.venue, d.date, d.artist
       FROM tickets t JOIN drops d ON d.id = t.dropId
       WHERE t.userId = ? ORDER BY t.createdAt DESC`
    )
    .all(userId) as (TicketRow & { event: string; venue: string; date: string; artist: string })[];
}

export async function returnTicket(params: {
  user: User;
  ticketId: string;
}): Promise<{ ok: true; offeredUserId: string | null } | { ok: false; message: string }> {
  const d = db();
  const t = d
    .prepare("SELECT * FROM tickets WHERE id = ? AND userId = ?")
    .get(params.ticketId, params.user.id) as TicketRow | undefined;
  if (!t) return { ok: false, message: "Ticket not found." };
  if (t.status !== "confirmed")
    return { ok: false, message: `This ticket can't be returned (status: ${t.status}).` };

  const ret = d.transaction(() => {
    d.prepare("UPDATE tickets SET status = 'returned' WHERE id = ?").run(t.id);
    d.prepare("UPDATE drops SET remaining = remaining + 1 WHERE id = ?").run(t.dropId);
  });
  ret();
  if (t.paymentId) await refundPayment(t.paymentId); // captured → refund (fees lost; pilot policy)
  audit("ticket.returned", { userId: params.user.id, dropId: t.dropId, ticketId: t.id });

  // Offer the freed ticket to the head of the waitlist.
  const head = d
    .prepare(
      "SELECT id, userId FROM waitlist WHERE dropId = ? AND status = 'waiting' ORDER BY position ASC LIMIT 1"
    )
    .get(t.dropId) as { id: string; userId: string } | undefined;
  if (head) {
    d.prepare("UPDATE waitlist SET status = 'offered' WHERE id = ?").run(head.id);
    audit("waitlist.offered", { userId: head.userId, dropId: t.dropId });
    return { ok: true, offeredUserId: head.userId };
  }
  return { ok: true, offeredUserId: null };
}

/* ---------------- waitlist ---------------- */

export function joinWaitlist(params: {
  user: User;
  dropId: string;
}): { ok: true; position: number } | { ok: false; message: string } {
  const d = db();
  const drop = getDropRow(params.dropId);
  if (!drop) return { ok: false, message: "Drop not found." };
  if (drop.remaining - offeredCount(params.dropId) > 0)
    return { ok: false, message: "Drop isn't sold out — just claim a ticket." };
  const existing = d
    .prepare("SELECT position, status FROM waitlist WHERE dropId = ? AND userId = ?")
    .get(params.dropId, params.user.id) as { position: number; status: string } | undefined;
  if (existing) return { ok: true, position: existing.position };
  const count = d
    .prepare("SELECT COUNT(*) c FROM waitlist WHERE dropId = ?")
    .get(params.dropId) as { c: number };
  const position = count.c + 1;
  d.prepare(
    "INSERT INTO waitlist (id, dropId, userId, position, status, createdAt) VALUES (?, ?, ?, ?, 'waiting', ?)"
  ).run(uid(), params.dropId, params.user.id, position, now());
  audit("waitlist.joined", { userId: params.user.id, dropId: params.dropId, detail: `#${position}` });
  return { ok: true, position };
}

export function waitlistState(userId: string, dropId: string) {
  return db()
    .prepare("SELECT position, status FROM waitlist WHERE dropId = ? AND userId = ?")
    .get(dropId, userId) as { position: number; status: string } | undefined;
}

/* ---------------- door check-in ---------------- */

export function checkinByToken(params: {
  token: string;
  staffUserId: string;
}):
  | { ok: true; ticket: TicketRow & { event: string } }
  | { ok: false; code: "INVALID" | "ALREADY_USED" | "NOT_VALID_STATUS"; message: string } {
  const d = db();
  const ticketId = ticketIdFromQr(params.token.trim());
  if (!ticketId) return { ok: false, code: "INVALID", message: "Invalid or forged code." };
  const t = d
    .prepare(
      "SELECT t.*, d.event FROM tickets t JOIN drops d ON d.id = t.dropId WHERE t.id = ?"
    )
    .get(ticketId) as (TicketRow & { event: string }) | undefined;
  if (!t) return { ok: false, code: "INVALID", message: "Ticket not found." };
  if (t.status === "checked_in")
    return { ok: false, code: "ALREADY_USED", message: "Already checked in — duplicate scan." };
  if (t.status !== "confirmed")
    return { ok: false, code: "NOT_VALID_STATUS", message: `Ticket is ${t.status}.` };
  d.prepare("UPDATE tickets SET status = 'checked_in', checkedInAt = ? WHERE id = ?").run(now(), ticketId);
  audit("ticket.checked_in", { userId: params.staffUserId, dropId: t.dropId, ticketId });
  return { ok: true, ticket: { ...t, status: "checked_in" } };
}

/* ---------------- vendor stats ---------------- */

export function dropStats(dropId: string) {
  const d = db();
  const sold = d
    .prepare(
      "SELECT COUNT(*) c FROM tickets WHERE dropId = ? AND status IN ('confirmed','checked_in')"
    )
    .get(dropId) as { c: number };
  const checkedIn = d
    .prepare("SELECT COUNT(*) c FROM tickets WHERE dropId = ? AND status = 'checked_in'")
    .get(dropId) as { c: number };
  const revenue = d
    .prepare(
      "SELECT COALESCE(SUM(priceCents),0) s FROM tickets WHERE dropId = ? AND status IN ('confirmed','checked_in')"
    )
    .get(dropId) as { s: number };
  const fees = d
    .prepare(
      "SELECT COALESCE(SUM(feeCents),0) s FROM tickets WHERE dropId = ? AND status IN ('confirmed','checked_in')"
    )
    .get(dropId) as { s: number };
  const waiting = d
    .prepare("SELECT COUNT(*) c FROM waitlist WHERE dropId = ? AND status = 'waiting'")
    .get(dropId) as { c: number };
  return {
    sold: sold.c,
    checkedIn: checkedIn.c,
    revenueCents: revenue.s,
    feesCents: fees.s,
    waitlistCount: waiting.c,
  };
}

export function recentAudit(limit = 30) {
  return db()
    .prepare("SELECT * FROM audit ORDER BY id DESC LIMIT ?")
    .all(limit) as { id: number; ts: number; type: string; userId: string | null; dropId: string | null; ticketId: string | null; detail: string | null }[];
}
