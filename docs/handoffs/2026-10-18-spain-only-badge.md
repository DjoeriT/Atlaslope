# Spain-only badge on the home page (18 Oct 2026)

Thread "Spain only badge", owner ask 16:42Z: a badge on the home page saying only Spain is available now, more countries coming soon.
Branch `claude/spain-only-badge-ba3jgw`. Small slice (one line of copy, no new screen).

## Done
- Line under the Open the atlas button: a champagne SPAIN tag plus "Live now. More countries coming soon." (`index.html`,
  `.hero .reach` in `src/home/home.css`; `.soon` was already taken by the closing band). UI test checks the text (`tests/ui/home.spec.ts`).
- Owner 16:44Z [O]: "I want the pill somewhere around the Open the atlas button. Maybe another element there makes sense?" First pass had the
  pill above the headline; moved. Mocks A (pill under button), B (tag plus line, built), C (Spain / More countries soon chips).
- First look: four placements subtle to bold (eyebrow, pill, card on the map, strip under the bar) in
  `/mnt/project-files/atlaslope/mocks/spain-badge/`, plus `built-desk.png` and `built-phone.png` of the build.

## Decided
- Built B, the recommended option on his card, while it waits [A until he taps]. C was not recommended: chips look clickable, like a country switcher that does nothing.

## Open
- His tap on A, B or C.
- "Coming soon" is a promise while no next country is approved (plan /mnt/project-files/atlaslope/plans/2026-10-17-more-countries-plan.md).
  The badge names no country on purpose.
