import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { chapterFlies, flyTargetOf, guideOf, loadAllGuides, sources, type Chapter, type FlyTarget } from '../../src/facts';
import type { Place } from '../../src/tree';

const guides = await loadAllGuides(); // guides load on demand in the app (decision #38)

const real: Place[] = JSON.parse(readFileSync('data/places.json', 'utf8')).places;
const ids = new Set(real.map((p) => p.id));

const allFlies = (): Array<[string, FlyTarget]> => guides.flatMap((g) => g.chapters.flatMap((c) => chapterFlies(c).map((f) => [g.id, f] as [string, FlyTarget])));
const allCites = (): Array<[string, string]> => guides.flatMap((g) => [
  ...g.lede.cite.map((c) => [g.id, c] as [string, string]),
  ...g.chapters.flatMap((c: Chapter) => [...c.cite, ...chapterFlies(c).flatMap((f) => f.cite)].map((k) => [g.id, k] as [string, string])),
]);

describe('the Terroir sections', () => {
  it('exist for Rioja and its three zones, the nine Green Spain places, the 16 Castilla y León places and the eight Andalucía places, the 12 Cataluña places, the two Baleares places, the 11 Ebro places, the 11 Mediterranean places, the 11 Canarias places, the 25 Meseta places, the 24 new Portugal places (batch 1, owner option B, 22 Oct 2026, with Douro and Vinho Verde the 26), the France pilot (Chablis, Pauillac, 22 Oct 2026), each for a place in the tree', () => {
    expect(guides.map((g) => g.id).sort()).toEqual([
      'abadia-retuerta', 'abona', 'alella', 'alenquer', 'alentejo', 'alicante', 'almansa', 'arinzano', 'arlanza', 'arribes', 'arruda', 'ayles',
      'bairrada', 'beira-interior', 'bierzo', 'binissalem', 'bolandin', 'bucelas', 'bullas', 'calatayud', 'calzadilla', 'campo-de-borja',
      'campo-de-calatrava', 'campo-de-la-guardia', 'cangas', 'carcavelos', 'carinena', 'casa-del-blanco', 'catalunya', 'cava', 'cebreros', 'chablis',
      'chozas-carrascal', 'cigales', 'colares', 'conca-de-barbera', 'condado-de-huelva', 'costers-del-segre', 'dao', 'dehesa-del-carrizal',
      'dehesa-penalba', 'dominio-de-valdepusa', 'dotejo', 'douro', 'el-hierro', 'el-terrerazo', 'el-vicario', 'emporda', 'encostas-daire',
      'finca-elez', 'gran-canaria', 'granada', 'guijoso', 'islas-canarias', 'jerez', 'jumilla', 'la-gomera', 'la-jaraba', 'la-mancha', 'la-palma',
      'lafoes', 'lagoa', 'lagos', 'lanzarote', 'lebrija', 'leon', 'lisboa', 'los-balagueses', 'los-cerrillos', 'madeira', 'madeirense', 'malaga', 'manchuela', 'manzanilla',
      'mentrida', 'mondejar', 'monterrei', 'montilla-moriles', 'montsant', 'navarra', 'obidos', 'otazu', 'pago-florentino', 'palmela', 'pauillac', 'penedes',
      'pla-de-bages', 'pla-i-llevant', 'portimao', 'porto', 'prado-de-irache', 'priorat', 'rias-baixas', 'ribeira-sacra', 'ribeiro',
      'ribera-del-duero', 'ribera-del-guadiana', 'ribera-del-jucar', 'rio-negro', 'rioja', 'rioja-alavesa', 'rioja-alta', 'rioja-oriental',
      'rosalejo', 'rueda', 'setubal', 'sierra-de-salamanca', 'sierras-de-malaga', 'somontano', 'tacoronte-acentejo', 'tarragona', 'tavira',
      'tavora-varosa', 'terra-alta', 'tharsys', 'tierra-del-vino-de-zamora', 'toro', 'torres-vedras', 'tras-os-montes', 'txakoli-alava',
      'txakoli-bizkaia', 'txakoli-getaria', 'ucles', 'urbezo', 'uruena', 'utiel-requena', 'valdeorras', 'valdepenas', 'valencia', 'valle-de-guimar',
      'valle-de-la-orotava', 'vallegarcia', 'valles-de-benavente', 'valtiendas', 'vera-de-estenas', 'vinho-verde', 'vinos-de-madrid',
      'ycoden-daute-isora', 'yecla',
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
