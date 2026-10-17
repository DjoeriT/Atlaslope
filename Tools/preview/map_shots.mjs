// Screenshots of the map at close-in views, for the zoom-detail mock and design check. Runs in GitHub Actions (map-preview
// workflow), where the tile hosts are reachable; the cloud container cannot load them.
//   node Tools/preview/map_shots.mjs <base url> <out dir> [label]
// Views are the app's own #view= links (lng,lat,zoom,bearing,pitch). Screens: a 2x laptop and a 2x iPad.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [base, out, label = 'new'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });

export const VIEWS = {
  'haro-z16': '-2.848,42.574,16,0,0',
  'haro-z14': '-2.848,42.574,14,0,0',
  'haro-z13-tilt': '-2.86,42.56,13,20,55',
  'logrono-z12': '-2.445,42.465,12,0,0',
  'jerez-z13': '-6.14,36.69,13,0,0',
  'priorat-z13-tilt': '0.78,41.2,13,-30,60',
  'rioja-z10': '-2.6,42.5,10,0,0',
  'border-tui-z14': '-8.646,42.047,14,0,0',
};
const SCREENS = { mac: { width: 1440, height: 900 }, ipad: { width: 1024, height: 768 } };

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [screen, viewport] of Object.entries(SCREENS)) {
  if (screen === 'ipad' && label !== 'new') continue;
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  // The Esri key only answers for the site's own address; the preview runs on localhost.
  await ctx.route(/arcgis\.com/, (r) => r.continue({ headers: { ...r.request().headers(), referer: 'https://atlaslope.com/' } }));
  // Skip the first-run welcome card so the map shows; the Spain card stays, as a learner sees it.
  await ctx.addInitScript(() => { try { localStorage.setItem('atlaslope-first-run', 'seen'); } catch { /* none */ } });
  const page = await ctx.newPage();
  const failed = [];
  page.on('response', (r) => { if (!r.ok() && /ign\.es|openfreemap|arcgis|terrarium/.test(r.url())) failed.push(`${r.status()} ${r.url().split('?')[0]}`); });
  for (const [name, view] of Object.entries(VIEWS)) {
    if (screen === 'ipad' && !['haro-z16', 'priorat-z13-tilt'].includes(name)) continue;
    await page.goto('about:blank');
    await page.goto(`${base}#view=${view}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForLoadState('networkidle', { timeout: Number(process.env.IDLE_MS ?? 45_000) }).catch(() => console.log(`${name}: network not idle after 45 s`));
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${out}/${label}-${screen}-${name}.jpg`, type: 'jpeg', quality: 82 });
    console.log(`${label} ${screen} ${name}`);
  }
  console.log(`failed tile requests: ${failed.length}`);
  failed.slice(0, 15).forEach((f) => console.log(f));
  await ctx.close();
}
await browser.close();
