# Code review: claude/project-thread-xkhjw7 vs main (zoom detail)
Verdict: MERGE AFTER FIXES. 0 blockers, 5 should-fix, 5 nits. Read-only review of the diff; tsc and vitest NOT run (no node_modules in the review copy). [V] = read in the code, [A] = inferred.

## Blockers
None. Mask maths checks out [V]: Mercator formula, tile box, 2 km strip (width 2*strip, stroke is centred, so 2 km each side), evenodd for holes, neighbours cut after the stroke. No Esri hole at the border: Esri skips only tiles whose alpha is 255 everywhere, and border tiles still get a full Esri tile underneath.

## Should fix
1. Hole in Spain after a PNOA failure race. src/map/imagery.ts:149-166, 189-195. On failure `pnoaTiles.delete(key)` runs. An `esri://` request for that tile arriving later calls `pnoaTile` again, the refetch can succeed, Esri returns blank, and the `pnoa://` request had already failed: the tile is empty. The 500-entry FIFO eviction (line 163) can do the same and also double-fetches. Fix: keep a failed key as a rejected promise for ~30 s (negative cache), or have Esri decide from the result `pnoa://` stored for that tile.
2. A 200 response that is not an image makes a hole. imagery.ts:132-136, 179. A `whole` tile is returned unchecked, so if IGN answers 200 with an XML exception, Esri has already returned blank and MapLibre cannot decode PNOA. Fix: in `fetchTile` throw unless `r.headers.get('content-type')` starts with `image/`. [A: IGN's behaviour not probed.]
3. Memory: `coverageCache` (imagery.ts:66-76) keeps an OffscreenCanvas (256x256x4 = 256 KB) per partial tile, up to 2000 entries, which is about 500 MB worst case along a coast at z16-19. Fix: keep an alpha-only `ImageBitmap`/`Uint8Array` mask, or cache masks in an LRU of ~150 and keep only the 3 numbers for the rest.
4. `createImageBitmap` result never closed (imagery.ts:180). Add `photo.close()` after `drawImage`; also wrap in try/catch so a corrupt tile falls to the item-2 path.
5. Preview workflow pushes to the thread's own branch. .github/workflows/map-preview.yml:37-44. After a bot commit the thread's next push is rejected (non-fast-forward), and the rules forbid force-push. A `GITHUB_TOKEN` push also starts no CI on the new sha, so the PR checks sit on the earlier commit. Fix: upload the shots as an artifact (or push to a separate `claude/...-shots` branch), or document "pull before push". Also quote the ref: `git push origin "HEAD:${GITHUB_REF_NAME}"`.

## Nits
- imagery.ts:143-146, 159: `pnoaDown` is module-global and permanent. After a remount, or after an IGN blip of 3 early errors before any success, PNOA is off for the whole session. Reset it when `registerImagery` is called, or retry after a minute.
- createMap.ts:264-265: an Esri skip returns a blank tile and counts as `loaded`, so a broken Esri key no longer trips `imageryFailed` once the view is inside Spain at z10+. Count real Esri fetches only. [A]
- PNOA fetch ignores MapLibre's abort signal (imagery.ts:153, 174): panned-away tiles still download. Acceptable because the fetch is shared; note it.
- Tools/preview/map_shots.mjs:72 overrides the referer to atlaslope.com so the Esri key works from localhost. That is fine for our own key, and the key is public client-side anyway [A], but a comment should say it is for previews only. The workflow builds with `secrets.VITE_ESRI_API_KEY` on any `claude/**` push; only collaborators can push there, and `contents: write` is the only permission. OK.
- data/SOURCES.md:58 ("DO labels, OpenFreeMap font endpoint") looks stale: src no longer references openfreemap fonts outside mapNames. Line 54 says "licence text below", and I did not find a PNOA licence block; add one. IGN's usual credit is "© Instituto Geográfico Nacional de España", so check the exact wording against the CNIG terms before the owner sees it [A]. Glyph ranges 0-255, 256-511 and 8192-8447 draw nothing for Arabic or other non-Latin names near Morocco (mapNames.ts:128-142). That is harmless, but prefer `name:latin` or `name_en` first there.

## Checked and fine
- Quiz name leakage [V]: `addMapNames` and `applyMapNames` take `!quizView?.hideNames`. `syncNames` runs on enter, leave and every `apply`, and before 'load' the initial visibility is passed in. No leak found.
- Imagery-failed fallback [V]: the error listener still keys on `sourceId === 'satellite'`, and PNOA failure is handled separately by `onPnoaDown`, which reloads Esri via `setTiles`.
- Names added after 'load' so a slow OpenFreeMap cannot block the map [V]. Glyph protocol answers unknown stacks and ranges with an empty buffer [V].
- Shared blank/PNOA `ArrayBuffer`s are safe only if MapLibre 4.7.1 does not transfer them in the raster path [A]. Check once in the live check.
- live-map-check still matches the unchanged Esri URL pattern, and the new PNOA and names probes are sound [V].
