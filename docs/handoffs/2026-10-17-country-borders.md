# Country borders at the start view (#40), 17 Oct 2026

**Done.** The owner saw no Spain–Portugal border and no other country borders on the plain map at the start view; toggling a layer brought them back.
- Cause [V, reproduced in headless Chromium]: with 3D relief on, MapLibre 4.7.1 draws flat layers into textures on the terrain and reuses
  them. Layers drawn before the world map's GeoJSON arrived were never redrawn, and paint changes did not show either (an ocean colour change stayed invisible until the terrain was set again).
  The France–Switzerland, Pyrenees and Gibraltar borders were missing; the data file has them all.
- Fix: `redrape()` in `src/map/createMap.ts` takes the terrain off and puts it back once, when the world map source has loaded (a `sourcedata` check, not `idle`: in the container the terrain tiles never all load, so `idle` never fired). Menu changes keep the old single `setTerrain` call. ReviewBot (merge after fixes) flagged redrawing on every menu change as a camera and tile-reload risk, so that was dropped. Re-setting the same terrain without taking it off first was not enough. Checked in three headless runs: the Pyrenees border showed every time.
- Borders also got a light halo (`borders-casing`, white on the atlas, dark over imagery) and are a little wider (1.1 to 1.8 px; halo 2.5 to 4 px), so they read over dark relief shading.
- Test: `tests/unit/map.test.ts` checks the halo sits right under the border line. UI tests run without tiles, so the terrain redraw itself is only checked by the screenshots in the PR.

**Open.** Other layers changed without a menu change (selection highlight, quiz reveal) may hit the same stale-texture issue; not seen. Upgrading MapLibre to 5.x may fix it at the root; not tried.

**Where.** PR from `claude/project-thread-leh88p`; issue #40.
