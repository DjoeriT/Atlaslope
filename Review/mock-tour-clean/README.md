# Map tour round 1 (mock, #148)

**Owner, 21 Oct 2026: "These are all bad."** All four directions dropped; the v3 journey comes back (`docs/handoffs/2026-10-21-tour-v3-restore.md`).

`index.html`: one self-contained page (about 1.5 MB, images inlined). Four directions (1 Still guide, 2 Guide plus "Fly the tour", 3 Scenes
recommended, 4 Film), each with the same four Rioja stops on desktop (1440x900 frames) and phone (390x844 frames), a camera line and a "Pick one" list.

## Where the images came from
- Satellite frames: the app itself, release build (`vite build --outDir dist/tour`), opened at `atlas/#place=rioja&page&story` in Playwright
  Chromium (1440x900 and 390x844), each stop reached the way `Tools/shots-tour.mjs` does it (its fly link or scroll). `npm run shots:tour -- rioja`
  was run first as a check (imagery loaded at all 10 stops by eye; the script flagged 3, two of them by its tile counter only).
  For the mock the map element was then enlarged to the full viewport (CSS only, resize event, 7 s wait) and the top 115 px (desktop) or 54 px (phone) of
  the app chrome cropped off. The camera is the one in `content/stories/rioja.json`, so the tilt and bearing are real. Framing differs slightly from the app
  because the map is taller than in the app.
- Stops: valley (camera center -2.3, 42.37, zoom 8.6, pitch 55, bearing -65), `z-rioja-alta` (pitch 45, bearing 270), `soils` (pitch 62, bearing 15), `haro` (zoom 13.2, pitch 55, bearing 20).
  Stop 1 doubles as the wide establishing view of the valley. The intro (all northern Spain) was captured but is not used.
- Photos: `public/photos/<id>.webp`, 900 px wide, per-photo `object-position` set by eye (hut whole, church and vines, station building). Credits from `data/photos.json`:
  rioja-3 Manuel Velazquez CC BY 3.0; rioja-alta-1 Nicolas Perez Gimilio CC BY-SA 4.0; rioja-alavesa-2 Mentxuwiki CC BY-SA 4.0; rioja-haro-1 BigSus CC BY 2.5.
- Sentences: from the `facts` text in `content/stories/rioja.json` (stop 1 and 4 verbatim; stop 2 and 3 verbatim, soils slightly shortened by the title only).

## Assumed [A]
- "Four places. About two minutes." and "Nine chapters follow, from the place to the producers." are draft copy.
- The frames around the maps (band, cards, subtitle, progress) are drawn for this round and are not the built app. Direction 2 follows release 59 in spirit, not pixel for pixel.
- Photo crops here are not the checked crops in `src/home/photoCrops.json` (only rioja-alta-1 has one, 50% 50%); a real build needs checked crops. Film overlays show the photo mid-fade, so a face-or-glass check does not apply (no people, glasses or bottles in these four photos).
- Map captures include the app's small attribution button at the lower right; the real attribution line is not shown in the frames.
