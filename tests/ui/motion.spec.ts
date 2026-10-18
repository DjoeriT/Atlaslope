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
  // a hover names the class and lights it in every row
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
