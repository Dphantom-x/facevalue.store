// Renders FaceValue social header banners (X/Twitter = 1500x500, 3:1) in two themes: green + silver.
// Content kept in a centered safe band (X crops top/bottom on mobile; avatar overlaps bottom-left).
// Run: node docs/video/assets/render-banner.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = __dirname;
const W = 1500, H = 500;
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');`;

const THEMES = {
  green: {
    accentCSS: 'color:#45B486;',
    glow: 'rgba(52,160,111,0.20)',
    tagBase: '#cfd3da',
  },
  silver: {
    // brushed-chrome gradient clipped to the accent text
    accentCSS: 'background:linear-gradient(178deg,#F7F9FB 0%,#D2D7DE 44%,#A6ADB8 58%,#E6EAEF 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;',
    glow: 'rgba(200,208,222,0.13)',
    tagBase: '#a4a9b3',
  },
};

function shell(inner, theme) {
  const t = THEMES[theme];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${FONTS}
  html,body{margin:0;padding:0;width:${W}px;height:${H}px;background:#09090B;}
  .wrap{position:relative;width:${W}px;height:${H}px;background:#09090B;overflow:hidden;display:flex;align-items:center;justify-content:center;font-family:'Hanken Grotesk','SF Pro Display',-apple-system,system-ui,sans-serif;}
  .glow{position:absolute;top:-260px;left:50%;transform:translateX(-50%);width:1100px;height:760px;background:radial-gradient(50% 50% at 50% 50%, ${t.glow}, rgba(0,0,0,0) 70%);filter:blur(8px);pointer-events:none;}
  .inner{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;}
  .g{${t.accentCSS}}
  .lock{display:flex;align-items:center;gap:18px;}
  .lock img{width:74px;height:74px;object-fit:contain;}
  .lock .nm{font-weight:800;font-size:62px;color:#fff;letter-spacing:-1px;}
  .tag{font-weight:600;font-size:38px;color:${t.tagBase};letter-spacing:0.2px;}
  .head{font-weight:800;font-size:90px;letter-spacing:-0.03em;color:#fff;line-height:1;text-shadow:0 4px 40px rgba(0,0,0,0.6);}
  .meta{display:flex;align-items:center;gap:14px;font-family:'JetBrains Mono',ui-monospace,monospace;font-weight:500;font-size:22px;color:#6b7079;letter-spacing:0.06em;}
  .meta .pip{width:4px;height:4px;border-radius:50%;background:#3a3d44;}
  .smalllock{display:flex;align-items:center;gap:11px;}
  .smalllock img{width:38px;height:38px;object-fit:contain;}
  .smalllock .nm{font-weight:700;font-size:30px;color:#fff;letter-spacing:-0.3px;}
  </style></head><body><div class="wrap"><div class="glow"></div><div class="inner">${inner}</div></div></body></html>`;
}

const BANNERS = [
  { file: 'banner-x', inner: (logo) => `
    <div class="lock" style="margin-bottom:22px;"><img src="${logo}"/><span class="nm">FaceValue</span></div>
    <div class="tag" style="margin-bottom:20px;">Real fans. Real tickets. <span class="g">Face value.</span></div>
    <div class="meta"><span>facevalue.store</span><span class="pip"></span><span>Built on Valiron</span></div>
  ` },
  { file: 'banner-x-statement', inner: (logo) => `
    <div class="head" style="margin-bottom:26px;">Scalping is <span class="g">over.</span></div>
    <div class="smalllock"><img src="${logo}"/><span class="nm">FaceValue</span><span style="color:#3a3d44;font-size:24px;">·</span><span style="font-family:'JetBrains Mono',monospace;font-size:22px;color:#6b7079;letter-spacing:0.06em;">facevalue.store</span></div>
  ` },
];

(async () => {
  const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, 'logo.png')).toString('base64');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const theme of ['green', 'silver']) {
    for (const b of BANNERS) {
      const suffix = theme === 'silver' ? '-silver' : '';
      await page.setContent(shell(b.inner(logo), theme), { waitUntil: 'load' });
      try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT, b.file + suffix + '.png') });
      console.log('wrote', b.file + suffix + '.png');
    }
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
