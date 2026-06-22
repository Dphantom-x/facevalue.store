// Generate square PWA app icons (192 + 512) from the FaceValue FV mark (logo.png).
const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const path = require('path');
const url = pathToFileURL(path.join(__dirname, '_icon.html')).href;

(async () => {
  const browser = await chromium.launch();
  for (const size of [192, 512]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(__dirname, 'icon-' + size + '.png') });
    await page.close();
    console.log('wrote icon-' + size + '.png');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
