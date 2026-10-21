// Part B screenshots: node Review/mock-story-guide-v3/shoot-b.mjs  (needs the built page and Playwright's Chromium)
import { chromium } from '/Users/djoeri/Developer/Atlaslope/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
import path from 'path';
const here = path.dirname(fileURLToPath(import.meta.url));
const page_url = 'file:///Users/djoeri/Developer/Atlaslope/mocks/story-guide-v3/index.html';
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

async function open(w, h, guide) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.goto(page_url + (guide ? '?guide=' + guide : ''));
  await p.waitForTimeout(2500);
  return p;
}
async function toStep(p, view, wait = 14000) {
  await p.evaluate((v) => { const s = [...document.querySelectorAll('.text:not([hidden]) .step')].find((x) => x.dataset.view === v); s.scrollIntoView({ block: 'center' }); }, view);
  await p.waitForTimeout(wait);
}
const out = (n) => path.join(here, 'shots', n);

let p = await open(1400, 850);
await p.screenshot({ path: out('b-top-button.png') });
await toStep(p, 'haro');
await p.locator('.fk').first().click();
await p.waitForTimeout(800);
await p.screenshot({ path: out('b-rioja-haro.png') });
await p.keyboard.press('Escape');
console.log('popup after Escape:', await p.locator('.factpop').count());
await toStep(p, 'soils');
await p.screenshot({ path: out('b-rioja-soils.png') });
await p.locator('.stop-img').first().scrollIntoViewIfNeeded();
await p.close();

p = await open(1400, 850, 'priorat');
await toStep(p, 'licorella');
await p.screenshot({ path: out('b-priorat-slate.png') });
await p.close();

p = await open(390, 844);
await toStep(p, 'sierra');
await p.locator('.fk').first().click();
await p.waitForTimeout(800);
await p.screenshot({ path: out('b-phone-sierra.png') });
await browser.close();
