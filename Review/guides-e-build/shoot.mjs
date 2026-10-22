// Shots of the built Guides page (npm run build; npx vite preview --port 4174) at 1440, 834, 390, folded and unfolded; prints page heights.
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:4174/guides/';
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [834, 1100], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(url);
  await p.waitForLoadState('networkidle');
  await p.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; }));
  await p.waitForTimeout(800);
  for (const state of ['folded', 'unfolded']) {
    if (state === 'unfolded') await p.click('#morebtn');
    await p.waitForTimeout(300);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    console.log(w, state, H);
    await p.screenshot({ path: `Review/guides-e-build/shots/guides-${state}-${w}-top.png` });
    if (w === 1440) await p.screenshot({ path: `Review/guides-e-build/shots/guides-${state}-${w}-full.png`, fullPage: true, scale: 'css' });
  }
  await p.close();
}
await b.close();
