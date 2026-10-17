import { expect, test } from '@playwright/test';

// The app shell: top bar, theme, first run, link-only meta. (Kept in this file name so card 4 adds its own specs beside it.)
// ?fresh=1 exists only in the UI-test build; it forgets the first-run and theme choices.

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

test('the theme toggle switches and is remembered', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('./?fresh=1');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'paper');
  await page.getByRole('button', { name: /^AtlaSlope/ }).click();
  await page.getByRole('menuitem', { name: /Dark interface/ }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.goto('./');
  await expect(html).toHaveAttribute('data-theme', 'dark');
});

test('the theme follows the system until a choice is made', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./?fresh=1');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
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
