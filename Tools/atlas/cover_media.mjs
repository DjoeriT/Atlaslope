// The media of the Atlas cover card (src/cards/AtlasCard.tsx): two short map loops and three stills under public/atlas/, made from the app
// itself with its interface hidden. Run it again when the map's look changes; the files are committed (no build step makes them).
//   VITE_ESRI_API_KEY=keyless npm run build && npx vite preview --port 4180 --strictPort &
//   node Tools/atlas/cover_media.mjs http://localhost:4180 [tour] [tilt] [stills] [--out dir]     (no name = all three)
//
//   tour    atlas-tour.webm   a Priorat map tour: the guide's own tilted stops (pitch 55 to 72), flown by scrolling the guide as a reader does
//   tilt    atlas-tilt.webm   a slow turn over the Ribeira Sacra slopes, pitched, nothing else moving
//   stills  atlas-borders.webp, atlas-climate.webp, atlas-guide.webp (the guide still is the Rioja page's top, interface included: it is the product)
// Each clip is 800 x 500, 5 to 6 s, and starts and ends on the same view so it loops without a jump. A poster (first frame, webp) sits beside it.
// The Esri key only works on atlaslope.com, so Esri tiles go to the keyless World Imagery endpoint (as Tools/guides/region_tile.mjs does).
// Encoders: Playwright's own bundled ffmpeg (VP8 webm, trimming, frames). If a system ffmpeg exists it also writes H.264 mp4 copies
// (the cover lists them first for older Safari); without one the clips ship as webm plus poster, and nothing is installed.
// Credit and paper trail: data/SOURCES.md ("public/atlas/*").
import { chromium } from '@playwright/test';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const outAt = args.indexOf('--out');
const outDir = outAt >= 0 ? args.splice(outAt, 2)[1] : 'public/atlas';
const [base, ...wanted] = args;
if (!base) throw new Error('usage: node Tools/atlas/cover_media.mjs <base url> [tour] [tilt] [stills] [--out dir]');
const jobs = wanted.length ? wanted : ['tour', 'tilt', 'stills'];

const W = 800, H = 500;
const BAR = 64; // the atlas bar above the map, taller than it is, so the canvas below it is at least H high
const DWELL = 0.7; // s the story camera waits after a scroll before it flies (DWELL_MS in src/story/camera.ts)
const MAX_CLIP = 1.5 * 1024 * 1024;
const MAX_STILL = 200 * 1024;
const GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

mkdirSync(outDir, { recursive: true });
mkdirSync('shots/atlas', { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ffmpeg: Playwright ships a small one (VP8, trimming, frame grabs); a system one adds H.264.
const pwDir = join(process.env.PLAYWRIGHT_BROWSERS_PATH ?? join(homedir(), 'Library/Caches/ms-playwright'));
const pwFfmpeg = existsSync(pwDir) ? readdirSync(pwDir).filter((d) => d.startsWith('ffmpeg-')).map((d) => join(pwDir, d, 'ffmpeg-mac')).find(existsSync) : null;
const system = spawnSync('which', ['ffmpeg'], { encoding: 'utf8' });
const sysFfmpeg = system.status === 0 ? system.stdout.trim() : null;
const ffmpeg = sysFfmpeg ?? pwFfmpeg;
if (!ffmpeg) throw new Error('no ffmpeg: neither a system one nor the one Playwright ships (run npx playwright install chromium)');
const run = (bin, a) => execFileSync(bin, ['-hide_banner', '-loglevel', 'error', '-y', ...a]);

async function context(browser, { record, hash, height = H }) {
  const ctx = await browser.newContext({
    viewport: { width: W, height },
    ...(record ? { recordVideo: { dir: 'shots/atlas/rec', size: { width: W, height: H } } } : {}),
  });
  await ctx.route(/ibasemaps-api\.arcgis\.com/, (r) =>
    r.continue({ url: r.request().url().replace('ibasemaps-api.arcgis.com/arcgis', 'services.arcgisonline.com/ArcGIS').replace(/\?.*$/, '') }));
  await ctx.route(/glyphs|fonts\/.*\.pbf/, (r) => r.abort());
  await ctx.addInitScript(() => { try { localStorage.setItem('atlaslope-first-run', 'seen'); } catch { /* none */ } });
  const page = await ctx.newPage();
  const born = Date.now();
  await page.goto(`${base}/atlas/${hash}`);
  return { ctx, page, born };
}

// Only the map: the story map fills the frame, everything else (bars, chip, controls, locator, credit) is hidden.
const MAP_ONLY = `
  .pg-tourmap { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 99999 !important; margin: 0 !important; transform: none !important; }
  .pg-tourmap-in, .story-map { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; margin: 0 !important; }
  .pg-tourmap-in > :not(.story-map), .maplibregl-ctrl { display: none !important; }
`;

/** Close the context (which finishes the video) and return the webm's path. */
async function finish(ctx, page) {
  const file = await page.video().path();
  await ctx.close();
  return file;
}

/** Cut [from, from+len] s out of a recording as VP8 webm, a poster from its first frame, and an mp4 when a system ffmpeg exists. */
function cut(rec, from, len, name, speed = 1) {
  const webm = join(outDir, `${name}.webm`);
  const poster = join(outDir, `${name}-poster.webp`);
  const png = `shots/atlas/${name}-first.png`;
  run(pwFfmpeg ?? ffmpeg, [...(speed === 1 ? [] : ['-itsscale', String(1 / speed)]), '-ss', String(from), '-t', String(len), '-i', rec, '-an', '-c:v', 'libvpx', '-b:v', '900k', '-crf', '12', '-g', '30', '-auto-alt-ref', '0', webm]);
  run(pwFfmpeg ?? ffmpeg, ['-i', webm, '-frames:v', '1', png]);
  execFileSync('cwebp', ['-quiet', '-q', '78', png, '-o', poster]);
  if (sysFfmpeg) run(sysFfmpeg, ['-i', webm, '-an', '-c:v', 'libx264', '-crf', '24', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(outDir, `${name}.mp4`)]);
  const size = statSync(webm).size;
  console.log(webm, size, 'bytes', size > MAX_CLIP ? 'TOO BIG' : 'ok');
  if (size > MAX_CLIP) process.exitCode = 1;
}

async function tour(browser) {
  const { ctx, page, born } = await context(browser, { record: true, hash: '#place=priorat&page&story' });
  await page.addStyleTag({ content: MAP_ONLY });
  await page.waitForSelector('.pg-tourmap[data-step]');
  await sleep(9000); // the first view and its tiles settle
  const go = (anchor) => page.locator('.pg').evaluate((pg, a) => {
    const el = a ? pg.querySelector(a) : null;
    pg.scrollTop = el ? pg.scrollTop + el.getBoundingClientRect().top - innerHeight * 0.45 : 0;
  }, anchor);
  const start = (Date.now() - born) / 1000;
  const marks = [];
  for (const [anchor, hold] of JSON.parse(process.env.TOUR_PLAN ?? '[["[data-fly=\\"bowl.2\\"]",3500],["",4800]]')) {
    await go(anchor || null);
    await sleep(hold);
    marks.push(await page.locator('.pg-tourmap').getAttribute('data-step'));
  }
  const len = (Date.now() - born) / 1000 - start;
  console.log('tour steps', marks.join(' > '), 'length', len.toFixed(1), 's');
  const rec = await finish(ctx, page);
  cut(rec, start + DWELL, Math.min(len - DWELL, 6), "atlas-tour");
}

// Only the map canvas stays visible (no bars, card, controls or labels over it).
const CANVAS_ONLY = '* { visibility: hidden !important } .maplibregl-canvas { visibility: visible !important }';

async function tilt(browser) {
  // Canyon of the Sil, Ribeira Sacra: pitch 66, the camera of the guide's own "canon" stop. The turn is a slow drag-rotate there and back
  // (ease in and out), so the last frame is the first and the loop has no jump.
  const { ctx, page, born } = await context(browser, { record: true, hash: '#place=ribeira-sacra&view=-7.5642,42.3905,11.9,300,42' });
  await page.addStyleTag({ content: CANVAS_ONLY });
  await sleep(13000);
  const box = await page.locator('.maplibregl-canvas').boundingBox();
  const x0 = box.x + box.width / 2, y = box.y + box.height / 2;
  const RANGE = 150, MS = 5000;   // px dragged out and back in MS: about 35 degrees of bearing each way
  const start = (Date.now() - born) / 1000;
  // Time-based, inside the page: the swiftshader renderer is slow, so one real mouse move per frame would stretch the turn.
  await page.evaluate(([x, y, range, ms]) => new Promise((done) => {
    const el = document.querySelector('.maplibregl-canvas');
    const fire = (type, cx) => el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window, button: 0, buttons: type === 'mouseup' ? 0 : 1, ctrlKey: true, clientX: cx, clientY: y }));
    fire('mousedown', x);
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / ms);
      fire('mousemove', x + range * Math.sin(Math.PI * t) ** 2);
      if (t < 1) requestAnimationFrame(tick); else { fire('mouseup', x); done(); }
    };
    requestAnimationFrame(tick);
  }), [x0, y, RANGE, MS]);
  const len = (Date.now() - born) / 1000 - start;
  console.log('tilt length', len.toFixed(1), 's');
  await sleep(300);
  const rec = await finish(ctx, page);
  cut(rec, start, Math.min(len, 6), 'atlas-tilt');
}

/** A still of the live map at a view, nothing over it, written as webp under the size limit. */
async function map(browser, name, hash, wait = 9000) {
  const { ctx, page } = await context(browser, { record: false, hash, height: H + BAR });
  await page.addStyleTag({ content: CANVAS_ONLY });
  await sleep(wait);
  const png = `shots/atlas/${name}.png`;
  await page.locator('.maplibregl-canvas').screenshot({ path: png });
  await ctx.close();
  writeStill(png, name);
}

function writeStill(png, name) {
  for (const q of [80, 72, 64, 56, 48]) {
    execFileSync('cwebp', ['-quiet', '-q', String(q), png, '-o', join(outDir, `${name}.webp`)]);
    const size = statSync(join(outDir, `${name}.webp`)).size;
    if (size <= MAX_STILL) { console.log(join(outDir, `${name}.webp`), size, 'bytes q', q); return; }
  }
  console.log(name, 'STILL OVER', MAX_STILL);
  process.exitCode = 1;
}

async function stills(browser) {
  // Official borders on satellite: Rioja Alta close in. Climate: the whole country, coloured by climate.
  await map(browser, 'atlas-borders', '#place=rioja&view=-2.45,42.42,9.3,0,0');
  await map(browser, 'atlas-climate', '#country=spain&view=-3.7,40.0,5.7,0,0');
  // The guide still: the Rioja guide page as a reader first sees it (the product, interface and all).
  const { ctx, page } = await context(browser, { record: false, hash: '#place=rioja&page' });
  await sleep(6000);
  const png = 'shots/atlas/atlas-guide.png';
  await page.screenshot({ path: png });
  await ctx.close();
  writeStill(png, 'atlas-guide');
}

const browser = await chromium.launch({ args: GL });
try {
  if (jobs.includes('tour')) await tour(browser);
  if (jobs.includes('tilt')) await tilt(browser);
  if (jobs.includes('stills')) await stills(browser);
} finally {
  await browser.close();
  rmSync('shots/atlas/rec', { recursive: true, force: true });
}
