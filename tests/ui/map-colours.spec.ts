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
  await expect(legend.locator('li')).toHaveText([
    'Oceanic rain all year, mild summers', 'Humid subtropical rain all year, hot summers', 'Mild Mediterranean dry, warm summers',
    'Hot Mediterranean dry, hot summers', 'Cold semi-arid dry, cold winters', 'Hot semi-arid and desert dry and hot',
  ]);
  await expect(legend.locator('li').first()).toHaveAttribute('title', 'Köppen Cfb');

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

test('Spain and region cards show photo tiles with headlines, main grapes on the region card, and no Study counts even with progress', async ({ page }) => {
  await open(page, '', SEED);
  const card = page.locator('.card');
  // The Atlas shows no Study items (owner, 18 Oct 2026): the Spain card, not the Today card, and no due counts.
  await expect(card.locator('h1')).toHaveText('Spain');
  await expect(page.getByRole('region', { name: 'Today' })).toHaveCount(0);
  await expect(card.locator('.due, .duebar')).toHaveCount(0);
  const row = card.locator('.tiles li', { hasText: 'Rioja' }).first();
  // The tile carries the kind and a sourced headline (owner points 15 and 16, 18 Oct 2026); grapes moved to the region card's chips.
  await expect(row.locator('small')).toHaveText('DOCa');
  await expect(row.locator('em')).toHaveText(/\S/);

  // Rioja is a one-place region, so its row opens the Rioja DOCa itself (owner card, 17 Oct 2026)
  await row.locator('a').click();
  await expect(card.locator('h1')).toHaveText('Rioja');
  await expect(page).toHaveURL(/#place=rioja(&|$)/);
  await expect(card.locator('.zrow li')).toHaveCount(3); // the three Rioja zones
  await card.getByRole('link', { name: 'Close, back to Spain' }).click();
  await card.locator('.tiles li', { hasText: 'Castilla y León' }).locator('a').click();
  await expect(card.locator('h1')).toHaveText('Castilla y León');
  await expect(card.getByRole('heading', { name: 'Main grapes here' })).toBeVisible();
  await expect(card.locator('.due')).toHaveCount(0);
});
