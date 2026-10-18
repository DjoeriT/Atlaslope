import { expect, test, type Page } from '@playwright/test';

// UX sweep (17 Oct 2026, owner cards "Full set", "Drag, 3 stops", "Skip it"): End round asks first, the phone card is a sheet with
// three stops, both full pages share one header bar over the map's controls, Escape steps back, and screen changes run as view transitions.

const NOW = '2026-10-17T10:00:00Z';
const PHONE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };

async function open(page: Page, hash = '') {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(`./?now=${NOW}${hash}`);
}

test('End round asks first; Keep going stays, and ending early says the round stopped', async ({ page }) => {
  await open(page, '#quiz');
  await page.getByRole('button', { name: 'Learn 5 new places' }).click();
  await page.getByRole('button', { name: 'End round' }).click();
  const ask = page.getByRole('alertdialog', { name: /End this round\?/ });
  await expect(ask).toBeVisible();
  await expect(page.getByRole('button', { name: 'Keep going' })).toBeFocused();
  await page.getByRole('button', { name: 'Keep going' }).click();
  await expect(ask).toHaveCount(0);
  await expect(page.locator('h1.intro-h')).toBeVisible();

  await page.getByRole('button', { name: 'End round' }).click();
  await ask.getByRole('button', { name: 'End round' }).click();
  await expect(page.locator('.card .kicker').first()).toHaveText(/^Round stopped · Study$/);
  await expect(page.locator('.card .lede')).toContainText('You stopped after 0 of');
  await expect(page.locator('.card')).not.toContainText('All done for today');
  await expect(page.getByRole('button', { name: 'Start a new round' })).toBeVisible();
});

test('the place and region pages share the page bar, drawn over the legend and map buttons', async ({ page }) => {
  for (const hash of ['#place=toro&page', '#region=castilla-y-leon&page']) {
    await open(page, hash);
    const bar = page.locator('.pg-top');
    await expect(bar).toHaveCount(1);
    await expect(bar.getByRole('searchbox')).toBeVisible();
    // One bar on every page (site visual review, 18 Oct 2026): Atlas is current, no Back to map beside it, the logo at the window's edge.
    await expect(bar.getByRole('link', { name: 'Atlas', exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(bar.getByRole('link', { name: 'Back to map' })).toHaveCount(0);
    expect(await bar.locator('.brand').evaluate((el) => el.getBoundingClientRect().left)).toBe(16);
    // nothing of the map shows through: the middle of the legend's box is the page (once any screen change has settled)
    await expect(page.locator('html')).not.toHaveAttribute('data-motion', /./);
    const covered = await page.evaluate(() => {
      const legend = document.querySelector('.legend');
      if (!legend) return true;
      const r = legend.getBoundingClientRect();
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return !!hit?.closest('.pg, .rpage');
    });
    expect(covered).toBe(true);
  }
});

test('Escape closes a page, then steps up from the card, but not while typing in search', async ({ page }) => {
  await open(page, '#region=castilla-y-leon');
  await page.locator('.card .tiles a', { hasText: 'Toro' }).click();
  await expect(page.locator('.card h1')).toHaveText('Toro');
  await page.getByRole('link', { name: 'Open the Toro page' }).click();
  await expect(page.locator('.pg h1')).toHaveText('Toro');
  await page.keyboard.press('Escape');
  await expect(page.locator('.pg')).toHaveCount(0);
  await expect(page.locator('.card h1')).toHaveText('Toro');
  await page.getByRole('searchbox', { name: /Search/ }).fill('rib');
  await page.keyboard.press('Escape');
  await expect(page.locator('.card h1')).toHaveText('Toro');
  await page.locator('.card h1').focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('.card h1')).toHaveText('Castilla y León');
});

test('the region card closes to Spain and its one main button names the page', async ({ page }) => {
  await open(page, '#region=castilla-y-leon');
  const card = page.locator('.card');
  await expect(card.locator('.foot a')).toHaveCount(1);
  await expect(card.locator('.foot a')).toHaveText('Open the Castilla y León page');
  await card.getByRole('link', { name: 'Close, back to Spain' }).click();
  await expect(card.locator('h1')).toHaveText('Spain');
});

test('a card change runs as a view transition, and none runs under reduced motion', async ({ page }) => {
  await open(page, '#region=castilla-y-leon');
  await page.evaluate(() => {
    (window as unknown as { seen: string[] }).seen = [];
    new MutationObserver(() => {
      const m = document.documentElement.dataset.motion;
      if (m) (window as unknown as { seen: string[] }).seen.push(m);
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
  });
  await page.locator('.card .tiles a', { hasText: 'Toro' }).click();
  await expect(page.locator('.card h1')).toHaveText('Toro');
  await page.getByRole('link', { name: 'Open the Toro page' }).click();
  await expect(page.locator('.pg h1')).toHaveText('Toro');
  expect(await page.evaluate(() => (window as unknown as { seen: string[] }).seen)).toEqual(['card', 'page-open']);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.pg-top').getByRole('link', { name: 'Atlas', exact: true }).click();
  await expect(page.locator('.card h1')).toHaveText('Toro');
  expect(await page.evaluate(() => (window as unknown as { seen: string[] }).seen)).toEqual(['card', 'page-open']);
});

test.describe('on a phone', () => {
  test.use(PHONE);

  test('the card is a sheet with three stops: the handle steps through them, peek hides the photo and keeps the main button', async ({ page }) => {
    await open(page, '#place=rioja-alta');
    const sheet = page.locator('.sheet.phone');
    const grab = page.getByRole('button', { name: /^Card size: half/ });
    await expect(sheet).toHaveAttribute('data-stop', 'half');
    await grab.focus();
    await page.keyboard.press('ArrowUp');
    await expect(sheet).toHaveAttribute('data-stop', 'full');
    const full = (await sheet.boundingBox())!.height;
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(sheet).toHaveAttribute('data-stop', 'peek');
    await expect(page.getByRole('button', { name: /^Card size: small/ })).toHaveAttribute('aria-expanded', 'false');
    await expect(sheet.locator('.cover')).toBeHidden();
    await expect(page.getByRole('link', { name: 'Open the Rioja Alta page' })).toBeVisible();
    expect(await sheet.locator('.scroll').evaluate((el) => (el as HTMLElement).inert)).toBe(true);
    await page.waitForTimeout(400); // the height eases into place
    expect((await sheet.boundingBox())!.height).toBeLessThan(full / 2);
    // Enter, the usual button key, opens it again
    await page.keyboard.press('Enter');
    await expect(sheet).toHaveAttribute('data-stop', 'half');
  });

  test('the map buttons sit above the sheet, and a new card opens at half', async ({ page }) => {
    await open(page, '#place=rioja-alta');
    await page.keyboard.press('Tab'); // nothing; the handle is used below
    await page.getByRole('button', { name: /^Card size/ }).focus();
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(400);
    const [buttons, sheet] = await Promise.all([page.locator('.bottomright').boundingBox(), page.locator('.sheet.phone').boundingBox()]);
    expect(buttons!.y + buttons!.height).toBeLessThanOrEqual(sheet!.y);
    await page.getByRole('link', { name: 'Close, back to Rioja' }).click();
    await expect(page.locator('.sheet.phone')).toHaveAttribute('data-stop', 'half');
  });

  test('one row on top: logo mark, search and the two tabs; no zoom buttons', async ({ page }) => {
    await open(page);
    const [brand, tabs] = await Promise.all([page.locator('.brand').boundingBox(), page.locator('.sitebar nav').boundingBox()]);
    expect(Math.abs(brand!.y - tabs!.y)).toBeLessThan(12);
    await expect(page.getByRole('button', { name: 'Zoom in' })).toBeHidden();
    await expect(page.getByRole('searchbox')).toHaveAttribute('placeholder', 'Search');
  });
});
