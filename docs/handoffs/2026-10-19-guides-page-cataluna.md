# Guides page: Cataluña tile (19 Oct 2026)

- Done: owner said the Guides page wasn't updated after release 43. Live check [V]: /guides/ already listed Cataluña (12 guides) and the
  home count said 49; the deploy landed 11:50:30Z with `cache-control: max-age=600`, so he saw a cached page (hard-reload).
- Real gap: Cataluña's row had no satellite tile. The four tiles in `public/guides/` were made by hand, and a missing file silently
  showed no tile. Fixed: `public/guides/cataluna.webp`, rendered by the new `Tools/guides/region_tile.mjs` (local build, keyless Esri,
  glyphs blocked so no names, UI hidden, 1300x812 frame resized to 1200x750).
- Guard: `tests/unit/home.test.ts` fails while a region with guides has no tile and names the script.
- Next region: add its `lng,lat,zoom` line to VIEWS in the script, run it as its header says, look at the tile before the PR.
- Where: PR on `claude/guides-page-cataluna-an9114`, release 44.
