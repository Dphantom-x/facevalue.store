// FaceValue banners set 2 (1500x500) — ghost-logo variations + new modern designs. No numbers, inline SVG mark.
// Run: node docs/video/assets/render-banner-set2.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = __dirname;
const W = 1500, H = 500;
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');`;
const RAW = fs.readFileSync(path.join(OUT, 'logo.svg'), 'utf8');
function mark(h, color) {
  const w = Math.round(h * 1.46);
  const svg = RAW.replace('viewBox="0 0 512 512"', 'viewBox="72 140 368 252"').replace('width="100%" height="100%"', `width="${w}" height="${h}"`);
  return `<span style="display:inline-flex;align-items:center;color:${color};line-height:0;">${svg}</span>`;
}
function doc(body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
  *{box-sizing:border-box;} html,body{margin:0;padding:0;width:${W}px;height:${H}px;background:#09090B;}
  .wrap{position:relative;width:${W}px;height:${H}px;background:#09090B;overflow:hidden;font-family:'Hanken Grotesk','SF Pro Display',-apple-system,system-ui,sans-serif;}
  .mono{font-family:'JetBrains Mono',ui-monospace,monospace;}
  .silver{background:linear-gradient(178deg,#F8FAFC,#D4D9E0 44%,#A8AFBA 58%,#E8ECF1);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
  .wm{font-weight:800;color:#fff;letter-spacing:-1px;}
  .col{display:flex;flex-direction:column;} .row{display:flex;align-items:center;}
  </style></head><body><div class="wrap">${body}</div></body></html>`;
}
const TAG = `<span class="silver">Face value.</span>`;

const CONCEPTS = {
  // --- VARIATIONS on the faded-logo idea ---
  // 1) ghost mark directly behind a centered wordmark
  'g-center': doc(`
    <div style="position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);-webkit-mask-image:linear-gradient(to bottom,#000,rgba(0,0,0,.85) 38%,transparent 95%);mask-image:linear-gradient(to bottom,#000,rgba(0,0,0,.85) 38%,transparent 95%);">${mark(460, 'rgba(255,255,255,0.09)')}</div>
    <div class="col" style="position:absolute;inset:0;align-items:center;justify-content:center;gap:18px;">
      <div class="wm" style="font-size:66px;">FaceValue</div>
      <div style="font-size:32px;font-weight:600;color:#aeb3bd;">Real fans. Real tickets. ${TAG}</div>
      <div class="mono" style="font-size:19px;letter-spacing:0.14em;color:#5f636b;">facevalue.store</div>
    </div>`),

  // 2) ghost mark bleeding off the LEFT, fading right; lockup on the right
  'g-left': doc(`
    <div style="position:absolute;left:-150px;top:50%;transform:translateY(-50%);-webkit-mask-image:linear-gradient(to right,#000,#000 28%,transparent 82%);mask-image:linear-gradient(to right,#000,#000 28%,transparent 82%);">${mark(560, 'rgba(255,255,255,0.07)')}</div>
    <div class="col" style="position:absolute;right:150px;top:50%;transform:translateY(-50%);gap:16px;align-items:flex-start;">
      <div class="row" style="gap:18px;">${mark(58, '#fff')}<span class="wm" style="font-size:54px;">FaceValue</span></div>
      <div style="font-size:29px;font-weight:600;color:#aeb3bd;">Real fans. Real tickets. ${TAG}</div>
      <div class="mono" style="font-size:18px;letter-spacing:0.12em;color:#5f636b;">facevalue.store</div>
    </div>`),

  // 3) very large, very faint mark as full-bleed texture, crisp divider lockup on top
  'g-texture': doc(`
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);-webkit-mask-image:linear-gradient(to bottom,#000,transparent 92%);mask-image:linear-gradient(to bottom,#000,transparent 92%);">${mark(760, 'rgba(255,255,255,0.045)')}</div>
    <div class="row" style="position:absolute;inset:0;align-items:center;justify-content:center;gap:54px;">
      <div class="row" style="gap:20px;">${mark(94, '#fff')}<span class="wm" style="font-size:58px;">FaceValue</span></div>
      <div style="width:1px;height:150px;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.22),rgba(255,255,255,0));"></div>
      <div style="font-size:30px;font-weight:700;color:#e6e9ee;line-height:1.28;">Real fans.<br>Real tickets.<br>${TAG}</div>
    </div>`),

  // --- NEW modern designs ---
  // 4) aurora / soft gradient-mesh
  'm-aurora': doc(`
    <div style="position:absolute;left:8%;top:-30%;width:620px;height:620px;border-radius:50%;background:radial-gradient(50% 50% at 50% 50%,rgba(150,170,200,0.20),transparent 70%);filter:blur(70px);"></div>
    <div style="position:absolute;right:4%;bottom:-40%;width:680px;height:680px;border-radius:50%;background:radial-gradient(50% 50% at 50% 50%,rgba(52,160,111,0.16),transparent 70%);filter:blur(80px);"></div>
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:760px;height:520px;background:radial-gradient(50% 50% at 50% 50%,rgba(210,220,235,0.10),transparent 70%);filter:blur(40px);"></div>
    <div class="col" style="position:absolute;inset:0;align-items:center;justify-content:center;gap:20px;">
      ${mark(82, '#fff')}
      <div class="wm" style="font-size:60px;">FaceValue</div>
      <div style="font-size:31px;font-weight:600;color:#c4c8d0;">Real fans. Real tickets. ${TAG}</div>
    </div>`),

  // 5) blueprint grid / verification scan
  'm-grid': doc(`
    <div style="position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent 0,transparent 43px,rgba(255,255,255,0.04) 43px,rgba(255,255,255,0.04) 44px),repeating-linear-gradient(90deg,transparent 0,transparent 43px,rgba(255,255,255,0.04) 43px,rgba(255,255,255,0.04) 44px);-webkit-mask-image:radial-gradient(ellipse 65% 75% at 50% 50%,#000 25%,transparent 78%);mask-image:radial-gradient(ellipse 65% 75% at 50% 50%,#000 25%,transparent 78%);"></div>
    <div style="position:absolute;left:0;right:0;top:50%;height:1px;background:linear-gradient(90deg,transparent,rgba(69,180,134,0.45),transparent);"></div>
    <div class="col" style="position:absolute;inset:0;align-items:center;justify-content:center;gap:18px;">
      <div class="row" style="gap:18px;">${mark(70, '#fff')}<span class="wm" style="font-size:56px;">FaceValue</span></div>
      <div class="mono" style="font-size:18px;letter-spacing:0.2em;color:#7a808a;">REAL FANS · REAL TICKETS · FACE VALUE</div>
    </div>`),

  // 6) cinematic spotlight + vignette (concert stage vibe)
  'm-spotlight': doc(`
    <div style="position:absolute;inset:0;background:radial-gradient(120% 90% at 50% -10%,rgba(255,255,255,0.13),rgba(255,255,255,0.04) 32%,transparent 60%);"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(75% 120% at 50% 45%,transparent 40%,rgba(0,0,0,0.55) 100%);"></div>
    <div class="col" style="position:absolute;inset:0;align-items:center;justify-content:center;gap:20px;">
      ${mark(84, '#fff')}
      <div class="wm" style="font-size:62px;">FaceValue</div>
      <div style="font-size:31px;font-weight:600;color:#b7bcc4;">Real fans. Real tickets. ${TAG}</div>
    </div>`),
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const [name, html] of Object.entries(CONCEPTS)) {
    await page.setContent(html, { waitUntil: 'load' });
    try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, 'banner-2-' + name + '.png') });
    console.log('wrote banner-2-' + name + '.png');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
