# Mobile-check slice: code review (ReviewBot, 17 Oct 2026)

Commit 8150c20, diff 51c5240..8150c20. Reviewed from a `git archive` copy. Verdict: **merge after fixes**. Blockers 0, should-fix 3, notes 4.

Ran [V]: `npm test` (253 pass; the checkout was main, so this says little about the slice). On the archive of 8150c20, `mobile.spec.ts` and `region-page.spec.ts` pass (16 of 16 including my probe).
Measured with throwaway probes and screenshots at 390x844, 844x390, 834x1112, 1280x800 and 320x568. The probes are not committed.
Not checked: dark mode, large text, the `?fixture` quiz at iPad width.

## Should-fix

1. **Claim 5 is not met on phones: the layers menu still sits under the top bar.** `src/map/map.css:48` (new rule `.menu.br{z-index:8}`).
   - `.menu.br` lives inside `.bottomright` (z-index 6, `app.css:57`). Its own z-index 8 only orders it inside that parent.
   - `.topleft` (7) and `.topright` (6, later in DOM) are siblings, so they paint over the menu.
   - [V] 390x844 portrait: the menu box is y=91..388. The Explore/Quiz/Progress nav is drawn over its top edge and the "MAP" header (screenshot read).
   - [V] 844x390 landscape: the menu box is y=42..339. The nav overlaps its top, and `elementFromPoint` at the menu's top centre is not the menu.
   - The new test only checks the centre of the first `label` (`onTop(page,'.menu.br label')`) and `box.y >= 0`, so it passes with the header covered.
   - Fix: raise `.bottomright` to z-index 8 (or lift the menu out of it), then assert the menu's top edge, for example `elementFromPoint` at (x+w/2, y+4).
2. **The Explore tab swallows modified clicks.** `src/app/TopBar.tsx:57`.
   - `onClick` now always calls `preventDefault`. Cmd/Ctrl/middle-click "open in new tab" on a real `href="./"` link no longer works.
   - Before the change it worked outside the quiz. Fix: skip the handler when `e.metaKey||e.ctrlKey||e.shiftKey||e.button!==0`.
3. **Explore on the Spain card does nothing visible, and the kept quiz is only partly cleared.** `src/app/App.tsx:126`, via the early return in `go` (line 43).
   - If the user is on the Spain card after a fly-there ("Close and stay", `stay` set) or has panned away, tapping Explore does not recentre the map (`stay` is not cleared). It used to reload to the default view.
   - Claim 1 ("goes to the Spain card") holds only when the selection differs. Either clear `stay` and recentre in that branch, or document that this is intended.
   - There is no test for "Explore drops a kept quiz round" or for Explore while already on Spain.

## Notes

4. **At 320 px wide the nav covers the Map layers button.** [V] `elementFromPoint` at the button centre returns the `.seg` nav button, and a normal Playwright click on "Map layers" hangs. This is the same stacking cause as finding 1 (`.topright` z 6, later in DOM, over `.bottomright`). It is likely older than this slice, but the slice claims phones work.
5. **History logic holds in the cases I traced** [R/V]. `fromCard` is set only on a card-to-page push for the same selection, and `onView` keeps it (`replaceState(history.state,…)`).
   - A deep link or reload has null or persisted state, so it pushes as before. The state survives reload and forward, and a fly-there is excluded.
   - The previous entry is always the card, because the flag exists only on that push.
   - Back to map from a page opened by a link now relies on `popstate`. `setStay(null)` there means a "Close and stay" camera is not restored on back. That camera belongs to the pushed `closeFly` entry, so it is fine.
   - Gaps: no test for a page deep link (`#place=x&page`, expect push and a new entry), for the quiz-to-place-to-page-to-back path, or for a place fly-there caption. The region case is only covered by the changed `region-page.spec.ts` (back becomes forward), which is a legitimate change, not tuning.
6. **Legend and search CSS fine on the sizes I measured.**
   - Legend toggle: 44 px high, `aria-expanded` wired, hidden on 834 and 1280 (desktop unchanged, [V]).
   - Search results: 288 px wide at 390 and 320 (left edge 15 px, on screen).
   - One nit: the toggle button and the hidden `<b>` both carry the title, so a desktop screen reader sees only the `<b>` (the button is `display:none`), which is fine.
7. **Quiz scroll code is sound** [R/V].
   - `focus({preventScroll})` plus `closest('.body').scrollTo` is correct. The reveal offset maths is right, and the new test passes.
   - The test only covers the wrong-pick path at 390 px.
   - Pointer-coarse 16 px input: the test checks a phone context, which has `pointer:coarse`. It does not test desktop staying at its old size.
