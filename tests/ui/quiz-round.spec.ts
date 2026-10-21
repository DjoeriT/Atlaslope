import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { plannedRound } from './round-plan';

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

/** Through the five intros of day one: each "Got it" shows the next new place, not a question about the one just shown. */
async function pastIntros(page: Page, names: string[]) {
  for (const [i, name] of names.entries()) {
    await expect(page.locator('h1.intro-h')).toHaveText(name);
    await expect(page.locator('.q-num')).toContainText(`New place · ${i + 1} of ${names.length} today`);
    await page.getByRole('button', { name: 'Got it' }).click();
  }
  await expect(page.locator('.q')).toHaveText('What is this?');
}
/** Day one: five intros in a row, then their five what-is-this questions in another order. */
const dayOne = plannedRound(NOW);
const introNames = dayOne.filter((i) => i.kind === 'intro').map((i) => i.name);
const asked = dayOne.filter((i) => i.kind === 'question').map((i) => i.name);
const choice = (page: Page, name: string) => page.locator('.choice').filter({ hasText: new RegExp(`^[A-D]${escape(name)}$`) });
async function wrongChoice(page: Page, name: string) {
  await page.locator('.choice').filter({ hasNotText: new RegExp(`^[A-D]${escape(name)}$`) }).first().click();
}

test('a round: intros, a right answer moves on by itself, a miss waits, slip and undo, the miss comes back, the log has it all', async ({ page }) => {
  // A whole scripted round takes about 25 s alone (same on main, 17 Oct), too close to the 30 s default once the suite grew; release 9
  // runs timed it out under parallel load. More time, same assertions.
  test.slow();
  await start(page);

  // 1. Five new places shown in a row; intros are not numbered questions. Then the first question; a right answer moves on after about a second.
  expect(dayOne.map((i) => i.kind)).toEqual(['intro', 'intro', 'intro', 'intro', 'intro', 'question', 'question', 'question', 'question', 'question']);
  await expect(page.locator('.q-num')).toContainText('New place · 1 of 5 today · Study');
  expect(await dots(page)).toHaveLength(5);
  await pastIntros(page, introNames);
  const [first, second] = asked;
  await expect(page.locator('.q-num')).toContainText('Question 1 of 5 · Study');
  await choice(page, first).click();
  await expect(page.locator('.feedback')).toContainText(`Right, that's ${first}`);
  await expect(page.locator('.q-num')).toContainText('Question 2 of 5 · Study'); // moved on by itself

  // 2. A miss waits: the why line, Next, "That was a slip", the Read the guide link.
  await wrongChoice(page, second);
  await expect(page.locator('.feedback.bad')).toBeVisible();
  await expect(page.locator('dl.reveal dt', { hasText: 'From the guide' })).toBeVisible();
  await expect(page.getByRole('button', { name: `Read the ${second} guide` })).toBeVisible();
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
  // Each answer waits for its own question number: the step before still reads "What is this?" until the next one is in.
  for (const [i, name] of asked.slice(2).entries()) {
    await expect(page.locator('.q-num')).toContainText(`Question ${i + 3} of 6 · Study`);
    await expect(page.locator('.q')).toHaveText('What is this?');
    await choice(page, name).click();
    await expect(page.locator('.feedback')).toContainText('Right');
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
  await expect(page.getByRole('link', { name: 'Save a copy to a file' })).toHaveAttribute('href', '#study=progress-file');
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
  // Five scripted questions, like the round above; the step crossfade (PR #63) pushed it past the 30 s default (CI and local). More time, same assertions.
  test.slow();
  await start(page);
  await pastIntros(page, introNames);
  await wrongChoice(page, asked[0]);
  await page.getByRole('button', { name: 'That was a slip' }).click();
  expect((await log(page)).filter((e) => e.kind === 'answer')).toMatchObject([{ place: idOf(asked[0]), right: false, slip: true }]);
  await page.getByRole('button', { name: 'Next question' }).click();
  for (const [i, name] of asked.slice(1).entries()) {
    await expect(page.locator('.q-num')).toContainText(`Question ${i + 2} of 5 · Study`); // its own step, not the one just answered
    await expect(page.locator('.q')).toHaveText('What is this?');
    await choice(page, name).click();
    await expect(page.locator('.feedback')).toContainText('Right');
  }
  await expect(page.locator('h1.score')).toContainText('5 / 5');
});

test('keyboard only: Confirm and the four choices are reachable and the result is announced', async ({ page }) => {
  // Two places already learned and due: the round opens with a find it, then shows five new places.
  const core = places.filter((p) => p.quiz === 'core').slice(0, 2).map((p) => p.id);
  const old = (place: string, kind: string) => (kind === 'intro'
    ? { kind, place, at: '2026-10-10T10:00:00Z' }
    : { kind, place, memory: 'where', type: 'what-is-this', right: true, at: '2026-10-10T10:01:00Z', seconds: 4 });
  const seedLog = core.flatMap((id) => [old(id, 'intro'), old(id, 'answer')]);
  await start(page, { version: 1, focus: [], savedAt: '', log: seedLog });

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

  // It moves on by itself to the five new places in a row (the first by keyboard), then on to the first what-is-this, skipping any find it before it.
  const plan = plannedRound(NOW, seedLog as never);
  expect(plan.slice(0, 6).map((i) => i.kind)).toEqual(['question', 'intro', 'intro', 'intro', 'intro', 'intro']);
  // Each "Got it" only once its intro is on screen, as in quiz-doors (#83): a click before the step has changed lands on the step just left.
  const intros = plan.slice(1, 6);
  await expect(page.locator('h1.intro-h')).toHaveText(intros[0].name);
  await page.getByRole('button', { name: 'Got it' }).focus();
  await page.keyboard.press('Enter');
  for (const intro of intros.slice(1)) {
    await expect(page.locator('h1.intro-h')).toHaveText(intro.name);
    await page.getByRole('button', { name: 'Got it' }).click();
  }
  for (const step of plan.slice(6, plan.findIndex((i) => i.kind === 'question' && i.type === 'what-is-this'))) {
    await expect(page.locator('.q em')).toHaveText(step.name);
    await page.getByRole('button', { name: "I don't know" }).click();
    await page.getByRole('button', { name: 'Next question' }).click();
  }

  // The four choices: Tab reaches A, B, C and D in turn.
  // Tab only once the new step has put the keyboard on its question.
  await expect(page.locator('.q')).toHaveText('What is this?');
  await expect(page.locator('.q')).toBeFocused();
  for (const letter of 'ABCD') {
    await page.keyboard.press('Tab');
    await expect(page.locator('.choice:focus')).toHaveText(new RegExp(`^${letter}`));
  }
  await page.keyboard.press('Enter');
  await expect(page.locator('#result .feedback')).toBeVisible();
});

test('a double tap on "Got it" moves on one step and records the intro once', async ({ page }) => {
  // The second tap lands while the step change is still on its way, on the step being left (#83).
  await start(page);
  const intros = plannedRound(NOW).filter((i) => i.kind === 'intro');
  await expect(page.locator('h1.intro-h')).toHaveText(intros[0].name);
  await page.getByRole('button', { name: 'Got it' }).evaluate((b: HTMLElement) => { b.click(); b.click(); });
  await expect(page.locator('h1.intro-h')).toHaveText(intros[1].name);
  expect((await log(page)).filter((e) => e.kind === 'intro' && e.place === idOf(intros[0].name))).toHaveLength(1);
});
