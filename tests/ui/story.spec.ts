import { expect, test, type Page } from '@playwright/test';

// "Read with the map" (the story view): the button, the step that follows the scroll, the geology credit, the fact marker keys, Escape.
// Real content; outside hosts (tiles, the IGME geology service) are blocked, so only the page's own state is asserted (active step, credit text, focus, address).

async function open(page: Page, hash: string) {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
  await page.goto(`./${hash}`);
}
const active = (page: Page) => page.locator('.story-step[aria-current="step"]');
async function scrollToStep(page: Page, id: string) {
  await page.locator(`.story-step[data-step="${id}"]`).evaluate((el) => el.scrollIntoView({ block: 'start' }));
}

test('the button shows on the Rioja guide page and not on a guide without a story', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await expect(page.locator('a.story-open')).toBeVisible();
  await open(page, '#place=valdepenas&page');
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('a.story-open')).toHaveCount(0);
});

test('opening it lands on the story address; the soils step becomes active and the credit names the IGME geology', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await page.locator('a.story-open').click();
  await expect(page).toHaveURL(/#place=rioja&page&story(&view=.*)?$/);
  await expect(active(page)).toHaveAttribute('data-step', 'intro');
  await scrollToStep(page, 'soils');
  await expect(active(page)).toHaveAttribute('data-step', 'soils');
  await expect(page.locator('.story-credit')).toContainText('Source: IGME, MAGNA 50');
});

test('a fact marker opens with Enter, Escape closes it and focus returns to the marker', async ({ page }) => {
  await open(page, '#place=rioja&page&story');
  await scrollToStep(page, 'valley');
  await expect(active(page)).toHaveAttribute('data-step', 'valley');
  await expect(page.getByRole('button', { name: /^Fact: / }).first()).toBeVisible(); // MapLibre must not rename it "Map marker"
  const marker = page.locator('.story-fk').first();
  await marker.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.story-factpop')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.story-factpop')).toHaveCount(0);
  await expect(marker).toBeFocused();
  await expect(page).toHaveURL(/#place=rioja&page&story(&view=.*)?$/); // the first Escape only closed the card
});

test('Escape on the story returns to the guide page', async ({ page }) => {
  await open(page, '#place=rioja&page&story');
  await expect(page.locator('.story')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/#place=rioja&page(&view=.*)?$/);
  await expect(page.locator('a.story-open')).toBeVisible();
});
