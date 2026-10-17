# Release 10 review (9baaf85, guides)

**Verdict: merge after fixes.** 0 blockers, 4 should-fix, 4 notes. Read: all diffs, 3 new guides against the pliego lines given. Ran: `vitest tests/unit/guides.test.ts` (4 pass). Not run: UI suite, live browser.

## Should fix
1. **rioja-alta.json, chapter weather: body is misread.** Text: "medium alcohol, body and high acidity". Pliego p.20: "graduación media y cuerpo y acidez elevada" = medium alcohol, HIGH body and acidity. rioja.json's zone note already says it correctly. Fix: "medium alcohol, full body and high acidity".
2. **rioja-alavesa.json lede: "the most sheltering stretch of the Sierra de Cantabria".** p.20 says only that the Sierra's protection is "todavía más decisiva" here. Fix: "behind the Sierra de Cantabria, whose shelter counts even more here".
3. **Back button restarts the round.** `startReview` calls `go(null)` (QuizScreen.tsx:41, a hash push), so history keeps `#quiz=test&set=...`. Back from the round lands on it and the `testSet` effect starts a new round. Fix: replace that history entry (`history.replaceState`) once the set is consumed.
4. **Escape closes the caption even when meant for something else** (FlyCaption.tsx window keydown). Escape in the search box or on an open dropdown also closes the card. Fix: ignore if `e.defaultPrevented` or the target is an input or combobox.

## Notes
- rioja-alta.json soils: the 1857 phrase in English quote marks is a paraphrase of Spanish "Tintos, blancos y espumosos hechos por el método de Champaña" (p.19). The claim is supported; drop the quote marks.
- All other sentences and captions are supported: Alta (p.15, p.20, p.12 Haro, p.19 Savignon in Haro's station quarter, Reims 1890), Alavesa (p.13 Laguardia/Elciego, p.15, p.20), Oriental (p.15, p.20, p.12 Alfaro, p.15 Alfaro "la más oriental", "Rioja Baja" in rioja-doc p.5). Fly coordinates are map positions with no source.
- URL handling is sound: an unknown chapter, index or huge number drops to the plain place (`validSelection`); `fly` is ignored with `page`; `at` is only used in `getElementById`; `set=` with unknown ids gives an empty round (read from `reviewRound`'s filter, not run). After "Close and stay", the pin stays on the map until another card opens; confirm that is intended.
- Design vs mock (viewed light, iPad, big text; dark page top only): structure matches. Pills are 44 px; the caption card, close and back buttons hold at 834 px and 125% text. Gaps to name in the tester note: jump chip reads "Terroir" where the mock says "The guide"; the "at a glance" box has no map thumbnail or button icon as in the mock (existing box); the jump bar shows no active chip until clicked (existing behaviour). The satellite-unavailable toast and missing hillshade in the shots are test-environment artifacts.
