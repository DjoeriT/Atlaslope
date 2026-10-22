#!/usr/bin/env node
// Mock helper (map-bar round 1): node Tools/shots-mapbar.mjs <distDir> <outDir> <tag> [--info]
// Serves a built dist, visits three Rioja stops at 1440 and 390, shoots the page, and measures the overlay boxes.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
const [dist, out, tag] = process.argv.slice(2);
const info = process.argv.includes('--info');
const opt = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : d; };
const place = opt('place', 'rioja');
// --stops name=chapter.index (a fly link) or name=#chapter (no link: scroll the chapter to the reading line)
const STOPS = Object.fromEntries(opt('stops', 'valley=valley.0,climate=climate.2,soils=soils.0').split(',').map((x) => x.split('=')));
const only = opt('sizes', 'desktop,phone').split(',');
const SIZES = { desktop: { width: 1440, height: 900 }, phone: { width: 390, height: 844 } };
mkdirSync(out, { recursive: true });
const port = await new Promise((res) => { const s = createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });
const server = spawn('npx', ['vite', 'preview', '--outDir', dist, '--port', String(port), '--strictPort', '--base', '/Atlaslope/'], { stdio: 'ignore' });
for (let i = 0; !(await fetch(`http://localhost:${port}/Atlaslope/`).then((r) => r.ok, () => false)); i++) { if (i > 100) process.exit(1); await new Promise((r) => setTimeout(r, 200)); }
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const SEL = { chip: '.story-chip', keys: '.story-legend', loc: '.story-loc', zoomIn: '.maplibregl-ctrl-zoom-in', zoomOut: '.maplibregl-ctrl-zoom-out', pitch: '.maplibregl-ctrl-compass', i: '.maplibregl-ctrl-attrib-button', credit: '.story-credit', exag: '.story-exag', recentre: '.story-recentre', panel: '.story-info' };
const results = {};
for (const [size, vp] of Object.entries(SIZES).filter(([k]) => only.includes(k))) {
  const ctx = await browser.newContext({ viewport: vp });
  await ctx.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${port}/Atlaslope/atlas/#place=${place}&page&story`);
  await page.locator('.pg.tour .pg-tourmap .story-map').waitFor({ state: 'visible', timeout: 30000 });
  for (const [name, fly] of Object.entries(STOPS)) {
    if (fly.startsWith('#')) {
      await page.locator(`#terroir-${fly.slice(1)}`).evaluate((el) => { const p = el.closest('.pg'); const bar = p.querySelector('.pg-top').getBoundingClientRect().bottom;
        const map = matchMedia('(max-width: 47.5em)').matches ? p.querySelector('.pg-tourmap').getBoundingClientRect().bottom : bar;
        p.scrollTop += el.getBoundingClientRect().top - (map + (innerHeight - map) * 0.2); });
    } else {
    const a = page.locator(`[data-fly="${fly}"]`).first();
    await a.evaluate((el) => { const p = el.closest('.pg'); const bar = p.querySelector('.pg-top').getBoundingClientRect().bottom;
      const map = matchMedia('(max-width: 47.5em)').matches ? p.querySelector('.pg-tourmap').getBoundingClientRect().bottom : bar;
      p.scrollTop += el.getBoundingClientRect().top - (map + (innerHeight - map) * 0.3); });
    await a.click();
    }
    await page.waitForTimeout(Number(opt('wait', 12000)));
    for (let z = 0; z < Number(opt('zoomout', 0)); z++) { await page.locator('.pg-tourmap .maplibregl-ctrl-zoom-out').click(); await page.waitForTimeout(1500); }
    if (opt('zoomout', 0)) await page.waitForTimeout(15000);
    if (info) { await page.locator('.pg-tourmap .maplibregl-ctrl-attrib-button').click(); await page.waitForTimeout(600); }
    const boxes = await page.evaluate((SEL) => {
      const o = {};
      for (const [k, s] of Object.entries(SEL)) {
        const el = document.querySelector('.pg-tourmap ' + s);
        if (!el) continue; const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || el.hidden) continue;
        const r = el.getBoundingClientRect(); if (!r.width) continue;
        o[k] = { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
      }
      const m = document.querySelector('.pg-tourmap').getBoundingClientRect(); o.map = { x: Math.round(m.x), y: Math.round(m.y), w: Math.round(m.width), h: Math.round(m.height) };
      o._taps = [...document.querySelectorAll('.pg-tourmap button')].filter((b) => b.getBoundingClientRect().width).map((b) => [b.className || b.getAttribute('aria-label') || b.textContent.slice(0, 12), Math.round(b.getBoundingClientRect().width), Math.round(b.getBoundingClientRect().height)]);
      return o;
    }, SEL);
    results[`${size}-${name}`] = boxes;
    await page.screenshot({ path: `${out}/${tag}-${name}-${size}.png` });
    if (info) { await page.reload(); await page.locator('.pg.tour .pg-tourmap .story-map').waitFor({ state: 'visible', timeout: 30000 }); }
  }
  await ctx.close();
}
writeFileSync(`${out}/${tag}-boxes.json`, JSON.stringify(results, null, 1));
await browser.close(); server.kill();
console.log('done');
