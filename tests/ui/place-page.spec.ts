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
  await expect(card.locator('.cover-credits a').first()).toHaveAttribute('href', /commons\.wikimedia\.org/);
  await expect(card.locator('.cover-credits a').nth(1)).toHaveAttribute('href', /creativecommons\.org/); // alella-1 is CC BY-SA 4.0
  await expect(card.locator('.cover-credits')).toContainText(' · resized');
  await expect(card.locator('.cover .credit, .cover .ctag')).toHaveCount(0); // no text on the photo (owner point 4)
  await expect(card.locator('.glance > div')).toHaveCount(3);
  await expect(card.getByRole('link', { name: /^Explore .+$/ })).toBeVisible();
  await expect(card.locator('.cover .nav')).toHaveCount(0); // one photo: no arrows
});

test('a card with several photos shows them as a mosaic, and the arrows only in the full-screen viewer', async ({ page }) => {
  await open(page, '#place=cebreros');
  await expect(page.locator('.cover figure')).toHaveCount(3);
  await expect(page.locator('.cover .nav')).toHaveCount(0);
  // Two of the three are by Dopcebreros under the same licence: the line names them once (premium feel review, 18 Oct 2026).
  await expect(page.locator('.cover-credits span')).toHaveCount(2);
  await page.locator('.cover .ph').nth(1).click();
  const viewer = page.getByRole('dialog', { name: 'Photos of Cebreros' });
  await expect(viewer.locator('.count')).toHaveText('2 / 3');
  await viewer.getByRole('button', { name: /^Next photo, 3 of 3/ }).click();
  await expect(viewer.locator('.count')).toHaveText('3 / 3');
  await page.keyboard.press('ArrowRight');
  await expect(viewer.locator('.count')).toHaveText('1 / 3');
  await page.keyboard.press('Escape');
  await expect(viewer).toHaveCount(0);
  await expect(page.locator('.card h1')).toHaveText('Cebreros'); // Escape closed only the viewer, not the card
  await expect(page.locator('.cover .ph').nth(1)).toBeFocused();
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
  const jump = page.getByRole('navigation', { name: 'In this guide' });
  await expect(jump.locator('a')).toHaveText(['Overview', 'Terroir', 'How it tastes', 'Famous styles', 'Grapes', 'The land', 'Producers', 'Zones', 'Where it sits', 'Sources']);
  await jump.getByRole('link', { name: 'The land' }).click();
  await expect(page.locator('#land-h')).toBeFocused();
  await expect(page).toHaveURL(/#place=rioja&page/);

  await open(page, '#place=cava&page');
  await expect(page.getByRole('navigation', { name: 'In this guide' }).locator('a')).toHaveText(['Where it sits']);
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

test('Rioja shows three frames of its five photos, and all five in the viewer', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await expect(page.locator('.pg-mosaic figure')).toHaveCount(3);
  await page.getByRole('button', { name: 'All 5 photos' }).click();
  await expect(page.getByRole('dialog', { name: 'Photos of Rioja' }).locator('.count')).toHaveText('1 / 5');
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
  await expect(page.locator('.pg-stack').first()).toHaveAttribute('aria-label', /Measured climate: Warm-summer Mediterranean 40%, Oceanic 32%, Humid subtropical 24%, Other 4%/);
  await expect(page.locator('.pg-range').first()).toHaveAttribute('aria-label', /Most of the land between 360 and 890 m, median 550 m/);
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

test('the guide labels its level, its study region and WSET only where the specification names it', async ({ page }) => {
  await open(page, '#place=rioja&page');
  const badges = page.locator('.pg-badges li');
  await expect(badges).toHaveText(['DOCa', 'Wine Scholar · Rioja', 'WSET Level 2 and 3', '3 zones · 4-minute read']);
  await expect(badges.first().locator('abbr')).toHaveAttribute('title', 'Denominación de Origen Calificada');
  await open(page, '#place=rioja-alta&page');
  await expect(page.locator('.pg-badges')).not.toContainText('WSET');
});

test('measured charts read against all of Spain, and a zone against its appellation', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await expect(page.locator('#land .pg-compare').first().locator('dt')).toHaveText(['Rioja', 'All of Spain']);
  await expect(page.locator('#land .pg-range').nth(1)).toHaveAttribute('aria-label', /median 680 m/);
  await open(page, '#place=rioja-alta&page');
  await expect(page.locator('#land .pg-compare').first().locator('dt')).toHaveText(['Rioja Alta', 'Rioja', 'All of Spain']);
});
