// Mock-only variant of region_tile.mjs (Review/mock-guides-v2): the same satellite tile, but the app's own place flags (.mapflag chips,
// src/map/flags.ts) stay visible, like the home hero. A flag set shows only while one of its places is selected, so FLAG_PLACE names that
// place; a region with no set in content/flags.json has none. Writes Review/mock-guides-v2/tiles/<id>.webp (1200 wide).
//   VITE_ESRI_API_KEY=keyless npm run build && npx vite preview --port 4173 &
//   node Tools/guides/region_tile_flags.mjs http://localhost:4173 cataluna rioja ...
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

// lng,lat,zoom of the map's centre (the frame is its top 812 of 900 - bar px); a new region adds its line.
const VIEWS = {
  cataluna: '1.45,41.62,7.45',
  baleares: '2.98,39.60,8.9',
  ebro: '-1.00,42.05,7.55',
  mediterranean: '-1.00,38.78,7.6',
  canarias: '-15.80,28.45,7.35',
  meseta: '-3.75,39.45,7.05',
  andalucia: '-5.10,37.30,6.9',
  'castilla-y-leon': '-5.60,41.35,7.15',
  'green-spain': '-5.20,43.00,6.7',
  rioja: '-2.40,42.35,8.3',
};
// the place whose flag set is shown (content/flags.json); none for a region without a set
// Owner picked whole-region tiles without chips (19 Oct 2026): leave empty. e.g. { rioja: 'rioja' } would show Rioja's four flags.
const FLAG_PLACE = {};

// The frame is 1000 px wide (not 1300) at twice the pixels, so the flag chips are 1.3x as big on the tile and stay readable when it is shown
// half size on the page; the zoom drops by log2(1300/1000) to keep the same ground in view.
const zoomed = (v) => { const [a, b, z] = v.split(','); return `${a},${b},${(Number(z) - Math.log2(1300 / 1000)).toFixed(2)}`; };

const [base, ...regions] = process.argv.slice(2);
if (!base || !regions.length) throw new Error('usage: node Tools/guides/region_tile.mjs <base url> <region id>...');
mkdirSync('shots', { recursive: true });
mkdirSync('Review/mock-guides-v2/tiles', { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1000, height: 700 }, deviceScaleFactor: 2 });
await ctx.route(/ibasemaps-api\.arcgis\.com/, (r) =>
  r.continue({ url: r.request().url().replace('ibasemaps-api.arcgis.com/arcgis', 'services.arcgisonline.com/ArcGIS').replace(/\?.*$/, '') }));
// No text on the tile: glyphs never load, so no place names are drawn.
await ctx.route(/glyphs|fonts\/.*\.pbf/, (r) => r.abort());
await ctx.addInitScript(() => { try { localStorage.setItem('atlaslope-first-run', 'seen'); } catch { /* none */ } });
for (const id of regions) {
  if (!VIEWS[id]) throw new Error(`no view for ${id}: add lng,lat,zoom to VIEWS`);
  const page = await ctx.newPage();
  await page.goto(`${base}/atlas/#${FLAG_PLACE[id] ? `place=${FLAG_PLACE[id]}&` : ''}view=${zoomed(VIEWS[id])},0,0`);
  await page.addStyleTag({ content: '*{visibility:hidden!important} .maplibregl-canvas,.maplibregl-marker,.mapflag{visibility:visible!important} .flagpop,.maplibregl-popup,.flypin{display:none!important}' });
  await page.waitForLoadState('networkidle', { timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(8000);
  const png = `shots/tileflags-${id}.png`;
  // The map sits under the site bar: clip a 1000x625 frame from the canvas's own top.
  const box = await page.locator('.maplibregl-canvas').boundingBox();
  await page.screenshot({ path: png, clip: { x: box.x, y: box.y, width: 1000, height: 625 } });
  // ImageMagick on Linux; cwebp (Homebrew) on the owner's Mac, which has no ImageMagick.
  const out = `Review/mock-guides-v2/tiles/${id}.webp`;
  try { execFileSync('convert', [png, '-resize', '1200x750!', '-quality', '72', out]); }
  catch { execFileSync('cwebp', ['-quiet', '-q', '72', '-resize', '1200', '750', png, '-o', out]); }
  console.log(out);
  await page.close();
}
await browser.close();
