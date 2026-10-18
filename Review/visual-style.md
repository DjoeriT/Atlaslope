# Visual style: the yardstick for the visual design check

Owner, 17 Oct 2026: the information screens should look "immaculate", like Airbnb crossed with a coffee-table book, and
less "Atlassy". He picked the listing page. On 18 Oct 2026 he dropped dark mode and wine red: one light theme, black and champagne
(palette rounds 1 to 5, https://claude.ai/artifact/3hiFjKAVqRKNoesnxW9R7Q, handoff `docs/handoffs/2026-10-18-black-and-champagne.md`). The reference mocks
are `Review/mock-travel-v1/` (map card, place page, region page). Every new or changed screen is checked against this page
(CLAUDE.md, "Visual design check"). If a screen needs something this page does not cover, the screen's lead thread proposes
an addition and the owner decides.

## Colour
- One theme, light. White paper `#FFFFFF`, warm second paper `#F7F5F0`. Black `#141414` is the band (page top bar, brand) and the
  main buttons; champagne `#E9D8B4` is the foil on black (logo, band type, button text, the line under the band). Small labels and
  the drop cap use dark champagne `#7D6540` (5.5:1 on white). Wine red is gone from the interface: the category over-uses it.
- Ink `#1A1714` / `#46403A` / `#6F6860`, lines `#E8E3D9` and `#D8CFBF`.
- Corners are small (`.3rem`, cards `.4rem`), no pills; shadows start with a hairline. Soft round chrome read as a template.
- Charts use black and champagne tints only: `#141414`, `#7D6540`, `#C9B48A`, `#EFE6D2`. No pinks. Wine-colour swatches
  (red, white, rosé) are the one exception, because they show the wine itself.
- The map keeps its own region colours. The selected place is black with a champagne edge, so it stands off the atlas and the photo.
  Parts of a selected place (Rioja's zones) take the same black and champagne: thin champagne lines between them, black when one is
  picked, never a colour of their own (site visual review, 18 Oct 2026: a wine zone tint made the selection read wine-brown).
- The keyboard focus ring is black (`--focus`), champagne on the black band. No blue.
- The system's dark setting is ignored; there is no theme switch.
- Text contrast is at least 4.5:1, including source lines and photo credits (`tests/unit/contrast.test.ts`).

## Type
- Newsreader for names, headings and the opening sentence. IBM Plex Sans for everything people read in bulk: body, facts, labels, buttons.
- Scale (rem): 0.7 credit tags on photos, 0.78 small print (source tags, credit lines), 0.9 labels, 1.0 body, 1.25 opening sentence,
  1.6 section heading, 2.3 card title, 3.2 page title, 5 to 8.5 cover title. Uppercase only for kickers (0.72, letter-spacing 0.14em).
  No sizes between the steps (site visual review, 18 Oct 2026: the guide had drifted to 22 size and weight pairs).
- Newsreader weights: 500 for every heading and name; regular (400) for display type, the home page's big headline and its numbers
  (owner 18 Oct 2026, 15:09Z: light 300 read too thin next to the headings below it).
- Body lines stay under about 75 characters.

## Space and shape
- 8 px rhythm: gaps of 0.5, 1, 1.5, 2 or 3 rem. Sections are separated by a 1 px line and 2 rem of space.
- Radius: small, as in Colour: `.3rem`, cards and buttons `.4rem`, no pills (owner 18 Oct 11:49Z: "soft buttons"). Shadows are soft and used only on floating things
  (map card, the "at a glance" box, buttons over photos, cards over the map).
- Targets are at least 44 px. Every interactive item has a visible focus ring.

## Photos
- A screen with a place or region on it leads with a real photo of that place: a cover on the card, a five-photo mosaic on the place page,
  a cover on the region page, and tiles for the places.
- Wine places show vines, landscape or villages. No trains, roads or unrelated buildings as the first photo (Calatayud's first photo is a train).
- Crops fill their frame (`object-fit: cover`) at a fixed ratio: cover 16:11, tile about 1:1, zone 4:3. No letterboxing and no washed-out skies.
- Every photo shows its credit and licence in readable text: a "Photos:" line under a mosaic or grid, and on a single cover a small
  credit tag in its bottom-right corner (owner, 18 Oct 2026: "way smaller"): artist and licence only, 0.7 rem white on 55% black,
  tucked into the corner, small corners. That still clears 4.5:1 over a white sky (`tests/unit/contrast.test.ts`). Never bare text on the picture.
- Alt text describes what is in the picture, not the file name.

## Content
- Facts come only from sources, and every fact keeps a visible source link. A highlight or headline restates one sourced fact
  and links to the section that holds its source.
- On a guide, the link is a short source tag under the fact, such as "Pliego, p. 15" or "EU single document, p. 5", in small print,
  and still a link to the document itself. Each document is listed once, in full, in a Sources section at the end of the guide, under the
  tag it goes by (owner card, 18 Oct 2026, "Go, short citations": about 20 full titles had turned the guide into a footnote apparatus).
  The short names: Pliego, EU single document, Wikipedia, MAPA list, Köppen-Geiger, Measured (`shortTitle` in `src/facts/format.ts`).
  Cards on the map keep the full line, since they have no Sources section.
- No text cut off mid-sentence. If it does not fit, show a shorter sourced fact instead.
- One way out and one main action per screen. On the full page these are Atlas in the site bar (back to the place on the map) and
  "Show [place] on the map". No two controls that mean nearly the same.

## Website pages (home, owner 18 Oct 2026)
- Reference: `Review/mock-home-v1/`. The home page shows the product, not a stock photo: the satellite atlas is the hero, with real cards on it.
- Big Newsreader headline (regular weight), one main button in black and champagne, the second action as a semibold text link. Open the
  atlas is the call to action: 60 px tall, semibold, a champagne edge and arrow, and it closes the page again on the black band (owner, 15:09Z).
- Proof is real numbers from the app, not claims. Source organisations appear as their names set in italic Newsreader until each one agrees to its logo
  (owner card, 18 Oct 2026); then their logos in one grey line.
- The site bar: the black band, 64 px (56 on a phone) plus a 1 px champagne line, on every page; a 34 px mark and a 1.6 rem wordmark. Logo
  (goes home), then Atlas, Study, Guides and About on the right, semibold, muted champagne, the current one full champagne and underlined.
  Search is in the bar only on the atlas, where it works in place; elsewhere it could only throw you into the atlas (owner, 18 Oct 15:09Z).
  Phone: the logo's mark, search, Atlas, Study on the atlas (Guides and About wait for a phone menu); all four items on the plain pages.
  It is one bar on every page: the logo 16 px from the window's edge everywhere, the same items; on a guide, Atlas is current and
  there is no separate "Back to map" (site visual review, 18 Oct 2026).
- One left edge per page: section strips, the footer columns and the tiles hang on the same grid. Home tiles show one readable detail
  of the app at close to real size, never a whole screen shrunk.
- The atlas opens on the map: the home page does the welcome, so first-run is a three-line note on moving the map that goes at the
  first touch.

## How the check is run
1. Screenshots: desktop 1440x900 and iPad 834x1194, on the atlas and on satellite, plus large text (root font 125%).
2. ReviewBot in design mode compares them with this page and with the reference mocks, and writes findings with fixes.
3. LeadBot fixes the findings before the owner sees the screen. A fix that would change an owner decision goes to him as a card.
4. Before a release, the built screens get the same screenshots, compared with the approved mock. A gap is fixed in the slice
   or named in the tester note.
