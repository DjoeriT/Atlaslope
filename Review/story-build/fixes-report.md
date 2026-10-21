# Story fixes report (BuilderBot, branch agent/builder/story-fixes)

Runs: `npx vitest run` 41 files, 372 tests pass (1.5 s); `npx playwright test tests/ui/story.spec.ts` 4 pass (9.6 s); `npm run build` ok (1.7 s). Shots taken with outside hosts blocked (no Esri key, base map only).

- B1 fixed: label set after addTo; story-mk and story-dot get aria-hidden; UI test checks a "Fact: ..." button.
- B2 fixed: credit and phone short form are both "Source: IGME, MAGNA 50" (strings.ts); unit test updated.
- B3 fixed: square crops for rioja-2 (40% 50%) and priorat-1 (10% 30%, moved left to keep the cypresses) in data/story/photo-focus-square.json, with file hash. Not in photoCrops.json: its test rejects photos the Guides page does not show. Sheet: shots/crops-square.png. storyList.ts uses it; test asserts focus and fresh hash per listed photo.
- S1 fixed (StoryView.tsx): siblings of the story get `inert` while open; focus goes to "Back to <place>" on open and to the story button on close; story `<main>` is now a region (one main landmark). Focus return covered by the existing Escape UI test only; not separately asserted.
- S2 fixed: user movestart bumps the flight token, so leg 2 is dropped.
- S3 fixed: src/story/files.ts finds data/story/<names|rivers|slope>-<id>.*; layers skip a missing file; rivers credit only with a rivers file; tests/unit/story-files.test.ts. Left hard-coded: the `rioja` zone-label block in layers.ts (zones data is Rioja-only).
- S4 fixed: phone credit wraps to two lines; short forms now "Rivers, names: IGN CC BY 4.0" and "Beck et al. 2023 CC BY"; locator and recentre lifted above it. Camera padding already measures the bar.
- S5 fixed: onImageryFailed re-sends the last layer list with imagery false.
- C Siurana label: fixed, labels now anchor left of their point (offset 12 px); shot story-priorat-siurana.png.
- C phone legend: fixed, moved under the chip, full class names, clear of the locator; shot story-rioja-climate-phone.png. Review noted the credit cut over the text column: the strip is a separate bar now taller by one line, not re-checked against the text column below the map.
- C geology legend: already shown at soils steps ("Colours: rock types, IGME MAGNA 50"), no change. Shot story-rioja-soils.png retaken (no key, so no imagery or geology tiles in it).

Commits: 1c8a1fb (A), then B and C commit, then this report update.
