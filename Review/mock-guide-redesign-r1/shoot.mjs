// Shots of the four options (viewport clips at scroll steps) and a contact sheet per option: node Review/mock-guide-redesign-r1/shoot.mjs [a b c d]
import { chromium } from '../../node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
const here = path.dirname(fileURLToPath(import.meta.url));
const URL = 'file:///Users/djoeri/Developer/Atlaslope/mocks/guide-redesign-r1/index.html';
const shots = path.join(here, 'shots');
fs.mkdirSync(shots, { recursive: true });
const which = process.argv.slice(2).length ? process.argv.slice(2) : ['a', 'b', 'c', 'd'];
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const report = {};
for (const k of which) {
  const files = { 1440: [], 390: [] };
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    await p.goto('about:blank');
    await p.goto(URL + '#solo=' + k);
    await p.waitForTimeout(2500);
    const info = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, H: document.documentElement.scrollHeight,
      broken: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length, imgs: document.images.length,
      ids: ['c-place', 'c-weather', 'c-ground', 'c-rules', 'c-taste', 'c-short', 'c-producers', 'c-alike', 'c-sources'].filter((i) => !document.getElementById(i)) }));
    report[`${k}-${w}`] = info;
    const step = h - 60;
    const n = Math.min(16, Math.ceil(info.H / step));
    for (let i = 0; i < n; i++) {
      await p.evaluate((y) => scrollTo(0, y), i * step);
      await p.waitForTimeout(250);
      const f = path.join(shots, `opt-${k}-${w}-${String(i + 1).padStart(2, '0')}.png`);
      await p.screenshot({ path: f });
      files[w].push(f);
    }
    await ctx.close();
  }
  // contact sheet: all shots as thumbnails, desktop above phone
  const html = '<body style="margin:0;background:#333;font:12px sans-serif;color:#fff">' + [1440, 390].map((w) =>
    `<div style="display:flex;flex-wrap:wrap;gap:6px;padding:6px">${files[w].map((f) => `<img src="file://${f}" style="width:${w === 1440 ? 330 : 120}px;display:block">`).join('')}</div>`).join('') + '</body>';
  const hp = path.join(shots, `sheet-${k}.html`);
  fs.writeFileSync(hp, html);
  const ctx = await browser.newContext({ viewport: { width: 1450, height: 800 } });
  const p = await ctx.newPage();
  await p.goto('file://' + hp); await p.waitForTimeout(800);
  await p.screenshot({ path: path.join(shots, `sheet-${k}.png`), fullPage: true });
  await ctx.close();
  fs.unlinkSync(hp);
}
console.log(JSON.stringify(report));
await browser.close();
