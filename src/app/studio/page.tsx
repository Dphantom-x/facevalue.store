"use client";

/**
 * Studio — the REAL vendor portal (auth-gated): create drops, watch sales,
 * check-ins, waitlist demand, and the live audit feed.
 */
import React, { useCallback, useEffect, useState } from "react";
import { TopNav, PageHead, Footer, Spinner } from "@/components/ui";
import { fmtMoney } from "@/lib/format";
import { fetchMe, type MeState } from "@/components/OnboardingWizard";

type DropWithStats = {
  id: string;
  event: string;
  venue: string;
  date: string;
  opensAt?: string | null;
  faceValue: number;
  remaining: number;
  totalInventory: number;
  maxPerHuman: number;
  mode: string;
  accessCode?: string | null;
  stats: { sold: number; checkedIn: number; revenueCents: number; feesCents: number; waitlistCount: number };
  funnel: { views: number; verifyStarts: number; verifies: number; claims: number; verifyRate: number };
};

/** The pilot go/no-go bar: ≥15% of clickers must verify. */
const VERIFY_GATE = 0.15;

type AuditRow = { id: number; ts: number; type: string; detail: string | null };

const DEFAULTS = {
  artist: "FaceValue",
  event: "FaceValue: Humans Only — Vol. 003",
  venue: "Secret Loft, Bushwick",
  date: "2026-11-14",
  opensAt: "",
  faceValue: "25",
  totalInventory: "120",
  maxPerHuman: "1",
  mode: "full",
  accessCode: "",
};

export default function StudioPage() {
  const [me, setMe] = useState<MeState | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const [drops, setDrops] = useState<DropWithStats[]>([]);
  const [auditRows, setAuditRows] = useState<AuditRow[]>([]);
  const [form, setForm] = useState<Record<string, string>>(DEFAULTS);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copyInvite(d: DropWithStats) {
    const link = `${window.location.origin}/drop/${d.id}${d.accessCode ? `?code=${encodeURIComponent(d.accessCode)}` : ""}`;
    void navigator.clipboard?.writeText(link);
    setCopiedId(d.id);
    setTimeout(() => setCopiedId((c) => (c === d.id ? null : c)), 1500);
  }

  const isVendor = me?.user && (me.user.role === "vendor" || me.user.role === "admin");

  const load = useCallback(async () => {
    const meState = await fetchMe();
    setMe(meState);
    if (meState.user && (meState.user.role === "vendor" || meState.user.role === "admin")) {
      const res = await fetch("/api/studio/overview", { cache: "no-store" });
      if (res.ok) {
        const body = await res.json();
        setDrops(body.drops || []);
        setAuditRows(body.audit || []);
      }
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function createDrop(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreated(null);
    try {
      const res = await fetch("/api/studio/drops", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, opensAt: form.opensAt ? new Date(form.opensAt).toISOString() : null }),
      });
      const body = await res.json();
      if (res.ok) {
        setCreated(body.drop.event);
        await load();
      }
    } finally {
      setCreating(false);
    }
  }

  const field = "input";

  return (
    <React.Fragment>
      <TopNav here="studio" />
      <main className="wrap">
        <PageHead title="Studio" subtitle="Run verified drops. Watch real demand." />

        {!isVendor ? (
          <form className="card card-pad" onSubmit={login} style={{ maxWidth: 420 }}>
            <h3 style={{ fontSize: 20 }}>Vendor login</h3>
            <p style={{ marginTop: 6, fontSize: 13, color: "var(--muted)" }}>
              Pilot vendor: vendor@facevalue.store
            </p>
            <div className="field" style={{ marginTop: 14 }}>
              <label className="label">Email</label>
              <input data-testid="studio-login-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <label className="label">Password</label>
              <input data-testid="studio-login-password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {loginError && <p style={{ marginTop: 10, fontSize: 13, color: "var(--red-ink)" }}>{loginError}</p>}
            <button data-testid="studio-login-btn" className="btn btn-ink btn-block" style={{ marginTop: 14 }}>
              Log in
            </button>
          </form>
        ) : (
          <div style={{ display: "grid", gap: 22 }}>
            {/* create */}
            <form className="card form-card" onSubmit={createDrop}>
              <h3>New verified drop</h3>
              <div className="form-grid" style={{ marginTop: 18 }}>
                <div className="field">
                  <label className="label">Artist / host</label>
                  <input data-testid="studio-artist" className={field} value={form.artist} onChange={(e) => set("artist", e.target.value)} />
                </div>
                <div className="field">
                  <label className="label">Venue</label>
                  <input data-testid="studio-venue" className={field} value={form.venue} onChange={(e) => set("venue", e.target.value)} />
                </div>
                <div className="field col-2">
                  <label className="label">Event name</label>
                  <input data-testid="studio-event" className={field} value={form.event} onChange={(e) => set("event", e.target.value)} />
                </div>
                <div className="field">
                  <label className="label">Date</label>
                  <input data-testid="studio-date" className={`${field} mono`} type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
                </div>
                <div className="field">
                  <label className="label">Opens at (optional — pre-drop countdown)</label>
                  <input data-testid="studio-opensat" className={`${field} mono`} type="datetime-local" value={form.opensAt} onChange={(e) => set("opensAt", e.target.value)} />
                </div>
                <div className="field">
                  <label className="label">Face value (USD)</label>
                  <input data-testid="studio-face" className={`${field} mono`} type="number" min="0" value={form.faceValue} onChange={(e) => set("faceValue", e.target.value)} />
                </div>
                <div className="field">
                  <label className="label">Inventory</label>
                  <input data-testid="studio-inventory" className={`${field} mono`} type="number" min="1" value={form.totalInventory} onChange={(e) => set("totalInventory", e.target.value)} />
                </div>
                <div className="field">
                  <label className="label">Max per human</label>
                  <input data-testid="studio-max" className={`${field} mono`} type="number" min="1" value={form.maxPerHuman} onChange={(e) => set("maxPerHuman", e.target.value)} />
                </div>
                <div className="field col-2">
                  <label className="label">Access code <span style={{ color: "var(--faint)", fontWeight: 400 }}>(optional — invite-only carve-out; blank = open drop)</span></label>
                  <input data-testid="studio-accesscode" className={`${field} mono`} value={form.accessCode} onChange={(e) => set("accessCode", e.target.value)} placeholder="e.g. HUMANS-ONLY" />
                </div>
              </div>
              <div className="launch-row">
                <button data-testid="studio-create" className="btn btn-accent btn-lg" disabled={creating}>
                  {creating ? <Spinner /> : null} Launch drop
                </button>
                {created && (
                  <span data-testid="studio-created" style={{ fontSize: 13.5, color: "var(--fan-ink)", fontWeight: 600 }}>
                    ✓ “{created}” is live
                  </span>
                )}
              </div>
            </form>

            {/* drops + stats */}
            <section>
              <h2 style={{ fontSize: 24 }}>Your drops</h2>
              <div data-testid="studio-drops" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
                {drops.map((d) => {
                  const pass = d.funnel.verifyRate >= VERIFY_GATE;
                  const ratePct = (d.funnel.verifyRate * 100).toFixed(0);
                  return (
                    <div key={d.id} data-testid="studio-drop-row" className="card" style={{ padding: 0, overflow: "hidden" }}>
                      <div className="droprow" style={{ border: "none", borderRadius: 0 }}>
                        <div className="ev-cell">
                          <div className="ev">
                            {d.event}
                            {d.accessCode ? (
                              <span className="chip chip-neutral" style={{ marginLeft: 8, fontSize: 11 }}>🔒 invite-only</span>
                            ) : null}
                          </div>
                          <div className="sub">{d.venue} · {d.date}</div>
                        </div>
                        <div>
                          <div className="cell-k">Sold</div>
                          <div className="cell-v">{d.stats.sold} / {d.totalInventory}</div>
                        </div>
                        <div>
                          <div className="cell-k">Checked in</div>
                          <div className="cell-v">{d.stats.checkedIn}</div>
                        </div>
                        <div>
                          <div className="cell-k">Revenue · waitlist</div>
                          <div className="cell-v fan">
                            {fmtMoney(d.stats.revenueCents / 100)} · {d.stats.waitlistCount} waiting
                          </div>
                        </div>
                      </div>

                      {/* Conversion funnel — the pilot's go/no-go instrument */}
                      <div
                        data-testid="studio-funnel"
                        style={{
                          borderTop: "1px solid var(--line)",
                          background: "var(--surface-2)",
                          padding: "14px 18px",
                          display: "flex",
                          alignItems: "center",
                          gap: 18,
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ display: "flex", gap: 18, fontSize: 13 }}>
                          <span><b data-testid="funnel-views">{d.funnel.views}</b> <span style={{ color: "var(--muted)" }}>views</span></span>
                          <span style={{ color: "var(--faint)" }}>→</span>
                          <span><b data-testid="funnel-verifies">{d.funnel.verifies}</b> <span style={{ color: "var(--muted)" }}>verified</span></span>
                          <span style={{ color: "var(--faint)" }}>→</span>
                          <span><b data-testid="funnel-claims">{d.funnel.claims}</b> <span style={{ color: "var(--muted)" }}>claimed</span></span>
                        </div>
                        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                          <span
                            data-testid="funnel-rate"
                            className="mono"
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              padding: "4px 10px",
                              borderRadius: 999,
                              background: pass ? "var(--fan-wash)" : "var(--red-wash, #fdecec)",
                              color: pass ? "var(--fan-ink)" : "var(--red-ink)",
                            }}
                            title="Verify rate = verified ÷ views. Pilot go/no-go bar is 15%."
                          >
                            {ratePct}% verify {d.funnel.views > 0 ? (pass ? "· PASS ✓" : "· below 15%") : "· no data yet"}
                          </span>
                          <button
                            type="button"
                            data-testid="studio-copy-invite"
                            className="btn btn-ghost"
                            style={{ fontSize: 12, padding: "5px 10px" }}
                            onClick={() => copyInvite(d)}
                          >
                            {copiedId === d.id ? "✓ Copied" : d.accessCode ? "Copy invite link" : "Copy link"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* audit feed */}
            <section>
              <h2 style={{ fontSize: 24 }}>Live audit feed</h2>
              <div className="card card-pad" style={{ marginTop: 14 }} data-testid="studio-audit">
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {auditRows.map((a) => (
                    <li key={a.id} className="mono" style={{ fontSize: 12, color: "var(--ink-2)" }}>
                      {new Date(a.ts).toLocaleTimeString()} · <b>{a.type}</b>
                      {a.detail ? ` — ${a.detail}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </React.Fragment>
  );
}
