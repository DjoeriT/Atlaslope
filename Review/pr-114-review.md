# ReviewBot design + copy run, PR #114 (guides landing, About, home hero)
Verdict: ready after P2 fixes. 0 P1, 3 P2, 3 P3. Method: read diff + built screenshots (390px); did not run the app or CI.

## P1
None. About WebPs carry no EXIF/XMP/GPS (PIL: no exif, no metadata chunks; raw grep for EXIF/XMP/GPS = 0 in all 5). SOURCES.md has rows for public/about and public/guides.

## P2
1. index.html (hero figcaption): the credit now reads "Imagery: Esri, Maxar · PNOA © IGN", dropping "Spain:". The mandated string is «Imagery: Esri, Maxar · Spain: PNOA © IGN» (used on About and the guide tiles). Fix: restore "Spain: " (a few characters, still one line).
2. src/home/home.css `.hero .map figcaption`: white .92 on rgba(0,0,0,.38) over bright satellite can fall below 4.5:1 (about 2:1 on light fields), at 0.65rem. The owner asked for quieter, so keep the size, but raise the scrim to about .55 (the old value) or add a text-shadow, and note the exception in visual-style.md. Tests only check tokens (contrast.test.ts), not this overlay.
3. src/home/guideCount.ts:130 satellite tile `alt="Satellite view of {region}"` is fine, but the tile is a full-width figure with no caption in the markup; the credit is a separate `<p class="credit">` (SAT_CREDIT) at the end of the section, after the photo credit. A reader may not tie it to the tile. Fix: render SAT_CREDIT as the `<figcaption>` of `.sat`.

## P3 (taste)
- Guides at 390px is one column about 19,000px tall (build-390.png). Consider 2-up cards or a "jump to region" row; do not drop sections.
- guides.css: `.gl .facts dt` uses an uppercase kicker label ("In short" rows); visual-style allows kickers only where they carry a fact. These do carry facts, so probably fine.
- about/index.html:38-43 `t-bottles` height="575" vs real 576 (harmless; CLS-neutral).

## Checked, fine
- About: owner words untouched, h1 is visually hidden "About AtlaSlope" then h2 "Where the facts come from" (order OK); alt text on all 5 photos; no photo credit needed (owner's own); "Imagery" line present though no satellite shows (harmless). Independence line is accurate; no WSET/WSG text used.
- Copy: no "Quiz", no "Terroir guide" (only the legacy `#quiz` redirect in index.html:11, code not copy); "Free / to use, no account" and the Spain tag as asked; positioning is not exam-centric (WSET only in the independence note and the owner's credentials line).
- Style: 6px corners (`--r-img`, mosaic 6px), no pills (Spain tag .3rem), no dark mode, no drawn art (tiles are map screenshots; precedent public/home).
- Photo credits: guideCount.ts:82-95,122,133 one always-visible "Photos: Name; licence; resized" line per set, from data/photos.json; tile credit via SAT_CREDIT.
- Build-time generation: guideCount.ts:8,50-59 reads content/guides/*.json; region tile is null when no webp exists, and then no tile and no credit render. tests/unit/home.test.ts:34-93 cover list, new guide with no extra step (:52), typographic card and no-tile region (:73), tile credit (:85), photo credits (:93), missing markers (:101).
- Phone: About 390px layout is clean (single column, mosaic first). Home `.nums` goes to 2x2 below 900px.

Verdict: ready after P2 fixes (credit string, scrim contrast, tile credit as figcaption).
