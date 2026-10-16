# Paraje mock-ups, round 2.1 (15 Oct 2026)

Lives in `public/` so the Pages site serves it at `/Paraje/mocks/atlas-v2/`; `Review/mock-atlas` links here. Sources and licences for everything in `assets/data.js`: `data/SOURCES.md`, section "Mock-only layers".

01 and 02 retired in release 2; the app has them.

Open `index.html` and click through. Self-contained: MapLibre, the typefaces and all geography ship in `assets/`. Satellite imagery (Esri) and 3D terrain (Mapzen on AWS) stream from the internet when the page is open.

## What is real
- DO boundaries: the official MAPA layer, 2014 edition, from the paraje repo (`data/dops.geojson`). Cava, Cataluña and the Vinos de Pago are left out of the mock.
- Rioja zones: built from the official municipality lists (repo `data/rioja-zones.geojson`).
- Coastlines, borders, rivers, towns: Natural Earth. Terrain: real elevation.
- Type: Newsreader (names) and IBM Plex Sans (interface), both SIL Open Font Licence, bundled.

## What is still schematic
Rioja soil areas, the photos (placeholder gradients), quiz scores and progress, search. Macro-region assignment of each DO is mine and needs a check against the SWS syllabus.

## Controls
Layers button (top right): Satellite or Atlas base map, 3D relief, DO boundaries, soil, photos. Half-circle button: light paper chrome or dark chrome. Bottom right: zoom, tilt to 3D, reset north. Drag with right mouse or two fingers to rotate.

## Changed in 2.1 after the fresh-eyes review
Map frames itself around the card at every width, so nothing you are asked to find hides under it. Labels no longer overlap (lower-priority ones give way). Quiz instructions and the tap status live in the card, with a type-the-name field for keyboard and iPad. Rioja zone outlines only on the Rioja screen. Chrome follows the system light or dark setting, with the half-circle button as override. "3D" button with a pressed state, compass only when rotated. One wording: Start quiz, Retry missed (3), New quiz; "Quiz me on Rioja" preselects Rioja. Area chips on the set-up screen dim the rest of the map. Dark-mode map buttons fixed. Tap targets at 44px, photo pins announce their caption and scroll to the photo.

## Known limits
Satellite and terrain need internet; offline you get the Atlas base map without relief. Tested at 1440 and 1024 wide in light and dark; phone width is a stacked layout, lightly tested.
