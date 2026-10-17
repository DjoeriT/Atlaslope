import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

// The card walk: Spain, region, place, zone and back, the address bar, search and the keyboard.
// The UI-test build makes no tile requests; places and boundaries are the real data files.

async function open(page: Page, hash = '') {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(`./${hash}`);
  await expect(page.locator('.card h1')).toBeVisible();
}

const viewOf = (page: Page) => page.evaluate(() => new URLSearchParams(location.hash.slice(1)).get('view'));

test('the Spain card lists ten regions in course order', async ({ page }) => {
  await open(page);
  await expect(page.locator('.card h1')).toHaveText('Spain');
  const names = await page.locator('.card .tree li a b').allTextContents();
  const course = JSON.parse(readFileSync('data/places.json', 'utf8')).courses[0].groups as Array<{ name: string; order: number }>;
  expect(names).toEqual(course.sort((a, b) => a.order - b.order).map((g) => g.name));
  expect(names).toHaveLength(10);
  expect(names.slice(0, 3)).toEqual(['Green Spain', 'Castilla y León', 'Rioja']);
});

test('walk Rioja, Rioja, Rioja Alta and back by breadcrumb', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await open(page);
  const card = page.locator('.card');
  await card.getByRole('link', { name: /^Rioja/ }).click();
  await expect(card.locator('h1')).toHaveText('Rioja');
  await expect(page).toHaveURL(/#region=rioja/);
  await expect(card.getByRole('navigation', { name: 'Where this sits' })).toHaveText(/Spain\s*›\s*Rioja/);

  await card.getByRole('link', { name: /^Rioja\s*DOCa/ }).click();
  await expect(page).toHaveURL(/#place=rioja(&|$)/);
  await expect(card.locator('h1')).toHaveText('Rioja');
  await expect(card.getByText('DOCa').first()).toBeVisible();

  await card.getByRole('link', { name: /^Rioja Alta/ }).click();
  await expect(page).toHaveURL(/#place=rioja-alta/);
  await expect(card.locator('h1')).toHaveText('Rioja Alta');
  const crumbs = card.getByRole('navigation', { name: 'Where this sits' });
  await expect(crumbs).toHaveText(/Spain\s*›\s*Rioja\s*›\s*Rioja\s*›\s*Rioja Alta/);

  await crumbs.getByRole('link', { name: 'Rioja' }).last().click(); // the place, not the region
  await expect(page).toHaveURL(/#place=rioja(&|$)/);
  await expect(card.locator('h1')).toHaveText('Rioja');
  await card.getByRole('navigation', { name: 'Where this sits' }).getByRole('link', { name: 'Rioja' }).click(); // the region
  await expect(page).toHaveURL(/#region=rioja/);
  await card.getByRole('navigation', { name: 'Where this sits' }).getByRole('link', { name: 'Spain' }).click();
  await expect(card.locator('h1')).toHaveText('Spain');
  await page.goBack();
  await expect(page).toHaveURL(/#region=rioja/);  expect(errors).toEqual([]);
});

test('the close button steps up one level and the browser back button works', async ({ page }) => {
  await open(page, '#place=toro');
  const card = page.locator('.card');
  await expect(card.locator('h1')).toHaveText('Toro');
  await card.getByRole('link', { name: 'Close, back to Castilla y León' }).click();
  await expect(card.locator('h1')).toHaveText('Castilla y León');
  await page.goBack();
  await expect(card.locator('h1')).toHaveText('Toro');
});

test('search "toro" opens Toro', async ({ page }) => {
  await open(page);
  const box = page.getByRole('searchbox', { name: /Search/ });
  await box.fill('toro');
  await expect(page.getByRole('list', { name: 'Search results' }).getByRole('link').first()).toContainText('Toro');
  await box.press('Enter');
  await expect(page.locator('.card h1')).toHaveText('Toro');
  await expect(page).toHaveURL(/#place=toro/);
  await expect(box).toHaveValue('');
});

test('the map frames each step and a reloaded place URL restores place and view', async ({ page }) => {
  await open(page, '#place=toro');
  await expect.poll(() => viewOf(page)).not.toBeNull();
  const first = await viewOf(page);
  await page.getByRole('link', { name: 'Close, back to Castilla y León' }).click();
  await expect.poll(() => viewOf(page), { message: 'the region view differs from the place view' }).not.toBe(first);
  await page.getByRole('navigation', { name: 'Where this sits' }).getByRole('link', { name: 'Spain' }).click();
  await expect.poll(async () => Number((await viewOf(page))?.split(',')[2])).toBeLessThan(6);

  await page.getByRole('link', { name: /^Castilla y León/ }).click();
  await page.getByRole('link', { name: /^Toro/ }).click();
  await expect.poll(() => viewOf(page)).toBe(first);
  const url = page.url();
  await page.reload();
  await expect(page.locator('.card h1')).toHaveText('Toro');
  await page.waitForTimeout(500); // a restored view must not be framed over
  expect(page.url()).toBe(url);
});

test('keyboard reaches every card control', async ({ page }) => {
  await open(page, '#place=rioja');
  const card = page.locator('.card');
  const controls = await card.locator('a[href], button').count();
  expect(controls).toBeGreaterThan(5);
  await page.locator('.card .close').focus();
  const seen: string[] = []; // the position of each focused link among the card's links
  for (let i = 0; i < controls; i++) {
    seen.push(String(await page.evaluate(() => [...document.querySelectorAll('.card a[href], .card button')].indexOf(document.activeElement as Element))));
    await page.keyboard.press('Tab');
  }
  expect(new Set(seen).size).toBe(controls);
  await page.locator('.card .zrow a').first().focus();
  await page.keyboard.press('Enter');
  await expect(card.locator('h1')).toBeFocused(); // the new card's title takes the keyboard
});

for (const scheme of ['light', 'dark'] as const) {
  test(`cards fit at iPad width, ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.setViewportSize({ width: 1024, height: 768 });
    await open(page, '#place=rioja');
    const card = await page.locator('.card').boundingBox();
    const search = await page.locator('.search').boundingBox();
    expect(card && card.x >= 0 && card.x + card.width <= 1024).toBe(true);
    expect(search && card && search.x + search.width <= 1024).toBe(true);
    const note = page.locator('.imagery-note');
    if (await note.isVisible()) {
      const n = (await note.boundingBox())!;
      expect(n.x).toBeGreaterThanOrEqual(card!.x + card!.width);
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', scheme === 'dark' ? 'dark' : 'paper');
  });
}

test('the keyboard follows the walk from Spain to a region to a place', async ({ page }) => {
  await open(page);
  const card = page.locator('.card');
  await card.getByRole('link', { name: /^Rioja/ }).click();
  await expect(card.locator('h1')).toHaveText('Rioja');
  await expect(card.locator('h1')).toBeFocused(); // Spain card to region card
  await card.locator('.tree a').first().click();
  await expect(card.locator('h1')).toBeFocused(); // region card to place card
});

test('Escape in the search results keeps the keyboard in the search box', async ({ page }) => {
  await open(page);
  const input = page.locator('.search input');
  await input.fill('toro');
  await input.press('ArrowDown');
  await page.keyboard.press('Escape');
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('');
});

test('boundaries that fail to load say so and offer a reload', async ({ page }) => {
  await page.route(/\.geojson/, (r) => r.fulfill({ status: 500, body: '' }));
  await open(page);
  await expect(page.getByRole('alert')).toContainText('did not load');
  await expect(page.getByRole('button', { name: 'Reload' })).toBeVisible();
});

test('the tab title names the open place first and follows the walk', async ({ page }) => {
  await open(page);
  await expect(page).toHaveTitle('AtlaSlope · The wine atlas that quizzes you');
  await page.locator('.card').getByRole('link', { name: /^Castilla y León/ }).click();
  await expect(page).toHaveTitle('Castilla y León · AtlaSlope');
  await page.goBack();
  await expect(page).toHaveTitle('AtlaSlope · The wine atlas that quizzes you');
  await open(page, '#place=toro');
  await expect(page).toHaveTitle('Toro · AtlaSlope');
});

test('the page has a favicon and the header shows the logo', async ({ page, request }) => {
  await open(page);
  for (const href of ['./favicon.svg', './favicon-32.png', './apple-touch-icon.png']) {
    await expect(page.locator(`link[href="${href}"]`)).toHaveCount(1);
    expect((await request.get(href)).ok()).toBe(true);
  }
  await expect(page.locator('.brand svg.mark')).toBeVisible();
  await expect(page.locator('.brand svg.mark')).toHaveAttribute('aria-hidden', 'true');
});
