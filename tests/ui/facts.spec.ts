import { expect, test, type Page } from '@playwright/test';

// The fact sheet, now on the full place page (#place=<id>&page): written sections with sources, measured charts, photos with credits.
// The teaser card keeps the opening sentence, three facts and the photo credit.

async function open(page: Page, hash = '') {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(`./${hash}`);
  await expect(page.locator('h1').first()).toBeVisible();
}

test('the Cebreros card shows its why line, a source and the three facts', async ({ page }) => {
  await open(page, '#place=cebreros');
  const card = page.locator('.card');
  await expect(card.locator('.lede')).toContainText('granite');
  await expect(card.locator('.lede + .src a')).toHaveAttribute('target', '_blank');
  await expect(card.locator('.glance > div')).toHaveCount(3);
  await expect(card.locator('.glance')).toContainText('Garnacha Tinta');
  await expect(card.locator('.glance')).toContainText('590–1,470 m');
});

test('the Cebreros page shows grapes, measured rows and a source under each', async ({ page }) => {
  await open(page, '#place=cebreros&page');
  const pg = page.locator('.pg');
  await expect(pg.locator('#grapes')).toContainText('Garnacha TintaAlbillo Real');
  await expect(pg.locator('#land')).toContainText('Hot-summer Mediterranean 68%');
  await expect(pg.locator('#land')).toContainText('Most of the land between 590 and 1,470 m');
  for (const id of ['overview', 'grapes', 'land', 'where']) {
    const link = pg.locator(`#${id} .src a`).first();
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
  await open(page, '#place=cebreros&page');
  await expect(page.getByRole('link', { name: 'Report a mistake' })).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
});

test('a place whose sources name no main grape shows its other grapes instead', async ({ page }) => {
  await open(page, '#place=la-mancha&page');
  const grapes = page.locator('#grapes');
  await expect(grapes.getByText('Main grapes')).toHaveCount(0);
  await expect(grapes.locator('dt', { hasText: /^Also allowed/ })).toBeVisible();
  await expect(page.locator('#land')).toContainText('%');
});

test('photos show with a credit that links to their Commons page', async ({ page }) => {
  await open(page, '#place=cebreros&page');
  const figures = page.locator('.pg-mosaic figure');
  await expect(figures).toHaveCount(3);
  await expect(figures.first().locator('img')).toHaveAttribute('alt', /.+/);
  await expect(page.locator('.pg-credits a').first()).toHaveAttribute('href', /^https:\/\/commons\.wikimedia\.org\//);
});

test('a place that is not quizzed shows no measured rows', async ({ page }) => {
  await open(page, '#place=cava&page');
  await expect(page.locator('#where dt', { hasText: 'Level' })).toBeVisible();
  await expect(page.locator('#land')).toHaveCount(0);
});

test('the keyboard reaches every link on the Cebreros card', async ({ page }) => {
  await open(page, '#place=cebreros');
  const controls = await page.locator('.card a[href], .card button').count();
  expect(controls).toBeGreaterThan(4);
  await page.locator('.card .close').focus();
  const seen: string[] = [];
  for (let i = 0; i < controls; i++) {
    seen.push(String(await page.evaluate(() => [...document.querySelectorAll('.card a[href], .card button')].indexOf(document.activeElement as Element))));
    await page.keyboard.press('Tab');
  }
  expect(new Set(seen).size).toBe(controls);
});

test('the card and the page fit at iPad width', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await open(page, '#place=cebreros');
  const card = (await page.locator('.card').boundingBox())!;
  expect(card.x >= 0 && card.x + card.width <= 1024).toBe(true);
  expect(await page.locator('.card .scroll').evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(false);
  await open(page, '#place=cebreros&page');
  expect(await page.locator('.pg').evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(false);
});

test('a long grape list opens and closes without losing focus', async ({ page }) => {
  await open(page, '#place=granada&page');
  const more = page.locator('.pg button.more');
  await expect(more).toHaveAttribute('aria-expanded', 'false');
  const box = await more.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await more.focus();
  await page.keyboard.press('Enter');
  await expect(more).toHaveAttribute('aria-expanded', 'true');
  await expect(more).toBeFocused();
  await expect(more).toHaveText('Show fewer');
});

test('Rioja shows its famous styles and how it tastes, each with a source', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await expect(page.locator('#styles strong', { hasText: 'Gran Reserva' })).toBeVisible();
  await expect(page.locator('#styles .src a').first()).toHaveAttribute('target', '_blank');
  await expect(page.locator('#taste b', { hasText: 'Reds' })).toBeVisible();
  await expect(page.locator('#taste .src a').first()).toHaveAttribute('target', '_blank');
});
