// Extracts the real Rioja guide page (markup + app CSS, images inlined) and the Guides page, from `vite preview` on :4789.
// Output: real/guide.html, real/guides.html, real/app.css (all git-ignored scratch inside this folder is committed small; see README).
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const B = 'http://localhost:4789';
const out = new URL('./real/', import.meta.url).pathname;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 900 } });

async function grab(hash, sel, name) {
  await p.goto(B + '/#' + hash);
  await p.waitForTimeout(2500);
  // scroll the whole page once so reveal-on-scroll and lazy charts render before the markup is taken
  await p.evaluate(async () => { const s = document.querySelector('.pg'); if (!s) return; for (let y = 0; y < s.scrollHeight; y += 500) { s.scrollTop = y; await new Promise((r) => setTimeout(r, 250)); } s.scrollTop = 0; });
  await p.waitForTimeout(1500);
  const html = await p.evaluate(async (sel) => {
    const el = document.querySelector(sel) || document.body;
    const clone = el.cloneNode(true);
    for (const img of clone.querySelectorAll('img')) {
      try {
        const r = await fetch(img.currentSrc || img.src);
        const bl = await r.blob();
        const d = await new Promise((ok) => { const f = new FileReader(); f.onload = () => ok(f.result); f.readAsDataURL(bl); });
        img.src = d; img.removeAttribute('srcset');
      } catch (e) { /* keep */ }
    }
    return clone.outerHTML;
  }, sel);
  fs.writeFileSync(out + name, html);
  console.log(name, html.length);
}
await grab('place=rioja&page', '.pg', 'guide.html');
await p.goto(B + '/#guides');
await p.waitForTimeout(2000);
console.log(await p.evaluate(() => document.body.innerText.slice(0, 400)));
console.log(await p.evaluate(() => [...document.styleSheets].map((s) => s.href).join(',')));
await b.close();
