// Screenshots of the map at close-in views, for the zoom-detail mock and design check. Runs in GitHub Actions (map-preview
// workflow), where the tile hosts are reachable; the cloud container cannot load them.
//   node Tools/preview/map_shots.mjs <base url> <out dir> [label]
// Views are the app's own #view= links (lng,lat,zoom,bearing,pitch). Screens: a 2x laptop and a 2x iPad.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const [base, out, label = 'new'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });

export const VIEWS = {
  'haro-z16': '-2.848,42.574,16,0,0',
  'haro-z14': '-2.848,42.574,14,0,0',
  'haro-z13-tilt': '-2.86,42.56,13,20,55',
  'logrono-z12': '-2.445,42.465,12,0,0',
  'jerez-z13': '-6.14,36.69,13,0,0',
  'priorat-z13-tilt': '0.78,41.2,13,-30,60',
  'spain-z6': '-3.7,40.2,5.8,0,0',
  'rioja-z8': '-2.6,42.5,8,0,0',
  'rioja-z9': '-2.6,42.5,9,0,0',
  'rioja-z10': '-2.6,42.5,10,0,0',
  'border-tui-z14': '-8.646,42.047,14,0,0',
  // 3D relief, tilted (relief and base-map slice, 18 Oct 2026).
  'spain-z6-tilt': '-3.7,40.6,5.8,0,50',
  'rioja-z10-tilt': '-2.75,42.45,10,15,60',
  // Satellite switched off in the map menu: the road map under the plain atlas.
  'atlas-rioja-z11': '-2.7,42.53,11,0,0',
  'atlas-haro-z13': '-2.848,42.574,13,0,0',
  'atlas-haro-z15': '-2.848,42.574,15,0,0',
  'atlas-rioja-z10-tilt': '-2.75,42.45,10,15,60',
};
const SCREENS = { mac: { width: 1440, height: 900 }, ipad: { width: 1024, height: 768 } };

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [screen, viewport] of Object.entries(SCREENS)) {
  if (screen === 'ipad' && label !== 'new') continue;
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  // Preview only: the Esri key is limited to atlaslope.com, so the runner's localhost requests borrow its referer.
  await ctx.route(/arcgis\.com/, (r) => r.continue({ headers: { ...r.request().headers(), referer: 'https://atlaslope.com/' } }));
  // Skip the first-run welcome card so the map shows; the Spain card stays, as a learner sees it.
  await ctx.addInitScript(() => { try { localStorage.setItem('atlaslope-first-run', 'seen'); } catch { /* none */ } });
  const page = await ctx.newPage();
  const failed = [];
  const logged = new Set();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logged.add(`console: ${m.text().slice(0, 300)}`); });
  page.on('pageerror', (e) => logged.add(`page error: ${e.message.slice(0, 300)}`));
  page.on('response', (r) => { if (!r.ok() && /ign\.es|openfreemap|arcgis|terrarium/.test(r.url())) failed.push(`${r.status()} ${r.url().split('?')[0]}`); });
  for (const [name, view] of Object.entries(VIEWS).filter(([n]) => !process.env.ONLY || process.env.ONLY.split(',').map((s) => s.trim()).includes(n))) {
    if (screen === 'ipad' && !['haro-z16', 'priorat-z13-tilt'].includes(name)) continue;
    await page.goto('about:blank');
    await page.goto(`${base}#view=${view}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    if (name.startsWith('atlas-')) {
      await page.getByRole('button', { name: 'Map layers' }).click({ timeout: 30_000 }).catch(() => console.log(`${name}: no map menu`));
      await page.getByLabel('Satellite imagery').uncheck({ timeout: 10_000 }).catch(() => console.log(`${name}: satellite not switched off`));
      await page.keyboard.press('Escape');
    }
    await page.waitForLoadState('networkidle', { timeout: Number(process.env.IDLE_MS ?? 45_000) }).catch(() => console.log(`${name}: network not idle after 45 s`));
    // Software GL (no GPU on the runner) redraws 3D relief slowly and shows empty frames meanwhile: take four frames
    // ten seconds apart and keep the one with the most detail (the largest file).
    let best = null;
    for (let i = 0; i < 4; i++) {
      await page.waitForTimeout(i ? 10_000 : 2500);
      const shot = await page.screenshot({ type: 'jpeg', quality: 82 });
      if (!best || shot.length > best.length) best = shot;
    }
    writeFileSync(`${out}/${label}-${screen}-${name}.jpg`, best);
    console.log(`${label} ${screen} ${name}`);
  }
  console.log(`failed tile requests: ${failed.length}`);
  [...logged].slice(0, 15).forEach((l) => console.log(l));
  failed.slice(0, 15).forEach((f) => console.log(f));
  await ctx.close();
}
await browser.close();
