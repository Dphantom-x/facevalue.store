/* ============================================================
   FaceValue — mock API layer + persistent store (prototype)
   Field names + response shapes mirror the real engine exactly,
   so this markup ports onto the live routes with no logic change.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "fv_store_v3";

  var FAN_AGENT = { agentId: "25459", chain: "ethereum" };
  var SCALPER_AGENT = { agentId: "1226", chain: "solana" };

  function seed() {
    return {
      drops: [
        {
          id: "midnight-echo-the-forum",
          artist: "Midnight Echo",
          event: "Midnight Echo — Live at The Forum",
          venue: "The Forum, NYC",
          date: "2026-09-12",
          faceValue: 60,
          remaining: 4,
          totalInventory: 5,
          maxPerHuman: 1,
          mode: "full",
        },
      ],
      // dropId -> [nullifierHash, ...] of humans who already hold one
      claimed: { "midnight-echo-the-forum": [] },
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) { var s = seed(); save(s); return s; }
      return JSON.parse(raw);
    } catch (e) { return seed(); }
  }
  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }

  function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function jitter(base, spread) { return base + Math.round(Math.random() * spread); }

  /* ----- trust profiles (real-call analogue) ----- */
  function trustFor(agentId, chain) {
    if (agentId === FAN_AGENT.agentId) {
      return {
        allow: true,
        route: "prod",
        score: 92,
        tier: "Good Agent",
        riskLevel: "low",
        reasons: [
          "Human-agent link verified via World ID (device)",
          "Good on-chain reputation: 5 feedback, 92 avg score",
          "No Valiron behavioral data yet — routing to prod",
        ],
        agentName: "Valiron Good Agent #1 (Demo)",
        worldIdVerified: true,
        agentId: agentId,
        chain: chain || "ethereum",
      };
    }
    if (agentId === SCALPER_AGENT.agentId) {
      return {
        allow: false,
        route: "sandbox",
        score: 0,
        tier: "Unverified",
        riskLevel: "high",
        reasons: [
          "Low on-chain reputation: 0 feedback, 0 avg score",
          "No human-agent link — proof-of-personhood absent",
          "No Valiron data — needs sandbox evaluation",
        ],
        agentName: "NoahScout_Bot.noah",
        worldIdVerified: false,
        agentId: agentId,
        chain: chain || "solana",
      };
    }
    // unknown
    return {
      allow: false, route: "sandbox", score: null, tier: null, riskLevel: null,
      reasons: ["Unknown agent — no trust record"], agentName: null,
      worldIdVerified: false, agentId: agentId, chain: chain || "",
    };
  }

  function randHash() {
    var hex = "0123456789abcdef";
    var s = "0x";
    for (var i = 0; i < 40; i++) s += hex[Math.floor(Math.random() * 16)];
    return s;
  }

  var api = {
    // GET /api/drops
    async getDrops() {
      await delay(jitter(360, 240));
      var s = load();
      return { status: 200, data: { drops: s.drops.map(function (d) { return Object.assign({}, d); }) } };
    },

    // POST /api/trust-check  (read-only, repeatable)
    async trustCheck(agentId, chain) {
      // verified fan's first call is slower — "may wake the server"
      var base = agentId === FAN_AGENT.agentId ? 1400 : 820;
      await delay(jitter(base, 500));
      return { status: 200, data: { trust: trustFor(agentId, chain) } };
    },

    // POST /api/world-id/verify
    async worldIdVerify() {
      await delay(jitter(1100, 500));
      return {
        status: 200,
        data: { ok: true, nullifierHash: randHash(), verificationLevel: "device", simulated: true },
      };
    },

    // POST /api/drop/purchase
    async purchase(body) {
      await delay(jitter(900, 400));
      var s = load();
      var drop = s.drops.find(function (d) { return d.id === body.dropId; });
      if (!drop) {
        return { status: 404, data: { decision: "denied", message: "Drop not found.", code: "NOT_FOUND" } };
      }
      // trust gate first
      var trust = trustFor(body.agentId, body.chain);
      if (!trust.allow) {
        return {
          status: 403,
          data: { decision: "denied", message: "Agent blocked by Valiron trust gate.", stage: "trust", trust: trust },
        };
      }
      var claimed = s.claimed[drop.id] || (s.claimed[drop.id] = []);
      if (body.humanId && claimed.indexOf(body.humanId) !== -1) {
        return {
          status: 409,
          data: {
            decision: "denied",
            message: "One ticket per verified human — you already have yours.",
            stage: "policy", code: "LIMIT_REACHED", trust: trust,
          },
        };
      }
      if (drop.remaining <= 0) {
        return {
          status: 409,
          data: { decision: "denied", message: "This drop is sold out.", stage: "policy", code: "SOLD_OUT", trust: trust },
        };
      }
      // approve
      drop.remaining -= 1;
      if (body.humanId) claimed.push(body.humanId);
      var n = drop.totalInventory - drop.remaining;
      var ticketId = drop.id + "-" + String(n).padStart(3, "0");
      save(s);
      return {
        status: 200,
        data: {
          decision: "approved",
          message: "Ticket secured at face value $" + drop.faceValue + " — bound to your verified identity, non-transferable.",
          ticketId: ticketId, remaining: drop.remaining, faceValue: drop.faceValue, trust: trust,
        },
      };
    },

    // POST /api/vendor/drops
    async vendorCreateDrop(form) {
      await delay(jitter(900, 350));
      var s = load();
      var slug = (form.event || form.artist || "drop")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)
        + "-" + Math.random().toString(36).slice(2, 6);
      var drop = {
        id: slug,
        artist: form.artist, event: form.event, venue: form.venue, date: form.date,
        faceValue: Number(form.faceValue), remaining: Number(form.totalInventory),
        totalInventory: Number(form.totalInventory), maxPerHuman: Number(form.maxPerHuman),
        mode: form.mode,
      };
      s.drops.unshift(drop);
      s.claimed[drop.id] = [];
      save(s);
      return { status: 200, data: { ok: true, drop: drop } };
    },

    resetStore() { var s = seed(); save(s); return s; },
  };

  function fmtMoney(n) { return "$" + Number(n).toLocaleString("en-US"); }
  function shortHash(h) {
    if (!h) return "—";
    return h.slice(0, 8) + "…" + h.slice(-4);
  }

  window.FV = {
    api: api,
    FAN_AGENT: FAN_AGENT,
    SCALPER_AGENT: SCALPER_AGENT,
    fmtMoney: fmtMoney,
    shortHash: shortHash,
  };
})();
