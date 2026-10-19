import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { chapterFlies, flyTargetOf, guideOf, guides, sources, type Chapter, type FlyTarget } from '../../src/facts';
import type { Place } from '../../src/tree';

const real: Place[] = JSON.parse(readFileSync('data/places.json', 'utf8')).places;
const ids = new Set(real.map((p) => p.id));

const allFlies = (): Array<[string, FlyTarget]> => guides.flatMap((g) => g.chapters.flatMap((c) => chapterFlies(c).map((f) => [g.id, f] as [string, FlyTarget])));
const allCites = (): Array<[string, string]> => guides.flatMap((g) => [
  ...g.lede.cite.map((c) => [g.id, c] as [string, string]),
  ...g.chapters.flatMap((c: Chapter) => [...c.cite, ...chapterFlies(c).flatMap((f) => f.cite)].map((k) => [g.id, k] as [string, string])),
]);

describe('the Terroir sections', () => {
  it('exist for Rioja and its three zones, the nine Green Spain places, the 16 Castilla y León places and the eight Andalucía places, the 12 Cataluña places, the two Baleares places, the 11 Ebro places, the 11 Mediterranean places, the 11 Canarias places, each for a place in the tree', () => {
    expect(guides.map((g) => g.id).sort()).toEqual([
      'abadia-retuerta', 'abona', 'alella', 'alicante', 'arinzano', 'arlanza', 'arribes', 'ayles', 'bierzo', 'binissalem', 'bolandin',
      'bullas', 'calatayud', 'campo-de-borja', 'cangas', 'carinena', 'catalunya', 'cava', 'cebreros', 'chozas-carrascal', 'cigales',
      'conca-de-barbera', 'condado-de-huelva', 'costers-del-segre', 'dehesa-penalba', 'el-hierro', 'el-terrerazo', 'emporda',
      'gran-canaria', 'granada', 'islas-canarias', 'jerez', 'jumilla', 'la-gomera', 'la-palma', 'lanzarote', 'lebrija', 'leon',
      'los-balagueses', 'malaga', 'manzanilla', 'monterrei', 'montilla-moriles', 'montsant', 'navarra', 'otazu', 'penedes', 'pla-de-bages',
      'pla-i-llevant', 'prado-de-irache', 'priorat', 'rias-baixas', 'ribeira-sacra', 'ribeiro', 'ribera-del-duero', 'rioja',
      'rioja-alavesa', 'rioja-alta', 'rioja-oriental', 'rueda', 'sierra-de-salamanca', 'sierras-de-malaga', 'somontano',
      'tacoronte-acentejo', 'tarragona', 'terra-alta', 'tharsys', 'tierra-del-vino-de-zamora', 'toro', 'txakoli-alava', 'txakoli-bizkaia',
      'txakoli-getaria', 'urbezo', 'uruena', 'utiel-requena', 'valdeorras', 'valencia', 'valle-de-guimar', 'valle-de-la-orotava',
      'valles-de-benavente', 'valtiendas', 'vera-de-estenas', 'ycoden-daute-isora', 'yecla',
    ]);
    for (const g of guides) expect(ids.has(g.id), g.id).toBe(true);
  });

  it('cite only sources that content/sources.json knows, as "<id>" or "<id>:p<n>"', () => {
    const cites = allCites();
    expect(cites.length).toBeGreaterThan(0);
    for (const [guide, cite] of cites) {
      const m = /^([a-z0-9-]+)(?::p\d+)?$/.exec(cite);
      expect(m, `${guide}: ${cite}`).not.toBeNull();
      expect(m![1] in sources, `${guide}: ${cite}`).toBe(true);
    }
  });

  it('give every chapter a source, and every fly target a place in the tree or a point with a zoom', () => {
    for (const g of guides) for (const c of g.chapters) expect(c.cite.length, `${g.id}/${c.id}`).toBeGreaterThan(0);
    for (const [guide, f] of allFlies()) {
      expect(f.cite.length, `${guide}: ${f.label}`).toBeGreaterThan(0);
      if (f.place) expect(ids.has(f.place), `${guide}: ${f.label} -> ${f.place}`).toBe(true);
      else {
        expect(f.point?.length, `${guide}: ${f.label}`).toBe(2);
        expect(f.zoom, `${guide}: ${f.label}`).toBeGreaterThan(0);
      }
    }
  });

  it('number Rioja\'s pills 0.. within each chapter', () => {
    const rioja = guideOf('rioja')!;
    expect(rioja.chapters.flatMap(chapterFlies)).toHaveLength(7);
    expect(flyTargetOf(rioja, 'valley', 1)?.label).toBe('Sierra de Cantabria');
    expect(flyTargetOf(rioja, 'climate', 2)?.place).toBe('rioja-oriental');
    expect(flyTargetOf(rioja, 'climate', 3)).toBeUndefined();
    expect(flyTargetOf(rioja, 'nope', 0)).toBeUndefined();
  });
});
