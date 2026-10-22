import { expect, test } from '@playwright/test';

// "Reset view" (QA round after release 10): after the learner tilts, turns or wanders, one button frames the open card again from the start camera.

test('Reset view levels a turned and tilted map back to the start camera, and is not offered in the quiz', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto('./#place=toro&view=-3.0000,40.0000,6.00,60,70');
  await expect(page.locator('.card h1')).toHaveText('Toro');
  const reset = page.getByRole('button', { name: 'Reset view' });
  await expect(page.getByRole('button', { name: 'Point north' })).toBeVisible(); // the restored view is turned

  await reset.click();
  await expect.poll(() => page.url()).toMatch(/view=[^&]*,0,45$/); // north up, the start tilt
  await expect(page.getByRole('button', { name: 'Point north' })).toBeHidden();

  await page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Learn' }).click();
  await expect(page.locator('.card.learn #qh')).toBeVisible();
  await expect(reset).toBeHidden();
});
