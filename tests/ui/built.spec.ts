import { expect, test } from '@playwright/test';

// The production build at the GitHub Pages subpath, with the real data/dops.geojson and every outside request blocked
// (satellite, terrain and glyphs fail, as they would offline). Debug flags and test hooks do not exist here.
test('the built site loads the real DO layer under /Paraje/', async ({ page }) => {
  test.setTimeout(60_000); // the real 1.6 MB layer in software WebGL, next to the other tests' browsers
  await page.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
  const dops: number[] = [];
  page.on('response', (r) => { if (/\/Paraje\/assets\/dops-[^/]+\.geojson$/.test(r.url())) dops.push(r.status()); });
  await page.goto('http://localhost:4173/Paraje/');
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true', { timeout: 45_000 });
  expect(dops).toEqual([200]);
  await expect(page.locator('#status')).toHaveText('Spain'); // set only after the layer passed applyOverrides and was added
  await expect(page.locator('#views-menu button')).toHaveCount(12); // Spain, ten regions, Rioja in 3D: computed from the real polygons
  await page.fill('#search', 'rias');
  await page.keyboard.press('Enter');
  await expect(page.locator('#card-title')).toHaveText('Rías Baixas');
});
