// Variations of the "Scalping is over." X thumbnail (solid 1080x1080).
// Run: node docs/video/assets/render-thumb-variations.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = __dirname;
const W = 1080, H = 1080;
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');`;
let LOGO = '';

const BASE = `
  ${FONTS}
  *{box-sizing:border-box;}
  .head{font-family:'Hanken Grotesk','SF Pro Display',-apple-system,system-ui,sans-serif;font-weight:800;line-height:1.02;letter-spacing:-0.03em;color:#fff;text-shadow:0 4px 44px rgba(0,0,0,0.6);}
  .head .g{color:#45B486;}
  .head .strike{text-decoration:line-through;text-decoration-color:#E0566A;text-decoration-thickness:0.075em;}
  .head .hl{background:#45B486;color:#06230f;border-radius:16px;padding:0.02em 0.16em;}
  .kicker{display:inline-flex;align-items:center;gap:11px;font-family:'JetBrains Mono',ui-monospace,monospace;font-weight:600;font-size:24px;letter-spacing:0.22em;color:#45B486;text-transform:uppercase;}
  .kicker .dot{width:9px;height:9px;border-radius:50%;background:#45B486;box-shadow:0 0 14px rgba(69,180,134,0.95);}
  .sub{font-family:'Hanken Grotesk',system-ui,sans-serif;font-weight:600;font-size:33px;line-height:1.35;color:#aeb3bd;}
  .glow{position:absolute;top:-180px;left:50%;transform:translateX(-50%);width:780px;height:540px;background:radial-gradient(50% 50% at 50% 50%, rgba(52,160,111,0.22), rgba(52,160,111,0) 70%);filter:blur(6px);pointer-events:none;}
`;

// 1) Standard layout: kicker + headline + sub + brand lockup (the look you liked).
function standardThumb({ kicker, headline, sub, size, bg = '#09090B' }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}
  html,body{margin:0;padding:0;width:${W}px;height:${H}px;background:${bg};}
  .wrap{position:relative;width:${W}px;height:${H}px;background:${bg};overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .inner{position:relative;z-index:2;text-align:center;padding:0 80px;display:flex;flex-direction:column;align-items:center;}
  .kicker{margin-bottom:36px;}
  .head{font-size:${size}px;}
  .sub{margin-top:36px;}
  .brand{position:absolute;left:0;right:0;bottom:74px;display:flex;flex-direction:column;align-items:center;gap:15px;z-index:2;}
  .brand .ln{width:62px;height:2px;background:rgba(255,255,255,0.14);border-radius:2px;}
  .brand .lock{display:flex;align-items:center;gap:12px;}
  .brand img{width:50px;height:50px;object-fit:contain;}
  .brand .nm{font-family:'Hanken Grotesk',system-ui,sans-serif;font-weight:700;font-size:35px;color:#fff;letter-spacing:-0.3px;}
  .brand .url{font-family:'JetBrains Mono',monospace;font-weight:500;font-size:22px;color:#6b7079;letter-spacing:0.06em;}
  </style></head><body><div class="wrap"><div class="glow"></div>
  <div class="inner">${kicker ? `<div class="kicker"><span class="dot"></span>${kicker}</div>` : ''}<div class="head">${headline}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>
  <div class="brand"><div class="ln"></div><div class="lock"><img src="${LOGO}"/><span class="nm">FaceValue</span></div><div class="url">facevalue.store</div></div>
  </div></body></html>`;
}

// 2) End-card twin: big FV mark on top + headline + "Built on Valiron" footer (matches end-card.png).
function endCardThumb({ headline, size, bg = '#000' }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}
  html,body{margin:0;padding:0;width:${W}px;height:${H}px;background:${bg};}
  .wrap{position:relative;width:${W}px;height:${H}px;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;}
  img.logo{width:210px;height:210px;object-fit:contain;margin-bottom:34px;}
  .head{font-size:${size}px;text-align:center;padding:0 70px;}
  .footer{position:absolute;left:0;right:0;bottom:88px;display:flex;flex-direction:column;align-items:center;gap:14px;}
  .built{font-family:'Hanken Grotesk',system-ui,sans-serif;font-size:22px;color:#5c5c61;letter-spacing:0.3px;}
  .built b{color:#8a8a90;font-weight:700;}
  .url{font-family:'JetBrains Mono',monospace;font-weight:500;font-size:28px;color:#e9e9ec;letter-spacing:0.05em;}
  </style></head><body><div class="wrap">
  <img class="logo" src="${LOGO}"/>
  <div class="head">${headline}</div>
  <div class="footer"><div class="built">Built on <b>Valiron</b></div><div class="url">facevalue.store</div></div>
  </div></body></html>`;
}

// 3) Mega-minimal: huge type, no kicker/sub, tiny brand.
function minimalThumb({ headline, size, bg = '#09090B' }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}
  html,body{margin:0;padding:0;width:${W}px;height:${H}px;background:${bg};}
  .wrap{position:relative;width:${W}px;height:${H}px;background:${bg};overflow:hidden;display:flex;align-items:center;justify-content:center;}
  .head{font-size:${size}px;text-align:center;padding:0 64px;position:relative;z-index:2;}
  .bmin{position:absolute;bottom:80px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:11px;z-index:2;}
  .bmin img{width:40px;height:40px;object-fit:contain;}
  .bmin span{font-family:'Hanken Grotesk',system-ui,sans-serif;font-weight:700;font-size:30px;color:#fff;letter-spacing:-0.3px;}
  </style></head><body><div class="wrap"><div class="glow"></div>
  <div class="head">${headline}</div>
  <div class="bmin"><img src="${LOGO}"/><span>FaceValue</span></div>
  </div></body></html>`;
}

const VARS = [
  { file: 'thumb-v-endcard.png',   html: () => endCardThumb({ headline: 'Scalping is <span class="g">over.</span>', size: 86 }) },
  { file: 'thumb-v-strike.png',    html: () => standardThumb({ kicker: 'Concert tickets', headline: '<span class="strike">Scalping</span><br>is <span class="g">over.</span>', size: 150, sub: 'Real fans. Real tickets. Face value.' }) },
  { file: 'thumb-v-minimal.png',   html: () => minimalThumb({ headline: 'Scalping<br>is <span class="g">over.</span>', size: 186 }) },
  { file: 'thumb-v-highlight.png', html: () => standardThumb({ kicker: 'Concert tickets', headline: 'Scalping is<br><span class="hl">over.</span>', size: 148, sub: 'Real fans. Real tickets. Face value.' }) },
];

(async () => {
  LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, 'logo.png')).toString('base64');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const v of VARS) {
    await page.setContent(v.html(), { waitUntil: 'load' });
    try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, v.file) });
    console.log('wrote', v.file);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
