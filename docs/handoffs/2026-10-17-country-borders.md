# Country borders at the start view (#40), 17 Oct 2026

**Done.** The owner saw no Spain–Portugal border and no other country borders on the plain map at the start view; toggling a layer brought them back.
- Cause [V, reproduced in headless Chromium]: with 3D relief on, MapLibre 4.7.1 draws flat layers into textures on the terrain and reuses
  them. Layers drawn before the world map's GeoJSON arrived were never redrawn, and paint changes did not show either (an ocean colour change stayed invisible until the terrain was set again).
  The France–Switzerland, Pyrenees and Gibraltar borders were missing; the data file has them all.
- Fix: `redrape()` in `src/map/createMap.ts` sets the terrain afresh once the map is idle after the world map loads, and on every menu change.
- Borders also got a light halo (`borders-casing`, white on the atlas, dark over imagery) and are a little wider (1.1 to 1.8 px), so they read over dark relief shading.
- Test: `tests/unit/map.test.ts` checks the halo sits right under the border line. UI tests run without tiles, so the terrain redraw itself is only checked by the screenshots in the PR.

**Open.** Other layers changed without a menu change (selection highlight, quiz reveal) may hit the same stale-texture issue; not seen. Upgrading MapLibre to 5.x may fix it at the root; not tried.

**Where.** PR from `claude/project-thread-leh88p`; issue #40.
