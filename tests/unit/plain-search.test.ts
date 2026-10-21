import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { plainSearch } from '../../src/home/plainSearch';
import { searchIndex } from '../../src/home/searchIndex';
import { strings } from '../../src/strings';
import { loadTree } from '../../src/tree';

// Search in the plain pages' bar (owner, 21 Oct 2026): the atlas's matching over a small index, a pick opens the atlas.
const index = searchIndex();
const find = plainSearch(index, 'atlas/');

describe('plain-page search', () => {
  it('finds Rioja and links to the atlas place', () => {
    const hit = find('rioja')[0];
    expect(hit.crumb.name).toBe('Rioja');
    expect(hit.href).toBe('atlas/#place=rioja');
  });
  it('links with the path of the page (sub-pages go up one level)', () => {
    expect(plainSearch(index, '../atlas/')('rioja')[0].href).toBe('../atlas/#place=rioja');
  });
  it('matches by name like the atlas does: case and accents folded', () => {
    const tree = loadTree(JSON.parse(readFileSync('data/places.json', 'utf8')));
    for (const q of ['RIBERA', 'ribéra', 'toro', 'rias']) {
      const names = (ids: Array<{ id: string; matchedGrape?: string }>) => ids.filter((c) => !c.matchedGrape).map((c) => c.id); // the tree here has no grapes, the index has
      expect(names(find(q).map((h) => h.crumb)), q).toEqual(names(tree.search(q, 8)));
    }
    expect(find('zzzz')).toEqual([]);
  });
  it('opens a region as #region= and a place as #place=', () => {
    const hits = find('a');
    expect(hits.length).toBeGreaterThan(0);
    for (const h of hits) {
      const region = index.some((e) => e.rank === 0 && e.hit.id === h.crumb.id) && !index.some((e) => e.rank !== 0 && e.hit.id === h.crumb.id);
      expect(h.href).toBe(`atlas/#${region ? 'region' : 'place'}=${h.crumb.id}`);
    }
  });
  it('ships names, grapes and ids only, a small index', () => {
    expect(JSON.stringify(index).length).toBeLessThan(60_000);
    for (const e of index) expect(Object.keys(e).every((k) => ['hit', 'names', 'grapes', 'rank', 'order'].includes(k))).toBe(true);
  });
});

describe('the field in the HTML', () => {
  it.each(['index.html', 'guides/index.html', 'about/index.html', 'map-tours/index.html'])('%s has the atlas search field, same words', (file) => {
    const html = readFileSync(file, 'utf8');
    expect(html).toContain(`placeholder="${strings.topBar.searchPlaceholder}"`);
    expect(html).toContain(`aria-label="${strings.topBar.searchLabel}"`);
    expect(html).toContain(`data-none="${strings.search.none}"`);
    expect(html).toContain(`data-atlas="${file === 'index.html' ? '' : '../'}atlas/"`);
  });
});
