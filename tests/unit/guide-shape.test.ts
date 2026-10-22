import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BEATS, EXTRAS, loadAllGuides, measuresOf, photosOf, sheetOf, sources } from '../../src/facts';
import type { Measures, Sheet } from '../../src/facts/types';
import { guideFlyWarnings } from '../../src/facts/check';
import { alikePlaces } from '../../src/pages/helpers';
import { loadTree } from '../../src/tree';

const guides = await loadAllGuides(); // guides load on demand in the app (decision #38)

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
      expect(a.why).toMatch(/^Tempranillo\b/);
    }
    // #126: no two cards carry the same line.
    expect(new Set(alike.map((a) => a.why)).size).toBe(alike.length);
    const alta = alikePlaces(tree, tree.getPlace('rioja-alta')!, sheetOf, measuresOf);
    expect(alta.map((a) => a.place.id)).not.toContain('rioja');
  });

  // Stub sheets and measures, so each reason is tested on its own (ReviewBot on PR 166).
  const stub = (sheets: Record<string, string>, measures: Record<string, [number, string]>) => [
    (id: string) => (sheets[id] ? ({ grapes: { main: [{ grape: sheets[id] }] } } as unknown as Sheet) : undefined),
    (id: string) => (measures[id] ? ({ altitude: { median: measures[id][0] }, koppen: [{ code: measures[id][1], name: '', share: 1 }] } as unknown as Measures) : undefined),
  ] as const;
  const whys = (sheets: Record<string, string>, measures: Record<string, [number, string]>) =>
    alikePlaces(tree, tree.getPlace('rioja')!, ...stub(sheets, measures)).map((a) => a.why);

  it('says how much higher or lower, from 150 m, rounding the same both ways', () => {
    const tempranillo = { rioja: 'Tempranillo', valtiendas: 'Tempranillo' };
    expect(whys(tempranillo, { rioja: [500, 'Csb'], valtiendas: [900, 'Csb'] })).toEqual(['Tempranillo, about 400 m higher']);
    expect(whys(tempranillo, { rioja: [500, 'Csb'], valtiendas: [375, 'Csb'] })).toEqual(['Tempranillo, about 150 m lower']);
    expect(whys(tempranillo, { rioja: [500, 'Csb'], valtiendas: [625, 'Csb'] })).toEqual(['Tempranillo, about 150 m higher']);
    expect(whys(tempranillo, { rioja: [500, 'Csb'], valtiendas: [600, 'Csb'] })).toEqual(['Tempranillo in Castilla y León']);
  });

  it('names a different climate, and leads with the shared climate when no grape is shared', () => {
    expect(whys({ rioja: 'Tempranillo', valtiendas: 'Tempranillo' }, { rioja: [500, 'Csb'], valtiendas: [500, 'Cfa'] }))
      .toEqual(['Tempranillo with hot summers and rain all year']);
    expect(whys({ rioja: 'Tempranillo', valtiendas: 'Garnacha' }, { rioja: [500, 'Csb'], valtiendas: [500, 'Csb'] }))
      .toEqual(['Warm, dry summers in Castilla y León']);
  });

  it('leaves out a card that could only repeat an earlier line', () => {
    const sheets = { rioja: 'Tempranillo', valtiendas: 'Tempranillo', toro: 'Tempranillo', cigales: 'Tempranillo' };
    const measures: Record<string, [number, string]> = { rioja: [500, 'Csb'], valtiendas: [500, 'Csb'], toro: [500, 'Csb'], cigales: [500, 'Csb'] };
    expect([...whys(sheets, measures)].sort()).toEqual(['Tempranillo here too', 'Tempranillo in Castilla y León']);
  });

  it('prefers one place per study region', () => {
    const alike = alikePlaces(tree, tree.getPlace('toro')!, sheetOf, measuresOf);
    const regions = alike.map((a) => a.place.region);
    expect(new Set(regions).size).toBe(regions.length);
  });
});

describe('guide fly targets', () => {
  it('warn, without failing, when a guide flies only to its own place (owner, 19 Oct 2026)', () => {
    for (const w of guideFlyWarnings(guides)) console.warn(`guide warning: ${w}`);
    expect(guideFlyWarnings([{ id: 'x', title: '', minutes: 1, lede: { text: '', cite: [] }, chapters: [{ id: 'a', title: '', paras: [], cite: [], fly: [{ label: 'X', caption: '', cite: [], place: 'x' }] }] }])).toHaveLength(1);
    expect(guideFlyWarnings(guides.filter((g) => g.id === 'rioja'))).toEqual([]);
  });
});

describe('checked card trims (src/pages/cardCrops.json)', () => {
  // #126: a trim off the top of a card photo was looked at on this exact file; a changed photo needs a fresh look.
  const crops = JSON.parse(readFileSync('src/pages/cardCrops.json', 'utf8')) as Record<string, { trimTop: number; file: string }>;
  it('trims a shown file by at most a third and matches the file that was checked', () => {
    for (const [k, { trimTop, file }] of Object.entries(crops)) {
      expect(photosOf(k.replace(/-\d+$/, ''))[0]?.src, `${k} is not the card photo of its place: delete the entry`).toMatch(new RegExp(`/${k}\\.webp$`));
      expect(trimTop, k).toBeGreaterThan(0);
      expect(trimTop, k).toBeLessThanOrEqual(33);
      expect(createHash('sha256').update(readFileSync(`public/photos/480/${k}.webp`)).digest('hex').slice(0, 12), `${k}: look at the trim again, then update its file hash`).toBe(file);
    }
  });
});
