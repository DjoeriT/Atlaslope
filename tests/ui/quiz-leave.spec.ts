import { expect, test, type Page } from '@playwright/test';

// Leaving the quiz for Explore (owner, 18 Oct 2026: "I was in Explore but it still prompted me on what I had open on the quiz").
// Explore shows no quiz prompt once the learner moves on; the round waits, and the Quiz tab picks it up where it was. No network.

const NOW = '2026-10-17T10:00:00Z';

async function open(page: Page, hash: string) {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(`./?now=${NOW}${hash}`);
}

async function startRound(page: Page) {
  await open(page, '#quiz');
  await page.getByRole('button', { name: 'Learn 5 new places' }).click();
  return (await page.locator('h1.intro-h').textContent())!;
}

test('Back to the quiz shows only on the card opened from the quiz, not once the learner explores elsewhere', async ({ page }) => {
  const name = await startRound(page);
  await page.getByRole('button', { name: `More about ${name}` }).click();
  await expect(page.locator('.card:visible h1:not(.intro-h)')).toHaveText(name);
  await expect(page.getByRole('button', { name: /Back to Study/ })).toBeVisible();

  // Escape steps up to the region: that is exploring, so the quiz prompt goes.
  await page.keyboard.press('Escape');
  await expect(page.locator('.card:visible h1:not(.intro-h)')).not.toHaveText(name);
  await expect(page.getByRole('button', { name: /Back to Study/ })).toHaveCount(0);

  // Opening the same place again from search is exploring too: no quiz prompt on it.
  const box = page.getByRole('searchbox', { name: /Search/ });
  await box.fill(name.split(' ')[0]);
  await page.getByRole('list', { name: 'Search results' }).getByRole('link', { name: new RegExp(`^${name.split(' ')[0]}`) }).first().click();
  await expect(page.locator('.card:visible h1:not(.intro-h)')).toHaveText(name);
  await expect(page.getByRole('button', { name: /Back to Study/ })).toHaveCount(0);

  // The round waited: the Quiz tab comes back to the same intro.
  await page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Study' }).click();
  await expect(page.locator('h1.intro-h')).toHaveText(name);
});

test('the Explore tab mid-round leaves the quiz behind, and the Quiz tab picks the round up again', async ({ page }) => {
  const name = await startRound(page);
  await page.getByRole('button', { name: 'Got it' }).click();
  await expect(page.locator('h1.intro-h')).toBeVisible();
  await expect(page.locator('h1.intro-h')).not.toHaveText(name);
  const second = await page.locator('h1.intro-h').textContent();

  await page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Atlas' }).click();
  await expect(page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Atlas' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('h1.intro-h')).toBeHidden();
  await expect(page.getByRole('button', { name: /Back to Study/ })).toHaveCount(0);

  await page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Study' }).click();
  await expect(page.locator('h1.intro-h')).toHaveText(second!);
});
