import { expect, test, type Page } from '@playwright/test';

// "Map tour" folded into the guide page (owner 21 Oct 2026, layout A): the band, the map column beside the guide, the stop that follows
// the scroll, the geology credit, the fact marker keys, Hide map, and the old story address.
// Real content; outside hosts (tiles, the IGME geology service) are blocked, so only the page's own state is asserted (active step, credit text, focus, address).

async function open(page: Page, hash: string) {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
  await page.goto(`./${hash}`);
}
const mapCol = (page: Page) => page.locator('.pg.tour .pg-tourmap');
async function scrollTo(page: Page, selector: string) {
  await page.locator(selector).first().evaluate((el) => el.scrollIntoView({ block: 'start' }));
}

test('the band shows on the Rioja guide in place of "Show on map", and not on a guide without a tour', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await expect(page.locator('.pg-tour')).toContainText('Map tour · 9 places to fly to');
  await expect(page.locator('a.story-open')).toHaveText('Open the map');
  await expect(page.locator('.pg-actions')).toHaveCount(0);
  await open(page, '#place=valdepenas&page');
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('a.story-open')).toHaveCount(0);
  await expect(page.locator('.pg-actions .btn')).toBeVisible();
});

test('opening the map keeps the guide beside it; scrolling to the soils makes that the stop and credits the IGME geology', async ({ page }) => {
  await open(page, '#place=rioja&page');
  await page.locator('a.story-open').click();
  await expect(page).toHaveURL(/#place=rioja&page&story(&view=.*)?$/);
  await expect(mapCol(page)).toBeVisible();
  await expect(mapCol(page)).toHaveAttribute('data-step', 'intro');
  await expect(page.locator('.pg-climate')).toBeVisible(); // the guide's own charts stay
  await expect(page.locator('#taste')).toBeAttached();
  await scrollTo(page, '#terroir-soils');
  await expect(mapCol(page)).toHaveAttribute('data-step', 'soils');
  await expect(page.locator('.pg-tourcap')).toContainText('Stop 7 of 9');
  await expect(page.locator('.pg-tourmap .story-credit')).toContainText('Source: IGME, MAGNA 50');
});

test('a fly link flies the map to its stop, without leaving the guide', async ({ page }) => {
  await open(page, '#place=rioja&page&story');
  await expect(mapCol(page)).toBeVisible();
  await page.locator('#terroir-barrel a.fly').first().click();
  await expect(mapCol(page)).toHaveAttribute('data-step', 'haro');
  await expect(page).toHaveURL(/#place=rioja&page&story(&view=.*)?$/);
});

test('a fact marker opens with Enter, Escape closes it and focus returns to the marker', async ({ page }) => {
  await open(page, '#place=rioja&page&story');
  await scrollTo(page, '#terroir-valley');
  await expect(mapCol(page)).toHaveAttribute('data-step', 'valley');
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

test('Hide map returns to the plain guide', async ({ page }) => {
  await open(page, '#place=rioja&page&story');
  await expect(mapCol(page)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Hide map' })).toBeFocused(); // focus follows the map open
  await page.getByRole('button', { name: 'Hide map' }).click();
  await expect(page).toHaveURL(/#place=rioja&page(&view=.*)?$/);
  await expect(page.locator('.pg-tourmap')).toHaveCount(0);
  await expect(page.locator('a.story-open')).toBeVisible();
  await expect(page.locator('a.story-open')).toBeFocused(); // and back to "Open the map" on hide
});

test('the map column comes after the guide in reading order, and the band still is out of reach of keyboard and screen readers', async ({ page }) => {
  await open(page, '#place=rioja&page&story');
  await expect(mapCol(page)).toBeVisible();
  const after = await page.locator('.pg-listing').evaluate((el) => !!(el.compareDocumentPosition(document.querySelector('.pg-tourmap')!) & Node.DOCUMENT_POSITION_FOLLOWING));
  expect(after).toBe(true);
  await open(page, '#place=rioja&page');
  await expect(page.locator('.pg-tour-still')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.pg-tour-still')).toHaveAttribute('inert', '');
});
