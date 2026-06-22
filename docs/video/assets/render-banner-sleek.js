// Sleek/modern FaceValue X header banners (1500x500) — NO numbers, inline transparent SVG logo (no black box).
// Run: node docs/video/assets/render-banner-sleek.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = __dirname;
const W = 1500, H = 500;
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');`;
const RAW = fs.readFileSync(path.join(OUT, 'logo.svg'), 'utf8');
// tight-cropped, recolorable mark at a given height
function mark(h, color) {
  const w = Math.round(h * 1.46);
  const svg = RAW
    .replace('viewBox="0 0 512 512"', 'viewBox="72 140 368 252"')
    .replace('width="100%" height="100%"', `width="${w}" height="${h}"`);
  return `<span style="display:inline-flex;align-items:center;color:${color};line-height:0;">${svg}</span>`;
}

function doc(body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${FONTS}
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;width:${W}px;height:${H}px;background:#09090B;}
  .wrap{position:relative;width:${W}px;height:${H}px;background:#09090B;overflow:hidden;font-family:'Hanken Grotesk','SF Pro Display',-apple-system,system-ui,sans-serif;}
  .mono{font-family:'JetBrains Mono',ui-monospace,monospace;}
  .silver{background:linear-gradient(178deg,#F8FAFC 0%,#D4D9E0 44%,#A8AFBA 58%,#E8ECF1 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
  .row{display:flex;align-items:center;}
  .col{display:flex;flex-direction:column;}
  .wm{font-weight:800;color:#fff;letter-spacing:-1px;}
  </style></head><body><div class="wrap">${body}</div></body></html>`;
}

const CONCEPTS = {
  // 1) MINIMAL — centered lockup, lots of air, subtle cool glow
  'minimal': doc(`
    <div style="position:absolute;top:-240px;left:50%;transform:translateX(-50%);width:1000px;height:700px;background:radial-gradient(50% 50% at 50% 50%, rgba(200,208,222,0.12), rgba(0,0,0,0) 70%);"></div>
    <div class="col" style="position:absolute;inset:0;align-items:center;justify-content:center;gap:22px;">
      ${mark(86, '#fff')}
      <div class="wm" style="font-size:64px;">FaceValue</div>
      <div style="font-size:33px;font-weight:600;color:#aeb3bd;">Real fans. Real tickets. <span class="silver">Face value.</span></div>
      <div class="mono" style="font-size:20px;letter-spacing:0.14em;color:#5f636b;">facevalue.store</div>
    </div>`),

  // 2) OVERSIZED MARK — giant faint logo bleeding off the right as a graphic element
  'graphic': doc(`
    <div style="position:absolute;right:30px;top:50%;transform:translateY(-50%);">${mark(620, 'rgba(255,255,255,0.05)')}</div>
    <div style="position:absolute;right:130px;top:50%;transform:translateY(-50%);width:360px;height:360px;background:radial-gradient(50% 50% at 50% 50%, rgba(200,208,222,0.08), rgba(0,0,0,0) 70%);"></div>
    <div class="col" style="position:absolute;left:120px;top:50%;transform:translateY(-50%);gap:18px;">
      <div class="row" style="gap:18px;">${mark(58, '#fff')}<span class="wm" style="font-size:54px;">FaceValue</span></div>
      <div style="font-size:30px;font-weight:600;color:#aeb3bd;max-width:760px;line-height:1.3;">Identity-verified ticket drops.<br><span class="silver">Real fans only — at face value.</span></div>
      <div class="mono" style="font-size:18px;letter-spacing:0.12em;color:#5f636b;">facevalue.store</div>
    </div>`),

  // 3) THIN-LINE EDITORIAL — lockup | hairline divider | stacked tagline
  'divider': doc(`
    <div class="row" style="position:absolute;inset:0;align-items:center;justify-content:center;gap:54px;">
      <div class="row" style="gap:20px;">${mark(94, '#fff')}<span class="wm" style="font-size:58px;">FaceValue</span></div>
      <div style="width:1px;height:150px;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.22),rgba(255,255,255,0));"></div>
      <div class="col" style="gap:4px;">
        <div style="font-size:30px;font-weight:700;color:#e6e9ee;line-height:1.28;">Real fans.<br>Real tickets.<br><span class="silver">Face value.</span></div>
      </div>
    </div>`),

  // 4) STATEMENT — sleek no-number line
  'statement': doc(`
    <div style="position:absolute;top:-220px;left:50%;transform:translateX(-50%);width:1000px;height:680px;background:radial-gradient(50% 50% at 50% 50%, rgba(200,208,222,0.10), rgba(0,0,0,0) 70%);"></div>
    <div class="col" style="position:absolute;inset:0;align-items:center;justify-content:center;gap:30px;">
      <div style="font-size:76px;font-weight:800;letter-spacing:-0.03em;color:#fff;line-height:1.04;text-align:center;">No bots. No scalpers.<br>Just <span class="silver">real fans.</span></div>
      <div class="row" style="gap:14px;">${mark(40, '#fff')}<span class="wm" style="font-size:30px;">FaceValue</span><span class="mono" style="font-size:20px;color:#5f636b;">&nbsp;·&nbsp; facevalue.store</span></div>
    </div>`),

  // 5) LETTERSPACED LUXURY — monochrome, ultra-minimal
  'luxe': doc(`
    <div class="col" style="position:absolute;inset:0;align-items:center;justify-content:center;gap:30px;">
      ${mark(88, '#fff')}
      <div style="font-size:46px;font-weight:700;color:#fff;letter-spacing:0.42em;padding-left:0.42em;">FACEVALUE</div>
      <div class="mono" style="font-size:18px;letter-spacing:0.34em;color:#6b6f77;padding-left:0.34em;">REAL FANS · REAL TICKETS · FACE VALUE</div>
    </div>`),
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const [name, html] of Object.entries(CONCEPTS)) {
    await page.setContent(html, { waitUntil: 'load' });
    try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, 'banner-s-' + name + '.png') });
    console.log('wrote banner-s-' + name + '.png');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
