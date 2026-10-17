# PR #63 code review (ReviewBot, 17 Oct 2026)
Verdict: MERGE AFTER FIXES. 0 blockers, 3 should fix, 5 nice. Ran: tsc clean, vitest 259/259 (scratch copy of the branch). UI suite not run (as asked). The rest is read/inferred.

## Should fix
1. src/map/createMap.ts:176 (phone padding). `document.querySelector('.card')` returns the FIRST .card in the DOM. QuizScreen renders before the explore Sheet (App.tsx ~158), so after "open a place from the quiz" (keepQuiz) it picks the hidden quiz card: rect is all zeros, so bottom = innerHeight + 1rem. Padding then exceeds the canvas, MapLibre refuses to fit and the map does not move. Before the PR the phone value was a constant 52%. Fix: query `.sheet.explore .card` (or a non-hidden card), and fall back to 0.52 when the height is 0.
2. src/app/Sheet.tsx:41 + MapView.tsx:65. Without view transitions (Firefox, reduced motion, hidden tab) afterMotion runs the focus at once, before the Sheet's `setStop('half')` effect has applied its height. The framing is measured at the old stop (possibly 'full', which makes padding huge, see 1). With transitions it is right only by timing (0.3s sheet vs 0.48s wait). Fix: reset the stop without the effect-then-render two-step (`key={resetKey}` on Sheet, or useLayoutEffect), or have createMap use the target height.
3. src/app/App.tsx:138-143 Escape vs FlyCaption (FlyCaption.tsx:28-33). Both listen on window. If focus is not inside `.flycap` (user clicked the map), FlyCaption closes (pushState + setSel) and App's handler also calls go(parent) from the stale `selRef`: two history entries, and the card steps up past the place. Fix: FlyCaption calls `e.preventDefault()` when it closes (App already checks defaultPrevented), or App skips when `sel.fly` is set. Also: the welcome card (`role=dialog`, FirstRun) is not in the exclusion list, so Escape behind it navigates. Add `[role="dialog"], [role="alertdialog"]` to the selector.

## Nice
4. motion.ts:25 / App.tsx:44-58. `go()` reads `selRef.current` (updated at render) but the state change now runs a frame later inside the transition. Two taps in the same frame both compare against the old selection (dedupe and the `history.back()` shortcut misfire). Low odds; set `selRef.current = to` in go() before withMotion.
5. validSelection redirect on popstate (App.tsx:90): the URL stays `#region=rioja` while the place shows. No loop, but a reload or share keeps the region hash. Consider `history.replaceState` to the place hash when the redirect fires. go() itself pushes the redirected hash correctly, and its early-return compares the redirected target (good).
6. Sheet.tsx:24 stop heights are computed on render only; rotation or URL-bar collapse does not re-render, so px heights go stale until the next interaction. Add a `resize` listener. `--sheet-h` is never reset when the Sheet unmounts; harmless as the page covers the map.
7. Sheet.tsx:49 the inert effect has no dependency list and runs every render, removing `inert` from every `.card .scroll/.body` when not at peek. Fine today; give it deps.
8. ux.css:5 hero name: `.card .cover img` has one img today (Cover.tsx, key=photo.src). If a cover ever shows two images at once, the duplicate `view-transition-name` aborts the whole transition. Add a comment or `:first-of-type`.

## Checked, no problem
- Snapshot names: card (.first excluded), page and hero are single at a time; the hidden quiz sheet is display:none, so no card clash. Page open/close hero: one img each side.
- afterMotion: the `live` flag drops superseded focus; `running` is cleared by identity; `finished.catch` covers skipped transitions. No leak found.
- flushSync runs inside the startViewTransition callback (browser task), not inside popstate or a React handler.
- Without startViewTransition, with reduced motion, or in a hidden tab: change() runs directly.
- Two Sheets: the explore sheet is unmounted in quiz, the quiz one is hidden, and the ResizeObserver disconnects when hidden. OK apart from point 1.
- Escape: map menu panel (`.menu`) and brand menu (`role=menu`) are excluded correctly.
- Rules: the "lean" rule in CLAUDE.md and AGENT_ROLES names its incident and owner card. Records are in the PR.
