"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { fmtMoney, shortHash } from "@/lib/format";
import { TopNav, PageHead, Footer, Spinner, FaceValueChip } from "@/components/ui";
import type { Drop, PurchaseResp } from "@/lib/types";

function fmtDate(d: string) {
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return d;
  }
}

function DropCard({ drop, loading }: { drop: Drop | null; loading: boolean }) {
  if (loading || !drop) {
    return (
      <div className="card card-pad dropcard">
        <div className="skel" style={{ height: 26, width: "70%" }}></div>
        <div className="skel" style={{ height: 15, width: "50%", marginTop: 14 }}></div>
        <div className="drop-perf"></div>
        <div className="skel" style={{ height: 44, width: "100%" }}></div>
      </div>
    );
  }
  const pct = Math.round((drop.remaining / drop.totalInventory) * 100);
  return (
    <div className="card card-pad dropcard">
      <span className="chip chip-accent" style={{ fontSize: 11.5 }}>Active drop · on sale now</span>
      <div className="ev" style={{ marginTop: 16 }}>{drop.event}</div>
      <div className="meta">{drop.venue} · {fmtDate(drop.date)}</div>
      <div className="drop-perf"></div>
      <div className="drop-row">
        <div className="drop-stat">
          <div className="k">Price</div>
          <div className="v">{fmtMoney(drop.faceValue)}</div>
        </div>
        <div className="drop-stat" style={{ textAlign: "center" }}>
          <div className="k">Limit</div>
          <div className="v">1 / human</div>
        </div>
        <div className="drop-stat" style={{ textAlign: "right" }}>
          <div className="k">Pipeline</div>
          <div className="v" style={{ fontSize: 14, textTransform: "capitalize" }}>{drop.mode}</div>
        </div>
      </div>
      <div className="remaining-bar"><i style={{ width: pct + "%" }}></i></div>
      <div data-testid="remaining" style={{ marginTop: 10, fontFamily: "var(--mono)", fontSize: 13, color: "var(--ink-2)" }}>
        {drop.remaining} of {drop.totalInventory} tickets left
      </div>
      <div style={{ marginTop: 18 }}>
        <FaceValueChip amount={drop.faceValue} />
      </div>
    </div>
  );
}

export default function FanPage() {
  const [drop, setDrop] = useState<Drop | null>(null);
  const [loadingDrop, setLoadingDrop] = useState(true);

  const [verifying, setVerifying] = useState(false);
  const [nullifier, setNullifier] = useState<string | null>(null);

  const [buying, setBuying] = useState(false);
  const [result, setResult] = useState<PurchaseResp | null>(null);

  function loadDrop() {
    setLoadingDrop(true);
    api.getDrops().then((res) => {
      const d = res && res.data && res.data.drops && res.data.drops[0];
      setDrop(d || null);
      setLoadingDrop(false);
    });
  }
  useEffect(() => { loadDrop(); }, []);

  const verified = !!nullifier;

  function verify() {
    setVerifying(true);
    api.worldIdVerify().then((res) => {
      setVerifying(false);
      if (res && res.data && res.data.ok) setNullifier(res.data.nullifierHash);
    });
  }

  function buy() {
    if (!verified || !drop) return;
    setBuying(true);
    setResult(null);
    api.purchase({ dropId: drop.id, agentId: "25459", chain: "ethereum", humanId: nullifier }).then((res) => {
      setBuying(false);
      setResult(res.data);
      loadDrop();
    });
  }

  function newIdentity() {
    setNullifier(null);
    setResult(null);
    setVerifying(false);
    setBuying(false);
  }

  const approved = !!result && result.decision === "approved";

  return (
    <React.Fragment>
      <TopNav here="fan" />
      <main className="wrap">
        <PageHead
          title="Verify, then get your ticket"
          subtitle="Prove you're one real human — once. Your verified agent clears the Valiron gate and buys a single ticket at face value."
        />

        <div className="fan-grid">
          <DropCard drop={drop} loading={loadingDrop} />

          <div className="steps-col">
            {/* STEP 1 — VERIFY */}
            <div className={"stepc " + (verified ? "done-step" : "active")}>
              <div className="step-num">
                <span className="b">{verified ? "✓" : "1"}</span>
                <span className="lbl">{verified ? "VERIFIED" : "STEP 1"}</span>
              </div>
              <h3>Prove you&apos;re a real human</h3>
              <p className="sd">One proof-of-personhood check — no fake accounts, no swarm to hide behind. We never see who you are, only that you&apos;re one person.</p>

              {!verified ? (
                <React.Fragment>
                  <div className="worldid">
                    <span className="orb"></span>
                    <span className="wt"><b>World ID — proof of personhood</b><span>Device verification · simulated for this demo</span></span>
                  </div>
                  <div className="step-action">
                    <button className="btn btn-accent btn-block btn-lg" data-testid="verify-button" onClick={verify} disabled={verifying}>
                      {verifying ? <React.Fragment><Spinner /> Verifying with World ID…</React.Fragment> : "Verify with World ID"}
                    </button>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="badge-verified" data-testid="verified-badge" style={{ marginTop: 18 }}>
                    <span className="seal">✓</span> You&apos;re a verified human
                  </div>
                  <div className="id-readout">
                    <span className="k">Identity nullifier</span>
                    <span className="h">{shortHash(nullifier)}</span>
                  </div>
                </React.Fragment>
              )}
            </div>

            {/* STEP 2 — BUY */}
            <div className={"stepc " + (verified ? (result ? "done-step" : "active") : "locked")}>
              <div className="step-num">
                <span className="b">{approved ? "✓" : "2"}</span>
                <span className="lbl">STEP 2</span>
              </div>
              <h3>Your agent buys at face value</h3>
              <p className="sd">Your identity-backed agent (#25459, ethereum) clears Valiron&apos;s trust gate and secures exactly one ticket — bound to you, non-transferable.</p>

              <div className="step-action">
                <button className="btn btn-fan btn-block btn-lg" data-testid="buy-button" onClick={buy} disabled={!verified || buying}>
                  {buying ? <React.Fragment><Spinner /> Securing your ticket…</React.Fragment>
                    : verified ? "Buy 1 ticket at face value" : "Verify first to unlock"}
                </button>
              </div>

              {result ? (
                <div className={"result " + (approved ? "approved" : "denied")} data-testid="purchase-result">
                  <div className="result-head">
                    <span className="mk">{approved ? "✓" : "✕"}</span>
                    <span className="rt">{approved ? "Ticket secured" : "Purchase blocked"}</span>
                  </div>
                  <p className="result-msg">{result.message}</p>
                  {approved && result.ticketId ? (
                    <div className="result-ticket">
                      <FaceValueChip amount={result.faceValue ?? 0} />
                      <span className="tid">#{result.ticketId}</span>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="reset-row">
                <button className="btn btn-ghost" data-testid="new-identity-button" onClick={newIdentity}>
                  ↺ Try as a new verified human
                </button>
                <span className="note">Resets to a fresh person — the same human can&apos;t grab a second ticket.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </React.Fragment>
  );
}
