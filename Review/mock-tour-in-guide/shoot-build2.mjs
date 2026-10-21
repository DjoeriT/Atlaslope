// Build 2 shots: guides page (desktop, phone), home top bar at 390, against vite preview on :4790.
import { chromium } from '@playwright/test';
const out = process.argv[2];
const browser = await chromium.launch();
async function shot(name, w, h, path, full = false, sel) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1 });
  const page = await ctx.newPage();
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto('http://localhost:4790/' + path);
  await page.waitForTimeout(1500);
  if (sel) await page.evaluate((s) => window.scrollTo(0, document.querySelector(s).getBoundingClientRect().top + scrollY - 120), sel);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: full });
  await ctx.close();
}
await shot('guides-desktop', 1400, 700, 'guides/', false, '.jump');
await shot('guides-desktop-tours', 1400, 800, 'guides/', false, '#map-tours');
await shot('guides-phone', 390, 844, 'guides/', false, '.jump');
await shot('guides-phone-tours', 390, 844, 'guides/', false, '#map-tours');
await shot('home-390-topbar', 390, 300, '');
await browser.close();
