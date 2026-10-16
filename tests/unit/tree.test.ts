import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadTree, type Tree } from '../../src/tree';

const raw = JSON.parse(readFileSync('data/places.json', 'utf8'));
const fixture = JSON.parse(readFileSync('tests/fixtures/places-two-countries.json', 'utf8'));
const tree: Tree = loadTree(raw);
const ids = (xs: Array<{ id: string }>) => xs.map((x) => x.id);

describe('tree model over data/places.json', () => {
  it('loads every place with a unique slug id', () => {
    expect(tree.places).toHaveLength(109);
    expect(new Set(ids(tree.places)).size).toBe(109);
    for (const p of tree.places) expect(p.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('gives every place a real parent and a level name from its country', () => {
    for (const p of tree.places) {
      expect(p.parent === 'spain' || tree.getPlace(p.parent) !== undefined, p.id).toBe(true);
      expect(['place', 'zone']).toContain(tree.levelName(p));
      expect(tree.levelName(p), p.id).toBe(p.level);
    }
  });

  it('counts 70 core, 6 vc, 30 none and 3 zones', () => {
    const count = (q: string) => tree.places.filter((p) => p.quiz === q).length;
    expect([count('core'), count('vc'), count('none'), count('zone')]).toEqual([70, 6, 30, 3]);
    expect(tree.places.filter((p) => p.level === 'zone')).toHaveLength(3);
  });

  it('lists the ten study regions of Spain in course order', () => {
    expect(ids(tree.regionsOf('spain'))).toEqual(['green-spain', 'castilla-y-leon', 'rioja', 'ebro', 'cataluna',
      'mediterranean', 'meseta', 'andalucia', 'baleares', 'canarias']);
    expect(ids(tree.children('spain'))).toEqual(ids(tree.regionsOf('spain')));
  });

  it('breadcrumbs a zone as Spain › Rioja region › Rioja › Rioja Alta', () => {
    expect(tree.breadcrumb('rioja-alta')).toEqual([
      { level: 'country', id: 'spain', name: 'Spain' },
      { level: 'region', id: 'rioja', name: 'Rioja' },
      { level: 'place', id: 'rioja', name: 'Rioja' },
      { level: 'zone', id: 'rioja-alta', name: 'Rioja Alta' },
    ]);
    expect(tree.breadcrumb('spain')).toEqual([{ level: 'country', id: 'spain', name: 'Spain' }]);
    expect(tree.breadcrumb('rioja', 'region')).toHaveLength(2);
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

  it('puts regions before places on an equal match', () => {
    expect(tree.search('rioja').slice(0, 2)).toEqual([
      { level: 'region', id: 'rioja', name: 'Rioja' },
      { level: 'place', id: 'rioja', name: 'Rioja' },
    ]);
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
