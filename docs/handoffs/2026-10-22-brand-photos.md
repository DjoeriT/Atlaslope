# Brand photo round: golden-hour photos and the dark gallery mock (22 Oct 2026)

Follows `2026-10-22-brand-identity-r1.md` ("After round 4" and "This-or-that test"). Branch `claude/brand-photos`, off `claude/brand-identity-r1`.

## Done
- Hero places = the four featured guides in code (`BAND_FEATURED` in `src/home/guideCount.ts`): Rioja, Priorat, Ribeira Sacra, Getaria [V].
- `Tools/brand/commons_photos.py`: the Commons originals of the 27 photos the site already shows for these places (all `rioja-*`,
  `priorat-*`, `ribeira-sacra-*`, `txakoli-getaria-*` ids in `data/photos.json`), plus 81 new candidates from Commons search
  (free licence, landscape, at least 2400 px wide; golden-hour and autumn words ranked first). Output in git-ignored `mocks/brand-photos/`:
  `candidates.json`, `thumbs/`, `originals/` (211 MB after the new picks). Source is Wikimedia Commons, already in `data/SOURCES.md`.
- `Tools/brand/contact_sheet.py` builds the contact sheet: Artifact https://claude.ai/artifact/NMnpFPFWJNFefK8kan8eDi (click to pick, copy code).
- The owner said "You can make the picks". LeadBot's 28 picks are in `mocks/brand-photos/picks.json` and shown outlined on the sheet:
  - Rioja: c18 (Sierra Cantabria in October, warm low light), alavesa-1, c14, c06, c16, c03, c13, c04.
  - Priorat: c14, 1, c16, c17, c02, c21, c11, weather-1.
  - Ribeira Sacra: amandi-1, 1, 2, c06, c03, c09, c17.
  - Getaria: c14, c16, c01, c17, 3.
  Criteria come from the this-or-that answers: wide land views, warm or moody light, no towns or people.
- Step 2: the dark gallery mock (home, Rioja guide opening, Priorat atlas card) was handed to one Sonnet builder, which writes to
  `mocks/brand-dark-gallery/` (main folder, git-ignored).

## Known gaps
- Real golden hour is rare on Commons. Only Rioja has many warm or autumn shots. Getaria has none: it is green, sea light.
- Priorat c02, c11 and c14 are "Serra del Montsant" photos, and c16 and c17 are "Riu Siurana i planes del Priorat". Their foreground vines may lie in
  DO Montsant, not DOQ Priorat [A]. Check the place before any of them ships on a Priorat page.
- Ribeira Sacra c17 has an odd artist field ("Publicada por/Published by:"). Read its file page before shipping it.
- Nothing from this round is in `data/photos.json` or `public/photos/`. Shipping a pick goes through the normal photo route and crop check.

## Open (owner)
- Does the dark gallery hold, and with it the reopening of "NO dark mode", the white page and Newsreader (see the r1 handoff)?
- Swap any of the picks on the contact sheet.

## Dark gallery mock (step 2)
- Artifact https://claude.ai/artifact/LrCpmUUrEyQ18e5QKCBzX9; source `mocks/brand-dark-gallery/` in the main folder (git-ignored: `build.py`,
  `template.html`, `img/`, `shots/`). One Sonnet builder, 60K tokens [V]. LeadBot looked at the 1440 shot [V]; the 400 shot was checked by the builder only.
- Weak spots: rioja-c18 and the Getaria aerial each appear twice; the Priorat card lines and the featured captions are builder wording,
  not checked against the guides; the map panel is an empty stand-in.

## Owner verdict (22 Oct 2026) [O]
- "The dark gallery holds. Refine it in a fresh session."
- Not yet changed: `CLAUDE.md` Style ("NO dark mode", white page, black band + champagne) and `Review/visual-style.md`. The refine session asks
  the owner once whether to rewrite them now or when the refined direction is approved.

## Next session: refine the dark gallery
- Start from the mock source (`mocks/brand-dark-gallery/build.py`, `template.html`) and the picks (`mocks/brand-photos/picks.json`, contact sheet).
- Fix the known weak spots: no photo twice on a page; more real golden light outside Rioja (new Commons searches if needed: `Tools/brand/commons_photos.py`);
  Priorat and caption copy checked against the guides; check the 400 px view yourself.
- Carry it to more surfaces: logo and favicon on dark, Guides page (square crops rule), Study, share image.
- One Artifact page, one helper build, link to the owner.

## Refine round, done here (owner: "Just here")
- Same Artifact, version 2: eight surfaces (home, featured, Rioja guide, atlas card, logo and favicon, Guides page with square crops, Study, share image).
  One Sonnet builder, 111K tokens [V]. No photo repeats (29 ids, asserted in build.py). Copy lines are guide chapter titles or sentences from
  `content/guides/<id>.json` and `content/facts/rioja.json`; "DOCa since 1991" and "Three zones" were dropped (no guide sentence found).
- The builder's write to `mocks/brand-dark-gallery/` in the main folder was refused, so the source sits in the session scratchpad only
  (`.../scratchpad/bdg/`: build.py, template.html, img/, shots/), not copied into the main folder. Scratchpad is temporary: copy it to `mocks/` on the owner's word.
- LeadBot looked at the 1440 and 400 shots [V]. Weak spots [A]: empty space in the atlas card and favicon panels; the Rioja Guides card shows hills, not vines.
- Open: rewrite "NO dark mode" and the white page in CLAUDE.md and visual-style.md now, or when the direction is final.

## Photo approach in today's style (owner: "merge the picture approach of this mode into the current style")
- Before/after mock: Artifact https://claude.ai/artifact/S7cF1j6x58zExZB7t5RZFg (source in the session scratchpad `merge/`). One Sonnet builder, 68K tokens [V].
- After keeps band, champagne, fonts, headline, nav; photos become framed print mosaics on home, Rioja guide opening and Priorat atlas card. 12 photos, none repeated.
- Open choice for the owner: home trades the live map hero for photos (visual-style.md says "product, not stock photo"). Alternative: keep the map hero and use the mosaic below it.
- Shipping needs: picks into `data/photos.json` and `public/photos/` (larger sizes than 800 px), crop checks, and Priorat photos' place checked (Montsant vs Priorat).
- Version 2 (owner: "keep the map and add the photos as well"): home keeps the live map hero, the five-print mosaic sits under it on pure white,
  one credit line. Rioja guide and Priorat card unchanged. The builder's invented heading over the mosaic was removed by LeadBot. Builder 75K more tokens [V].
- Version 3 (owner: "the mosaic in the bottom half of the map"): home hero options. A splits the map column (map top 55%, 3 prints below on white);
  B lays 3 prints in a white frame over the map's lower half, replacing the Rioja card. Builder 94K more tokens [V]. Weak spots [V]: the prints are tall crops
  of wide landscapes, and A's screenshot-crop map loses the Rioja outline (a real build would recentre the map).
- Version 4, owner picked B (22 Oct 2026) [O]: "B, however can we make the photos slightly less high". Three 4:3 prints (rioja-c18, priorat-c14,
  priorat-1) in a white frame over the map's lower part, credit line inside the frame; option A removed. Builder total for this mock thread ~98K [V].
- Build notes for the slice: the map's own credit still names the Rioja card photos, which B hides; update that credit. The phone prints are small (~110 px each) [A].
- Version 5 (owner: "Any idea how to blend them better? The colours curse"): B1 champagne mats + shadow straight on the map, dark credit strip;
  B2 near-black see-through band; B3 (recommended) B1 framing with three Rioja photos (rioja-c18, c06, c14) on the Rioja map.
  Map is a real live screenshot with the Rioja card hidden by CSS (a builder's fake terrain patch was caught and removed: no fake geography).
  Builder total for this mock thread ~118K [V].
- Version 6, owner picked B3 (22 Oct 2026) [O]: "B3 indeed, but then without the rights reference. We should fix that in a creative way."
  The separate credit strip is gone; the three photo credits replace the "Card photos" part of the map's own credit line at the map's foot
  (the card is hidden, so its credits had to go anyway). One visible line still credits every photo (licence rule kept). On desktop the line wraps to two lines.
  Builder total for this mock thread ~125K [V].
- Version 7 (owner: "Remove the credit line, or make it way smaller"): not removed (CC BY-SA and the standing photo-credit rule need it visible);
  made one short line at 8px: "Esri, Vantor · PNOA © IGN · Photos: Colsandsol, Mentxuwiki CC BY-SA 4.0, Bea.miau CC0, cropped". Edited by LeadBot directly.
