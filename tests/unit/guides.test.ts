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
  it('exist for Rioja and its three zones, the nine Green Spain places, the 16 Castilla y León places and the eight Andalucía places, the 12 Cataluña places, the two Baleares places, the 11 Ebro places, the 11 Mediterranean places, the 11 Canarias places, the 25 Meseta places, the 24 new Portugal places (batch 1, owner option B, 22 Oct 2026, with Douro and Vinho Verde the 26), the France pilot (Chablis, Pauillac) the 16 more Bordeaux places the 22 more Burgundy places 18 Loire places and 14 Rhône places (22 Oct 2026), each for a place in the tree', () => {
    expect(guides.map((g) => g.id).sort()).toEqual([
      'abadia-retuerta', 'abona', 'alella', 'alenquer', 'alentejo', 'alicante', 'almansa', 'aloxe-corton', 'anjou', 'arinzano', 'arlanza',
      'arribes', 'arruda', 'ayles', 'bairrada', 'barsac', 'beaune', 'beira-interior', 'bierzo', 'binissalem', 'bolandin', 'bordeaux',
      'bordeaux-superieur', 'bourgogne', 'bourgueil', 'bucelas', 'bullas', 'cabernet-danjou', 'calatayud', 'calzadilla', 'campo-de-borja',
      'campo-de-calatrava', 'campo-de-la-guardia', 'cangas', 'carcavelos', 'carinena', 'casa-del-blanco', 'catalunya', 'cava', 'cebreros',
      'chablis', 'chassagne-montrachet', 'chateauneuf-du-pape', 'chinon', 'chozas-carrascal', 'cigales', 'colares', 'conca-de-barbera',
      'condado-de-huelva', 'condrieu', 'cornas', 'costers-del-segre', 'cote-de-beaune-villages', 'cote-de-nuits-villages', 'cote-rotie',
      'coteaux-du-layon', 'cotes-de-bordeaux', 'cotes-du-rhone', 'cotes-du-rhone-villages', 'cremant-de-bourgogne', 'cremant-de-loire',
      'crozes-hermitage', 'dao', 'dehesa-del-carrizal', 'dehesa-penalba', 'dominio-de-valdepusa', 'dotejo', 'douro', 'el-hierro',
      'el-terrerazo', 'el-vicario', 'emporda', 'encostas-daire', 'entre-deux-mers', 'finca-elez', 'gevrey-chambertin', 'gigondas', 'givry',
      'gran-canaria', 'granada', 'graves', 'guijoso', 'haut-medoc', 'hermitage', 'islas-canarias', 'jerez', 'jumilla', 'la-gomera',
      'la-jaraba', 'la-mancha', 'la-palma', 'lafoes', 'lagoa', 'lagos', 'lanzarote', 'lebrija', 'leon', 'lirac', 'lisboa', 'los-balagueses',
      'los-cerrillos', 'macon', 'madeira', 'madeirense', 'malaga', 'manchuela', 'manzanilla', 'margaux', 'medoc', 'menetou-salon',
      'mentrida', 'mercurey', 'meursault', 'mondejar', 'montagny', 'monterrei', 'montilla-moriles', 'montsant', 'muscadet',
      'muscadet-sevre-et-maine', 'muscat-de-beaumes-de-venise', 'navarra', 'nuits-saint-georges', 'obidos', 'otazu', 'pago-florentino',
      'palmela', 'pauillac', 'penedes', 'pessac-leognan', 'pla-de-bages', 'pla-i-llevant', 'pomerol', 'pommard', 'portimao', 'porto',
      'pouilly-fuisse', 'pouilly-fume', 'prado-de-irache', 'priorat', 'puligny-montrachet', 'rias-baixas', 'ribeira-sacra', 'ribeiro',
      'ribera-del-duero', 'ribera-del-guadiana', 'ribera-del-jucar', 'rio-negro', 'rioja', 'rioja-alavesa', 'rioja-alta', 'rioja-oriental',
      'rosalejo', 'rose-danjou', 'rose-de-loire', 'rueda', 'rully', 'saint-emilion', 'saint-emilion-grand-cru', 'saint-estephe',
      'saint-joseph', 'saint-julien', 'saint-veran', 'sancerre', 'saumur', 'saumur-champigny', 'sauternes', 'savennieres', 'setubal',
      'sierra-de-salamanca', 'sierras-de-malaga', 'somontano', 'tacoronte-acentejo', 'tarragona', 'tavel', 'tavira', 'tavora-varosa',
      'terra-alta', 'tharsys', 'tierra-del-vino-de-zamora', 'toro', 'torres-vedras', 'touraine', 'tras-os-montes', 'txakoli-alava',
      'txakoli-bizkaia', 'txakoli-getaria', 'ucles', 'urbezo', 'uruena', 'utiel-requena', 'vacqueyras', 'valdeorras', 'valdepenas',
      'valencia', 'valle-de-guimar', 'valle-de-la-orotava', 'vallegarcia', 'valles-de-benavente', 'valtiendas', 'vera-de-estenas',
      'vinho-verde', 'vinos-de-madrid', 'volnay', 'vosne-romanee', 'vougeot', 'vouvray', 'ycoden-daute-isora', 'yecla',
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
