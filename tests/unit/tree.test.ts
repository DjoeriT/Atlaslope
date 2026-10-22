import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadTree, type Tree } from '../../src/tree';

const raw = JSON.parse(readFileSync('data/places.json', 'utf8'));
const fixture = JSON.parse(readFileSync('tests/fixtures/places-two-countries.json', 'utf8'));
const tree: Tree = loadTree(raw);
const ids = (xs: Array<{ id: string }>) => xs.map((x) => x.id);

describe('tree model over data/places.json', () => {
  it('loads every place, Spain, the 26 Portugal places (batch 1, owner option B, 22 Oct 2026) and France\'s pilot (2 places, 19 zones) and Italy\'s (2 places), with a unique slug id', () => {
    expect(tree.places).toHaveLength(160);
    expect(new Set(ids(tree.places)).size).toBe(160);
    for (const p of tree.places) expect(p.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('gives every place a real parent and a level name from its country', () => {
    for (const p of tree.places) {
      expect(['spain', 'portugal', 'france', 'italy'].includes(p.parent) || tree.getPlace(p.parent) !== undefined, p.id).toBe(true);
      expect(['place', 'zone']).toContain(tree.levelName(p));
      expect(tree.levelName(p), p.id).toBe(p.level);
    }
  });

  it('counts 72 core, 6 vc, 79 none and 3 zones, with the 26 Portugal places (batch 1, owner option B, 22 Oct 2026) and France\'s pilot with its 19 Chablis zones and Italy\'s two places (not in Learn yet) among the none', () => {
    const count = (q: string) => tree.places.filter((p) => p.quiz === q).length;
    expect([count('core'), count('vc'), count('none'), count('zone')]).toEqual([72, 6, 79, 3]);
    expect(tree.places.filter((p) => p.level === 'zone')).toHaveLength(3 + 19);
  });

  it('lists the ten study regions of Spain in course order', () => {
    expect(ids(tree.regionsOf('spain'))).toEqual(['green-spain', 'castilla-y-leon', 'rioja', 'ebro', 'cataluna',
      'mediterranean', 'meseta', 'andalucia', 'baleares', 'canarias']);
    expect(ids(tree.children('spain'))).toEqual(ids(tree.regionsOf('spain')));
  });

  // Owner card, 17 Oct 2026 ("Skip it"): a study region that holds only its namesake place is left out of the trail.
  it('breadcrumbs a zone as Spain › Rioja › Rioja Alta, skipping the one-place Rioja region', () => {
    expect(tree.breadcrumb('rioja-alta')).toEqual([
      { level: 'country', id: 'spain', name: 'Spain' },
      { level: 'place', id: 'rioja', name: 'Rioja' },
      { level: 'zone', id: 'rioja-alta', name: 'Rioja Alta' },
    ]);
    expect(tree.breadcrumb('spain')).toEqual([{ level: 'country', id: 'spain', name: 'Spain' }]);
    expect(tree.breadcrumb('rioja', 'region')).toHaveLength(2);
    expect(tree.breadcrumb('toro')).toHaveLength(3); // other regions keep their step
  });

  it('names the regions that hold only their namesake', () => {
    expect(tree.soleSameName('rioja')?.id).toBe('rioja');
    expect(tree.regionsOf('spain').filter((r) => tree.soleSameName(r.id)).map((r) => r.id)).toEqual(['rioja']);
  });

  it('lists the places of a region in course order, then north to south', () => {
    const inRegion = tree.placesInRegion('castilla-y-leon');
    expect(inRegion.length).toBeGreaterThan(5);
    expect(inRegion.every((p) => p.region === 'castilla-y-leon' && p.level === 'place')).toBe(true);
    const orders = inRegion.map((p) => p.courseOrder!);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(ids(tree.children('castilla-y-leon', 'region'))).toEqual(ids(inRegion));
  });

  it('keeps a region and a place that share an id apart', () => {
    expect(ids(tree.children('rioja'))).toEqual(['rioja-alta', 'rioja-alavesa', 'rioja-oriental']);
    expect(ids(tree.children('rioja', 'region'))).toEqual(['rioja']);
    expect(tree.getRegion('rioja')?.name).toBe('Rioja');
    expect(tree.getPlace('rioja')?.kind).toBe('DOCa');
  });

  it('resolves alsoWithin to places', () => {
    expect(ids(tree.alsoWithin('manzanilla'))).toEqual(['jerez']);
    expect(tree.alsoWithin('toro')).toEqual([]);
  });

  it('returns nothing for an unknown id', () => {
    expect(tree.getPlace('nowhere')).toBeUndefined();
    expect(tree.children('nowhere')).toEqual([]);
    expect(tree.breadcrumb('nowhere')).toEqual([]);
  });
});

describe('search', () => {
  it('finds a place by name', () => {
    expect(tree.search('toro')[0]).toMatchObject({ level: 'place', id: 'toro', name: 'Toro' });
  });

  it('finds a zone', () => {
    expect(tree.search('Rioja Alta')[0]).toMatchObject({ level: 'zone', id: 'rioja-alta' });
  });

  it('folds accents and case', () => {
    const hits = ids(tree.search('castilla'));
    expect(hits[0]).toBe('castilla-y-leon');
    expect(hits).toContain('meseta');
    expect(tree.search('CASTILLA Y LEON')[0]).toMatchObject({ level: 'region', id: 'castilla-y-leon' });
    expect(tree.search('xeres')[0]).toMatchObject({ id: 'jerez' });
  });

  // Owner, 18 Oct 2026 ("What's with the commas"): the Meseta chapter shows as "Meseta"; its full chapter name still finds it.
  it('shows a long course chapter by its short name and still finds it by the full one', () => {
    expect(tree.getRegion('meseta')).toMatchObject({ name: 'Meseta', chapter: 'Meseta: Castilla-La Mancha, Madrid, Extremadura' });
    expect(tree.search('extremadura')[0]).toMatchObject({ level: 'region', id: 'meseta', name: 'Meseta' });
  });

  it('finds a one-place region as its place, and other regions as regions', () => {
    expect(tree.search('rioja')[0]).toEqual({ level: 'place', id: 'rioja', name: 'Rioja' });
    expect(tree.search('rioja').some((c) => c.level === 'region')).toBe(false);
    expect(tree.search('green spain')[0]).toMatchObject({ level: 'region', id: 'green-spain' });
  });

  it('respects the limit and ignores an empty query', () => {
    expect(tree.search('a', 3)).toHaveLength(3);
    expect(tree.search('   ')).toEqual([]);
  });
});

describe('a second country joins with data only', () => {
  const two = loadTree(fixture);

  it('loads the fixture with its own level names', () => {
    expect(ids(two.regionsOf('portugal'))).toEqual(['douro']);
    expect(ids(two.placesInRegion('douro'))).toEqual(['douro']);
    expect(two.levelName(two.getPlace('cima-corgo')!)).toBe('subregion');
    expect(two.breadcrumb('cima-corgo').map((c) => c.level)).toEqual(['country', 'region', 'appellation', 'subregion']);
    expect(ids(two.search('corgo'))).toEqual(['cima-corgo']);
    expect(ids(two.regionsOf('spain'))).toEqual(['castilla-y-leon']);
  });
});

describe('invalid data', () => {
  const broken = (edit: (data: typeof fixture) => void) => {
    const data = structuredClone(fixture);
    edit(data);
    return () => loadTree(data);
  };

  it('throws with a message naming the place', () => {
    expect(broken((d) => d.places.push({ ...d.places[0] }))).toThrow(/toro.*duplicate/);
    expect(broken((d) => { d.places[0].id = 'Toro/DO'; })).toThrow(/Toro\/DO.*slug/);
    expect(broken((d) => { d.places[0].parent = 'atlantis'; })).toThrow(/toro.*parent atlantis/);
    expect(broken((d) => { d.places[0].region = 'douro'; })).toThrow(/toro.*region douro/);
    expect(broken((d) => { d.places[0].level = 'zone'; })).toThrow(/toro.*level zone/);
    expect(broken((d) => { d.places[0].alsoWithin = ['nowhere']; })).toThrow(/toro.*alsoWithin nowhere/);
    expect(broken((d) => { d.places[0].name = ''; })).toThrow(/toro.*name/);
    expect(broken((d) => { d.places[1].parent = 'cima-corgo'; })).toThrow(/douro.*(cycle|level)/);
  });

  it('throws on a file that is not a tree', () => {
    expect(() => loadTree(null)).toThrow(/places/);
    expect(broken((d) => { d.courses[0].country = 'france'; })).toThrow(/sws.*france/);
  });
});

describe('France pilot in the tree (decisions #52-#55)', () => {
  it('has the WSET course with a group per batch that has a shipped place, and only the shipped places', () => {
    expect(ids(tree.regionsOf('france'))).toEqual(['fr-bordeaux', 'fr-burgundy']);
    expect(tree.regionsOf('france').every((r) => r.course === 'wset-fr')).toBe(true);
    expect(ids(tree.placesInRegion('fr-burgundy'))).toEqual(['chablis']);
    expect(ids(tree.placesInRegion('fr-bordeaux'))).toEqual(['pauillac']);
  });
  it('puts the climats as zones inside Chablis Premier Cru and Grand Cru, with the full breadcrumb', () => {
    expect(ids(tree.children('chablis', 'place'))).toEqual(['chablis-premier-cru', 'chablis-grand-cru']);
    expect(ids(tree.children('chablis-grand-cru', 'place'))).toEqual(['blanchot', 'bougros', 'grenouilles', 'les-clos', 'preuses', 'valmur', 'vaudesir']);
    expect(tree.children('chablis-premier-cru', 'place')).toHaveLength(10);
    const clos = tree.getPlace('les-clos')!;
    expect(tree.levelName(clos)).toBe('zone');
    expect(tree.breadcrumb('les-clos', 'place').map((c) => c.name)).toEqual(['France', 'Burgundy', 'Chablis', 'Chablis Grand Cru', 'Les Clos']);
  });
  it('leaves Pauillac\'s wider AOCs out until they are in the tree', () => {
    expect(tree.alsoWithin('pauillac')).toEqual([]);
  });
});

describe('Italy pilot in the tree (decisions #59-#66)', () => {
  it('has the WSET course with a group per region that has a shipped place, and only the shipped places', () => {
    expect(ids(tree.regionsOf('italy'))).toEqual(['it-piemonte', 'it-tuscany']);
    expect(tree.regionsOf('italy').every((r) => r.course === 'wset-it')).toBe(true);
    expect(ids(tree.placesInRegion('it-piemonte'))).toEqual(['barolo']);
    expect(ids(tree.placesInRegion('it-tuscany'))).toEqual(['chianti-classico']);
  });
  it('has no zones yet, and the breadcrumb runs country, region, place', () => {
    expect(tree.children('barolo', 'place')).toEqual([]);
    expect(tree.children('chianti-classico', 'place')).toEqual([]);
    expect(tree.breadcrumb('chianti-classico', 'place').map((c) => c.name)).toEqual(['Italy', 'Tuscany', 'Chianti Classico']);
  });
});
