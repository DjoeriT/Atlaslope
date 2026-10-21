# Release 58: what to test (If you like this, try)

On a place page, the "If you like this, try" cards now each say what is different.
Higher or lower, another climate, or another region.

Hard-reload first (Cmd+Shift+R).

1. Open the Rioja page and scroll to "If you like this, try".
2. The three lines differ: Valtiendas "about 400 m higher", Navarra "with hot summers and rain all year", La Mancha "in the Meseta".
3. Navarra's photo has no white band at the top.
4. Open two or three other place pages. No two cards on a page say the same thing, and each line reads naturally.

## For you
- Commits: PR 166 (merge `5535ca3`, head `3057a98`): `alikePlaces` in `src/pages/helpers.ts` gives each card its own kind of reason;
  words in `src/strings.ts`; Navarra card photo trimmed 20% from the top (`src/pages/cardCrops.json`), with a unit test (#126).
- Checks: PR 166's CI on head `3057a98` (scope, check, UI 1-4 of 4), all green; ReviewBot: merge, 0 blockers, its 1 should-fix and
  2 nits fixed. Over all 79 Study places, no page repeats a line.
- Not visible on the site: PR 167 (merge `d847982`), the CI "all checks" gate; `main` is now protected (PR only, checks required).
- Not verified: Safari, iPad, real phones. Other pale-sky card photos were not reviewed.
- Open copy call: "on cold, dry steppe" (Köppen BSk) could read "on cool, dry steppe".
