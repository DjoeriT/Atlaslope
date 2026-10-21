// Prefixes every selector of app-page.css with #closed so the app's rules cannot reach the map view.
// :root, html and body become #closed itself; @font-face is dropped (the page embeds the same faces). Run: node Review/mock-story-guide-v4/scope-css.mjs
import postcss from '../../node_modules/postcss/lib/postcss.js';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = postcss.parse(fs.readFileSync(path.join(here, 'app-page.css'), 'utf8'));
const scope = (sel) => sel.split(/,(?![^(]*\))/).map((s) => s.trim()).filter(Boolean).map((s) => {
  if (/^(:root|html|body)$/.test(s)) return '#closed';
  if (/^(html|body|:root)[\s.:\[>]/.test(s)) return '#closed' + s.replace(/^(html|body|:root)/, '');
  return '#closed ' + s;
}).join(',');
root.walkAtRules('font-face', (r) => r.remove());
root.walkRules((r) => { if (r.parent && r.parent.type === 'atrule' && /keyframes/.test(r.parent.name)) return; r.selector = scope(r.selector); });
fs.writeFileSync(path.join(here, 'app-page.scoped.css'), root.toString());
console.log('rules', root.nodes.length);
