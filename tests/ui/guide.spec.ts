import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// Release 10: the terroir section on the Rioja page, its fly-there pills, and "Test me". Real content, no tiles (the map camera is not asserted, the address is).

interface Fly { label: string; caption: string; place?: string; point?: number[] }
interface Chapter { id: string; fly?: Fly[]; cards?: Array<{ fly: Fly }> }
const guide = JSON.parse(readFileSync('content/guides/rioja.json', 'utf8')) as { chapters: Chapter[] };
const pills = guide.chapters.flatMap((c) => [...(c.fly ?? []), ...(c.cards ?? []).map((k) => k.fly)].map((f, i) => ({ chapter: c.id, index: i, fly: f })));

async function open(page: Page, hash: string) {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(`./${hash}`);
  await expect(page.locator('h1').first()).toBeVisible();
}

test('the Rioja page has a Terroir section after the overview, with 7 pills and a link in the title row', async ({ page }) => {
  await open(page, '#place=rioja&page');
  expect(pills).toHaveLength(7);
  const ids = await page.locator('.pg main > section').evaluateAll((els) => els.map((e) => e.id));
  expect(ids.slice(0, 2)).toEqual(['overview', 'terroir']);
  await expect(page.locator('.pg-jump a').nth(1)).toHaveText('Terroir');
  await expect(page.locator('#terroir .kicker')).toHaveText('Terroir · 4-minute read');
  await expect(page.locator('#terroir h2')).toHaveText('Why Rioja tastes the way it does');
  await expect(page.locator('#terroir .fly')).toHaveCount(7);
  await expect(page.locator('#terroir .pg-zguide > div')).toHaveCount(3);
  await expect(page.locator('#terroir .pg-ch .src')).toHaveCount(4);
  await expect(page.locator('.pg-sub').getByRole('link', { name: 'terroir, 4-minute read' })).toBeVisible();
});

test('a place with no guide has no Terroir section', async ({ page }) => {
  await open(page, '#place=toro&page');
  await expect(page.locator('#terroir')).toHaveCount(0);
  await expect(page.locator('.pg-jump a', { hasText: 'Terroir' })).toHaveCount(0);
});

for (const { chapter, index, fly } of pills) {
  test(`pill "${fly.label}" lands on its caption, the address names it, Back returns to the chapter`, async ({ page }) => {
    await open(page, '#place=rioja&page');
    await page.getByRole('link', { name: `Show ${fly.label} on the map` }).click();
    await expect(page).toHaveURL(new RegExp(`#place=rioja&fly=${chapter}\\.${index}`));
    const cap = page.locator('.flycap');
    await expect(cap.locator('.kicker')).toHaveText('From the Rioja guide');
    await expect(cap.locator('h1')).toHaveText(fly.label);
    await expect(cap.locator('.cap')).toHaveText(fly.caption);
    await expect(cap.locator('.src a').first()).toBeVisible();
    await expect(page.locator('.pg')).toHaveCount(0);
    if (fly.point) await expect(page.locator('.flypin span')).toHaveText(fly.label);
    else await expect(page.locator('.flypin')).toHaveCount(0);

    await cap.getByRole('link', { name: 'Back to the guide' }).click();
    await expect(page).toHaveURL(new RegExp(`#place=rioja&page&at=${chapter}`));
    await expect(page.locator(`#terroir-${chapter}-h`)).toBeFocused();
    await expect(page.locator(`#terroir-${chapter}-h`)).toBeInViewport();
  });
}

test('a fly-there survives a reload; Escape and the close button leave the place card', async ({ page }) => {
  await open(page, '#place=rioja&fly=valley.0');
  await expect(page.locator('.flycap h1')).toHaveText('Haro to Alfaro, the whole valley');
  await page.reload();
  await expect(page.locator('.flycap h1')).toHaveText('Haro to Alfaro, the whole valley');
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/#place=rioja(&view=[^&]*)?$/);
  await expect(page.locator('.card h1')).toHaveText('Rioja');
  await page.goBack();
  await page.getByRole('button', { name: 'Close and stay on the map' }).click();
  await expect(page.locator('.card h1')).toHaveText('Rioja');
  await expect(page.locator('.flycap')).toHaveCount(0);
});

test('a fly address the guide does not have is just the place', async ({ page }) => {
  await open(page, '#place=rioja&fly=valley.9');
  await expect(page.locator('.card h1')).toHaveText('Rioja');
  await expect(page.locator('.flycap')).toHaveCount(0);
});

test('Test me on Rioja starts a review round on Rioja and its zones', async ({ page }) => {
  await open(page, '#place=rioja&page');
  const box = page.locator('.pg-testme');
  await expect(box).toContainText('Test me on Rioja');
  await expect(box).toContainText('A short round on Rioja and its zones: where they sit and what they are known for.');
  await box.getByRole('link', { name: 'Test me' }).click();
  await expect(page.locator('.q-num')).toContainText('Review');
  await expect(page).toHaveURL(/#quiz($|&view)/);
  await expect(page.locator('h1.intro-h')).toHaveText('Rioja');
});

test('Test me opens by address too: #quiz=test&set=...', async ({ page }) => {
  await open(page, '#quiz=test&set=rioja-alta,rioja-alavesa');
  await expect(page.locator('.q-num')).toContainText('Review');
  await expect(page.locator('h1.intro-h')).toHaveText(/^Rioja (Alta|Alavesa)$/);
});

test('a place with no zones and no guide shows Test me without "and its zones", as the last box before "Where it sits"', async ({ page }) => {
  await open(page, '#place=jumilla&page');
  const box = page.locator('.pg-testme');
  await expect(box).toContainText('Test me on Jumilla');
  await expect(box).toContainText('A short round on Jumilla: where they sit and what they are known for.');
  await expect(box).not.toContainText('zones');
  const order = await page.locator('.pg main > *').evaluateAll((els) => els.map((e) => e.id || e.className));
  expect(order.slice(-2)).toEqual(['pg-testme', 'where']);
});

test('the one-place Rioja region has no page of its own: its address opens the Rioja page', async ({ page }) => {
  await open(page, '#region=rioja&page');
  await expect(page.locator('.pg h1')).toHaveText('Rioja');
  await expect(page.locator('.rpage')).toHaveCount(0);
});
