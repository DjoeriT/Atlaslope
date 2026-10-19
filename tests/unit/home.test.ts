import { copyFileSync, existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadTree } from '../../src/tree';
import { fillGuideCount, fillGuideList, guideCount, guideRows } from '../../src/home/guideCount';

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
    for (const r of list.rows) expect(out).toContain(link(r.id));
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
    expect(fillGuideList(guidesHtml, after)).toContain(link('toro'));
    expect(fillGuideList(guidesHtml, before)).not.toContain(link('toro'));
  });
  it('features Rioja with three photos, its In short and one credit line', () => {
    const list = guideRows();
    expect(list.featured?.row.id).toBe('rioja');
    expect(list.featured?.photos).toEqual(['rioja-1', 'rioja-2', 'rioja-3']);
    expect(list.featured?.facts.map((f) => f.key)).toEqual(['Grapes', 'Climate', 'Soil']);
    const out = fillGuideList(guidesHtml, list);
    expect(out).toContain('<h3>In short</h3>');
    expect(out).toMatch(/<p class="credit">Photos: <a [^>]*>[^<]+<\/a> · <a [^>]*>CC BY[^<]*<\/a> · resized/);
  });
  it('gives a guide with no photo a typographic card, and a region with no tile no tile', () => {
    const empty = mkdtempSync(join(tmpdir(), 'public-'));
    const list = guideRows({ publicDir: empty });
    expect(list.rows.every((g) => g.photo === null)).toBe(true);
    expect(list.regions.every((r) => r.tile === null)).toBe(true);
    expect(list.featured?.photos).toEqual([]);
    const out = fillGuideList(guidesHtml, list);
    expect(out).toContain('class="ct typo"');
    expect(out).not.toContain('class="sat"');
    expect(out).not.toContain('Imagery: Esri');
    for (const r of list.rows) expect(out).toContain(link(r.id));
  });
  it('shows the satellite tile and its credit only for regions that have one', () => {
    const { regions } = guideRows();
    for (const r of regions) expect(r.tile).toBe(existsSync(`public/guides/${r.id}.webp`) ? `${r.id}.webp` : null);
    expect(regions.find((r) => r.id === 'rioja')?.tile).toBe('rioja.webp');
    const out = fillGuideList(guidesHtml, guideRows());
    expect(out.match(/<figure class="sat">/g)).toHaveLength(regions.filter((r) => r.tile).length);
    expect(out.match(/Imagery: Esri, Maxar · Spain: PNOA © IGN/g)).toHaveLength(regions.filter((r) => r.tile).length);
  });
  it('gives every region with guides its satellite tile, so a new region cannot ship without one', () => {
    // Cataluña went live in release 43 with no tile; the tiles are rendered by Tools/guides/region_tile.mjs.
    const missing = guideRows().regions.filter((r) => r.guides.length && !r.tile).map((r) => r.id);
    expect(missing, 'run Tools/guides/region_tile.mjs for these regions').toEqual([]);
  });
  it('credits each photo set, never prints text on a photo', () => {
    const out = fillGuideList(guidesHtml, guideRows());
    expect(out.match(/<p class="credit">Photos:/g)!.length).toBeGreaterThan(guideRows().regions.length);
    expect(out).not.toContain('title="');
  });
});

describe('the Guides page markers', () => {
  it('refuses to build a page without the list markers', () => {
    expect(() => fillGuideList('<main></main>', guideRows())).toThrow(/markers are missing/);
  });
});
