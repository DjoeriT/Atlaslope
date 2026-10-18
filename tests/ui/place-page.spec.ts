import { expect, test, type Page } from '@playwright/test';

// The place card as a teaser and the full place page (#place=<id>&page). Real places and photos, no tiles.

async function open(page: Page, hash = '') {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(`./${hash}`);
  await expect(page.locator('h1').first()).toBeVisible();
}

test('a place card shows the cover, three glance cells and "Explore X"', async ({ page }) => {
  await open(page, '#place=alella');
  const card = page.locator('.card');
  await expect(card.locator('.cover img')).toBeVisible();
  // The credit: author to the Commons page, licence to its text, and "resized" for CC BY(-SA) files (owner card, 18 Oct 2026).
  await expect(card.locator('.cover .credit a').first()).toHaveAttribute('href', /commons\.wikimedia\.org/);
  await expect(card.locator('.cover .credit a').nth(1)).toHaveAttribute('href', /creativecommons\.org/); // alella-1 is CC BY-SA 4.0
  await expect(card.locator('.cover .credit')).toContainText(', resized');
  await expect(card.locator('.glance > div')).toHaveCount(3);
  await expect(card.getByRole('link', { name: /^Explore .+$/ })).toBeVisible();
  await expect(card.locator('.cover .nav')).toHaveCount(0); // one photo: no arrows
});

test('a card with several photos steps through them', async ({ page }) => {
  await open(page, '#place=cebreros');
  const img = page.locator('.cover img');
  const first = await img.getAttribute('src');
  await page.getByRole('button', { name: /^Next photo, 2 of 3/ }).click();
  expect(await img.getAttribute('src')).not.toBe(first);
  await expect(page.locator('.dots i')).toHaveCount(3);
});

test('Rioja lists its zones with thumbnails on the card', async ({ page }) => {
  await open(page, '#place=rioja');
  await expect(page.locator('.card .zrow li')).toHaveCount(3);
  await expect(page.locator('.card .zrow img').first()).toBeVisible();
});

test('the button opens the page and Atlas in the bar returns to the card with the same view', async ({ page }) => {
  await open(page, '#place=rioja&view=-2.4000,42.3000,9.10,0,45');
  await page.getByRole('link', { name: /^Explore .+$/ }).click();
  await expect(page).toHaveURL(/#place=rioja&page&view=-2\.4000,42\.3000,9\.10,0,45/);
  await expect(page.locator('.pg h1')).toHaveText('Rioja');
  await page.locator('.pg-top').getByRole('link', { name: 'Atlas', exact: true }).click();
  await expect(page.locator('.card h1')).toHaveText('Rioja');
  await expect(page).toHaveURL(/#place=rioja&view=-2\.4000,42\.3000,9\.10,0,45/);
  await expect(page.locator('.pg')).toHaveCount(0);
});

test('back and forward move between the card and the page', async ({ page }) => {
  await open(page, '#place=toro');
  await page.getByRole('link', { name: /^Explore .+$/ }).click();
  await expect(page.locator('.pg')).toBeVisible();
  await page.goBack();
  await expect(page.locator('.card h1')).toHaveText('Toro');
  await page.goForward();
  await expect(page.locator('.pg h1')).toHaveText('Toro');
});

test('a link to the page opens it directly, and "Show on the map" goes to the card', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await page.getByRole('link', { name: 'Fly to Rioja' }).click();
  await expect(page).toHaveURL(/#place=rioja(&view=.*)?$/);
  await expect(page.locator('.card h1')).toHaveText('Rioja');
});

test('the jump bar lists only the sections that exist and moves focus to the section', async ({ page }) => {
  await open(page, '#place=rioja&page');
  const jump = page.getByRole('navigation', { name: 'On this page' });
  await expect(jump.locator('a')).toHaveText(['Overview', 'Terroir', 'How it tastes', 'Famous styles', 'Grapes', 'The land', 'Producers', 'Zones', 'Where it sits', 'Sources']);
  await jump.getByRole('link', { name: 'The land' }).click();
  await expect(page.locator('#land-h')).toBeFocused();
  await expect(page).toHaveURL(/#place=rioja&page/);

  await open(page, '#place=cava&page');
  await expect(page.getByRole('navigation', { name: 'On this page' }).locator('a')).toHaveText(['Where it sits']);
});

for (const [id, n] of [['yecla', 1], ['ribera-del-duero', 2], ['cebreros', 3]] as const) {
  test(`the mosaic of ${id} has ${n} photo${n > 1 ? 's' : ''} and no empty frame`, async ({ page }) => {
    await open(page, `#place=${id}&page`);
    const figures = page.locator('.pg-mosaic figure');
    await expect(figures).toHaveCount(n);
    for (let i = 0; i < n; i++) {
      const box = (await figures.nth(i).boundingBox())!;
      expect(box.width).toBeGreaterThan(50);
      expect(box.height).toBeGreaterThan(50);
      await expect(figures.nth(i).locator('img')).toHaveJSProperty('complete', true);
    }
  });
}

test('Rioja mixes its own photos with zone photos, five frames', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await expect(page.locator('.pg-mosaic figure')).toHaveCount(5);
  await expect(page.locator('.pg-credits')).toContainText('Photos:');
});

test('a place without photos shows its name on a cover, never a broken image', async ({ page }) => {
  for (const hash of ['#place=txakoli-alava', '#place=txakoli-alava&page']) {
    await open(page, hash);
    await expect(page.locator('.namecover')).toBeVisible();
    await expect(page.locator('.namecover')).toContainText('Txakol');
    await expect(page.locator('.card img, .pg img')).toHaveCount(0);
  }
});

test('every section of the Rioja page keeps a source link', async ({ page }) => {
  await open(page, '#place=rioja&page');
  const ids = await page.locator('.pg main > section').evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(['overview', 'terroir', 'taste', 'styles', 'grapes', 'land', 'producers', 'zones', 'where', 'sources']);
  for (const id of ids) {
    await expect(page.locator(id === 'sources' ? '#sources a[target="_blank"]' : `#${id} .src a[target="_blank"]`).first()).toBeVisible();
  }
});

test('the charts have text equivalents', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await expect(page.locator('.pg-stack')).toHaveAttribute('aria-label', /Measured climate: Warm-summer Mediterranean 40%, Oceanic 32%, Humid subtropical 24%, Other 4%/);
  await expect(page.locator('.pg-range')).toHaveAttribute('aria-label', /Most of the land between 360 and 890 m, median 550 m/);
  await expect(page.locator('.pg-legend')).toContainText('Oceanic 32%');
  await expect(page.locator('#land')).toContainText('Most of the land between 360 and 890 m');
});

test('"Next in the course" leads to the next study region', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await page.locator('.nextlink').click();
  await expect(page).toHaveURL(/#region=/);
});

test('the page has no sideways scroll at 834 wide and 125% text', async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1194 });
  await open(page, '#place=rioja&page');
  await page.addStyleTag({ content: 'html{font-size:125%}' });
  expect(await page.locator('.pg').evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(false);
});
