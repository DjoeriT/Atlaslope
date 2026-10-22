import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import pageCrops from '../../src/pages/pageCrops.json';
import { tourPageKeys } from '../../src/pages/tourPhotos';
import { loadTree } from '../../src/tree';

// C3 card 2 (22 Oct 2026): every photo a guide page with a map tour draws in a fixed frame has a focus checked by eye (CLAUDE.md "Photos
// hard rule"). The hash ties the check to the file that was seen. Fix with `node Tools/guides/crop_sheet.mjs --page`.
const crops = pageCrops as Record<string, { focus: string; file: string }>;
const tree = loadTree(JSON.parse(readFileSync('data/places.json', 'utf8')));
const shown = tourPageKeys(tree);
const hashOf = (k: string) => createHash('sha256').update(readFileSync(`public/photos/480/${k}.webp`)).digest('hex').slice(0, 12);
const fix = (k: string) => `run node Tools/guides/crop_sheet.mjs --page ${k}, look at the sheet, then --write it (docs/guides.md "Photo crops")`;

describe('checked page crops (src/pages/pageCrops.json)', () => {
  it('lists the photos of the tour pages', () => {
    expect(shown).toEqual(expect.arrayContaining(['rioja-3', 'priorat-weather-1', 'priorat-rules-1']));
  });
  it('has an entry for every photo a tour page shows in a fixed frame', () => {
    const missing = shown.filter((k) => !crops[k]).map((k) => `${k} has no checked page crop: ${fix(k)}`);
    expect(missing, missing.join('\n')).toEqual([]);
  });
  it('matches the current file of each checked photo', () => {
    const stale = shown.filter((k) => crops[k] && existsSync(`public/photos/480/${k}.webp`) && crops[k].file !== hashOf(k)).map((k) => `${k} changed since its crop was checked: ${fix(k)}`);
    expect(stale, stale.join('\n')).toEqual([]);
  });
  it('has no entry for a photo no tour page shows', () => {
    expect(Object.keys(crops).filter((k) => !shown.includes(k))).toEqual([]);
  });
});
