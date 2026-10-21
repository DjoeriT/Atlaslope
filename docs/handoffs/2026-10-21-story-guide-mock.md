# Story guide ("Read with the map") mock, rounds 2-3 (#127, #148), 21 Oct 2026

## Done
- #127 answered [V]: the Rioja flyby was never built; only the accepted mock (`Review/mock-story-guide-v1/`, PR #75). The live guide's 7 "See … from above" links work.
- PR #169 (BSk "cool, dry steppe") and PR #170 (slope measure, selection rule) merged.
- Mock rounds 2 and 3 for Rioja + Priorat: `Review/mock-story-guide-v2/`, `Review/mock-story-guide-v3/` (build.py, README, shots/, photos/credits.json, fetch_layers.py, LAYERS.md).
  Output page (git-ignored, owner's Mac): `mocks/story-guide-v3/index.html`; rebuild with `python3 Review/mock-story-guide-v3/build.py`.

## Decided (owner, 21 Oct 2026)
- Button C, solid black "Read with the map" with a map mark on the right (an owner-approved exception to the no-icons rule).
- Reader scrolls, no autoplay. Terrain x1.5 (x1.3 switch in mock), stated in the credit line. Light tint on land over 30% slope.
- Map stops only from the guide text, plus overview views. Selection: >= 4 stops and big (DOCa or top 8 by area, MAPA DOP report 2023/24) or steep (top quarter by share over 30%): 13 guides, list in `docs/PROJECT.md`.
- All enrichments wanted: rivers (IGN hydrography WFS, CC BY 4.0), names (IGN NGBE), climate layer, geology at soils stops (IGME MAGNA 50 WMS), locator inset, fact markers (guide sentences only), stop photos (Commons), height facts from `place-measures.json`.
- Stronger focus border (3 px champagne on dark casing) and land outside the focus faded 25%.

## Open
- Owner review of round 3 (not yet seen).
- IGME geology licence: no licence stated; "no paid value-added service without contacting IGME". Ask before shipping.
- New sources (IGN hydrography, NGBE, IGME, Commons photos) go into `data/SOURCES.md` in the build PR.
- Fact markers mostly repeat the stop card's sentence; consider markers with other guide sentences.
- Not checked: real Safari, iPad, phone. Headless Chromium only.
- Commons has no licorella (slate) photo; the Priorat slate stop shows Porrera vineyards.

## Cost [V, subagent usage]
Mock v2 builder ~110K, design check 29K, data research 80K, layer fetch 55K, round 3 map 107K, round 3 cards 117K: about 500K, mostly re-reads.

## Next
Owner approves or changes round 3; then build Rioja + Priorat in the app (big slice, ReviewBot), then the other 11 guides a few per PR.
