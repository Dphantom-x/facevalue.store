/* ============================================================
   FaceValue — Simulation (the centerpiece)
   ============================================================ */
const { useState, useEffect, useRef, useMemo } = React;

const TOTAL = 40;
const SCALPER_COUNT = 36; // Panel A: 36 scalper, 4 fan

function shuffledRanks(n) {
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const rank = new Array(n);
  order.forEach((tileIdx, step) => { rank[tileIdx] = step; });
  return rank;
}

function makeTargetsA() {
  const idx = Array.from({ length: TOTAL }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const fanSet = new Set(idx.slice(0, TOTAL - SCALPER_COUNT));
  return Array.from({ length: TOTAL }, (_, i) => (fanSet.has(i) ? "fan" : "scalper"));
}

const SCALPER_STYLE = { background: "#e2574d", borderColor: "#f1837c", opacity: 1, transform: "scale(1)", boxShadow: "0 0 13px -2px rgba(226,87,77,.6)" };
const FAN_STYLE = { background: "#1c9d6b", borderColor: "#3cc492", opacity: 1, transform: "scale(1)", boxShadow: "0 0 13px -2px rgba(28,157,107,.6)" };

function Grid({ treatment, targets, rank, fill }) {
  return (
    <div className={"grid40 " + treatment}>
      {targets.map((t, i) => {
        const on = fill > rank[i];
        return (
          <div
            key={i}
            className={"tile" + (on ? " filled " + t : "")}
            style={on ? (t === "scalper" ? SCALPER_STYLE : FAN_STYLE) : undefined}
          ></div>
        );
      })}
    </div>
  );
}

function VerdictCard({ kind, tag, state, trust }) {
  const allow = kind === "fan";
  return (
    <div
      className={"vcard " + (state === "result" ? (allow ? "allow" : "deny") : "")}
      data-testid={allow ? "live-fan" : "live-scalper"}
    >
      <div className="vcard-top">
        <span className="vcard-tag">{tag}</span>
        {state === "result" && trust ? (
          <span className="vcard-id">{trust.agentId} · {trust.chain}</span>
        ) : null}
      </div>

      {state === "idle" ? (
        <div className="vloading" style={{ color: "var(--faint)" }}>
          <span className="mono" style={{ fontSize: 13 }}>—</span>
          Run the drop to query Valiron.
        </div>
      ) : null}

      {state === "loading" ? (
        <React.Fragment>
          <div className="vloading">
            <Spinner tone="muted" />
            {allow ? "Checking with Valiron… first call may wake the server" : "Checking with Valiron…"}
          </div>
          <div className="skel vskel" style={{ width: "55%" }}></div>
          <div className="skel vskel" style={{ width: "82%" }}></div>
          <div className="skel vskel" style={{ width: "70%" }}></div>
        </React.Fragment>
      ) : null}

      {state === "empty" ? (
        <div className="vloading"><span className="mono" style={{ fontSize: 18 }}>—</span> No response from Valiron.</div>
      ) : null}

      {state === "result" && trust ? (
        <React.Fragment>
          <div className={"verdict " + (allow ? "allow" : "deny")}>
            <span className="mk">{allow ? "✓" : "✕"}</span>
            <span className="v">{allow ? "ALLOW" : "DENY"}</span>
          </div>
          <div className="vdetail">
            {trust.agentName || "—"} · score {trust.score == null ? "—" : trust.score} · {trust.route}
          </div>
          <div className="vbadges">
            {trust.tier ? <span className="vbadge">{trust.tier}</span> : null}
            {trust.riskLevel ? <span className="vbadge">risk: {trust.riskLevel}</span> : null}
            <span className="vbadge">{trust.worldIdVerified ? "World ID ✓" : "no World ID"}</span>
            <span className="vbadge">→ {trust.route}</span>
          </div>
          <ul className="vreasons">
            {trust.reasons.map((r, i) => (
              <li key={i}><span className="b">{allow ? "✓" : "✕"}</span>{r}</li>
            ))}
          </ul>
        </React.Fragment>
      ) : null}
    </div>
  );
}

function Simulation() {
  const [treatment, setTreatment] = useState("seat");
  const [phase, setPhase] = useState("idle"); // idle | running | done
  const [fill, setFill] = useState(0);
  const [targetsA, setTargetsA] = useState(() => makeTargetsA());
  const [rankA, setRankA] = useState(() => shuffledRanks(TOTAL));
  const targetsB = useMemo(() => Array.from({ length: TOTAL }, () => "fan"), []);
  const rankB = useMemo(() => Array.from({ length: TOTAL }, (_, i) => i), []);

  const [fanCard, setFanCard] = useState("idle");
  const [fanTrust, setFanTrust] = useState(null);
  const [scalperCard, setScalperCard] = useState("idle");
  const [scalperTrust, setScalperTrust] = useState(null);

  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  function run() {
    clearTimeout(timer.current);
    setTargetsA(makeTargetsA());
    setRankA(shuffledRanks(TOTAL));
    setFill(0);
    setPhase("running");

    setFanCard("loading"); setFanTrust(null);
    setScalperCard("loading"); setScalperTrust(null);
    FV.api.trustCheck(FV.FAN_AGENT.agentId, FV.FAN_AGENT.chain).then((res) => {
      const t = res && res.data && res.data.trust;
      if (t) { setFanTrust(t); setFanCard("result"); } else setFanCard("empty");
    }).catch(() => setFanCard("empty"));
    FV.api.trustCheck(FV.SCALPER_AGENT.agentId, FV.SCALPER_AGENT.chain).then((res) => {
      const t = res && res.data && res.data.trust;
      if (t) { setScalperTrust(t); setScalperCard("result"); } else setScalperCard("empty");
    }).catch(() => setScalperCard("empty"));

    const DURATION = 2200;
    const start = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 2);
      setFill(Math.round(eased * TOTAL));
      if (p < 1) { timer.current = setTimeout(tick, 40); }
      else { setFill(TOTAL); setPhase("done"); }
    };
    tick();
  }

  const running = phase === "running";
  const done = phase === "done";

  const aScalper = targetsA.reduce((n, t, i) => n + (fill > rankA[i] && t === "scalper" ? 1 : 0), 0);
  const aFan = targetsA.reduce((n, t, i) => n + (fill > rankA[i] && t === "fan" ? 1 : 0), 0);
  const bFan = Math.min(fill, TOTAL);

  return (
    <React.Fragment>
      <TopNav here="simulation" />
      <main className="wrap" style={{ paddingBottom: 8 }}>
        <PageHead
          title="Scalpers vs FaceValue"
          subtitle="One ticket drop, two worlds. Watch what changes when every buyer must be a verified human."
          right={
            <div className="sim-toolbar">
              <div className="seg" role="group" aria-label="Tile style">
                <button aria-pressed={treatment === "seat"} onClick={() => setTreatment("seat")}>
                  <span className="ic">▦</span> Seat map
                </button>
                <button aria-pressed={treatment === "crowd"} onClick={() => setTreatment("crowd")}>
                  <span className="ic">◍</span> Crowd
                </button>
              </div>
              <button className="btn btn-ink btn-lg" data-testid="run-button" onClick={run} disabled={running}>
                {running ? <React.Fragment><Spinner /> Running…</React.Fragment> : "▶  Run the drop"}
              </button>
            </div>
          }
        />

        <section className="panels">
          <div className="panel panel-A">
            <div className="panel-head">
              <span className="panel-tag"><span className="pip"></span>Today — no verification</span>
              <div className="panel-title">Bots sweep the drop</div>
              <div className="panel-sub">Bots grab tickets across dozens of fake accounts in seconds.</div>
            </div>
            <div className={"stage" + (running ? " running" : "")}>
              <div className="stage-meter">
                <span className="lab">{treatment === "seat" ? "Seats taken" : "Tickets claimed"}</span>
                <span className="cnt">
                  <span style={{ color: "#f1837c" }}>{aScalper} scalper</span>
                  <span style={{ opacity: .4 }}> · </span>
                  <span style={{ color: "#3cc492" }}>{aFan} fan</span>
                </span>
              </div>
              <Grid treatment={treatment} targets={targetsA} rank={rankA} fill={fill} />
            </div>
            {done ? (
              <div className="summary A" data-testid="modeA-summary">
                <b>Scalpers grabbed <span className="big">36 / 40</span> tickets</b> across <b>24</b> fake accounts.
                Real fans <b>shut out: <span className="big">96</span></b>.
              </div>
            ) : (
              <div className="summary-ph">Run the drop to see the outcome.</div>
            )}
          </div>

          <div className="panel panel-B">
            <div className="panel-head">
              <span className="panel-tag"><span className="pip"></span>With FaceValue — verified humans</span>
              <div className="panel-title">Verified fans seated</div>
              <div className="panel-sub">One proven human, one ticket. The scalper swarm hits the Valiron gate.</div>
            </div>
            <div className={"stage" + (running ? " running" : "")}>
              <div className="stage-meter">
                <span className="lab">{treatment === "seat" ? "Verified fans seated" : "Verified humans"}</span>
                <span className="cnt"><span style={{ color: "#3cc492" }}>{bFan} / 40</span></span>
              </div>
              <Grid treatment={treatment} targets={targetsB} rank={rankB} fill={fill} />
            </div>
            {done ? (
              <div className="summary B" data-testid="modeB-summary">
                <b>All <span className="big">40</span> tickets went to verified fans</b> (one each).
                Scalper swarm <b>blocked: <span className="big">24</span></b>. Resale: <b>0</b>.
              </div>
            ) : (
              <div className="summary-ph">Run the drop to see the outcome.</div>
            )}
          </div>
        </section>

        <section className="live">
          <div className="live-head">
            <span className="eyebrow accent" style={{ background: "var(--accent-wash)", border: "1px solid var(--accent-line)", padding: "6px 13px", borderRadius: "999px" }}>Live · real calls to Valiron</span>
            <h2 style={{ marginTop: 18 }}>Not scripted — this is the actual trust gate.</h2>
            <p className="sub">The same two agents from the drop above, checked live against Valiron's reputation + proof-of-personhood.</p>
          </div>
          <div className="live-cards">
            <VerdictCard kind="fan" tag="Verified fan's agent" state={fanCard} trust={fanTrust} />
            <VerdictCard kind="scalper" tag="Scalper swarm agent" state={scalperCard} trust={scalperTrust} />
          </div>
        </section>
      </main>
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Simulation />);
