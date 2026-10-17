# Mobile check (17 Oct 2026)

Owner's ask (12:50Z): "a mobile-first run of checks, I see weird navigation and other weirdness". Issue #57, branch
`claude/project-thread-7uji17`. Checked the built site in Chromium at 390 x 844 and 412 x 915 (portrait) and 844 x 390 (landscape),
touch on, through the map, cards, place and region pages, search, menus, legend and a quiz round. Before/after screenshots:
`/mnt/project-files/atlaslope/mobile-check/before-after.png` (owner saw them, said "Go" at 14:48Z).

**Done.**
1. The Explore tab was a plain link that reloaded the whole site (and Back reloaded it again); it now opens the Spain card in place.
2. "Back to map" on a page opened from its own card added a history step, so the phone's back gesture reopened the page just closed;
   it now steps back (`history.state.fromCard`, `src/app/App.tsx`). A page reached any other way still pushes the card as before.
3. Search results drew under the floating card, on desktop too; the top bar is now above the card (z-index 7), and on narrow or short
   screens the results get up to 18 rem of width.
4. On phones (narrower than 51.25 em, or shorter than 30 em) the legend folds into a "Climate" button with colour swatches; a tap opens
   the list. Desktop and iPad unchanged.
5. The map layers menu ran off the top of a phone screen and sat under the top bar; it is now above the bar and capped to the screen.
6. The search field is at least 16 px on touch screens, so iPhone Safari no longer zooms in on it.
7. Quiz: a new step opened at the scroll position the last one ended on; each step now starts at the top, and a reveal scrolls to the result.

Tests: `tests/ui/mobile.spec.ts` (9 tests; the first 8 all fail on the old code, pass now [V]). `tests/ui/region-page.spec.ts` expected Back
after "Back to map" to reopen the page; it now checks Forward reopens it. `Tools/check.sh ui` green [V].

ReviewBot (`Review/mobile-check-review.md`): merge after fixes, 0 blockers, 3 should-fix, all fixed: the map menu was still drawn
under the top bar (its button column now rises while it is open), Explore swallowed Cmd/Ctrl-click (modifier clicks open a new tab again),
and Explore on the Spain card kept a "stay" camera. Two tests added (menu's top edge clear, Explore on Spain).

**Open (design choices, not built).** Phone landscape: the side card is about 290 px tall and its buttons take half of it. Phone
portrait: the cover photo takes about half of the bottom sheet. Tap targets under 44 px from `Review/qa-round-1.md` remain. Search
results stay open until cleared.

**Not verified.** Real Safari on iPhone, a real Android phone, satellite imagery and the live site (the container can't reach them).
