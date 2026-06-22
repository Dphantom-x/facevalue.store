// Verify the A1 On-Sale two-state countdown (waiting -> ready) on phone + laptop,
// and confirm the FaceValue drop no longer shows the "Resale elsewhere" line.
const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const path = require('path');
const fileUrl = pathToFileURL(path.join(__dirname, 'index.html')).href;
const OUT = path.join(__dirname, '_verify');

async function cap(page, screen, waitMs, name) {
  await page.goto(fileUrl + '?screen=' + screen, { waitUntil: 'load' });
  try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
  await page.waitForTimeout(waitMs);
  await page.screenshot({ path: path.join(OUT, name + '.png') });
  console.log('saved', name);
}

(async () => {
  const browser = await chromium.launch();

  // PHONE
  const ph = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await cap(ph, 's-onsale', 700, 'phone-onsale-WAIT');   // waiting card + locked grey Buy
  await cap(ph, 's-onsale', 6200, 'phone-onsale-READY');  // From $60 + active blue Buy

  // confirm the FaceValue drop has no "Resale elsewhere" text
  await ph.goto(fileUrl + '?screen=s-fvdrop', { waitUntil: 'load' });
  await ph.waitForTimeout(500);
  const hasResale = await ph.evaluate(() => document.body.innerText.includes('Resale elsewhere'));
  console.log('fvdrop still has "Resale elsewhere":', hasResale);
  await ph.screenshot({ path: path.join(OUT, 'phone-fvdrop.png') });

  // LAPTOP
  const lap = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await cap(lap, 's-onsale', 700, 'lap-onsale-WAIT');
  await cap(lap, 's-onsale', 6200, 'lap-onsale-READY');

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
