# Plan: build the new look (releases 8 and 9)

Approved design: `Review/mock-travel-v1/` and `Review/visual-style.md` on main (PR #33). Nothing lands on main until `release-7` is tagged.

## Recommended split
**Release 8, colours and type everywhere (small, fast).** Swap the old cream and brown tokens for the approved ones: white and wine in light,
gold on `#121212` in dark, the type scale, radius, focus rings. Covers the top bar, search, map menu, the current map cards, fact rows and the
quiz screens from release 7. No layout changes, so no new mock; LeadBot's own check plus screenshots in light, dark, iPad and large text.

**Release 9, the travel pages.** Map card becomes the teaser with a cover photo; new full place page (photo mosaic, section jump bar,
ruled sections, "at a glance" box, small charts for ageing, climate, soil and altitude, "Back to map" and "Show X on the map"); region page
with cover and photo tiles. Plus the photo pass below. ReviewBot design check on the built screens against the mocks before you see it.

Why split: if the card turned into a teaser before the full page exists, the facts would disappear from the app for a release.
Release 8 gives you the colours within a day without that risk.

## The photo problem (the biggest risk to "immaculate")
- [V] 32 of 109 places have no photo at all, including Jerez, Manzanilla, Cava, Catalunya, Islas Canarias and most Vinos de Pago.
- [V] 77 places have photos: 22 have one, 38 two, 17 three (scope says up to three; the mock mosaic is drawn for five).
- [V, from alt text] Many first photos are not vines: Calatayud a train, Abona a surfing beach, Bullas a beach, Ribera del Guadiana a Roman
  theatre, Lebrija and Toro churches, Almansa a castle, Txakoli de Álava a road. My count from captions is about 15 to 20 [A until looked at].
- Plan: a photo pass through the existing photo workflow (GitHub Actions, since Wikimedia rate-limits the cloud). Reorder or replace off-topic
  first photos, fill the no-photo places where an open-licence photo exists, keep the cap at three. The mosaic adapts to 1, 2 or 3 photos.
  A place with no usable photo gets a clean cover of its boundary on the atlas colours, never a broken frame.

## Context
The quiz ships as release 7. The style sheet asks for tokens, so the quiz thread kept styling in shared variables; release 8 is mostly a token
swap in `src/styles/app.css`, `src/styles/quiz.css` and `src/map/map.css`. Release 9 adds new React screens (place page, region page) and
a route for them; charts are plain SVG (no chart library, to stay under the 2 MB download check).

## Upside (measured at the end, reported per release)
- Release 8: every screen on the approved palette; a script checks all text and background token pairs at 4.5:1 or better in both themes.
- Release 9: target a vines, landscape or village first photo on at least 90 of 109 places (today about 60 [A]), and the named fixes above.
  Each of the 109 places gets a full page; the 10 study regions get a cover page. Built screens compared with the three approved mocks.

## Risks
- Release 7 still publishing; release 8 restyles its screens, so building starts only after the tag. The photo pass can start now (data only).
- Some Pagos may have no open-licence photo at all; those get the boundary cover and are named in the tester note.
- Satellite tiles are blocked in cloud previews; screenshot checks show the plain atlas, map views go to your Mac as before.
- Release 9 is the larger build; the 50% token brake applies per release.

## Effort (tokens; compared with release 3 at about 0.39 M and release 4 at about 0.8 M)
| Release | Who | Estimate |
|---|---|---|
| 8 | LeadBot (this thread, Opus) | 120 to 180k |
| 8 | 1 BuilderBot, Sonnet: tokens and chrome | 100 to 150k |
| 8 | ReviewBot, Sonnet: code plus screenshot check | 60 to 80k |
| **8** | **total** | **about 0.3 to 0.4 M** |
| 9 | LeadBot (Opus) | 200 to 250k |
| 9 | Scout, Sonnet, plus Actions runs: photo pass | 100 to 150k |
| 9 | BuilderBot, Sonnet: place page and charts | 200 to 250k |
| 9 | BuilderBot, Sonnet: map card teaser and region page | 100 to 150k |
| 9 | ReviewBot, Sonnet: design check and code review | 100 to 150k |
| **9** | **total** | **about 0.7 to 0.95 M** |

Together about 1.0 to 1.35 M. Without the photo pass release 9 drops by about 0.15 M, but about a third of the place pages would open on
a missing or wrong photo.
