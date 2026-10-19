# Meseta batch 1 (19 Oct 2026)

Route step 5 of "Run a region locally" (`docs/PROJECT.md`) for the 4 pilot guides (`2026-10-19-meseta-pilot.md`) and 8 new ones.
12 of 25 Meseta guides are written. Branch `claude/guides-meseta-1`, one PR.

## Done
- Guides [V, `check_guide.py`, 0 errors]: Mondéjar, Rosalejo, La Mancha, Los Cerrillos (pilot); Vinos de Madrid, Calzadilla, Méntrida,
  Uclés, Dominio de Valdepusa, Campo de la Guardia, Manchuela, Dehesa del Carrizal (batch 1). Warnings left: Mondéjar "21", La Mancha
  "every flight goes to the place itself", Campo de la Guardia "100" (checked: p4 "más de cien metros sobre el valle del Tajo").
- Fact sheet edits by script: all in `Review/guides-pipeline/meseta/fact-sheet-fixes.md`.
- Los Cerrillos: the 2 unsure edits stay NOT applied. "Principales variedades de uva de vinificación" is the fixed heading of section 7
  of every EU single document, not a main-vs-secondary split. Logged in fact-sheet-fixes.md.
- Fixed by hand after the helpers:
  - Main grapes written as plain strings in 5 sheets (La Mancha, Vinos de Madrid, Calzadilla, Dominio de Valdepusa, Dehesa del Carrizal).
    The app reads `{ local, grape? }`, so search lost them (UI test "albillo lists Cebreros" broke). Now objects. Guards:
    `src/facts/check.ts` rejects a non-object main grape; `headless.py` wraps names when it writes `grapes.main`.
  - Why lines over 25 words (Mondéjar 28, Manchuela 33): shortened, same facts.
  - Uclés: the checker cut both label terms and left an empty label; the label is removed.
- Runner fixes: `oneshot.set_path` indexes lists (`famous.styles.2.text` crashed the run after Méntrida); a bad edit in `apply_sheet`
  is logged as NOT applied instead of stopping the batch. The run resumed in the same run dir; Méntrida's edits were applied from its saved result.
- Route step 5: roster in `tests/unit/guides.test.ts` (96 guides); Guides-page tile `public/guides/meseta.webp` (view -3.75,39.45,7.05,
  117 KB; `region_tile.mjs` now falls back to `cwebp` when ImageMagick is missing); `data/SOURCES.md` rows for the 5 new `oj-*.txt`
  and the tile. UI fixtures moved off places that now have guides: `guide.spec.ts` "no guide" tests La Mancha -> Valdepeñas;
  `facts.spec.ts` "no main grape" La Mancha -> Somontano, "not quizzed" Dominio de Valdepusa -> Vallegarcía.
- Tests [V]: `npm test` 306 passed; `guide.spec.ts` + `facts.spec.ts` 28 passed.

## Measured [V, `usage.py --budget 0.65 --places 8`, batch 1 helpers only]
| | re-read | new | total |
|---|---|---|---|
| 8 writers (Sonnet) | 1.51M | 0.32M | 1.83M |
| 8 checkers (Opus) | 2.09M | 0.44M | 2.53M |
| Batch 1, 8 places | 3.60M | 0.76M | 4.37M |
| Per place | 0.45M | 0.10M | 0.55M |

Under the 0.65M budget; the 1.5x stop did not fire. This session's own spend is not in the table (see the PR).
Projection for the last 13 [A, from these 8 + the 2 pilot guides]: 13 x 0.55M = ~7.2M helpers, plus ~1.5-2M per batch session.

## Open
- Unsure sheet edits not applied (fact-sheet-fixes.md): Uclés `grapes.main` (pliego: "sobre todo la variedad Tempranillo"),
  Campo de la Guardia `grapes.main`/`others` (pliego p4 "PRINCIPALES UVAS", p8 secondary: looks like a real split, decide in batch 2),
  Manchuela `styles.text`, Méntrida `famous.styles.1.text`.
- The "no guide" UI fixtures run out with Meseta: Valdepeñas and Vallegarcía get guides in a later batch. The batch that writes them
  swaps the fixture; after the last batch no place is left without a guide and these tests need a test-only fixture place.
- Local only: `npm run build` fails on the Mac. `QuizScreen.tsx` imports `./Doors`, which resolves to `doors.ts` on the case-insensitive
  disk (CI on Linux is fine). Patched in memory for the tile and UI runs here, not committed. Needs its own small fix.
- Batch 2 (next ~8 of the 13 left): owner's word.
