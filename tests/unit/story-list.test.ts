import { createHash } from 'node:crypto';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { fillStoryCount, fillStoryList, squareFocus, storyCount, storyRows } from '../../src/home/storyList';

const page = readFileSync('map-tours/index.html', 'utf8');
const home = readFileSync('index.html', 'utf8');

describe('the home story tile', () => {
  it('is filled in with the number of story files', () => {
    expect(fillStoryCount('<dt data-count="stories">2</dt><dt data-count="places">106</dt>', 7)).toBe('<dt data-count="stories">7</dt><dt data-count="places">106</dt>');
    expect(storyCount()).toBeGreaterThan(0);
  });
  it('links to the page, which the top bar and footer link to as well', () => {
    expect(home).toMatch(/data-count="stories">\d+<\/dt><dd><a href="map-tours\/">map tours<\/a>/);
    expect(home.match(/href="map-tours\/"/g)?.length).toBe(3);
  });
  it('counts a new story file with no page edit', () => {
    const dir = mkdtempSync(join(tmpdir(), 'stories-'));
    writeFileSync(join(dir, 'a.json'), '{}');
    writeFileSync(join(dir, 'b.json'), '{}');
    writeFileSync(join(dir, 'notes.txt'), '');
    expect(storyCount(dir)).toBe(2);
  });
});

describe('the Map tours page', () => {
  const list = storyRows();
  const out = fillStoryList(page, list);
  it('has a row per story file, opening the guide with its story', () => {
    expect(list.rows.map((r) => r.id)).toEqual(['priorat', 'rioja']);
    expect(out.match(/<a class="gcard-c"/g)?.length).toBe(storyCount());
    expect(out).toContain('href="../atlas/#place=rioja&amp;page&amp;story"');
    expect(out).toContain('href="../atlas/#place=priorat&amp;page&amp;story"');
  });
  it('shows a square-cropped photo, the guide name and one sentence of lede', () => {
    for (const r of list.rows) {
      expect(out).toContain(`/${r.photo}.webp`);
      expect(out).toContain(`<b>${r.name}</b>`);
      expect(r.lede.split(/(?<=[.!?])\s/).length).toBe(1);
    }
    expect(out).toContain('object-position:40% 50%'); // rioja-2's checked square focus
    expect(out).toContain('object-position:10% 30%'); // priorat-1's
    expect(out).toMatch(/Photos: .*cropped and resized/);
  });
  it('has a checked square crop, still fresh, for every listed photo (square frames, photo hard rule)', () => {
    for (const r of list.rows) {
      const hash = createHash('sha256').update(readFileSync(`public/photos/480/${r.photo}.webp`)).digest('hex').slice(0, 12);
      expect(squareFocus[r.photo]?.file, `${r.photo}: run node Tools/guides/crop_sheet.mjs, then add it to data/story/photo-focus-square.json`).toBe(hash);
      expect(r.focus).toBe(squareFocus[r.photo].focus);
    }
  });
  it('fills the list again to the same result, and refuses a page without markers', () => {
    expect(fillStoryList(out, list)).toBe(out);
    expect(() => fillStoryList('<main></main>', list)).toThrow(/markers are missing/);
  });
  it('adds a row for a new story file', () => {
    const dir = mkdtempSync(join(tmpdir(), 'stories-'));
    const guides = mkdtempSync(join(tmpdir(), 'guides-'));
    for (const f of ['rioja', 'priorat']) {
      writeFileSync(join(dir, `${f}.json`), readFileSync(`content/stories/${f}.json`));
      writeFileSync(join(guides, `${f}.json`), readFileSync(`content/guides/${f}.json`));
    }
    writeFileSync(join(dir, 'ribera-del-duero.json'), JSON.stringify({ id: 'ribera-del-duero', cover: { photo: 'rioja-2' } }));
    writeFileSync(join(guides, 'ribera-del-duero.json'), readFileSync('content/guides/rioja.json'));
    const more = storyRows({ dir, guidesDir: guides });
    expect(more.rows.length).toBe(3);
    expect(fillStoryList(page, more).match(/<a class="gcard-c"/g)?.length).toBe(3);
  });
});
