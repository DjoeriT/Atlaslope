# ReviewBot: PR 97 (place-card commas)
Verdict: merge after fixes. Blocking 0, small 4, taste 3. `npx vitest run`: 276 passed. `npx tsc --noEmit`: clean (ran).

## Facts (read, all 78 why.text pairs compared)
No added fact found; changes are splits, reorders, dropped details. No "X, Y and Z" runs or comma splices remain in the new texts (regex pass plus read).
Small:
1. content/facts/*.json (Txakoli entry "Vineyards lie mostly by the sea... Neutral soils give a txakoli with high acidity"): old text gave the acidity to climate, rain and soil together; new text attributes it to neutral soils only. Fix: "...1,600 mm of rain. Together with neutral soils, they give a txakoli with high acidity."
2. Named subjects added (not claims, but check the entry is the right one): "Bierzo" (castilla-y-leon.json:7), "Almansa" (meseta.json:669), "Rioja Alta" (rioja.json:115, id rioja-alta confirmed), "The island" (canarias.json:783, id la-gomera confirmed). Bierzo and Almansa ids not checked; confirm by eye.
Taste:
3. Sierras entry: "Ripening is very sunny but moderate" reads oddly; "The sun ripens grapes strongly but moderately"? Wording is the owner's, so just flag.
4. Dropped details (not meaning): swings (Tinta del País), lavender, 2,800 sun hours, spring frost (Monastrell, Toro), Madrid/Extremadura from the Meseta short name (kept as `chapter`).

## Code
Small:
5. src/facts/format.ts:50-51: the sourceRefs doc comment ("One reference per source...") now sits above the pageText comment, so it documents pageText. Fix: move it down to just above `export function sourceRefs`.
6. src/cards/PlaceFacts.tsx:21-22: the full source line now reads title, year, pages (was title, pages, year). Not mentioned in the handoff; confirm intended. Short form unchanged.
7. src/styles/app.css (~line 85): `.crumb .step{white-space:nowrap}` means one very long step name cannot wrap and may overflow at phone width. Fix: `white-space:nowrap` only on the sep+link pair is what you have; add `min-width:0;max-width:100%` or allow wrapping inside the link (`.crumb a{white-space:normal}`).
Verified OK:
- pageText: 1 page, runs, duplicates, non-numeric fallback all behave; empty returns ''. Edge: "" or " " page would count as 0 (Number("")=0); sources never have those.
- tree.ts chapter: validated, optional, spread only when set; search matches both name and chapter, so "Castilla-La Mancha" still finds Meseta. Test added.
- PlacePage.tsx / CardShell.tsx: `›` is aria-hidden in its own span, no stray text node; SWS badge title uses chapter. Both crumbs identical.
- CSS tap target: height 2.75rem kept; min-width 2.75rem dropped, so very short links are narrower than 44 px but above the WCAG 2.2 AA 24 px minimum (2.5.8). Note, not a failure.
- Img.tsx title: alt no longer leaks the Commons file name; decorative images stay silent. Credit.tsx middle dots in both spots consistent.
Not checked: UI specs (CI), screenshots, tile/lede wording changes in content/tiles.json beyond a read (title edits are restructures only).
