// Full-page screenshot of a brand mock page, for checking a build by eye.
//   node Tools/brand/shot.mjs <url> <out.png> [width]
// Serve the mock folder first (fetch needs http): python3 -m http.server <port> -d mocks/brand-identity-r1
import { chromium } from '@playwright/test';

const [url, out, width = '1440'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +width, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log('shot', out);
