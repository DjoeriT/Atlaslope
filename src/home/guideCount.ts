import { existsSync, readdirSync, readFileSync } from 'node:fs';
import photoCropsFile from './photoCrops.json';
import photoSizesFile from '../../data/photo-sizes.json';
import { grapeLabel } from '../facts/format';
import { sentences } from '../pages/sentence';
import { loadTree } from '../tree';

// The home page says how many places have a guide. It is plain HTML, so the number is filled in at build time from content/guides/
// (one JSON file per place), and new guides change it without touching the page (handoff 2026-10-19-home-refresh-build.md).
export const guideCount = (dir = 'content/guides'): number => readdirSync(dir).filter((f) => f.endsWith('.json')).length;

// The home page counts places, so the three Rioja zones' guides stay out of its number (109 files, 106 places; Meseta batch 3, 19 Oct 2026).
export const placeGuideCount = (dir = 'content/guides', placesFile = 'data/places.json'): number => {
  const places = new Set(JSON.parse(readFileSync(placesFile, 'utf8')).places.filter((p: { level: string }) => p.level === 'place').map((p: { id: string }) => p.id));
  return readdirSync(dir).filter((f) => f.endsWith('.json') && places.has(f.slice(0, -5))).length;
};

export const fillGuideCount = (html: string, n: number): string => html.replace(/(data-count="guides">)\d+(<)/g, `$1${n}$2`);

// The Guides page lists every guide the same way, so each release brings it up to date with no extra step (owner, 19 Oct 2026: it still said
// "4 of 79 places, all in Rioja" with 37 guides live). Layout C "Editorial" (owner pick, 19 Oct 2026, Review mock guides-landing-v1): one featured
// guide, then a row per study region with its satellite tile and a card for each guide. Order: regions in course order, their places in course
// order, zones after their place. A new guide file lands in its region by itself; a region with no tile in public/guides/ shows no tile.
export interface GuideRow { id: string; name: string; label: string; minutes: number; region: string; lede: string; photo: string | null }
export interface RegionGroup { id: string; name: string; tile: string | null; guides: GuideRow[] }
export interface Featured { row: GuideRow; photos: string[]; facts: Array<{ key: string; text: string }>; hero: boolean }
export interface GuideList { rows: GuideRow[]; regions: RegionGroup[]; featured: Featured | null; photos: Record<string, PhotoCredit> }
export interface PhotoCredit { alt: string; artist: string; licence: string; licenceUrl: string; page: string }
export interface GuideSources { dir: string; placesFile: string; factsDir: string; photosFile: string; publicDir: string }

export const GUIDE_SOURCES: GuideSources = { dir: 'content/guides', placesFile: 'data/places.json', factsDir: 'content/facts', photosFile: 'data/photos.json', publicDir: 'public' };
/** The one hand pick: the guide shown first, with three photos and its In short. */
export const FEATURED_ID = 'rioja';

const KIND: Record<string, string> = { DO: 'DO', DOCa: 'DOCa', VP: 'Vino de Pago', VC: 'Vino de Calidad' };
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = <T>(f: string) => JSON.parse(readFileSync(f, 'utf8')) as T;

interface FactSheet { id: string; grapes: { main: Array<{ local: string; grape?: string }> }; climate: { text: string }; soil: { text: string } }

const factsOf = (id: string, factsDir: string): Array<{ key: string; text: string }> => {
  const sheet = readdirSync(factsDir).filter((f) => f.endsWith('.json'))
    .flatMap((f) => json<{ sheets: FactSheet[] }>(`${factsDir}/${f}`).sheets).find((x) => x.id === id);
  if (!sheet) return [];
  const main = sheet.grapes.main;
  const grapes = main.length === 0 ? '' : main.length <= 2 ? main.map((g) => grapeLabel(g)).join(' and ') : `${grapeLabel(main[0])} and ${main.length - 1} more`;
  return [
    { key: 'Grapes', text: grapes }, { key: 'Climate', text: sheet.climate.text && sentences(sheet.climate.text, 110) },
    { key: 'Soil', text: sheet.soil.text && sentences(sheet.soil.text, 110) },
  ].filter((f) => f.text);
};

// The featured guide's satellite view with its flags, the home hero's image (owner 19 Oct 2026 13:50Z: "only the main region satellite image gets the home hero treatment")
const FEATURED_HERO: Record<string, { src: string; alt: string }> = {
  rioja: { src: '../home/hero.webp', alt: 'The atlas over Rioja on satellite imagery, with flags on Haro, the Sierra de Cantabria, the Ebro and Alfaro' },
};
export const guideRows = (src: Partial<GuideSources> = {}): GuideList => {
  const { dir, placesFile, factsDir, photosFile, publicDir } = { ...GUIDE_SOURCES, ...src };
  const tree = loadTree(json(placesFile));
  const photos = json<{ photos: Record<string, PhotoCredit> }>(photosFile).photos;
  const guides = new Map<string, { minutes: number; lede: string }>();
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const g = json<{ id: string; minutes: number; lede: { text: string } }>(`${dir}/${f}`);
    guides.set(g.id, { minutes: g.minutes, lede: g.lede.text });
  }
  const hasPhoto = (key: string) => key in photos && existsSync(`${publicDir}/photos/480/${key}.webp`);
  const rows: GuideRow[] = [];
  const regions: RegionGroup[] = [];
  for (const country of tree.countries) {
    for (const region of tree.regionsOf(country.id)) {
      const group: RegionGroup = { id: region.id, name: region.name, tile: existsSync(`${publicDir}/guides/${region.id}.webp`) ? `${region.id}.webp` : null, guides: [] };
      for (const place of tree.placesInRegion(region.id)) {
        const zones = tree.children(place.id).filter((c): c is typeof place => 'kind' in c && c.kind === 'zone');
        for (const p of [place, ...zones]) {
          const g = guides.get(p.id);
          if (!g) continue;
          const label = p.kind === 'zone' ? `Zone of ${place.name}` : (KIND[p.kind] ?? p.kind);
          const row: GuideRow = { id: p.id, name: p.name.split(' / ')[0], label, minutes: g.minutes, region: region.id, lede: g.lede, photo: hasPhoto(`${p.id}-1`) ? `${p.id}-1` : null };
          rows.push(row);
          group.guides.push(row);
        }
      }
      if (group.guides.length) regions.push(group);
    }
  }
  const missing = [...guides.keys()].filter((id) => !rows.some((r) => r.id === id));
  if (missing.length) throw new Error(`content/guides: no place in data/places.json for ${missing.join(', ')}`);
  const row = rows.find((r) => r.id === FEATURED_ID);
  const featPhotos = [1, 2, 3].map((n) => `${FEATURED_ID}-${n}`).filter(hasPhoto);
  const featured = row ? { row, photos: featPhotos, facts: factsOf(row.id, factsDir), hero: row.id in FEATURED_HERO && existsSync(`${publicDir}/home/hero.webp`) } : null;
  return { rows, regions, featured, photos };
};

// One credit line per photo set, always visible, the same parts as the place pages (src/cards/Credit.tsx): author, licence, and the change
// made for the CC BY licences: "cropped and resized", as every frame crops (square cards, the featured mosaic) (#154).
// One entry per author and licence.
export const creditLine = (keys: string[], photos: Record<string, PhotoCredit>): string => {
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const k of keys) {
    const c = photos[k];
    const name = /^unknown\b/i.test(c.artist) ? 'Wikimedia Commons' : c.artist;
    if (seen.has(`${name}|${c.licence}`)) continue;
    seen.add(`${name}|${c.licence}`);
    const link = (href: string, text: string) => (href ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(text)}</a>` : esc(text));
    parts.push(`${link(c.page, name)} · ${link(c.licenceUrl, c.licence)}${/^CC BY\b/.test(c.licence) ? ' · cropped and resized' : ''}`);
  }
  return parts.length ? `<p class="credit">Photos: ${parts.join('; ')}</p>` : '';
};
// the tile's own caption, so a reader ties the credit to the image (ReviewBot PR #114, P2 3)
const photoSizes = photoSizesFile as { photos: Record<string, { w: number }> };

const SAT_CREDIT = '<figcaption class="credit">Imagery: Esri, Vantor · Spain: PNOA © IGN</figcaption>';

// A photo no wider than 800 px has no 800 copy, only its full file (release 47: Binissalem's photo 404'd on the Guides page)
// Square cards crop with object-fit:cover; a photo whose centre crop cuts the subject has its own focus (owner 19 Oct 2026).
// Every shown photo has an entry (focus, plus the hash of the file that was checked); a unit test enforces it. Centre needs no style.
export const photoCrops = photoCropsFile as Record<string, { focus: string; file: string }>;
const focusOf = (key: string) => { const f = photoCrops[key]?.focus; return f && f !== '50% 50%' ? f : null; };

export const photoImg = (key: string, photos: Record<string, PhotoCredit>, sizes: string, alt: boolean, square = false, focus: string | null = square ? focusOf(key) : null) => {
  const w = photoSizes.photos[key]?.w ?? 1200;
  const set: [string, number][] = [480, 800].filter((s) => s < w).map((s) => [`../photos/${s}/${key}.webp`, s]);
  if (w <= 800) set.push([`../photos/${key}.webp`, w]);
  const src = set[set.length - 1][0];
  return `<img src="${src}" srcset="${set.map(([u, s]) => `${u} ${s}w`).join(', ')}" sizes="${sizes}" alt="${alt ? esc(photos[key].alt) : ''}"${square && focus ? ` style="object-position:${focus}"` : ''} loading="lazy" />`;
};

const card = (g: GuideRow, photos: Record<string, PhotoCredit>): string => {
  const top = g.photo
    ? `<span class="ct">${photoImg(g.photo, photos, '(max-width:700px) 90vw, 300px', false, true)}</span><span class="cb"><b>${esc(g.name)}</b>`
    : `<span class="ct typo"><b>${esc(g.name)}</b></span><span class="cb"><b class="sr">${esc(g.name)}</b>`;
  return `<a class="gcard-c" href="../atlas/#place=${esc(g.id)}&amp;page">${top}<em>${esc(g.label)} · ${g.minutes}-minute read</em><span class="lede">${esc(g.lede)}</span></span></a>`;
};

// Guides shown per region on the Guides page; the rest sit behind the region link
const PER_REGION = 6;

/** Photo keys the Guides page shows as square cards. */
export const squarePhotoKeys = (list: GuideList): string[] =>
  list.regions.flatMap((r) => r.guides.slice(0, PER_REGION)).flatMap((g) => (g.photo ? [g.photo] : []));

export const fillGuideList = (html: string, list: GuideList): string => {
  const { regions, featured, photos } = list;
  const out: string[] = [];
  if (regions.length) out.push(`<nav class="jump" aria-label="Jump to a region">${regions.map((r) => `<a href="#r-${esc(r.id)}">${esc(r.name)}</a>`).join('')}</nav>`);
  if (featured) {
    const f = featured.row;
    const hero = featured.hero ? FEATURED_HERO[f.id] : undefined;
    const imgs = hero ? '' : featured.photos.map((k, i) => photoImg(k, photos, i === 0 ? '(max-width:900px) 90vw, 480px' : '(max-width:900px) 45vw, 240px', true)).join('');
    const facts = featured.facts.map((x) => `<div><dt>${esc(x.key)}</dt><dd>${esc(x.text)}</dd></div>`).join('');
    out.push(
      '<div class="feat">',
      hero ? `<figure class="hero-sat"><img src="${hero.src}" alt="${esc(hero.alt)}" width="1400" height="1540" loading="lazy" />${SAT_CREDIT}</figure>` : '',
      imgs ? `<div class="mosaic">${imgs}</div>` : '',
      `<div class="ft"><span class="show">Showcased guide</span><span class="kick">${esc(f.label)} · ${f.minutes}-minute read</span><h2>${esc(f.name)}</h2><p class="fl">${esc(f.lede)}</p>`,
      facts ? `<h3>In short</h3><dl class="facts">${facts}</dl>` : '',
      `<a class="btn a" href="../atlas/#place=${esc(f.id)}&amp;page">Read the ${esc(f.name)} guide</a></div></div>`,
      hero ? '' : creditLine(featured.photos, photos),
    );
  }
  for (const r of regions) {
    const n = r.guides.length;
    const shown = r.guides.slice(0, PER_REGION);
    out.push(
      `<section class="region" aria-labelledby="r-${esc(r.id)}"><div class="rowh"><h2 id="r-${esc(r.id)}">${esc(r.name)}</h2><span>${n} ${n === 1 ? 'guide' : 'guides'}</span></div>`,
      '<div class="rowg">',
      r.tile ? `<figure class="sat"><img src="../guides/${esc(r.tile)}" alt="Satellite view of ${esc(r.name)}" width="1200" height="750" loading="lazy" />${SAT_CREDIT}</figure>` : '',
      ...shown.map((g) => card(g, photos)),
      '</div>',
      creditLine(shown.flatMap((g) => (g.photo ? [g.photo] : [])), photos),
      n > PER_REGION ? `<p class="more"><a href="../atlas/#region=${esc(r.id)}&amp;page">All ${esc(r.name)} guides</a></p>` : '',
      '</section>',
    );
  }
  const body = out.filter(Boolean).join('\n');
  const marked = /(<!-- guide-list -->\n)[\s\S]*?(\n\s*<!-- \/guide-list -->)/;
  if (!marked.test(html)) throw new Error('guides/index.html: the <!-- guide-list --> markers are missing, so the list would ship empty');
  return html.replace(marked, (_m, open: string, close: string) => open + body + close);
};
