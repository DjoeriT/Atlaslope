// Contact sheet for the Guides page's square photo crops (owner 19 Oct 2026: every shown crop is checked by eye, structurally).
// A unit test (tests/unit/home.test.ts) fails while a shown photo has no entry in src/home/photoCrops.json or its file changed since.
//
//   node Tools/guides/crop_sheet.mjs [key...]      sheet for the keys, or for every shown key that is missing or stale
//   node Tools/guides/crop_sheet.mjs --write [key...] [--focus "<key>=<x>% <y>%"]...
//                                                  after looking at the sheet: record the keys with their fresh file hash
//                                                  (focus as given, else the one already in the file, else centre 50% 50%)
//
// --page does the same for the photos a guide page with a map tour draws in a fixed frame (map card and stops 3:2, zone cards 4:3):
// entries in src/pages/pageCrops.json, the sheet shows the 3:2 and 4:3 frames (owner/C3 card 2, 22 Oct 2026).
//
// Output: shots/crops/index.html and shots/crops/sheet.jpg (git-ignored). Look at the JPEG: the box on the original is what the card
// shows. Never cut a face, glass or bottle; trim only bystanders (CLAUDE.md, Photos hard rule).
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';

const PAGE = process.argv.includes('--page');
const CROPS = PAGE ? 'src/pages/pageCrops.json' : 'src/home/photoCrops.json';
const hashOf = (key) => createHash('sha256').update(readFileSync(`public/photos/480/${key}.webp`)).digest('hex').slice(0, 12);

const keys = [];
const focusArg = {};
let write = false;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--write') write = true;
  else if (args[i] === '--page') continue;
  else if (args[i] === '--focus') {
    const m = /^(.+?)=(\d+% \d+%)$/.exec(args[++i] ?? '');
    if (!m) throw new Error('--focus wants "<key>=<x>% <y>%", e.g. "arinzano-1=90% 50%"');
    focusArg[m[1]] = m[2];
  } else keys.push(args[i]);
}

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
let shown;
if (PAGE) {
  const { tourPageKeys } = await server.ssrLoadModule('/src/pages/tourPhotos.ts');
  const { loadTree } = await server.ssrLoadModule('/src/tree/index.ts');
  shown = tourPageKeys(loadTree(JSON.parse(readFileSync('data/places.json', 'utf8'))));
} else {
  const { guideRows, squarePhotoKeys } = await server.ssrLoadModule('/src/home/guideCount.ts');
  shown = squarePhotoKeys(guideRows());
}
await server.close();

const crops = JSON.parse(readFileSync(CROPS, 'utf8'));
const todo = keys.length ? keys : shown.filter((k) => crops[k]?.file !== hashOf(k));
for (const k of todo) if (!shown.includes(k)) console.warn(`note: ${k} is not shown in a checked frame`);
if (!todo.length) { console.log('Every shown photo has a checked crop.'); process.exit(0); }

const focusOf = (k) => focusArg[k] ?? crops[k]?.focus ?? '50% 50%';
const figs = todo.map((k) => {
  const abs = resolve(`public/photos/480/${k}.webp`);
  return `<figure data-focus="${focusOf(k)}"><figcaption>${k} · ${focusOf(k)}</figcaption><div class="orig"><img src="file://${abs}"><i></i></div>${PAGE ? `<div class="fr"><img class="a" src="file://${abs}" style="object-position:${focusOf(k)}"><img class="b" src="file://${abs}" style="object-position:${focusOf(k)}"></div>` : `<div class="sq"><img src="file://${abs}" style="object-position:${focusOf(k)}"></div>`}</figure>`;
}).join('');
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:12px;font:13px system-ui;background:#fff;display:flex;flex-wrap:wrap;gap:18px}
figure{margin:0;width:${PAGE ? 520 : 400}px}.fr{display:block;margin-top:4px}.fr img{object-fit:cover;margin-right:6px}.fr .a{width:240px;aspect-ratio:3/2}.fr .b{width:180px;aspect-ratio:4/3}figcaption{font-weight:600;margin-bottom:4px}
.orig{position:relative;display:inline-block;vertical-align:top}.orig img{display:block;max-width:300px;max-height:260px}
.orig i{position:absolute;border:3px solid #e33;box-sizing:border-box}
.sq{display:inline-block;width:90px;height:90px;margin-left:6px;vertical-align:top}.sq img{width:90px;height:90px;object-fit:cover}
</style>${figs}<script>
addEventListener('load',()=>document.querySelectorAll('figure').forEach(f=>{
  const im=f.querySelector('.orig img'),b=f.querySelector('i'),[x,y]=f.dataset.focus.split(' ').map(parseFloat);
  const w=im.clientWidth,h=im.clientHeight,r=${PAGE ? '1.5' : '1'};
  let bw=Math.min(w,h*r),bh=bw/r;
  Object.assign(b.style,{width:bw+'px',height:bh+'px',left:(w-bw)*x/100+'px',top:(h-bh)*y/100+'px'});
}));</script>`;
mkdirSync('shots/crops', { recursive: true });
writeFileSync('shots/crops/index.html', html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 800 } });
await page.goto(`file://${resolve('shots/crops/index.html')}`);
await page.waitForLoadState('load');
await page.screenshot({ path: 'shots/crops/sheet.jpg', fullPage: true, type: 'jpeg', quality: 80 });
await browser.close();
console.log(`Sheet for ${todo.length} photo(s): shots/crops/sheet.jpg`);

if (write) {
  for (const k of todo) crops[k] = { focus: focusOf(k), file: hashOf(k) };
  const sorted = Object.keys(crops).sort();
  writeFileSync(CROPS, `{\n${sorted.map((k) => ` ${JSON.stringify(k)}: ${JSON.stringify(crops[k])}`).join(',\n')}\n}\n`);
  console.log(`Wrote ${todo.length} entr${todo.length === 1 ? 'y' : 'ies'} to ${CROPS}.`);
}
