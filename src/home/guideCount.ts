import { existsSync, readdirSync, readFileSync } from 'node:fs';
import photoCropsFile from './photoCrops.json';
import photoSizesFile from '../../data/photo-sizes.json';
import { loadTree } from '../tree';
import { COUNTRIES } from '../countries';

// The home page says how many places have a guide. It is plain HTML, so the number is filled in at build time from content/guides/
// (one JSON file per place), and new guides change it without touching the page (handoff 2026-10-19-home-refresh-build.md).
export const guideCount = (dir = 'content/guides'): number => readdirSync(dir).filter((f) => f.endsWith('.json')).length;

// The home page counts places, so the three Rioja zones' guides stay out of its number (109 files, 106 places; Meseta batch 3, 19 Oct 2026).
// Every country counts: Home, the Guides index and the country pages show Spain and Portugal as equals (owner 22 Oct 2026, option A of
// mocks/countries-structure.html: "Go with A: country cards on Home, country pages, Guides as the country index").
export const placeGuideCount = (dir = 'content/guides', placesFile = 'data/places.json', country?: string): number => {
  const places = new Set(JSON.parse(readFileSync(placesFile, 'utf8')).places
    .filter((p: { level: string; parent: string }) => p.level === 'place' && (!country || p.parent === country)).map((p: { id: string }) => p.id));
  return readdirSync(dir).filter((f) => f.endsWith('.json') && places.has(f.slice(0, -5))).length;
};

/** Number of map tours: the files in content/stories/. The home tile shows it (data-count="stories"). */
export const storyCount = (dir = 'content/stories'): number => readdirSync(dir).filter((f) => f.endsWith('.json')).length;

export const fillStoryCount = (html: string, n: number): string => html.replace(/(data-count="stories">)\d+(<)/g, `$1${n}$2`);

export const fillGuideCount = (html: string, n: number): string => html.replace(/(data-count="guides">)\d+(<)/g, `$1${n}$2`);

// The Guides page lists every guide the same way, so each release brings it up to date with no extra step (owner, 19 Oct 2026: it still said
// "4 of 79 places, all in Rioja" with 37 guides live). Option E round 3 (owner, 22 Oct 2026; Review/mock-guides-r1/build-brief.md): a black band
// of the map-tour guides (four featured, the rest behind a button), then every region with all its guides as small squares, zones after their place.
export interface GuideRow { id: string; name: string; label: string; minutes: number; region: string; country: string; zone: boolean; photo: string | null; tour: boolean }
export interface RegionGroup { id: string; name: string; country: string; guides: GuideRow[] }
export interface GuideList { countries: { id: string; name: string }[]; rows: GuideRow[]; regions: RegionGroup[]; photos: Record<string, PhotoCredit> }
export interface PhotoCredit { alt: string; artist: string; licence: string; licenceUrl: string; page: string }
export interface GuideSources { dir: string; placesFile: string; photosFile: string; publicDir: string; storiesDir: string }

export const GUIDE_SOURCES: GuideSources = { dir: 'content/guides', placesFile: 'data/places.json', photosFile: 'data/photos.json', publicDir: 'public', storiesDir: 'content/stories' };
/** The four map tours shown first in the band (owner 22 Oct 2026); the other tours sit behind the "Show all" button. */
export const BAND_FEATURED = ['rioja', 'priorat', 'ribeira-sacra', 'txakoli-getaria'];
/** A guide's tile photo is `<id>-1` unless picked here: Rioja's -1 has a grey sky, -2 (Laguardia, autumn vines) is the stronger one (22 Oct 2026). */
export const PHOTO_PICK: Record<string, string> = { rioja: 'rioja-2' };

const KIND: Record<string, string> = { DO: 'DO', DOCa: 'DOCa', VP: 'Vino de Pago', VC: 'Vino de Calidad', DOC: 'DOC', VR: 'Vinho Regional' };
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = <T>(f: string) => JSON.parse(readFileSync(f, 'utf8')) as T;

export const guideRows = (src: Partial<GuideSources> = {}): GuideList => {
  const { dir, placesFile, photosFile, publicDir, storiesDir } = { ...GUIDE_SOURCES, ...src };
  const tours = new Set(existsSync(storiesDir) ? readdirSync(storiesDir).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')) : []);
  const tree = loadTree(json(placesFile));
  const photos = json<{ photos: Record<string, PhotoCredit> }>(photosFile).photos;
  const guides = new Map<string, { minutes: number }>();
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const g = json<{ id: string; minutes: number }>(`${dir}/${f}`);
    guides.set(g.id, { minutes: g.minutes });
  }
  const hasPhoto = (key: string) => key in photos && existsSync(`${publicDir}/photos/480/${key}.webp`);
  const photoOf = (id: string) => [PHOTO_PICK[id], `${id}-1`].find((k) => k && hasPhoto(k)) ?? null;
  const rows: GuideRow[] = [];
  const regions: RegionGroup[] = [];
  for (const country of tree.countries) {
    for (const region of tree.regionsOf(country.id)) {
      const group: RegionGroup = { id: region.id, name: region.name, country: country.id, guides: [] };
      for (const place of tree.placesInRegion(region.id)) {
        const zones = tree.children(place.id).filter((c): c is typeof place => 'kind' in c && c.kind === 'zone');
        for (const p of [place, ...zones]) {
          const g = guides.get(p.id);
          if (!g) continue;
          const label = p.kind === 'zone' ? `Zone of ${place.name}` : (KIND[p.kind] ?? p.kind);
          const row: GuideRow = { id: p.id, name: p.name.split(' / ')[0], label, minutes: g.minutes, region: region.id, country: country.id, zone: p.kind === 'zone', photo: photoOf(p.id), tour: tours.has(p.id) };
          rows.push(row);
          group.guides.push(row);
        }
      }
      if (group.guides.length) regions.push(group);
    }
  }
  const missing = [...guides.keys()].filter((id) => !rows.some((r) => r.id === id));
  if (missing.length) throw new Error(`content/guides: no place in data/places.json for ${missing.join(', ')}`);
  return { countries: tree.countries.map((c) => ({ id: c.id, name: c.name })), rows, regions, photos };
};

/** One always-visible credit line for the page's photo set, grouped by licence: the licence and "cropped and resized" said once, every
 *  author still named and linked (owner, 22 Oct 2026: the per-photo line was 3,846 characters, "crazy"). */
export const creditLine = (keys: string[], photos: Record<string, PhotoCredit>): string => {
  const link = (href: string, text: string) => (href ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(text)}</a>` : esc(text));
  const groups = new Map<string, { url: string; names: Map<string, string[]> }>();
  for (const k of keys) {
    const c = photos[k];
    const name = /^unknown\b/i.test(c.artist) ? 'Wikimedia Commons' : c.artist;
    const g = groups.get(c.licence) ?? { url: c.licenceUrl, names: new Map() };
    const pages = g.names.get(name) ?? [];
    if (!pages.includes(c.page)) pages.push(c.page);
    g.names.set(name, pages);
    groups.set(c.licence, g);
  }
  if (!groups.size) return '';
  const parts = [...groups].sort((a, b) => b[1].names.size - a[1].names.size || a[0].localeCompare(b[0]))
        // Every photo keeps a link to its own page: the name links the first, numbered links the others (ReviewBot, #196).
    .map(([lic, g]) => `${link(g.url, lic)}: ${[...g.names].map(([n, pages]) => link(pages[0], n) + (pages.length > 1 ? ` (${pages.slice(1).map((pg, i) => link(pg, String(i + 2))).join(', ')})` : '')).join(', ')}`);
  return `<p class="credit">Photos from Wikimedia Commons, cropped and resized. ${parts.join(' · ')}</p>`;
};
const photoSizes = photoSizesFile as { photos: Record<string, { w: number }> };

// A photo no wider than 800 px has no 800 copy, only its full file (release 47: Binissalem's photo 404'd on the Guides page)
// Square tiles crop with object-fit:cover; a photo whose centre crop cuts the subject has its own focus (owner 19 Oct 2026).
// Every shown photo has an entry (focus, plus the hash of the file that was checked); a unit test enforces it. Centre needs no style.
export const photoCrops = photoCropsFile as Record<string, { focus: string; file: string }>;
const focusOf = (key: string) => { const f = photoCrops[key]?.focus; return f && f !== '50% 50%' ? f : null; };

/** `root` is the way up to the site root from the page: '../' on guides/, es/ and pt/, '' on Home. */
export const photoImg = (key: string, photos: Record<string, PhotoCredit>, sizes: string, alt: boolean, square = false, focus: string | null = square ? focusOf(key) : null, root = '../') => {
  const w = photoSizes.photos[key]?.w ?? 1200;
  const set: [string, number][] = [480, 800].filter((s) => s < w).map((s) => [`${root}photos/${s}/${key}.webp`, s]);
  if (w <= 800) set.push([`${root}photos/${key}.webp`, w]);
  const src = set[set.length - 1][0];
  return `<img src="${src}" srcset="${set.map(([u, s]) => `${u} ${s}w`).join(', ')}" sizes="${sizes}" alt="${alt ? esc(photos[key].alt) : ''}"${square && focus ? ` style="object-position:${focus}"` : ''} loading="lazy" />`;
};

const GLYPH = '<svg class="glyph" width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 3.5 6.5 2v12.5l-5 1.5zM6.5 2l5 1.5v12.5l-5-1.5zM11.5 3.5 16.5 2v12.5l-5 1.5z"/></svg>';
/** A guide opens where its country keeps place pages: Portugal at /pt/<place>/ (decision #48), Spain in the atlas page view. */
export const href = (g: GuideRow) => (COUNTRIES[g.country]?.paths ? `../${COUNTRIES[g.country].code}/${esc(g.id)}/` : `../atlas/#place=${esc(g.id)}&amp;page`);

/** The square photo; a map tour carries the champagne "Map tour" chip on it (the owner's one exception to "no text on photos"). */
const tile = (g: GuideRow, photos: Record<string, PhotoCredit>, sizes: string): string =>
  !g.photo ? '<span class="sqbox nophoto"><i>Photos soon</i></span>' : `<span class="sqbox">${photoImg(g.photo, photos, sizes, false, true)}${g.tour ? `<span class="chip">${GLYPH}<span>Map tour</span></span>` : ''}</span>`;

/** The tour guides in band order: the four featured first, then the rest in list order. Only guides with a photo get a tile. */
export const bandTours = (list: GuideList, country?: string): { featured: GuideRow[]; rest: GuideRow[]; count: number } => {
  const tours = list.rows.filter((r) => r.tour && (!country || r.country === country));
  const withPhoto = tours.filter((r) => r.photo);
  const featured = BAND_FEATURED.flatMap((id) => withPhoto.filter((r) => r.id === id));
  return { featured, rest: withPhoto.filter((r) => !featured.includes(r)), count: tours.length };
};

/** Photo keys the Guides page shows as square tiles: one per guide that has a photo. */
export const squarePhotoKeys = (list: GuideList, country?: string): string[] => list.rows.filter((g) => !country || g.country === country).flatMap((g) => (g.photo ? [g.photo] : []));

/** The black band of map-tour guides, every tour open (owner 22 Oct 2026: "the whole map tour setup"): the four featured first and bigger,
 *  each tile with its Map tour chip, name, label line and, on the Guides page (all countries), its country. */
export const bandHtml = (list: GuideList, country?: string): string => {
  const { photos } = list;
  const { featured, rest, count } = bandTours(list, country);
  if (!count) return '';
  const name = (id: string) => list.countries.find((c) => c.id === id)?.name ?? id;
  const t = (g: GuideRow, sizes: string) => `<a href="${href(g)}">${tile(g, photos, sizes)}<span class="nm">${esc(g.name)}</span><span class="meta">${esc(g.label)}${country ? '' : ` · ${esc(name(g.country))}`}</span></a>`;
  return [
    `<section class="band" id="map-tours" aria-labelledby="map-tours-h"><div class="wrap"><div class="rowh"><h2 id="map-tours-h">Explore with the map</h2><span class="n">${count} guides</span></div>`,
    `<div class="stills feat">${featured.map((g) => t(g, '(max-width:700px) 240px, 280px')).join('')}</div>`,
    rest.length ? `<div class="stills more" id="more-tours">${rest.map((g) => t(g, '(max-width:700px) 45vw, 220px')).join('')}</div>` : '',
    '</div></section>',
  ].filter(Boolean).join('\n');
};

/** One country's regions, every guide a square (a quiet "Photos soon" tile where there is no photo yet), zones after their place. */
export const regionBlocks = (list: GuideList, country: string): string => {
  const { photos } = list;
  const out: string[] = [];
  for (const r of list.regions.filter((x) => x.country === country)) {
    const n = r.guides.length;
    const card = (g: GuideRow) => `<a class="ecard" href="${href(g)}"${g.tour ? ' data-tour' : ''}>${tile(g, photos, '(max-width:700px) 33vw, 140px')}<span class="nm">${esc(g.name)}</span>${g.label === 'DO' ? '' : `<span class="meta">${esc(g.label)}</span>`}</a>`;
    out.push(
      `<section class="region" aria-labelledby="r-${esc(r.id)}"><div class="rowh"><h2 id="r-${esc(r.id)}">${esc(r.name)}</h2><span class="n">${n} ${n === 1 ? 'guide' : 'guides'}</span></div>`,
      `<div class="ecards">${r.guides.map(card).join('')}</div>`,
      '</section>',
    );
  }
  return out.join('\n');
};

/** Replace what sits between `<!-- name -->` and `<!-- /name -->`; a page that lost its markers fails the build rather than ship empty. */
export const fillMarked = (html: string, name: string, body: string, file = 'the page'): string => {
  const marked = new RegExp(`(<!-- ${name} -->\\n)[\\s\\S]*?(\\n\\s*<!-- /${name} -->)`);
  if (!marked.test(html)) throw new Error(`${file}: the <!-- ${name} --> markers are missing, so the list would ship empty`);
  return html.replace(marked, (_m, open: string, close: string) => open + body + close);
};

export const fillCount = (html: string, name: string, n: number): string => html.replace(new RegExp(`(data-count="${name}">)\\d+(<)`, 'g'), `$1${n}$2`);
