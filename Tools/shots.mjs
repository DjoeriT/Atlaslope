#!/usr/bin/env node
// One command for the standard screenshots: node Tools/shots.mjs [--only home,study] [--sizes desktop,phone] [--no-build] [--url <base>]
// Builds the UI-test build and serves it like playwright.config.ts does (no network, tiles off), or uses --url (a server's /Atlaslope/ root).
// Writes shots/<view>-<size>.png. A view that fails logs one line and the run goes on. Whole run capped at 3 minutes.
import { chromium } from '@playwright/test';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createServer } from 'node:net';

const SIZES = { desktop: { width: 1280, height: 800 }, ipad: { width: 820, height: 1180 }, phone: { width: 390, height: 844 } };
const NOW = '2026-10-17T10:00:00Z'; // fixed quiz clock, as in the UI tests
const IDLE_CAP = 15_000, VIEW_CAP = 45_000, RUN_CAP = 180_000, PARALLEL = 4;
const START = /Start today's round|Learn 5 new places/;

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : null; };
const list = (name, all) => {
  const v = opt(name);
  const picked = v ? v.split(',') : all;
  const bad = picked.filter((x) => !all.includes(x));
  if (bad.length) { console.error(`unknown --${name}: ${bad.join(', ')} (have ${all.join(', ')})`); process.exit(2); }
  return picked;
};

/** The map is ready when its canvas is up and two frames 250 ms apart are identical (nothing is still drawing or flying). */
async function mapIdle(page) {
  await page.locator('.maplibregl-canvas').first().waitFor({ state: 'visible' });
  let last = null;
  const deadline = Date.now() + IDLE_CAP;
  for (;;) {
    const now = (await page.screenshot({ type: 'jpeg', quality: 30 })).toString('base64');
    if (now === last) return;
    if (Date.now() > deadline) throw new Error(`map not idle after ${IDLE_CAP / 1000} s`);
    last = now;
    await page.waitForTimeout(250);
  }
}
const heading = (page) => page.locator('h1').first().waitFor({ state: 'visible' });

// Each view: the path under /Atlaslope/ and how to know it is ready.
const VIEWS = {
  home: { path: '', ready: heading },
  atlas: { path: 'atlas/', ready: async (page) => { await heading(page); await mapIdle(page); } },
  rioja: { path: 'atlas/#place=rioja&page', ready: async (page) => { await heading(page); await mapIdle(page); } },
  study: { path: `atlas/?now=${NOW}#quiz`, ready: async (page) => { await page.getByRole('button', { name: START }).waitFor({ state: 'visible' }); await mapIdle(page); } },
  question: {
    path: `atlas/?now=${NOW}#quiz`,
    ready: async (page) => {
      await page.getByRole('button', { name: START }).click();
      for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Got it' }).click(); // day one: five intros, then the questions
      await page.locator('.q').waitFor({ state: 'visible' });
      await mapIdle(page);
    },
  },
};

const freePort = () => new Promise((res, rej) => {
  const s = createServer();
  s.on('error', rej);
  s.listen(0, () => { const { port } = s.address(); s.close(() => res(port)); });
});

const t0 = Date.now();
const secs = () => ((Date.now() - t0) / 1000).toFixed(1);
const views = list('only', Object.keys(VIEWS));
const sizes = list('sizes', Object.keys(SIZES));
let server = null;
const finish = (code) => { server?.kill(); process.exit(code); };
setTimeout(() => { console.error('shots: overall 3 min timeout, stopping'); finish(1); }, RUN_CAP).unref();

let base = opt('url');
if (!base) {
  if (!args.includes('--no-build')) {
    const b = spawnSync('npx', ['vite', 'build', '--mode', 'uitest', '--outDir', 'dist/uitest', '--logLevel', 'error'], { stdio: 'inherit', timeout: 120_000 });
    if (b.status !== 0) { console.error('shots: build failed'); finish(1); }
    console.log(`built in ${secs()} s`);
  }
  const port = await freePort();
  server = spawn('npx', ['vite', 'preview', '--outDir', 'dist/uitest', '--port', String(port), '--strictPort', '--base', '/Atlaslope/'], { stdio: 'ignore' });
  base = `http://localhost:${port}/Atlaslope/`;
  for (let i = 0; !(await fetch(base).then((r) => r.ok, () => false)); i++) {
    if (i > 100) { console.error('shots: preview server did not start'); finish(1); }
    await new Promise((r) => setTimeout(r, 200));
  }
}
if (!base.endsWith('/')) base += '/';

mkdirSync('shots', { recursive: true });
const browser = await chromium.launch();
const jobs = views.flatMap((v) => sizes.map((s) => [v, s]));
let failed = 0;

async function shoot([view, size]) {
  const file = `shots/${view}-${size}.png`;
  const ctx = await browser.newContext({ viewport: SIZES[size] });
  await ctx.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  const page = await ctx.newPage();
  const start = Date.now();
  let timer;
  try {
    const run = async () => { await page.goto(base + VIEWS[view].path); await VIEWS[view].ready(page); await page.screenshot({ path: file }); };
    await Promise.race([run(), new Promise((_, rej) => { timer = setTimeout(() => rej(new Error(`view took more than ${VIEW_CAP / 1000} s`)), VIEW_CAP); })]);
    console.log(`${file}  ${((Date.now() - start) / 1000).toFixed(1)} s`);
  } catch (e) {
    failed++;
    console.log(`FAILED ${view}-${size}: ${String(e.message).split('\n')[0]}`);
  } finally {
    clearTimeout(timer);
    await ctx.close().catch(() => {});
  }
}

const queue = [...jobs];
await Promise.all(Array.from({ length: PARALLEL }, async () => { for (let j; (j = queue.shift()); ) await shoot(j); }));
await browser.close();
console.log(`${jobs.length - failed}/${jobs.length} shots in ${secs()} s`);
finish(failed ? 1 : 0);
