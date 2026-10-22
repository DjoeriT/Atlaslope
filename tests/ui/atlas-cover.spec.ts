import { expect, test } from '@playwright/test';

// The atlas cover (owner, 22 Oct 2026, E1): the empty address opens it; Open Spain leads to the Spain card, whose Atlas link comes back.
test('Atlas opens the cover, Open Spain opens the Spain card, and its Atlas link returns', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto('./');
  const h1 = page.locator('.card h1');
  await expect(h1).toHaveText('See where your wine comes from');
  await expect(page.getByRole('heading', { name: 'Countries' })).toBeVisible();
  await expect(page.locator('.atlas-totals')).toContainText('wine places');
  await page.getByRole('link', { name: 'Open Spain' }).click();
  await expect(h1).toHaveText('Spain');
  expect(page.url()).toContain('#country=spain');
  await page.locator('.crumb').getByRole('link', { name: 'Atlas' }).click();
  await expect(h1).toHaveText('See where your wine comes from');
  expect(new URL(page.url()).hash).toBe('');
});
