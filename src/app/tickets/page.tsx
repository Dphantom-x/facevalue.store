"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { TopNav, PageHead, Footer } from "@/components/ui";
import { fmtMoney } from "@/lib/format";
import OnboardingWizard, { fetchMe, type MeState } from "@/components/OnboardingWizard";

type Ticket = {
  id: string;
  dropId: string;
  event: string;
  venue: string;
  date: string;
  priceCents: number;
  feeCents: number;
  status: string;
  qrToken: string | null;
  checkedInAt: number | null;
};

function Qr({ token }: { token: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    QRCode.toDataURL(token, { width: 180, margin: 1 }).then(setSrc);
  }, [token]);
  if (!src) return <div className="skel" style={{ width: 180, height: 180 }}></div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img data-testid="ticket-qr" src={src} alt="Ticket QR" width={180} height={180} style={{ borderRadius: 12, border: "1px solid var(--line)" }} />;
}

const STATUS_CHIP: Record<string, string> = {
  confirmed: "chip-fv",
  checked_in: "chip-accent",
  returned: "chip-neutral",
  canceled: "chip-neutral",
};

export default function TicketsPage() {
  const [me, setMe] = useState<MeState | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const meState = await fetchMe();
    setMe(meState);
    if (!meState.user) {
      setWizardOpen(true);
      setLoading(false);
      return;
    }
    const res = await fetch("/api/me/tickets", { cache: "no-store" });
    if (res.ok) {
      const body = await res.json();
      setTickets(body.tickets || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function returnTicket(id: string) {
    const res = await fetch(`/api/tickets/${id}/return`, { method: "POST" });
    const body = await res.json();
    setMsg(body.message);
    await load();
  }

  return (
    <React.Fragment>
      <TopNav here="tickets" />
      <main className="wrap" style={{ maxWidth: 760 }}>
        <PageHead title="My tickets" subtitle="Bound to you. Show the QR at the door." />
        {msg && (
          <div className="result approved" style={{ marginBottom: 16 }} data-testid="tickets-msg">
            <p className="result-msg" style={{ marginTop: 0 }}>{msg}</p>
          </div>
        )}
        <div data-testid="tickets-list" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {loading ? (
            <div className="skel" style={{ height: 120, borderRadius: 22 }}></div>
          ) : tickets.length === 0 ? (
            <div className="drops-empty">
              No tickets yet — <Link href="/drops" style={{ textDecoration: "underline" }}>see the drops</Link>.
            </div>
          ) : (
            tickets.map((t) => (
              <div key={t.id} className="card card-pad" data-testid="ticket-card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div className="ev" style={{ fontFamily: "var(--font-display)", fontSize: 21, color: "var(--ink)" }}>
                      {t.event}
                    </div>
                    <div style={{ marginTop: 4, fontSize: 13.5, color: "var(--muted)" }}>
                      {t.venue} · {t.date} · paid {fmtMoney((t.priceCents + t.feeCents) / 100)} ({fmtMoney(t.priceCents / 100)} + {fmtMoney(t.feeCents / 100)} fee)
                    </div>
                  </div>
                  <span className={`chip ${STATUS_CHIP[t.status] || "chip-neutral"}`} style={{ alignSelf: "flex-start", fontSize: 11.5 }}>
                    {t.status === "checked_in" ? "✓ checked in" : t.status}
                  </span>
                </div>
                {t.status === "confirmed" && t.qrToken && (
                  <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginTop: 16, flexWrap: "wrap" }}>
                    <Qr token={t.qrToken} />
                    <div style={{ fontSize: 13, color: "var(--muted)", maxWidth: 300 }}>
                      <p>Non-transferable — it only works with your verified identity at the door.</p>
                      <button
                        data-testid="ticket-return"
                        className="btn btn-ghost"
                        style={{ marginTop: 12 }}
                        onClick={() => returnTicket(t.id)}
                      >
                        Return at face value
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
      {wizardOpen && (
        <OnboardingWizard
          me={me}
          onStateChange={setMe}
          onComplete={() => {
            setWizardOpen(false);
            void load();
          }}
        />
      )}
    </React.Fragment>
  );
}
