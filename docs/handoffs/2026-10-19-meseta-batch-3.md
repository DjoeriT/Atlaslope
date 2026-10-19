# Meseta batch 3 (19 Oct 2026)

Route step 5 of "Run a region locally" (`docs/PROJECT.md`) for the last 5 places: Ribera del Guadiana, Ribera del Júcar, Río Negro,
Valdepeñas, Vallegarcía. 25 of 25 Meseta guides are written; every one of the 106 places has a guide (109 guide files: the 3 Rioja zones
have their own). Branch `claude/guides-meseta-3`, one PR, with the home page copy the owner picked (option A).

## Done
- Guides [V, `check_guide.py`, 0 errors, all 5]. Warnings left: Ribera del Guadiana "19" (checked: the p6 list names exactly 19
  municipalities); Valdepeñas "every flight goes to the place itself" (one flight).
- Ribera del Guadiana has three beats, no "ground": its pliego says nothing on soil (no soil terms in the extract) [V].
- Sentence check (Opus), kept/fixed/cut: Ribera del Guadiana 17/12/2, Ribera del Júcar 22/15/0, Río Negro 30/29/0, Valdepeñas 17/17/0,
  Vallegarcía 23/16/0. Río Negro had hedges ("favorece") written as plain fact; Valdepeñas said "chalky" for "calizos" (limy).
- Fact sheet edits by script and by hand: `Review/guides-pipeline/meseta/fact-sheet-fixes.md`. By hand: Valdepeñas main grapes (six,
  p6) and secondary grapes (p11); Vallegarcía others were the main three repeated, now Merlot, Cabernet Franc, Petit Verdot (yield table
  p1); Ribera del Guadiana `why.text` cut from 30 to 24 words (limit 25, `src/facts/check.ts`).
- By hand: Guadiana title "Whites, rosados and reds" (three-item list) became "Eight main grapes, capped yields".
- Home page [O, option A]: one tile "106 / wine places, each with its own guide"; "Free / to use, no account" tile gone; "so far" gone.
  The stats row is now two tiles (`.nums` two columns). Meta, og and donations lines unchanged.
- 109 vs 106 [V]: `data/places.json` has 106 places plus 3 zones (Rioja Alta, Alavesa, Oriental), each zone with a guide. The home
  count now counts place guides only (`placeGuideCount`, `src/home/guideCount.ts`), so it says 106, not 109. A unit test backs
  "each with its own guide": place guides equal places.
- "No guide" UI fixtures: test-only flag `?noguide=<id>` (`src/debug.ts`, debug builds only) makes a place show as having no guide;
  `guide.spec.ts` Valdepeñas tests use it. `facts.spec.ts` Vallegarcía test is about "not quizzed", left as is [A: CI confirms].
- Roster in `tests/unit/guides.test.ts` (109 guides). Tests [V]: `npm test` 307 passed. UI specs and the atlas do not run locally (below).
- Home preview checked in the dev server [V]: two tiles, "Deep guides to 106 places,".

## Measured [V, `usage.py --budget 0.65 --places 5`, batch 3 helpers only]
| | re-read | new | total |
|---|---|---|---|
| 5 writers (Sonnet) | 1.25M | 0.22M | 1.47M |
| 5 checkers (Opus) | 1.37M | 0.28M | 1.65M |
| Batch 3, 5 places | 2.62M | 0.50M | 3.11M |
| Per place | 0.52M | 0.10M | 0.62M |

Under the 0.65M budget; no 1.5x stop. Batches 1 and 2 were 0.55 and 0.56M a place. This session's own spend is not in the table.

## Open
- Unsure sheet edits still open, from batch 2: Campo de Calatrava `soil.text`, Finca Élez `why.text`. From batch 1: Uclés `grapes.main`,
  Campo de la Guardia `grapes.main`/`others`, Manchuela `styles.text`, Méntrida `famous.styles.1.text`.
- Local only, worse than noted: the `./Doors` vs `doors.ts` case clash breaks `npm run build`, the UI tests' web server AND the atlas in
  `vite` dev on the Mac (console: "doors.ts does not provide an export named 'Doors'"). Nothing atlas-side can be checked locally until
  it is fixed. Small fix, its own slice; it should come first.

## Next
- Guides page table of contents, cut-off rows and flagged region tiles: see the batch 2 handoff, "Next slice after Meseta" (mock first).
