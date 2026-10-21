# Design check: Option B (21 Oct 2026)

Against `Review/visual-style.md` and CLAUDE.md (Style, Photos hard rule, Mock language). Checked with Playwright on file://, 390 and 1440 px.

## Findings and fixes
- B's list had "One chapter at a time, a big pitched map, the photo in every stop card" (an "X, Y and Z" list). Split into three lines.
- "The guide stays readable, and its map stops jumping" joined two ideas. Split into two lines.
- Bullet list and Upside/Risk/Effort did not mention the new top-of-guide entry. Updated.
- Open list still asked "B or D". Marked decided (B), D left as open only if reopened.
- New entry photo alt first read "Sierra de Cantabria"; the photo is a stone vineyard hut. Alt text corrected.
- Desktop top frame was a full 900 px page, mostly empty. Cropped to the top 580 px; button enlarged to read as the main thing.

## Passed, no change
- Black band, champagne text, white page, 6px corners on the button, photo and frames; no dark mode.
- Tags use .3rem corners, the shape visual-style.md allows; no pills.
- New photo has its credit as text under it ("Photo: Nicolás Pérez Gimilio · CC BY-SA 4.0 · cropped and resized"), none on the photo.
- Button champagne on black (about 12:1); credit ink 3 on white (above 4.5:1).
- Phone: button is directly under the title, well above the fold (about 170 of 844 px in the frame scale).
- No sideways scroll: scrollWidth equals viewport at 390 and 1440.
- "AtlaSlope" in the visible brand; no drawn icons or fake geography added.

## Not fixed
- Stop count: "9 stops" is not stated anywhere in the file, and no duration is known. The line says "4 chapters", which the tour frames state. Owner can supply the real stop count.
- The map frames carry a dark attribution strip on the map image (.credit). It is map attribution, not a photo credit, so I left it.
- The photo is a stone vineyard hut, not the Sierra de Cantabria itself; the real crop still needs the crop sheet check.
