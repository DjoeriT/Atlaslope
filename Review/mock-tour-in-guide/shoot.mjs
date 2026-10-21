// Screenshots each state of the mock page (?solo=<id>) into shots/. Usage: node shoot.mjs [id ...]
import { chromium } from '@playwright/test';
const FR = { b1: [1400, 760], b2: [1400, 760], b3: [1400, 760], b4: [1400, 760], a1: [1400, 820], a2: [1400, 820], a3: [1400, 820],
  p1: [390, 760], p2: [390, 844], p3: [390, 844], gd1: [1400, 760], gd2: [1400, 1100], gp1: [390, 844], gp2: [390, 844] };
const ids = process.argv.length > 2 ? process.argv.slice(2) : Object.keys(FR);
const out = new URL('./shots/', import.meta.url).pathname;
const url = 'file:///Users/djoeri/Developer/Atlaslope/mocks/tour-in-guide/index.html';
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const id of ids) {
  const [w, h] = FR[id];
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on('pageerror', (e) => console.log(id, 'ERR', String(e).slice(0, 200)));
  await p.goto(url + '?solo=' + id);
  await p.waitForTimeout(id.startsWith('g') ? 2500 : 12000);
  await p.screenshot({ path: out + id + '.png' });
  console.log('shot', id);
  await p.close();
}
await b.close();
