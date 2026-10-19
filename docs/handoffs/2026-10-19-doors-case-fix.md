# Doors case fix, and the next two slices (19 Oct 2026)

## Done
- `src/quiz-ui/doors.ts` renamed `doorsModel.ts` (the pure door logic); `Doors.tsx` (the component) keeps its name. The two names were one
  file on the Mac's case-insensitive disk, so `npm run build`, the UI tests' web server and the atlas in `vite` dev all failed locally
  while CI on Linux was green. Imports in `Doors.tsx`, `FocusScreen.tsx`, `PractiseScreen.tsx`, `tests/unit/quiz-ui-doors.test.ts`.
- Guard: `tests/unit/file-names.test.ts` fails when two tracked files differ only in case (checked: it fails on the old tree) [V].
- Local checks now work [V]: `tsc` 0 errors, `npm run build` ok, `npm test` 308 passed, UI specs `quiz-doors`, `guide`, `facts` 38 passed.
- Owner's item 4 [O, 19 Oct]: PR #136 (guides-page notes, docs only) merged on its green scope check.
- Release 52 is published and live-checked (tag on `dbfaae2`); this fix has no user-visible change, so no release needed for it alone.

## Next slice A (fresh session): Guides page mock round [O, owner picked these 19 Oct]
Big slice, new UI: one mock page, from the real Guides page, before any build. Brief in `docs/handoffs/2026-10-19-meseta-batch-2.md`,
"Next slice after Meseta". In short: (1) a region jump row under the header, 10 regions (owner picked option A); (2) each region row shows a
cut-off number of places next to its tile, then a link to that region's page (`src/pages/RegionPage.tsx`), mock shows 4 vs 6 for him to
pick; (3) all 10 region tiles become home-hero style: an app screenshot of the region with the app's own place flags (like
`public/home/hero.webp`), not the plain satellite crop (`public/guides/<region>.webp`, `Tools/guides/region_tile.mjs`). The local atlas
runs again, so the tile screenshots can be made here. UX/UI/visual check against `Review/visual-style.md` before polish. Estimate
~1-2M [A, no measured mock round on the local route yet]; one-shot helper builds the page and returns the link.

## Next slice B (fresh session): unsure fact-sheet edits, Meseta
Small slice. Settle each against its extract in `Review/guides-pipeline/meseta/<id>.extract.txt`, apply only what the page plainly
says, log in `fact-sheet-fixes.md`, keep `src/facts/check.ts` limits (why line max 25 words). Items: Campo de Calatrava `soil.text`
(pliego: clay loam is the subsoil), Finca Élez `why.text` (p6 does not make altitude the cause of acidity), Uclés `grapes.main`,
Campo de la Guardia `grapes.main`/`others`, Manchuela `styles.text`, Méntrida `famous.styles.1.text`. Estimate ~0.2-0.3M [A].
A sheet change can make a guide's facts differ: run `npm test` (facts check) after.
