// Close-in imagery. Inside a country with its own orthophoto the map shows that photo (Spain: IGN's PNOA, 25 cm, CC BY 4.0;
// France: IGN's BD ORTHO, 20 cm, Licence Ouverte 2.0); everywhere else Esri World Imagery.
// All are fetched one zoom finer on 2x screens so a photo pixel is one screen pixel, not a 2x2 block.
// They meet along the borders: each orthophoto's tiles are cut to its country plus a strip of sea, and Esri skips tiles one covers whole.
// Which countries use which photo: src/countries.ts (`imagery`). Sources and terms: data/SOURCES.md.
import maplibregl from 'maplibre-gl';
import { COUNTRIES } from '../countries';
import spainMask from '../../data/spain-mask.json';
import franceMask from '../../data/countries/fr/mask.json';

type Ring = number[][];
type Polygon = Ring[];
interface Mask { land: Polygon[]; neighbours: Polygon[] }

export type OrthophotoId = 'pnoa' | 'ign-fr';

/** One country's orthophoto. `id` is also its tile protocol, style source and layer id. */
export interface Orthophoto {
  id: OrthophotoId;
  /** WMTS tile URL with {z}, {x} and {y}. */
  tiles: string;
  attribution: string;
  /** It starts at this tile zoom; above country-wide views it adds nothing Esri lacks. */
  minzoom: number;
  /** The finest tile zoom it serves. */
  maxzoom: number;
  /** The country's land (shown, plus a strip of sea) and its neighbours' land near the border (cut out). */
  mask: Mask;
  /** Latitude the sea strip is measured at, roughly the country's middle. */
  lat: number;
  /** The service paints ground it has no photo for white; in border tiles white is cleared so Esri shows there instead. */
  whiteNoData?: boolean;
}

export const ORTHOPHOTOS: Record<OrthophotoId, Orthophoto> = {
  pnoa: {
    id: 'pnoa',
    tiles: 'https://www.ign.es/wmts/pnoa-ma?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=OI.OrthoimageCoverage&STYLE=default&FORMAT=image/jpeg&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
    attribution: 'Spain: PNOA © IGN, CC BY 4.0 scne.es',
    minzoom: 10,
    // PNOA's 25 cm photo is about tile zoom 19.
    maxzoom: 19,
    mask: spainMask as Mask,
    lat: 40,
  },
  'ign-fr': {
    id: 'ign-fr',
    tiles: 'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
    attribution: 'France: BD ORTHO © IGN, Licence Ouverte 2.0',
    minzoom: 10,
    // The Géoplateforme serves zoom 19 and answers 404 at 20 (checked 22 Oct 2026).
    maxzoom: 19,
    mask: franceMask as Mask,
    lat: 46,
    // BD ORTHO stops at the real border, which Natural Earth's simplified line misses by up to a kilometre (Irun, Bidasoa):
    // without this, slivers of Spain went white.
    whiteNoData: true,
  },
};

/** The orthophotos some country uses, in the order they are drawn over Esri. */
export const ACTIVE_ORTHOPHOTOS: Orthophoto[] = [...new Set(Object.values(COUNTRIES).map((c) => c.imagery))]
  .filter((id): id is OrthophotoId => id !== 'esri')
  .map((id) => ORTHOPHOTOS[id]);

/** Sea kept around a country's coast, in metres, so beaches and harbours are not cut along Natural Earth's coastline. */
const SEA_STRIP_M = 2000;

/** Raster tile size to declare: 128 on 2x screens makes MapLibre fetch the next zoom, drawn at one tile pixel per screen pixel. */
export function rasterTileSize(dpr: number = typeof window === 'undefined' ? 1 : window.devicePixelRatio): 128 | 256 {
  return dpr >= 1.5 ? 128 : 256;
}

/** Web Mercator, 0..1 across the world. */
function merc([lon, lat]: number[]): [number, number] {
  const s = Math.sin((lat * Math.PI) / 180);
  return [(lon + 180) / 360, 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)];
}

interface Projected { rings: Array<Array<[number, number]>>; box: [number, number, number, number] }
function project(polys: Polygon[]): Projected[] {
  return polys.map((p) => {
    const rings = p.map((r) => r.map(merc));
    const xs = rings[0].map((q) => q[0]);
    const ys = rings[0].map((q) => q[1]);
    return { rings, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
  });
}

/** Tile edges in Mercator units, widened by `pad` (also Mercator). */
function tileBox(z: number, x: number, y: number, pad = 0): [number, number, number, number] {
  const n = 2 ** z;
  return [x / n - pad, y / n - pad, (x + 1) / n + pad, (y + 1) / n + pad];
}
const overlaps = (a: number[], b: number[]) => a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];

export interface Coverage {
  /** Some of the tile is the country or its strip of sea. */
  some: boolean;
  /** All of it is: Esri can skip the tile. */
  whole: boolean;
}

/** A fully transparent tile. */
let blank: Promise<ArrayBuffer> | null = null;
function blankTile(): Promise<ArrayBuffer> {
  if (!blank) {
    const c = new OffscreenCanvas(1, 1);
    c.getContext('2d'); // convertToBlob needs a context, even for an empty canvas
    blank = c.convertToBlob({ type: 'image/png' }).then((b) => b.arrayBuffer());
  }
  return blank;
}

/** `esri://12/2010/1490?r=1` → [12, 2010, 1490]. */
export const tileXYZ = (url: string) => url.replace(/^[\w-]+:\/\//, '').split('?')[0].split('/').map(Number) as [number, number, number];

const fill = (template: string, z: number, x: number, y: number) =>
  template.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y));

async function fetchTile(url: string, signal: AbortSignal): Promise<ArrayBuffer> {
  const r = await fetch(url, { signal });
  // An error page served with 200 would otherwise be drawn as a blank tile, with Esri already skipped there.
  if (!r.ok || !r.headers.get('content-type')?.startsWith('image/')) throw new Error(`${r.status} ${url.split('?')[0]}`);
  return r.arrayBuffer();
}

export interface ImageryHealth {
  /** Called once when an orthophoto keeps failing; the map then reloads Esri so that country is not left empty. */
  onOrthophotoDown: () => void;
}

/** An orthophoto tile that failed counts as failed this long, so Esri fills it rather than refetching and skipping again. */
const FAILED_MS = 60_000;

/** One orthophoto's mask, tile downloads and health. */
class OrthoSource {
  private land: Projected[];
  private neighbours: Projected[];
  /** Strip of sea in Mercator units: metres per unit at the country's latitude, close enough for a 2 km strip. */
  private strip: number;
  /** Only the two answers are cached; a border tile's mask (256 KB of canvas) is drawn again when its photo is cut. */
  private coverageCache = new Map<string, Coverage>();
  private errors = 0;
  private loaded = 0;
  down = false;
  private failed = new Map<string, number>();
  /** One download per tile, shared by both protocols: Esri asks for the same tile numbers to know whether to skip. */
  private tiles = new Map<string, Promise<ArrayBuffer>>();

  constructor(readonly photo: Orthophoto) {
    this.land = project(photo.mask.land);
    this.neighbours = project(photo.mask.neighbours);
    this.strip = SEA_STRIP_M / (40_075_016 * Math.cos((photo.lat * Math.PI) / 180));
  }

  /** How much of a 256 px tile shows this photo. */
  coverage(z: number, x: number, y: number): Coverage {
    const key = `${z}/${x}/${y}`;
    const hit = this.coverageCache.get(key);
    if (hit) return hit;
    const { some, whole } = this.measure(z, x, y);
    if (this.coverageCache.size > 5000) this.coverageCache.clear();
    this.coverageCache.set(key, { some, whole });
    return { some, whole };
  }

  /** The tile's coverage and, for a tile partly in the country, the alpha mask to cut its photo with. */
  measure(z: number, x: number, y: number): Coverage & { mask: OffscreenCanvas | null } {
    const size = 256;
    const strip = this.strip;
    const near = this.land.filter((p) => overlaps(p.box, tileBox(z, x, y, strip)));
    if (!near.length) return { some: false, whole: false, mask: null };
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    const scale = 2 ** z * size;
    const trace = (polys: Projected[]) => {
      ctx.beginPath();
      for (const p of polys) for (const r of p.rings) r.forEach(([mx, my], i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, mx * scale - x * size, my * scale - y * size));
    };
    ctx.fillStyle = ctx.strokeStyle = '#000';
    trace(near);
    ctx.fill('evenodd');
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2 * strip * scale;
    ctx.stroke();
    const cut = this.neighbours.filter((p) => overlaps(p.box, tileBox(z, x, y)));
    if (cut.length) {
      ctx.globalCompositeOperation = 'destination-out';
      trace(cut);
      ctx.fill('evenodd');
      ctx.globalCompositeOperation = 'source-over';
    }
    const a = ctx.getImageData(0, 0, size, size).data;
    let any = 0;
    let full = 0;
    for (let i = 3; i < a.length; i += 4) {
      if (a[i] > 0) any++;
      if (a[i] === 255) full++;
    }
    const whole = full === size * size;
    return { some: any > 0, whole, mask: any > 0 && !whole ? canvas : null };
  }

  /** Some of the country's land (with its strip of sea) lies near the tile: a box test, no drawing. */
  near(z: number, x: number, y: number): boolean {
    return this.land.some((p) => overlaps(p.box, tileBox(z, x, y, this.strip)));
  }

  tile(z: number, x: number, y: number, health: ImageryHealth): Promise<ArrayBuffer> {
    const key = `${z}/${x}/${y}`;
    const failedAt = this.failed.get(key);
    if (failedAt !== undefined && Date.now() - failedAt < FAILED_MS) return Promise.reject(new Error(`${this.photo.id} ${key} failed`));
    let tile = this.tiles.get(key);
    if (!tile) {
      // Not cancelled when MapLibre drops the tile: the other protocol may be waiting on the same download.
      const once = () => fetchTile(fill(this.photo.tiles, z, x, y), new AbortController().signal);
      // One retry: IGN drops the odd request, and a missing tile would leave a hole in the country.
      tile = once().catch(once).then(
        (bytes) => { this.loaded++; return bytes; },
        (e) => {
          this.tiles.delete(key);
          if (this.failed.size > 2000) this.failed.clear();
          this.failed.set(key, Date.now());
          if (++this.errors >= 3 && this.loaded === 0 && !this.down) { this.down = true; health.onOrthophotoDown(); }
          throw e;
        },
      );
      if (this.tiles.size > 500) this.tiles.delete(this.tiles.keys().next().value as string);
      this.tiles.set(key, tile);
    }
    return tile;
  }
}

/** Near-white pixels made transparent (JPEG blurs the service's pure white, so not only 255). */
function clearWhite(ctx: OffscreenCanvasRenderingContext2D) {
  const img = ctx.getImageData(0, 0, 256, 256);
  const a = img.data;
  for (let i = 0; i < a.length; i += 4) if (a[i] >= 245 && a[i + 1] >= 245 && a[i + 2] >= 245) a[i + 3] = 0;
  ctx.putImageData(img, 0, 0);
}

const sources = new Map<OrthophotoId, OrthoSource>();
const sourceFor = (photo: Orthophoto) => {
  let s = sources.get(photo.id);
  if (!s) sources.set(photo.id, (s = new OrthoSource(photo)));
  return s;
};

/** Some of the tile could show this orthophoto (a box test against its country's land and strip of sea). */
export const orthophotoNear = (photo: Orthophoto, z: number, x: number, y: number) => sourceFor(photo).near(z, x, y);

const live = new Set<ImageryHealth>();
let registered = false;
/**
 * Registers one tile protocol per orthophoto (`pnoa://`, `ign-fr://`) and `esri://` the first time, then only adds this map's health
 * listener: several maps (the atlas, a tour's map or still) share the protocols, and an orthophoto outage reaches the maps still alive.
 * Returns the release for the map's `remove()`. `esriTemplate` is the Esri URL with its key; its tiles keep their own URL so the live
 * map check still sees them.
 */
export function registerImagery(esriTemplate: string | null, mapHealth: ImageryHealth): () => void {
  live.add(mapHealth);
  const release = () => { live.delete(mapHealth); };
  if (registered) return release;
  registered = true;
  const health: ImageryHealth = { onOrthophotoDown: () => live.forEach((h) => h.onOrthophotoDown()) };
  const orthos = ACTIVE_ORTHOPHOTOS.map(sourceFor);
  for (const src of orthos) {
    maplibregl.addProtocol(src.photo.id, async (params) => {
      const [z, x, y] = tileXYZ(params.url);
      const { some, whole } = src.coverage(z, x, y);
      if (!some || src.down) return { data: await blankTile() };
      const bytes = await src.tile(z, x, y, health);
      if (whole) return { data: bytes };
      const { mask } = src.measure(z, x, y);
      if (!mask) return { data: bytes };
      const photo = await createImageBitmap(new Blob([bytes]));
      const out = new OffscreenCanvas(256, 256);
      const ctx = out.getContext('2d') as OffscreenCanvasRenderingContext2D;
      ctx.drawImage(photo, 0, 0, 256, 256);
      photo.close();
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(mask, 0, 0);
      if (src.photo.whiteNoData) clearWhite(ctx);
      return { data: await (await out.convertToBlob({ type: 'image/png' })).arrayBuffer() };
    });
  }
  if (esriTemplate) {
    maplibregl.addProtocol('esri', async (params, abort) => {
      const [z, x, y] = tileXYZ(params.url);
      // Where an orthophoto covers the whole tile, Esri is only fetched if that photo's own tile failed.
      const cover = orthos.find((s) => !s.down && z >= s.photo.minzoom && s.coverage(z, x, y).whole);
      if (cover) {
        const ok = await cover.tile(z, x, y, health).then(() => true, () => false);
        if (ok) return { data: await blankTile() };
      }
      return { data: await fetchTile(fill(esriTemplate, z, x, y), abort.signal) };
    });
  }
  return release;
}

/** Tile URL templates for the style; `bust` changes the Esri URLs so the map reloads tiles it had skipped. */
export const ESRI_PROTOCOL_TILES = (bust = 0) => `esri://{z}/{x}/{y}${bust ? `?r=${bust}` : ''}`;
export const orthophotoProtocolTiles = (photo: Orthophoto) => `${photo.id}://{z}/{x}/{y}`;
