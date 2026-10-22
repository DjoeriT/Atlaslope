// Screenshot each direction of the merged page in 3200 px pieces: node blocks.mjs <url> <outdir>
import { chromium } from '@playwright/test';
const [url, out] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
for (const x of await p.$$eval('section.dir', (els) => els.map((e) => e.id.replace('dir-', '')))) {
  const box = await p.locator('#dir-' + x).boundingBox();
  let n = 0;
  for (let y = box.y; y < box.y + box.height; y += 3200, n++) {
    await p.screenshot({ path: `${out}/${x}-${n}.png`, fullPage: true, clip: { x: 0, y, width: 1440, height: Math.min(3200, box.y + box.height - y) } });
  }
  console.log(x, Math.round(box.height), n);
}
await b.close();
