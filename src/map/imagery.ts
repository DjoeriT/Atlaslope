// Close-in imagery. Inside Spain the map shows IGN's PNOA orthophoto (25 cm, CC BY 4.0); everywhere else Esri World Imagery.
// Both are fetched one zoom finer on 2x screens so a photo pixel is one screen pixel, not a 2x2 block.
// The two meet along Spain's border: PNOA tiles are cut to Spain plus a strip of sea, and Esri skips tiles PNOA covers whole.
// Sources and terms: data/SOURCES.md.
import maplibregl from 'maplibre-gl';
import maskData from '../../data/spain-mask.json';

export const PNOA_TILES =
  'https://www.ign.es/wmts/pnoa-ma?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=OI.OrthoimageCoverage&STYLE=default&FORMAT=image/jpeg&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}';
export const PNOA_ATTRIBUTION = 'Spain: PNOA © IGN, CC BY 4.0 scne.es';
/** PNOA starts at this tile zoom; above Spain-wide views it adds nothing Esri lacks. */
export const PNOA_MIN_ZOOM = 10;
/** PNOA's 25 cm photo is about tile zoom 19. */
export const PNOA_MAX_ZOOM = 19;
/** Sea kept around Spain's coast, in metres, so beaches and harbours are not cut along Natural Earth's coastline. */
const SEA_STRIP_M = 2000;

/** Raster tile size to declare: 128 on 2x screens makes MapLibre fetch the next zoom, drawn at one tile pixel per screen pixel. */
export function rasterTileSize(dpr: number = typeof window === 'undefined' ? 1 : window.devicePixelRatio): 128 | 256 {
  return dpr >= 1.5 ? 128 : 256;
}

type Ring = number[][];
type Polygon = Ring[];
interface Mask { land: Polygon[]; neighbours: Polygon[] }

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

const mask = maskData as Mask;
const SPAIN = project(mask.land);
const NEIGHBOURS = project(mask.neighbours);

/** Tile edges in Mercator units, widened by `pad` (also Mercator). */
function tileBox(z: number, x: number, y: number, pad = 0): [number, number, number, number] {
  const n = 2 ** z;
  return [x / n - pad, y / n - pad, (x + 1) / n + pad, (y + 1) / n + pad];
}
const overlaps = (a: number[], b: number[]) => a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];

/** Metres per Mercator unit at Spain's latitude (40° N); close enough for a 2 km strip. */
const M_PER_UNIT = 40_075_016 * Math.cos((40 * Math.PI) / 180);

export interface Coverage {
  /** Some of the tile is Spain or its strip of sea. */
  some: boolean;
  /** All of it is: Esri can skip the tile. */
  whole: boolean;
}

/** Only the two answers are cached; a border tile's mask (256 KB of canvas) is drawn again when its photo is cut. */
const coverageCache = new Map<string, Coverage>();

/** How much of a 256 px tile shows PNOA. */
export function tileCoverage(z: number, x: number, y: number): Coverage {
  const key = `${z}/${x}/${y}`;
  const hit = coverageCache.get(key);
  if (hit) return hit;
  const { some, whole } = measure(z, x, y);
  if (coverageCache.size > 5000) coverageCache.clear();
  coverageCache.set(key, { some, whole });
  return { some, whole };
}

/** The tile's coverage and, for a tile partly in Spain, the alpha mask to cut its photo with. */
function measure(z: number, x: number, y: number): Coverage & { mask: OffscreenCanvas | null } {
  const size = 256;
  const strip = SEA_STRIP_M / M_PER_UNIT;
  const near = SPAIN.filter((p) => overlaps(p.box, tileBox(z, x, y, strip)));
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
  const cut = NEIGHBOURS.filter((p) => overlaps(p.box, tileBox(z, x, y)));
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
export const tileXYZ = (url: string) => url.replace(/^\w+:\/\//, '').split('?')[0].split('/').map(Number) as [number, number, number];

const fill = (template: string, z: number, x: number, y: number) =>
  template.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y));

async function fetchTile(url: string, signal: AbortSignal): Promise<ArrayBuffer> {
  const r = await fetch(url, { signal });
  // An error page served with 200 would otherwise be drawn as a blank tile, with Esri already skipped there.
  if (!r.ok || !r.headers.get('content-type')?.startsWith('image/')) throw new Error(`${r.status} ${url.split('?')[0]}`);
  return r.arrayBuffer();
}

export interface ImageryHealth {
  /** Called once when PNOA keeps failing; the map then reloads Esri so Spain is not left empty. */
  onPnoaDown: () => void;
}

let pnoaErrors = 0;
let pnoaLoaded = 0;
let pnoaDown = false;

/** A PNOA tile that failed counts as failed this long, so Esri fills it rather than refetching PNOA and skipping again. */
const PNOA_FAILED_MS = 60_000;
const pnoaFailed = new Map<string, number>();

/** One PNOA download per tile, shared by both protocols: Esri asks for the same tile numbers to know whether to skip. */
const pnoaTiles = new Map<string, Promise<ArrayBuffer>>();
function pnoaTile(z: number, x: number, y: number, health: ImageryHealth): Promise<ArrayBuffer> {
  const key = `${z}/${x}/${y}`;
  const failedAt = pnoaFailed.get(key);
  if (failedAt !== undefined && Date.now() - failedAt < PNOA_FAILED_MS) return Promise.reject(new Error(`PNOA ${key} failed`));
  let tile = pnoaTiles.get(key);
  if (!tile) {
    // Not cancelled when MapLibre drops the tile: the other protocol may be waiting on the same download.
    const once = () => fetchTile(fill(PNOA_TILES, z, x, y), new AbortController().signal);
    // One retry: IGN drops the odd request, and a missing tile would leave a hole in Spain.
    tile = once().catch(once).then(
      (bytes) => { pnoaLoaded++; return bytes; },
      (e) => {
        pnoaTiles.delete(key);
        if (pnoaFailed.size > 2000) pnoaFailed.clear();
        pnoaFailed.set(key, Date.now());
        if (++pnoaErrors >= 3 && pnoaLoaded === 0 && !pnoaDown) { pnoaDown = true; health.onPnoaDown(); }
        throw e;
      },
    );
    if (pnoaTiles.size > 500) pnoaTiles.delete(pnoaTiles.keys().next().value as string);
    pnoaTiles.set(key, tile);
  }
  return tile;
}

const live = new Set<ImageryHealth>();
let registered = false;
/**
 * Registers the `pnoa://` and `esri://` tile protocols the first time, then only adds this map's health listener: several maps (the atlas,
 * a tour's map or still) share the protocols, and a PNOA outage reaches the maps still alive. Returns the release for the map's `remove()`.
 * `esriTemplate` is the Esri URL with its key; its tiles keep their own URL so the live map check still sees them.
 */
export function registerImagery(esriTemplate: string | null, mapHealth: ImageryHealth): () => void {
  live.add(mapHealth);
  const release = () => { live.delete(mapHealth); };
  if (registered) return release;
  registered = true;
  const health: ImageryHealth = { onPnoaDown: () => live.forEach((h) => h.onPnoaDown()) };
  maplibregl.addProtocol('pnoa', async (params) => {
    const [z, x, y] = tileXYZ(params.url);
    const { some, whole } = tileCoverage(z, x, y);
    if (!some || pnoaDown) return { data: await blankTile() };
    const bytes = await pnoaTile(z, x, y, health);
    if (whole) return { data: bytes };
    const { mask } = measure(z, x, y);
    if (!mask) return { data: bytes };
    const photo = await createImageBitmap(new Blob([bytes]));
    const out = new OffscreenCanvas(256, 256);
    const ctx = out.getContext('2d') as OffscreenCanvasRenderingContext2D;
    ctx.drawImage(photo, 0, 0, 256, 256);
    photo.close();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(mask, 0, 0);
    return { data: await (await out.convertToBlob({ type: 'image/png' })).arrayBuffer() };
  });
  if (esriTemplate) {
    maplibregl.addProtocol('esri', async (params, abort) => {
      const [z, x, y] = tileXYZ(params.url);
      // Where PNOA covers the whole tile, Esri is only fetched if PNOA's own tile failed.
      if (!pnoaDown && z >= PNOA_MIN_ZOOM && tileCoverage(z, x, y).whole) {
        const pnoa = await pnoaTile(z, x, y, health).then(() => true, () => false);
        if (pnoa) return { data: await blankTile() };
      }
      return { data: await fetchTile(fill(esriTemplate, z, x, y), abort.signal) };
    });
  }
  return release;
}

/** Tile URL templates for the style; `bust` changes the Esri URLs so the map reloads tiles it had skipped. */
export const ESRI_PROTOCOL_TILES = (bust = 0) => `esri://{z}/{x}/{y}${bust ? `?r=${bust}` : ''}`;
export const PNOA_PROTOCOL_TILES = 'pnoa://{z}/{x}/{y}';
