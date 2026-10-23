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
  it('exist for Rioja and its three zones, the nine Green Spain places, the 16 Castilla y León places and the eight Andalucía places, the 12 Cataluña places, the two Baleares places, the 11 Ebro places, the 11 Mediterranean places, the 11 Canarias places, the 25 Meseta places, the 24 new Portugal places (batch 1, owner option B, 22 Oct 2026, with Douro and Vinho Verde the 26), the 87 Italy first-wave places (#80), the France pilot (Chablis, Pauillac, 22 Oct 2026), each for a place in the tree', () => {
    expect(guides.map((g) => g.id).sort()).toEqual([
      'abadia-retuerta', 'abona', 'aglianico-del-taburno', 'aglianico-del-vulture', 'alella', 'alenquer', 'alentejo', 'alicante', 'almansa',
      'alta-langa', 'alto-adige', 'arinzano', 'arlanza', 'arribes', 'arruda', 'asolo-prosecco', 'asti', 'ayles', 'bagnoli-friularo', 'bairrada',
      'barbaresco', 'barbera-d-asti', 'barbera-del-monferrato-superiore', 'bardolino-superiore', 'barolo', 'beira-interior', 'bierzo', 'binissalem',
      'bolandin', 'bolgheri', 'brachetto-dacqui', 'brunello-di-montalcino', 'bucelas', 'bullas', 'calatayud', 'calzadilla', 'campo-de-borja',
      'campo-de-calatrava', 'campo-de-la-guardia', 'canelli', 'cangas', 'carcavelos', 'carinena', 'carmignano', 'casa-del-blanco', 'casauria',
      'castel-del-monte-bombino-nero', 'castel-del-monte-nero-di-troia-riserva', 'castel-del-monte-rosso-riserva', 'catalunya', 'cava', 'cebreros',
      'cerasuolo-di-vittoria', 'cesanese-del-piglio', 'chablis', 'chianti', 'chianti-classico', 'chozas-carrascal', 'cigales', 'colares',
      'colli-bolognesi-pignoletto', 'colli-di-conegliano', 'colli-euganei-fior-darancio', 'colli-orientali-del-friuli-picolit',
      'colline-teramane-montepulciano-dabruzzo', 'collio', 'conca-de-barbera', 'condado-de-huelva', 'conegliano-valdobbiadene', 'conero',
      'costers-del-segre', 'dao', 'dehesa-del-carrizal', 'dehesa-penalba', 'dogliani', 'dolcetto-d-alba', 'dolcetto-di-diano-dalba',
      'dolcetto-di-ovada-superiore', 'dominio-de-valdepusa', 'dotejo', 'douro', 'el-hierro', 'el-terrerazo', 'el-vicario', 'elba-aleatico-passito',
      'emporda', 'encostas-daire', 'erbaluce-di-caluso', 'etna', 'fiano-di-avellino', 'finca-elez', 'franciacorta', 'frascati',
      'friuli-colli-orientali', 'friuli-grave', 'gattinara', 'gavi', 'ghemme', 'gran-canaria', 'granada', 'greco-di-tufo', 'guijoso',
      'islas-canarias', 'jerez', 'jumilla', 'la-gomera', 'la-jaraba', 'la-mancha', 'la-palma', 'lafoes', 'lagoa', 'lagos', 'lanzarote', 'lebrija',
      'leon', 'lisboa', 'lison', 'los-balagueses', 'los-cerrillos', 'madeira', 'madeirense', 'malaga', 'manchuela', 'manzanilla', 'mentrida',
      'mondejar', 'montecucco-sangiovese', 'montefalco-sagrantino', 'montello-rosso', 'montepulciano-d-abruzzo', 'monterrei', 'montilla-moriles',
      'montsant', 'morellino-di-scansano', 'navarra', 'nizza', 'obidos', 'offida', 'oltrepo-pavese-metodo-classico', 'orvieto', 'otazu',
      'pago-florentino', 'palmela', 'pauillac', 'penedes', 'piave-malanotte', 'pla-de-bages', 'pla-i-llevant', 'portimao', 'porto',
      'prado-de-irache', 'primitivo-di-manduria-dolce-naturale', 'priorat', 'prosecco', 'ramandolo', 'recioto-di-gambellara', 'rias-baixas',
      'ribeira-sacra', 'ribeiro', 'ribera-del-duero', 'ribera-del-guadiana', 'ribera-del-jucar', 'rio-negro', 'rioja', 'rioja-alavesa', 'rioja-alta',
      'rioja-oriental', 'roero', 'romagna-albana', 'rosalejo', 'rosazzo', 'ruche-di-castagnole-monferrato', 'rueda', 'salice-salentino', 'scanzo',
      'setubal', 'sforzato-di-valtellina', 'sierra-de-salamanca', 'sierras-de-malaga', 'soave', 'somontano', 'suvereto', 'tacoronte-acentejo',
      'tarragona', 'taurasi', 'tavira', 'tavora-varosa', 'terra-alta', 'terre-alfieri', 'terre-tollesi', 'tharsys', 'tierra-del-vino-de-zamora',
      'torgiano-rosso-riserva', 'toro', 'torres-vedras', 'tras-os-montes', 'trentino', 'txakoli-alava', 'txakoli-bizkaia', 'txakoli-getaria',
      'ucles', 'urbezo', 'uruena', 'utiel-requena', 'val-di-cornia-rosso', 'valdeorras', 'valdepenas', 'valencia', 'valle-de-guimar',
      'valle-de-la-orotava', 'vallegarcia', 'valles-de-benavente', 'valpolicella', 'valtellina-superiore', 'valtiendas', 'vera-de-estenas',
      'verdicchio-dei-castelli-di-jesi', 'verdicchio-di-matelica-riserva', 'vermentino-di-gallura', 'vernaccia-di-san-gimignano',
      'vernaccia-di-serrapetrona', 'vinho-verde', 'vino-nobile-di-montepulciano', 'vinos-de-madrid', 'ycoden-daute-isora', 'yecla'
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
