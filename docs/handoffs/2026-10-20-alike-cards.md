# Handoff: "If you like this, try" cards (20 Oct 2026, #126)

## Done
- Each card now says what differs, not "Tempranillo here too" three times [V]. `alikePlaces` in `src/pages/helpers.ts` gives each card a
  kind of reason no earlier card took: height (median differs by 150 m or more), then climate (their main Köppen class differs, as a
  plain phrase), then study region. A card that could only repeat an earlier line is left out. Words: `t.page.alike` in `src/strings.ts`.
- Climate-only matches name the climate ("Warm, dry summers") instead of "Same climate".
- Rioja [V]: Valtiendas "about 400 m higher", Navarra "with hot summers and rain all year", La Mancha "in the Meseta". Costers del
  Segre dropped out of the three: same suggestions, the one-per-region pass now picks La Mancha's region.
- Over all 79 Study places: 0 pages with a repeated line, 229 cards (unchanged) [V].
- Navarra's card photo: the hazy white sky is trimmed off the top (20%), checked by eye on the page [V]. New `src/pages/cardCrops.json`
  (`trimTop` + file hash); CSS scales the photo from its bottom edge. A unit test in `tests/unit/guide-shape.test.ts` fails when a trimmed
  file changes, so the trim gets a fresh look.

## What to test (tester note)
- Rioja page, "If you like this, try": three different lines; Navarra's photo has no white band at the top.
- Any other place page: the card lines differ from each other and read naturally.

## Open
- Some lines still end in "here too" where nothing else differs (46 of 229 cards, at most one per page by design).
- Card trims are a list by hand; only Navarra has one. Other pale-sky card photos were not reviewed.
- Not verified: Safari, phones.
