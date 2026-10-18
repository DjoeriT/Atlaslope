# Motion spec (owner points 8 and 9, 18 Oct 2026)

One set of moves for the whole atlas, so every navigation feels like the same product. Code: `src/app/motion.ts` (moves and hooks),
`src/styles/ux.css` (card and page view transitions, release 17 Oct), `src/styles/motion.css` (everything below), `src/map/flight.ts`
(camera timing).

## Principles
- Motion explains where you went: forward slides in from the right, up to a wider guide from the left, a photo you tap travels to the
  header it becomes. No motion for decoration only.
- Quick and calm: 0.3 to 0.6 s for screen moves, up to 1.3 s for a chart drawing itself, 0.8 to 2 s for the camera.
- One ease for the interface, `cubic-bezier(.22,1,.36,1)` (fast start, long settle). The camera eases in and out (`cameraEase`), since a
  map that starts at full speed reads as a jolt.
- Transform and opacity only, CSS first (view transitions, scroll-driven animations), so motion never competes with the map's frames.
  The map waits for a screen change to finish before it flies (`afterMotion`).
- Every move is off under "reduce motion": the change simply happens. Browsers without view transitions or scroll timelines get the
  same pages without the move.
- Skipped on purpose (UI roadmap): scroll-jacking, parallax showpieces, 3D flips, motion that blocks reading or input.

## The moves
| Where | Move | Strength (subtle / balanced / bold) |
|---|---|---|
| Card to card | Crossfade, new card rises 10 px (ux.css) | unchanged |
| Card to guide | The card grows into the guide; its cover photo travels to the header (owner, 18 Oct: "sudden") | 0.66 s |
| Guide to map | The guide shrinks back into the card; the camera steps back and flies in to the view you had ("Show map", Atlas, Fly to, Escape, browser back) | 0.66 s, then the flight |
| Guide to guide | Slides 2 / 5 / 9 % in the direction of travel; a tapped tile photo becomes the next header | 0.6 s |
| Jump bar tab | Page glides to the section; the bar's marker slides to the tab; a champagne rule sweeps under the heading | marker 0.3 / 0.42 / 0.55 s |
| Reading a guide | The bar's marker follows the section being read | same |
| Sections | Each block eases up into place as it enters the screen (scroll-driven) | 6 / 14 / 32 px |
| Charts | Draw once on first view: own row, comparison rows, Spain last; altitude band opens from the median, then tick and numbers | 0.55 / 0.9 / 1.3 s |
| Chart hover | Names the class and its share; the same class lights in every row and the legend | 0.2 s |
| Photo viewer | Fades open | 0.32 s |
| Map camera | Time grows with distance (zoom levels plus screens), 800 to 2000 ms, soft start and landing | x0.8 / x1 / x1.25 |

Known limit: guide to guide at the same depth (place to place) always slides forward, also on the browser's back; the history API
does not say which way it went.

Hover is for a mouse only; on touch, and for a screen reader, the legend and the chart's label carry the same words.

## Guideline for new visualisations (owner point 9)
A new chart draws itself the first time it is seen (wrap it in `Drawn`, `src/pages/Charts.tsx`), in reading order, with the comparison
(Spain, the study region) arriving last so the eye reads the place first and the yardstick second. A mouse hover names what is under the
pointer. Nothing animates on every scroll; once is enough.

## Design round 1
`?motion=subtle` or `?motion=bold` in a debug build switches the strength; no flag is balanced, which is what ships until the owner picks.
