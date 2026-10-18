import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { plannedRound } from './round-plan';

// The Quiz screen's doors, focus, practise any mix, the progress file, the Today card, the manifest and the way back from a place card.
// A fixed clock (?now=) and a seeded browser; no network.

const places = JSON.parse(readFileSync('data/places.json', 'utf8')).places as Array<{ id: string; name: string; quiz: string }>;
const core = places.filter((p) => p.quiz === 'core');
const NOW = '2026-10-17T10:00:00Z';
const answer = (place: string, at: string) => ({ kind: 'answer', place, memory: 'where', type: 'find-it', right: true, at, seconds: 3 });
/** Three places learned a week ago: their `where` memories are due. */
const SEED = { version: 1, focus: [], savedAt: '', log: core.slice(0, 3).map((p, i) => answer(p.id, `2026-10-10T10:0${i}:00Z`)) };
const stored = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('atlaslope.quiz') ?? '{"log":[],"focus":[]}') as { log: unknown[]; focus: string[] });

async function open(page: Page, hash: string, seed?: unknown) {
  await page.addInitScript(([s]) => {
    localStorage.setItem('atlaslope-first-run', 'seen');
    if (s && !sessionStorage.getItem('seeded')) { localStorage.setItem('atlaslope.quiz', JSON.stringify(s)); sessionStorage.setItem('seeded', '1'); }
  }, [seed]);
  await page.goto(`./?now=${NOW}${hash}`);
}

test('the Quiz screen has two doors with the due and new counts; nothing due offers five new places', async ({ page }) => {
  await open(page, '#quiz', SEED);
  await expect(page.locator('.card h1')).toHaveText('Study or review');
  await expect(page.locator('.door').first().locator('.big')).toHaveText('3 due and 5 new today');
  await expect(page.locator('.door').first().locator('.sub')).toContainText('New today:');
  await expect(page.getByRole('button', { name: /^Start today's round · \d+ questions$/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Practise any mix' })).toBeVisible();
});

test('with nothing due the Study door offers five new places', async ({ page }) => {
  await open(page, '#quiz');
  await expect(page.locator('.door').first()).toContainText('Nothing due today');
  await expect(page.getByRole('button', { name: 'Learn 5 new places' })).toBeVisible();
  await expect(page.locator('.focusline')).toContainText('none, following the course');
});

test('focus: Save changes the new places, Clear then Undo brings the picks back, Close saves nothing', async ({ page }) => {
  await open(page, '#quiz', SEED);
  const newToday = () => page.locator('.door').first().locator('.sub').textContent();
  const before = await newToday();

  await page.getByRole('link', { name: 'Set a focus' }).click();
  await expect(page).toHaveURL(/#quiz=focus/);
  const chips = page.getByRole('group', { name: 'Regions in your focus' }).getByRole('checkbox');
  const last = chips.last();
  await last.click();
  await expect(last).toHaveAttribute('aria-checked', 'true');
  const regionName = (await last.textContent())!;

  // Close without saving: nothing stored.
  await page.getByRole('link', { name: 'Close without saving' }).click();
  expect((await stored(page)).focus).toEqual([]);

  await page.getByRole('link', { name: 'Set a focus' }).click();
  await page.getByRole('group', { name: 'Regions in your focus' }).getByRole('checkbox').last().click();
  await page.getByRole('button', { name: 'Save focus' }).click();
  await expect(page.locator('.focusline')).toContainText(regionName);
  expect((await stored(page)).focus).toHaveLength(1);
  await expect(page.locator('.door').first().locator('.sub')).toContainText('from your focus');
  expect(await newToday()).not.toBe(before);

  // Clear, then Undo, in the focus screen.
  await page.getByRole('link', { name: 'Change' }).click();
  const chip = page.getByRole('group', { name: 'Regions in your focus' }).getByRole('checkbox').last();
  await expect(chip).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('button', { name: 'Clear focus' }).click();
  await expect(chip).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('status').filter({ hasText: 'Focus cleared.' })).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(chip).toHaveAttribute('aria-checked', 'true');

  // Clear and save: the course order carries on.
  await page.getByRole('button', { name: 'Clear focus' }).click();
  await page.getByRole('button', { name: 'Save: follow the course' }).click();
  await expect(page.locator('.focusline')).toContainText('none, following the course');
  expect(await newToday()).toBe(before);
});

test('practise any mix: ticks, the partial state, the real count, a review round', async ({ page }) => {
  await open(page, '#quiz=practise', SEED);
  await expect(page.getByRole('button', { name: 'Pick at least one place' })).toBeVisible();
  const first = page.locator('.tree > li').first();
  await first.locator('details').evaluate((d: HTMLDetailsElement) => { d.open = true; });
  const region = first.locator('summary input');
  const inner = first.locator('details ul input');
  const count = await inner.count();

  await region.check();
  await expect(inner.first()).toBeChecked();
  expect(await inner.evaluateAll((els) => els.every((e) => (e as HTMLInputElement).checked))).toBe(true);
  await expect(page.getByRole('button', { name: new RegExp(`^Start · \\d+ questions? on ${count} places?$`) })).toBeVisible();

  if (count > 1) {
    await inner.first().uncheck();
    await expect(region).toHaveJSProperty('indeterminate', true);
    await expect(region).not.toBeChecked();
    await expect(page.getByRole('button', { name: new RegExp(`on ${count - 1} places?$`) })).toBeVisible();
  }
  await page.getByRole('radio', { name: '10' }).click();
  await page.getByRole('button', { name: /^Start · / }).click();
  await expect(page.locator('.q-num')).toContainText('Review');
  await expect(page).toHaveURL(/#quiz($|&)/);
});

test('progress file: save downloads JSON, load restores the log, Undo brings the earlier one back, a bad file changes nothing', async ({ page }) => {
  await open(page, '#quiz', SEED);
  await page.getByRole('button', { name: 'AtlaSlope' }).click();
  await page.getByRole('menuitem', { name: 'Save or load progress' }).click();
  await expect(page).toHaveURL(/#quiz=progress-file/);
  await expect(page.locator('.facts')).toContainText('3 answers since');
  await expect(page.getByText('Add AtlaSlope to your Home Screen')).toBeVisible();

  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Save to a file' }).click()]);
  expect(download.suggestedFilename()).toBe('atlaslope-progress-2026-10-17.json');
  const text = readFileSync((await download.path())!, 'utf8');
  expect(JSON.parse(text).log).toHaveLength(3);
  await expect(page.locator('.facts')).toContainText('atlaslope-progress-2026-10-17.json');

  const input = page.getByLabel('Progress file to load', { exact: true });
  const bad = { name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"nonsense": true}') };
  await input.setInputFiles(bad);
  await expect(page.getByRole('alert')).toContainText('Nothing was changed');
  expect((await stored(page)).log).toHaveLength(3);

  const one = { version: 1, focus: [], savedAt: '2026-10-15T08:00:00Z', log: [answer(core[5].id, '2026-10-15T08:00:00Z')] };
  await input.setInputFiles({ name: 'one.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(one)) });
  await expect(page.getByRole('status').filter({ hasText: 'Loaded: 1 answer' })).toBeVisible();
  expect((await stored(page)).log).toHaveLength(1);
  await expect(page.locator('.facts')).toContainText('1 answer since');

  await page.getByRole('button', { name: 'Undo' }).click();
  expect((await stored(page)).log).toHaveLength(3);
  await expect(page.locator('.facts')).toContainText('3 answers since');
});

test('blocked storage: the quiz still opens and says progress will not be kept', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  await page.goto(`./?now=${NOW}#quiz`);
  await expect(page.locator('#qh')).toHaveText('Study or review');
  await expect(page.getByRole('status').filter({ hasText: "can't be kept" })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Learn 5 new places' })).toBeVisible();
});

test('Home has no Today card before there is progress', async ({ page }) => {
  await open(page, '');
  await expect(page.locator('.card h1')).toHaveText('Spain');
  await expect(page.getByRole('region', { name: 'Today' })).toHaveCount(0);
});

test('Home shows the Today card once there is progress; closing it shows the Spain card; Start plays the round', async ({ page }) => {
  await open(page, '', SEED);
  const card = page.getByRole('region', { name: 'Today' });
  await expect(card.locator('h1')).toHaveText('3 due');
  await expect(card).toContainText('new places today');
  await card.getByRole('button', { name: 'Close, show the map' }).click();
  await expect(page.locator('.card h1')).toHaveText('Spain');

  await page.reload();
  await page.getByRole('region', { name: 'Today' }).getByRole('button', { name: 'Review 3 due' }).click();
  await expect(page.locator('.q-num')).toContainText('Study');
});

test('the manifest is linked and parses', async ({ page, request }) => {
  await page.goto('./');
  const href = await page.locator('link[rel=manifest]').getAttribute('href');
  expect(href).toBeTruthy();
  const res = await request.get(new URL(href!, page.url()).toString());
  expect(res.ok()).toBe(true);
  const manifest = await res.json();
  expect(manifest).toMatchObject({ name: 'AtlaSlope', display: 'standalone', start_url: './' });
  // Home Screen and install icons (polish slice): each one resolves as a PNG.
  expect(manifest.icons.map((i: { sizes: string; purpose?: string }) => `${i.sizes} ${i.purpose ?? 'any'}`)).toEqual(['192x192 any', '512x512 any', '512x512 maskable']);
  for (const icon of manifest.icons) {
    const r = await request.get(new URL(icon.src, res.url()).toString());
    expect(r.ok()).toBe(true);
    expect(r.headers()['content-type']).toContain('image/png');
  }
});

test('a place card opened from the quiz comes back to the same question', async ({ page }) => {
  await open(page, '#quiz');
  await page.getByRole('button', { name: 'Learn 5 new places' }).click();

  // The intro: More about, and back.
  const name = (await page.locator('h1.intro-h').textContent())!;
  await page.getByRole('button', { name: `More about ${name}` }).click();
  await expect(page.locator('.card:visible h1:not(.intro-h)')).toHaveText(name);
  await page.getByRole('button', { name: /Back to the quiz/ }).click();
  await expect(page.locator('h1.intro-h')).toHaveText(name);
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Got it' }).click();

  // A miss: Open the card, and back to the same reveal.
  await expect(page.locator('.q')).toHaveText('What is this?');
  const target = plannedRound(NOW).find((i) => i.kind === 'question')!.name;
  await page.locator('.choice').filter({ hasNotText: new RegExp(`^[A-D]${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }).first().click();
  await expect(page.locator('.feedback.bad')).toBeVisible();
  const question = await page.locator('.q-num').textContent();
  const feedback = await page.locator('.feedback').textContent();
  await page.getByRole('button', { name: `Open ${target}'s card` }).click();
  await expect(page.locator('.card:visible h1:not(.intro-h)')).toHaveText(target);
  await page.getByRole('button', { name: /Back to the quiz/ }).click();
  await expect(page.locator('.q-num')).toHaveText(question!);
  await expect(page.locator('.feedback')).toHaveText(feedback!);
  await expect(page.locator('.choice[disabled]').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Back to the quiz' })).toHaveCount(0);
});
