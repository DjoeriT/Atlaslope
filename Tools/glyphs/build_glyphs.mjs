// Builds the map's label lettering: signed-distance glyph files (MapLibre's PBF format) for our own fonts, so town and river
// names on the map are set in IBM Plex Sans and Newsreader like the rest of the app. Run once after a font change:
//   node Tools/glyphs/build_glyphs.mjs
// Input: the WOFF2 files in public/fonts/ (latin subsets). Output: public/glyphs/<font stack>/<range>.pbf.
// Glyphs are drawn by Chromium with @mapbox/tiny-sdf at MapLibre's server glyph settings (24 px, buffer 3, radius 8).
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const fontsDir = join(root, 'public/fonts');
const outDir = join(root, 'public/glyphs');

// Stack name (what the map style asks for) → font file, family, weight and style.
export const STACKS = {
  'Plex Sans Regular': { file: 'ibm-plex-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
  'Plex Sans Medium': { file: 'ibm-plex-sans-latin-500-normal.woff2', weight: '500', style: 'normal' },
  'Newsreader Italic': { file: 'newsreader-latin-400-italic.woff2', weight: '400', style: 'italic' },
  'Newsreader Medium': { file: 'newsreader-latin-500-normal.woff2', weight: '500', style: 'normal' },
};
// Latin and Latin-1 (Spanish, Catalan, Basque, Galician), Latin Extended-A, general punctuation.
const RANGES = [0, 256, 8192];

// --- Protocol buffers, just enough for glyphs.proto ---
const varint = (n) => { const b = []; while (n > 127) { b.push((n & 127) | 128); n >>>= 7; } b.push(n); return b; };
const zigzag = (n) => (n << 1) ^ (n >> 31);
const key = (field, type) => varint((field << 3) | type);
const bytesField = (field, data) => [...key(field, 2), ...varint(data.length), ...data];
const uintField = (field, n) => [...key(field, 0), ...varint(n >>> 0)];
const sintField = (field, n) => [...key(field, 0), ...varint(zigzag(n) >>> 0)];
const text = (s) => [...Buffer.from(s, 'utf8')];

function encodeGlyph(g) {
  return [
    ...uintField(1, g.id),
    ...(g.bitmap.length ? bytesField(2, g.bitmap) : []),
    ...uintField(3, g.width), ...uintField(4, g.height),
    ...sintField(5, g.left), ...sintField(6, g.top), ...uintField(7, g.advance),
  ];
}
export function encodeRange(stack, start, glyphs) {
  const fontstack = [...bytesField(1, text(stack)), ...bytesField(2, text(`${start}-${start + 255}`)), ...glyphs.flatMap((g) => bytesField(3, encodeGlyph(g)))];
  return Uint8Array.from(bytesField(1, fontstack));
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<html><body></body></html>');
const tinySdf = readFileSync(join(root, 'node_modules/@mapbox/tiny-sdf/index.js'), 'utf8').replace('export default class TinySDF', 'window.TinySDF = class TinySDF');
await page.addScriptTag({ content: tinySdf });

let files = 0;
for (const [stack, f] of Object.entries(STACKS)) {
  const font = readFileSync(join(fontsDir, f.file)).toString('base64');
  const ranges = await page.evaluate(async ({ stack, font, f, ranges }) => {
    const family = `G-${stack}`;
    const face = new FontFace(family, `url(data:font/woff2;base64,${font})`, { weight: f.weight, style: f.style });
    document.fonts.add(await face.load());
    const sdf = new window.TinySDF({ fontSize: 24, buffer: 3, radius: 8, cutoff: 0.25, fontFamily: `"${family}"`, fontWeight: f.weight, fontStyle: f.style });
    // A code point counts as in the font when it draws differently from a code point the font surely lacks.
    const probe = new OffscreenCanvas(64, 64).getContext('2d');
    probe.font = `${f.style} ${f.weight} 24px "${family}", monospace`;
    const fallback = new OffscreenCanvas(64, 64).getContext('2d');
    fallback.font = '24px monospace';
    const inFont = (ch) => probe.measureText(ch).width !== fallback.measureText(ch).width || ch === ' ';
    return ranges.map((start) => {
      const glyphs = [];
      for (let id = start; id < start + 256; id++) {
        if (id < 32 || (id >= 127 && id < 160)) continue;
        const ch = String.fromCodePoint(id);
        if (!inFont(ch)) continue;
        const g = sdf.draw(ch);
        glyphs.push({
          id,
          bitmap: g.glyphWidth && g.glyphHeight ? Array.from(g.data) : [],
          width: g.glyphWidth, height: g.glyphHeight,
          left: Math.round(g.glyphLeft), top: Math.round(g.glyphTop - 26), advance: Math.round(g.glyphAdvance),
        });
      }
      return { start, glyphs };
    });
  }, { stack, font, f, ranges: RANGES });
  mkdirSync(join(outDir, stack), { recursive: true });
  for (const { start, glyphs } of ranges) {
    writeFileSync(join(outDir, stack, `${start}-${start + 255}.pbf`), encodeRange(stack, start, glyphs));
    files++;
    console.log(`${stack} ${start}-${start + 255}: ${glyphs.length} glyphs`);
  }
}
await browser.close();
console.log(`${files} files in public/glyphs/`);
