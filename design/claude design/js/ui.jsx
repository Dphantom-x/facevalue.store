/* ============================================================
   FaceValue — shared UI components (exported to window)
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* Wordmark glyph: "F" mark */
function Brand({ size }) {
  return (
    <a href="index.html" className="brand" style={size === "lg" ? { fontSize: 22 } : null}>
      <span className="glyph">F</span>
      <span>FaceValue</span>
    </a>
  );
}

function ValironMark() {
  return (
    <span className="nav-valiron" title="Built on Valiron agent-identity infrastructure">
      <span className="dot"></span>
      Valiron · live
    </span>
  );
}

/* Sticky top nav for inner pages */
function TopNav({ here }) {
  const links = [
    { href: "simulation.html", label: "Simulation", key: "simulation" },
    { href: "fan.html", label: "Fan", key: "fan" },
    { href: "vendor.html", label: "Vendor", key: "vendor" },
  ];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Brand />
        <div className="nav-links">
          {links.map((l) => (
            <a key={l.key} href={l.href} className={"nav-link" + (here === l.key ? " here" : "")}>
              {l.label}
            </a>
          ))}
          <ValironMark />
        </div>
      </div>
    </nav>
  );
}

/* Header band used on the three inner pages */
function PageHead({ title, subtitle, right }) {
  return (
    <header className="pagehead">
      <a href="index.html" className="backlink">← FaceValue</a>
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

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <Brand />
        <span className="footer-mark">Built on Valiron agent-identity infrastructure.</span>
      </div>
    </footer>
  );
}

/* Face value chip — recurring anti-gouge motif */
function FaceValueChip({ amount, size }) {
  return (
    <span className="chip chip-fv" style={size === "lg" ? { fontSize: 15, padding: "9px 15px" } : null}>
      Face value <span className="mono">{FV.fmtMoney(amount)}</span>
      <span className="check">✓</span>
    </span>
  );
}

/* Small inline spinner */
function Spinner({ tone }) {
  return <span className={"spin" + (tone ? " spin-" + tone : "")} aria-hidden="true"></span>;
}

/* Mode pill for drops */
function ModePill({ mode }) {
  const label = mode === "full" ? "Full pipeline" : mode === "hybrid" ? "Hybrid" : "Lottery";
  return <span className="chip chip-neutral" style={{ fontSize: 12, padding: "4px 10px" }}>{label}</span>;
}

Object.assign(window, {
  Brand, ValironMark, TopNav, PageHead, Footer, FaceValueChip, Spinner, ModePill,
});
