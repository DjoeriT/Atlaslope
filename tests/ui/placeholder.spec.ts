import { expect, test } from '@playwright/test';

// The app shell: top bar, one light theme, first run, link-only meta. (Kept in this file name so card 4 adds its own specs beside it.)
// ?fresh=1 exists only in the UI-test build; it forgets the first-run choice.

test('the frame renders with the mode bar and no failed requests', async ({ page }) => {
  const failed: string[] = [];
  page.on('requestfailed', (r) => failed.push(r.url()));
  await page.goto('./?fresh=1');
  await expect(page).toHaveTitle('Atlas · AtlaSlope');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://atlaslope.com/share.jpg');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.getByRole('link', { name: 'AtlaSlope home' })).toHaveAttribute('href', '../');
  await expect(page.getByRole('searchbox', { name: /Search/ })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Atlas' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#map')).toBeAttached();
  expect(failed).toEqual([]);
});

// UX sweep (17 Oct 2026): a tab that does nothing is hidden until the mastery map brings Progress.
test('the bar offers Atlas and Study, and no Progress tab yet', async ({ page }) => {
  await page.goto('./?fresh=1');
  await expect(page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Study' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Site' }).getByText('Progress')).toHaveCount(0);
});

// Owner, 18 Oct 2026: dark mode dropped; the page stays black and champagne on white whatever the system says.
test('the page stays light when the system is dark, with no theme switch', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./?fresh=1');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/);
  expect(await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--paper').trim())).toBe('#FFFFFF');
  await expect(page.getByText(/Dark interface/)).toHaveCount(0); // the logo's menu is gone too (website slice 2): the logo goes home
});

// Site visual review, 18 Oct 2026: the home page does the welcome, so the atlas shows a small note on moving the map instead of a card.
// It takes no focus (no ring on load), and goes at the first touch of the map.
test('the note on moving the map shows once, goes when the map is touched, and ?fresh=1 brings it back', async ({ page }) => {
  await page.goto('./?fresh=1');
  const welcome = page.getByRole('complementary', { name: 'Moving the map' });
  await expect(welcome).toBeVisible();
  await expect(page.locator('.card h1')).toHaveText('Spain');
  expect(await page.evaluate(() => !!document.activeElement?.closest('.gesture-hint'))).toBe(false);
  await page.locator('.maplibregl-canvas').click({ position: { x: 700, y: 400 } });
  await expect(welcome).toBeHidden();
  await page.goto('./');
  await expect(page.getByRole('link', { name: 'AtlaSlope home' })).toHaveAttribute('href', '../');
  await expect(welcome).toBeHidden();
  await page.goto('./?fresh=1');
  await expect(welcome).toBeVisible();
});

// Code review PR #77: with a black accent the focus ring went black on the black band; there it is champagne, elsewhere black
// (site visual review, 18 Oct 2026: the blue ring was off the palette).
test('keyboard focus shows a champagne ring on the black top bar', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto('./#place=rioja&page');
  await expect(page.locator('.pg-top')).toBeVisible();
  await page.locator('.pg-top a, .pg-top button').first().focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  const ring = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineColor);
  expect(await page.evaluate(() => !!document.activeElement?.closest('.pg-top'))).toBe(true);
  expect(ring).toBe('rgb(233, 216, 180)');
});
