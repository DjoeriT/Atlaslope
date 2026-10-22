import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadTree } from '../../src/tree';
import { fillGuideCount, fillGuideList, guideCount, guideRows, photoCrops, placeGuideCount, squarePhotoKeys } from '../../src/home/guideCount';

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

describe('the Guides page', () => {
  const guidesHtml = readFileSync('guides/index.html', 'utf8');
  const link = (id: string) => `href="../atlas/#place=${id}&amp;page"`;
  it('lists every guide file, filled in at build time', () => {
    const list = guideRows();
    expect(list.rows).toHaveLength(guideCount());
    const out = fillGuideList(guidesHtml, list);
    for (const r of list.regions.flatMap((g) => g.guides.slice(0, 6))) expect(out).toContain(link(r.id));
  });
  it('shows at most 6 guides per region, then "All <Region> guides" only for regions with more', () => {
    const { regions } = guideRows();
    const out = fillGuideList(guidesHtml, guideRows());
    for (const r of regions) {
      const sec = out.split('<section class="region"').find((x) => x.includes(`id="r-${r.id}"`))!;
      expect(sec.match(/class="gcard-c"/g)?.length ?? 0).toBe(Math.min(6, r.guides.length));
      const more = `<a href="../atlas/#region=${r.id}&amp;page">All ${r.name} guides</a>`;
      expect(sec.includes(more), r.id).toBe(r.guides.length > 6);
    }
    expect(regions.some((r) => r.guides.length > 6)).toBe(true);
  });
  it('has a jump row with one link per region, to its section', () => {
    const { regions } = guideRows();
    const out = fillGuideList(guidesHtml, guideRows());
    const nav = out.match(/<nav class="jump"[^>]*>(.*?)<\/nav>/)![1];
    expect([...nav.matchAll(/<a href="(#r-[^"]+)"/g)].map((m) => m[1])).toEqual(regions.map((r) => `#r-${r.id}`));
    for (const r of regions) expect(out).toContain(`<h2 id="r-${r.id}">`);
  });
  it('shows Rioja as the showcased guide over the home hero satellite view', () => {
    const list = guideRows();
    expect(list.featured?.hero).toBe(true);
    const out = fillGuideList(guidesHtml, list);
    expect(out).toContain('<span class="show">Showcased guide</span>');
    expect(out).toContain('<figure class="hero-sat"><img src="../home/hero.webp"');
    expect(out).not.toContain('class="mosaic"');
  });
  it('points every photo at a file that exists (release 47: Binissalem has no 800 px copy)', () => {
    const out = fillGuideList(guidesHtml, guideRows());
    const files = [...out.matchAll(/\.\.\/(photos\/[^"\s]+\.webp)/g)].map((m) => m[1]);
    expect(files.length).toBeGreaterThan(0);
    for (const f of new Set(files)) expect(existsSync(`public/${f}`), f).toBe(true);
  });
  it('puts zones after their place, in course order', () => {
    const ids = guideRows().rows.map((r) => r.id);
    expect(ids.indexOf('rioja-alta')).toBe(ids.indexOf('rioja') + 1);
  });
  it('groups guides by study region, in course order, with the lede from the guide file', () => {
    const { regions, rows } = guideRows();
    expect(regions.flatMap((r) => r.guides)).toEqual(rows);
    expect(regions.map((r) => r.id).slice(0, 2)).toEqual(['green-spain', 'castilla-y-leon']);
    for (const r of regions) for (const g of r.guides) expect(g.region).toBe(r.id);
    const rioja = JSON.parse(readFileSync('content/guides/rioja.json', 'utf8'));
    expect(rows.find((g) => g.id === 'rioja')?.lede).toBe(rioja.lede.text);
  });
  it('shows a new guide in its region with no extra step', () => {
    const dir = mkdtempSync(join(tmpdir(), 'guides-'));
    for (const f of readdirSync('content/guides').filter((f) => f !== 'toro.json')) copyFileSync(`content/guides/${f}`, `${dir}/${f}`);
    const before = guideRows({ dir });
    expect(before.rows.map((r) => r.id)).not.toContain('toro');
    copyFileSync('content/guides/toro.json', `${dir}/toro.json`);
    const after = guideRows({ dir });
    const group = after.regions.find((r) => r.guides.some((g) => g.id === 'toro'));
    expect(group?.id).toBe('castilla-y-leon');
    expect(after.regions.find((r) => r.id === 'castilla-y-leon')!.guides.map((g) => g.id)).toContain('toro');
    expect(fillGuideList(guidesHtml, before)).not.toContain(link('toro'));
  });
  it('features Rioja with three photos, its In short and one credit line', () => {
    const list = guideRows();
    expect(list.featured?.row.id).toBe('rioja');
    expect(list.featured?.photos).toEqual(['rioja-1', 'rioja-2', 'rioja-3']);
    expect(list.featured?.facts.map((f) => f.key)).toEqual(['Grapes', 'Climate', 'Soil']);
    const out = fillGuideList(guidesHtml, list);
    expect(out).toContain('<h3>In short</h3>');
    expect(out).toMatch(/<p class="credit">Photos: <a [^>]*>[^<]+<\/a> · <a [^>]*>CC BY[^<]*<\/a> · cropped and resized/);
  });
  it('crops each card photo square around its focus, writing a style only for an off-centre focus', () => {
    const out = fillGuideList(guidesHtml, guideRows());
    for (const [k, { focus }] of Object.entries(photoCrops)) {
      const card = out.match(new RegExp(`<a class="gcard-c"[^>]*><span class="ct"><img src="[^"]*/${k}\\.webp"[^>]*>`));
      if (!card) continue;
      if (focus === '50% 50%') expect(card[0]).not.toContain('object-position');
      else expect(card[0]).toContain(`style="object-position:${focus}"`);
    }
    expect(out).toContain('style="object-position:');
  });
  // Owner 19 Oct 2026: "We need a check for this structurally". A crop is checked by eye; the hash ties the check to the file that was seen.
  describe('checked square crops (src/home/photoCrops.json)', () => {
    const shown = squarePhotoKeys(guideRows());
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
      const extra = Object.keys(photoCrops).filter((k) => !shown.includes(k) || !(k in photos))
        .map((k) => `src/home/photoCrops.json has an entry for ${k}, which the Guides page does not show (or data/photos.json lacks): delete the entry.`);
      expect(extra, extra.join('\n')).toEqual([]);
    });
  });
  it('gives a guide with no photo a typographic card, and a region with no tile no tile', () => {
    const empty = mkdtempSync(join(tmpdir(), 'public-'));
    const list = guideRows({ publicDir: empty });
    expect(list.rows.every((g) => g.photo === null)).toBe(true);
    expect(list.regions.every((r) => r.tile === null)).toBe(true);
    expect(list.featured?.photos).toEqual([]);
    const out = fillGuideList(guidesHtml, list);
    expect(out).toContain('class="ct typo"');
    expect(out.match(/class="ct typo"[^>]*><span class="kick"/)).toBeNull();
    expect(out).not.toContain('class="sat"');
    expect(out).not.toContain('Imagery: Esri');
    for (const r of list.regions.flatMap((g) => g.guides.slice(0, 6))) expect(out).toContain(link(r.id));
  });
  it('shows the satellite tile and its credit only for regions that have one', () => {
    const { regions } = guideRows();
    for (const r of regions) expect(r.tile).toBe(existsSync(`public/guides/${r.id}.webp`) ? `${r.id}.webp` : null);
    expect(regions.find((r) => r.id === 'rioja')?.tile).toBe('rioja.webp');
    const out = fillGuideList(guidesHtml, guideRows());
    expect(out.match(/<figure class="sat">/g)).toHaveLength(regions.filter((r) => r.tile).length);
    // plus one for the featured guide's satellite view (the home hero image)
    expect(out.match(/Imagery: Esri, Vantor · Spain: PNOA © IGN/g)).toHaveLength(regions.filter((r) => r.tile).length + 1);
  });
  it('gives every region with guides its satellite tile, so a new region cannot ship without one', () => {
    // Cataluña went live in release 43 with no tile; the tiles are rendered by Tools/guides/region_tile.mjs.
    const missing = guideRows().regions.filter((r) => r.guides.length && !r.tile).map((r) => r.id);
    expect(missing, 'run Tools/guides/region_tile.mjs for these regions').toEqual([]);
  });
  it('credits each photo set, never prints text on a photo', () => {
    const out = fillGuideList(guidesHtml, guideRows());
    expect(out.match(/<p class="credit">Photos:/g)!.length).toBe(guideRows().regions.length + 1); // + the map-tour section's set
    expect(out).not.toContain('title="');
  });
});

describe('the Guides page markers', () => {
  it('refuses to build a page without the list markers', () => {
    expect(() => fillGuideList('<main></main>', guideRows())).toThrow(/markers are missing/);
  });
});

describe('map tours on the Guides page', () => {
  it('marks guides that have a story file and links to the map-tours section', () => {
    const list = guideRows();
    const guidesHtml = readFileSync('guides/index.html', 'utf8');
    const tours = list.rows.filter((r) => r.tour).map((r) => r.id).sort();
    expect(tours).toEqual(['priorat', 'ribeira-sacra', 'ribera-del-duero', 'rioja', 'txakoli-alava', 'txakoli-bizkaia', 'txakoli-getaria']);
    const html = fillGuideList(guidesHtml, list);
    expect(html).toContain('<a href="#map-tours">Show only guides with a map tour</a>');
    expect(html).toContain('id="map-tours"');
    expect(html).toContain('<p class="showall"><a href="#">Show all guides</a></p>');
    expect(html.match(/class="tour">Map tour</g)!.length).toBeGreaterThanOrEqual(tours.length);
  });
  it('says "cropped and resized" in the hero card credit (QA S3)', () => {
    expect(html).toMatch(/Card photos:[^<]*(<[^>]+>[^<]*)*cropped and resized<\/figcaption>/);
  });

  it('ships a 404 page with the band, the one line and links Home, Atlas, Guides (QA S1)', () => {
    const nf = readFileSync('public/404.html', 'utf8');
    expect(nf).toContain('noindex');
    expect(nf).toContain("This page isn't here.");
    for (const href of ['./', 'atlas/', 'guides/']) expect(nf).toContain(`<a href="${href}">`);
    expect(nf).toContain('class="sitebar"');
  });
});
