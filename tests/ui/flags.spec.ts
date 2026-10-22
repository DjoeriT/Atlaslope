import { expect, test } from '@playwright/test';

// Key-place flags (owner card 18 Oct 2026, style B): name chips on the selected region only, a tap opens the sourced line and a fly-to.

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
});

test('Rioja shows its four key places; a tap opens the line, its source and Fly to', async ({ page }) => {
  await page.goto('./#place=rioja');
  await expect(page.locator('.card h1')).toHaveText('Rioja');
  await expect(page.locator('.mapflag')).toHaveText(['Haro', 'Sierra de Cantabria', 'Ebro', 'Alfaro']);

  const haro = page.getByRole('button', { name: 'Haro, key place' });
  await expect(haro).toBeVisible();
  await haro.click();
  await expect(haro).toHaveAttribute('aria-expanded', 'true');
  const pop = page.locator('.flagpop');
  await expect(pop.locator('h3')).toHaveText('Haro');
  await expect(pop).toContainText("Rioja's westernmost town.");
  await expect(pop.locator('.src a')).toHaveText('Pliego · pp. 15, 19');
  await expect(page.locator('.card h1')).toHaveText('Rioja'); // the tap did not select the place under the chip
  await expect(pop.getByRole('button', { name: 'Fly to Haro' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(pop).toHaveCount(0);
  await expect(haro).toBeFocused();
  await haro.press('Enter');

  await pop.getByRole('button', { name: 'Fly to Haro' }).click();
  await expect(pop).toHaveCount(0);
  await expect(haro).toHaveAttribute('aria-expanded', 'false');
});

test('a place without flags shows none, and Learn hides them', async ({ page }) => {
  await page.goto('./#place=toro');
  await expect(page.locator('.card h1')).toHaveText('Toro');
  await expect(page.locator('.mapflag')).toHaveCount(0);

  await page.goto('./#place=jerez');
  await expect(page.locator('.mapflag')).toHaveCount(5);
  await page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Learn' }).click();
  await expect(page.locator('.card.learn #qh')).toBeVisible();
  await expect(page.locator('.mapflag')).toHaveCount(0);
});
