import { expect, test, type Page } from '@playwright/test';

// Places coloured by climate with a legend, a switch to study-region colours, and the richer Spain and region cards
// (QA round after release 10, mock cards-climate-v2). No network; a fixed clock for the due counts.

const NOW = '2026-10-17T10:00:00Z';
// Rioja and Rioja Alta answered a week ago: the Rioja row (zones included) and the button count what the Today card counts.
// That they count memories, not places, is a unit test (tests/unit/climate.test.ts): a second memory needs weeks of answers.
const answer = (place: string, memory: string, i: number) => ({ kind: 'answer', place, memory, type: 'find-it', right: true, at: `2026-10-10T10:0${i}:00Z`, seconds: 3 });
const SEED = { version: 1, focus: [], savedAt: '', log: [answer('rioja', 'where', 0), answer('rioja-alta', 'where', 1)] };

async function open(page: Page, hash = '', seed?: unknown) {
  await page.addInitScript(([s]) => {
    localStorage.setItem('atlaslope-first-run', 'seen');
    if (s && !sessionStorage.getItem('seeded')) { localStorage.setItem('atlaslope.quiz', JSON.stringify(s)); sessionStorage.setItem('seeded', '1'); }
  }, [seed]);
  await page.goto(`./?now=${NOW}${hash}`);
  await expect(page.locator('.card h1')).toBeVisible();
}

test('the legend names the six climates, and the menu switches it to the study regions', async ({ page }) => {
  await open(page);
  const legend = page.getByRole('group', { name: 'Climate' });
  await expect(legend.locator('li')).toHaveText(['Oceanic', 'Humid, hot summers', 'Mediterranean, warm summers', 'Mediterranean, hot summers', 'Dry, cold winters', 'Hot and dry']);

  await page.getByRole('button', { name: 'Map layers' }).click();
  await page.getByRole('radio', { name: 'Study region' }).check();
  await expect(legend).toBeHidden();
  const regions = page.getByRole('group', { name: 'Study regions' });
  await expect(regions.locator('li')).toHaveCount(10);
  await expect(regions.locator('li').first()).toHaveText('Green Spain');

  await page.getByRole('checkbox', { name: 'Place boundaries' }).uncheck();
  await expect(regions).toBeHidden();
  await expect(page.getByRole('radio', { name: 'Climate' })).toBeDisabled();
  await expect(page.getByText('Turn on place boundaries to colour them')).toBeVisible();
});

test('the legend is not shown in the quiz', async ({ page }) => {
  await open(page, '#quiz');
  await expect(page.locator('.legend')).toHaveCount(0);
});

test('Spain and region cards show photo rows, main grapes and what is due, and Review opens the quiz', async ({ page }) => {
  await open(page, '', SEED);
  const today = Number((await page.locator('.card h1').textContent())?.match(/\d+/)?.[0]); // the Today card counts due memories
  expect(today).toBe(2);
  await page.locator('.card .close').click(); // the Today card
  const card = page.locator('.card');
  await expect(card.locator('h1')).toHaveText('Spain');
  const row = card.locator('.tiles li', { hasText: 'Rioja' }).first();
  await expect(row.locator('.due')).toHaveText(`${today} due`);
  await expect(row.locator('small')).toContainText('Tempranillo');

  await row.locator('a').click();
  await expect(card.locator('h1')).toHaveText('Rioja');
  await expect(card.getByRole('heading', { name: 'Main grapes here' })).toBeVisible();
  await expect(card.locator('.tiles li.sub')).toHaveCount(3); // the three Rioja zones under the DOCa
  await card.getByRole('link', { name: 'All of Spain' }).click();

  await card.getByRole('button', { name: `Start today's round · ${today} due` }).click();
  await expect(page).toHaveURL(/#quiz/);
});
