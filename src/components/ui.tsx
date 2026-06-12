"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { fmtMoney } from "@/lib/format";

export function Brand({ size }: { size?: string }) {
  return (
    <Link href="/" className="brand" style={size === "lg" ? { fontSize: 22 } : undefined}>
      <span className="glyph">F</span>
      <span>FaceValue</span>
    </Link>
  );
}

export function ValironMark() {
  return (
    <span className="nav-valiron" title="Built on Valiron agent-identity infrastructure">
      <span className="dot"></span>
      Valiron · live
    </span>
  );
}

export function TopNav({ here }: { here?: string }) {
  const links = [
    { href: "/drops", label: "Drops", key: "drops" },
    { href: "/tickets", label: "My tickets", key: "tickets" },
    { href: "/studio", label: "Studio", key: "studio" },
    { href: "/door", label: "Door", key: "door" },
    { href: "/simulation", label: "Simulation", key: "simulation" },
    { href: "/fan", label: "Fan", key: "fan" },
    { href: "/vendor", label: "Vendor", key: "vendor" },
  ];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Brand />
        <div className="nav-links">
          {links.map((l) => (
            <Link key={l.key} href={l.href} className={"nav-link" + (here === l.key ? " here" : "")}>
              {l.label}
            </Link>
          ))}
          <ValironMark />
        </div>
      </div>
    </nav>
  );
}

export function PageHead({
  title,
  subtitle,
  right,
}: {
  title: ReactNode;
  subtitle: ReactNode;
  right?: ReactNode;
}) {
  return (
    <header className="pagehead">
      <Link href="/" className="backlink">
        ← FaceValue
      </Link>
      <div className="pagehead-row">
        <div>
          <h1 className="pagehead-title">{title}</h1>
          <p className="pagehead-sub">{subtitle}</p>
        </div>
        {right ? <div className="pagehead-right">{right}</div> : null}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <Brand />
        <span className="footer-mark">Built on Valiron agent-identity infrastructure.</span>
      </div>
    </footer>
  );
}

export function FaceValueChip({ amount, size }: { amount: number; size?: string }) {
  return (
    <span className="chip chip-fv" style={size === "lg" ? { fontSize: 15, padding: "9px 15px" } : undefined}>
      Face value <span className="mono">{fmtMoney(amount)}</span>
      <span className="check">✓</span>
    </span>
  );
}

export function Spinner({ tone }: { tone?: string }) {
  return <span className={"spin" + (tone ? " spin-" + tone : "")} aria-hidden="true"></span>;
}

export function ModePill({ mode }: { mode: string }) {
  const label = mode === "full" ? "Full pipeline" : mode === "hybrid" ? "Hybrid" : "Lottery";
  return (
    <span className="chip chip-neutral" style={{ fontSize: 12, padding: "4px 10px" }}>
      {label}
    </span>
  );
}
