// Saves the rendered Rioja place page sections (no app code touched) to guide-rest-rioja.json.
// Needs: npm run build, then npx vite preview --port 4173. Run: node Review/mock-story-guide-v4/extract-rest.mjs
import { chromium } from '../../node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
const here = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage();
await p.goto('http://localhost:4173/#place=rioja&page=1');
await p.waitForSelector('#taste');
await p.waitForTimeout(1500);
for (const m of await p.locator('#rules button.more').all()) await m.click(); // open "and 8 more" so the full grape list is saved
await p.waitForTimeout(300);
const out = await p.evaluate(() => {
  const html = (id, sel) => { const e = document.getElementById(id); const t = sel ? e.querySelector(sel) : e; return t ? t.outerHTML : ''; };
  return {
    facts: Object.fromEntries(['place', 'weather', 'ground', 'rules'].map((id) => [id, html(id, '.pg-facts')])),
    taste: html('taste'), short: html('short'), producers: html('producers'),
  };
});
fs.writeFileSync(path.join(here, 'guide-rest-rioja.json'), JSON.stringify(out, null, 1));
console.log(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, typeof v === 'string' ? v.length : Object.fromEntries(Object.entries(v).map(([a, c]) => [a, c.length]))])));
await b.close();
