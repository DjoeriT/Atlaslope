import { copyFileSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { COUNTRIES } from '../../src/countries';
import { COUNTRY_PAGES, countryPageKeys, countryStats, fillCountryPage, fillGuidesIndex, fillHome } from '../../src/home/countryPages';
import { guideRows, storyCount } from '../../src/home/guideCount';

// Option A of mocks/countries-structure.html (owner 22 Oct 2026): country cards on Home, a page per country, Guides as the country index.
const list = guideRows();
const stats = countryStats(list);
const home = fillHome(readFileSync('index.html', 'utf8'), list, storyCount());
const index = fillGuidesIndex(readFileSync('guides/index.html', 'utf8'), list);
const template = readFileSync('country/index.html', 'utf8');
const line = (s: { regions: unknown[]; guides: number }) => `${s.regions.length} ${s.regions.length === 1 ? 'region' : 'regions'} · ${s.guides} ${s.guides === 1 ? 'guide' : 'guides'}`;
const count = (s: string, re: RegExp) => s.match(re)?.length ?? 0;

describe('country structure', () => {
  it('has the three countries, each with config for its card, page and Learn note', () => {
    expect(stats.map((s) => s.id)).toEqual(['spain', 'portugal', 'france']);
    for (const s of stats) {
      expect(COUNTRIES[s.id].code).toBe(s.code);
      if (s.id === 'france') continue; // its photos and guides land with the pilot's guides (#149)
      expect(COUNTRY_PAGES[s.id].cardPhotos).toHaveLength(5);
      expect(s.guides).toBeGreaterThan(0);
    }
  });
  it('builds a page per country from one template, so a third country is config', () => {
    const config = readFileSync('vite.config.ts', 'utf8');
    expect(config).toContain("country: 'country/index.html'");
    expect(config).toMatch(/for \(const c of Object\.values\(COUNTRIES\)\)/);
    for (const s of stats) expect(fillCountryPage(template, list, s.id)).toContain(`<title>${s.name} · AtlaSlope</title>`);
  });
});

describe('Home: two equal country cards', () => {
  it('has one card per country, same photo block and button, counts from the data', () => {
    expect(count(home, /<div class="cc">/g)).toBe(stats.length);
    for (const s of stats) {
      const card = home.split('<div class="cc">').find((c) => c.includes(`<h3>${s.name}</h3>`))!.split('</div><div class="cc">')[0];
      expect(card).toContain(`<p class="cnt">${line(s)}</p>`);
      expect(card).toContain(`<a class="btn a" href="${s.code}/">Open ${s.name}</a>`);
      const photos = COUNTRY_PAGES[s.id].cardPhotos.length ? 1 : 0; // France has none yet: no mosaic, no broken tiles
      expect(count(card, /<span class="sqbox/g)).toBe(5 * photos);
      expect(count(card, /<span class="sqbox big">/g)).toBe(photos);
    }
  });
  it('counts the places of all countries', () => {
    const total = stats.reduce((n, s) => n + s.guides, 0);
    expect(home).toContain(`<dt data-count="places">${total}</dt>`);
    expect(home).toContain(`<span data-count="guides">${total}</span>`);
  });
  it('keeps the headline, drops the Spain-only line, and has one credit line', () => {
    expect(home).toContain('<h1>Know the land behind the glass.</h1>');
    expect(home).not.toContain('Live now. More countries coming soon.');
    expect(count(home, /<p class="credit">Photos from Wikimedia Commons/g)).toBe(1);
  });
});

describe('Guides: the country index', () => {
  it('keeps the map-tour band and shows one block per country with region links and an Open button', () => {
    expect(index).toContain('id="map-tours"');
    for (const s of stats) {
      expect(index).toContain(`<a class="btn a" href="../${s.code}/">Open ${s.name}</a>`);
      expect(index.includes(`href="../${s.code}/?tours"`), s.id).toBe(s.tours > 0); // the filter line only where the country has tours
      expect(index).toContain(line(s));
      for (const r of s.regions) expect(index, r.id).toContain(`<a href="../${s.code}/#r-${r.id}">${r.name}</a>`);
    }
  });
  it('has no second long list of guides', () => {
    expect(index).not.toContain('class="ecards"');
    expect(index).not.toContain('class="region"');
  });
});

describe('country pages', () => {
  const pages = Object.fromEntries(stats.map((s) => [s.id, fillCountryPage(template, list, s.id)]));
  it('has the intro, counts, the atlas on that country and the region blocks', () => {
    for (const s of stats) {
      const p = pages[s.id];
      expect(p).toContain(`<h1>${s.name}</h1>`);
      expect(p).toContain(line(s));
      expect(p).toContain(`href="../atlas/#country=${s.id}">See ${s.name} on the atlas</a>`);
      expect(count(p, /<section class="region"/g)).toBe(s.regions.length);
      expect(count(p, /<p class="credit">Photos /g)).toBe(countryPageKeys(list, s.id).length ? 1 : 0);
    }
  });
  it('gives Spain a Learn link and Portugal an honest "not yet"', () => {
    expect(pages.spain).toContain('href="../atlas/#learn">Open Learn</a>');
    expect(pages.portugal).toContain('Not yet for Portugal.');
    expect(pages.portugal).not.toContain('Open Learn');
  });
  it('shows a quiet "Photos soon" tile where a guide has no photo, and a Portuguese guide opens its /pt/ page', () => {
    const bare = list.rows.filter((g) => !g.photo);
    expect(count(pages.spain, /Photos soon/g) + count(pages.portugal, /Photos soon/g) + count(pages.france, /Photos soon/g)).toBe(bare.length);
    expect(pages.portugal).toContain('href="../pt/douro/"');
  });
});

describe('France (pilot, decisions #52-#58)', () => {
  // The pilot's two guides are written apart from this wiring: two stand-ins show what /fr/ draws once they land.
  const dir = mkdtempSync(join(tmpdir(), 'guides-'));
  for (const f of readdirSync('content/guides')) copyFileSync(`content/guides/${f}`, join(dir, f));
  for (const id of ['chablis', 'pauillac']) writeFileSync(join(dir, `${id}.json`), JSON.stringify({ id, minutes: 2 }));
  const withFr = guideRows({ dir });
  const page = fillCountryPage(template, withFr, 'france');
  it('is a country with real place paths and its own WSET course', () => {
    expect(COUNTRIES.france).toMatchObject({ code: 'fr', paths: true });
    expect(COUNTRY_PAGES.france.intro).toBe('From Champagne to the Mediterranean.');
  });
  it('renders /fr/ with 72 place tiles, photos where they have shipped, and an honest Study note', () => {
    expect(count(page, /<a class="ecard"/g)).toBe(72);
    expect(count(page, /Photos soon/g)).toBe(32); // Loire and Rhône batches: photos in the next commits
    expect(page).toContain('href="../fr/chablis/"');
    expect(page).toContain('href="../fr/pauillac/"');
    expect(page).toContain('Not yet for France.');
    expect(page).not.toContain('Open Study');
    expect(count(page, /<p class="credit">Photos /g)).toBe(1);
    expect(page).toContain('<h2 id="r-fr-burgundy">Burgundy</h2>');
    expect(page).toContain('<h2 id="r-fr-bordeaux">Bordeaux</h2>');
    expect(page).toContain('<h2 id="r-fr-loire">Loire</h2>');
  });
});
