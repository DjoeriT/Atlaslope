// Map-on shots: node Review/mock-story-guide-v4/shoot-v4.mjs  (needs the built page and Playwright's Chromium).
// The closed view and the toggle checks are in shoot-closed.mjs and check-toggle.mjs.
import { chromium } from '../../node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
import path from 'path';
const here = path.dirname(fileURLToPath(import.meta.url));
const page_url = 'file:///Users/djoeri/Developer/Atlaslope/mocks/story-guide-v4/index.html';
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const out = (n) => path.join(here, 'shots', n);
async function shot(w, h, view, nth, name, mobile) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...(mobile ? { deviceScaleFactor: 2, isMobile: true, hasTouch: true } : {}) });
  const p = await ctx.newPage();
  await p.goto(page_url); await p.waitForTimeout(2500);
  await p.evaluate(([v, n]) => { document.querySelectorAll(`.text .step[data-view="${v}"]`)[n].scrollIntoView({ block: 'center' }); }, [view, nth]);
  await p.waitForTimeout(14000);
  await p.screenshot({ path: out(name) });
  await ctx.close();
}
await shot(1440, 900, 'soils', 0, 'desktop-map-on.png');
await shot(1440, 900, 'rest', 1, 'desktop-no-stop-in-short.png');
await shot(390, 844, 'sierra', 0, 'phone-map-on.png', true);
await browser.close();
