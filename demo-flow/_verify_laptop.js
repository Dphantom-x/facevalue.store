// Render the old-way screens at LAPTOP width + the resale/on-sale at PHONE width to verify responsive layouts.
const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const path = require('path');
const fileUrl = pathToFileURL(path.join(__dirname, 'index.html')).href;
const OUT = path.join(__dirname, '_verify');

(async () => {
  const browser = await chromium.launch();
  const lap = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  for (const s of ['s-onsale', 's-soldout', 's-queue', 's-resale']) {
    await lap.goto(fileUrl + '?screen=' + s, { waitUntil: 'load' });
    try { await lap.evaluate(() => document.fonts.ready); } catch (e) {}
    await lap.waitForTimeout(700);
    await lap.screenshot({ path: path.join(OUT, 'lap-' + s + '.png') });
    console.log('laptop', s);
  }
  const ph = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const s of ['s-resale', 's-onsale']) {
    await ph.goto(fileUrl + '?screen=' + s, { waitUntil: 'load' });
    await ph.waitForTimeout(700);
    await ph.screenshot({ path: path.join(OUT, 'phone-' + s + '.png') });
    console.log('phone', s);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
