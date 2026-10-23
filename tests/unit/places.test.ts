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
const groups = new Set<string>(tree.courses.flatMap((c: { groups: { id: string }[] }) => c.groups.map((g) => g.id)));

describe('place tree', () => {
  it('lists all 106 wine DOPs of the ministry list, plus the three Rioja zones', () => {
    expect(places.filter((p) => p.level === 'place' && p.parent === 'spain')).toHaveLength(106);
    expect(places.filter((p) => p.level === 'zone' && p.region === 'rioja').map((p) => p.id)).toEqual(['rioja-alta', 'rioja-alavesa', 'rioja-oriental']);
  });

  it('pools 72 core places (Cava and Catalunya in since 21 Oct 2026) and 6 Vinos de Calidad for the quiz', () => {
    expect(places.filter((p) => p.quiz === 'core')).toHaveLength(72);
    expect(byId.get('urbezo')?.quiz).toBe('core');
    expect(places.filter((p) => p.quiz === 'vc').map((p) => p.id).sort()).toEqual(
      ['cangas', 'cebreros', 'lebrija', 'sierra-de-salamanca', 'valles-de-benavente', 'valtiendas']);
    expect(byId.get('islas-canarias')?.quiz).toBe('none');
    // Over other DOs, so asked without the map question (owner, 21 Oct 2026).
    for (const id of ['cava', 'catalunya']) expect(byId.get(id), id).toMatchObject({ quiz: 'core', quizFindIt: false });
    expect(places.filter((p) => p.kind === 'VP').every((p) => p.quiz === 'none')).toBe(true);
  });

  it('has unique slug ids that are not paths (decision #41)', () => {
    expect(byId.size).toBe(places.length);
    for (const p of places) {
      expect(p.id, p.name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('links every place to a real parent, region and overlap', () => {
    for (const p of places) {
      expect(['spain', 'portugal', 'france', 'italy', 'germany', 'austria'].includes(p.parent) || byId.has(p.parent), p.id).toBe(true);
      expect(groups.has(p.region), p.id).toBe(true);
      for (const o of p.alsoWithin ?? []) expect(byId.has(o), `${p.id} within ${o}`).toBe(true);
    }
  });

  it('gives every quizzed place a boundary; only the 13 Vinos de Pago and the Rheingau (Germany) are still to fetch; the 26 Portugal places (batch 1, owner option B, 22 Oct 2026) are added', () => {
    const toFetch = places.filter((p) => p.boundary === 'to-fetch');
    expect(toFetch).toHaveLength(14);
    expect(toFetch.filter((p) => p.quiz !== 'none')).toEqual([]);
    expect(toFetch.filter((p) => p.parent !== 'germany').every((p) => p.kind === 'VP')).toBe(true); // Rheingau (#149) is the 14th: no outline yet
    expect(places.filter((p) => p.boundary === 'added' && !/^(fr|it|de|at)-/.test(p.region)).map((p) => p.id).sort()).toEqual([
      'alenquer', 'alentejo', 'arruda', 'bairrada', 'beira-interior', 'bucelas', 'campo-de-calatrava', 'carcavelos', 'cebreros', 'colares', 'dao',
      'dotejo', 'douro', 'encostas-daire', 'lafoes', 'lagoa', 'lagos', 'lisboa', 'madeira', 'madeirense', 'obidos', 'palmela', 'portimao', 'porto', 'setubal', 'tavira',
      'tavora-varosa', 'torres-vedras', 'tras-os-montes', 'urbezo', 'vinho-verde',
    ]);
    expect(places.filter((p) => p.boundary === 'mapa-2014').every((p) => p.layerCode)).toBe(true);
  });

  it('numbers the course order 1..106 without gaps', () => {
    const orders = places.filter((p) => p.level === 'place' && p.parent === 'spain').map((p) => p.courseOrder).sort((a, b) => a! - b!);
    expect(orders).toEqual(Array.from({ length: 106 }, (_, i) => i + 1));
  });
});
