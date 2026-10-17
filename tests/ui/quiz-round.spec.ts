import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// Playing a Study round with a fixed clock (?now=) and a fresh browser. No tile requests in the UI-test build; a tap on the map is
// window.__quizPick(id), which does what the map's click handler does.

const places = (JSON.parse(readFileSync('data/places.json', 'utf8')).places as Array<{ id: string; name: string; quiz: string }>);
const idOf = (name: string) => places.find((p) => p.name === name)!.id;
const NOW = '2026-10-17T10:00:00Z';
const log = (page: Page) => page.evaluate(() => (JSON.parse(localStorage.getItem('atlaslope.quiz') ?? '{"log":[]}').log as Array<Record<string, unknown>>));
const dots = (page: Page) => page.locator('.dots i').evaluateAll((els) => els.map((e) => e.className));
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function start(page: Page, seed?: unknown) {
  await page.addInitScript(([s]) => {
    localStorage.setItem('atlaslope-first-run', 'seen');
    if (s && !sessionStorage.getItem('seeded')) { localStorage.setItem('atlaslope.quiz', JSON.stringify(s)); sessionStorage.setItem('seeded', '1'); }
  }, [seed]);
  await page.goto(`./?now=${NOW}#quiz`);
  await page.getByRole('button', { name: /Start today's round|Learn 5 new places/ }).click();
}

/** On an intro: read the name, go on to its what-is-this question. */
async function pastIntro(page: Page): Promise<string> {
  const name = (await page.locator('h1.intro-h').textContent())!;
  await page.getByRole('button', { name: 'Got it, ask me' }).click();
  await expect(page.locator('.q')).toHaveText('What is this?');
  return name;
}
const choice = (page: Page, name: string) => page.locator('.choice').filter({ hasText: new RegExp(`^[A-D]${escape(name)}$`) });
async function wrongChoice(page: Page, name: string) {
  await page.locator('.choice').filter({ hasNotText: new RegExp(`^[A-D]${escape(name)}$`) }).first().click();
}

test('a round: intros, a right answer moves on by itself, a miss waits, slip and undo, the miss comes back, the log has it all', async ({ page }) => {
  await start(page);

  // 1. A new place: its intro is not a numbered question. A right answer moves on after about a second.
  await expect(page.locator('.q-num')).toContainText('New place · 1 of 5 today · Study');
  expect(await dots(page)).toHaveLength(5);
  const first = await pastIntro(page);
  await expect(page.locator('.q-num')).toContainText('Question 1 of 5 · Study');
  await choice(page, first).click();
  await expect(page.locator('.feedback')).toContainText(`Right, that's ${first}`);
  await expect(page.locator('h1.intro-h')).toBeVisible(); // moved on by itself, to the next intro

  // 2. A miss waits: the why line, Next, "That was a slip", the place's card.
  const second = await pastIntro(page);
  await wrongChoice(page, second);
  await expect(page.locator('.feedback.bad')).toBeVisible();
  await expect(page.locator('dl.reveal dt', { hasText: 'Why' })).toBeVisible();
  await expect(page.getByRole('button', { name: `Open ${second}'s card` })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next question' })).toBeVisible();
  expect((await dots(page))[1]).toBe('bad');

  // "That was a slip" turns the dot green; Undo turns it back.
  await page.getByRole('button', { name: 'That was a slip' }).click();
  expect((await dots(page))[1]).toBe('ok');
  await expect(page.getByRole('status').filter({ hasText: 'Counted as right.' })).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  expect((await dots(page))[1]).toBe('bad');
  await expect(page.getByRole('button', { name: 'That was a slip' })).toBeVisible();
  await page.getByRole('button', { name: 'Next question' }).click();

  // 3. The other three, right.
  for (let i = 0; i < 3; i++) {
    const name = await pastIntro(page);
    await choice(page, name).click();
    await expect(page.locator('.feedback')).toContainText('Right');
    await expect(page.locator('h1.intro-h, .q:has-text("Find")')).toBeVisible();
  }

  // 4. The missed place comes back at the end: now a find it, six questions in all.
  await expect(page.locator('.q')).toContainText(`Find ${second}`);
  await expect(page.locator('.q-num')).toContainText('Question 6 of 6 · Study');
  await expect(page.getByRole('button', { name: 'Confirm' })).toBeDisabled();
  await page.evaluate((id) => (window as unknown as { __quizPick: (id: string) => void }).__quizPick(id), idOf(second));
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.locator('.feedback')).toContainText(`Right, that's ${second}`);
  // The last right answer moves on by itself, to the round end.

  // 5. The round end: score over first asks, the miss linking to its card, Today, then Done for today.
  await expect(page.locator('h1.score')).toContainText('4 / 5');
  await expect(page.getByRole('link', { name: second })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Save a copy to a file' })).toHaveAttribute('href', '#quiz=progress-file');
  await expect(page.getByRole('button', { name: 'Done for today' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Learn 5 extra places' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Practise any mix' })).toBeVisible();

  // 6. After a reload the log has every answer: 5 intros, 5 first answers and the re-ask, with seconds taken.
  await page.reload();
  const entries = await log(page);
  expect(entries.filter((e) => e.kind === 'intro')).toHaveLength(5);
  const answers = entries.filter((e) => e.kind === 'answer');
  expect(answers).toHaveLength(6);
  expect(answers.map((a) => a.right)).toEqual([true, false, true, true, true, true]);
  expect(answers.every((a) => typeof a.seconds === 'number' && !a.slip)).toBe(true);
  expect(answers[1]).toMatchObject({ place: idOf(second), type: 'what-is-this', memory: 'where' });
  expect(answers[5]).toMatchObject({ place: idOf(second), type: 'find-it' });
});

test('a slip is kept in the log, and the miss is not asked again', async ({ page }) => {
  await start(page);
  const first = await pastIntro(page);
  await wrongChoice(page, first);
  await page.getByRole('button', { name: 'That was a slip' }).click();
  expect((await log(page)).filter((e) => e.kind === 'answer')).toMatchObject([{ place: idOf(first), right: false, slip: true }]);
  await page.getByRole('button', { name: 'Next question' }).click();
  for (let i = 0; i < 4; i++) {
    const name = await pastIntro(page);
    await choice(page, name).click();
    if (i < 3) await expect(page.locator('h1.intro-h')).toBeVisible();
  }
  await expect(page.locator('h1.score')).toContainText('5 / 5');
});

test('keyboard only: Confirm and the four choices are reachable and the result is announced', async ({ page }) => {
  // Two places already learned and due, so the round opens with find it questions.
  const core = places.filter((p) => p.quiz === 'core').slice(0, 2).map((p) => p.id);
  const old = (place: string, kind: string) => (kind === 'intro'
    ? { kind, place, at: '2026-10-10T10:00:00Z' }
    : { kind, place, memory: 'where', type: 'what-is-this', right: true, at: '2026-10-10T10:01:00Z', seconds: 4 });
  await start(page, { version: 1, focus: [], savedAt: '', log: core.flatMap((id) => [old(id, 'intro'), old(id, 'answer')]) });

  await expect(page.locator('.q')).toContainText('Find');
  const target = (await page.locator('.q em').textContent())!;
  await page.evaluate((id) => (window as unknown as { __quizPick: (id: string) => void }).__quizPick(id), idOf(target));
  await expect(page.locator('.status')).toContainText('Press Confirm');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Confirm' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#result')).toHaveAttribute('aria-live', 'assertive');
  await expect(page.locator('#result')).toContainText(`Right, that's ${target}`);
  await expect(page.locator('#result')).toBeFocused();

  // It moves on by itself to a find it for the other place; skip that one with "I don't know".
  await expect(page.locator('.q')).toContainText('Find');
  await expect(page.locator('.q em')).not.toHaveText(target);
  await page.getByRole('button', { name: "I don't know" }).click();
  await page.getByRole('button', { name: 'Next question' }).click();

  // An intro, then the four choices: Tab reaches A, B, C and D in turn.
  await expect(page.locator('h1.intro-h')).toBeVisible();
  await page.getByRole('button', { name: 'Got it, ask me' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.q')).toHaveText('What is this?');
  for (const letter of 'ABCD') {
    await page.keyboard.press('Tab');
    await expect(page.locator('.choice:focus')).toHaveText(new RegExp(`^${letter}`));
  }
  await page.keyboard.press('Enter');
  await expect(page.locator('#result .feedback')).toBeVisible();
});
