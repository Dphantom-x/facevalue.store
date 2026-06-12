"use client";

/**
 * Door check-in — staff scans/pastes a ticket QR token. Single use:
 * a second scan of the same ticket is rejected loudly.
 */
import React, { useCallback, useEffect, useState } from "react";
import { TopNav, PageHead, Footer, Spinner } from "@/components/ui";
import { fetchMe, type MeState } from "@/components/OnboardingWizard";

type CheckResult = { ok: boolean; message: string; event?: string };

export default function DoorPage() {
  const [me, setMe] = useState<MeState | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [recent, setRecent] = useState<{ ok: boolean; label: string; at: string }[]>([]);

  const load = useCallback(async () => {
    setMe(await fetchMe());
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const isStaff = me?.user && (me.user.role === "vendor" || me.user.role === "admin");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json();
    if (!res.ok) {
      setLoginError(body.error || "Login failed");
      return;
    }
    await load();
  }

  async function check(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const body = await res.json();
      const r: CheckResult = { ok: res.ok, message: body.message || body.error, event: body.ticket?.event };
      setResult(r);
      setRecent((list) => [
        { ok: r.ok, label: r.ok ? `✓ ${body.ticket.event}` : `✕ ${r.message}`, at: new Date().toLocaleTimeString() },
        ...list.slice(0, 19),
      ]);
      if (r.ok) setToken("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <React.Fragment>
      <TopNav here="door" />
      <main className="wrap" style={{ maxWidth: 640 }}>
        <PageHead title="Door check-in" subtitle="Scan or paste a ticket code. One human, one entry." />

        {!isStaff ? (
          <form className="card card-pad" onSubmit={login} style={{ maxWidth: 420 }}>
            <h3 style={{ fontSize: 20 }}>Staff login</h3>
            <div className="field" style={{ marginTop: 14 }}>
              <label className="label">Email</label>
              <input data-testid="door-login-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <label className="label">Password</label>
              <input data-testid="door-login-password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {loginError && <p style={{ marginTop: 10, fontSize: 13, color: "var(--red-ink)" }}>{loginError}</p>}
            <button data-testid="door-login-btn" className="btn btn-ink btn-block" style={{ marginTop: 14 }}>
              Log in
            </button>
          </form>
        ) : (
          <React.Fragment>
            <form className="card card-pad" onSubmit={check}>
              <div className="field">
                <label className="label">Ticket code (QR contents)</label>
                <input
                  data-testid="door-input"
                  className="input mono"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-….xxxxxxxxxxxxxxxx"
                  autoFocus
                />
              </div>
              <button data-testid="door-check" className="btn btn-fan btn-block btn-lg" style={{ marginTop: 14 }} disabled={busy}>
                {busy ? <Spinner /> : null} Check in
              </button>
            </form>

            {result && (
              <div data-testid="door-result" className={"result " + (result.ok ? "approved" : "denied")} style={{ marginTop: 16 }}>
                <p className="result-msg" style={{ marginTop: 0, fontWeight: 600 }}>{result.message}</p>
              </div>
            )}

            {recent.length > 0 && (
              <div className="card card-pad" style={{ marginTop: 18 }} data-testid="door-recent">
                <h4 style={{ fontSize: 13, color: "var(--muted)" }}>Recent</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0", display: "flex", flexDirection: "column", gap: 7 }}>
                  {recent.map((r, i) => (
                    <li key={i} className="mono" style={{ fontSize: 12.5, color: r.ok ? "var(--fan-ink)" : "var(--red-ink)" }}>
                      {r.at} — {r.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </React.Fragment>
        )}
      </main>
      <Footer />
    </React.Fragment>
  );
}
