import { expect, test } from '@playwright/test';

// The app shell: top bar, theme, first run, link-only meta. (Kept in this file name so card 4 adds its own specs beside it.)
// ?fresh=1 exists only in the UI-test build; it forgets the first-run and theme choices.

test('the frame renders with the mode bar and no failed requests', async ({ page }) => {
  const failed: string[] = [];
  page.on('requestfailed', (r) => failed.push(r.url()));
  await page.goto('./?fresh=1');
  await expect(page).toHaveTitle('Atlaslope · The wine atlas that quizzes you');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.getByRole('button', { name: /^Atlaslope/ })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: /Search/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#map')).toBeAttached();
  expect(failed).toEqual([]);
});

test('Quiz and Progress are visible, disabled, and say why', async ({ page }) => {
  await page.goto('./?fresh=1');
  for (const name of ['Quiz', 'Progress']) {
    const item = page.getByRole('button', { name: new RegExp(`^${name}, coming soon$`) });
    await expect(item).toHaveAttribute('aria-disabled', 'true');
    await expect(item).toHaveAttribute('title', 'Coming soon');
  }
});

test('the theme toggle switches and is remembered', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('./?fresh=1');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'paper');
  await page.getByRole('button', { name: /^Atlaslope/ }).click();
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
  const welcome = page.getByRole('dialog', { name: 'Welcome to Atlaslope' });
  await expect(welcome).toBeVisible();
  await welcome.getByRole('button', { name: 'Start exploring' }).click();
  await expect(welcome).toBeHidden();
  await page.goto('./');
  await expect(page.getByRole('button', { name: /^Atlaslope/ })).toBeVisible();
  await expect(welcome).toBeHidden();
  await page.goto('./?fresh=1');
  await expect(welcome).toBeVisible();
});
