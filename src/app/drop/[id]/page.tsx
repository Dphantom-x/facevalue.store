"use client";

/**
 * Drop page — the pilot conversion surface.
 * States: loading · not-found · pre-drop (countdown) · live (claim) ·
 * sold-out (waitlist) · owned (QR ticket + return). The onboarding wizard
 * overlays and LOCKS the page until account + verification + payment exist.
 */
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { TopNav, PageHead, Footer, FaceValueChip, Spinner } from "@/components/ui";
import { fmtMoney } from "@/lib/format";
import OnboardingWizard, { fetchMe, onboardingComplete, type MeState } from "@/components/OnboardingWizard";

type Drop = {
  id: string;
  artist: string;
  event: string;
  venue: string;
  date: string;
  opensAt?: string | null;
  faceValue: number;
  feeCents: number;
  remaining: number;
  available?: number;
  totalInventory: number;
  maxPerHuman: number;
};

type MyState = {
  ticket: { id: string; status: string; qrToken: string | null } | null;
  waitlist: { position: number; status: string } | null;
} | null;

function Countdown({ to }: { to: string }) {
  const [nowTs, setNowTs] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = Math.max(0, new Date(to).getTime() - nowTs);
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return (
    <span className="mono" data-testid="drop-countdown">
      {d}d {h}h {m}m {s}s
    </span>
  );
}

function QrImage({ token }: { token: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    QRCode.toDataURL(token, { width: 220, margin: 1 }).then(setSrc);
  }, [token]);
  if (!src) return <div className="skel" style={{ width: 220, height: 220 }}></div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img data-testid="ticket-qr" src={src} alt="Ticket QR" width={220} height={220} style={{ borderRadius: 12, border: "1px solid var(--line)" }} />;
}

export default function DropDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [drop, setDrop] = useState<Drop | null>(null);
  const [my, setMy] = useState<MyState>(null);
  const [me, setMe] = useState<MeState | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const load = useCallback(async () => {
    const [dropRes, meState] = await Promise.all([
      fetch(`/api/drops/${id}`, { cache: "no-store" }),
      fetchMe(),
    ]);
    setMe(meState);
    if (!dropRes.ok) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    const body = await dropRes.json();
    setDrop(body.drop);
    setMy(body.me);
    setLoading(false);
    if (!onboardingComplete(meState)) setWizardOpen(true);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function claim() {
    if (!onboardingComplete(me)) {
      setWizardOpen(true);
      return;
    }
    setClaiming(true);
    setResult(null);
    try {
      const res = await fetch(`/api/drop/${id}/claim`, { method: "POST" });
      const body = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: body.message });
      } else {
        setResult({ ok: false, message: body.message || body.error });
      }
      await load();
    } finally {
      setClaiming(false);
    }
  }

  async function joinWaitlist() {
    const res = await fetch(`/api/drops/${id}/waitlist`, { method: "POST" });
    const body = await res.json();
    setResult(
      res.ok
        ? { ok: true, message: `You're #${body.position} on the waitlist — if a ticket is returned, the next verified human gets it at face value.` }
        : { ok: false, message: body.message || body.error }
    );
    await load();
  }

  async function returnTicket() {
    if (!my?.ticket) return;
    const res = await fetch(`/api/tickets/${my.ticket.id}/return`, { method: "POST" });
    const body = await res.json();
    setResult({ ok: res.ok, message: body.message });
    await load();
  }

  const preDrop = drop?.opensAt && new Date(drop.opensAt).getTime() > Date.now();
  const owned = my?.ticket && (my.ticket.status === "confirmed" || my.ticket.status === "checked_in");
  const soldOut = drop ? (drop.available ?? drop.remaining) <= 0 : false;
  const totalCents = drop ? drop.faceValue * 100 + drop.feeCents : 0;

  return (
    <React.Fragment>
      <TopNav here="drops" />
      <main className="wrap" style={{ maxWidth: 760 }}>
        {loading ? (
          <div className="skel" style={{ height: 220, borderRadius: 22, marginTop: 40 }}></div>
        ) : notFound || !drop ? (
          <div style={{ padding: "80px 0", textAlign: "center" }}>
            <h1>Drop not found</h1>
            <p style={{ marginTop: 10 }}>
              <Link href="/drops" className="btn btn-ghost">← All drops</Link>
            </p>
          </div>
        ) : (
          <React.Fragment>
            <PageHead
              title={drop.event}
              subtitle={`${drop.venue} · ${drop.date} · max ${drop.maxPerHuman} per verified human`}
            />

            <div className="card card-pad" style={{ marginTop: 8 }} data-testid="drop-status">
              {/* price row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <FaceValueChip amount={drop.faceValue} size="lg" />
                <span className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>
                  + {fmtMoney(drop.feeCents / 100)} fair-access fee = {fmtMoney(totalCents / 100)}
                </span>
              </div>
              <div data-testid="drop-remaining" className="mono" style={{ marginTop: 12, fontSize: 13, color: "var(--ink-2)" }}>
                {drop.remaining} of {drop.totalInventory} left
              </div>
              <div className="remaining-bar" style={{ marginTop: 8 }}>
                <i style={{ width: `${Math.round((drop.remaining / drop.totalInventory) * 100)}%` }}></i>
              </div>

              {/* state module */}
              <div style={{ marginTop: 22 }}>
                {owned ? (
                  <div data-testid="your-ticket">
                    <div className="badge-verified">
                      <span className="seal">✓</span> Your ticket — bound to you, non-transferable
                    </div>
                    <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginTop: 14, flexWrap: "wrap" }}>
                      {my!.ticket!.qrToken && <QrImage token={my!.ticket!.qrToken} />}
                      <div style={{ fontSize: 13.5, color: "var(--muted)", maxWidth: 300 }}>
                        <p>Show this QR at the door. You&apos;re on the verified list.</p>
                        {my!.ticket!.status === "checked_in" ? (
                          <p style={{ marginTop: 8, color: "var(--fan-ink)", fontWeight: 600 }}>✓ Checked in</p>
                        ) : (
                          <button
                            data-testid="return-button"
                            className="btn btn-ghost"
                            style={{ marginTop: 12 }}
                            onClick={returnTicket}
                          >
                            Can&apos;t make it? Return at face value
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : preDrop ? (
                  <div data-testid="pre-drop">
                    <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
                      Drop opens in <Countdown to={drop.opensAt as string} />
                    </p>
                    <p style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>
                      Verify now so you&apos;re ready — the drop is one tap when it opens.
                    </p>
                    {!onboardingComplete(me) && (
                      <button className="btn btn-accent btn-lg" style={{ marginTop: 14 }} onClick={() => setWizardOpen(true)}>
                        Get ready — verify once (60s)
                      </button>
                    )}
                  </div>
                ) : soldOut ? (
                  <div data-testid="sold-out">
                    <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
                      Sold out — at face value, to real humans.
                    </p>
                    {my?.waitlist ? (
                      <p data-testid="waitlist-state" style={{ marginTop: 8, fontSize: 14, color: "var(--fan-ink)", fontWeight: 600 }}>
                        {my.waitlist.status === "offered"
                          ? "🎟 A ticket opened up — claim it now!"
                          : `You're #${my.waitlist.position} on the waitlist.`}
                      </p>
                    ) : (
                      <p style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>
                        If a ticket is returned, the next verified human gets it at face value.
                      </p>
                    )}
                    <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                      {my?.waitlist?.status === "offered" ? (
                        <button data-testid="claim-button" className="btn btn-fan btn-lg" onClick={claim} disabled={claiming}>
                          {claiming ? <Spinner /> : null} Claim your ticket at face value
                        </button>
                      ) : !my?.waitlist ? (
                        <button data-testid="waitlist-join" className="btn btn-accent btn-lg" onClick={joinWaitlist}>
                          Join the waitlist
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div data-testid="live">
                    <button data-testid="claim-button" className="btn btn-fan btn-block btn-lg" onClick={claim} disabled={claiming}>
                      {claiming ? (
                        <React.Fragment>
                          <Spinner /> Securing your ticket…
                        </React.Fragment>
                      ) : (
                        `Buy 1 ticket at face value — ${fmtMoney(totalCents / 100)}`
                      )}
                    </button>
                    <p style={{ marginTop: 10, fontSize: 12.5, color: "var(--faint)" }}>
                      Your card is held, then charged only when the ticket is yours. One per verified human.
                    </p>
                  </div>
                )}
              </div>

              {result && (
                <div
                  data-testid="claim-result"
                  className={"result " + (result.ok ? "approved" : "denied")}
                  style={{ marginTop: 18 }}
                >
                  <p className="result-msg" style={{ marginTop: 0 }}>{result.message}</p>
                </div>
              )}
            </div>

            <p style={{ marginTop: 18, fontSize: 13, color: "var(--muted)" }}>
              Every buyer verified live · one ticket per human · returns go to the waitlist at face value.
            </p>
            <p style={{ marginTop: 24 }}>
              <Link href="/tickets" className="btn btn-ghost">My tickets →</Link>
            </p>
          </React.Fragment>
        )}
      </main>
      <Footer />

      {wizardOpen && (
        <OnboardingWizard
          me={me}
          onStateChange={(next) => setMe(next)}
          onComplete={() => {
            setWizardOpen(false);
            void load();
          }}
        />
      )}
    </React.Fragment>
  );
}
