import { readdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// The website (slice 2, 18 Oct 2026): the home page one level above the atlas, the site's bar, links from before the website, and Study's
// address. baseURL is the atlas (atlas/), so the home page is '../'. No network.

test('the home page is plain HTML with the bar, the tagline and no map', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', (r) => { if (r.resourceType() === 'script') scripts.push(r.url()); });
  await page.goto('../');
  await expect(page).toHaveTitle('AtlaSlope · Know the land behind the glass');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Know the land behind the glass.');
  await expect(page.locator('.hero .sub')).toHaveText("Spain's wine places from above, and why each one tastes the way it does. The wine study atlas for WSET and Wine Scholar students.");
  await expect(page.locator('.closer')).toContainText('More countries are on their way.');
  await expect(page.getByRole('link', { name: /Why Rioja tastes the way it does/ }).first()).toHaveAttribute('href', 'atlas/#place=rioja&page');
  const nav = page.getByRole('navigation', { name: 'Site' });
  await expect(nav.getByRole('link')).toHaveText(['Atlas', 'Study', 'Guides', 'About']);
  await expect(page.locator('.sitebar .search input')).toHaveCount(1); // search is in the bar on every page (owner, 21 Oct)
  await expect(page.getByRole('link', { name: 'Open the atlas' }).first()).toHaveAttribute('href', 'atlas/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://atlaslope.com/share.jpg');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('#map')).toHaveCount(0);
  expect(scripts.some((u) => /atlas-[\w-]+\.js/.test(u))).toBe(false);
});

test('search in the home page bar finds Rioja, loads its index only on focus, and opens the place in the atlas', async ({ page }) => {
  const indexLoads: string[] = [];
  page.on('request', (r) => { if (/search-index/.test(r.url())) indexLoads.push(r.url()); });
  await page.goto('../');
  await page.waitForLoadState('networkidle');
  expect(indexLoads).toHaveLength(0);
  const box = page.getByRole('searchbox', { name: 'Search places and regions' });
  await box.fill('rioja');
  const first = page.locator('.sitebar .results a').first();
  await expect(first).toContainText('Rioja');
  await expect(first).toHaveAttribute('href', 'atlas/#place=rioja');
  await box.press('Enter');
  await expect(page).toHaveURL(/\/atlas\/#place=rioja/);
});

test('Open the atlas leads to the atlas, and its logo comes back home', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto('../');
  await page.getByRole('link', { name: 'Open the atlas' }).first().click();
  await expect(page).toHaveURL(/\/atlas\/(#.*)?$/);
  await expect(page.locator('.card h1')).toHaveText('Spain');
  await expect(page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Atlas' })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('link', { name: 'AtlaSlope home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Know the land behind the glass.');
});

test('a link from before the website opens the same place in the atlas', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto('../#place=toro&view=-5.4,41.5,9.00,0,45');
  await expect(page).toHaveURL(/\/atlas\/#place=toro&view=-5\.4/);
  await expect(page.locator('.card h1')).toHaveText('Toro');
});

test('an old #quiz link opens Study, and the address says #study', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto('../#quiz=focus');
  await expect(page).toHaveURL(/\/atlas\/#(quiz|study)=focus/);
  await page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Study' }).click();
  await expect(page).toHaveURL(/#study($|&)/);
  await expect(page).toHaveTitle('Study · AtlaSlope');
  await expect(page.getByRole('heading', { name: 'Study or review' })).toBeVisible();
});

test('Guides and About are plain pages with the same bar, and the guides lead into the atlas', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto('../about/');
  await expect(page).toHaveTitle('About · AtlaSlope');
  const nav = page.getByRole('navigation', { name: 'Site' });
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
  await nav.getByRole('link', { name: 'Guides' }).click();
  await expect(page).toHaveTitle('Guides · AtlaSlope');
  await page.locator('a[href$="place=rioja-alta&page"]').click();
  await expect(page).toHaveURL(/\/atlas\/#place=rioja-alta/);
});

test('Study and back to Atlas returns to the card that was open', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto('./#place=toro');
  await expect(page.locator('.card h1')).toHaveText('Toro');
  const nav = page.getByRole('navigation', { name: 'Site' });
  await nav.getByRole('link', { name: 'Study' }).click();
  await expect(page.getByRole('heading', { name: 'Study or review' })).toBeVisible();
  await nav.getByRole('link', { name: 'Atlas' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Toro' })).toBeVisible();
  await expect(page).toHaveURL(/#place=toro/);
});

test('the home tile links to the map tours band on the Guides page, which folds out every tour guide; the filter works in place', async ({ page }) => {
  await page.goto('../');
  const tile = page.locator('.hero a[href="guides/#map-tours"], a[href="guides/#map-tours"]').first();
  await expect(tile).toHaveText('map tours');
  await tile.click();
  await expect(page).toHaveURL(/\/guides\/#map-tours$/);
  const tours = readdirSync('content/stories').filter((f) => f.endsWith('.json'));
  const band = page.locator('#map-tours');
  await expect(band.getByRole('heading', { name: 'Explore with the map' })).toBeVisible();
  await expect(band.locator('.stills.feat a')).toHaveCount(4);
  await expect(band.locator('#more-tours')).toBeHidden();
  await expect(band.getByRole('button', { name: `Show all ${tours.length} map tours` })).toBeVisible();
  const btn = band.locator('button.morebtn'); // its name changes with its state
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await btn.click();
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(btn).toHaveText('Show fewer');
  await expect(band.locator('.stills a')).toHaveCount(tours.length); // every guide with a story file is listed (15 since the rule A tours)
  await expect(band.locator('.stills a .nm')).toContainText(['Rioja', 'Priorat', 'Ribeira Sacra']);
  await btn.click();
  await expect(band.locator('#more-tours')).toBeHidden();
  const regions = page.locator('.gl .region');
  const all = await regions.count();
  await page.getByLabel('Show only guides with a map tour').check();
  await expect(page.locator('.gl .ecard:visible:not([data-tour])')).toHaveCount(0);
  expect(await regions.locator('visible=true').count()).toBeLessThan(all);
  await page.getByLabel('Show only guides with a map tour').uncheck();
  expect(await regions.locator('visible=true').count()).toBe(all);
  await expect(page.locator('p.credit')).toHaveCount(1);
});
