import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BEATS, EXTRAS, guides, measuresOf, sheetOf, sources } from '../../src/facts';
import { alikePlaces } from '../../src/pages/helpers';
import { loadTree } from '../../src/tree';

// Guide shape C (owner, 19 Oct 2026): chapters name their beat, and the optional fields beyond the beats are well formed when filled.
const tree = loadTree(JSON.parse(readFileSync('data/places.json', 'utf8')));
const citeOk = (c: string) => /^([a-z0-9-]+)(:p\d+)?$/.exec(c)?.[1] ?? '';

describe('guide shape C', () => {
  it('gives each Rioja chapter a known beat, at most one chapter per beat', () => {
    for (const g of guides) {
      for (const c of g.chapters) if (c.beat !== undefined) expect(BEATS, `${g.id}/${c.id}`).toContain(c.beat);
      const tagged = g.chapters.filter((c) => c.beat).map((c) => c.beat);
      expect(new Set(tagged).size, g.id).toBe(tagged.length);
    }
    expect(guides.find((g) => g.id === 'rioja')!.chapters.map((c) => c.beat)).toEqual(['place', 'weather', 'ground', 'rules']);
  });

  it('cites known sources in every filled label, extra and pronunciation field', () => {
    for (const g of guides) {
      if (g.say !== undefined) expect(g.say.trim().length, g.id).toBeGreaterThan(0);
      if (g.label) {
        expect(g.label.terms.length, g.id).toBeGreaterThan(0);
        for (const c of g.label.cite) expect(citeOk(c) in sources, `${g.id}: ${c}`).toBe(true);
      }
      for (const [k, x] of Object.entries(g.more ?? {})) {
        expect(EXTRAS, `${g.id}: ${k}`).toContain(k);
        expect(x.paras.length, `${g.id}: ${k}`).toBeGreaterThan(0);
        for (const c of [...x.cite, ...(x.when?.cite ?? [])]) expect(citeOk(c) in sources, `${g.id}: ${k} ${c}`).toBe(true);
      }
    }
  });
});

describe('If you like this, try', () => {
  it('suggests up to three other quizzed places, never its own zones or its parent, each with a reason', () => {
    const rioja = tree.getPlace('rioja')!;
    const alike = alikePlaces(tree, rioja, sheetOf, measuresOf);
    expect(alike.length).toBeGreaterThan(0);
    expect(alike.length).toBeLessThanOrEqual(3);
    for (const a of alike) {
      expect(a.place.id).not.toBe('rioja');
      expect(a.place.parent).not.toBe('rioja');
      expect(a.place.quiz).not.toBe('none');
      expect(a.why).toMatch(/ here too$/);
    }
    const alta = alikePlaces(tree, tree.getPlace('rioja-alta')!, sheetOf, measuresOf);
    expect(alta.map((a) => a.place.id)).not.toContain('rioja');
  });

  it('prefers one place per study region', () => {
    const alike = alikePlaces(tree, tree.getPlace('toro')!, sheetOf, measuresOf);
    const regions = alike.map((a) => a.place.region);
    expect(new Set(regions).size).toBe(regions.length);
  });
});
