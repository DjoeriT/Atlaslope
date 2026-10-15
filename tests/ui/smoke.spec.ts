import { expect, test } from '@playwright/test';

test('the page loads with an empty fixture map and no network', async ({ page }) => {
  await page.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
  await page.goto('/?fixture=empty');
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#status')).toHaveText('Fixture: empty');
});
