// Unfold and fold-back check for C1, C2, C3: node Review/mock-guide-redesign-r2/check-unfold.mjs [c1 c2 c3]
// Shots: unfold-<k>-0 (button), unfold-1 (mid-grow), unfold-2 (map at the first stop), fold-back. Numbers: paragraph y before and after.
import { chromium } from './pw.mjs';
import { fileURLToPath } from 'url';
import path from 'path';
const here = path.dirname(fileURLToPath(import.meta.url));
const URL = 'file:///Users/djoeri/Developer/Atlaslope/mocks/guide-redesign-r2/index.html';
const out = (n) => path.join(here, 'shots', n);
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const state = (p) => p.evaluate(() => { const m = window.sgMap, c = m && m.getCenter(); return { off: document.body.classList.contains('map-off'), grow: !!document.getElementById('grow'), z: m ? +m.getZoom().toFixed(2) : null, lng: c ? +c.lng.toFixed(3) : null, lat: c ? +c.lat.toFixed(3) : null, y: Math.round(scrollY) }; });

async function run(k, w, h, tag, reduced) {
  tag = k + ' ' + tag;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage();
  await p.goto('about:blank'); await p.goto(URL + '#solo=' + k); await p.waitForTimeout(3500);
  console.log(tag, 'start', JSON.stringify(await state(p)));
  if (!reduced) { await p.screenshot({ path: out(w === 1440 ? `unfold-${k}-0.png` : `unfold-${k}-0-phone.png`) });
    const card = p.locator('.mapcard'); await card.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
    await card.screenshot({ path: out(`button-${k}-${w}.png`) });
    if (w === 1440) { await card.hover(); await p.waitForTimeout(500); await card.screenshot({ path: out(`button-${k}-1440-hover.png`) }); await p.mouse.move(5, 300); }
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300); }
  await p.locator('.c-bigbtn').click({ noWaitAfter: true });
  if (!reduced) { await p.waitForTimeout(450); await p.screenshot({ path: out(w === 1440 ? `unfold-${k}-1.png` : `unfold-${k}-1-phone.png`) }); console.log(tag, 'mid-grow', JSON.stringify(await state(p))); }
  await p.waitForTimeout(reduced ? 1500 : 12000);
  console.log(tag, 'after unfold', JSON.stringify(await state(p)));
  if (!reduced) await p.screenshot({ path: out(w === 1440 ? `unfold-${k}-2.png` : `unfold-${k}-2-phone.png`) });
  if (reduced) { await ctx.close(); return; }
  // paragraph check: read the second paragraph of "Three soils, three weights" with the map open, close the map, find it again
  await p.evaluate(() => { const ps = [...document.querySelectorAll('.text .step[data-view="soils"] .main > p')]; (ps[ps.length - 1] || ps[0]).scrollIntoView({ block: 'center' }); });
  await p.waitForTimeout(3000);
  const before = await p.evaluate(() => {
    const top = document.querySelector('.top').getBoundingClientRect().bottom; const narrow = innerWidth <= 768;
    const mid = narrow ? document.querySelector('.mapwrap').getBoundingClientRect().bottom + (innerHeight - document.querySelector('.mapwrap').getBoundingClientRect().bottom) * 0.3 : top + (innerHeight - top) * 0.45;
    const b = [...document.querySelectorAll('.step-in .main > *, .step-in .aside > *')].find((x) => { const r = x.getBoundingClientRect(); return r.height > 0 && r.bottom > mid; });
    window.__b = b.textContent.replace(/\s+/g, ' ').trim().slice(0, 70); return { text: window.__b, y: Math.round(b.getBoundingClientRect().top) };
  });
  await p.locator('.mapbtn').evaluate((b) => b.click());
  await p.waitForTimeout(900);
  const after = await p.evaluate(() => { const t = window.__b; const e = [...document.querySelectorAll('#closed p')].find((x) => x.textContent.replace(/\s+/g, ' ').trim().startsWith(t)); return e ? { y: Math.round(e.getBoundingClientRect().top), section: e.closest('section') && e.closest('section').id } : null; });
  console.log(tag, 'paragraph before', JSON.stringify(before), 'after', JSON.stringify(after), 'state', JSON.stringify(await state(p)));
  await p.screenshot({ path: out(w === 1440 ? `fold-back-${k}.png` : `fold-back-${k}-phone.png`) });
  await ctx.close();
}
for (const k of (process.argv.length > 2 ? process.argv.slice(2) : ['c1', 'c2', 'c3'])) {
  await run(k, 1440, 900, 'desktop', false);
  await run(k, 1440, 900, 'desktop reduced-motion', true);
  await run(k, 390, 844, 'phone', false);
}
await browser.close();
