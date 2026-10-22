// Checks and shots: each option alone (#solo=a..d) at 1440 and 390: page height, broken images, horizontal scroll, "tours only" filter,
// first-screen frames, and a contact sheet per option (desktop and phone side by side, scaled to the same height).
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { chromium } from '../mock-guide-redesign-r2/pw.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const shots = path.join(here, 'shots');
fs.mkdirSync(shots, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gr1-'));
const URL0 = 'file:///Users/djoeri/Developer/Atlaslope/mocks/guides-r1/index.html';
const b = await chromium.launch();
const res = {};
async function open(k, w, h = 900) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(`${URL0}#solo=${k}`);
  await p.waitForSelector('.sitebar');
  await p.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager')));
  await p.waitForLoadState('load');
  await p.waitForTimeout(1200);
  return p;
}
const probe = (p) => p.evaluate(() => ({
  height: document.documentElement.scrollHeight,
  hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  imgs: document.querySelectorAll('img').length,
  broken: [...document.querySelectorAll('img')].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src')),
  rows: document.querySelectorAll('.idx li, .card, .ecard').length,
  minRow: Math.round(Math.min(...[...document.querySelectorAll('.idx a')].map((a) => a.getBoundingClientRect().height), 999)),
  minTap: Math.round(Math.min(...[...document.querySelectorAll('.also a')].map((a) => a.getBoundingClientRect().height), 999)),
  blankTiles: document.querySelectorAll('.card .sqbox:not(:has(img)),.ecard .sqbox:not(:has(img))').length,
  markInk: getComputedStyle(document.querySelector('.mark') || document.body).color,
}));
for (const k of ['a', 'b', 'c', 'd', 'e']) {
  res[k] = {};
  for (const w of [1440, 390]) {
    const p = await open(k, w);
    const r = await probe(p);
    // C: open the first region and check the map swaps and the page still fits
    if (k === 'c') {
      await p.click('details[data-r] summary');
      await p.waitForTimeout(500);
      r.mapOnAfterOpen = await p.evaluate(() => document.querySelector('.cmap img.on')?.dataset.r);
      r.heightOpen = (await probe(p)).height;
    }
    if (k === 'e') { // fold the other 11 tours out and back
      await p.click('#morebtn');
      await p.waitForTimeout(300);
      r.heightUnfolded = (await probe(p)).height;
      r.expanded = await p.getAttribute('#morebtn', 'aria-expanded');
      await p.screenshot({ path: path.join(shots, `frame-e-unfolded-${w}.png`) });
      await p.click('#morebtn');
    }
    // filter: tours only
    await p.check('#tours');
    await p.waitForTimeout(200);
    r.tourHeight = (await probe(p)).height;
    r.tourItems = await p.evaluate(() => [...document.querySelectorAll('.card,.ecard,.idx li')].filter((e) => getComputedStyle(e).display !== 'none').length);
    await p.uncheck('#tours');
    await p.waitForTimeout(200);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.screenshot({ path: path.join(shots, `first-${k}-${w}.png`) });
    await p.screenshot({ path: path.join(tmp, `${k}-${w}.jpg`), type: 'jpeg', quality: 70, fullPage: true });
    res[k][w] = r;
    await p.context().close();
  }
  // contact sheet: both full-page shots at the same height (max 2600 px)
  const hs = [res[k][1440].height, res[k][390].height];
  const H = Math.min(2600, hs[0]);
  const sc = [H / hs[0], H / hs[1]];
  const ctx = await b.newContext({ viewport: { width: Math.ceil(1440 * sc[0] + 390 * sc[1] + 60), height: Math.ceil(H + 40) } });
  const p = await ctx.newPage();
  const u = (n) => 'file://' + path.join(tmp, n);
  const sheetHtml = path.join(tmp, `sheet-${k}.html`);
  fs.writeFileSync(sheetHtml, `<body style="margin:0;background:#ddd;display:flex;gap:20px;padding:20px;align-items:flex-start"><img src="${u(k + '-1440.jpg')}" style="height:${H}px;width:${1440 * sc[0]}px"><img src="${u(k + '-390.jpg')}" style="height:${hs[1] * sc[1]}px;width:${390 * sc[1]}px;clip-path:inset(0 0 ${Math.max(0, hs[1] * sc[1] - H)}px 0)"></body>`);
  await p.goto('file://' + sheetHtml);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(shots, `sheet-${k}.png`) });
  await ctx.close();
}
await b.close();
fs.writeFileSync(path.join(here, 'measure.json'), JSON.stringify(res, null, 1));
console.log(JSON.stringify(res));
