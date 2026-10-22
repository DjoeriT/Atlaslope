# ReviewBot: PR #202 Atlas cover (design, copy, licence)

Verdict: OK with a change (licence: add the credit next to the clips; nothing needs the owner). Blocker 0, major 1, minor 4.

## Major
1. Imagery credit sits only in one line at the bottom of the panels (.atlas-imagery, .66rem, after the last panel), not "on or near" each image. Esri's static-maps terms ask for attribution on or near the image [R, SOURCES.md]. The line is read once the user scrolls past the 4 map panels; on the phone the first clip is far above it. Fix: keep the line, but put it directly under the Map tour row (the first map image), or show the same short line under each map panel. Also raise it to .72rem (10.5px is below the app's other credit lines? they match .66rem in the mock, so size is consistent; position is the issue).

## Licence verdict [A, not a legal opinion]
- Esri FAQ: "include screen captures"; Static maps: images on a company website to promote your own products, with attribution [R, read in SOURCES.md, not refetched]. A 5-6 s muted loop of the app's own map is a screen capture of the product on its own site, not tile harvesting or self-hosting [A]. Same reading as the stills already accepted. The Esri terms page that would settle "video" was never read (403) [R]; the keyless capture route is an owner decision of 20 Oct [R]. Risk is low, same as before. OK with the credit change above. Ask the owner only if he wants the point settled with Esri; no new decision is needed.
- Credit wording matches the owner's 20 Oct ruling (Esri, Vantor) [R]. PNOA CC BY 4.0 credit "PNOA © IGN" present [V, in strings].
- SOURCES row complete (what, date, script, credit, size). Minor: it says "ReviewBot to judge"; replace with this verdict when merged.

## Photos / credit lines [V, shots + code]
- Hero photo: "Photos: Nicondarreta · CC BY-SA 4.0 · cropped and resized" visible under it. Country tile: one line "Photos: Angela Llop · CC BY-SA 2.0 ..." visible. Good.
- Minor: the `atlas-guide` still shows the Rioja guide page including a vineyard photo (autumn vines). That photo has no credit line of its own on the card. Either crop it out, or add its credit to the imagery line (the "one line per set" rule). Check which photo and its licence.
- Minor: the same still contains small readable text ("Plego: pp. 15, 19", page chrome); it is a picture of the product and reads as clutter at 360px; consider cropping tighter.

## Design vs E1 mock [V shots, mock read by grep only]
- Structure matches: hero + credit, title, lede, lead clip, Map tour button + "Live in 15 places", three panels, Countries tile, totals. Tour button is primary, min-height 2.75rem (44px) [V css]. Country button has the same class. Focus rings come from the global .btn/a rules, not changed here [A]; not tested.
- Type: serif 1.6/1.25rem titles, .9rem lines in ink3 #6F6860 on white (about 5.3:1, passes AA) [A]. "Live in 15 places" .78rem ink3 passes AA but is small. Credit lines .66rem are small but the app-wide standard.
- Minor: in the desktop-bottom shot the country name renders as "SPAIN" in capitals, while the mock shows "Spain" (mixed case) and the CSS sets text-transform:none. Probably a more specific `.card h3` rule wins; check in the browser and fix with a higher-specificity selector.
- Minor: the Map tour row uses a negative top margin (-.5rem) and the imagery line -.6rem: fragile if the clip's caption wraps to more lines; check at large text size (not tested; the shots are default size).
- No pills, 6px corners on the tile (var(--rad)); panels use .3rem (4.8px): minor mismatch with the 6px rule, set to var(--rad).
- Reduced motion: clips stay on the poster [R, code comment, read]. Video has no controls and an aria-label (alt); panels are informative text, OK.

## Copy (src/strings.ts) [V read]
- "AtlaSlope" correct; no "Quiz", no "Terroir guide"; no "X, Y and Z" lists in the atlas block. Titles one idea per line.
- Claims are modest and true: "Spain's wine places on a real map", "Every place has a short guide" (true per tour/guide counts, but check that all 106 places have a guide: if not, "Every place" is a claim to soften, e.g. "Places have a short guide") [A].
- "Each place is drawn where the law puts it" is slightly bold; the data is official DO borders, so true where official, but "where the official border puts it" is plainer. Should-fix wording is the owner's call; not changed.
- "Live in 15 places" is vague (live what?). Suggest asking owner: "Tours in 15 places".
- totals line "106 wine places · 10 regions · 15 map tours" uses dots, not a list sentence; fine.
- Not checked: Dutch/other strings, the tour-title copy beyond atlas block.

## Not checked
Focus ring in browser, large text, iPad width, the phone-bottom shot, E1 mock beyond grep.
