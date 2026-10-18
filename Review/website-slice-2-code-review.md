# Code review: website slice 2 (4528c33..9059339)

Verdict: merge after fixes. 0 blockers, 4 should fix, 5 notes. Ran: `npx vite build` (dist URLs inspected), `npx tsc --noEmit` (clean), `npm test` (264 pass). Playwright not run.

## Should fix
1. src/app/TopBar.tsx:40 (Study link `href="#study"`) with src/app/App.tsx:101-110. A plain anchor fires popstate; onPop does `setSel(parseSelection('#study'))`, which is SPAIN. Before, onQuiz only called openQuiz and kept `sel`. Scenario: Toro card open, click Study, click Atlas: openExplore (App.tsx:87) pushes `selRef.current`, now SPAIN, so the learner lands on Spain, not Toro, and the map flies out. Also loses `view=`. Fix: in onPop keep `sel` when q is set (setSel only when q is null), or make Study a button/inApp link calling openQuiz().
2. src/styles/quiz.css:86 `.back-quiz{top:4.6rem}`. The element sits inside `.stage` (App.tsx:187), and the card now starts at top:1rem (app.css:60). The pill is 3.6rem lower than the card top it used to align with. Fix: top:1rem. (Left:27rem and the portrait rule at :88 are unaffected.)
3. .github/workflows/map-preview.yml:40-41 still passes `http://localhost:4173/` and `https://atlaslope.com/` (now the home page) to Tools/preview/map_shots.mjs. map_shots goes to `${base}#view=...`; it only works through the home page's inline forwarding script (index.html:11) and a second navigation after domcontentloaded, so it is racy. Fix: pass `.../atlas/` in both lines (curl wait at :39 can stay).
4. public/share.png grew from 126 KB to 714 KB (diff stat). WhatsApp and some other fetchers skip preview images above roughly 300-600 KB, so the card may show no image. Re-export smaller (JPEG or quantised PNG) in Tools/share/make_share_image.py.

## Notes
5. public/manifest.webmanifest: `start_url "./"` resolves to the home page, so the installed app opens the home page, not the atlas; scope "./" covers both. If the app icon should open the atlas, use "atlas/". Owner choice.
6. Dead CSS: `.seg` (src/styles/app.css:42-44, 73, 82-83) and `.rback` (src/styles/region.css:3-4) have no users in src (grep). Stale comment at src/map/map.css:44 ("above the top bar"; still true, bar z 10 vs .bottomright 9 is inside .stage). `.menu` base rule top:4.4rem (app.css:48) is overridden by `.menu.br` (map.css:5), so harmless, but now stale.
7. src/styles/site.css `.sitebar .in{padding:0 1rem}` and pages.css `.pg-top .in{padding:0 2rem}` have equal specificity; site.css is imported last in src/main.tsx, so on full pages the bar padding probably becomes 1rem, not 2rem (inferred from import order; needs a screenshot at desktop width).
8. index.html:11 regex `/^#(place|region|quiz|study|view)\b/` also matches `#placeholder` or `#quiz-x`; harmless (the atlas treats it as Spain). `#search` is deliberately not forwarded; fine. Search string is kept. Checked OK.
9. User-visible "Quiz": none left in strings.ts (all "Study"); remaining "quiz" is code and comments. `document.title` uses Study. Comment-only: QuizScreen.tsx:84 still says `#quiz=test`.

## Checked and fine
- Production URLs: dist/index.html uses `./` assets and `atlas/` links; dist/atlas/index.html uses `../assets`, `../favicon*`, `../manifest`, `../fonts`. Vite rewrote the absolute `/favicon.svg` hrefs in atlas/index.html to `../`. Photos and glyphs go through ROOT='../' (facts/index.ts:32-40, createMap.ts:67); resolves at /atlas/ and /Atlaslope/atlas/.
- Link.tsx:22 fallback `'./'` resolves to atlas/ from atlas/; brand `../` is home. App `here()` uses pathname+search, so pushState stays under /atlas/.
- live-map-check.yml updated; publish.yml and deploy.yml upload dist wholesale; Tools/check.sh and the release SKILL.md hold no app URL. robots.txt allows /atlas/.
- url.ts: #study and #quiz both parse; output always `study`. Same-hash Study click does not push a duplicate entry.
- Legend, card, flycap offsets all re-based on .stage consistently; portrait legend override removed correctly.
