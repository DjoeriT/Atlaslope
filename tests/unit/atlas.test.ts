import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { applyOverrides, type DopProps, type Overrides } from '../../src/dops';
import { neighbourFinder } from '../../src/neighbours';
import { presetViews } from '../../src/regions';
import { search, type Entry } from '../../src/search';
import { cardModel, NO_BOUNDARY } from '../../src/card';
import { baseStyle } from '../../src/basemap';

const overrides: Overrides = JSON.parse(readFileSync('data/dop-overrides.json', 'utf8'));
const layer = applyOverrides(JSON.parse(readFileSync('data/dops.geojson', 'utf8')), overrides);
const props = layer.features.map((f) => f.properties as unknown as DopProps);
const codeOf = (name: string) => props.find((p) => p.name === name)!.code;
const neighbours = neighbourFinder(layer.features);

describe('neighbours', () => {
  it('are symmetric', () => {
    for (const p of props) for (const n of neighbours(p.code)) expect(neighbours(n), `${p.code} -> ${n}`).toContain(p.code);
  });
  it('of Rioja include Navarra and not the Álava txakoli', () => {
    const rioja = neighbours(codeOf('Rioja'));
    expect(rioja).toContain(codeOf('Navarra'));
    expect(rioja).not.toContain(codeOf('Arabako Txakolina / Txakolí de Álava'));
  });
});

describe('preset views', () => {
  const views = presetViews(layer.features, overrides.regions);
  it('are Spain, the ten regions in order, then Rioja close up', () => {
    expect(views.map((v) => v.id)).toEqual(['spain', ...Object.keys(overrides.regions), 'rioja-close']);
  });
  it('each have a non-empty box', () => {
    for (const { id, box: [[w, s], [e, n]] } of views) {
      expect(e - w, id).toBeGreaterThan(0);
      expect(n - s, id).toBeGreaterThan(0);
    }
  });
});

describe('search', () => {
  const entries: Entry[] = [...props.map((p) => ({ name: p.name, code: p.code })), ...overrides.missing.map((m) => ({ name: m.name }))];
  it('finds Rías Baixas from "rias"', () => expect(search(entries, 'rias').map((e) => e.name)).toContain('Rías Baixas'));
  it('finds polygon-less DOPs', () => expect(search(entries, overrides.missing[0].name)[0]).toEqual({ name: overrides.missing[0].name }));
  it('finds nothing for an empty query', () => expect(search(entries, '  ')).toEqual([]));
});

describe('card model', () => {
  it('has exactly name, level, region, neighbours and note', () => {
    const p = props.find((x) => x.note)!;
    const m = cardModel(p, overrides.regions, [{ code: 'X', name: 'Somewhere' }]);
    expect(Object.keys(m).sort()).toEqual(['level', 'name', 'neighbours', 'note', 'region']);
    expect(m.region).toBe(overrides.regions[p.region]);
  });
  it('spells the level out once', () => {
    const m = cardModel(props.find((p) => p.name === 'Rioja')!, overrides.regions, []);
    expect(m.level).toBe('DOCa · Denominación de Origen Calificada');
    expect(m).not.toHaveProperty('note');
  });
  it('says a polygon-less DOP has no boundary yet', () => {
    const m = cardModel(overrides.missing[0], overrides.regions, []);
    expect(m.note).toContain(NO_BOUNDARY);
  });
});

describe('base style', () => {
  it('has no remote sources in fixture mode', () => {
    const s = baseStyle({ fixture: true, esriKey: 'k' });
    expect(Object.keys(s.sources)).toEqual([]);
    expect(s.glyphs).toBeUndefined();
  });
  it('omits Esri without a key', () => {
    for (const esriKey of [undefined, '']) {
      const s = baseStyle({ fixture: false, esriKey });
      expect(Object.keys(s.sources).sort()).toEqual(['eox', 'relief', 'terrain']);
      expect(s.layers.map((l) => l.id)).not.toContain('esri');
    }
  });
  it('adds Esri from zoom 9 with a key, and stops EOX at 10', () => {
    const s = baseStyle({ fixture: false, esriKey: 'test-key' });
    expect(s.sources).toHaveProperty('esri');
    const ids = s.layers.map((l) => l.id);
    expect(ids.indexOf('esri')).toBe(ids.indexOf('eox') + 1);
    expect(s.layers.find((l) => l.id === 'esri')).toMatchObject({ minzoom: 9 });
    expect(s.layers.find((l) => l.id === 'eox')).toMatchObject({ maxzoom: 10 });
  });
});
