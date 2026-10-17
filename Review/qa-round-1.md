# QA round 1 (after release 10, 17 Oct 2026)

Owner's ask (09:03Z): a QA and review round once release 10 was live. Issue #48. Thread "QA and review round", branch `claude/qa-review-round-5g09tq`.

## What was run
- `Tools/check.sh ui` on f0eada5: 245 unit tests, 82 UI tests, build, debug-flag and size checks all pass [V].
- A crawl of every card and full page (79 places, 10 regions) at 1280 x 800 light and 834 x 1112 dark: no "undefined"/"NaN" text, no
  broken photo, no missing alt text, no duplicate ids, no page-wide sideways scroll, no console errors [V].
- Tap sizes, clipping and large text (browser default font 24 px and 32 px, the real setting, not a CSS zoom) at iPad portrait and
  landscape and a 390 px phone [V, screenshots in the thread's scratchpad].
- Not reachable from the cloud container: the live site, satellite tiles and the Esri key (referrer-locked). Satellite, Safari and a real
  iPad stay unchecked, as in the release 10 tester note.

## Found and fixed in this PR
1. **No way back to the start view** (owner, 10:02Z). The compass only appeared once the map was turned and only undid the turn; tilt,
   zoom and panning had no undo. New "Reset view" button under zoom: frames the open card again, north up, at the launch tilt (45°).
   Not shown in the quiz, which keeps the map flat itself. The compass is now labelled "Point north".
2. **Compass missing after a reload or a shared link of a turned map.** It listened only for turning, so a map that opened turned had no
   compass. Fixed (`MapView.tsx`); the new UI test covers it.
3. **Large text on iPad broke the top bar.** Breakpoints were in px, so with a bigger browser text size the desktop layout stayed: at 200 %
   the search box was 4 px wide, the mode bar covered the wordmark, and the card hid the map buttons. Breakpoints are now in em (same
   layout at normal size), the bottom-sheet layout is portrait only (landscape keeps the side card), and in that layout the mode bar
   takes a second row so the search keeps its room.
4. **Hover** (owner card 10:05Z, "highlight only"): hovering or tabbing to a row in the Spain, region or place card lights its places up
   on the map; the place under the mouse lights up too. The map never moves on hover; not in the quiz.

## Found, not fixed (low)
- "Missed today" (Practise) and "next due" count days in UTC while the plan counts local days: in Spain between midnight and 02:00 they
  name the wrong day. The unit tests encode UTC days, so the fix needs a test change first; proposed for a later slice.
- Targets under 44 px: the satellite note's close (32 to 35 px wide), the Practise checkboxes (18 px), photo credit links (16 px tall),
  the "terroir, 4-minute read" link (20 px tall).
- At 200 % text on iPad portrait the map buttons still overlap the second-row mode bar; 150 % is clean.
- Owner points 1 and 4 (Spain and region cards look bare; the ten region colours read as noise): design changes, going to a mock (cards
  10:06Z: "one wine tone", "mock now").

## Not verified
- Hover and Reset view over satellite and 3D relief on the live site: MapLibre caches flat layers on the terrain (#40); the selection
  highlight uses the same mechanism and works live, so hover is expected to [A].
