"use client";

/**
 * Onboarding wizard — a locked overlay card that walks a new fan through:
 *   1) Account (signup/login) → 2) Verify personhood → 3) Payment method → Done.
 * The overlay cannot be dismissed until every step is complete (by design:
 * it "locks users into clicking whatever they need").
 */
import React, { useEffect, useState, useCallback } from "react";

export type MeState = {
  user: { id: string; email: string; role: string } | null;
  verified: boolean;
  nullifierShort?: string | null;
  hasPaymentMethod: boolean;
  paymentsMode?: string;
};

export function onboardingComplete(me: MeState | null): boolean {
  return !!(me && me.user && me.verified && me.hasPaymentMethod);
}

export async function fetchMe(): Promise<MeState> {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  return (await res.json()) as MeState;
}

/** Fire-and-forget funnel beacon (never blocks the UI). */
export function track(type: string, dropId?: string, detail?: string) {
  try {
    void fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type, dropId, detail }),
      keepalive: true,
    });
  } catch {
    /* analytics must never break the flow */
  }
}

type StepKey = "account" | "verify" | "payment" | "done";

function stepFor(me: MeState | null): StepKey {
  if (!me || !me.user) return "account";
  if (!me.verified) return "verify";
  if (!me.hasPaymentMethod) return "payment";
  return "done";
}

export default function OnboardingWizard({
  me,
  onStateChange,
  onComplete,
  dropId,
}: {
  me: MeState | null;
  onStateChange: (me: MeState) => void;
  onComplete: () => void;
  dropId?: string;
}) {
  const step = stepFor(me);
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const next = await fetchMe();
    onStateChange(next);
    return next;
  }, [onStateChange]);

  useEffect(() => {
    setError(null);
  }, [step]);

  async function submitAccount(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || "Something went wrong");
        return;
      }
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function doVerify() {
    setBusy(true);
    setError(null);
    track("verify_start", dropId);
    try {
      const res = await fetch("/api/world-id/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || "Verification failed");
        return;
      }
      track("verify_done", dropId);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function doPayment() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/setup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || "Could not add payment method");
        return;
      }
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  const steps: { key: StepKey; label: string }[] = [
    { key: "account", label: "Account" },
    { key: "verify", label: "One human" },
    { key: "payment", label: "Payment" },
  ];
  const activeIdx = step === "done" ? 3 : steps.findIndex((s) => s.key === step);

  return (
    <div
      data-testid="wizard-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(20,23,31,.55)",
        backdropFilter: "blur(6px)",
        display: "grid",
        placeItems: "center",
        padding: 18,
      }}
    >
      <div className="card card-pad" style={{ width: "100%", maxWidth: 460 }}>
        {/* progress */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {steps.map((s, i) => (
            <div
              key={s.key}
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 12,
                fontWeight: 600,
                padding: "7px 4px",
                borderRadius: 999,
                border: "1px solid var(--line)",
                background: i < activeIdx ? "var(--fan-wash)" : i === activeIdx ? "var(--accent-wash)" : "var(--surface-2)",
                color: i < activeIdx ? "var(--fan-ink)" : i === activeIdx ? "var(--accent-ink)" : "var(--faint)",
              }}
            >
              {i < activeIdx ? "✓ " : `${i + 1}. `}
              {s.label}
            </div>
          ))}
        </div>

        {step === "account" && (
          <form onSubmit={submitAccount} data-testid="wizard-step-account">
            <h3 style={{ fontSize: 22 }}>
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h3>
            <p style={{ marginTop: 6, fontSize: 14, color: "var(--muted)" }}>
              One account per human — you&apos;ll prove that in the next step.
            </p>
            <div className="field" style={{ marginTop: 16 }}>
              <label className="label">Email</label>
              <input
                data-testid="wizard-email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <label className="label">Password</label>
              <input
                data-testid="wizard-password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8+ characters"
                required
                minLength={8}
              />
            </div>
            {error && (
              <p data-testid="wizard-error" style={{ marginTop: 10, fontSize: 13, color: "var(--red-ink)" }}>
                {error}
              </p>
            )}
            <button
              data-testid="wizard-account-submit"
              type="submit"
              className="btn btn-accent btn-block btn-lg"
              style={{ marginTop: 16 }}
              disabled={busy}
            >
              {busy ? "…" : mode === "signup" ? "Create account" : "Log in"}
            </button>
            <button
              data-testid="wizard-mode-toggle"
              type="button"
              className="btn btn-quiet btn-block"
              style={{ marginTop: 8 }}
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            >
              {mode === "signup" ? "Already in the Circle? Log in" : "New here? Create an account"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <div data-testid="wizard-step-verify">
            <h3 style={{ fontSize: 22 }}>Prove you&apos;re one human</h3>
            <p style={{ marginTop: 6, fontSize: 14, color: "var(--muted)" }}>
              60 seconds, once, on your phone. No eye scans. No crypto. We never learn your name —
              just that you&apos;re one unique person.
            </p>
            {error && (
              <p data-testid="wizard-error" style={{ marginTop: 10, fontSize: 13, color: "var(--red-ink)" }}>
                {error}
              </p>
            )}
            <button
              data-testid="wizard-verify-btn"
              className="btn btn-accent btn-block btn-lg"
              style={{ marginTop: 16 }}
              onClick={doVerify}
              disabled={busy}
            >
              {busy ? "Verifying…" : "Verify with World ID"}
            </button>
            <p style={{ marginTop: 10, fontSize: 12, color: "var(--faint)" }}>
              Simulated for the pilot demo — a real World ID widget drops in here.
            </p>
          </div>
        )}

        {step === "payment" && (
          <div data-testid="wizard-step-payment">
            <h3 style={{ fontSize: 22 }}>Add a payment method</h3>
            <p style={{ marginTop: 6, fontSize: 14, color: "var(--muted)" }}>
              Your card is only <b>held</b> when you claim a ticket and charged the moment it&apos;s
              yours. If a claim fails, the hold is released — you&apos;re never charged.
            </p>
            {error && (
              <p data-testid="wizard-error" style={{ marginTop: 10, fontSize: 13, color: "var(--red-ink)" }}>
                {error}
              </p>
            )}
            <button
              data-testid="wizard-payment-btn"
              className="btn btn-accent btn-block btn-lg"
              style={{ marginTop: 16 }}
              onClick={doPayment}
              disabled={busy}
            >
              {busy ? "Adding…" : "Add card •••• 4242 (test)"}
            </button>
          </div>
        )}

        {step === "done" && (
          <div data-testid="wizard-step-done" style={{ textAlign: "center" }}>
            <div className="badge-verified" style={{ justifyContent: "center" }}>
              <span className="seal">✓</span> You&apos;re in — one human, one ticket
            </div>
            {me?.nullifierShort && (
              <p className="mono" style={{ marginTop: 10, fontSize: 12.5, color: "var(--muted)" }}>
                member code {me.nullifierShort}
              </p>
            )}
            <button
              data-testid="wizard-done-close"
              className="btn btn-fan btn-block btn-lg"
              style={{ marginTop: 16 }}
              onClick={onComplete}
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
