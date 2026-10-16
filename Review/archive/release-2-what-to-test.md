# Release 2: what to test

## General (every release)
Open https://djoerit.github.io/Paraje/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
The atlas is real now. Nobody could see the imagery from the build machine (its network blocks the tile hosts), so the first look is yours.

1. **Imagery and relief.** Satellite under the whole of Spain, relief when you tilt (the 3D button or two-finger drag). If the map is black or grey, the Sentinel-2 tile address is wrong; say so and it is a one-line fix. Close in on a village: with the Esri key in place it should sharpen past about zoom 10; without it, Sentinel-2 stays and looks soft.
2. **DO layer.** Every DO filled in its study region's colour, names showing without overlap. Priorat reads DOCa, Granada DO, León not "Tierra de León".
3. **The card.** Tap Rioja: name, "DOCa", "Rioja", neighbours (Navarra and Cava, since Cava's area touches it), then tap a neighbour to move. Escape or Close returns you to the map.
4. **Search.** Type "rias": Rías Baixas opens. Type "cebreros": a card saying there is no boundary in the atlas yet.
5. **Views.** The views menu: Spain, the ten study regions, Rioja in 3D.
6. **Light and dark.** Follows your system; the half-circle button overrides and remembers.
7. **iPad and phone.** At iPad width the card sits beside the map; on a phone it stacks at the bottom. Large text in Settings: nothing should overlap.
8. **Mocks.** https://djoerit.github.io/Paraje/mocks/atlas-v2/ now has the quiz pages plus the three new round 2.2 screens (fact question, Rioja lesson, elevation profile), all on the ten study regions. Explore Spain and Rioja are gone from the mocks: the app is them now, and the Explore tab there opens it.

## For you
Commits: release 2 merge f225b0d, round 2.2 mocks merge 2e0bbb5. Checks: `Tools/check.sh ui` exit 0 on 2e0bbb5 (22 unit tests, 10 UI tests, build clean). Not verified: satellite, terrain and label rendering (hosts unreachable from the build machine), Safari, iPad, phone, large text.
Things 1 and 7 are the ones nobody could check before you. The rest have tests behind them.
