// Divider banner + a large FV mark centered in the background, faded with a top->bottom gradient.
// Run: node docs/video/assets/render-banner-divider-ghost.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = __dirname;
const W = 1500, H = 500;
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');`;
const RAW = fs.readFileSync(path.join(OUT, 'logo.svg'), 'utf8');
function mark(h, color) {
  const w = Math.round(h * 1.46);
  const svg = RAW
    .replace('viewBox="0 0 512 512"', 'viewBox="72 140 368 252"')
    .replace('width="100%" height="100%"', `width="${w}" height="${h}"`);
  return `<span style="display:inline-flex;align-items:center;color:${color};line-height:0;">${svg}</span>`;
}
// big centered background mark, faded top->bottom
function ghost(h, alpha, fadeEnd) {
  const m = `linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.85) 38%, transparent ${fadeEnd}%)`;
  return `<div style="position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);z-index:1;-webkit-mask-image:${m};mask-image:${m};">${mark(h, `rgba(255,255,255,${alpha})`)}</div>`;
}
function fg(withMark) {
  const lock = withMark
    ? `<div style="display:flex;align-items:center;gap:20px;">${mark(94, '#fff')}<span style="font-weight:800;color:#fff;letter-spacing:-1px;font-size:58px;">FaceValue</span></div>`
    : `<span style="font-weight:800;color:#fff;letter-spacing:-1px;font-size:58px;">FaceValue</span>`;
  return `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:54px;z-index:2;">
    ${lock}
    <div style="width:1px;height:150px;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.22),rgba(255,255,255,0));"></div>
    <div style="font-size:30px;font-weight:700;color:#e6e9ee;line-height:1.28;">Real fans.<br>Real tickets.<br><span style="background:linear-gradient(178deg,#F8FAFC,#D4D9E0 44%,#A8AFBA 58%,#E8ECF1);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">Face value.</span></div>
  </div>`;
}
function doc(inner) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
  *{box-sizing:border-box;} html,body{margin:0;padding:0;width:${W}px;height:${H}px;background:#09090B;}
  .wrap{position:relative;width:${W}px;height:${H}px;background:#09090B;overflow:hidden;font-family:'Hanken Grotesk','SF Pro Display',-apple-system,system-ui,sans-serif;}
  </style></head><body><div class="wrap">${inner}</div></body></html>`;
}

const VARIANTS = {
  // keep the divider's small lockup mark + a subtle ghost behind
  'divider-ghost': doc(ghost(460, 0.085, 96) + fg(true)),
  // drop the small lockup mark — the big faded mark IS the logo
  'divider-ghostonly': doc(ghost(470, 0.12, 96) + fg(false)),
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const [name, html] of Object.entries(VARIANTS)) {
    await page.setContent(html, { waitUntil: 'load' });
    try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, 'banner-s-' + name + '.png') });
    console.log('wrote banner-s-' + name + '.png');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
