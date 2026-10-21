// Closed view against the live page (local preview of the built app, http://localhost:4173), desktop 1440 and phone 390.
// node Review/mock-story-guide-v4/shoot-closed.mjs   -> shots/closed-*.png, shots/live-*.png and a table of section boxes
import { chromium } from '../../node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
import path from 'path';
const here = path.dirname(fileURLToPath(import.meta.url));
const MOCK = 'file:///Users/djoeri/Developer/Atlaslope/mocks/story-guide-v4/index.html';
const LIVE = 'http://localhost:4173/#place=rioja&page';
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const IDS = ['place', 'weather', 'ground', 'rules', 'taste', 'short', 'producers', 'alike', 'sources'];

async function run(kind, w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  if (kind === 'closed') await ctx.addInitScript(() => { try { localStorage.setItem('atlaslope.story.mapClosed', '1'); } catch (e) {} });
  const p = await ctx.newPage();
  await p.goto(kind === 'live' ? LIVE : MOCK);
  await p.waitForTimeout(kind === 'live' ? 3000 : 2500);
  // the scroller: the live page scrolls inside .pg, the mock scrolls the window
  const S = kind === 'live' ? `document.querySelector('.pg')` : `document.scrollingElement`;
  const H = await p.evaluate((S) => eval(S).scrollHeight, S);
  for (let y = 0; y < H; y += 600) { await p.evaluate(([S, y]) => { eval(S).scrollTop = y; }, [S, y]); await p.waitForTimeout(120); } // loads lazy images
  await p.waitForTimeout(1500);
  const pre = kind === 'closed' ? '#closed #c-' : '#';
  const boxes = await p.evaluate(([S, pre, IDS, kind]) => {
    const sc = eval(S); sc.scrollTop = 0;
    const base = kind === 'live' ? document.querySelector('.pg-listing').getBoundingClientRect().top : document.querySelector('.pg-listing').getBoundingClientRect().top + scrollY;
    const off = kind === 'live' ? 0 : scrollY;
    const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top + off - base), Math.round(r.width), Math.round(r.height)]; };
    const out = { h1: box(document.querySelector('.pg-listing h1')), mosaic: box(document.querySelector('.pg-mosaic')), credits: box(document.querySelector('.pg-credits')), jump: box(document.querySelector('.pg-jump')) };
    for (const id of IDS) out[id] = box(document.querySelector(pre + id) || document.getElementById(id) || document.getElementById('c-' + id));
    out.total = sc.scrollHeight;
    return out;
  }, [S, pre, IDS, kind]);
  console.log(kind, w, JSON.stringify(boxes));
  // clip shots down the page, one viewport each
  const total = await p.evaluate((S) => eval(S).scrollHeight, S);
  let n = 0;
  for (let y = 0; y < total; y += h - 60) {
    await p.evaluate(([S, y]) => { eval(S).scrollTop = y; }, [S, y]);
    await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(here, 'shots', `${kind}-${w}-${String(++n).padStart(2, '0')}.png`) });
  }
  await ctx.close();
}
for (const [w, h] of [[1440, 900], [390, 844]]) { await run('live', w, h); await run('closed', w, h); }
await browser.close();
