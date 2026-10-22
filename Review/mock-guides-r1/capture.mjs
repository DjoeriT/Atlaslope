// Real data for the mock. Guide rows come from the app's own guideRows() (rows.ts, via vite-node); the built Guides page
// (vite preview on :4173) is read in Playwright to measure it and to cross-check names, kinds, minutes, tour marks and focus.
// Writes data.json next to this file and copies the photos used into mocks/guides-r1/img/{480,800}.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { chromium } from '../mock-guide-redesign-r2/pw.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../..');
const OUT = '/Users/djoeri/Developer/Atlaslope/mocks/guides-r1';
const START = ['rioja', 'priorat', 'ribeira-sacra', 'txakoli-getaria'];

const rows = JSON.parse(execFileSync('npx', ['vite-node', path.join(here, 'rows.ts')], { cwd: ROOT, maxBuffer: 1e8 }).toString());
const all = rows.regions.flatMap((r) => r.guides);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4173/guides/', { waitUntil: 'networkidle' });
const live = await p.evaluate(() => ({
  headline: document.querySelector('h1').textContent,
  sub: document.querySelector('.sub').innerHTML,
  cards: [...document.querySelectorAll('section.region:not(#map-tours) a.gcard-c')].map((a) => {
    const img = a.querySelector('img');
    const m = ((img && img.getAttribute('style')) || '').match(/object-position:\s*([^;]+)/);
    return { id: new URL(a.href).hash.match(/place=([^&]+)/)[1], name: a.querySelector('b').textContent, kindMin: a.querySelector('em').textContent, tour: !!a.querySelector('.tour'), focus: m ? m[1].trim() : '50% 50%', photo: img ? img.getAttribute('src').split('/').pop().replace('.webp', '') : null };
  }),
  tours: [...document.querySelectorAll('#map-tours a.gcard-c')].map((a) => new URL(a.href).hash.match(/place=([^&]+)/)[1]),
  allImgs: document.querySelectorAll('main img').length,
  allCards: document.querySelectorAll('main a.gcard-c').length,
}));
await b.close();

// cross-check the page against the rows
let bad = 0;
for (const c of live.cards) {
  const g = all.find((x) => x.id === c.id);
  const same = g && g.name === c.name && `${g.label} · ${g.minutes}-minute read` === c.kindMin && g.tour === c.tour && g.photo === c.photo && (!g.photo || (rows.crops[g.photo] ?? '50% 50%') === c.focus);
  if (!same) { bad++; console.log('mismatch', c, g); }
}
const tourIds = all.filter((g) => g.tour).map((g) => g.id);
if (live.tours.length !== tourIds.length || live.tours.some((t) => !tourIds.includes(t))) { bad++; console.log('tour list differs'); }
const data = { headline: live.headline, sub: live.sub, regions: rows.regions.map((r) => ({ id: r.id, name: r.name, tile: r.tile, guides: r.guides.map((g) => ({ id: g.id, name: g.name, kind: g.label, minutes: g.minutes, tour: g.tour, photo: g.photo, focus: g.photo ? rows.crops[g.photo] : null })) })), credits: rows.photos, start: START, live: { shownCards: live.cards.length, tourCards: live.tours.length, allCards: live.allCards, imgs: live.allImgs } };
for (const s of START) if (!all.some((g) => g.id === s)) throw new Error('start guide missing: ' + s);
fs.writeFileSync(path.join(here, 'data.json'), JSON.stringify(data, null, 1));
const used = all.filter((g) => g.photo);
for (const w of ['480', '800']) {
  fs.mkdirSync(path.join(OUT, 'img', w), { recursive: true });
  for (const g of used) {
    let src = path.join(ROOT, 'public/photos', w, g.photo + '.webp');
    if (!fs.existsSync(src)) src = path.join(ROOT, 'public/photos/480', g.photo + '.webp'); // a photo narrower than 800 px has no 800 copy (see guideCount.ts)
    fs.copyFileSync(src, path.join(OUT, 'img', w, g.photo + '.webp'));
  }
}
console.log({ regions: data.regions.length, guides: all.length, withPhoto: used.length, tours: tourIds.length, mismatches: bad, live: data.live });
