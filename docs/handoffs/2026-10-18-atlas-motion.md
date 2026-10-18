# Handoff: atlas motion (18 Oct 2026, release 31, PR #95)

## Done
Owner points 8 (navigation transitions) and 9 (animated charts), atlas overhaul slice 5.
- Point 8: section bar glides to sections with a sliding, scroll-following marker and an arrival rule; guide-to-guide moves slide by
  direction (`page-step` / `page-up` in `src/app/App.tsx` moveOf) with a tapped tile photo becoming the next header; guides keyed by id so
  each opens at its top; sections ease in on scroll (scroll-driven CSS); photo viewer fades open; camera time scales with distance with
  an in-out ease (`src/map/flight.ts`).
- Point 9: climate and altitude charts draw once when seen, Spain row last (`Drawn` in `src/pages/Charts.tsx`); mouse hover lights one
  climate class in every row and the legend. Guideline for new charts in `Review/motion-spec.md`.
- Owner's three transition notes (17:18Z): card grows into the guide and shrinks back (`motion.css`, the guide borrows the name
  `card`); a "Show map" button on every guide (`src/pages/PageTop.tsx`); leaving a guide steps the camera back and flies in to the
  learner's own view (`swoop`/`land` in `src/map/createMap.ts`, `swoopIn` in `MapView.tsx`, called from `App.tsx` on `page-close`).
- Rioja's study region badge (and its "Where it sits" row and region button) no longer link to the same guide.

## Decided
- Three strengths shown in round 1 (recordings in project files `atlaslope/mocks/atlas-motion-r1/`); ships **balanced** unless the owner's card picks
  otherwise. Debug flag `?motion=subtle|bold` (debug builds only).
- CSS-first, transform/opacity only; map waits for screen moves (`afterMotion`). No scroll-jacking or parallax showpieces (UI roadmap).

## Open
- Map selected-outline fade: MapLibre does not animate feature-state changes; not done.
- Place-to-place on browser back slides forward (history gives no direction).
- Not verified: Safari, iPad, real phones, frame rate on a mid phone.

## Where
`src/app/motion.ts`, `src/styles/motion.css`, `src/pages/Charts.tsx`, `src/map/flight.ts`, `tests/ui/motion.spec.ts`, `tests/unit/flight.test.ts`.
