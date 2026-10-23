import { COUNTRIES } from '../countries';
import { bandHtml, creditLine, fillCount, fillMarked, photoImg, regionBlocks, squarePhotoKeys } from './guideCount';
import type { GuideList } from './guideCount';

// Country cards on Home, a page per country, and the Guides page as the country index (owner 22 Oct 2026, option A of
// mocks/countries-structure.html: "Go with A: country cards on Home, country pages, Guides as the country index").
// A third country is an entry here, one in src/countries.ts and its tree; no page or code changes. All copy is draft, owner rewrites.

export interface CountryPage {
  /** One line under the name on the country page. Numbers come from the data, never from here. */
  intro: string;
  /** The five photos of the country card on Home: the first is the lead square, the next four the small ones. */
  cardPhotos: string[];
  /** The photo blocks on the country page, each a lead square and four small ones. */
  blocks: { title?: string; keys: string[] }[];
  /** The Learn note: Spain has a Learn link, Portugal says what is missing. */
  study: { note: string; link: boolean };
}

export const COUNTRY_PAGES: Record<string, CountryPage> = {
  spain: {
    intro: 'From Green Spain to the Canary Islands.',
    cardPhotos: ['rioja-2', 'priorat-1', 'ribeira-sacra-1', 'rias-baixas-1', 'txakoli-bizkaia-1'],
    blocks: [{ keys: ['rioja-2', 'priorat-1', 'ribeira-sacra-1', 'rias-baixas-1', 'txakoli-bizkaia-1'] }],
    study: { note: 'Test yourself on the regions and places of Spain.', link: true },
  },
  portugal: {
    intro: 'From the green north to the Algarve and Madeira.',
    cardPhotos: ['douro-2', 'vinho-verde-3', 'douro-1', 'vinho-verde-1', 'douro-4'],
    blocks: [
      { title: 'Douro', keys: ['douro-2', 'douro-1', 'douro-6', 'douro-3', 'douro-4'] },
      { title: 'Vinho Verde', keys: ['vinho-verde-3', 'vinho-verde-1', 'vinho-verde-5', 'vinho-verde-8', 'vinho-verde-7'] },
    ],
    study: { note: 'Not yet for Portugal.', link: false },
  },
  france: {
    intro: 'From Champagne to the Mediterranean.',
    cardPhotos: ['chablis-1', 'pauillac-1', 'chablis-2', 'pauillac-2', 'chablis-4'],
    blocks: [
      { title: 'Chablis', keys: ['chablis-1', 'chablis-2', 'chablis-3', 'chablis-4', 'chablis-5'] },
      { title: 'Pauillac', keys: ['pauillac-1', 'pauillac-2', 'pauillac-3', 'pauillac-4', 'pauillac-5'] },
    ],
    study: { note: 'Not yet for France.', link: false },
  },
  italy: {
    intro: 'From the Alps to Sicily.',
    cardPhotos: ['barolo-1', 'chianti-classico-1', 'barolo-3', 'chianti-classico-3', 'barolo-2'],
    blocks: [
      { title: 'Barolo', keys: ['barolo-1', 'barolo-2', 'barolo-3', 'barolo-4', 'barolo-5'] },
      { title: 'Chianti Classico', keys: ['chianti-classico-1', 'chianti-classico-2', 'chianti-classico-3', 'chianti-classico-4', 'chianti-classico-5'] },
    ],
    study: { note: 'Not yet for Italy.', link: false },
  },
  // Pilot (#149): Mosel and Rheingau. Draft intro, owner rewrites.
  germany: {
    intro: 'From the Mosel to the Rheingau.',
    cardPhotos: ['mosel-1', 'rheingau-1', 'mosel-3', 'rheingau-2', 'mosel-4'],
    blocks: [],
    study: { note: 'Not yet for Germany.', link: false },
  },
  // Pilot (#149): Wachau and Neusiedlersee. Draft intro, owner rewrites. Card photos wait for the guides' photos.
  austria: {
    intro: 'From the Danube to the lake.',
    cardPhotos: [],
    blocks: [],
    study: { note: 'Not yet for Austria.', link: false },
  },
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** The countries the site shows, in tree order, with what the data says about each (never hand-typed). */
export const countryStats = (list: GuideList) => list.countries.map((c) => {
  const regions = list.regions.filter((r) => r.country === c.id);
  return { ...c, code: COUNTRIES[c.id].code, regions, guides: list.rows.filter((r) => r.country === c.id && !r.zone).length, tours: list.rows.filter((r) => r.country === c.id && r.tour).length };
});

/** Every photo the country cards, country pages and Guides index show beyond the guide tiles: each needs a checked crop (src/home/photoCrops.json). */
export const countryPhotoKeys = (list: GuideList): string[] => [...new Set(list.countries.flatMap((c) => {
  const p = COUNTRY_PAGES[c.id];
  return p ? [...p.cardPhotos, ...p.blocks.flatMap((b) => b.keys)] : [];
}))];

/** One lead square and four small ones, as in the mock. */
const mosaic = (keys: string[], list: GuideList, root: string, cls = 'mosaic') => {
  if (!keys.length) return ''; // a country whose photos have not landed yet (France)
  const sq = (k: string, sizes: string, big = false) => `<span class="sqbox${big ? ' big' : ''}">${photoImg(k, list.photos, sizes, true, true, undefined, root)}</span>`;
  return `<div class="${cls}">${sq(keys[0], '(max-width:700px) 50vw, 320px', true)}${keys.slice(1, 5).map((k) => sq(k, '(max-width:700px) 25vw, 160px')).join('')}</div>`;
};

const countsLine = (s: { regions: unknown[]; guides: number }) => `${plural(s.regions.length, 'region', 'regions')} · ${plural(s.guides, 'guide', 'guides')}`;

/** Home: two equal country cards. */
export const homeCountries = (list: GuideList): string => {
  const cards = countryStats(list).map((s) => `<div class="cc"><h3>${esc(s.name)}</h3>${mosaic(COUNTRY_PAGES[s.id].cardPhotos, list, '')}<p class="cnt">${countsLine(s)}</p><a class="btn a" href="${s.code}/">Open ${esc(s.name)}</a></div>`);
  const keys = [...new Set(list.countries.flatMap((c) => COUNTRY_PAGES[c.id]?.cardPhotos ?? []))];
  return `<!-- draft copy, owner rewrites -->\n<div class="countries">${cards.join('')}</div>\n${creditLine(keys, list.photos)}`;
};

export const fillHome = (html: string, list: GuideList, stories: number): string => {
  const s = countryStats(list);
  const guides = s.reduce((n, c) => n + c.guides, 0);
  const counted = fillCount(fillCount(fillCount(fillCount(html, 'places', guides), 'guides', guides), 'regions', s.reduce((n, c) => n + c.regions.length, 0)), 'stories', stories);
  return fillMarked(counted, 'country-cards', homeCountries(list), 'index.html');
};

/** Guides: the map-tour band, then one block per country (photos, counts, region names as links, "Open <country>"). */
export const guidesIndex = (list: GuideList): string => {
  const blocks = countryStats(list).map((s) => `<section class="ix" aria-labelledby="ix-${s.code}"><div class="ixh"><h2 id="ix-${s.code}">${esc(s.name)}</h2><p class="cnt">${countsLine(s)}</p><a class="btn a" href="../${s.code}/">Open ${esc(s.name)}</a>${s.tours ? `<a class="tourlink" href="../${s.code}/?tours">Only guides with a map tour</a>` : ''}</div>`
    + `<nav class="reg" aria-label="Regions of ${esc(s.name)}">${s.regions.map((r) => `<a href="../${s.code}/#r-${esc(r.id)}">${esc(r.name)}</a>`).join('')}</nav>`
    + `<div class="strip4">${COUNTRY_PAGES[s.id].cardPhotos.slice(0, 4).map((k) => `<span class="sqbox">${photoImg(k, list.photos, '(max-width:700px) 25vw, 160px', true, true)}</span>`).join('')}</div></section>`);
  const keys = [...new Set([...bandKeys(list), ...list.countries.flatMap((c) => COUNTRY_PAGES[c.id]?.cardPhotos.slice(0, 4) ?? [])])];
  return `${bandHtml(list)}\n<div class="wrap gl"><!-- draft copy, owner rewrites -->\n${blocks.join('\n')}\n<div class="foot">${creditLine(keys, list.photos)}</div></div>`;
};

/** The photos in the map-tour band: every tour guide's tile. */
const bandKeys = (list: GuideList): string[] => list.rows.filter((r) => r.tour && r.photo).map((r) => r.photo!);

export const fillGuidesIndex = (html: string, list: GuideList): string => fillMarked(html, 'guide-list', guidesIndex(list), 'guides/index.html');

/** The photos a country page shows: its blocks and every guide tile. */
export const countryPageKeys = (list: GuideList, id: string): string[] => [...new Set([...COUNTRY_PAGES[id].blocks.flatMap((b) => b.keys), ...squarePhotoKeys(list, id)])];

/** A country page: intro, counts, the atlas on that country, the Study note, photo blocks, then the guides by region. */
export const countryPage = (list: GuideList, id: string): string => {
  const s = countryStats(list).find((c) => c.id === id);
  if (!s) throw new Error(`no country ${id} in data/places.json`);
  const page = COUNTRY_PAGES[id];
  const study = `<div class="study"><b>Learn</b><span>${page.study.note}${page.study.link ? '<br /><a href="../atlas/#learn">Open Learn</a>' : ''}</span></div>`;
  const blocks = page.blocks.map((b) => `<figure class="ld">${b.title ? `<figcaption><b>${esc(b.title)}</b></figcaption>` : ''}${mosaic(b.keys, list, '../', 'mosaic')}</figure>`).join('');
  return [
    '<!-- draft copy, owner rewrites -->',
    `<div class="wrap gl"><div class="ch"><div class="chtxt"><p class="crumb"><a href="../guides/">Guides</a> / ${esc(s.name)}</p><h1>${esc(s.name)}</h1>`,
    `<p class="lead">${esc(page.intro)}<br />Each guide explains why one place tastes the way it does.</p><p class="cnt">${countsLine(s)}</p>`,
    `<a class="btn a" href="../atlas/#country=${esc(id)}">See ${esc(s.name)} on the atlas</a>${study}</div><div class="lds">${blocks}</div></div>`,
    `<div class="foot top">${creditLine(countryPageKeys(list, id), list.photos)}</div></div>`,
    bandHtml(list, id), // the country's map tours, above the regions; none, no band (Portugal today)
    '<div class="wrap gl">',
    `<nav class="jump" aria-label="Jump to a region">${s.regions.map((r) => `<a href="#r-${esc(r.id)}">${esc(r.name)}</a>`).join('')}</nav>`,
    s.tours ? '<div class="bar"><label class="tourtoggle"><input type="checkbox" id="tours" /> Show only guides with a map tour</label></div>' : '',
    regionBlocks(list, id),
    '</div>',
  ].filter(Boolean).join('\n');
};

/** The template page country/index.html becomes one page per country; %NAME% is the country's name. */
export const fillCountryPage = (html: string, list: GuideList, id: string): string => {
  const name = countryStats(list).find((c) => c.id === id)?.name ?? id;
  return fillMarked(html, 'country-page', countryPage(list, id), 'country/index.html').replace(/%NAME%/g, esc(name));
};
