// Toggle, reload and reopen checks for the closed (guide page) view: node Review/mock-story-guide-v4/check-toggle.mjs
import { chromium } from '../../node_modules/playwright/index.mjs';
const URL = 'file:///Users/djoeri/Developer/Atlaslope/mocks/story-guide-v4/index.html';
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto(URL); await p.waitForTimeout(2500);
const st = () => p.evaluate(() => { const m = window.sgMap, c = m.getCenter(); return { off: document.body.classList.contains('map-off'), stored: localStorage.getItem('atlaslope.story.mapClosed'), btn: document.querySelector('.mapbtn').textContent, z: +m.getZoom().toFixed(1), pitch: Math.round(m.getPitch()), lat: +c.lat.toFixed(3), moving: m.isMoving(), chip: document.querySelector('.chip').textContent }; });
const click = () => p.locator('.mapbtn').evaluate((b) => b.click());
const key = (e) => e.textContent.replace(/\s+/g, ' ').trim().replace(/^\d+(?=\D)/, '').slice(0, 70);
console.log('default', JSON.stringify(await st()));

// 1. open at the second paragraph of "A valley with walls" (no stop of its own), close: same paragraph, same height
await p.evaluate(() => { document.querySelectorAll('.text .step[data-view="valley"] .main > p')[1].scrollIntoView({ block: 'center' }); });
await p.waitForTimeout(3500);
const before = await p.evaluate(() => { const mid = 56 + (innerHeight - 56) * 0.45; const b = [...document.querySelectorAll('.step-in .main > *, .step-in .aside > *')].find((x) => { const r = x.getBoundingClientRect(); return r.height > 0 && r.bottom > mid; }); window.__b = b.textContent.trim().slice(0, 40); return { text: window.__b, top: Math.round(b.getBoundingClientRect().top) }; });
await click(); await p.waitForTimeout(500);
const after = await p.evaluate(() => { const t = window.__b; const e = [...document.querySelectorAll('#closed p')].find((x) => x.textContent.trim().startsWith(t)); return e ? { top: Math.round(e.getBoundingClientRect().top), in: e.closest('section').id } : null; });
console.log('closing: paragraph', JSON.stringify(before), '-> closed', JSON.stringify(after), JSON.stringify(await st()));
await p.screenshot({ path: 'Review/mock-story-guide-v4/shots/closed-after-toggle.png' });

// 2. reload: still closed
await p.reload(); await p.waitForTimeout(2500);
console.log('reload', JSON.stringify(await st()));

// 3. closed, move to the Haro stop card, reopen: map jumps to Haro, no flight
await p.evaluate(() => document.querySelector('#closed .stop[data-view="haro"]').scrollIntoView({ block: 'center' }));
await p.waitForTimeout(500);
await click(); await p.waitForTimeout(500);
console.log('reopen at Haro card', JSON.stringify(await st()));
await p.waitForTimeout(5000);
console.log('  later', JSON.stringify(await st()));

// 4. next stop flies: scroll to the taste step
await p.evaluate(() => document.querySelectorAll('.text .step[data-view="rest"]')[0].scrollIntoView({ block: 'center' }));
await p.waitForTimeout(800);
console.log('next stop', JSON.stringify(await st()));
await p.waitForTimeout(9000);

// 5. closed at "In short", reopen: rest view
await click(); await p.waitForTimeout(500);
await p.evaluate(() => document.querySelector('#closed #c-short').scrollIntoView({ block: 'start' }));
await p.waitForTimeout(500);
await click(); await p.waitForTimeout(600);
console.log('reopen from In short', JSON.stringify(await st()));
// 6. a paragraph of the weather beat reopens at the climate view
await click(); await p.waitForTimeout(500);
await p.evaluate(() => document.querySelector('#closed #c-weather .pg-ch > p').scrollIntoView({ block: 'center' }));
await p.waitForTimeout(500);
await click(); await p.waitForTimeout(600);
console.log('reopen from weather paragraph', JSON.stringify(await st()));
await browser.close();
