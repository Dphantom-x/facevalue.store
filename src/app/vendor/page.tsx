"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { fmtMoney } from "@/lib/format";
import { TopNav, PageHead, Footer, Spinner } from "@/components/ui";
import type { Drop } from "@/lib/types";

const MODES = [
  { id: "full", mn: "Full pipeline", md: "Verify + trust gate + buy" },
  { id: "hybrid", mn: "Hybrid", md: "Trust gate, lighter checks" },
  { id: "lottery", mn: "Lottery", md: "Verified entrants, drawn" },
];

const PROPS = [
  { i: "✓", t: "Real buyers only", s: "Every purchase is an identity-verified human — no fake accounts in the room." },
  { i: "⊘", t: "Scalpers excluded", s: "Bot swarms bounce off the Valiron trust gate before they can touch inventory." },
  { i: "∅", t: "Resale killed at source", s: "Tickets are bound to a verified identity and non-transferable. No secondary markup." },
  { i: "≈", t: "A clean demand signal", s: "One human, one ticket means your sell-through reflects real fans, not bots." },
];

// Prefilled so the drop launches in one click (demo + tests).
const DEFAULTS: Record<string, string> = {
  artist: "Aurora Lane",
  event: "Aurora Lane — Neon Cities Tour",
  venue: "Brooklyn Steel, NYC",
  date: "2026-10-04",
  faceValue: "75",
  totalInventory: "200",
  maxPerHuman: "1",
  mode: "full",
};

function fmtDate(d: string) {
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return d;
  }
}

function DropRow({ drop, fresh }: { drop: Drop; fresh: boolean }) {
  return (
    <div className={"droprow" + (fresh ? " fresh" : "")} data-testid="drop-row">
      <div className="ev-cell">
        <div className="ev">{drop.event}</div>
        <div className="sub">{drop.venue} · {fmtDate(drop.date)}{fresh ? " · just launched" : ""}</div>
      </div>
      <div>
        <div className="cell-k">Face value</div>
        <div className="cell-v fan">{fmtMoney(drop.faceValue)}</div>
      </div>
      <div>
        <div className="cell-k">Remaining</div>
        <div className="cell-v">{drop.remaining} / {drop.totalInventory}</div>
      </div>
      <div>
        <div className="cell-k">Pipeline</div>
        <div className="cell-v" style={{ fontSize: 13, textTransform: "capitalize" }}>{drop.mode}</div>
      </div>
    </div>
  );
}

export default function VendorPage() {
  const [form, setForm] = useState<Record<string, string>>(DEFAULTS);
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState<Drop | null>(null);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loadingDrops, setLoadingDrops] = useState(true);
  const [freshId, setFreshId] = useState<string | null>(null);

  function loadDrops() {
    setLoadingDrops(true);
    api.getDrops().then((res) => {
      setDrops((res && res.data && res.data.drops) || []);
      setLoadingDrops(false);
    });
  }
  useEffect(() => { loadDrops(); }, []);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const valid =
    form.artist && form.event && form.venue && form.date &&
    form.faceValue && form.totalInventory && form.maxPerHuman;

  function launch(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || launching) return;
    setLaunching(true);
    setLaunched(null);
    api.vendorCreateDrop(form).then((res) => {
      setLaunching(false);
      if (res && res.data && res.data.ok) {
        setLaunched(res.data.drop);
        setFreshId(res.data.drop.id);
        loadDrops();
        setForm(DEFAULTS);
      }
    });
  }

  return (
    <React.Fragment>
      <TopNav here="vendor" />
      <main className="wrap">
        <PageHead
          title="Launch a verified-fan drop"
          subtitle="Configure your release. Every buyer clears proof-of-personhood and the Valiron trust gate — scalpers never make it through."
        />

        <div className="vendor-grid">
          {/* FORM */}
          <form className="card form-card" onSubmit={launch}>
            <h3>Drop configuration</h3>
            <p className="fsub">All fields required. This creates a live drop fans can buy from.</p>

            <div className="form-grid">
              <div className="field">
                <label className="label">Artist</label>
                <input className="input" value={form.artist} onChange={(e) => set("artist", e.target.value)} placeholder="Midnight Echo" />
              </div>
              <div className="field">
                <label className="label">Venue</label>
                <input className="input" value={form.venue} onChange={(e) => set("venue", e.target.value)} placeholder="The Forum, NYC" />
              </div>
              <div className="field col-2">
                <label className="label">Event name</label>
                <input className="input" value={form.event} onChange={(e) => set("event", e.target.value)} placeholder="Midnight Echo — Live at The Forum" />
              </div>
              <div className="field">
                <label className="label">Date</label>
                <input className="input mono" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Face value (USD)</label>
                <input className="input mono" type="number" min="0" value={form.faceValue} onChange={(e) => set("faceValue", e.target.value)} placeholder="60" />
              </div>
              <div className="field">
                <label className="label">Total inventory</label>
                <input className="input mono" type="number" min="1" value={form.totalInventory} onChange={(e) => set("totalInventory", e.target.value)} placeholder="40" />
              </div>
              <div className="field">
                <label className="label">Max per human</label>
                <input className="input mono" type="number" min="1" value={form.maxPerHuman} onChange={(e) => set("maxPerHuman", e.target.value)} placeholder="1" />
              </div>
              <div className="field col-2">
                <label className="label">Pipeline mode</label>
                <div className="modes">
                  {MODES.map((m) => (
                    <label key={m.id} className={"mode-opt" + (form.mode === m.id ? " sel" : "")}>
                      <input type="radio" name="mode" value={m.id} checked={form.mode === m.id} onChange={() => set("mode", m.id)} />
                      <div className="mn">{m.mn}</div>
                      <div className="md">{m.md}</div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="launch-row">
              <button type="submit" className="btn btn-accent btn-lg" data-testid="launch-button" disabled={!valid || launching}>
                {launching ? <React.Fragment><Spinner /> Launching drop…</React.Fragment> : "Launch verified-fan drop →"}
              </button>
              <span className="launch-note">{valid ? "Ready to go live." : "Fill every field to launch."}</span>
            </div>

            {launched ? (
              <div className="launched" data-testid="launched-confirm">
                <span className="mk">✓</span>
                <div className="lt">
                  <b>“{launched.event}” is live.</b>
                  <p>{launched.totalInventory} tickets at {fmtMoney(launched.faceValue)} face value · {launched.maxPerHuman} per verified human · {launched.mode} pipeline. It&apos;s now buyable on the fan page.</p>
                </div>
              </div>
            ) : null}
          </form>

          {/* VALUE PROPS */}
          <div className="card props">
            <h4>Why vendors run FaceValue</h4>
            <div style={{ marginTop: 8 }}>
              {PROPS.map((p, i) => (
                <div className="prop" key={i}>
                  <span className="pi">{p.i}</span>
                  <span className="pt"><b>{p.t}</b><span>{p.s}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LIVE DROPS */}
        <section className="drops-section">
          <div className="drops-head">
            <h2>Live drops</h2>
            <span className="cnt">{loadingDrops ? "loading…" : drops.length + " active"}</span>
          </div>
          <div className="drops-list" data-testid="drops-list">
            {loadingDrops ? (
              [0, 1].map((i) => <div key={i} className="skel" style={{ height: 78, borderRadius: 22 }}></div>)
            ) : drops.length === 0 ? (
              <div className="drops-empty">No drops yet — launch one above.</div>
            ) : (
              drops.map((d) => <DropRow key={d.id} drop={d} fresh={d.id === freshId} />)
            )}
          </div>
        </section>
      </main>
      <Footer />
    </React.Fragment>
  );
}
