import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { applyOverrides, countByKind, type DopProps, type Overrides } from '../../src/dops';

const layer = JSON.parse(readFileSync('data/dops.geojson', 'utf8'));
const overrides: Overrides = JSON.parse(readFileSync('data/dop-overrides.json', 'utf8'));
const fixed = applyOverrides(layer, overrides);
const byName = new Map(fixed.features.map((f) => [(f.properties as unknown as DopProps).name, f.properties as unknown as DopProps]));

describe('DO overrides', () => {
  it('keeps every polygon', () => expect(fixed.features).toHaveLength(layer.features.length));

  it('gives every DOP a study region and one of the four kinds', () => {
    for (const f of fixed.features) {
      const p = f.properties as unknown as DopProps;
      expect(overrides.regions[p.region], p.code).toBeDefined();
      expect(['DOCa', 'DO', 'VP', 'VC']).toContain(p.kind);
    }
  });

  it('shows Priorat and Rioja as the two DOCa', () => {
    expect(byName.get('Priorat')?.kind).toBe('DOCa');
    expect(byName.get('Rioja')?.kind).toBe('DOCa');
    expect(byName.has('Priorato')).toBe(false);
  });

  it('uses official spellings', () => {
    for (const n of ['Rías Baixas', 'Empordà', 'Penedès', 'Jerez-Xérès-Sherry', 'León', 'Navarra']) expect(byName.has(n), n).toBe(true);
  });

  it('has no duplicate names across polygons and missing DOPs', () => {
    const names = [...byName.keys(), ...overrides.missing.map((m) => m.name)];
    expect(new Set(names).size).toBe(names.length);
  });

  it('matches the ministry totals from January 2025 for DOCa, DO and VC (Pagos exceed it: three were added later)', () => {
    const c = countByKind(layer, overrides);
    expect(c.DOCa).toBe(2);
    expect(c.DO).toBe(69);
    expect(c.VC).toBe(7);
    expect(c.VP).toBeGreaterThanOrEqual(26);
  });

  it('refuses an override for a code the layer lacks', () => {
    expect(() => applyOverrides(layer, { ...overrides, byCode: { ...overrides.byCode, DO999: { name: 'x' } } })).toThrow(/unknown code/);
  });
});
