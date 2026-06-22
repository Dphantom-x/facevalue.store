// Variations of g-center on PURE BLACK (#000000): different lighting/atmosphere. Faded ghost mark + centered lockup.
// Run: node docs/video/assets/render-banner-g-variations.js
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
const GHOST = `<div style="position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);z-index:2;-webkit-mask-image:linear-gradient(to bottom,#000,rgba(0,0,0,.85) 38%,transparent 95%);mask-image:linear-gradient(to bottom,#000,rgba(0,0,0,.85) 38%,transparent 95%);">${mark(460, 'rgba(255,255,255,0.09)')}</div>`;
const LOCKUP = `<div style="position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;">
  <div style="font-weight:800;color:#fff;letter-spacing:-1px;font-size:66px;">FaceValue</div>
  <div style="font-size:32px;font-weight:600;color:#aeb3bd;">Real fans. Real tickets. <span style="background:linear-gradient(178deg,#F8FAFC,#D4D9E0 44%,#A8AFBA 58%,#E8ECF1);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">Face value.</span></div>
  <div style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:19px;letter-spacing:0.14em;color:#5f636b;">facevalue.store</div>
</div>`;
function doc(lighting) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
  *{box-sizing:border-box;} html,body{margin:0;padding:0;width:${W}px;height:${H}px;background:#000000;}
  .wrap{position:relative;width:${W}px;height:${H}px;background:#000000;overflow:hidden;font-family:'Hanken Grotesk','SF Pro Display',-apple-system,system-ui,sans-serif;}
  </style></head><body><div class="wrap">${lighting}${GHOST}${LOCKUP}</div></body></html>`;
}

const VARIANTS = {
  // 1) single soft DIAGONAL light ray crossing the banner
  'ray': doc(`<div style="position:absolute;inset:-15%;z-index:1;background:linear-gradient(122deg, transparent 30%, rgba(255,255,255,0.05) 43%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.05) 57%, transparent 70%);filter:blur(7px);"></div>`),

  // 2) double diagonal GOD-RAYS descending from the top
  'godrays': doc(`
    <div style="position:absolute;top:-35%;left:30%;width:150px;height:170%;z-index:1;background:linear-gradient(to bottom, rgba(255,255,255,0.14), rgba(255,255,255,0.03) 60%, transparent);transform:rotate(20deg);filter:blur(28px);"></div>
    <div style="position:absolute;top:-35%;left:46%;width:110px;height:170%;z-index:1;background:linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 60%, transparent);transform:rotate(20deg);filter:blur(26px);"></div>
    <div style="position:absolute;top:-35%;left:58%;width:90px;height:170%;z-index:1;background:linear-gradient(to bottom, rgba(255,255,255,0.07), transparent 60%);transform:rotate(20deg);filter:blur(24px);"></div>`),

  // 3) soft SPOTLIGHT from top-center
  'spotlight': doc(`<div style="position:absolute;inset:0;z-index:1;background:radial-gradient(120% 85% at 50% -12%, rgba(255,255,255,0.13), rgba(255,255,255,0.03) 34%, transparent 60%);"></div>`),

  // 4) tight GLOW behind the wordmark (pool of light)
  'glow': doc(`<div style="position:absolute;left:50%;top:45%;transform:translate(-50%,-50%);z-index:1;width:820px;height:320px;background:radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.11), transparent 68%);filter:blur(24px);"></div>`),

  // 5) subtle GREEN ambient glow from the top-right (brand tint)
  'green': doc(`
    <div style="position:absolute;right:-6%;top:-45%;width:640px;height:640px;border-radius:50%;z-index:1;background:radial-gradient(50% 50% at 50% 50%, rgba(52,160,111,0.18), transparent 70%);filter:blur(75px);"></div>
    <div style="position:absolute;left:-8%;bottom:-50%;width:560px;height:560px;border-radius:50%;z-index:1;background:radial-gradient(50% 50% at 50% 50%, rgba(150,170,200,0.10), transparent 70%);filter:blur(75px);"></div>`),
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const [name, html] of Object.entries(VARIANTS)) {
    await page.setContent(html, { waitUntil: 'load' });
    try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, 'banner-g2-' + name + '.png') });
    console.log('wrote banner-g2-' + name + '.png');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
