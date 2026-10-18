# Handoff: black and champagne, light only (18 Oct 2026)

Thread "light palette" (owner 07:49Z: light mode wine and white "feels so vibecody").

## Done
- Why it read generic [V]: wine was the accent on every control (34 `var(--accent)` uses), on pure white with flat greys, pink chart tints, pill and round chrome.
- Five rounds of options on real screens, the last on real satellite imagery: https://claude.ai/artifact/3hiFjKAVqRKNoesnxW9R7Q.
  Scripts and override CSS: `/mnt/project-files/atlaslope/mocks/light-palette/` (satellite in the cloud: build with `VITE_ESRI_API_KEY=mock`, route
  `ibasemaps-api.arcgis.com` tiles to public `server.arcgisonline.com` World_Imagery in Playwright).
- Built: tokens in `src/styles/app.css` (`--band`, `--foil`, `--foil-ink`; accent black), chart tints in `pages.css`, page top bar as the black band,
  brand and logo in champagne, small corners everywhere (pills gone), map selection `SELECTED` in `src/map/style.ts` (black fill, champagne edge),
  name covers black. Dark mode removed: `src/app/theme.ts`, the menu item, the pre-paint script, all `[data-theme="dark"]` rules.
- Style sheet, ADR 32 and AGENT_ROLES now say atlas and satellite instead of light and dark. Tests: contrast (light pairs plus champagne),
  a "stays light when the system is dark" test replaces the two theme tests, the light/dark loops in cards, facts and place-page specs are single tests.

## Decided (owner)
- 10:18Z wine label liked but the gold did not match the band; 10:20Z champagne, "premium and high-end"; 10:23Z drop wine red, over-used;
  10:28Z must work on map and satellite; 10:46Z drop dark mode, light gets the black and champagne treatment.
- 10:49Z finish this slice, then a wider plan.

## Open
- Wider plan (next thread): a persistent top bar and a website around the tool (home page, information pages, the atlas as one page).
  Needs a mock first and real page addresses instead of `#` links for search engines.
- The selected place over satellite is not seen yet: region outlines did not draw in the cloud satellite screenshots. Check live.
- `Review/mock-travel-v1/` and the story-guide mock still show wine; they are history, not the yardstick.
