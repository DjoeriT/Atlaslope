# Portugal photo round: Douro and Vinho Verde (issue #149, 22 Oct 2026)

## Decided (owner, 22 Oct 2026)
- Home/Guides layout: option C of the pilot mock, with "a lot of pictures" (confirmed in his words this session).
- Photos: "Yes, ship your recommended picks for both places." Douro 18 of 20 candidates (dropped an indoor corridor and B/W
  barrels), Vinho Verde 9 (Commons is thin there: the rest were river views, buildings, a marina, a pool).

## Done (PR on `claude/pt-photos`)
- `Tools/data/photo_candidates.py pt`: Portuguese vine words, denser disc cover, name search and category walk (`PT_CATS`), 20 kept
  per place, at most 2 per photographer, files naming the neighbouring place dropped (Douro panoramas fell inside Vinho Verde), all
  kept files saved under `all` so ranking can be redone without a search. `get()` now retries Commons' 200-with-error bodies
  (`cirrussearch-too-busy-error` killed two runs). Sheets: `Review/sources/contact-sheets/pt-*.jpg`.
- Shipped `douro-1..18`, `vinho-verde-1..9` (`data/photos.json`, `public/photos/`, sizes). Shipped with a one-off script using
  `photo_ship.py`'s functions, not its main: main unlinks every photo not in `photo-picks.json`, which would delete the story
  photos. Overlay text cut off the bottom of douro-4, -17, -18 (`trimBottomPx` in the picks). Alt texts by hand. Credits row in
  `data/SOURCES.md`.
- Square crops checked by eye (three moved: douro-16/18 to 72%, vinho-verde-2 to 30% high). Parked in
  `Review/sources/photo-crops-pt.json`: the unit test refuses crop entries for photos the Guides page does not show, and Portugal is
  still behind `SHOWN_COUNTRIES`. The build that shows Portugal moves them in with `crop_sheet.mjs --write` and the same focus.
- Guide pages and map cards showed photos only for places with Study (`quiz !== 'none'`, a release 9 leftover). Dropped for photos
  only (`PlacePage.tsx`, `Cards.tsx`): Douro and Vinho Verde now open with photos, and so do Cava, Catalunya, Arinzano and Otazu,
  whose shipped photos were hidden the same way [V, place-page spec 19/19, unit 533/533].

## Not done (where it goes)
- Mock round 2 of option C (photo-rich Portugal row on Home and Guides), one-shot helper, one page, link back. Next session.
- Then the build: country heading on Guides, `/pt/` links, home copy (his words), drop `SHOWN_COUNTRIES`, move the parked crops in.
- A guide page shows three photos (`photosOf` slice); the other 15 + 6 are for the Home/Guides rows and later use.
- More Vinho Verde photos would need another licensed source (CVRVV, Visit Portugal): licence check first.

## Numbers
- This session [A, ~50 calls x ~90K]: about 4M re-read + 0.1M new. The Commons runs were background scripts (no context cost).
