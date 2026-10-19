import { readFileSync } from 'node:fs';
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
  it('lists every guide file, filled in at build time', () => {
    const list = guideRows();
    expect(list.rows).toHaveLength(guideCount());
    const out = fillGuideList(guidesHtml, list);
    for (const r of list.rows) expect(out).toContain(`href="../atlas/#place=${r.id}&amp;page"`);
    expect(out).toContain(`Terroir written for ${guideCount()} of ${tree.places.length} places`);
  });
  it('puts zones after their place, in course order', () => {
    const ids = guideRows().rows.map((r) => r.id);
    expect(ids.indexOf('rioja-alta')).toBe(ids.indexOf('rioja') + 1);
  });
});
