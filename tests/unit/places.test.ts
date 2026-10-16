import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// data/places.json is built by Tools/data/build_places.py from the ministry's list of 2 July 2026. These tests pin what the tree promises.
interface Place {
  id: string; name: string; kind: string; level: 'place' | 'zone'; parent: string; region: string;
  euFile?: string; layerCode: string | null; boundary: string; quiz: 'core' | 'vc' | 'zone' | 'none';
  alsoWithin?: string[]; courseOrder?: number; northSouth?: number;
}
const tree = JSON.parse(readFileSync('data/places.json', 'utf8'));
const places: Place[] = tree.places;
const byId = new Map(places.map((p) => [p.id, p]));
const groups = new Set<string>(tree.courses[0].groups.map((g: { id: string }) => g.id));

describe('place tree', () => {
  it('lists all 106 wine DOPs of the ministry list, plus the three Rioja zones', () => {
    expect(places.filter((p) => p.level === 'place')).toHaveLength(106);
    expect(places.filter((p) => p.level === 'zone').map((p) => p.id)).toEqual(['rioja-alta', 'rioja-alavesa', 'rioja-oriental']);
  });

  it('pools 69 core places and 6 Vinos de Calidad for the quiz', () => {
    expect(places.filter((p) => p.quiz === 'core')).toHaveLength(69);
    expect(places.filter((p) => p.quiz === 'vc').map((p) => p.id).sort()).toEqual(
      ['cangas', 'cebreros', 'lebrija', 'sierra-de-salamanca', 'valles-de-benavente', 'valtiendas']);
    for (const id of ['cava', 'catalunya', 'islas-canarias', 'urbezo']) expect(byId.get(id)?.quiz, id).toBe('none');
    expect(places.filter((p) => p.kind === 'VP').every((p) => p.quiz === 'none')).toBe(true);
  });

  it('has unique, short, stable-looking ids that never contain the parent', () => {
    expect(byId.size).toBe(places.length);
    for (const p of places) {
      expect(p.id, p.name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      if (p.parent !== 'spain') expect(p.id.startsWith(p.parent + '/'), p.id).toBe(false);
    }
  });

  it('links every place to a real parent, region and overlap', () => {
    for (const p of places) {
      expect(p.parent === 'spain' || byId.has(p.parent), p.id).toBe(true);
      expect(groups.has(p.region), p.id).toBe(true);
      for (const o of p.alsoWithin ?? []) expect(byId.has(o), `${p.id} within ${o}`).toBe(true);
    }
  });

  it('gives every quizzed place a boundary; only 14 single estates (13 Pagos and Urbezo) are still to fetch', () => {
    const toFetch = places.filter((p) => p.boundary === 'to-fetch');
    expect(toFetch).toHaveLength(14);
    expect(toFetch.filter((p) => p.quiz !== 'none')).toEqual([]);
    expect(toFetch.filter((p) => p.kind !== 'VP').map((p) => p.id)).toEqual(['urbezo']);
    expect(places.filter((p) => p.boundary === 'added').map((p) => p.id).sort()).toEqual(['campo-de-calatrava', 'cebreros']);
    expect(places.filter((p) => p.boundary === 'mapa-2014').every((p) => p.layerCode)).toBe(true);
  });

  it('numbers the course order 1..106 without gaps', () => {
    const orders = places.filter((p) => p.level === 'place').map((p) => p.courseOrder).sort((a, b) => a! - b!);
    expect(orders).toEqual(Array.from({ length: 106 }, (_, i) => i + 1));
  });
});
