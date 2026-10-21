// Issue #182: (1) Esri vs PNOA colour on the same tiles (fetched directly); (2) HTTP cache across a page reload. Key read from .env.local, never printed.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const OUT = path.dirname(new URL(import.meta.url).pathname);
const env = fs.readFileSync(path.join(OUT, '../../.env.local'), 'utf8');
const key = env.match(/^VITE_ESRI_API_KEY=(.*)$/m)[1].trim();
const src = fs.readFileSync(path.join(OUT, '../../src/map/style.ts'), 'utf8');
const ESRI = src.match(/const ESRI_TILES =\s*['"`]([^'"`]+)['"`]/)[1];
const PNOA = 'https://www.ign.es/wmts/pnoa-ma?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=OI.OrthoimageCoverage&STYLE=default&FORMAT=image/jpeg&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}';
const lon = -2.6, lat = 42.5;
const tile = (z) => { const n = 2 ** z; const x = Math.floor((lon + 180) / 360 * n); const r = lat * Math.PI / 180; const y = Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n); return [x, y]; };
const fill = (t, z, x, y) => t.replace('{z}', z).replace('{x}', x).replace('{y}', y);
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage(); await page.goto('about:blank');
const out = { tiles: [] };
const mean = async (buf) => page.evaluate(async (b64) => { const bl = await (await fetch('data:image/jpeg;base64,' + b64)).blob(); const bm = await createImageBitmap(bl); const c = document.createElement('canvas'); c.width = bm.width; c.height = bm.height; const g = c.getContext('2d'); g.drawImage(bm, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data; let r = 0, gg = 0, b = 0; const n = d.length / 4; for (let i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; } return [r / n, gg / n, b / n].map((v) => +v.toFixed(1)); }, buf.toString('base64'));
for (const z of [9, 10, 11, 12]) {
  const [x, y] = tile(z);
  const row = { z, x, y };
  for (const [n, t] of [['esri', ESRI + '?token=' + encodeURIComponent(key)], ['pnoa', PNOA]]) {
    const r = await ctx.request.get(fill(t, z, x, y));
    row[n] = { status: r.status(), type: r.headers()['content-type'], cacheControl: r.headers()['cache-control'], bytes: (await r.body()).length };
    if (r.ok() && /jpeg|jpg/.test(row[n].type || '')) row[n].meanRGB = await mean(await r.body());
  }
  out.tiles.push(row);
}
fs.writeFileSync(path.join(OUT, 'tilecmp.json'), JSON.stringify(out, null, 1));
await browser.close();

// (2) reload cache test on the local build
const b2 = await chromium.launch();
const c2 = await b2.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await c2.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
const p2 = await c2.newPage();
const cdp = await c2.newCDPSession(p2); await cdp.send('Network.enable');
const rows = []; let phase = 'visit1'; const m = new Map();
cdp.on('Network.requestWillBeSent', (e) => { const u = e.request.url; const h = /ign\.es/.test(u) ? 'ign' : /arcgis/.test(u) ? 'esri' : null; if (h) m.set(e.requestId, { h, phase }); });
cdp.on('Network.requestServedFromCache', (e) => { const r = m.get(e.requestId); if (r) r.mem = true; });
cdp.on('Network.responseReceived', (e) => { const r = m.get(e.requestId); if (r) r.disk = !!e.response.fromDiskCache; });
cdp.on('Network.loadingFinished', (e) => { const r = m.get(e.requestId); if (r) { rows.push(r); m.delete(e.requestId); } });
const visit = async () => { await p2.goto('http://localhost:4599/atlas/'); await p2.waitForFunction(() => window.__map); await p2.evaluate(() => window.__map.jumpTo({ center: [-2.6, 42.5], zoom: 10, pitch: 0, bearing: 0 })); await p2.evaluate(() => new Promise((res) => { window.__map.once('idle', res); window.__map.triggerRepaint(); })); await p2.waitForTimeout(1500); };
await visit(); phase = 'visit2-reload'; await visit();
out.reload = {}; for (const ph of ['visit1', 'visit2-reload']) for (const h of ['esri', 'ign']) { const rs = rows.filter((r) => r.phase === ph && r.h === h); out.reload[`${ph}/${h}`] = { total: rs.length, fromCache: rs.filter((r) => r.disk || r.mem).length }; }
fs.writeFileSync(path.join(OUT, 'tilecmp.json'), JSON.stringify(out, null, 1));
await b2.close(); console.log(JSON.stringify(out));
