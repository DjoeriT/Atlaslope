// Issue #182 measurement. Usage: node Review/sat-flicker/measure.mjs <baseUrl>  (a build with window.__map exposed; see report.md)
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const base = process.argv[2] || 'http://localhost:4599/';
const OUT = path.dirname(new URL(import.meta.url).pathname);
const CENTER = [-2.6, 42.5];
const hostOf = (u) => (/ign\.es/.test(u) ? 'ign' : /arcgis/.test(u) ? 'esri' : /terrarium|elevation|mapzen|aws/.test(u) ? 'dem' : null);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(browser, dpr, video) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: dpr,
    ...(video ? { recordVideo: { dir: path.join(OUT, 'vid'), size: { width: 720, height: 450 } } } : {}) });
  await ctx.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  const ev = { leg: 'load', reqs: new Map(), seen: new Set(), rows: [] };
  cdp.on('Network.requestWillBeSent', (e) => { const h = hostOf(e.request.url); if (!h) return; ev.reqs.set(e.requestId, { url: e.request.url, h, leg: ev.leg, repeat: ev.seen.has(e.request.url.replace(/key=[^&]*|token=[^&]*/g, '')) }); });
  cdp.on('Network.requestServedFromCache', (e) => { const r = ev.reqs.get(e.requestId); if (r) r.memCache = true; });
  cdp.on('Network.responseReceived', (e) => { const r = ev.reqs.get(e.requestId); if (!r) return; r.status = e.response.status; r.disk = !!e.response.fromDiskCache; r.sw = !!e.response.fromServiceWorker; r.t = e.response.timing?.receiveHeadersEnd; });
  cdp.on('Network.loadingFinished', (e) => { const r = ev.reqs.get(e.requestId); if (!r) return; r.bytes = e.encodedDataLength; ev.seen.add(r.url.replace(/key=[^&]*|token=[^&]*/g, '')); ev.rows.push(r); ev.reqs.delete(e.requestId); });
  await page.goto(base + 'atlas/');
  await page.waitForFunction(() => window.__map && window.__map.loaded !== undefined, null, { timeout: 30000 });
  await page.evaluate(([c]) => {
    const m = window.__map; window.__ml = { load: {} };
    m.on('dataloading', (e) => { if (e.tile && e.sourceId) { const k = window.__ml.leg + '|' + e.sourceId; window.__ml.load[k] = (window.__ml.load[k] || 0) + 1; } });
    m.jumpTo({ center: c, zoom: 6, pitch: 0, bearing: 0 });
  }, [CENTER]);
  return { ctx, page, ev };
}
const idle = (page) => page.evaluate(() => new Promise((res) => { const m = window.__map; let done = false; const f = () => { if (!done) { done = true; res(true); } }; setTimeout(f, 30000); if (m.loaded() && !m.isMoving()) { m.once('idle', f); m.triggerRepaint(); } else m.once('idle', f); }));
const ease = (page, zoom, ms) => page.evaluate(([c, z, d]) => new Promise((res) => { const m = window.__map; m.once('moveend', () => res(true)); m.easeTo({ center: c, zoom: z, duration: d, pitch: 0, bearing: 0 }); }), [CENTER, zoom, ms]);

async function passes(page, ev, tag) {
  const legs = [];
  const run = async (name, from, to) => {
    ev.leg = name; await page.evaluate((n) => { window.__ml.leg = n; }, name);
    const step = to > from ? 1 : -1;
    for (let z = from + step; step > 0 ? z <= to : z >= to; z += step) { await ease(page, z, 1500); }
    await idle(page); await sleep(1000);
    legs.push(name);
  };
  for (const p of [1, 2]) { await run(`${tag}p${p}-up`, 6, 12); await run(`${tag}p${p}-down`, 12, 6); }
  return legs;
}
function summarise(ev, legs, mlLoads) {
  const out = {};
  for (const leg of legs.concat(['load'])) {
    const rows = ev.rows.filter((r) => r.leg === leg);
    const o = {};
    for (const h of ['esri', 'ign', 'dem']) {
      const rs = rows.filter((r) => r.h === h);
      const zs = {}; rs.forEach((r) => { const m = r.url.match(/\/(\d+)\/(\d+)\/(\d+)(?:[.?]|$)/) || r.url.match(/TILEMATRIX=(\d+)&TILEROW=(\d+)&TILECOL=(\d+)/); const z = h === 'ign' ? (r.url.match(/TileMatrix=(\d+)/i) || [])[1] : h === 'esri' ? (r.url.match(/tile\/(\d+)\//) || [])[1] : (r.url.match(/\/(\d+)\/\d+\/\d+\.png/) || [])[1]; zs[z] = (zs[z] || 0) + 1; });
      o[h] = { total: rs.length, fromCache: rs.filter((r) => r.disk || r.memCache).length, network: rs.filter((r) => !(r.disk || r.memCache)).length, repeatUrls: rs.filter((r) => r.repeat).length, repeatNetwork: rs.filter((r) => r.repeat && !(r.disk || r.memCache)).length, byTileZoom: zs, bytesNet: rs.filter((r) => !(r.disk || r.memCache)).reduce((a, r) => a + (r.bytes || 0), 0) };
    }
    const ml = {}; for (const [k, v] of Object.entries(mlLoads)) if (k.startsWith(leg + '|')) ml[k.split('|')[1]] = v;
    o.maplibreTileLoads = ml; out[leg] = o;
  }
  return out;
}

const browser = await chromium.launch();
const results = { when: new Date().toISOString(), centre: CENTER };

// (a) colour, DPR 2
{
  const { ctx, page, ev } = await open(browser, 2, false);
  await page.evaluate(() => { const m = window.__map; ['dos-fill', 'dos-casing', 'dos-line', 'borders', 'borders-casing', 'zones-fill'].forEach((l) => { if (m.getLayer(l)) m.setLayoutProperty(l, 'visibility', 'none'); }); });
  const dec = await ctx.newPage();
  await dec.goto('about:blank');
  const colour = [];
  const shot = async (z, variant, fn) => {
    await page.evaluate(([c, z]) => window.__map.jumpTo({ center: c, zoom: z }), [CENTER, z]);
    if (fn) await page.evaluate(fn);
    await idle(page); await sleep(1000);
    const buf = await page.screenshot({ type: 'png', clip: { x: 520, y: 250, width: 400, height: 400 } });
    const rgb = await dec.evaluate(async (b64) => { const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data; let r = 0, gg = 0, b = 0, n = d.length / 4; for (let i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; } return [r / n, gg / n, b / n].map((v) => +v.toFixed(1)); }, buf.toString('base64'));
    const st = await page.evaluate(() => { const m = window.__map; const v = (l) => (m.getLayer(l) ? m.getLayoutProperty(l, 'visibility') || 'visible' : 'absent'); return { satellite: v('satellite'), pnoa: v('pnoa'), hillshade: v('hillshade'), zoom: +m.getZoom().toFixed(2) }; });
    if (variant === 'default') fs.writeFileSync(path.join(OUT, `z${z}.jpg`), await page.screenshot({ type: 'jpeg', quality: 55 }));
    colour.push({ zoom: z, variant, meanRGB: rgb, ...st });
  };
  for (const z of [6, 7, 8, 9, 10, 11, 12]) {
    await shot(z, 'default');
    await shot(z, 'noRelief', () => window.__map.setLayoutProperty('hillshade', 'visibility', 'none'));
    if (z >= 8) {
      await shot(z, 'esriOnly(noRelief)', () => { window.__map.setLayoutProperty('pnoa', 'visibility', 'none'); window.__map.setLayoutProperty('satellite', 'visibility', 'visible'); });
      await shot(z, 'pnoaOnly(noRelief)', () => { window.__map.setLayoutProperty('pnoa', 'visibility', 'visible'); window.__map.setLayoutProperty('satellite', 'visibility', 'none'); });
    }
    await page.evaluate(() => { const m = window.__map; m.setLayoutProperty('hillshade', 'visibility', 'visible'); m.setLayoutProperty('pnoa', 'visibility', 'visible'); m.setLayoutProperty('satellite', 'visibility', 'visible'); });
  }
  results.colourDPR2 = colour;
  await ctx.close();
}
// (b)(d) passes, DPR 2 and 1; (c) video on DPR2 repeat
for (const [dpr, video, key] of [[2, false, 'passesDPR2'], [1, false, 'passesDPR1'], [2, true, 'passesDPR2_video']]) {
  const { ctx, page, ev } = await open(browser, dpr, video);
  await idle(page); await sleep(1000);
  const legs = await passes(page, ev, '');
  const ml = await page.evaluate(() => window.__ml.load);
  results[key] = summarise(ev, legs, ml);
  results[key].maplibreOpts = await page.evaluate(() => ({ tileSizeSat: window.__map.getSource('satellite')?.tileSize, fade: window.__map.getPaintProperty('satellite', 'raster-fade-duration'), dpr: devicePixelRatio, maxTileCacheSize: window.__map._maxTileCacheSize ?? null, maxTileCacheZoomLevels: window.__map._maxTileCacheZoomLevels ?? null, pitchStart: window.__map.getPitch() }));
  const vp = page.video();
  await ctx.close();
  if (video && vp) { const p = await vp.path(); fs.copyFileSync(p, path.join(OUT, 'pass2.webm')); fs.rmSync(path.join(OUT, 'vid'), { recursive: true, force: true }); }
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
console.log('done');
