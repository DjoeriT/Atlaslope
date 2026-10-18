import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { sheetFiles, sources } from '../../src/facts';
import { tilesContent } from '../../src/facts/tiles';

const raw = JSON.parse(readFileSync('data/places.json', 'utf8'));
const regionIds: string[] = raw.courses.flatMap((c: { groups: { id: string }[] }) => c.groups.map((g) => g.id));
const sheetIds = sheetFiles.flatMap((f) => f.sheets.map((s) => s.id));
const citeKey = (c: string) => c.split(':')[0];

// Tile copy restates sourced rows only (fact rule), so every line carries cites that exist (owner points 1, 15, 16, 18 Oct 2026).
describe('tile copy', () => {
  it('has a headline for every place with a fact sheet, citing that sheet', () => {
    for (const id of sheetIds) {
      const line = tilesContent.places[id];
      expect(line?.title, id).toBeTruthy();
      expect(line.cite.length, id).toBeGreaterThan(0);
    }
  });
  it('has a headline and lede for every study region', () => {
    for (const id of regionIds) {
      const line = tilesContent.regions[id];
      expect(line?.title && line.lede, id).toBeTruthy();
      for (const from of line.from ?? []) expect(sheetIds, `${id} from ${from}`).toContain(from);
    }
  });
  it('cites only known sources and keeps headlines short', () => {
    const all = [tilesContent.spain, ...Object.values(tilesContent.regions), ...Object.values(tilesContent.places)];
    for (const line of all) {
      for (const c of line.cite) expect(sources, c).toHaveProperty(citeKey(c));
      if (line.title) expect(line.title.length, line.title).toBeLessThanOrEqual(56);
    }
  });
});
