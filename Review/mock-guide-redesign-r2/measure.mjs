// Photo sharpness: per option at 1440 and 390, every <img> outside the map: naturalWidth / rendered CSS width. All must be >= 1.45.
// Run: node Review/mock-guide-redesign-r2/measure.mjs   (build first)
import { chromium } from './pw.mjs';
const URL = 'file:///Users/djoeri/Developer/Atlaslope/mocks/guide-redesign-r2/index.html';
const browser = await chromium.launch();
let worst = 99, bad = 0;
for (const k of ['c1', 'c2', 'c3']) for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  await p.goto('about:blank'); await p.goto(URL + '#solo=' + k); await p.waitForTimeout(2500);
  const r = await p.evaluate(() => [...document.querySelectorAll('#closed img')].map((i) => ({ id: i.dataset.p || '', nat: i.naturalWidth, w: i.getBoundingClientRect().width })));
  const ratios = r.map((x) => x.nat / x.w);
  const min = Math.min(...ratios);
  const low = r.filter((x) => x.nat / x.w < 1.45).map((x) => `${x.id} ${x.nat}/${x.w.toFixed(0)}`);
  worst = Math.min(worst, min); bad += low.length;
  console.log(k, w, 'imgs', r.length, 'min ratio', min.toFixed(2), 'widest', Math.max(...r.map((x) => x.w)).toFixed(0) + 'px', 'natural<800:', r.filter((x) => x.nat < 800).map((x) => x.id + ':' + x.nat).join(',') || 'none', low.length ? 'LOW: ' + low.join('; ') : 'ok');
}
console.log('worst', worst.toFixed(2), 'below 1.45:', bad);
await browser.close();
