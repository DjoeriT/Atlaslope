import { expect, test, type Page } from '@playwright/test';

// The region page: opened from the region card, a cover and a tile per place, credits, and the way back.

async function open(page: Page, hash: string) {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(`./${hash}`);
}

test('the region card opens the page and Back to map returns to the card', async ({ page }) => {
  await open(page, '#region=ebro');
  await page.locator('.card').getByRole('link', { name: 'Open the Navarra and Aragón page' }).click();
  await expect(page).toHaveURL(/#region=ebro&page/);
  const rpage = page.locator('.rpage');
  await expect(rpage.locator('h1')).toHaveText('Navarra and Aragón');
  await rpage.getByRole('link', { name: 'Back to map' }).click();
  await expect(page).toHaveURL(/#region=ebro(&view=[^&]*)?$/);
  await expect(page.locator('.rpage')).toHaveCount(0);
  await expect(page.locator('.card h1')).toHaveText('Navarra and Aragón');
  // Back to map stepped back (mobile check, 17 Oct 2026), so forward reopens the page and back from the card leaves the region.
  await page.goForward();
  await expect(page.locator('.rpage h1')).toBeVisible();
});

test('the cover and every tile show a photo or the name tile, none broken', async ({ page }) => {
  await open(page, '#region=ebro&page');
  const rpage = page.locator('.rpage');
  await expect(rpage.locator('.rcover img')).toBeVisible();
  const tiles = rpage.locator('.rtile');
  expect(await tiles.count()).toBeGreaterThanOrEqual(5);
  await page.waitForLoadState('networkidle');
  for (const img of await rpage.locator('img').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  for (const tile of await tiles.all()) {
    await expect(tile.locator('.ph img, .ph.none span')).toHaveCount(1);
    await expect(tile.locator('.meta b')).not.toBeEmpty();
  }
});

test('a tile opens its place and the credits line is there', async ({ page }) => {
  await open(page, '#region=ebro&page');
  const rpage = page.locator('.rpage');
  await expect(rpage.locator('.rcredits')).toContainText('Photos:');
  expect(await rpage.locator('.rcredits a').count()).toBeGreaterThan(0);
  await expect(rpage.locator('.rcover .pill')).toContainText('Photo:');
  await rpage.getByRole('link', { name: /Somontano DO/ }).click();
  await expect(page).toHaveURL(/#place=somontano&page/);
  await expect(page.locator('.pg h1')).toHaveText('Somontano');
});

test('Show on the map goes to the region card', async ({ page }) => {
  await open(page, '#region=ebro&page');
  await page.getByRole('link', { name: 'Show Navarra and Aragón on the map' }).click();
  await expect(page).toHaveURL(/#region=ebro(&view=[^&]*)?$/);
});
