import { describe, expect, it } from 'vitest';
import { loadTree } from '../../src/tree';
import { addressOf, hashAt, pathOf, placeOfPath, placePage, placePaths, siteRoot } from '../../src/paths';
import { countryConfig, COUNTRIES } from '../../src/countries';
import mask from '../../data/countries/pt/mask.json';

// Two countries: Spain flat on atlas/#place=, Portugal on real paths (decision #48).
const tree = loadTree({
  countries: [
    { id: 'spain', name: 'Spain', levels: ['country', 'region', 'place', 'zone'] },
    { id: 'portugal', name: 'Portugal', levels: ['country', 'region', 'place', 'zone'] },
  ],
  courses: [
    { id: 'sws', country: 'spain', groups: [{ id: 'upper-ebro', name: 'Upper Ebro', order: 1 }] },
    { id: 'wset-pt', country: 'portugal', groups: [{ id: 'north-pt', name: 'North', order: 1 }] },
  ],
  places: [
    { id: 'rioja', name: 'Rioja', kind: 'DOCa', level: 'place', parent: 'spain', region: 'upper-ebro', quiz: 'core' },
    { id: 'douro', name: 'Douro', kind: 'DOP', level: 'place', parent: 'portugal', region: 'north-pt', quiz: 'core' },
  ],
});

const at = (pathname: string, search = '') => ({ pathname, search }) as Location;

describe('place paths', () => {
  it('reads a Portugal path, and only for a country with paths', () => {
    expect(placeOfPath('/pt/douro/')).toEqual({ code: 'pt', id: 'douro' });
    expect(placeOfPath('/Atlaslope/pt/douro/index.html')).toEqual({ code: 'pt', id: 'douro' });
    expect(placeOfPath('/es/rioja/')).toBeNull();
    expect(placeOfPath('/atlas/')).toBeNull();
  });

  it('turns the path into the page of its place, and lets a card in the hash win', () => {
    expect(hashAt('/pt/douro/', '')).toBe('#place=douro&page');
    expect(hashAt('/pt/douro/', '#story&view=1,2,3')).toBe('#place=douro&page&story&view=1,2,3');
    expect(hashAt('/pt/douro/', '#place=rioja')).toBe('#place=rioja');
    expect(hashAt('/pt/douro/', '#study')).toBe('#study');
    expect(hashAt('/atlas/', '#place=rioja&page')).toBe('#place=rioja&page');
  });

  it('gives a Portugal page its path and keeps Spain on the atlas hash', () => {
    expect(pathOf(tree, { kind: 'place', id: 'douro', page: true })).toBe('pt/douro/');
    expect(pathOf(tree, { kind: 'place', id: 'douro' })).toBeNull();
    expect(pathOf(tree, { kind: 'place', id: 'rioja', page: true })).toBeNull();
    expect(placePaths(tree)).toEqual([{ code: 'pt', id: 'douro' }]);
  });

  it('writes addresses from either page', () => {
    const root = siteRoot('https://atlaslope.com/atlas/');
    expect(root).toBe('/');
    expect(siteRoot('https://djoerit.github.io/Atlaslope/atlas/')).toBe('/Atlaslope/');
    globalThis.document = { baseURI: 'https://atlaslope.com/atlas/' } as Document;
    expect(addressOf(tree, { kind: 'place', id: 'douro', page: true }, '#place=douro&page&story', at('/atlas/'))).toBe('/pt/douro/#story');
    expect(addressOf(tree, { kind: 'place', id: 'douro', page: true }, '#place=douro&page', at('/atlas/'))).toBe('/pt/douro/');
    expect(addressOf(tree, { kind: 'place', id: 'douro' }, '#place=douro', at('/pt/douro/'))).toBe('/atlas/#place=douro');
    expect(addressOf(tree, { kind: 'place', id: 'rioja', page: true }, '#place=rioja&page', at('/atlas/'))).toBe('/atlas/#place=rioja&page');
    expect(addressOf(tree, null, '#study', at('/pt/douro/'))).toBe('/atlas/#study');
    delete (globalThis as { document?: Document }).document;
  });

  it('builds the page file with a base back to atlas/', () => {
    const html = '<html><head><meta property="og:url" content="https://atlaslope.com/atlas/" /><script src="../assets/a.js"></script></head></html>';
    const out = placePage(html, 'pt', 'douro');
    expect(out).toContain('<head>\n    <base href="../../atlas/" />');
    expect(out).toContain('content="https://atlaslope.com/pt/douro/"');
    expect(() => placePage('<html></html>', 'pt', 'douro')).toThrow();
  });
});

describe('countries', () => {
  it('opens each country inside its own outline', () => {
    const [[w, s], [e, n]] = COUNTRIES.portugal.bounds;
    const pts = (mask as { land: number[][][][] }).land.flat(2);
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    expect(Math.abs(Math.min(...xs) - w)).toBeLessThan(0.3);
    expect(Math.abs(Math.max(...xs) - e)).toBeLessThan(0.3);
    expect(Math.abs(Math.min(...ys) - s)).toBeLessThan(0.3);
    expect(Math.abs(Math.max(...ys) - n)).toBeLessThan(0.3);
  });

  it('falls back to Spain for an unknown country', () => {
    expect(countryConfig('atlantis').id).toBe('spain');
    expect(countryConfig(undefined).imagery).toBe('pnoa');
  });
});
