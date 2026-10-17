import { expect, test, type Page } from '@playwright/test';

// Mobile check (17 Oct 2026, owner: "weird navigation and other weirdness"): phone layouts, search over the card,
// the Explore tab and Back to map in the history, and the quiz card's scroll between steps. No network.

const PHONE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const PHONE_LANDSCAPE = { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true };

async function open(page: Page, hash = '') {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(`./${hash}`);
  await expect(page.locator('.card h1')).toBeVisible();
}

/** The middle of the element is the element itself (or inside it), not something drawn over it. */
async function onTop(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
  });
}

test('search results show above the open card', async ({ page }) => {
  await open(page, '#region=rioja');
  await page.getByRole('searchbox', { name: /Search/ }).fill('rib');
  await expect(page.locator('.results a').first()).toBeVisible();
  expect(await onTop(page, '.results a')).toBe(true);
  await page.locator('.results a').filter({ hasText: 'Ribera del Duero' }).click();
  await expect(page.locator('.card h1')).toHaveText('Ribera del Duero');
});

test('the Explore tab goes back to Spain without reloading the page', async ({ page }) => {
  await open(page, '#place=rioja-alta');
  await page.evaluate(() => { (window as unknown as { marker: number }).marker = 1; });
  await page.getByRole('link', { name: 'Explore' }).click();
  await expect(page.locator('.card h1')).toHaveText('Spain');
  expect(await page.evaluate(() => (window as unknown as { marker?: number }).marker)).toBe(1);
  await page.goBack();
  await expect(page.locator('.card h1')).toHaveText('Rioja Alta');
});

test('Back to map steps back, so the back button does not reopen the page just closed', async ({ page }) => {
  await open(page, '#region=rioja');
  await page.locator('.card a').filter({ hasText: 'Rioja Alta' }).first().click();
  await expect(page.locator('.card h1')).toHaveText('Rioja Alta');
  await page.getByText('Read the full page').click();
  await expect(page.locator('.pg')).toBeVisible();
  await page.getByText('Back to map').click();
  await expect(page.locator('.pg')).toHaveCount(0);
  await expect(page.locator('.card h1')).toHaveText('Rioja Alta');
  await page.goBack();
  await expect(page.locator('.card h1')).toHaveText('Rioja');
  await expect(page.locator('.pg')).toHaveCount(0);
});

test.describe('on a phone', () => {
  test.use(PHONE);

  test('the legend folds into a button that opens the list', async ({ page }) => {
    await open(page);
    const toggle = page.locator('.legend-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('.legend li').first()).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.legend li')).toHaveCount(6);
    await expect(page.locator('.legend li').first()).toBeVisible();
  });

  test('the map menu is wholly on screen and above the top bar', async ({ page }) => {
    await open(page, '#region=rioja');
    await page.getByRole('button', { name: 'Map layers' }).click();
    const menu = page.locator('.menu.br');
    const box = (await menu.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(await menu.evaluate((el) => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
    expect(await onTop(page, '.menu.br label')).toBe(true);
    await page.getByRole('radio', { name: 'Study region' }).check();
    await expect(page.getByRole('group', { name: 'Study regions' })).toBeVisible();
  });

  test('the search field is at least 16 px, so iPhone Safari does not zoom into it', async ({ page }) => {
    await open(page);
    const size = await page.locator('.search input').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size).toBeGreaterThanOrEqual(16);
  });

  test('each quiz step starts at the top of the card', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
    await page.goto('./?now=2026-10-17T10:00:00Z#quiz');
    await page.getByRole('button', { name: /Learn 5 new places/ }).click();
    const name = (await page.locator('h1.intro-h').textContent())!;
    await page.getByRole('button', { name: 'Got it, ask me' }).click();
    await expect(page.locator('.q')).toHaveText('What is this?');
    // A wrong pick: the result shows at the top of the card, then the next step opens scrolled to the top.
    await page.locator('.choice').filter({ hasNotText: name }).first().click();
    await expect(page.locator('#result')).toContainText('The answer is');
    expect(await onTop(page, '#result')).toBe(true);
    await page.getByRole('button', { name: 'Next question' }).click();
    await expect(page.locator('h1.intro-h')).toBeVisible();
    await expect(page.locator('.card .body').first()).toHaveJSProperty('scrollTop', 0);
  });
});

test.describe('on a phone held sideways', () => {
  test.use(PHONE_LANDSCAPE);

  test('the legend is folded and the map menu fits', async ({ page }) => {
    await open(page, '#region=rioja');
    await expect(page.locator('.legend-toggle')).toBeVisible();
    await page.getByRole('button', { name: 'Map layers' }).click();
    const box = (await page.locator('.menu.br').boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(390);
    expect(await onTop(page, '.menu.br label')).toBe(true);
  });
});
