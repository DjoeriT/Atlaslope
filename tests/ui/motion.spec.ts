import { expect, test, type Page } from '@playwright/test';

// Motion inside and between guides (owner points 8 and 9, 18 Oct 2026; Review/motion-spec.md).

async function open(page: Page, hash = '') {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(`./?now=2026-10-18T10:00:00Z${hash}`);
}

const recordMoves = (page: Page) => page.evaluate(() => {
  (window as unknown as { seen: string[] }).seen = [];
  new MutationObserver(() => {
    const m = document.documentElement.dataset.motion;
    if (m) (window as unknown as { seen: string[] }).seen.push(m);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
});
const moves = (page: Page) => page.evaluate(() => (window as unknown as { seen: string[] }).seen);

test('guide to guide steps forward to a narrower guide and back up to a wider one, each opening at its top', async ({ page }) => {
  await open(page, '#place=toro&page');
  await recordMoves(page);
  await page.locator('.pg-badges a').first().click();
  await expect(page.locator('.rpage h1')).toBeVisible();
  await page.locator('.rgrid li a').first().click();
  await expect(page.locator('.pg h1')).toBeVisible();
  expect(await moves(page)).toEqual(['page-up', 'page-step']);
  await expect(page.locator('.pg')).toHaveJSProperty('scrollTop', 0);
});

test('a jump bar tab glides to its section, the marker follows, and the charts there draw in once seen', async ({ page }) => {
  await open(page, '#place=rioja&page');
  const land = page.locator('#land');
  await expect(land.locator('.pg-chart').first()).not.toHaveAttribute('data-seen', '');
  await page.locator('.pg-jump a', { hasText: 'The land' }).click();
  await expect(page.locator('#land-h')).toBeFocused();
  await expect(page.locator('.pg-jump a', { hasText: 'The land' })).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('.pg-jump')).toHaveAttribute('data-mark', '');
  await expect(land.locator('.pg-chart').first()).toHaveAttribute('data-seen', '');
  // a hover names the class and lights it in every row (once the bars have finished growing, so the pointer meets a still target)
  await page.waitForFunction(() => [...document.querySelectorAll('#land .pg-stack rect')].every((r) => r.getAnimations().every((a) => a.playState === 'finished')));
  await land.locator('.pg-climate .pg-stack rect').first().hover();
  await expect(land.locator('.pg-climate')).toHaveAttribute('data-hover', '0');
});

test('under reduced motion the charts are drawn at once and no move runs', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, '#place=rioja&page');
  await expect(page.locator('#land .pg-chart').first()).toHaveAttribute('data-seen', '');
  await page.locator('.pg-jump a', { hasText: 'The land' }).click();
  await expect(page.locator('#land-h')).toBeFocused();
  await expect(page.locator('#land')).not.toHaveAttribute('data-arrived', '');
});

test('every guide has a Show map button that goes back to the place on the map', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await page.getByRole('link', { name: 'Show map: Rioja' }).click();
  await expect(page.locator('.card h1')).toHaveText('Rioja');
  await expect(page.locator('.pg')).toHaveCount(0);
  await open(page, '#region=castilla-y-leon&page');
  await page.getByRole('link', { name: 'Show map: Castilla y León' }).click();
  await expect(page.locator('.card h1')).toHaveText('Castilla y León');
});

test('card to guide and back run as one move: only one photo carries the shared name', async ({ page }) => {
  const dup: string[] = [];
  page.on('console', (m) => { if (/duplicate view-transition-name/i.test(m.text())) dup.push(m.text()); });
  await open(page, '#place=rueda');
  await expect(page.locator('.card .cover figure')).not.toHaveCount(0);
  await page.getByRole('link', { name: /^Explore / }).click();
  await expect(page.locator('.pg h1')).toHaveText('Rueda');
  await page.getByRole('link', { name: 'Show map: Rueda' }).click();
  await expect(page.locator('.card h1')).toHaveText('Rueda');
  expect(dup).toEqual([]);
});

test('one way back per screen: top-left Map on a wide screen, the floating Show map button on a phone', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await expect(page.locator('.pg-back')).toBeVisible();
  await expect(page.locator('.showmap')).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.pg-back')).toBeHidden();
  await expect(page.locator('.showmap')).toBeVisible();
  await page.locator('.showmap').click();
  await expect(page.locator('.card h1')).toHaveText('Rioja');
});
