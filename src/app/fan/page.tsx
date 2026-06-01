"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api-client";
import { fmtMoney, shortHash } from "@/lib/format";
import { TopNav, PageHead, Footer, Spinner, FaceValueChip } from "@/components/ui";
import type { Drop, PurchaseResp } from "@/lib/types";

type LogLine = { ts: string; text: string; tone: "" | "ok" | "bad" | "dim" };

function stamp() {
  const d = new Date();
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`;
}
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function fmtDate(d: string) {
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return d;
  }
}

function EngineTerminal({ logs }: { logs: LogLine[] }) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [logs]);
  return (
    <div className="engine-term" data-testid="engine-terminal">
      <div className="term-bar">
        <span className="dot" style={{ background: "#e2574d" }}></span>
        <span className="dot" style={{ background: "#e8b84b" }}></span>
        <span className="dot" style={{ background: "#1c9d6b" }}></span>
        <span className="t">valiron · engine</span>
        <span className="live">live</span>
      </div>
      <div className="term-body" ref={bodyRef}>
        {logs.length === 0 ? (
          <div className="ln dim">
            <span className="ts">{"--:--:--.---"}</span>engine idle · verify to arm your agent
          </div>
        ) : (
          logs.map((l, i) => (
            <div key={i} className={"ln " + l.tone}>
              <span className="ts">{l.ts}</span>
              {l.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DropCard({ drop, loading, logs }: { drop: Drop | null; loading: boolean; logs: LogLine[] }) {
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
      <span className="chip chip-accent" style={{ fontSize: 11.5 }}>Live drop · agent-armed checkout</span>
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

      {/* Live engine terminal — shows the real Valiron + policy calls as they run */}
      <EngineTerminal logs={logs} />
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

  const [logs, setLogs] = useState<LogLine[]>([]);
  function log(text: string, tone: LogLine["tone"] = "") {
    setLogs((l) => [...l, { ts: stamp(), text, tone }]);
  }

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

  async function verify() {
    setVerifying(true);
    log("→ world-id: requesting proof-of-personhood…", "dim");
    const res = await api.worldIdVerify();
    setVerifying(false);
    if (res && res.data && res.data.ok) {
      setNullifier(res.data.nullifierHash);
      log(`✓ world-id: verified · ${res.data.verificationLevel} · nullifier ${shortHash(res.data.nullifierHash)}`, "ok");
      log("  one human, one ticket — agent bound to this identity", "dim");
    }
  }

  async function buy() {
    if (!verified || !drop) return;
    setBuying(true);
    setResult(null);

    // Agent arms and waits for the exact on-sale moment — then fires.
    log(`agent armed — watching "${drop.event}"`, "dim");
    log("drop opens in 00:00:03 …", "dim");
    await wait(650);
    log("drop opens in 00:00:02 …", "dim");
    await wait(650);
    log("drop opens in 00:00:01 …", "dim");
    await wait(650);
    log("▌ DROP OPEN — agent firing", "");
    log("→ valiron.getAgentProfile(25459, ethereum)", "");

    const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
    const res = await api.purchase({ dropId: drop.id, agentId: "25459", chain: "ethereum", humanId: nullifier });
    const ms = Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - t0);

    const t = res.data?.trust;
    if (t) {
      if (t.allow) {
        log(`✓ trust gate: ALLOW · score ${t.score ?? "—"} · ${t.route}${t.worldIdVerified ? " · World ID ✓" : ""}  (${ms}ms)`, "ok");
      } else {
        log(`✗ trust gate: DENY · ${t.route}  (${ms}ms)`, "bad");
      }
    }

    const d = res.data;
    if (d?.decision === "approved") {
      log("→ authority gate: 1 ticket / verified human · ok", "");
      log(`✓ TICKET SECURED ${d.ticketId} · ${fmtMoney(d.faceValue ?? 0)} face value · identity-bound`, "ok");
    } else if (d?.code === "LIMIT_REACHED") {
      log("✗ authority gate: one ticket per verified human — blocked", "bad");
    } else if (d?.stage === "trust") {
      log("✗ blocked at the Valiron trust gate", "bad");
    } else if (d?.message) {
      log("✗ " + d.message, "bad");
    }

    setResult(d);
    setBuying(false);
    loadDrop();
  }

  function newIdentity() {
    setNullifier(null);
    setResult(null);
    setVerifying(false);
    setBuying(false);
    setLogs([]);
  }

  const approved = !!result && result.decision === "approved";

  return (
    <React.Fragment>
      <TopNav here="fan" />
      <main className="wrap">
        <PageHead
          title="Verify, then get your ticket"
          subtitle="Prove you're one real human — once. Your verified agent arms, waits for the exact drop, and clears the Valiron gate in milliseconds."
        />

        <div className="fan-grid">
          <DropCard drop={drop} loading={loadingDrop} logs={logs} />

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

            {/* STEP 2 — BUY AT THE DROP */}
            <div className={"stepc " + (verified ? (result ? "done-step" : "active") : "locked")}>
              <div className="step-num">
                <span className="b">{approved ? "✓" : "2"}</span>
                <span className="lbl">STEP 2</span>
              </div>
              <h3>Your agent fires at the drop</h3>
              <p className="sd">Your identity-backed agent (#25459, ethereum) arms and waits for the on-sale instant — then clears Valiron&apos;s trust gate in milliseconds and secures exactly one ticket, bound to you, non-transferable. Watch the engine run in the terminal.</p>

              <div className="step-action">
                <button className="btn btn-fan btn-block btn-lg" data-testid="buy-button" onClick={buy} disabled={!verified || buying}>
                  {buying ? <React.Fragment><Spinner /> Agent at the drop…</React.Fragment>
                    : verified ? "Send my agent to the drop →" : "Verify first to unlock"}
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
