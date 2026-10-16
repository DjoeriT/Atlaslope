import { expect, test } from '@playwright/test';

// The restart placeholder: the built site loads under the Pages subpath, says Atlaslope, and is kept out of search engines.
test('the placeholder page loads with the new name and noindex', async ({ page }) => {
  const failed: string[] = [];
  page.on('requestfailed', (r) => failed.push(r.url()));
  await page.goto('./');
  await expect(page).toHaveTitle('Atlaslope');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Atlaslope');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  expect(failed).toEqual([]);
});
