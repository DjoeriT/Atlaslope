// Key frames of option E below the band: node clip.mjs  ->  shots/frame-e-1440.png, frame-e-390.png
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '../mock-guide-redesign-r2/pw.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  await p.goto('file:///Users/djoeri/Developer/Atlaslope/mocks/guides-r1/index.html#solo=e');
  await p.waitForSelector('.ecard');
  await p.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager')));
  await p.waitForTimeout(1500);
  await p.evaluate(() => document.querySelector('#e-green-spain').scrollIntoView());
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(here, 'shots', `frame-e-${w}.png`) });
}
await b.close();
