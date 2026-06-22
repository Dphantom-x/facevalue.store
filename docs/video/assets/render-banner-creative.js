// Creative FaceValue X header banners (1500x500) — 5 distinct layouts/concepts.
// Run: node docs/video/assets/render-banner-creative.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = __dirname;
const W = 1500, H = 500;
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');`;
const GREEN = '#45B486', RED = '#D6445A';
const CHECK = (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="${c}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const PERSON = (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.6" stroke="${c}" stroke-width="2"/><path d="M5.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" stroke="${c}" stroke-width="2" stroke-linecap="round"/></svg>`;

function doc(body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${FONTS}
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;width:${W}px;height:${H}px;background:#09090B;}
  .wrap{position:relative;width:${W}px;height:${H}px;background:#09090B;overflow:hidden;font-family:'Hanken Grotesk','SF Pro Display',-apple-system,system-ui,sans-serif;}
  .mono{font-family:'JetBrains Mono',ui-monospace,monospace;}
  .silver{background:linear-gradient(178deg,#F7F9FB 0%,#D2D7DE 44%,#A6ADB8 58%,#E6EAEF 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
  .row{display:flex;align-items:center;}
  </style></head><body><div class="wrap">${body}</div></body></html>`;
}

const CONCEPTS = {
  // 1) SPLIT — $840 (scalpers) -> $60 (face value)
  'split': (logo) => doc(`
    <div style="position:absolute;inset:0;display:flex;">
      <div style="flex:0 0 42%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:radial-gradient(62% 80% at 50% 50%, rgba(214,68,90,0.10), rgba(0,0,0,0) 75%);">
        <div class="mono" style="font-size:19px;letter-spacing:0.22em;color:#C2596A;text-transform:uppercase;">Scalpers</div>
        <div style="position:relative;font-size:100px;font-weight:800;color:#E2E5EA;letter-spacing:-2px;">$840<span style="position:absolute;left:-7%;right:-7%;top:52%;height:7px;background:${RED};border-radius:4px;transform:rotate(-9deg);box-shadow:0 0 16px rgba(214,68,90,0.5);"></span></div>
        <div style="font-size:18px;font-weight:600;color:#80858e;">bots · markups · crashes</div>
      </div>
      <div style="position:absolute;left:42%;top:50%;transform:translate(-50%,-50%);z-index:3;width:66px;height:66px;border-radius:50%;background:#0c0d10;border:1px solid #ffffff1f;display:flex;align-items:center;justify-content:center;color:${GREEN};font-size:30px;">&rarr;</div>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:radial-gradient(62% 80% at 50% 46%, rgba(52,160,111,0.15), rgba(0,0,0,0) 75%);border-left:1px solid #ffffff0d;">
        <div class="mono" style="font-size:19px;letter-spacing:0.22em;color:${GREEN};text-transform:uppercase;">Face value</div>
        <div style="font-size:100px;font-weight:800;color:#fff;letter-spacing:-2px;">$60</div>
        <div class="row" style="gap:15px;"><span class="row" style="gap:9px;"><img src="${logo}" style="width:32px;height:32px;"/><span style="font-weight:800;font-size:27px;color:#fff;letter-spacing:-0.5px;">FaceValue</span></span><span class="mono" style="font-size:17px;color:#6b7079;">facevalue.store</span></div>
      </div>
    </div>`),

  // 2) TICKET STUB — ticket with perforation + verified stub
  'ticket': (logo) => doc(`
    <div style="position:absolute;inset:32px;border-radius:22px;background:linear-gradient(135deg,#101319,#0b0c10);border:1px solid #ffffff14;display:flex;">
      <div style="position:absolute;left:71%;top:14px;bottom:14px;border-left:2px dashed #ffffff26;"></div>
      <div style="position:absolute;left:71%;top:-17px;width:34px;height:34px;border-radius:50%;background:#09090B;transform:translateX(-50%);"></div>
      <div style="position:absolute;left:71%;bottom:-17px;width:34px;height:34px;border-radius:50%;background:#09090B;transform:translateX(-50%);"></div>
      <div style="flex:0 0 71%;padding:0 64px;display:flex;flex-direction:column;justify-content:center;gap:16px;">
        <div class="row" style="gap:17px;"><img src="${logo}" style="width:58px;height:58px;"/><span style="font-weight:800;font-size:50px;color:#fff;letter-spacing:-1px;">FaceValue</span></div>
        <div style="font-size:29px;font-weight:600;color:#cfd3da;">Real fans. Real tickets. <span class="silver">Face value.</span></div>
        <div class="mono" style="font-size:16px;letter-spacing:0.18em;color:#6b7079;text-transform:uppercase;">Admit one&nbsp;&nbsp;·&nbsp;&nbsp;real fans only&nbsp;&nbsp;·&nbsp;&nbsp;facevalue.store</div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;text-align:center;">
        <div class="mono" style="font-size:14px;letter-spacing:0.2em;color:#8b8f98;">FACE VALUE</div>
        <div style="font-size:50px;font-weight:800;color:#fff;letter-spacing:-1px;">$60</div>
        <div class="row" style="gap:7px;color:${GREEN};">${CHECK(GREEN, 17)}<span style="font-size:15px;font-weight:700;letter-spacing:0.05em;">VERIFIED</span></div>
      </div>
    </div>`),

  // 3) EDITORIAL — left-aligned lockup + oversized faded mark bleeding off the right
  'editorial': (logo) => doc(`
    <div style="position:absolute;right:60px;top:50%;transform:translateY(-50%);width:340px;height:340px;border-radius:50%;background:radial-gradient(50% 50% at 50% 50%, rgba(200,208,222,0.10), rgba(0,0,0,0) 70%);"></div>
    <img src="${logo}" style="position:absolute;right:-40px;top:50%;transform:translateY(-50%);width:400px;height:400px;opacity:0.08;"/>
    <div style="position:absolute;left:120px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:17px;max-width:880px;">
      <div class="row" style="gap:17px;"><img src="${logo}" style="width:64px;height:64px;"/><span style="font-weight:800;font-size:56px;color:#fff;letter-spacing:-1px;">FaceValue</span></div>
      <div style="font-size:31px;font-weight:600;color:#cfd3da;line-height:1.3;">Identity-verified ticket drops.<br><span class="silver">One human, one ticket — at face value.</span></div>
      <div class="mono" style="font-size:18px;letter-spacing:0.12em;color:#6b7079;">facevalue.store&nbsp;&nbsp;·&nbsp;&nbsp;Built on Valiron</div>
    </div>`),

  // 4) VERIFIED — proof-of-personhood credential: green seal + checklist
  'verified': (logo) => doc(`
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:70px;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
        <div style="width:132px;height:132px;border-radius:50%;background:radial-gradient(circle, rgba(52,160,111,0.18), rgba(52,160,111,0.03));border:2px solid rgba(69,180,134,0.45);display:flex;align-items:center;justify-content:center;box-shadow:0 0 54px rgba(69,180,134,0.28);">${CHECK(GREEN, 62)}</div>
        <div class="mono" style="font-size:16px;letter-spacing:0.22em;color:${GREEN};">VERIFIED FAN</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:15px;">
        <div class="row" style="gap:15px;margin-bottom:4px;"><img src="${logo}" style="width:48px;height:48px;"/><span style="font-weight:800;font-size:42px;color:#fff;letter-spacing:-0.5px;">FaceValue</span></div>
        <div class="row" style="gap:13px;font-size:23px;font-weight:600;color:#d6dae0;">${CHECK(GREEN, 22)}One human, one ticket</div>
        <div class="row" style="gap:13px;font-size:23px;font-weight:600;color:#d6dae0;">${CHECK(GREEN, 22)}No bots. No scalper markups.</div>
        <div class="row" style="gap:13px;font-size:23px;font-weight:600;color:#d6dae0;">${CHECK(GREEN, 22)}Strict face value — always</div>
        <div class="mono" style="font-size:17px;letter-spacing:0.1em;color:#6b7079;margin-top:5px;">facevalue.store</div>
      </div>
    </div>`),

  // 5) EQUATION — 1 human = 1 ticket (FV mark as the ticket)
  'equation': (logo) => doc(`
    <div style="position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:900px;height:560px;background:radial-gradient(50% 50% at 50% 50%, rgba(200,208,222,0.10), rgba(0,0,0,0) 70%);"></div>
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;">
      <div class="mono" style="font-size:18px;letter-spacing:0.26em;color:#8b8f98;">THE RULE</div>
      <div class="row" style="gap:30px;font-size:58px;font-weight:800;color:#fff;letter-spacing:-1px;">
        <span class="row" style="gap:18px;">${PERSON('#fff', 56)} One human</span>
        <span style="font-size:50px;color:#A6ADB8;">=</span>
        <span class="row" style="gap:18px;"><img src="${logo}" style="width:58px;height:58px;"/> one ticket</span>
      </div>
      <div style="font-size:29px;font-weight:600;color:#cfd3da;">at strict <span class="silver">face value.</span></div>
      <div class="mono" style="font-size:18px;letter-spacing:0.12em;color:#6b7079;margin-top:2px;">FaceValue&nbsp;&nbsp;·&nbsp;&nbsp;facevalue.store</div>
    </div>`),
};

(async () => {
  const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, 'logo.png')).toString('base64');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const [name, fn] of Object.entries(CONCEPTS)) {
    await page.setContent(fn(logo), { waitUntil: 'load' });
    try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, 'banner-c-' + name + '.png') });
    console.log('wrote banner-c-' + name + '.png');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
