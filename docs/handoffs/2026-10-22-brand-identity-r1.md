# Brand identity round 1 (22 Oct 2026)

## Done
- Owner interview [O]: AtlaSlope is a digital field guide. Direction is cartographic precision. The identity is **fully open**, so the
  black band, champagne and Newsreader/Plex rules in `Review/visual-style.md` do not bind this round.
  Colours vibrant. Type: compare suggestions. Name setting explored per block. All nine blocks: three flavours x three imagery routes.
- Mock: one page, `mocks/brand-identity-r1/index.html` (git-ignored), Artifact https://claude.ai/artifact/PQAYXbq3SV9srB3LpfYUCT.
  - A Swiss topographic, B Survey, C Nautical chart. Each comes in 1 Real data, 2 Photos first, 3 Type and data only.
  - Every block shows logo and mark, home cover, the Rioja Alta field guide entry, and the map with a place card.
  - **Recommended: a1** (Swiss + real data). It has the calmest precision. The real Rioja DOCa outline is the mark. Contours and relief make
    it unlike other wine sites.
- Real map assets: `Tools/brand/make_assets.py` builds Rioja relief, contours every 50 m and zones, plus Spain relief, DO outlines and neighbours.
  Sources are MDT25, MDT200, MAPA and rioja-zones, all in `data/SOURCES.md`; nothing was fetched. `Tools/brand/maps.js` draws them into each mock.
  `assemble.py` merges the parts into one page, and `shot.mjs` and `blocks.mjs` take screenshots.
  The shared builder brief is `Tools/brand/BRIEF-r1.md`.
- Checked [V]: the merged page was shot per direction in 3200 px pieces at 1440 wide, and all nine blocks render with their maps and photos.
  The hosted Artifact is not checked: claude.ai asks for sign-in in the built-in browser [A].

## Spend
- Builders (Sonnet, one-shot): A 74K, B 87K, C 107K tokens [V], 268K new in all. The re-read share is not measured.
- LeadBot's context is about 150K [A].

## Known gaps
- The a1 and b1 outline marks turn into a blob at 16 px. A typographic fallback is needed for favicons.
- Over-photo logos sit on a paper plate, because the rule is no text on photos.
- Fonts come from Google Fonts. A build would self-host them.

## Open (owner)
- Pick a flavour and route, or a blend. Round 2 then refines one direction across more surfaces: Study, Guides page, share image.
- Does "no dark mode" still hold under the new identity?
