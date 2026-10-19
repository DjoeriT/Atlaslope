// The Guides page's satellite tile for a study region: public/guides/<region>.webp (src/home/guideCount.ts). A unit test fails while a
// region with guides has no tile, so a new region runs this once. No hand-set view table: it fits the region's own places (data/places.json
// with their boundaries) into a 1.6 : 1 frame with 8% air round them, opens the app's own region view (#region=<id>, so the other regions
// are dimmed as in the app) at that camera, flat, without the card and controls, and writes the region's own place names over it
// (readable, largest place first, a name that would collide is dropped). Run it against a local debug-free build:
//   VITE_ESRI_API_KEY=keyless npm run build && npx vite preview --port 4180 --strictPort &
//   node Tools/guides/region_tile.mjs http://localhost:4180 cataluna [more ids] [--out dir]
// The Esri key only works on atlaslope.com, so Esri tiles go to the keyless World Imagery endpoint. Credit and paper trail: data/SOURCES.md.
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const outAt = args.indexOf('--out');
const outDir = outAt >= 0 ? args.splice(outAt, 2)[1] : 'public/guides';
const [base, ...regions] = args;
if (!base || !regions.length) throw new Error('usage: node Tools/guides/region_tile.mjs <base url> <region id>... [--out dir]');

const W = 1825, H = 900;        // viewport
const FW = 1281, FH = 802;      // the shot: 1.6 : 1, resized to 1200x750
const AIR = 0.08;               // share of the frame left empty on each side of the region

const read = (f) => JSON.parse(readFileSync(f, 'utf8'));
const places = read('data/places.json').places;
const dops = read('data/dops.geojson').features;
const added = read('data/added-boundaries.geojson').features;
const zonesGeo = read('data/rioja-zones.geojson').features;
const rings = (g) => (g.type === 'Polygon' ? [g.coordinates[0]] : g.coordinates.map((p) => p[0]));
const shoelace = (r) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
// Web Mercator in world pixels at zoom 0 (512 px tiles, as MapLibre)
const mx = (lo) => ((lo + 180) / 360) * 512;
const my = (la) => (0.5 - Math.log(Math.tan(Math.PI / 4 + (la * Math.PI) / 360)) / (2 * Math.PI)) * 512;

/** The region's places (kind zone: the zones of its own places) that have a boundary: name, centroid of the largest ring, and every ring (for the fit). */
function placesOf(region, zones = false) {
  const own = places.filter((p) => p.region === region);
  const ids = new Set(own.map((p) => p.id));
  return own.filter((p) => (p.kind === 'zone') === zones && (!zones || ids.has(p.parent))).flatMap((p) => {
    const f = p.boundary === 'mapa-2014' ? dops.find((d) => d.properties.code === p.layerCode)
      : p.boundary === 'rioja-zones' ? zonesGeo.find((z) => z.properties.zone === p.name) : added.find((a) => a.properties.id === p.id);
    if (!f) return [];
    const all = rings(f.geometry);
    const big = [...all].sort((a, b) => Math.abs(shoelace(b)) - Math.abs(shoelace(a)))[0];
    const a2 = shoelace(big);
    let cx = 0, cy = 0;
    big.forEach((q, i) => { const n = big[(i + 1) % big.length]; const c = q[0] * n[1] - n[0] * q[1]; cx += (q[0] + n[0]) * c; cy += (q[1] + n[1]) * c; });
    return [{ name: p.name, lng: cx / (3 * a2), lat: cy / (3 * a2), size: Math.abs(a2), rings: all }];
  }).sort((a, b) => b.size - a.size);
}

mkdirSync('shots', { recursive: true });
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H } });
await ctx.route(/ibasemaps-api\.arcgis\.com/, (r) =>
  r.continue({ url: r.request().url().replace('ibasemaps-api.arcgis.com/arcgis', 'services.arcgisonline.com/ArcGIS').replace(/\?.*$/, '') }));
await ctx.route(/glyphs|fonts\/.*\.pbf/, (r) => r.abort());
await ctx.addInitScript(() => { try { localStorage.setItem('atlaslope-first-run', 'seen'); } catch { /* none */ } });

for (const id of regions) {
  const list = placesOf(id);
  const zoneList = placesOf(id, true);   // labelled after the places, so they only get what is left
  if (!list.length) throw new Error(`${id}: no places with a boundary in data/places.json`);
  // A place that spreads over far more ground than the typical one (Cava is scattered over half of Spain) is drawn but does not set the frame.
  const diag = (p) => { const q = p.rings.flat(); return Math.hypot(Math.max(...q.map((c) => c[0])) - Math.min(...q.map((c) => c[0])), Math.max(...q.map((c) => c[1])) - Math.min(...q.map((c) => c[1]))); };
  const median = [...list].map(diag).sort((a, b) => a - b)[Math.floor(list.length / 2)];
  const fit = list.filter((p) => diag(p) <= 8 * median);
  const pts = (fit.length ? fit : list).flatMap((p) => p.rings.flat()).map(([lo, la]) => [mx(lo), my(la)]);
  const [x0, x1] = [Math.min(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[0]))];
  const [y0, y1] = [Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[1]))];
  const zoom = Math.min(10, Math.log2(Math.min((FW * (1 - 2 * AIR)) / (x1 - x0), (FH * (1 - 2 * AIR)) / (y1 - y0))));
  const S = 2 ** zoom, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const lng = (cx / 512) * 360 - 180;
  const lat = (Math.atan(Math.sinh(Math.PI * (1 - (2 * cy) / 512))) * 180) / Math.PI;

  const page = await ctx.newPage();
  await page.goto(`${base}/atlas/#region=${id}&view=${lng.toFixed(5)},${lat.toFixed(5)},${zoom.toFixed(3)},0,0`);
  await page.waitForLoadState('networkidle', { timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(8000);
  // The camera centre is the middle of the map canvas (it sits under the site bar).
  const box = await page.locator('.maplibregl-canvas').boundingBox();
  const clip = { x: Math.round(box.x + box.width / 2 - FW / 2), y: Math.round(box.y + box.height / 2 - FH / 2), width: FW, height: FH };
  const FONT = 26, PADX = 9, HEIGHT = 40;
  const placed = [];
  for (const p of [...list, ...zoneList]) {
    const x = clip.x + FW / 2 + (mx(p.lng) - cx) * S, y = clip.y + FH / 2 + (my(p.lat) - cy) * S;
    const w = p.name.length * FONT * 0.56 + PADX * 2;
    const b = { x: x - w / 2, y: y - HEIGHT / 2, w, h: HEIGHT };
    const inside = b.x > clip.x + 6 && b.x + w < clip.x + FW - 6 && b.y > clip.y + 6 && b.y + HEIGHT < clip.y + FH - 6;
    const clash = placed.some((q) => b.x < q.x + q.w + 6 && q.x < b.x + w + 6 && b.y < q.y + q.h + 6 && q.y < b.y + HEIGHT + 6);
    if (inside && !clash) placed.push({ ...b, name: p.name });
  }
  await page.addStyleTag({ content: '*{visibility:hidden!important} .maplibregl-canvas,.tile-name{visibility:visible!important}' });
  await page.evaluate((names) => {
    for (const n of names) {
      const d = document.createElement('div');
      d.className = 'tile-name';
      d.textContent = n.name;
      d.style.cssText = `position:fixed;left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px;line-height:${n.h}px;text-align:center;white-space:nowrap;` +
        'font:600 26px "IBM Plex Sans",system-ui,sans-serif;color:#fff;text-shadow:0 0 4px #000,0 0 8px #000,0 1px 2px #000;z-index:9';
      document.body.append(d);
    }
  }, placed);
  const png = `shots/tile-${id}.png`;
  await page.screenshot({ path: png, clip });
  // ImageMagick on Linux; cwebp (Homebrew) on the owner's Mac, which has no ImageMagick.
  const out = `${outDir}/${id}.webp`;
  try { execFileSync('convert', [png, '-resize', '1200x750!', '-quality', '72', out]); }
  catch { execFileSync('cwebp', ['-quiet', '-q', '72', '-resize', '1200', '750', png, '-o', out]); }
  console.log(out, `zoom ${zoom.toFixed(2)}`, placed.map((n) => n.name).join(' | '));
  await page.close();
}
await browser.close();
