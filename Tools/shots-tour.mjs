#!/usr/bin/env node
// Tour screenshots with real imagery: node Tools/shots-tour.mjs <id> [--sizes phone,desktop] [--no-build]
// Normal Vite build (tiles ON, network allowed; .env.local is read by Vite as is, the key is never printed), opens the guide with the tour
// open and visits EVERY stop in order (clicks the stop's fly link, or scrolls its chapter to the reading line). A stop is shot once the map
// is still and its picture has real detail (not blank or grey); if that never happens within STOP_CAP the stop is flagged, not passed.
// Writes shots/tour-<id>-<n>-<size>.png per stop and shots/tour-<id>-<size>.png, a labelled contact sheet. Whole run capped at 6 minutes.
import { chromium } from '@playwright/test';
import { spawn, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createServer } from 'node:net';

const SIZES = { phone: { width: 390, height: 844 }, desktop: { width: 1440, height: 900 } };
const STOP_CAP = 30_000, RUN_CAP = 360_000, FLIGHT_MS = 4500; // a flight lasts up to ~5 s (src/story/camera.ts)
const args = process.argv.slice(2);
const id = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--sizes');
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };
if (!id) { console.error('usage: npm run shots:tour -- <id> [--sizes phone,desktop] [--no-build]'); process.exit(2); }
const sizes = (opt('sizes') ?? 'phone,desktop').split(',');
if (sizes.some((s) => !SIZES[s])) { console.error(`unknown size in --sizes (have ${Object.keys(SIZES).join(', ')})`); process.exit(2); }
let story;
try { story = JSON.parse(readFileSync(`content/stories/${id}.json`, 'utf8')); } catch { console.error(`no tour content/stories/${id}.json`); process.exit(2); }

const t0 = Date.now();
const secs = () => ((Date.now() - t0) / 1000).toFixed(1);
let server = null;
const finish = (code) => { server?.kill(); process.exit(code); };
setTimeout(() => { console.error('shots:tour: overall 6 min timeout, stopping'); finish(1); }, RUN_CAP).unref();

const freePort = () => new Promise((res, rej) => {
  const s = createServer(); s.on('error', rej);
  s.listen(0, () => { const { port } = s.address(); s.close(() => res(port)); });
});

// Imagery needs the Esri key from .env.local (git-ignored: a builder worktree has none). Without one the map silently shows only the base
// map and relief (the 21 Oct 2026 sheet), so look here, then in the main checkout and copy the file in (git-ignored; never read or printed here).
if (!existsSync('.env.local')) {
  const common = spawnSync('git', ['rev-parse', '--git-common-dir'], { encoding: 'utf8' }).stdout.trim();
  const main = common ? dirname(resolve(common)) : '';
  if (main && existsSync(`${main}/.env.local`)) copyFileSync(`${main}/.env.local`, '.env.local');
  else { console.error('shots:tour: no .env.local (Esri key) here or in the main checkout: no imagery would load'); process.exit(2); }
}
if (!args.includes('--no-build')) {
  const b = spawnSync('npx', ['vite', 'build', '--outDir', 'dist/tour', '--logLevel', 'error'], { stdio: 'inherit', timeout: 150_000 });
  if (b.status !== 0) { console.error('shots:tour: build failed'); finish(1); }
  console.log(`built in ${secs()} s`);
}
const port = await freePort();
server = spawn('npx', ['vite', 'preview', '--outDir', 'dist/tour', '--port', String(port), '--strictPort', '--base', '/Atlaslope/'], { stdio: 'ignore' });
const base = `http://localhost:${port}/Atlaslope/`;
for (let i = 0; !(await fetch(base).then((r) => r.ok, () => false)); i++) {
  if (i > 100) { console.error('shots:tour: preview server did not start'); finish(1); }
  await new Promise((r) => setTimeout(r, 200));
}

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const helper = await (await browser.newContext()).newPage(); // blank page: decodes shots and builds the contact sheets

/** How much picture detail a PNG has: share of 8x8 cells whose pixels differ clearly (a grey or blank map has none), 0..1. */
const detail = (png) => helper.evaluate(async (b64) => {
  const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
  const c = new OffscreenCanvas(96, 96); const g = c.getContext('2d'); g.drawImage(bmp, 0, 0, 96, 96);
  const d = g.getImageData(0, 0, 96, 96).data; let busy = 0, cells = 0;
  for (let y = 0; y < 96; y += 8) for (let x = 0; x < 96; x += 8) {
    let lo = 255, hi = 0;
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) { const k = ((y + j) * 96 + x + i) * 4; const l = (d[k] + d[k + 1] + d[k + 2]) / 3; lo = Math.min(lo, l); hi = Math.max(hi, l); }
    cells++; if (hi - lo > 12) busy++;
  }
  return busy / cells;
}, png.toString('base64'));

/** Still (two frames 400 ms apart identical) and detailed, twice in a row (tiles arrive late); false at the cap. */
async function settled(page, map) {
  const deadline = Date.now() + STOP_CAP;
  let prev = null, holds = 0;
  while (Date.now() < deadline) {
    const now = await map.screenshot({ type: 'png' });
    holds = prev && now.equals(prev) && (await detail(now)) > 0.5 ? holds + 1 : 0;
    if (holds >= 2) return true;
    prev = now;
    await page.waitForTimeout(400);
  }
  return false;
}

// The guide page numbers a chapter's fly links: its own fly[] first, then its cards; the DOM order of `a.fly` is the same.
function linkIndex(step) {
  if (step.fly !== undefined) return step.fly;
  if (step.card === undefined) return undefined;
  const own = Math.max(-1, ...story.steps.filter((s) => s.chapter === step.chapter && s.fly !== undefined).map((s) => s.fly)) + 1;
  return own + step.card;
}

async function goTo(page, step) {
  if (!step.chapter) { await page.locator('.pg').evaluate((el) => { el.scrollTop = 0; }); return; }
  const ch = page.locator(`#terroir-${step.chapter}`);
  const index = linkIndex(step);
  // Fly links and zone-card links carry data-fly="<chapter>.<index>" wherever the C3 page puts them (beat column, cards under it).
  if (index !== undefined) { const a = page.locator(`[data-fly="${step.chapter}.${index}"]`).first(); await a.evaluate((el) => {
      // Bring the link to ~30% of the reading area (under the band, and under the pinned map on a phone), so it counts as read.
      const p = el.closest('.pg'); const bar = p.querySelector('.pg-top').getBoundingClientRect().bottom;
      const map = matchMedia('(max-width: 47.5em)').matches ? p.querySelector('.pg-tourmap').getBoundingClientRect().bottom : bar;
      p.scrollTop += el.getBoundingClientRect().top - (map + (innerHeight - map) * 0.3);
    });
    await a.click(); return; }
  // No link: the chapter's first step shows while the chapter is under the reading line, so bring its top to ~20% of the reading area.
  await ch.evaluate((el) => {
    const p = el.closest('.pg'); const top = el.getBoundingClientRect().top;
    const bar = p.querySelector('.pg-top')?.getBoundingClientRect().bottom ?? 0;
    p.scrollTop += top - (bar + (innerHeight - bar) * 0.2);
  });
}

mkdirSync('shots', { recursive: true });
let flagged = 0;
for (const size of sizes) {
  const ctx = await browser.newContext({ viewport: SIZES[size] });
  await ctx.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  const page = await ctx.newPage();
  const shots = [];
  try {
    await page.goto(`${base}atlas/#place=${id}&page&story`);
    let tiles = 0, seenTiles = 0; // successful imagery tile responses (IGN PNOA, Esri World Imagery) since the stop began
    page.on('response', (r) => { if (r.ok() && /ign\.es\/wmts|arcgis\.com\/arcgis\/rest\/services\/World_Imagery/.test(r.url())) { tiles++; seenTiles++; } });
    const map = page.locator('.pg.tour .pg-tourmap .story-map');
    await map.waitFor({ state: 'visible', timeout: 30_000 });
    for (const [i, step] of story.steps.entries()) {
      if (!step.chapter) continue; // the cover step (whole place from afar) has no text in the map mode: it opens on beat 1's stop
      const start = Date.now();
      tiles = 0;
      await goTo(page, step);
      await page.waitForTimeout(FLIGHT_MS);
      // Pass needs pixel detail AND at least one imagery tile response during the stop: relief alone has detail but is not imagery.
      const ok = (await settled(page, map)) && (tiles > 0 || seenTiles > 0); // a stop over ground already fetched asks for no new tiles
      const n = i + 1;
      const file = `shots/tour-${id}-${n}-${size}.png`;
      await page.screenshot({ path: file });
      const seen = await page.locator('.pg-tourmap').getAttribute('data-step');
      const wrong = seen !== step.id;
      if (!ok || wrong) flagged++;
      shots.push({ file, label: `${n}. ${step.id}${ok ? '' : ' (IMAGERY NOT LOADED)'}${wrong ? ` (map shows ${seen})` : ''}` });
      console.log(`${file}  ${step.id}  ${ok ? 'ok' : 'FLAG: imagery did not load'} (${tiles} imagery tiles)${wrong ? `  FLAG: map shows ${seen}` : ''}  ${((Date.now() - start) / 1000).toFixed(1)} s`);
    }
  } catch (e) {
    flagged++;
    console.log(`FAILED ${size}: ${String(e.message).split('\n')[0]}`);
  }
  await ctx.close().catch(() => {});
  if (!shots.length) continue;
  const sheet = await helper.evaluate(async ({ items, cols, w }) => {
    const imgs = await Promise.all(items.map(async (it) => createImageBitmap(await (await fetch(`data:image/png;base64,${it.b64}`)).blob())));
    const h = Math.round(w * imgs[0].height / imgs[0].width), lab = 22, rows = Math.ceil(items.length / cols);
    const c = document.createElement('canvas'); c.width = cols * w; c.height = rows * (h + lab);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.font = '14px sans-serif';
    imgs.forEach((im, k) => {
      const x = (k % cols) * w, y = Math.floor(k / cols) * (h + lab);
      g.drawImage(im, x, y + lab, w, h); g.fillStyle = items[k].label.includes('(') ? '#b00' : '#000'; g.fillText(items[k].label, x + 4, y + 16);
    });
    return c.toDataURL('image/png').split(',')[1];
  }, { items: shots.map((s) => ({ label: s.label, b64: readFileSync(s.file).toString('base64') })), cols: size === 'phone' ? 5 : 3, w: size === 'phone' ? 300 : 640 });
  writeFileSync(`shots/tour-${id}-${size}.png`, Buffer.from(sheet, 'base64'));
  console.log(`contact sheet shots/tour-${id}-${size}.png`);
}
await browser.close();
console.log(`${flagged ? `${flagged} FLAGGED` : 'all stops ok'}, ${secs()} s`);
finish(flagged ? 1 : 0);
