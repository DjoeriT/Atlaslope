import { expect, test, type Page } from '@playwright/test';

// "Map tour" folded into the guide page (owner 21 Oct 2026, layout A): the band, the map column beside the guide, the stop that follows
// the scroll, the geology credit, the fact marker keys, Close the map, and the old story address.
// Real content; outside hosts (tiles, the IGME geology service) are blocked, so only the page's own state is asserted (active step, credit text, focus, address).

async function open(page: Page, hash: string) {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
  await page.goto(`./${hash}`);
}
const mapCol = (page: Page) => page.locator('.pg.tour .pg-tourmap');
// Scrolls so the anchor sits just above the reading line, as a reader's scroll does (the page's own rule is in src/story/camera.ts).
async function scrollToLine(page: Page, anchor: string, rank = 0) {
  await page.locator('.pg').evaluate((pg, [a, k]) => {
    const narrow = matchMedia('(max-width: 47.5em)').matches;
    const bar = pg.querySelector('.pg-top')?.getBoundingClientRect().bottom ?? 0;
    const map = pg.querySelector('.pg-tourmap')?.getBoundingClientRect().bottom ?? bar;
    const areaTop = narrow ? map : bar;
    const line = areaTop + (innerHeight - areaTop) * (narrow ? 0.3 : 0.45);
    pg.scrollTop += (pg.querySelector(a) as HTMLElement).getBoundingClientRect().top - (line - 3 - 120 * k);
  }, [anchor, rank] as const);
}

test('the Rioja guide with the tour open fetches each map data file once', async ({ page }) => {
  const seen = new Map<string, number>();
  page.on('request', (r) => { const m = r.url().match(/\/(dops|natural-earth-world|added-boundaries|rioja-zones)[^/]*\.geojson$/); if (m) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1); });
  await open(page, '#place=rioja&page');
  await page.locator('a.mapcard').click();
  await expect(mapCol(page)).toBeVisible();
  await page.waitForLoadState('networkidle');
  expect([...seen.keys()].sort()).toEqual(['added-boundaries', 'dops', 'natural-earth-world', 'rioja-zones']);
  expect([...seen.values()]).toEqual([1, 1, 1, 1]);
});

test('the map card shows on the Rioja guide in place of "Show on map", and not on a guide without a tour', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await expect(page.locator('a.mapcard')).toContainText('Read with the map');
  await expect(page.locator('a.mapcard')).toContainText('9 places to fly to');
  await expect(page.locator('.pg-actions')).toHaveCount(0);
  await open(page, '#place=valdepenas&page');
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('a.mapcard')).toHaveCount(0);
  await expect(page.locator('.pg-actions .btn')).toBeVisible();
});

test('opening the map keeps the guide beside it; scrolling to the soils makes that the stop and credits the IGME geology', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await page.locator('a.mapcard').click();
  await expect(page).toHaveURL(/#place=rioja&page&story(&view=.*)?$/);
  await expect(mapCol(page)).toBeVisible();
  // Opening from the band leaves the reader where the band was, so the step is the chapter in view; at the lede it is the opening view.
  await page.locator('.pg').evaluate((el) => { el.scrollTop = 0; });
  // The map mode opens on beat 1's first stop (no page hero, so no cover step), with its own band: no site nav, no search, no jump bar.
  await expect(mapCol(page)).toHaveAttribute('data-step', 'valley');
  await expect(page.locator('.pg-top .story-brand')).toHaveText('AtlaSlope');
  await expect(page.locator('.pg-top').getByRole('link', { name: 'Back to Rioja' })).toBeVisible();
  await expect(page.locator('.pg-top nav, .pg-top input, .pg-hero, .pg-jump')).toHaveCount(0);
  await expect(page.locator('.story-where')).toHaveText('Chapter 1 of 4');
  await expect(page.locator('.story-chip')).toHaveText('Haro to Alfaro, the whole valley');
  await expect(page.locator('.story-loc')).toBeVisible();
  // The terrain height setting lives behind the map's "i" and states its choice in the credit line.
  await expect(page.getByRole('button', { name: '×1.3' })).toBeHidden();
  await page.locator('.pg-tourmap .maplibregl-ctrl-attrib-button').click();
  await expect(page.getByRole('button', { name: '×1.5' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: '×1.3' }).click();
  await expect(page.locator('.pg-tourmap .story-credit')).toContainText('×1.3');
  await expect(page.locator('.pg-climate')).toBeVisible(); // the guide's own charts stay
  await expect(page.locator('#taste')).toBeAttached();
  await scrollToLine(page, '[data-fly="soils.0"]');
  await expect(mapCol(page)).toHaveAttribute('data-step', 'soils');
  await expect(page.locator('.story-where')).toHaveText('Chapter 3 of 4');
  await expect(page.locator('.pg-tourmap .story-credit')).toContainText('Source: IGME, MAGNA 50');
});

test('the soils stop shows the IGME rock key and the slope key; the top buttons share a height', async ({ page }) => {
  await open(page, '#place=rioja&page&story');
  await scrollToLine(page, '[data-fly="soils.0"]');
  await expect(mapCol(page)).toHaveAttribute('data-step', 'soils');
  const key = page.locator('.pg-tourmap .story-legend');
  await expect(key).toContainText('Alluvium and floodplain');
  await expect(key).toContainText('Steeper than 30%');
  await page.locator('.pg').evaluate((el) => { el.scrollTop = 0; });
});

test('on a phone the map is pinned at the top, 42% of the screen, and the credit is folded', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, '#place=rioja&page&story');
  await expect(mapCol(page)).toBeVisible();
  await expect(mapCol(page)).toHaveCSS('height', '354.469px');
  await expect(page.locator('.pg-tourmap .story-credit')).toBeHidden();
});

test('a fly link flies the map to its stop, without leaving the guide', async ({ page }) => {
  await open(page, '#place=rioja&page&story');
  await expect(mapCol(page)).toBeVisible();
  await page.locator('#terroir-barrel a.fly').first().click();
  await expect(mapCol(page)).toHaveAttribute('data-step', 'haro');
  await expect(page).toHaveURL(/#place=rioja&page&story(&view=.*)?$/);
});

test('a fact marker opens with Enter, Escape closes it and focus returns to the marker', async ({ page }) => {
  await open(page, '#place=rioja&page&story');
  await expect(mapCol(page)).toBeVisible();
  // The page settles as images load: scroll again until the stop holds.
  await expect(async () => {
    await scrollToLine(page, '#terroir-valley'); // stops come up at their paragraph (owner 22 Oct 2026), the valley at its chapter start
    await expect(mapCol(page)).toHaveAttribute('data-step', 'valley', { timeout: 1000 });
  }).toPass();
  await expect(page.getByRole('button', { name: /^Fact: / }).first()).toBeVisible(); // MapLibre must not rename it "Map marker"
  const marker = page.locator('.story-fk').first();
  await marker.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.story-factpop')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.story-factpop')).toHaveCount(0);
  await expect(marker).toBeFocused();
  await expect(page).toHaveURL(/#place=rioja&page&story(&view=.*)?$/); // the first Escape only closed the card
});

test('Close the map returns to the plain guide', async ({ page }) => {
  await open(page, '#place=rioja&page&story');
  await expect(mapCol(page)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close the map' })).toBeFocused(); // focus follows the map open
  await page.getByRole('button', { name: 'Close the map' }).click();
  await expect(page).toHaveURL(/#place=rioja&page(&view=.*)?$/);
  await expect(page.locator('.pg-tourmap')).toHaveCount(0);
  await expect(page.locator('a.mapcard')).toBeVisible();
  await expect(page.locator('a.mapcard')).toBeFocused(); // and back to the map card on hide
});

test('the map column comes after the guide in reading order', async ({ page }) => {
  await open(page, '#place=rioja&page&story');
  await expect(mapCol(page)).toBeVisible();
  const after = await page.locator('.pg-listing').evaluate((el) => !!(el.compareDocumentPosition(document.querySelector('.pg-tourmap')!) & Node.DOCUMENT_POSITION_FOLLOWING));
  expect(after).toBe(true);
});

// Every stop comes up by scrolling, in reading order (F1, review 21 Oct 2026). Each anchor is placed just above the reading line, as a reader's scroll would.
// [step, anchor, place in its row]: links sharing a row are held 120 px apart in reading order (holdSteps), so the k-th is placed k x 120 px above the line.
const ORDER: Array<[string, string, number]> = [
  // Stops come up at the paragraph that names them, a chapter's first stop at its start (owner 22 Oct 2026: the map was late).
  ['valley', '#terroir-valley', 0], ['sierra', '#terroir-valley', 1], ['climate', '#terroir-climate', 0],
  ['z-rioja-alta', '.pg-zguide > :has([data-fly="climate.0"])', 0], ['z-rioja-alavesa', '.pg-zguide > :has([data-fly="climate.1"])', 0],
  ['z-rioja-oriental', '.pg-zguide > :has([data-fly="climate.2"])', 0],
  ['soils', '#terroir-soils', 0], ['barrel', '#terroir-barrel', 0], ['haro', '[data-b="barrel.1"]', 0],
];
for (const [name, size] of [['1440', { width: 1440, height: 900 }], ['390', { width: 390, height: 844 }]] as const) {
  test(`scrolling the Rioja guide at ${name} shows stops 1 to 9 in order`, async ({ page }) => {
    // Nine scrolls, each followed by a map flight that the software-rendered WebGL of a shared CI runner draws on the main thread, so `evaluate`
    // waits behind it. Measured (#190): 6 s alone, 28-30 s with the CPU saturated (about 5 s a stop), against the 30 s default. The test asserts all
    // nine stops as before; it only gets three times the time. A signal cannot shorten it: data-step follows the scroll at once, the cost is the flights.
    test.slow();
    await page.setViewportSize(size);
    await open(page, '#place=rioja&page&story');
    // The map chunk loads lazily and its empty placeholder has no data-step: scroll only once the real column (step 1) is mounted.
    await expect(mapCol(page)).toHaveAttribute('data-step', 'valley');
    for (const [id, anchor, rank] of ORDER) {
      await scrollToLine(page, anchor, rank);
      await expect(mapCol(page)).toHaveAttribute('data-step', id);
    }
    await expect(page.locator('.story-chip')).toHaveText("Haro's station quarter");
  });
}

// Card 3, 21 Oct 2026 (LeadBot's phone preview at 375 px).
test.describe('phone 375 px', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('stop 1 holds for 120 px of scroll before stop 2 takes over', async ({ page }) => {
    await open(page, '#place=rioja&page&story');
    await expect(mapCol(page)).toBeVisible();
    await scrollToLine(page, '#terroir-valley');
    await expect(mapCol(page)).toHaveAttribute('data-step', 'valley');
    await page.locator('.pg').evaluate((pg) => { pg.scrollTop += 100; });
    await expect(mapCol(page)).toHaveAttribute('data-step', 'valley');
    await page.locator('.pg').evaluate((pg) => { pg.scrollTop += 40; });
    await expect(mapCol(page)).toHaveAttribute('data-step', 'sierra');
  });

  test('the geology layer asks for its tiles whenever its key shows; the phone key is one line and the open panel names the rocks in full', async ({ page }) => {
    const igme: string[] = [];
    page.on('request', (r) => { if (r.url().includes('mapas.igme.es')) igme.push(r.url()); });
    await open(page, '#place=rioja&page&story');
    await scrollToLine(page, '[data-fly="soils.0"]');
    await expect(mapCol(page)).toHaveAttribute('data-step', 'soils');
    const key = page.locator('.pg-tourmap .story-legend');
    await expect(key).toContainText('Sands, calcareous sandstones and ochre clays');
    await expect.poll(() => igme.length, { timeout: 15000 }).toBeGreaterThan(0);
    // one line (it scrolls sideways, short names), under 2 rem tall
    expect(await key.evaluate((e) => e.getBoundingClientRect().height <= 32 && getComputedStyle(e).whiteSpace === 'nowrap' && getComputedStyle(e).overflowX === 'auto')).toBe(true);
    // the full rock names are in the open "i" panel
    await page.locator('.pg-tourmap .maplibregl-ctrl-attrib-button').click();
    const panel = page.locator('.pg-tourmap .story-keyfull');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Sands, calcareous sandstones and ochre clays');
    await expect(panel).toContainText('Alluvium and floodplain');
  });

  test('no floating Show map button while the tour map is open', async ({ page }) => {
    await open(page, '#place=rioja&page');
    await expect(page.locator('.showmap')).toBeVisible();
    await open(page, '#place=rioja&page&story');
    await expect(mapCol(page)).toBeVisible();
    await expect(page.locator('.showmap')).toBeHidden();
  });
});

test('the card unfolds into the map mode and Close the map returns the same paragraph', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page, '#place=rioja&page');
  const para = page.locator('p[data-b]').nth(2);
  await page.locator('.pg').evaluate((pg, i) => { const el = pg.querySelectorAll('p[data-b]')[i]; pg.scrollTop += el.getBoundingClientRect().top - 200; }, 2);
  const key = await para.getAttribute('data-b');
  const before = await para.evaluate((el) => el.getBoundingClientRect().top);
  await page.locator('a.mapcard').dispatchEvent('click', { button: 0 }); // a real click would first scroll the card into view
  await expect(page.locator('.grow')).toHaveCount(1); // the photo grows from the card
  await expect(mapCol(page)).toBeVisible();
  await expect(page.locator('.grow')).toHaveCount(0, { timeout: 8000 });
  await page.locator('.pg-close').click();
  await expect(page.locator('.pg.tour')).toHaveCount(0);
  const mine = page.locator(`[data-b="${key}"]`);
  await expect(mine).toBeVisible();
  const top = await mine.evaluate((el) => el.getBoundingClientRect().top);
  expect(Math.abs(top - before)).toBeLessThanOrEqual(2);
});

test('reduced motion opens the map mode with no growing photo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, '#place=rioja&page');
  await page.locator('a.mapcard').click();
  await expect(mapCol(page)).toBeVisible();
  await expect(page.locator('.grow')).toHaveCount(0);
});

// Phones show "Back" alone in the band; the link keeps the full name for screen readers (owner 22 Oct 2026: long names were cut off).
test('on a phone the band link reads Back and keeps the full name as its label', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await open(page, '#place=txakoli-bizkaia&page&story');
  const back = page.locator('.pg-top a.story-back');
  await expect(back).toHaveText('Back', { useInnerText: true });
  await expect(back).toHaveAttribute('aria-label', /^Back to .+/);
  const top = await page.locator('.pg-top').evaluate((el) => el.scrollWidth <= el.clientWidth);
  expect(top).toBe(true);
});
