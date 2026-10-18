# Quiz highlight cut off (17 Oct 2026)

**Done.** Owner report: mid-quiz in Galicia the highlighted place was cut off at straight edges and neighbours kept the wine colour (#66).
Cause [V]: MapLibre 4.7.1 with 3D relief renders fill and line layers into cached textures per terrain tile and frees a texture only on a
tile load or a style change, not on `setFeatureState`. Squares that reloaded during the fly showed the new state; the rest kept the old one.
Reproduced in a headless page (flat terrarium DEM by custom protocol, two squares, select one then the other): pixels stayed blue until
`map.terrain.sourceCache.freeRtt()`, then turned red as expected.
Code review `Review/quiz-highlight-code-review.md` (merge; both should-fix done).
Fix: `src/map/terrainCache.ts` `stateSetter(map)`: every feature state change in `createMap.ts` goes through it, and it frees the terrain
texture cache once per batch (microtask) and repaints. Unit test `tests/unit/terrain-cache.test.ts`.

**Decided.** Takes release 17; the mastery map and ready for friends move to 18 and 19 (#15, #16).

**Open.** Uses MapLibre internals (`map.terrain.sourceCache.freeRtt`, `map._removed`); it no-ops if they move.
Each highlight or hover change redraws every visible relief texture (hover only fires on a change of place); cost not measured [A]. Recheck on a MapLibre upgrade.
Not checked against real relief and photo tiles (blocked hosts); the owner's look on the live site after publishing is the check.

**Publish addendum (17 Oct 20:20Z).** Owner said "publish release 17"; two publish runs on d66d247 stopped in the UI tests, each on a
different test (39065041152: Escape from the Toro page landed on Castilla y León; 39065673755: "Set a focus" left the address at `#quiz`).
Cause [V, code read]: since release 16 a new card or quiz screen is pushed to the address at once, but its state lands a frame later
inside the view transition; a map move ending in that gap rewrote the address from the old state, putting the old screen back. Fix:
`withView()` in `src/url.ts` rewrites only the view part of the current address (`onView` in `src/app/App.tsx`); unit test
`tests/unit/url-view.test.ts`. The two specs passed locally before and after (`--repeat-each=15` of the Escape test: no failure) [V]; CI is the check.
Accepted change: an unknown id in a link (`#place=bogus`) now stays in the address while the card shows Spain; before, the first map move rewrote it.
Code review `Review/address-view-code-review.md` (merge; tests added, the id change accepted).
