// Contact sheets of every guide photo (labelled, checked focus applied) for choosing the region photos by hand.
// Writes two JPEGs to the folder given as argv[2].
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '../mock-guide-redesign-r2/pw.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2];
const d = JSON.parse(fs.readFileSync(path.join(here, 'data.json'), 'utf8'));
const items = d.regions.flatMap((r) => r.guides.filter((g) => g.photo).map((g) => [r.id, g]));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1412, height: 800 } });
for (const [n, chunk] of [items.slice(0, 42), items.slice(42)].entries()) {
  const h = '<body style="margin:0;font:11px sans-serif;display:grid;grid-template-columns:repeat(7,1fr);gap:6px;padding:6px;width:1400px">' + chunk.map(([rid, g]) => `<div><img src="file:///Users/djoeri/Developer/Atlaslope/mocks/guides-r1/img/480/${g.photo}.webp" style="width:100%;aspect-ratio:1;object-fit:cover;object-position:${g.focus || '50% 50%'}"><br>${rid.slice(0, 4)} ${g.id}</div>`).join('');
  const f = path.join(out, `pick${n}.html`);
  fs.writeFileSync(f, h);
  await p.goto('file://' + f);
  await p.waitForTimeout(800);
  await p.screenshot({ path: path.join(out, `pick${n}.jpg`), fullPage: true, type: 'jpeg', quality: 70 });
}
await b.close();
