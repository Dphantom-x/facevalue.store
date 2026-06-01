/* ============================================================
   FaceValue — Home / landing  (airy editorial)
   ============================================================ */

function HomeNav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Brand />
        <div className="nav-links">
          <a href="simulation.html" className="nav-link">Simulation</a>
          <a href="fan.html" className="nav-link">Fan</a>
          <a href="vendor.html" className="nav-link">Vendor</a>
          <ValironMark />
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero aurora">
      <div className="wrap">
        <span className="eyebrow"><span className="pip"></span>Proof-of-personhood ticketing</span>
        <h1>Real fans. Real tickets. <span className="fv">Face value.</span></h1>
        <p className="hero-intro">
          Scalpers win by running <b>bot swarms across fake accounts</b>. FaceValue requires
          proof-of-personhood — one real human, one ticket — and runs every fan's verified agent
          through <b>Valiron's trust gate</b> before any purchase clears.
        </p>
        <div className="hero-cta">
          <a href="simulation.html" className="btn btn-ink btn-lg">▶&nbsp; Watch the live simulation</a>
          <a href="#how" className="btn btn-ghost btn-lg">How it works</a>
        </div>
        <p className="hero-foot">Two gates on every buy — trust (Valiron) + authority (one human, one ticket).</p>

        <div className="hero-visual">
          <div className="float-chip float-gate">
            <span className="pulse gpulse"></span>
            <span className="t"><b>Valiron trust gate</b><span>ALLOW · score 92 · prod</span></span>
          </div>
          <div className="float-chip float-block">
            <span className="pulse rpulse"></span>
            <span className="t"><b>Scalper swarm blocked</b><span>24 agents · sandbox</span></span>
          </div>
          <div className="ticket-card">
            <div className="ticket-top">
              <div className="ticket-row">
                <div>
                  <div className="ticket-ev">Midnight Echo — Live at The Forum</div>
                  <div className="ticket-meta">The Forum, NYC · Sep 12, 2026 · Sec A, Row 7</div>
                </div>
                <FaceValueChip amount={60} />
              </div>
            </div>
            <div className="ticket-perf"></div>
            <div className="ticket-bot">
              <div className="ticket-seal">
                <span className="seal">✓</span>
                <span className="lbl"><b>Verified human</b><span>Bound to identity · non-transferable</span></span>
              </div>
              <span className="ticket-id">#ME-FORUM-001</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Doors() {
  return (
    <section className="wrap">
      <div className="doors">
        <a href="simulation.html" className="door door-primary">
          <div>
            <div className="door-kicker">The centerpiece</div>
            <div className="door-label">Scalpers vs FaceValue — watch it live</div>
          </div>
          <div className="door-foot">
            <div className="door-mini">
              <i style={{ background: "#e2574d" }}></i>
              <i style={{ background: "#e2574d" }}></i>
              <i style={{ background: "#1c9d6b" }}></i>
              <i style={{ background: "#1c9d6b" }}></i>
            </div>
            <span className="door-arrow">→</span>
          </div>
        </a>

        <a href="fan.html" className="door">
          <div>
            <div className="door-kicker">For fans</div>
            <div className="door-label">Verify &amp; get your ticket</div>
          </div>
          <div className="door-foot">
            <span className="chip chip-fv" style={{ fontSize: 11.5, padding: "5px 11px" }}>1 human · 1 ticket</span>
            <span className="door-arrow">→</span>
          </div>
        </a>

        <a href="vendor.html" className="door">
          <div>
            <div className="door-kicker">For vendors</div>
            <div className="door-label">Launch a verified-fan drop</div>
          </div>
          <div className="door-foot">
            <span className="chip chip-accent" style={{ fontSize: 11.5, padding: "5px 11px" }}>Scalpers excluded</span>
            <span className="door-arrow">→</span>
          </div>
        </a>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">The problem</span>
          <h2 className="sec-title">Tickets vanish in seconds — then reappear at <span className="fv">5–10× face value.</span></h2>
          <p className="sec-lead">
            Scalpers win because today's defenses verify <i>accounts</i>, and accounts are trivial to fake.
            It's been illegal since the BOTS Act of 2016, and it's still everywhere.
          </p>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="n red">5–10×</div>
            <div className="k">face value on resale — <b>the markup scalpers pocket</b> from real fans.</div>
          </div>
          <div className="stat">
            <div className="n red">~24</div>
            <div className="k">fake accounts a single swarm runs <b>per drop</b> to sweep inventory.</div>
          </div>
          <div className="stat">
            <div className="n">2016</div>
            <div className="k">the year the BOTS Act made it illegal. <b>Account-based defenses still lose.</b></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function How() {
  const steps = [
    { n: "1", t: "A vendor launches a drop", p: "Artists, venues and promoters configure a verified-fan release — face value, inventory, one ticket per human." },
    { n: "2", t: "Each fan proves personhood", p: "One real human verifies once with World ID. No camping, no fake accounts, no swarm to hide behind." },
    { n: "3", t: "A verified agent buys", p: "Their identity-backed agent clears Valiron's trust gate and grabs one ticket at face value the instant it drops." },
  ];
  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow accent">How it works</span>
          <h2 className="sec-title">Two gates fire on <span className="fv">every single buy.</span></h2>
          <p className="sec-lead">
            A trust gate asks Valiron: is this a real, identity-backed agent — not a Sybil swarm?
            An authority gate enforces policy: one ticket per verified human, at face value.
          </p>
        </div>
        <div className="steps">
          {steps.map((s) => (
            <div className="step" key={s.n}>
              <div className="num">{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-head" style={{ marginBottom: 40 }}>
          <span className="eyebrow">Who it's for</span>
          <h2 className="sec-title">Built for the fans. <span className="fv">Bought by the vendors.</span></h2>
        </div>
        <div className="audience">
          <div className="aud aud-fan">
            <span className="tag">For fans</span>
            <h3>One human, one ticket, face value.</h3>
            <ul>
              <li><span className="ck">✓</span>Prove you're one real person — just once.</li>
              <li><span className="ck">✓</span>Your verified agent buys the moment the drop opens.</li>
              <li><span className="ck">✓</span>No camping, no swarm, no scalper ahead of you.</li>
              <li><span className="ck">✓</span>The ticket is bound to you — non-transferable.</li>
            </ul>
            <div className="go"><a href="fan.html" className="btn btn-fan">Verify &amp; get your ticket →</a></div>
          </div>
          <div className="aud aud-vendor">
            <span className="tag">For vendors</span>
            <h3>Real buyers. Scalpers structurally excluded.</h3>
            <ul>
              <li><span className="ck">✓</span>Every buyer is an identity-verified human.</li>
              <li><span className="ck">✓</span>Bot swarms bounce off the Valiron trust gate.</li>
              <li><span className="ck">✓</span>Resale on your product is killed at the source.</li>
              <li><span className="ck">✓</span>You get a clean, real demand signal.</li>
            </ul>
            <div className="go"><a href="vendor.html" className="btn btn-accent">Launch a verified-fan drop →</a></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <React.Fragment>
      <HomeNav />
      <Hero />
      <Doors />
      <Problem />
      <How />
      <Audience />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Home />);
