import { expect, test, type Page } from '@playwright/test';

// "Map tour" folded into the guide page (owner 21 Oct 2026, layout A): the band, the map column beside the guide, the stop that follows
// the scroll, the geology credit, the fact marker keys, Hide map, and the old story address.
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

test('the band shows on the Rioja guide in place of "Show on map", and not on a guide without a tour', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await expect(page.locator('.pg-tour')).toContainText('Map tour · 9 places to fly to');
  await expect(page.locator('a.story-open')).toHaveText('Open the map');
  await expect(page.locator('.pg-actions')).toHaveCount(0);
  await open(page, '#place=valdepenas&page');
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('a.story-open')).toHaveCount(0);
  await expect(page.locator('.pg-actions .btn')).toBeVisible();
});

test('opening the map keeps the guide beside it; scrolling to the soils makes that the stop and credits the IGME geology', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await page.locator('a.story-open').click();
  await expect(page).toHaveURL(/#place=rioja&page&story(&view=.*)?$/);
  await expect(mapCol(page)).toBeVisible();
  // Opening from the band leaves the reader where the band was, so the step is the chapter in view; at the lede it is the opening view.
  await page.locator('.pg').evaluate((el) => { el.scrollTop = 0; });
  await expect(mapCol(page)).toHaveAttribute('data-step', 'intro');
  await expect(page.locator('.pg-climate')).toBeVisible(); // the guide's own charts stay
  await expect(page.locator('#taste')).toBeAttached();
  await scrollToLine(page, '[data-fly="soils.0"]');
  await expect(mapCol(page)).toHaveAttribute('data-step', 'soils');
  await expect(page.locator('.pg-tourcap')).toContainText('Stop 7 of 9');
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

test('the top Map tour link matches Show map in height', async ({ page }) => {
  await open(page, '#place=rioja&page');
  const a = await page.locator('.pg > .pg-back').first().boundingBox();
  const b = await page.locator('.pg-tourjump').boundingBox();
  expect(a && b && Math.abs(a.height - b.height) < 1 && Math.abs(a.y - b.y) < 1).toBe(true);
});

test('on a phone the map strip is 300 px and the credit is folded', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, '#place=rioja&page&story');
  await expect(mapCol(page)).toBeVisible();
  await expect(mapCol(page)).toHaveCSS('height', '300px');
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
    await scrollToLine(page, '[data-fly="valley.0"]');
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

test('Hide map returns to the plain guide', async ({ page }) => {
  await open(page, '#place=rioja&page&story');
  await expect(mapCol(page)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Hide map' })).toBeFocused(); // focus follows the map open
  await page.getByRole('button', { name: 'Hide map' }).click();
  await expect(page).toHaveURL(/#place=rioja&page(&view=.*)?$/);
  await expect(page.locator('.pg-tourmap')).toHaveCount(0);
  await expect(page.locator('a.story-open')).toBeVisible();
  await expect(page.locator('a.story-open')).toBeFocused(); // and back to "Open the map" on hide
});

test('the map column comes after the guide in reading order, and the band still is out of reach of keyboard and screen readers', async ({ page }) => {
  await open(page, '#place=rioja&page&story');
  await expect(mapCol(page)).toBeVisible();
  const after = await page.locator('.pg-listing').evaluate((el) => !!(el.compareDocumentPosition(document.querySelector('.pg-tourmap')!) & Node.DOCUMENT_POSITION_FOLLOWING));
  expect(after).toBe(true);
  await open(page, '#place=rioja&page');
  await expect(page.locator('.pg-tour-still')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.pg-tour-still')).toHaveAttribute('inert', '');
});

// Every stop comes up by scrolling, in reading order (F1, review 21 Oct 2026). Each anchor is placed just above the reading line, as a reader's scroll would.
// [step, anchor, place in its row]: links sharing a row are held 120 px apart in reading order (holdSteps), so the k-th is placed k x 120 px above the line.
const ORDER: Array<[string, string, number]> = [
  ['intro', '.pg-spine', 0], ['valley', '[data-fly="valley.0"]', 0], ['sierra', '[data-fly="valley.1"]', 1], ['climate', '#terroir-climate', 0],
  ['z-rioja-alta', '[data-fly="climate.0"]', 0], ['z-rioja-alavesa', '[data-fly="climate.1"]', 1], ['z-rioja-oriental', '[data-fly="climate.2"]', 2],
  ['soils', '[data-fly="soils.0"]', 0], ['barrel', '#terroir-barrel', 0], ['haro', '[data-fly="barrel.0"]', 0],
];
for (const [name, size] of [['1440', { width: 1440, height: 900 }], ['390', { width: 390, height: 844 }]] as const) {
  test(`scrolling the Rioja guide at ${name} shows stops 1 to 9 in order`, async ({ page }) => {
    await page.setViewportSize(size);
    await open(page, '#place=rioja&page&story');
    await expect(mapCol(page)).toBeVisible();
    for (const [id, anchor, rank] of ORDER) {
      await scrollToLine(page, anchor, rank);
      await expect(mapCol(page)).toHaveAttribute('data-step', id);
    }
    await expect(page.locator('.pg-tourcap')).toContainText('Stop 9 of 9');
  });
}

test('a "Map tour" link at the top of the guide scrolls to the band and gives it focus', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await expect(page.locator('a.story-open')).toBeAttached();
  await page.locator('.pg-tourjump').click();
  await expect(page.locator('#map-tour')).toBeFocused();
  await expect(page.locator('#map-tour')).toBeInViewport();
  await open(page, '#place=valdepenas&page');
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('.pg-tourjump')).toHaveCount(0);
});

// Card 3, 21 Oct 2026 (LeadBot's phone preview at 375 px).
test.describe('phone 375 px', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('stop 1 holds for 120 px of scroll before stop 2 takes over', async ({ page }) => {
    await open(page, '#place=rioja&page&story');
    await expect(mapCol(page)).toBeVisible();
    await scrollToLine(page, '[data-fly="valley.0"]');
    await expect(mapCol(page)).toHaveAttribute('data-step', 'valley');
    await page.locator('.pg').evaluate((pg) => { pg.scrollTop += 100; });
    await expect(mapCol(page)).toHaveAttribute('data-step', 'valley');
    await page.locator('.pg').evaluate((pg) => { pg.scrollTop += 40; });
    await expect(mapCol(page)).toHaveAttribute('data-step', 'sierra');
  });

  test('the geology layer asks for its tiles whenever its key shows, and the key wraps', async ({ page }) => {
    const igme: string[] = [];
    page.on('request', (r) => { if (r.url().includes('mapas.igme.es')) igme.push(r.url()); });
    await open(page, '#place=rioja&page&story');
    await scrollToLine(page, '[data-fly="soils.0"]');
    await expect(mapCol(page)).toHaveAttribute('data-step', 'soils');
    const key = page.locator('.pg-tourmap .story-legend');
    await expect(key).toContainText('Sands, calcareous sandstones and ochre clays');
    await expect.poll(() => igme.length, { timeout: 15000 }).toBeGreaterThan(0);
    // wrapped, not cut off: nothing of the key is hidden sideways
    expect(await key.evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
  });

  test('no floating Show map button while the tour map is open', async ({ page }) => {
    await open(page, '#place=rioja&page');
    await expect(page.locator('.showmap')).toBeVisible();
    await open(page, '#place=rioja&page&story');
    await expect(mapCol(page)).toBeVisible();
    await expect(page.locator('.showmap')).toBeHidden();
  });
});
