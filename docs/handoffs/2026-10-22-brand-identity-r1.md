# Brand identity rounds 1 to 4 (22 Oct 2026)

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

## Round 2
- Owner on round 1 [O]: A1/Swiss "feels too much like a Democratic Party website"; the rest "too modern to match against the world of wine".
  Wanted: a clean, colourful look blended with wine's traditions.
- Mock: `mocks/brand-identity-r2/index.html`, Artifact https://claude.ai/artifact/EKJ842b4ya38NxABcxtpPB. Four concepts, each with the same
  four screens, real data and photos together:
  - **D Geological sheet (lead, owner's pick to lead):** IGME rock colours deepened into terracotta, olive ink and ochre. Cormorant Garamond + Source Serif 4.
    The mark is an "AS" sheet cartouche.
  - **E The bodega label:** garnacha, oxblood and flat gold. Playfair Display SC + EB Garamond. The mark is an oval "AS" seal with Haro's coordinates.
  - **F Land register:** ink with translucent viridian, madder and gamboge washes. Spectral + Literata. The mark is "Nº 1 / AS" in a ruled box.
  - **G Colour of the ground:** each place takes its ground colour (Rioja ochre, Alta terracotta, Ebro blue-green). Fraunces + Figtree.
    The mark is the real Rioja outline.
- New layer: IGME MAGNA 50 geology for the Rioja frame (`assets/rioja-geology.png`, one WMS GetMap; source already in `data/SOURCES.md`).
  Sheet seams are in the source.
- LeadBot fixes after the build: the Rioja Alta map cards said "DOCa · 3 zones" (my brief's error), now "Zone of DOCa Rioja · 76 municipalities".
  F drew Portugal and France in cerulean, which read as sea, now a quiet land wash.
- Checked [V]: every concept was shot and looked at. The guide sentences match `content/guides/rioja.json` word for word.
- Spend [V]: builders D 36K, E 40K, F 51K, G 42K, 169K new in all. The re-read share is not measured.
- Weak spots: the loud geology fights the palettes in E and G (muted to 50% in G). D's Rioja Alta highlight is faint.
  Every concept's map screen is the least "wine" one.
- Open: the owner picks a concept or a blend for round 3, which takes it across more surfaces (Guides page, Study, share image, favicon set).

## Round 3: the slope line
- Owner on round 2 [O]: "I don't like any of these." He likes the clean white look but finds today's site plain and not unique; wants it
  elevated "in a revolutionary and drastic way", better integrated and more distinctive.
- Idea (owner: "Let's run it"): the slope is the brand. A real terrain profile is the one graphic on a white page; every place has its own line.
  Type stays Newsreader + Plex; one wine-colour accent per place.
- Data: `Tools/brand/make_profiles.py` makes `profiles.json` from MDT25/MDT200 (no fetch). It holds the Spain transect, Atlantic to Mediterranean
  (883 km, 11 distinct DOs crossed), the Rioja cross-section (Sierra de Cantabria crest 1,398 m at km 6.9, Laguardia, the Ebro, Rioja Alta km 20.6 to 39.75),
  and eight DO fingerprints, each W to E through the DO's middle.
- Mock: `mocks/brand-identity-r3/index.html`, Artifact https://claude.ai/artifact/GqsFJd3Ce3UcyFHDU1nJtf. Three treatments: T1 Hairline,
  T2 Silhouette (filled black land, the place in wine red), T3 The line you travel (scroll or drag along 883 km, the card changes per DO).
  Logo: "Atla*Slope*" in Newsreader on the Rioja line; favicon is the line resampled to 9 to 22 points.
- Checked [V]: shots of each treatment viewed; no JS errors; Newsreader and Plex load.
- Spend [V]: builder 94K new tokens. LeadBot context is past 250K: round 4 belongs in a fresh session from this handoff.
- Open: fingerprints share a height scale but not a length scale (fitted per cell). Phone width is not designed yet. The owner picks a treatment.

## Round 4: colour from the land
- Owner on round 3 [O]: "too black and white". He asked for the two other big ideas first.
- Data: `Tools/brand/make_cutouts.py` fetched IGN PNOA aerial photos (WMS twin of the atlas's own WMTS) for all 90 DOs: 8 heroes at 1,400 px, the
  rest at 320 px. Each has its legal outline as an SVG path and a six-colour palette from k-means on the pixels inside it. The `vivid` variant keeps the hue
  and raises saturation, and is labelled "brightened" wherever shown.
- Mock: `mocks/brand-identity-r4/index.html`, Artifact https://claude.ai/artifact/WofFHofVdPeoSYCanTCwnt.
  - **Idea 2 Cut from the land:** each DO is its aerial photo cut to its outline on white. The Rioja cut-out is the home hero with a slow zoom.
    The system grid shows all 90. The 16 px mark falls back to the outline in Rioja's ochre.
  - **Idea 3 The colour atlas:** each place's measured palette. The home is a mosaic of 90 palette tiles, and the guide opens with Rioja's palette as a field.
- Checked [V]: both ideas shot and viewed. Spend [V]: builders 41K (cut) and 26K (col).
- Honest limit: from the air Spain's wine land is ochre, olive and green, so idea 3 reads earthy, not bright. Idea 2 is the more alive of the two.
  A next step for more colour that stays true: add each place's wine colour (red, white, rosé), already allowed in `Review/visual-style.md`, as the accent.
- LeadBot context is well past 250K. The next round must start in a fresh session from this handoff.

## After round 4: the real gap (owner, 22 Oct 2026) [O]
- "This is all not good enough. Way too white." Then: "Not enough pictures that make it come alive."
- Read: the missing ingredient across all four rounds is photography. Every mock rested on type, lines or data, with photos as small proof.
  The next round is **photo-led**: big, immersive, full-bleed pictures of vineyards, people, cellars, light and seasons, with the real-data
  pieces (slope line, cut-out, palette) as quiet supporting detail.
- The bottleneck is the photo library: 222 Commons photos, shipped at 800 px max (`public/photos/800/`), 9 for all of Rioja. A photo-led brand needs
  more and larger pictures per place. First step in the fresh session: a script pulls the full-size originals of the photos already picked
  (licences already checked in `data/photos.json`), then adds 15 to 25 strong candidates per hero place from Wikimedia Commons, with the owner picking from a contact sheet.
  Only then a mock.
