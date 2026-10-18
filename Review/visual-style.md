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
- The system's dark setting is ignored; there is no theme switch.
- Text contrast is at least 4.5:1, including source lines and photo credits (`tests/unit/contrast.test.ts`).

## Type
- Newsreader for names, headings and the opening sentence. IBM Plex Sans for everything people read in bulk: body, facts, labels, buttons.
- Scale (rem): 0.78 small print (sources, credits), 0.9 labels, 1.0 body, 1.25 opening sentence, 1.6 section heading,
  2.3 card title, 3.2 page title, 5 to 8.5 cover title. Uppercase only for kickers (0.72, letter-spacing 0.14em).
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
- Every photo shows its credit and licence in readable text: a pill on a single cover, a "Photos:" line under a mosaic or grid.
  Never small text printed over the picture.
- Alt text describes what is in the picture, not the file name.

## Content
- Facts come only from sources, and every fact keeps a visible source link. A highlight or headline restates one sourced fact
  and links to the section that holds its source.
- No text cut off mid-sentence. If it does not fit, show a shorter sourced fact instead.
- One way out and one main action per screen. On the full page these are "Back to map" and "Show [place] on the map".
  No two controls that mean nearly the same.

## Website pages (home, owner 18 Oct 2026)
- Reference: `Review/mock-home-v1/`. The home page shows the product, not a stock photo: the satellite atlas is the hero, with real cards on it.
- Big Newsreader headline (light weight), one main button in black and champagne, the second action as a text link.
- Proof is real numbers from the app, not claims. Source organisations appear as their names set in italic Newsreader until each one agrees to its logo
  (owner card, 18 Oct 2026); then their logos in one grey line.
- The site bar (slice 2): the black band, 52 px plus a 1 px champagne line, on every page. Logo (goes home), then Atlas and Study on the right in muted
  champagne, the current one full champagne, semibold and underlined, then search. On the atlas, search is the field; on the home page a link to it.
  Phone: the logo's mark, search, Atlas, Study in one row. Guides and About join when their pages exist.

## How the check is run
1. Screenshots: desktop 1440x900 and iPad 834x1194, on the atlas and on satellite, plus large text (root font 125%).
2. ReviewBot in design mode compares them with this page and with the reference mocks, and writes findings with fixes.
3. LeadBot fixes the findings before the owner sees the screen. A fix that would change an owner decision goes to him as a card.
4. Before a release, the built screens get the same screenshots, compared with the approved mock. A gap is fixed in the slice
   or named in the tester note.
