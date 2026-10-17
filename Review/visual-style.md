# Visual style: the yardstick for the visual design check

Owner, 17 Oct 2026: the information screens should look "immaculate", like Airbnb crossed with a coffee-table book, and
less "Atlassy". He picked the listing page, white and wine for light mode, and gold on black for dark mode. The reference mocks
are `Review/mock-travel-v1/` (map card, place page, region page). Every new or changed screen is checked against this page
(CLAUDE.md, "Visual design check"). If a screen needs something this page does not cover, the screen's lead thread proposes
an addition and the owner decides.

## Colour
- One accent per theme. Light: wine `#8C2340` on white `#FFFFFF`. Dark: gold `#C9A54E` on `#121212`, text on gold is `#141210`.
  The dark accent matches the dark logo.
- Ink: light `#1F1F1F` / `#484848` / `#6E6E6E`, lines `#EBEBEB` and `#DDDDDD`. Dark `#F3F1EC` / `#CFCBC3` / `#9A968F`, lines `#2A2A2A` and `#3A3A3A`.
- Charts use tints of the accent only (light `#8C2340`, `#D9677E`, `#F2C4CD`, `#F7E6EA`; dark `#C9A54E`, `#8F7536`, `#4A3F25`, `#2A251B`).
  No browns and no cream paper. Wine-colour swatches (red, white, rosé) are the one exception, because they show the wine itself.
- The map keeps its own region colours; the chrome around it follows this page.
- Text contrast is at least 4.5:1, including source lines and photo credits.

## Type
- Newsreader for names, headings and the opening sentence. IBM Plex Sans for everything people read in bulk: body, facts, labels, buttons.
- Scale (rem): 0.78 small print (sources, credits), 0.9 labels, 1.0 body, 1.25 opening sentence, 1.6 section heading,
  2.3 card title, 3.2 page title, 5 to 8.5 cover title. Uppercase only for kickers (0.72, letter-spacing 0.14em).
- Body lines stay under about 75 characters.

## Space and shape
- 8 px rhythm: gaps of 0.5, 1, 1.5, 2 or 3 rem. Sections are separated by a 1 px line and 2 rem of space.
- Radius: 1.25 rem for cards and panels, 1 rem for photos and tiles, pills fully round. Shadows are soft and used only on floating things
  (map card, the "at a glance" box, buttons over photos).
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

## How the check is run
1. Screenshots: desktop 1440x900 and iPad 834x1194, light and dark, plus large text (root font 125%).
2. ReviewBot in design mode compares them with this page and with the reference mocks, and writes findings with fixes.
3. LeadBot fixes the findings before the owner sees the screen. A fix that would change an owner decision goes to him as a card.
4. Before a release, the built screens get the same screenshots, compared with the approved mock. A gap is fixed in the slice
   or named in the tester note.
