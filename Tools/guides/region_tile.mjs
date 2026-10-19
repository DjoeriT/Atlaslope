// The Guides page's satellite tile for a study region: public/guides/<region>.webp (src/home/guideCount.ts). A unit test fails while a
// region with guides has no tile, so a new region runs this once. Shoots the app's own map (satellite, climate colours, relief), with
// place names and controls hidden, against a local debug-free build:
//   VITE_ESRI_API_KEY=keyless npm run build && npx vite preview --port 4173 &
//   node Tools/guides/region_tile.mjs http://localhost:4173 cataluna
// The Esri key only works on atlaslope.com, so Esri tiles go to the keyless World Imagery endpoint. Credit and paper trail: data/SOURCES.md.
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

// lng,lat,zoom of the map's centre (the frame is its top 812 of 900 - bar px); a new region adds its line; a new region adds its line.
const VIEWS = {
  cataluna: '1.45,41.62,7.45',
  baleares: '2.98,39.60,8.9',
  ebro: '-1.00,42.05,7.55',
};

const [base, ...regions] = process.argv.slice(2);
if (!base || !regions.length) throw new Error('usage: node Tools/guides/region_tile.mjs <base url> <region id>...');
mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1300, height: 900 } });
await ctx.route(/ibasemaps-api\.arcgis\.com/, (r) =>
  r.continue({ url: r.request().url().replace('ibasemaps-api.arcgis.com/arcgis', 'services.arcgisonline.com/ArcGIS').replace(/\?.*$/, '') }));
// No text on the tile: glyphs never load, so no place names are drawn.
await ctx.route(/glyphs|fonts\/.*\.pbf/, (r) => r.abort());
await ctx.addInitScript(() => { try { localStorage.setItem('atlaslope-first-run', 'seen'); } catch { /* none */ } });
for (const id of regions) {
  if (!VIEWS[id]) throw new Error(`no view for ${id}: add lng,lat,zoom to VIEWS`);
  const page = await ctx.newPage();
  await page.goto(`${base}/atlas/#view=${VIEWS[id]},0,0`);
  await page.addStyleTag({ content: '*{visibility:hidden!important} .maplibregl-canvas{visibility:visible!important}' });
  await page.waitForLoadState('networkidle', { timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(8000);
  const png = `shots/tile-${id}.png`;
  // The map sits under the site bar: clip a 1300x812 frame from the canvas's own top.
  const box = await page.locator('.maplibregl-canvas').boundingBox();
  await page.screenshot({ path: png, clip: { x: box.x, y: box.y, width: 1300, height: 812 } });
  execFileSync('convert', [png, '-resize', '1200x750!', '-quality', '72', `public/guides/${id}.webp`]);
  console.log(`public/guides/${id}.webp`);
  await page.close();
}
await browser.close();
