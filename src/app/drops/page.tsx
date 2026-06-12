"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TopNav, PageHead, Footer, FaceValueChip } from "@/components/ui";
import { fmtMoney } from "@/lib/format";

type Drop = {
  id: string;
  artist: string;
  event: string;
  venue: string;
  date: string;
  opensAt?: string | null;
  faceValue: number;
  remaining: number;
  totalInventory: number;
  maxPerHuman: number;
};

function statusOf(d: Drop): { label: string; cls: string } {
  if (d.opensAt && new Date(d.opensAt).getTime() > Date.now())
    return { label: "Opens soon — verify now", cls: "chip-accent" };
  if (d.remaining <= 0) return { label: "Sold out · waitlist", cls: "chip-neutral" };
  return { label: "On sale", cls: "chip-fv" };
}

export default function DropsPage() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/drops")
      .then((r) => r.json())
      .then((b) => setDrops(b.drops || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <React.Fragment>
      <TopNav here="drops" />
      <main className="wrap">
        <PageHead
          title="Drops"
          subtitle="Every ticket at face value, every buyer one verified human."
        />
        <div data-testid="pilot-drops-list" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
          {loading ? (
            <div className="skel" style={{ height: 90, borderRadius: 22 }}></div>
          ) : drops.length === 0 ? (
            <div className="drops-empty">No drops yet.</div>
          ) : (
            drops.map((d) => {
              const s = statusOf(d);
              return (
                <Link key={d.id} href={`/drop/${d.id}`} className="droprow" data-testid="pilot-drop-row">
                  <div className="ev-cell">
                    <div className="ev">{d.event}</div>
                    <div className="sub">
                      {d.venue} · {d.date}
                    </div>
                  </div>
                  <div>
                    <div className="cell-k">Price</div>
                    <div className="cell-v fan">{fmtMoney(d.faceValue)}</div>
                  </div>
                  <div>
                    <div className="cell-k">Left</div>
                    <div className="cell-v">
                      {d.remaining} / {d.totalInventory}
                    </div>
                  </div>
                  <div>
                    <span className={`chip ${s.cls}`} style={{ fontSize: 11.5 }}>
                      {s.label}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
        <p style={{ marginTop: 24 }}>
          <FaceValueChip amount={drops[0]?.faceValue ?? 20} /> <span style={{ fontSize: 13, color: "var(--muted)", marginLeft: 8 }}>+ $1 fair-access fee · no other fees, ever</span>
        </p>
      </main>
      <Footer />
    </React.Fragment>
  );
}
