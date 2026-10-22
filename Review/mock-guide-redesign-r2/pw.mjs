// Playwright from this checkout's node_modules, or from the main checkout when a worktree has none.
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
const here = path.dirname(fileURLToPath(import.meta.url));
const local = path.join(here, '../../node_modules/playwright/index.mjs');
const main = '/Users/djoeri/Developer/Atlaslope/node_modules/playwright/index.mjs';
export const { chromium } = await import(pathToFileURL(fs.existsSync(local) ? local : main).href);
