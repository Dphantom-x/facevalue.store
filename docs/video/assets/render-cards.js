// Renders FaceValue title overlays (premium, no pill) + the end-card overlay (matches design screen C).
// Uses the project's own Playwright + Chromium. Run: node docs/video/assets/render-cards.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = __dirname;
const W = 1080, H = 1080;
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap');`;

// Premium centered title overlay: white type + soft radial darken (NO caption pill).
function titleHTML({ title, sub, size = 66 }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${FONTS}
  html,body{margin:0;padding:0;width:${W}px;height:${H}px;background:transparent;}
  .stage{position:relative;width:${W}px;height:${H}px;display:flex;align-items:center;justify-content:center;}
  .scrim{position:absolute;inset:0;background:radial-gradient(58% 40% at 50% 50%, rgba(0,0,0,0.60), rgba(0,0,0,0) 72%);}
  .content{position:relative;text-align:center;max-width:860px;padding:0 60px;}
  .rule{width:56px;height:3px;border-radius:2px;background:rgba(255,255,255,0.9);margin:0 auto 28px;}
  .title{font-family:'Hanken Grotesk','SF Pro Display',-apple-system,system-ui,sans-serif;font-weight:600;font-size:${size}px;color:#ffffff;line-height:1.1;letter-spacing:-0.02em;text-shadow:0 2px 28px rgba(0,0,0,0.7);}
  .sub{margin-top:24px;font-family:'JetBrains Mono',ui-monospace,monospace;font-weight:500;font-size:28px;color:#cfd4de;letter-spacing:0.06em;text-shadow:0 2px 18px rgba(0,0,0,0.65);}
  </style></head><body><div class="stage"><div class="scrim"></div><div class="content"><div class="rule"></div><div class="title">${title}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div></div></body></html>`;
}

// End-card overlay, full-bleed 1080x1080, matching design screen C.
function endCardHTML(logoDataUri) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${FONTS}
  html,body{margin:0;padding:0;width:${W}px;height:${H}px;background:#000;}
  .wrap{width:${W}px;height:${H}px;background:#000;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;}
  img.logo{width:330px;height:330px;object-fit:contain;display:block;}
  .name{margin-top:28px;font-family:'Hanken Grotesk','SF Pro Display',-apple-system,system-ui,sans-serif;font-weight:700;font-size:62px;color:#fff;letter-spacing:-0.6px;}
  .tag{margin-top:20px;font-family:'Hanken Grotesk','SF Pro Display',system-ui,sans-serif;font-weight:500;font-size:30px;color:#9a9a9f;line-height:1.5;text-align:center;}
  .footer{position:absolute;left:0;right:0;bottom:92px;display:flex;flex-direction:column;align-items:center;gap:16px;}
  .built{font-family:'Hanken Grotesk',system-ui,sans-serif;font-size:22px;color:#5c5c61;letter-spacing:0.3px;}
  .built b{color:#8a8a90;font-weight:700;}
  .url{font-family:'JetBrains Mono',ui-monospace,monospace;font-weight:500;font-size:28px;color:#e9e9ec;letter-spacing:0.05em;}
  </style></head><body><div class="wrap">
    <img class="logo" src="${logoDataUri}" alt="FaceValue"/>
    <div class="name">FaceValue</div>
    <div class="tag">Real fans. Real tickets.<br/>Face value.</div>
    <div class="footer"><div class="built">Built on <b>Valiron</b></div><div class="url">facevalue.store</div></div>
  </div></body></html>`;
}

const CARDS = [
  { file: 'title-1-shut-out.png',        title: 'Real fans get shut out.<br>Every single drop.', size: 64 },
  { file: 'title-2-the-gate.png',        title: 'So we built the gate.', size: 84 },
  { file: 'title-3-not-scripted.png',    title: 'A real Valiron check.<br>Not scripted.', sub: 'One human in. Bots out.', size: 64 },
  { file: 'title-4-you-just-get-in.png', title: 'No fighting. No bots.<br>You just get in.', size: 66 },
  // --- updated card set (2026-06-18): card 3 reworded, "You just get in." moved to the ending ---
  { file: 'title-no-crashes.png',        title: 'No fighting. No bots.<br>No crashes.', size: 66 },
  { file: 'title-you-just-get-in.png',   title: 'You just get in.', size: 84 },
];

(async () => {
  const logoDataUri = 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, 'logo.png')).toString('base64');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const c of CARDS) {
    await page.setContent(titleHTML(c), { waitUntil: 'load' });
    try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, c.file), omitBackground: true });
    console.log('wrote', c.file);
  }
  await page.setContent(endCardHTML(logoDataUri), { waitUntil: 'load' });
  try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, 'end-card.png') });
  console.log('wrote end-card.png');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
