import { expect, test, type Page } from '@playwright/test';

// The fact sheet on the place card. Cebreros is the one place with a written sheet so far; the rest show measured rows only.

async function open(page: Page, hash = '') {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(`./${hash}`);
  await expect(page.locator('.card h1')).toBeVisible();
}

test('Cebreros shows its why line, grapes, measured rows and a source under each row', async ({ page }) => {
  await open(page, '#place=cebreros');
  const card = page.locator('.card');
  await expect(card.locator('.lede')).toContainText('Old bush vines on granite slopes');
  await expect(card.locator('dt', { hasText: 'Main grapes' })).toBeVisible();
  await expect(card.locator('dd', { hasText: 'Garnacha Tinta, Albillo Real' })).toBeVisible();
  await expect(card.locator('dt', { hasText: 'Climate (Köppen, measured)' })).toBeVisible();
  await expect(card.locator('dd', { hasText: /Hot-summer Mediterranean 68%, warm-summer Mediterranean 27%/ })).toBeVisible();
  await expect(card.locator('dd', { hasText: /Most of the land between 590 and 1,470 m/ })).toBeVisible();
  // Every row of the first list (Level to Soil) ends in a source line that opens in a new tab.
  const rows = card.locator('dl.facts').first().locator('dd');
  const n = await rows.count();
  expect(n).toBeGreaterThanOrEqual(7);
  for (let i = 0; i < n; i++) {
    const link = rows.nth(i).locator('.src a').first();
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
});

test('search "albillo" lists Cebreros with its main grape', async ({ page }) => {
  await open(page);
  await page.getByRole('searchbox', { name: /Search/ }).fill('albillo');
  const hits = page.getByRole('list', { name: 'Search results' }).getByRole('link');
  await expect(hits).toHaveCount(1);
  await expect(hits.first()).toContainText('Cebreros');
  await expect(hits.first()).toContainText('main grape: Albillo Real');
});

test('the report link is absent while no address is set', async ({ page }) => {
  await open(page, '#place=cebreros');
  await expect(page.getByRole('link', { name: 'Report a mistake' })).toHaveCount(0);
  await expect(page.locator('.card a[href^="mailto:"]')).toHaveCount(0);
});

test('a quizzed place without a sheet keeps the old card and gains the measured rows', async ({ page }) => {
  await open(page, '#place=toro');
  const card = page.locator('.card');
  await expect(card.locator('dt', { hasText: 'Altitude' })).toBeVisible();
  await expect(card.locator('dt', { hasText: 'Climate (Köppen, measured)' })).toBeVisible();
  await expect(card.locator('dt', { hasText: 'Main grapes' })).toHaveCount(0);
  await expect(card.locator('dt', { hasText: 'Study region' })).toBeVisible();
});

test('a place that is not quizzed shows no measured rows', async ({ page }) => {
  await open(page, '#place=cava');
  const card = page.locator('.card');
  await expect(card.locator('dt', { hasText: 'Level' })).toBeVisible();
  await expect(card.locator('dt', { hasText: 'Altitude' })).toHaveCount(0);
});

test('the keyboard reaches every link on the Cebreros card', async ({ page }) => {
  await open(page, '#place=cebreros');
  const controls = await page.locator('.card a[href]').count();
  expect(controls).toBeGreaterThan(8);
  await page.locator('.card .close').focus();
  const seen: string[] = [];
  for (let i = 0; i < controls; i++) {
    seen.push(String(await page.evaluate(() => [...document.querySelectorAll('.card a[href]')].indexOf(document.activeElement as Element))));
    await page.keyboard.press('Tab');
  }
  expect(new Set(seen).size).toBe(controls);
});

for (const scheme of ['light', 'dark'] as const) {
  test(`the fact sheet fits at iPad width, ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.setViewportSize({ width: 1024, height: 768 });
    await open(page, '#place=cebreros');
    const card = (await page.locator('.card').boundingBox())!;
    expect(card.x >= 0 && card.x + card.width <= 1024).toBe(true);
    const overflow = await page.locator('.card .body').evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(overflow).toBe(false);
  });
}
