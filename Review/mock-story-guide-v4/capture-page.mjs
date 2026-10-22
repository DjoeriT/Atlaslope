// Saves the rendered Rioja guide page and the app's CSS (no app code touched):
//   guide-page-rioja.html  the .pg-body element (header, mosaic, jump bar, every section), images inlined (800 px variant)
//   app-page.css           every rule of the built app's stylesheet, as the browser parsed it
// Needs: npm run build, then npx vite preview --port 4173. Run: node Review/mock-story-guide-v4/capture-page.mjs
import { chromium } from '../../node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
const here = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto('http://localhost:4173/#place=rioja&page');
await p.waitForSelector('#taste');
await p.waitForTimeout(2000);
for (const m of await p.locator('#rules button.more').all()) await m.click();
await p.waitForTimeout(300);
const out = await p.evaluate(async () => {
  const body = document.querySelector('.pg-body').cloneNode(true);
  const live = document.querySelector('.pg-body');
  const toData = async (url) => { const r = await fetch(url); const bl = await r.blob(); return await new Promise((ok) => { const f = new FileReader(); f.onload = () => ok(f.result); f.readAsDataURL(bl); }); };
  const imgs = [...body.querySelectorAll('img')], liveImgs = [...live.querySelectorAll('img')];
  for (let i = 0; i < imgs.length; i++) {
    const ss = (imgs[i].getAttribute('srcset') || '').split(',').map((s) => s.trim().split(' '));
    const pick = ss.find((s) => s[1] === '800w') || ss[ss.length - 1];
    const url = pick && pick[0] ? new URL(pick[0], document.baseURI).href : liveImgs[i].currentSrc || liveImgs[i].src;
    imgs[i].src = await toData(url);
    imgs[i].removeAttribute('srcset'); imgs[i].removeAttribute('sizes'); imgs[i].removeAttribute('loading');
  }
  body.querySelector('#map-tour')?.remove(); // Map tour band: opens the app's map, cannot work standalone
  body.querySelectorAll('[aria-current]').forEach((e) => e.removeAttribute('aria-current')); // the jump bar marker is set by script in the closed view
  const more = body.querySelectorAll('#rules button.more'); more.forEach((m) => m.remove());
  const css = [...document.styleSheets].flatMap((s) => [...s.cssRules].map((r) => r.cssText)).join('\n');
  return { html: body.outerHTML, css, controls: [...document.querySelectorAll('.pg-body button, .pg-body .showmap, .pg-mosaic a, .pg-mosaic button')].map((e) => e.tagName + '.' + e.className + ' ' + e.textContent.trim().slice(0, 30)) };
});
fs.writeFileSync(path.join(here, 'guide-page-rioja.html'), out.html);
fs.writeFileSync(path.join(here, 'app-page.css'), out.css);
console.log(out.html.length, out.css.length, out.controls);
await b.close();
