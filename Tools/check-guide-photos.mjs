#!/usr/bin/env node
// Guide photo sharpness and width (C3, owner 22 Oct 2026): on a guide page at 1440 px, every <img> outside the map is drawn at most 33rem
// (528 px) wide and has naturalWidth / rendered width >= 1.45, so the shipped 800 px files stay sharp on a 1.5x screen.
// Usage: node Tools/check-guide-photos.mjs [--no-build] [id ...]   (default: rioja priorat ribera-del-duero; the last has no tour)
// Builds the UI-test bundle (no network), serves it, and exits 1 on any photo that fails.
import { chromium } from '@playwright/test';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';

const args = process.argv.slice(2);
const ids = args.filter((a) => !a.startsWith('--'));
const places = ids.length ? ids : ['rioja', 'priorat', 'ribera-del-duero'];
const MIN_RATIO = 1.45, MAX_PX = 33 * 16 + 1;

if (!args.includes('--no-build')) {
  const b = spawnSync('npx', ['vite', 'build', '--mode', 'uitest', '--outDir', 'dist/uitest', '--logLevel', 'error'], { stdio: 'inherit', timeout: 120_000 });
  if (b.status !== 0) { console.error('check-guide-photos: build failed'); process.exit(1); }
}
const port = await new Promise((res) => { const s = createServer(); s.listen(0, () => { const { port } = s.address(); s.close(() => res(port)); }); });
const server = spawn('npx', ['vite', 'preview', '--outDir', 'dist/uitest', '--port', String(port), '--strictPort', '--base', '/Atlaslope/'], { stdio: 'ignore' });
const base = `http://localhost:${port}/Atlaslope/`;
for (let i = 0; !(await fetch(base).then((r) => r.ok, () => false)); i++) {
  if (i > 100) { server.kill(); console.error('check-guide-photos: preview did not start'); process.exit(1); }
  await new Promise((r) => setTimeout(r, 200));
}
const browser = await chromium.launch();
let bad = 0;
for (const id of places) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  const page = await ctx.newPage();
  await page.goto(`${base}atlas/#place=${id}&page`);
  await page.locator('.pg h1').first().waitFor({ state: 'visible' });
  // Lazy photos load as they near the screen: scroll the page through once, then wait for every image to finish.
  const h = await page.evaluate(() => document.querySelector('.pg').scrollHeight);
  for (let y = 0; y < h; y += 700) { await page.evaluate((v) => { document.querySelector('.pg').scrollTop = v; }, y); await page.waitForTimeout(120); }
  await page.waitForFunction(() => [...document.querySelectorAll('.pg img')].every((i) => i.complete), null, { timeout: 15000 }).catch(() => {});
  // With a srcset and sizes, naturalWidth is the file's width scaled to the slot (the browser's density maths), so the file itself is measured:
  // the chosen file loaded again as a plain image.
  const imgs = await page.evaluate(() => Promise.all([...document.querySelectorAll('.pg img')].map(async (i) => {
    const plain = new Image();
    plain.src = i.currentSrc;
    await plain.decode().catch(() => {});
    return { src: i.currentSrc.replace(/^.*\/photos\//, ''), nat: plain.naturalWidth, w: i.offsetWidth };  // layout width: the scroll-drift scale on a hero photo must not count
  })));
  const fails = imgs.filter((i) => i.w > 0).filter((i) => i.nat / i.w < MIN_RATIO || i.w > MAX_PX);
  bad += fails.length;
  console.log(`${id}: ${imgs.length} images, widest ${Math.max(0, ...imgs.map((i) => i.w)).toFixed(0)} px, min ratio ${Math.min(...imgs.filter((i) => i.w > 0).map((i) => i.nat / i.w)).toFixed(2)}`, fails.length ? `FAIL ${fails.map((i) => `${i.src} ${i.nat}/${i.w.toFixed(0)}`).join('; ')}` : 'ok');
  await ctx.close();
}
await browser.close();
server.kill();
process.exit(bad ? 1 : 0);
