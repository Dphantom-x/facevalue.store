// g-center banner on PURE BLACK (#000000) so it blends with X's black profile (no grey panel look).
// Run: node docs/video/assets/render-banner-g-center-black.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = __dirname;
const W = 1500, H = 500;
const BG = '#000000';
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');`;
const RAW = fs.readFileSync(path.join(OUT, 'logo.svg'), 'utf8');
function mark(h, color) {
  const w = Math.round(h * 1.46);
  const svg = RAW.replace('viewBox="0 0 512 512"', 'viewBox="72 140 368 252"').replace('width="100%" height="100%"', `width="${w}" height="${h}"`);
  return `<span style="display:inline-flex;align-items:center;color:${color};line-height:0;">${svg}</span>`;
}

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
*{box-sizing:border-box;} html,body{margin:0;padding:0;width:${W}px;height:${H}px;background:${BG};}
.wrap{position:relative;width:${W}px;height:${H}px;background:${BG};overflow:hidden;font-family:'Hanken Grotesk','SF Pro Display',-apple-system,system-ui,sans-serif;}
.mono{font-family:'JetBrains Mono',ui-monospace,monospace;}
.silver{background:linear-gradient(178deg,#F8FAFC,#D4D9E0 44%,#A8AFBA 58%,#E8ECF1);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
.wm{font-weight:800;color:#fff;letter-spacing:-1px;}
.col{display:flex;flex-direction:column;}
</style></head><body>
<div class="wrap">
  <div style="position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);-webkit-mask-image:linear-gradient(to bottom,#000,rgba(0,0,0,.85) 38%,transparent 95%);mask-image:linear-gradient(to bottom,#000,rgba(0,0,0,.85) 38%,transparent 95%);">${mark(460, 'rgba(255,255,255,0.09)')}</div>
  <div class="col" style="position:absolute;inset:0;align-items:center;justify-content:center;gap:18px;">
    <div class="wm" style="font-size:66px;">FaceValue</div>
    <div style="font-size:32px;font-weight:600;color:#aeb3bd;">Real fans. Real tickets. <span class="silver">Face value.</span></div>
    <div class="mono" style="font-size:19px;letter-spacing:0.14em;color:#5f636b;">facevalue.store</div>
  </div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, 'banner-2-g-center-black.png') });
  console.log('wrote banner-2-g-center-black.png');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
