import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { sources } from '../../src/facts';
import { flagSets, flagsFor } from '../../src/map/flags';
import type { Place } from '../../src/tree';

const real: Array<Place & { centroid?: [number, number] }> = JSON.parse(readFileSync('data/places.json', 'utf8')).places;
const byId = new Map(real.map((p) => [p.id, p]));

/** Rough distance in km, enough to catch a swapped longitude and latitude or a point in the wrong region. */
const km = (a: [number, number], b: [number, number]) => {
  const dx = (a[0] - b[0]) * 111 * Math.cos((a[1] * Math.PI) / 180), dy = (a[1] - b[1]) * 111;
  return Math.hypot(dx, dy);
};

describe('the key-place flags (content/flags.json)', () => {
  it('cover Rioja with its zones, and Jerez', () => {
    expect(flagsFor('rioja').map((f) => f.name)).toEqual(['Haro', 'Sierra de Cantabria', 'Ebro', 'Alfaro']);
    expect(flagsFor('rioja-alavesa')).toBe(flagsFor('rioja'));
    expect(flagsFor('jerez')).toHaveLength(5);
    expect(flagsFor('toro')).toEqual([]);
    expect(flagsFor(null)).toEqual([]);
  });

  it('give each region 3 to 5 flags with unique ids, and name places that are in the tree, once each', () => {
    const seen = new Set<string>();
    for (const set of flagSets) {
      expect(set.flags.length, set.places.join()).toBeGreaterThanOrEqual(3);
      expect(set.flags.length, set.places.join()).toBeLessThanOrEqual(5);
      expect(new Set(set.flags.map((f) => f.id)).size).toBe(set.flags.length);
      for (const id of set.places) {
        expect(byId.has(id), id).toBe(true);
        expect(seen.has(id), id).toBe(false);
        seen.add(id);
      }
    }
  });

  it('back every line with an official source that content/sources.json knows', () => {
    for (const f of flagSets.flatMap((s) => s.flags)) {
      expect(f.lines.length, f.id).toBeGreaterThan(0);
      for (const line of f.lines) expect(line, f.id).toMatch(/^[^.]+\.$/); // one sentence, one idea
      expect(f.cite.length, f.id).toBeGreaterThan(0);
      for (const c of f.cite) {
        const m = /^([a-z0-9-]+)(?::p\d+)?$/.exec(c);
        expect(m, `${f.id}: ${c}`).not.toBeNull();
        expect(sources[m![1]]?.kind, `${f.id}: ${c}`).toBe('official');
      }
    }
  });

  it('sit within 80 km of their region', () => {
    for (const set of flagSets) {
      const centre = byId.get(set.places[0])?.centroid;
      expect(centre, set.places[0]).toBeTruthy();
      for (const f of set.flags) expect(km(f.at, centre!), f.id).toBeLessThan(80);
    }
  });
});
