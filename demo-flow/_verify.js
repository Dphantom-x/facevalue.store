// Verifies the demo flow renders correctly at phone size. Run: node demo-flow/_verify.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const DIR = __dirname;
// bring the logo into the demo folder (HTML references ./logo.png)
fs.copyFileSync(path.join(DIR, '..', 'docs', 'video', 'assets', 'logo.png'), path.join(DIR, 'logo.png'));

const fileUrl = 'file:///' + path.join(DIR, 'index.html').replace(/\\/g, '/');
const OUT = path.join(DIR, '_verify');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);
const screens = ['s-onsale', 's-queue', 's-soldout', 's-resale', 's-fvdrop', 's-fvverify', 's-fvsecuring'];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  for (const s of screens) {
    await p.goto(fileUrl + '?screen=' + s, { waitUntil: 'load' });
    await p.waitForTimeout(500);
    await p.screenshot({ path: path.join(OUT, s + '.png') });
    console.log('shot', s);
  }
  // FaceValue verify -> done state
  await p.goto(fileUrl + '?screen=s-fvverify', { waitUntil: 'load' });
  await p.click('#verifyBtn'); await p.waitForTimeout(1900);
  await p.screenshot({ path: path.join(OUT, 'fvverify-done.png') });
  // securing -> sleep (black) -> wake + notification (two cue-taps)
  await p.goto(fileUrl + '?screen=s-fvsecuring', { waitUntil: 'load' });
  await p.waitForTimeout(400); await p.click('#ctl-notif'); await p.waitForTimeout(1100);
  await p.screenshot({ path: path.join(OUT, 'sleep.png') });
  await p.click('#ctl-notif'); await p.waitForTimeout(1000);
  await p.screenshot({ path: path.join(OUT, 'wake-notif.png') });
  // frozen queue (auto-freeze after 5s)
  await p.goto(fileUrl + '?screen=s-queue', { waitUntil: 'load' });
  await p.waitForTimeout(5300);
  await p.screenshot({ path: path.join(OUT, 'queue-frozen.png') });
  console.log('done');
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
