import { expect, test, type Page } from '@playwright/test';

// Three touching squares (tests/ui/fixtures/three.geojson): Albar | Bierzo Bajo | Cerro Alto, lat 40 to 41.
const centre = { Albar: [-3.5, 40.5], 'Bierzo Bajo': [-2.5, 40.5], 'Cerro Alto': [-1.5, 40.5] } as const;

async function open(page: Page) {
  await page.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
  await page.goto('/?fixture=three');
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
}

/** Pixel position of a lng/lat on the page, via the dev-only map handle. */
const toPixel = (page: Page, lngLat: readonly number[]) =>
  page.evaluate((ll) => {
    const map = (window as unknown as { __paraje: { project(ll: number[]): { x: number; y: number }; getContainer(): HTMLElement } }).__paraje;
    const p = map.project(ll);
    const r = map.getContainer().getBoundingClientRect();
    return { x: p.x + r.left, y: p.y + r.top };
  }, lngLat as number[]);

const waitForMoveEnd = (page: Page) =>
  page.waitForFunction(() => !(window as unknown as { __paraje: { isMoving(): boolean } }).__paraje.isMoving());

test('tapping a polygon opens its card with its two neighbours', async ({ page }) => {
  await open(page);
  const { x, y } = await toPixel(page, centre['Bierzo Bajo']);
  await page.mouse.click(x, y);
  await expect(page.locator('#card-title')).toHaveText('Bierzo Bajo');
  await expect(page.locator('#card')).toContainText('DOCa · Denominación de Origen Calificada');
  await expect(page.locator('#card')).toContainText('Navarra and Aragón');
  // Neighbours are filled in just after the card paints; toHaveText waits for them.
  await expect(page.locator('#card .neighbours button')).toHaveText(['Albar', 'Cerro Alto']);
});

test('a neighbour opens its own card, and Escape closes it', async ({ page }) => {
  await open(page);
  await page.fill('#search', 'bierzo');
  await page.keyboard.press('Enter');
  await page.locator('#card .neighbours button', { hasText: 'Albar' }).click();
  await expect(page.locator('#card-title')).toHaveText('Albar');
  await expect(page.locator('#card .neighbours button')).toHaveText(['Bierzo Bajo']);
  await page.keyboard.press('Escape');
  await expect(page.locator('#card')).toBeHidden();
});

test('focus goes back to the search box when the card closes, and to the views button when its menu closes', async ({ page }) => {
  await open(page);
  await page.fill('#search', 'albar');
  await page.keyboard.press('Enter');
  await expect(page.locator('#card')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#card')).toBeHidden();
  await expect(page.locator('#search')).toBeFocused();
  await page.click('#views-btn');
  await expect(page.locator('#views-menu button').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#views-menu')).toBeHidden();
  await expect(page.locator('#views-btn')).toBeFocused();
});

test('the close button closes the card', async ({ page }) => {
  await open(page);
  await page.fill('#search', 'albar');
  await page.keyboard.press('Enter');
  await page.click('#card-close'); // a real click: fails if anything sits on top of the button
  await expect(page.locator('#card')).toBeHidden();
});

test('search picks a DO, accents and case ignored', async ({ page }) => {
  await open(page);
  await page.fill('#search', 'CERRO');
  await page.locator('#search-results button', { hasText: 'Cerro Alto' }).click();
  await expect(page.locator('#card-title')).toHaveText('Cerro Alto');
  await expect(page.locator('#search-results')).toBeHidden();
});

test('the theme button flips data-theme and remembers it', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await open(page);
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'paper');
  await page.click('#theme');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('#theme')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
});

test('at 1024 wide the card never covers the selected polygon', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await open(page);
  for (const name of Object.keys(centre) as Array<keyof typeof centre>) {
    await page.fill('#search', name);
    await page.keyboard.press('Enter');
    await expect(page.locator('#card-title')).toHaveText(name);
    await waitForMoveEnd(page);
    const card = (await page.locator('#card').boundingBox())!;
    const [lng, lat] = centre[name];
    for (const corner of [[lng - 0.5, lat - 0.5], [lng - 0.5, lat + 0.5], [lng + 0.5, lat - 0.5], [lng + 0.5, lat + 0.5]]) {
      const p = await toPixel(page, corner);
      const inside = p.x >= card.x && p.x <= card.x + card.width && p.y >= card.y && p.y <= card.y + card.height;
      expect(inside, `${name} corner ${corner} under the card`).toBe(false);
      expect(p.x, `${name} corner on screen`).toBeLessThanOrEqual(1024);
    }
  }
});

test('preset views list Spain and close the card when chosen', async ({ page }) => {
  await open(page);
  await page.fill('#search', 'albar');
  await page.keyboard.press('Enter');
  await page.click('#views-btn');
  await expect(page.locator('#views-btn')).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#views-menu button', { hasText: 'Spain' }).click();
  await expect(page.locator('#card')).toBeHidden();
  await expect(page.locator('#views-menu')).toBeHidden();
});
