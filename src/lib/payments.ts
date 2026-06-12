/**
 * FaceValue — payments: authorize (hold) → capture | cancel → refund.
 *
 * WHY manual capture (researched 2026-06-12, Stripe docs):
 *  - A PaymentIntent with capture_method:'manual' places a HOLD (~7 days online;
 *    extended auth up to 30 days for eligible merchants).
 *  - CANCELING an uncaptured hold costs $0 — no processing fee ever charged.
 *  - REFUNDING a captured charge does NOT return Stripe's processing fees.
 *  ⇒ For drops/lotteries: authorize at claim, capture only on allocation, cancel
 *    losers/failures for free. "The agent's budget" = the authorization, never a
 *    custodied balance (no money-transmitter exposure).
 *
 * Modes:
 *  - mock  (default; no keys needed; fully testable end-to-end)
 *  - stripe (set PAYMENTS_MODE=stripe + STRIPE_SECRET_KEY; charges a saved card
 *            off_session with capture_method:'manual')
 */
import Stripe from "stripe";
import { db, now, uid, audit } from "./db";

export type PaymentRecord = {
  id: string;
  userId: string | null;
  dropId: string | null;
  amountCents: number;
  status: "authorized" | "captured" | "canceled" | "refunded" | "failed";
  provider: "mock" | "stripe";
  providerRef: string | null;
};

const MODE: "mock" | "stripe" =
  process.env.PAYMENTS_MODE === "stripe" && process.env.STRIPE_SECRET_KEY ? "stripe" : "mock";

let stripeClient: Stripe | null = null;
function stripe(): Stripe {
  if (!stripeClient) stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  return stripeClient;
}

export function paymentsMode() {
  return MODE;
}

function record(p: Omit<PaymentRecord, "id">): PaymentRecord {
  const id = uid();
  db()
    .prepare(
      `INSERT INTO payments (id, userId, dropId, amountCents, status, provider, providerRef, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(id, p.userId, p.dropId, p.amountCents, p.status, p.provider, p.providerRef, now(), now());
  return { id, ...p };
}

function setStatus(id: string, status: PaymentRecord["status"]) {
  db().prepare("UPDATE payments SET status = ?, updatedAt = ? WHERE id = ?").run(status, now(), id);
}

export function getPayment(id: string): PaymentRecord | undefined {
  return db().prepare("SELECT * FROM payments WHERE id = ?").get(id) as PaymentRecord | undefined;
}

/**
 * Place a hold for amountCents. Requires the user to have a payment method on file
 * (the onboarding wizard guarantees this). Returns a payment record in 'authorized'.
 */
export async function authorizePayment(params: {
  userId: string;
  dropId: string;
  amountCents: number;
  paymentMethodRef: string | null;
  stripeCustomerId?: string | null;
  description?: string;
}): Promise<{ ok: true; payment: PaymentRecord } | { ok: false; error: string }> {
  if (!params.paymentMethodRef) return { ok: false, error: "NO_PAYMENT_METHOD" };

  if (MODE === "mock") {
    // Simulated card-network behavior: a special ref can simulate a decline.
    if (params.paymentMethodRef === "mock_card_declined")
      return { ok: false, error: "CARD_DECLINED" };
    const payment = record({
      userId: params.userId,
      dropId: params.dropId,
      amountCents: params.amountCents,
      status: "authorized",
      provider: "mock",
      providerRef: `mock_pi_${uid().slice(0, 8)}`,
    });
    audit("payment.authorized", {
      userId: params.userId,
      dropId: params.dropId,
      detail: `${payment.id} $${(params.amountCents / 100).toFixed(2)} (mock hold)`,
    });
    return { ok: true, payment };
  }

  try {
    const pi = await stripe().paymentIntents.create({
      amount: params.amountCents,
      currency: "usd",
      customer: params.stripeCustomerId || undefined,
      payment_method: params.paymentMethodRef,
      off_session: true,
      confirm: true,
      capture_method: "manual", // the hold — capture later, cancel free
      description: params.description,
    });
    if (pi.status !== "requires_capture") {
      return { ok: false, error: `UNEXPECTED_STATUS_${pi.status}` };
    }
    const payment = record({
      userId: params.userId,
      dropId: params.dropId,
      amountCents: params.amountCents,
      status: "authorized",
      provider: "stripe",
      providerRef: pi.id,
    });
    audit("payment.authorized", { userId: params.userId, dropId: params.dropId, detail: pi.id });
    return { ok: true, payment };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "STRIPE_ERROR" };
  }
}

/** Capture a previously-authorized hold (money actually moves now). */
export async function capturePayment(paymentId: string): Promise<{ ok: boolean; error?: string }> {
  const p = getPayment(paymentId);
  if (!p || p.status !== "authorized") return { ok: false, error: "NOT_AUTHORIZED" };
  if (p.provider === "stripe") {
    try {
      await stripe().paymentIntents.capture(p.providerRef as string);
    } catch (e) {
      setStatus(paymentId, "failed");
      return { ok: false, error: e instanceof Error ? e.message : "STRIPE_ERROR" };
    }
  }
  setStatus(paymentId, "captured");
  audit("payment.captured", { userId: p.userId, dropId: p.dropId, detail: paymentId });
  return { ok: true };
}

/** Cancel an uncaptured hold — costs nothing, fan never charged. */
export async function cancelPayment(paymentId: string): Promise<{ ok: boolean; error?: string }> {
  const p = getPayment(paymentId);
  if (!p || p.status !== "authorized") return { ok: false, error: "NOT_AUTHORIZED" };
  if (p.provider === "stripe") {
    try {
      await stripe().paymentIntents.cancel(p.providerRef as string);
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "STRIPE_ERROR" };
    }
  }
  setStatus(paymentId, "canceled");
  audit("payment.canceled", { userId: p.userId, dropId: p.dropId, detail: `${paymentId} (hold released, $0 cost)` });
  return { ok: true };
}

/** Refund a captured charge (processing fees are NOT returned — last resort). */
export async function refundPayment(paymentId: string): Promise<{ ok: boolean; error?: string }> {
  const p = getPayment(paymentId);
  if (!p || p.status !== "captured") return { ok: false, error: "NOT_CAPTURED" };
  if (p.provider === "stripe") {
    try {
      await stripe().refunds.create({ payment_intent: p.providerRef as string });
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "STRIPE_ERROR" };
    }
  }
  setStatus(paymentId, "refunded");
  audit("payment.refunded", { userId: p.userId, dropId: p.dropId, detail: paymentId });
  return { ok: true };
}
