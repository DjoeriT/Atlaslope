import { expect, test } from '@playwright/test';

// The app shell: top bar, one light theme, first run, link-only meta. (Kept in this file name so card 4 adds its own specs beside it.)
// ?fresh=1 exists only in the UI-test build; it forgets the first-run choice.

test('the frame renders with the mode bar and no failed requests', async ({ page }) => {
  const failed: string[] = [];
  page.on('requestfailed', (r) => failed.push(r.url()));
  await page.goto('./?fresh=1');
  await expect(page).toHaveTitle('AtlaSlope · The Wine Study Atlas');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://atlaslope.com/share.png');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.getByRole('button', { name: /^AtlaSlope/ })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: /Search/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#map')).toBeAttached();
  expect(failed).toEqual([]);
});

// UX sweep (17 Oct 2026): a tab that does nothing is hidden until the mastery map brings Progress.
test('the mode bar offers Explore and Quiz, and no Progress tab yet', async ({ page }) => {
  await page.goto('./?fresh=1');
  await expect(page.getByRole('button', { name: 'Quiz', exact: true })).toBeEnabled();
  await expect(page.getByRole('navigation', { name: /mode/i }).getByText('Progress')).toHaveCount(0);
});

// Owner, 18 Oct 2026: dark mode dropped; the page stays black and champagne on white whatever the system says.
test('the page stays light when the system is dark, and the menu has no theme switch', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./?fresh=1');
  await page.getByRole('button', { name: 'Start exploring' }).click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/);
  expect(await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--paper').trim())).toBe('#FFFFFF');
  await page.getByRole('button', { name: /^AtlaSlope/ }).click();
  await expect(page.getByRole('menuitem', { name: /Dark interface/ })).toHaveCount(0);
});

test('the first-run screen shows once, and ?fresh=1 brings it back', async ({ page }) => {
  await page.goto('./?fresh=1');
  const welcome = page.getByRole('dialog', { name: 'Welcome to AtlaSlope' });
  await expect(welcome).toBeVisible();
  await welcome.getByRole('button', { name: 'Start exploring' }).click();
  await expect(welcome).toBeHidden();
  await page.goto('./');
  await expect(page.getByRole('button', { name: /^AtlaSlope/ })).toBeVisible();
  await expect(welcome).toBeHidden();
  await page.goto('./?fresh=1');
  await expect(welcome).toBeVisible();
});

// Code review PR #77: with a black accent the focus ring went black on the black band; there it is champagne, elsewhere blue.
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
