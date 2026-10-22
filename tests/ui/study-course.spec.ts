import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// "Learning for" on the Learn screen (Learn start card, 21 Oct 2026; was "My course", Study step 1): the setting, a round under WSET Level 2, the guide's why line and the guide link on a miss.
// A fixed clock (?now=) and a fresh browser; no network.

const places = JSON.parse(readFileSync('data/places.json', 'utf8')).places as Array<{ id: string; name: string }>;
const wset2 = (JSON.parse(readFileSync('content/curriculum.json', 'utf8')).wset.levels['2'] as string[])
  .map((id) => places.find((p) => p.id === id)!.name);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const oneOf = new RegExp(`^(${wset2.map(escape).join('|')})$`);
const NOW = '2026-10-17T10:00:00Z';

async function open(page: Page) {
  await page.addInitScript(() => localStorage.setItem('atlaslope-first-run', 'seen'));
  await page.goto(`./?now=${NOW}#quiz`);
}

test('pick a course: it is kept, and the round asks only its places', async ({ page }) => {
  test.slow();
  await open(page);
  await expect(page.locator('.for-btn')).toHaveText(/^All of Spain/);
  await page.locator('.for-btn').click();
  await page.getByRole('list', { name: 'Choose what you are learning for' }).getByRole('button', { name: /WSET Level 2 · Spain/ }).click();
  await expect(page.locator('.for-btn')).toHaveText(/^WSET Level 2 · Spain/);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('atlaslope.quiz')!).course)).toBe('wset-2-es');
  // The places shown up next are the course's too.
  for (const name of await page.getByRole('list', { name: 'The places up next' }).getByRole('listitem').allTextContents()) expect(wset2.some((w) => w.startsWith(name))).toBe(true);

  await page.getByRole('button', { name: /^(Begin with five places|Start with these five places)/ }).click();
  for (let i = 0; i < 5; i++) {
    await expect(page.locator('h1.intro-h')).toHaveText(oneOf);
    await page.getByRole('button', { name: 'Got it' }).click();
  }
  // Every question asks a WSET Level 2 place: the right choice is always one of them.
  for (let i = 0; i < 5; i++) {
    await expect(page.locator('.q')).toHaveText('What is this?');
    await page.getByRole('button', { name: "I don't know" }).click();
    await expect(page.locator('.choice.ok')).toHaveText(new RegExp(`^[A-D]${oneOf.source.slice(1)}`));
    const right = ((await page.locator('.choice.ok').textContent()) ?? '').slice(1);
    // A miss: the guide's why line, and a link to the guide.
    await expect(page.locator('dl.reveal dt', { hasText: 'From the guide' })).toBeVisible();
    await expect(page.getByRole('button', { name: `Read the ${right} guide` })).toBeVisible();
    await page.getByRole('button', { name: /Next question|See the result/ }).click();
  }
});
