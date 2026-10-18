# Spain-only badge on the home page (18 Oct 2026)

Thread "Spain only badge", owner ask 16:42Z: a badge on the home page saying only Spain is available now, more countries coming soon.
Branch `claude/spain-only-badge-ba3jgw`. Small slice (one line of copy, no new screen).

## Done
- Champagne pill above the hero headline: "Spain first. More countries coming soon." (`index.html`, `.hero .soon` in `src/home/home.css`).
  Shows on desktop and phone above the fold. UI test checks the text (`tests/ui/home.spec.ts`).
- First look: four placements subtle to bold (eyebrow, pill, card on the map, strip under the bar) in
  `/mnt/project-files/atlaslope/mocks/spain-badge/`, plus `built-desk.png` and `built-phone.png` of the build.

## Decided
- Pill and wording are the recommended options on his two cards; built on them while the cards wait [A until he taps].

## Open
- His tap on placement and wording. The other wordings: "Now covering Spain. More countries soon." and "Spain for now. More countries on the way."
- "Coming soon" is a promise while no next country is approved (plan /mnt/project-files/atlaslope/plans/2026-10-17-more-countries-plan.md).
  The badge names no country on purpose.
