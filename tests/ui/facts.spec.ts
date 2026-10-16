import { expect, test, type Page } from '@playwright/test';

// The fact sheet on the place card: written rows with sources, measured rows, photos with credits.

async function open(page: Page, hash = '') {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(`./${hash}`);
  await expect(page.locator('.card h1')).toBeVisible();
}

test('Cebreros shows its why line, grapes, measured rows and a source under each row', async ({ page }) => {
  await open(page, '#place=cebreros');
  const card = page.locator('.card');
  await expect(card.locator('.lede')).toContainText('granite');
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

test('a place whose sources name no main grape shows its other grapes instead', async ({ page }) => {
  await open(page, '#place=la-mancha');
  const card = page.locator('.card');
  await expect(card.locator('dt', { hasText: 'Main grapes' })).toHaveCount(0);
  await expect(card.locator('dt', { hasText: /^Other grapes/ })).toBeVisible();
  await expect(card.locator('dt', { hasText: 'Climate (Köppen, measured)' })).toBeVisible();
});

test('photos show with a credit that links to their Commons page', async ({ page }) => {
  await open(page, '#place=cebreros');
  const figures = page.locator('.card figure.photo');
  await expect(figures).toHaveCount(3);
  await expect(figures.first().locator('img')).toHaveAttribute('alt', /.+/);
  await expect(figures.first().locator('figcaption a')).toHaveAttribute('href', /^https:\/\/commons\.wikimedia\.org\//);
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

test('a long grape list opens and closes without losing focus', async ({ page }) => {
  await open(page, '#place=granada');
  const more = page.locator('.card button.more');
  await expect(more).toHaveAttribute('aria-expanded', 'false');
  const box = await more.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await more.focus();
  await page.keyboard.press('Enter');
  await expect(more).toHaveAttribute('aria-expanded', 'true');
  await expect(more).toBeFocused();
  await expect(more).toHaveText('Show fewer');
});
