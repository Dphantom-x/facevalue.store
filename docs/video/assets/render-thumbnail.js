// Renders FaceValue X cover/thumbnail posters (SOLID 1080x1080) — the provocative hook frame.
// Run: node docs/video/assets/render-thumbnail.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = __dirname;
const W = 1080, H = 1080;
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');`;

function thumbHTML({ kicker, headline, sub, size, logo }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${FONTS}
  html,body{margin:0;padding:0;width:${W}px;height:${H}px;background:#09090B;}
  .wrap{position:relative;width:${W}px;height:${H}px;background:#09090B;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Hanken Grotesk','SF Pro Display',-apple-system,system-ui,sans-serif;}
  .glow{position:absolute;top:-180px;left:50%;transform:translateX(-50%);width:780px;height:540px;background:radial-gradient(50% 50% at 50% 50%, rgba(52,160,111,0.22), rgba(52,160,111,0) 70%);filter:blur(6px);pointer-events:none;}
  .inner{position:relative;z-index:2;text-align:center;padding:0 84px;display:flex;flex-direction:column;align-items:center;}
  .kicker{display:inline-flex;align-items:center;gap:11px;font-family:'JetBrains Mono',ui-monospace,monospace;font-weight:600;font-size:24px;letter-spacing:0.22em;color:#45B486;margin-bottom:36px;text-transform:uppercase;}
  .kicker .dot{width:9px;height:9px;border-radius:50%;background:#45B486;box-shadow:0 0 14px rgba(69,180,134,0.95);}
  .head{font-weight:800;font-size:${size}px;line-height:1.02;letter-spacing:-0.03em;color:#ffffff;text-shadow:0 4px 44px rgba(0,0,0,0.6);}
  .head .g{color:#45B486;}
  .sub{margin-top:36px;font-weight:600;font-size:33px;line-height:1.35;color:#aeb3bd;letter-spacing:0.01em;}
  .brand{position:absolute;left:0;right:0;bottom:74px;display:flex;flex-direction:column;align-items:center;gap:15px;z-index:2;}
  .brand .ln{width:62px;height:2px;background:rgba(255,255,255,0.14);border-radius:2px;}
  .brand .lock{display:flex;align-items:center;gap:12px;}
  .brand img{width:50px;height:50px;object-fit:contain;}
  .brand .nm{font-weight:700;font-size:35px;color:#fff;letter-spacing:-0.3px;}
  .brand .url{font-family:'JetBrains Mono',monospace;font-weight:500;font-size:22px;color:#6b7079;letter-spacing:0.06em;}
  </style></head><body>
  <div class="wrap">
    <div class="glow"></div>
    <div class="inner">
      <div class="kicker"><span class="dot"></span>${kicker}</div>
      <div class="head">${headline}</div>
      ${sub ? `<div class="sub">${sub}</div>` : ''}
    </div>
    <div class="brand">
      <div class="ln"></div>
      <div class="lock"><img src="${logo}"/><span class="nm">FaceValue</span></div>
      <div class="url">facevalue.store</div>
    </div>
  </div></body></html>`;
}

const THUMBS = [
  { file: 'thumb-scalping-over.png',    kicker: 'Concert tickets',         headline: 'Scalping<br>is <span class="g">over.</span>',          size: 150, sub: 'Real fans. Real tickets. Face value.' },
  { file: 'thumb-cant-fake-human.png',  kicker: 'One human · one ticket', headline: 'Scalpers can’t<br>fake a <span class="g">human.</span>', size: 104, sub: 'Verified fans only. Always face value.' },
];

(async () => {
  const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, 'logo.png')).toString('base64');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const t of THUMBS) {
    await page.setContent(thumbHTML({ ...t, logo }), { waitUntil: 'load' });
    try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, t.file) });
    console.log('wrote', t.file);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
