import { expect, test } from '@playwright/test';

// The website (slice 2, 18 Oct 2026): the home page one level above the atlas, the site's bar, links from before the website, and Study's
// address. baseURL is the atlas (atlas/), so the home page is '../'. No network.

test('the home page is plain HTML with the bar, the tagline and no map', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', (r) => { if (r.resourceType() === 'script') scripts.push(r.url()); });
  await page.goto('../');
  await expect(page).toHaveTitle('AtlaSlope · Know the land behind the glass');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Know the land behind the glass.');
  await expect(page.locator('.hero .reach')).toContainText('Live now. More countries coming soon.');
  const nav = page.getByRole('navigation', { name: 'Site' });
  await expect(nav.getByRole('link')).toHaveText(['Atlas', 'Study', 'Guides', 'About']);
  await expect(page.locator('.sitebar .search')).toHaveCount(0); // no search here: it could only throw you into the atlas (owner, 18 Oct)
  await expect(page.getByRole('link', { name: 'Open the atlas' }).first()).toHaveAttribute('href', 'atlas/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://atlaslope.com/share.jpg');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('#map')).toHaveCount(0);
  expect(scripts.some((u) => /atlas-[\w-]+\.js/.test(u))).toBe(false);
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
  await page.getByRole('link', { name: /Rioja Alta/ }).click();
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
