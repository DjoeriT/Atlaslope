#!/usr/bin/env node
// Guide page screenshots (C3 build, 22 Oct 2026): full-page shots of guide pages at 1440, 834 and 390 px, with real photos, into one folder.
// Usage: node Tools/shots-guide.mjs <outdir> [id ...]   (serves dist/uitest: run `npx vite build --mode uitest --outDir dist/uitest` first)
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createServer } from 'node:net';

const [out, ...rest] = process.argv.slice(2);
const ids = rest.length ? rest : ['rioja', 'ribera-del-duero'];
mkdirSync(out, { recursive: true });
const port = await new Promise((res) => { const s = createServer(); s.listen(0, () => { const { port } = s.address(); s.close(() => res(port)); }); });
const server = spawn('npx', ['vite', 'preview', '--outDir', 'dist/uitest', '--port', String(port), '--strictPort', '--base', '/Atlaslope/'], { stdio: 'ignore' });
const base = `http://localhost:${port}/Atlaslope/`;
for (let i = 0; !(await fetch(base).then((r) => r.ok, () => false)); i++) {
  if (i > 100) { server.kill(); process.exit(1); }
  await new Promise((r) => setTimeout(r, 200));
}
const browser = await chromium.launch();
for (const id of ids) for (const w of [1440, 834, 390]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 } });
  await ctx.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  const page = await ctx.newPage();
  await page.goto(`${base}atlas/#place=${id}&page`);
  await page.locator('.pg h1').first().waitFor({ state: 'visible' });
  const h = await page.evaluate(() => document.querySelector('.pg').scrollHeight);
  for (let y = 0; y < h; y += 600) { await page.evaluate((v) => { document.querySelector('.pg').scrollTop = v; }, y); await page.waitForTimeout(100); }
  await page.waitForFunction(() => [...document.querySelectorAll('.pg img')].every((i) => i.complete), null, { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => { document.querySelector('.pg').scrollTop = 0; });
  // The page scrolls inside .pg (fixed): grow the viewport to the page's full height for a full-length shot.
  await page.setViewportSize({ width: w, height: Math.min(h, 9000) });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/${id}-${w}.png` });
  console.log(`${id}-${w}.png ${h}px`);
  await ctx.close();
}
await browser.close();
server.kill();
