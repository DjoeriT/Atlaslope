// Shots and the close/reopen check: node Review/mock-story-guide-v4/shoot-v4.mjs  (needs the built page and Playwright's Chromium)
import { chromium } from '../../node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
import path from 'path';
const here = path.dirname(fileURLToPath(import.meta.url));
const page_url = 'file:///Users/djoeri/Developer/Atlaslope/mocks/story-guide-v4/index.html';
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const out = (n) => path.join(here, 'shots', n);

async function open(w, h, ctx) {
  ctx = ctx || (await browser.newContext({ viewport: { width: w, height: h } }));
  const p = await ctx.newPage();
  await p.goto(page_url);
  await p.waitForTimeout(2500);
  return p;
}
// scroll so that the step with this view (nth of them) sits in the middle, then wait for the flights
async function toStep(p, view, nth = 0, wait = 14000) {
  await p.evaluate(([v, n]) => { document.querySelectorAll(`.text .step[data-view="${v}"]`)[n].scrollIntoView({ block: 'center' }); }, [view, nth]);
  await p.waitForTimeout(wait);
}
const mapState = (p) => p.evaluate(() => { const m = window.sgMap; const c = m.getCenter(); return { lng: +c.lng.toFixed(3), lat: +c.lat.toFixed(3), z: +m.getZoom().toFixed(2), pitch: Math.round(m.getPitch()), moving: m.isMoving(), chip: document.querySelector('.chip').textContent }; });
// the block on the reading line (45% down from the band), marked so that the same element can be found after the switch
const markBlock = (p) => p.evaluate(() => { document.querySelectorAll('[data-tb]').forEach((e) => e.removeAttribute('data-tb')); const band = document.querySelector('.top').getBoundingClientRect().bottom; const mid = band + (innerHeight - band) * 0.45; const b = [...document.querySelectorAll('.step-in .main > *, .step-in .aside > *')].find((x) => { const r = x.getBoundingClientRect(); return r.height > 0 && r.bottom > mid; }); b.setAttribute('data-tb', '1'); return b.tagName + '.' + b.className + ' top ' + Math.round(b.getBoundingClientRect().top); });
const markedTop = (p) => p.evaluate(() => { const b = document.querySelector('[data-tb]'); const r = b.getBoundingClientRect(); return b.tagName + '.' + b.className + ' top ' + Math.round(r.top) + ' bottom ' + Math.round(r.bottom) + ' step ' + b.closest('.step').dataset.view; });

// ---- desktop 1440x900: map on at a stop, then closed
const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
let p = await open(1440, 900, dctx);
await toStep(p, 'soils');
await p.screenshot({ path: out('desktop-map-on.png') });
console.log('on, soils:', JSON.stringify(await mapState(p)), 'button:', await p.locator('.mapbtn').textContent());
const before = await markBlock(p);
await p.locator('.mapbtn').evaluate((b) => b.click()); // not Playwright's click: that scrolls the page by itself before clicking
await p.waitForTimeout(1200);
const after = await markedTop(p);
console.log('closed. block before:', before, '| after:', after, '|', 'body.map-off', await p.evaluate(() => document.body.classList.contains('map-off')), 'stored', await p.evaluate(() => localStorage.getItem('atlaslope.story.mapClosed')), 'button:', await p.locator('.mapbtn').textContent());
console.log('text width closed:', await p.evaluate(() => Math.round(document.querySelector('.text').getBoundingClientRect().width)), 'mapwrap shown:', await p.locator('.mapwrap').isVisible());
await p.screenshot({ path: out('desktop-map-closed.png') });
// scroll on while closed, to the Haro step, then reload: choice kept
await toStep(p, 'haro', 0, 800);
await p.reload(); await p.waitForTimeout(2000);
console.log('after reload: map-off', await p.evaluate(() => document.body.classList.contains('map-off')), 'button:', await p.locator('.mapbtn').textContent());
// reopen at the Haro step: lands on Haro with no flight
await toStep(p, 'haro', 0, 800);
await p.locator('.mapbtn').evaluate((b) => b.click()); // not Playwright's click: that scrolls the page by itself before clicking
await p.waitForTimeout(400);
console.log('reopened at haro (0.4 s after click):', JSON.stringify(await mapState(p)), 'stored', await p.evaluate(() => localStorage.getItem('atlaslope.story.mapClosed')));
await p.waitForTimeout(6000);
console.log('reopened at haro (later):', JSON.stringify(await mapState(p)));
// next stop flies again: move on to the first In short step
await toStep(p, 'rest', 1, 500);
await p.waitForTimeout(600);
console.log('next stop starts a flight:', (await mapState(p)).moving || 'dwell wait', JSON.stringify(await mapState(p)));
await p.waitForTimeout(9000);
await p.screenshot({ path: out('desktop-no-stop-in-short.png') });
console.log('in short:', JSON.stringify(await mapState(p)));
await p.close();

// ---- phone 390x844
const pctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
p = await open(390, 844, pctx);
await toStep(p, 'sierra');
await p.screenshot({ path: out('phone-map-on.png') });
await p.locator('.mapbtn').evaluate((b) => b.click()); // not Playwright's click: that scrolls the page by itself before clicking
await p.waitForTimeout(1200);
await p.screenshot({ path: out('phone-map-closed.png') });
console.log('phone closed: body.map-off', await p.evaluate(() => document.body.classList.contains('map-off')), 'scrollWidth', await p.evaluate(() => document.documentElement.scrollWidth));
await browser.close();
