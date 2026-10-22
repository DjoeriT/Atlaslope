import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadTree } from '../../src/tree';
import { COVER_PHOTO } from '../../src/cards/atlasCover';
import { BAND_FEATURED, PHOTO_PICK, bandTours, fillGuideCount, fillGuideList, guideCount, guideRows, photoCrops, placeGuideCount, squarePhotoKeys } from '../../src/home/guideCount';

// The home page (index.html) is plain HTML, so its numbers are typed in. They must say what the atlas's Spain card counts.
const html = readFileSync('index.html', 'utf8');
const tree = loadTree(JSON.parse(readFileSync('data/places.json', 'utf8')));
const spain = tree.countries[0];
const regions = tree.regionsOf(spain.id);
const places = regions.flatMap((r) => tree.placesInRegion(r.id));
const count = (name: string) => Number(new RegExp(`data-count="${name}">(\\d+)<`).exec(html)?.[1]);

describe('the home page', () => {
  it('counts the places and study regions the atlas has', () => {
    expect(count('places')).toBe(places.length);
    expect(count('regions')).toBe(regions.length);
  });
  it('fills in the number of places with a guide at build time', () => {
    expect(guideCount()).toBeGreaterThan(0);
    expect(html).toContain('data-count="guides">');
    expect(fillGuideCount(html, 42)).toContain('Deep guides to <span data-count="guides">42</span> places');
  });
  it('backs "each with its own guide": every place has a guide, and the zones stay out of the count', () => {
    expect(html).toContain('wine places, each with its own guide');
    expect(placeGuideCount()).toBe(places.length);
  });
  it('sends links from before the website to the atlas', () => {
    expect(html).toMatch(/location\.replace\('atlas\/'/);
  });
});

describe('the Guides page (option E round 3, owner 22 Oct 2026)', () => {
  const guidesHtml = readFileSync('guides/index.html', 'utf8');
  const link = (id: string) => `href="../atlas/#place=${id}&amp;page"`;
  const stories = readdirSync('content/stories').filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));
  const list = guideRows();
  const out = fillGuideList(guidesHtml, list);
  const section = (id: string) => out.split('<section class="region"').find((x) => x.includes(`id="r-${id}"`))!.split('</section>')[0];
  const count = (s: string, re: RegExp) => s.match(re)?.length ?? 0;

  it('lists every guide file, filled in at build time', () => {
    expect(list.rows).toHaveLength(guideCount());
    for (const r of list.rows) expect(out, r.id).toContain(link(r.id));
  });
  it('shows all guides of a region, none cut off, with the count in the heading', () => {
    expect(list.regions.some((r) => r.guides.length > 6)).toBe(true);
    for (const r of list.regions) {
      const sec = section(r.id);
      const n = r.guides.length;
      expect(sec).toContain(`<span class="n">${n} ${n === 1 ? 'guide' : 'guides'}</span>`);
      expect(count(sec, /class="ecard"/g) + count(sec, /<a href="\.\.\/atlas\/#place=/g)).toBe(n);
    }
    expect(out).not.toContain('All Rioja guides');
  });
  it('has a jump row with one link per region, to its section', () => {
    const nav = out.match(/<nav class="jump"[^>]*>(.*?)<\/nav>/)![1];
    expect([...nav.matchAll(/<a href="(#r-[^"]+)"/g)].map((m) => m[1])).toEqual(list.regions.map((r) => `#r-${r.id}`));
    for (const r of list.regions) expect(out).toContain(`<h2 id="r-${r.id}">`);
  });
  it('puts zones after their place, in course order', () => {
    const ids = list.rows.map((r) => r.id);
    expect(ids.indexOf('rioja-alta')).toBe(ids.indexOf('rioja') + 1);
  });
  it('groups guides by study region, in course order', () => {
    expect(list.regions.flatMap((r) => r.guides)).toEqual(list.rows);
    expect(list.regions.map((r) => r.id).slice(0, 2)).toEqual(['green-spain', 'castilla-y-leon']);
    for (const r of list.regions) for (const g of r.guides) expect(g.region).toBe(r.id);
  });
  it('shows a new guide in its region with no extra step', () => {
    const dir = mkdtempSync(join(tmpdir(), 'guides-'));
    for (const f of readdirSync('content/guides').filter((f) => f !== 'toro.json')) copyFileSync(`content/guides/${f}`, `${dir}/${f}`);
    const before = guideRows({ dir });
    expect(before.rows.map((r) => r.id)).not.toContain('toro');
    copyFileSync('content/guides/toro.json', `${dir}/toro.json`);
    const after = guideRows({ dir });
    expect(after.regions.find((r) => r.guides.some((g) => g.id === 'toro'))?.id).toBe('castilla-y-leon');
    expect(fillGuideList(guidesHtml, before)).not.toContain(link('toro'));
  });
  it('points every photo at a file that exists (release 47: Binissalem has no 800 px copy)', () => {
    const files = [...out.matchAll(/\.\.\/(photos\/[^"\s]+\.webp)/g)].map((m) => m[1]);
    expect(files.length).toBeGreaterThan(0);
    for (const f of new Set(files)) expect(existsSync(`public/${f}`), f).toBe(true);
  });
  it('shows the kind under the name only when it is not plain DO', () => {
    for (const r of list.regions) {
      for (const g of r.guides.filter((x) => x.photo)) {
        const card = section(r.id).split('<a class="ecard"').find((x) => x.includes(link(g.id)))!.split('</a>')[0];
        expect(card.includes('class="meta"'), g.id).toBe(g.label !== 'DO');
      }
    }
  });

  describe('the map-tour band', () => {
    const { featured, rest, count: n } = bandTours(list);
    const band = out.match(/<section class="band"[\s\S]*?<\/section>/)![0];
    it('counts the tours from the story files', () => {
      expect(n).toBe(stories.length);
      expect(list.rows.filter((r) => r.tour).map((r) => r.id).sort()).toEqual([...stories].sort());
      expect(band).toContain(`<span class="n">${n} guides</span>`);
      expect(band).toContain(`Show all ${n} map tours`);
    });
    it('features four tours and folds the rest behind a real button', () => {
      expect(featured.map((g) => g.id)).toEqual(BAND_FEATURED);
      expect(featured).toHaveLength(4);
      expect(featured.length + rest.length).toBe(n); // every tour guide has a photo, so none is left out of the band
      expect(band).toContain('<button type="button" class="morebtn" id="morebtn" aria-expanded="false" aria-controls="more-tours"');
      const [feat, more] = band.split('<div class="stills more" id="more-tours" hidden>');
      expect(count(feat, /class="sqbox"/g)).toBe(4);
      expect(count(more, /class="sqbox"/g)).toBe(n - 4);
      for (const g of [...featured, ...rest]) expect(band, g.id).toContain(link(g.id));
    });
    it('is the target of guides/#map-tours', () => {
      expect(band).toContain('id="map-tours"');
    });
    it('shows Rioja with its picked photo, which is a checked crop', () => {
      expect(featured[0].photo).toBe(PHOTO_PICK.rioja);
      expect(photoCrops[PHOTO_PICK.rioja]).toBeDefined();
    });
  });

  describe('the Map tour chip', () => {
    it('sits on every tour tile and on no other', () => {
      const tiles = out.split('<span class="sqbox">').slice(1);
      expect(tiles.length).toBeGreaterThan(0);
      for (const t of tiles) {
        const id = t.match(/\/photos\/\d+\/([^"/]+)\.webp/)![1];
        const row = list.rows.find((r) => r.photo === id)!;
        expect(t.split('</span></span>')[0].includes('class="chip"'), id).toBe(row.tour);
      }
      expect(count(out, /class="chip"/g)).toBe(2 * list.rows.filter((r) => r.tour && r.photo).length); // band + region grid
    });
  });

  describe('guides without a photo', () => {
    it('get no tile, only a name in the Also line after the grid', () => {
      const bare = list.rows.filter((g) => !g.photo);
      expect(bare.length).toBeGreaterThan(0);
      for (const g of bare) {
        const sec = section(g.region);
        expect(sec).toContain(`<a href="../atlas/#place=${g.id}&amp;page">`);
        expect(sec.split('<div class="also">')[1], g.id).toContain(link(g.id));
        expect(sec.split('<div class="also">')[0], g.id).not.toContain(link(g.id));
      }
    });
    it('are all named in Also when no photo exists, with no empty tile', () => {
      const none = guideRows({ publicDir: mkdtempSync(join(tmpdir(), 'public-')) });
      expect(none.rows.every((g) => g.photo === null)).toBe(true);
      const html = fillGuideList(guidesHtml, none);
      expect(html).not.toContain('class="sqbox"');
      expect(html).not.toContain('class="credit"');
      for (const g of none.rows) expect(html).toContain(link(g.id));
    });
  });

  it('crops each tile photo square around its focus, writing a style only for an off-centre focus', () => {
    for (const [k, { focus }] of Object.entries(photoCrops)) {
      const tile = out.match(new RegExp(`<img src="[^"]*/${k}\\.webp"[^>]*>`));
      if (!tile) continue;
      if (focus === '50% 50%') expect(tile[0]).not.toContain('object-position');
      else expect(tile[0]).toContain(`style="object-position:${focus}"`);
    }
    expect(out).toContain('style="object-position:');
  });
  // Owner 19 Oct 2026: "We need a check for this structurally". A crop is checked by eye; the hash ties the check to the file that was seen.
  describe('checked square crops (src/home/photoCrops.json)', () => {
    const shown = squarePhotoKeys(list);
    const hashOf = (k: string) => createHash('sha256').update(readFileSync(`public/photos/480/${k}.webp`)).digest('hex').slice(0, 12);
    const fix = (k: string) => `run node Tools/guides/crop_sheet.mjs ${k}, look at the sheet, then add it to src/home/photoCrops.json (see docs/guides.md "Photo crops").`;
    it('has an entry for every photo the Guides page shows', () => {
      expect(shown.length).toBeGreaterThan(0);
      const missing = shown.filter((k) => !photoCrops[k]).map((k) => `Guides page photo ${k} has no checked square crop: ${fix(k)}`);
      expect(missing, missing.join('\n')).toEqual([]);
    });
    it('matches the current file of each checked photo', () => {
      const stale = shown.filter((k) => photoCrops[k] && photoCrops[k].file !== hashOf(k))
        .map((k) => `Guides page photo ${k} changed since its square crop was checked: ${fix(k)}`);
      expect(stale, stale.join('\n')).toEqual([]);
    });
    it('has no entry for a photo that is not shown or not shipped', () => {
      const photos = JSON.parse(readFileSync('data/photos.json', 'utf8')).photos as Record<string, unknown>;
      const extra = Object.keys(photoCrops).filter((k) => !(shown.includes(k) || k === COVER_PHOTO) || !(k in photos))
        .map((k) => `src/home/photoCrops.json has an entry for ${k}, which neither the Guides page nor the atlas cover shows (or data/photos.json lacks): delete the entry.`);
      expect(extra, extra.join('\n')).toEqual([]);
    });
  });

  it('has one always-visible credit line for the page photo set, and never prints text on a photo but the chip', () => {
    expect(count(out, /<p class="credit">Photos /g)).toBe(1);
    // Grouped by licence (owner 22 Oct 2026): the changes said once, each licence once and linked, then its authors, each linked.
    expect(out).toMatch(/<p class="credit">Photos from Wikimedia Commons, cropped and resized\. <a [^>]*>CC BY[^<]*<\/a>: <a [^>]*>[^<]+<\/a>/);
    const credit = out.match(/<p class="credit">[\s\S]*?<\/p>/)![0];
    for (const lic of new Set(squarePhotoKeys(list).map((k) => list.photos[k].licence))) expect(count(credit, new RegExp(`>${lic.replace(/[.]/g, '\\.')}</a>:`, 'g')), lic).toBe(1);
    expect(out).not.toContain('title="');
    // Every shown photo: its author named in the credit, and a link to its own Commons page (licence attribution, #196 review).
    for (const k of squarePhotoKeys(list)) {
      expect(credit, k).toContain(list.photos[k].artist.replace(/^unknown.*/i, 'Wikimedia Commons').replace(/&/g, '&amp;'));
      expect(credit, `${k}: link to its page`).toContain(`href="${list.photos[k].page.replace(/&/g, '&amp;')}"`);
    }
  });
  it('has dropped the showcase, the repeated tours section, the satellite maps and the card summaries', () => {
    for (const gone of ['Showcased guide', 'hero-sat', 'class="sat"', 'Imagery: Esri', 'gcard-c', 'class="lede"', 'Show all guides', 'In short']) expect(out, gone).not.toContain(gone);
    expect(count(out, /id="map-tours"/g)).toBe(1);
  });
});

describe('the Guides page markers', () => {
  it('refuses to build a page without the list markers', () => {
    expect(() => fillGuideList('<main></main>', guideRows())).toThrow(/markers are missing/);
  });
});

describe('the 404 page', () => {
  it('ships a 404 page with the band, the one line and links Home, Atlas, Guides (QA S1)', () => {
    const nf = readFileSync('public/404.html', 'utf8');
    expect(nf).toContain('noindex');
    expect(nf).toContain("This page isn't here.");
    for (const href of ['./', 'atlas/', 'guides/']) expect(nf).toContain(`<a href="${href}">`);
    expect(nf).toContain('class="sitebar"');
  });
});
