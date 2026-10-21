// Shots of the built app (vite preview on :4790) for the build report.
import { chromium } from '@playwright/test';
const out = process.argv[2];
const base = 'http://localhost:4790/';
const browser = await chromium.launch();
async function shot(name, w, h, hash, sel, off = 0) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1 });
  const page = await ctx.newPage();
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(base + hash);
  await page.waitForTimeout(2500);
  if (sel) {
    await page.evaluate(([s, o]) => {
      const pg = document.querySelector('.pg'); const e = document.querySelector(s);
      if (pg && e) pg.scrollTop += e.getBoundingClientRect().top - o;
    }, [sel, off]);
  }
  await page.waitForTimeout(6000);
  const step = await page.locator('.pg-tourmap').getAttribute('data-step').catch(() => null);
  await page.screenshot({ path: `${out}/${name}.png` });
  console.log(name, step ?? '-');
  await ctx.close();
}
await shot('b3-desktop', 1400, 760, '#place=rioja&page', '.pg-spine', 40);
await shot('a-desktop-climate', 1400, 820, '#place=rioja&page&story', '.pg-climate', 330);
await shot('a-desktop-soils', 1400, 820, '#place=rioja&page&story', '#terroir-soils', 140);
await shot('phone-climate', 390, 844, '#place=rioja&page&story', '.pg-climate', 340);
await browser.close();
