# The whole Rioja guide inside the journey, v4 (21 Oct 2026)

v3 (the owner's chosen base: "it truly felt like a journey") with the whole guide in the reading column and a "Close the map" choice. Mock only: no app code, content or data touched. v3 is untouched.
Output: `mocks/story-guide-v4/index.html` (git-ignored, one page, tiles and WMS load live). Build: `python3 -I Review/mock-story-guide-v4/build.py [out_file]` (37 s wall here). Shots and the close/reopen check: `node Review/mock-story-guide-v4/shoot-v4.mjs` (about 60 s). Rioja only: Priorat is dropped from the page (its data is still compiled in and unused; removing it would touch the shared map code).

## What changed from v3
1. **Reading column = the guide page, in its order**: cover and contents, 1 place, 2 weather (three zone cards), 3 ground, 4 rules, How it tastes, In short, Producers, then the v3 end with "Test me". Guide text is unchanged [V].
2. **The rest of the guide page comes from the app**, not retyped [V]. `extract-rest.mjs` opens the built app (`npm run build`, `npx vite preview`, `#place=rioja&page=1`) in Playwright and saves the rendered HTML of the four beats' fact blocks, How it tastes, In short and Producers to `guide-rest-rioja.json`; `build.py` reads it. Two edits to that HTML: the React "and 8 more" button is replaced by the list opened (grapes), and the In short links point to the chapters in this page.
3. **Fact blocks per beat** (Level, measured climate chart, altitude chart, famous styles, grapes, wine types) sit after the beat's last stop, with the app's own markup and the app's CSS rules copied into `story-v4.css`.
4. **Map**: v3 stage unchanged (terrain x1.5, slope tint, climate and geology layers, rivers, names, locator, focus, flights, two legs, 2.2 s dwell). Added view `rest`: one still, tilted (pitch 50, north up) view of the whole of Rioja for How it tastes, In short, Producers and the end. The map moves only when a new stop starts.
5. **Phone below 768 px (48rem)**: map pinned to the top 42%. v3 used 61rem; between 768 and 976 px the text column is now at most 50% of the width.
6. **Stop cards**: each stop keeps its photo card (v3 part B). Its label is the guide's fly link: map on, it flies the map back to the stop; map closed, it is a plain link to the app's map (`#place=rioja&fly=valley.0`, the app's own href).
7. **"Close the map" / "Show the map"** in the black band, map on by default.
   - Closed: the map is hidden, the text takes the guide page's width (`.pg-listing` in `src/styles/pages.css`: 76rem, 2rem sides; running text keeps its 38rem measure), prose left, stop card and fact blocks right (one column on phone). The reader stays on the same block at the same height on the screen.
   - Reopen: the map jumps (no flight) to the stop of the block being read, then flies from the next stop.
   - The choice is kept in `localStorage` (`atlaslope.story.mapClosed`); every read and write is in try/catch, so without storage the map is simply on.
8. Dropped from v3: the four-option entry block and the Rioja/Priorat switch.

## Checks [V] (shoot-v4.mjs, Playwright Chromium, 1440x900 and 390x844)
- Toggle: body class and button text switch, storage holds `1`; after a reload it is still closed; reopen sets `0`.
- Same block, same screen height across the switch (277 px before, 277 px after).
- Reopen at the Haro paragraph: map at Haro (zoom 14.2, pitch 60) 0.4 s after the click, so a jump; scrolling on to In short then starts a flight (moving), ends pitch 50 on the whole of Rioja.
- Phone closed: no sideways scroll (scrollWidth 390).
- Shots in `shots/`: `desktop-map-on.png`, `desktop-map-closed.png`, `desktop-no-stop-in-short.png`, `phone-map-on.png`, `phone-map-closed.png`.
- Design check against `Review/visual-style.md` by eye on the shots: black band, champagne, white page, 6px corners, no pills, no dark mode, no new drawn icons. Fixed on the way: cover too big when closed (capped to 46rem), hint "The map follows the text" hidden when closed.

## Open points
- **Photos per stop [V]**: every stop already has its own photo (valley, Sierra, three zones, soils, Haro), so no section photo had to stand in and nothing was invented. How it tastes, In short and Producers have no photo (the app has none there either).
- **Crops [A]**: all photo cards are 3:2 CSS crops (`object-fit:cover`; v3's own `focus` for the photos found for the mock). The checked crops come in the build, as before.
- **Not in the reading column**: "If you like this, try" and the page's Sources list (the page has the per-paragraph source lines, as v3). Say so if the whole page must include them.
- **Stop link target [A]**: the closed-mode link goes to the app's `#place=rioja&fly=...` hash; in this standalone mock it goes nowhere.
- **Closing on phone [A]**: the reading line differs (30% under the pinned map when open, 45% of the page when closed); the reopened map uses the block's own stop and the page nudges that block onto the open reading line.
- The measured-climate chart is attached to the last zone (Rioja Oriental); the map is on that zone while it is read. A separate step would add a flight.
- Source links keep the app's hover titles (the app's own markup); the photo credits stay one visible line at the end, no tooltips.
