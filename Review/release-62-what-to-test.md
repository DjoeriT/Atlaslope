# Release 62: what to test (Map tour fixes)

The map tours got the fixes from the first-principles review.
Every stop now comes up as you scroll.
The map layers have keys, and the phone view is bigger.

Hard-reload first (Cmd+Shift+R).

1. Open the Rioja guide. At the top, next to "Show map", a "Map tour" button jumps to the black tour band.
2. Open the map and scroll slowly. The bar counts Stop 1 of 9, then 2, 3 and on, in order. No stop is skipped.
3. Stop 1 shows the whole valley, Haro to Alfaro.
4. At the soils stop, the map shows rock colours with a key "Rock beneath the soil". The names are the geological survey's (IGME), in English.
5. At a steep stop, a small key explains the slope tint. The climate colours are lighter, so the land shows through.
6. Place names sit beside the pins, never under them.
7. On a phone the map strip is taller (about 300 px). The credit is behind the "i" button. No "Show map" button floats over the page while the map is open.
8. Priorat: the first stop shows the Montsant without pale gaps; the soils stop shows the slate.
9. On a slow connection the satellite picture comes first, the 3D relief after.
10. The Guides page "Map tour" filter shows its heading under the top bar, not behind it.

For you: PR on branch claude/map-tour-fixes (cards 1-3 in Review/map-tour-fixes/); checks in the PR's CI run. Not checked: real Safari, iPad, phone; Priorat stops 3 and 4 at phone width.
