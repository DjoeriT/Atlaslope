// Real screenshots of the app's own map (local vite preview): Spain overview and one frame per region, UI chrome hidden.
// Run after `npx vite preview --port 4173`. Out: mocks/guides-r1/maps/*.jpg (default) or argv[2].
import fs from 'fs';
import { chromium } from '../mock-guide-redesign-r2/pw.mjs';
const out = process.argv[2] || '/Users/djoeri/Developer/Atlaslope/mocks/guides-r1/maps';
fs.mkdirSync(out, { recursive: true });
const ids = ['green-spain', 'castilla-y-leon', 'rioja', 'ebro', 'cataluna', 'mediterranean', 'meseta', 'andalucia', 'baleares', 'canarias'];
const hide = '.sitebar,.sheet,.gesture-hint,.bottomright,.imagery-note,.legend,.maplibregl-control-container,.first-run{display:none!important}.stage{top:0!important}';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1000, height: 800 } });
async function shot(hash, name) {
  await p.goto('http://localhost:4173/atlas/' + hash, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: hide });
  await p.waitForTimeout(4000);
  await p.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 80 });
  console.log(name, hash);
}
await shot('', 'spain');
for (const id of ids) await shot('#region=' + id, id);
await b.close();
