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

test('the Rioja page tells why it tastes the way it does in four beats, with 7 pills and zone notes linking to the zone pages', async ({ page }) => {
  await open(page, '#place=rioja&page');
  expect(pills).toHaveLength(7);
  const ids = await page.locator('.pg main > section').evaluateAll((els) => els.map((e) => e.id));
  expect(ids.slice(0, 4)).toEqual(['place', 'weather', 'ground', 'rules']);
  await expect(page.locator('.pg-jump a').first()).toHaveText('The place');
  await expect(page.locator('.pg-spine .kicker')).toHaveCount(0); // one guide, one type: no kicker of its own (owner point 14)
  await expect(page.locator('.pg-spine #why-h')).toHaveText('Why Rioja tastes the way it does');
  await expect(page.locator('.pg main .fly')).toHaveCount(7);
  await expect(page.locator('#weather .pg-zguide > div')).toHaveCount(3);
  await expect(page.locator('#weather .pg-zguide a').first()).toHaveAttribute('href', /#place=rioja-/);
  await expect(page.locator('.pg main .pg-ch .src')).toHaveCount(4);
  await expect(page.locator('.pg-badges')).toContainText('4-minute read');
});

test('a place with no guide has no guide chapters', async ({ page }) => {
  await open(page, '?noguide=valdepenas#place=valdepenas&page');
  await expect(page.locator('.pg-ch')).toHaveCount(0);
  await expect(page.locator('.pg-zguide')).toHaveCount(0);
});

test('a place with no guide still answers "Why X tastes the way it does" in its four beats', async ({ page }) => {
  await open(page, '?noguide=valdepenas#place=valdepenas&page');
  await expect(page.locator('.pg-spine #why-h')).toHaveText('Why Valdepeñas tastes the way it does');
  const ids = await page.locator('.pg main > section.pg-beat').evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(['place', 'weather', 'ground', 'rules']);
  await expect(page.locator('#place-h')).toHaveText('The place');
  expect((await page.locator('.pg-jump a').allTextContents()).slice(0, 4)).toEqual(['The place', 'The weather', 'The ground', 'The rules']);
});

for (const { chapter, index, fly } of pills) {
  test(`pill "${fly.label}" lands on its caption, the address names it, Back returns to the chapter`, async ({ page }) => {
    await open(page, '#place=rioja&page');
    await page.getByRole('link', { name: `See ${fly.label} from above` }).click();
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
  await expect(box).toContainText('A short round in Learn on Rioja and its zones.');
  await box.getByRole('link', { name: 'Test me' }).click();
  await expect(page.locator('.q-num')).toContainText('Review');
  await expect(page).toHaveURL(/#learn($|&view)/);
  await expect(page.locator('h1.intro-h')).toHaveText('Rioja');
});

test('Test me opens by address too: #quiz=test&set=...', async ({ page }) => {
  await open(page, '#quiz=test&set=rioja-alta,rioja-alavesa');
  await expect(page.locator('.q-num')).toContainText('Review');
  await expect(page.locator('h1.intro-h')).toHaveText(/^Rioja (Alta|Alavesa)$/);
});

test('a place with no zones and no guide shows Test me without "and its zones", as the last box before Sources', async ({ page }) => {
  await open(page, '?noguide=valdepenas#place=valdepenas&page');
  const box = page.locator('.pg-testme');
  await expect(box).toContainText('Test me on Valdepeñas');
  await expect(box).toContainText('A short round in Learn on Valdepeñas.');
  await expect(box).not.toContainText('zones');
  // C3: Test me and Next in the course share one closing row, then Sources.
  const order = await page.locator('.pg main > *').evaluateAll((els) => els.map((e) => e.id || e.className));
  expect(order.slice(-2)).toEqual(['pg-end', 'sources']);
  await expect(page.locator('.pg-end > .pg-testme + .pg-next')).toHaveCount(1);
});

test('the one-place Rioja region has no page of its own: its address opens the Rioja page', async ({ page }) => {
  await open(page, '#region=rioja&page');
  await expect(page.locator('.pg h1')).toHaveText('Rioja');
  await expect(page.locator('.rpage')).toHaveCount(0);
});
