// Mock helper: pairwise overlap of the overlay boxes in the *-boxes.json files. node Tools/overlap-mapbar.mjs <imgDir>
import { readFileSync } from 'node:fs';
const dir = process.argv[2];
const NAMES = ['chip', 'keys', 'loc', 'zoomIn', 'zoomOut', 'pitch', 'i', 'credit', 'exag', 'recentre', 'panel'];
const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const out = [];
for (const f of process.argv.slice(3)) {
  const j = JSON.parse(readFileSync(`${dir}/${f}-boxes.json`, 'utf8'));
  for (const [k, o] of Object.entries(j)) {
    const present = NAMES.filter((n) => o[n]);
    const bad = [];
    for (let a = 0; a < present.length; a++) for (let b = a + 1; b < present.length; b++) if (hit(o[present[a]], o[present[b]])) bad.push(`${present[a]}x${present[b]}`);
    const inMap = present.filter((n) => n !== 'credit' && (o[n].x < o.map.x - 1 || o[n].x + o[n].w > o.map.x + o.map.w + 1 || o[n].y + o[n].h > o.map.y + o.map.h + 1)).map((n) => `${n} outside map`);
    const small = (o._taps ?? []).filter(([, w, h]) => Math.min(w, h) < 44).map(([c, w, h]) => `${c}:${w}x${h}`);
    out.push({ file: f, stop: k, present: present.join(','), overlaps: bad.concat(inMap), tapsUnder44: small });
  }
}
console.log(JSON.stringify(out, null, 1));
