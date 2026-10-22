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
