import { expect, test, type Page } from '@playwright/test';

// The map in quiz mode: the Quiz door, hidden place names, and the way back. No tile requests in the UI-test build.

async function open(page: Page, hash = '') {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(`./${hash}`);
  await expect(page.locator('.card h1')).toBeVisible();
}

const visibleNames = (page: Page) => page.locator('.lbl.do:not(.quiz-answer):not(.quiz-miss)').evaluateAll((els) => els.filter((e) => (e as HTMLElement).style.visibility === 'visible').length);

test('Quiz in the top bar opens the quiz card, hides place names, and Back returns to Explore', async ({ page }) => {
  await open(page);
  await expect.poll(() => visibleNames(page)).toBeGreaterThan(0);

  await page.getByRole('navigation', { name: 'Mode' }).getByRole('button', { name: 'Quiz' }).click();
  await expect(page.locator('.card h1')).toHaveText('Study or review');
  await expect(page).toHaveURL(/#quiz/);
  await expect.poll(() => visibleNames(page)).toBe(0);
  await expect.poll(() => page.url()).toMatch(/#quiz&view=[^&]*,0,0$/); // flat and north up

  await page.goBack();
  await expect(page.locator('.card:visible h1')).toHaveText('Spain');
  await expect.poll(() => visibleNames(page)).toBeGreaterThan(0);
});

test('a #quiz link opens the quiz, and Explore in the top bar leaves it', async ({ page }) => {
  await open(page, '#quiz');
  await expect(page.locator('.card h1')).toHaveText('Study or review');
  await expect(page.getByRole('button', { name: 'Quiz' })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('link', { name: 'Explore' }).click();
  await expect(page.locator('.card:visible h1')).toHaveText('Spain');
  await expect(page).not.toHaveURL(/quiz/);
});

test('an unknown quiz sub-route is plain #quiz', async ({ page }) => {
  await open(page, '#quiz=nonsense');
  await expect(page.locator('.card h1')).toHaveText('Study or review');
});
