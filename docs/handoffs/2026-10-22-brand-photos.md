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

## Build brief (owner asked for it here, 22 Oct 2026)
Mock source copied out of the scratchpad to `mocks/brand-photo-merge/` in the main folder (git-ignored: `index.html`, `build.py`, `prep.py`, `shots/`).
The approved state is version 7 of https://claude.ai/artifact/S7cF1j6x58zExZB7t5RZFg, option B3 [O].

**What to build (one slice, home hero only).**
- Three framed prints over the lower part of the home map hero: rioja-c18, rioja-c06, rioja-c14 from `mocks/brand-photos/picks.json`.
  4:3 crops, champagne mat, soft shadow, 6px corners, no text on the photos.
- The baked-in Rioja guide card on the hero map is hidden while the prints show.
- The map's own credit line names the three print photos in place of the card photos. Keep it one short line: author, licence and "cropped".
- Phone (400 px): check the prints are still readable (they were ~110 px each in the mock [A]). If they are not, show fewer, not smaller.
- Not in this slice: the Rioja guide opening and the Priorat atlas card from the mock. The dark gallery is parked, so "NO dark mode" stays.

**Changes that land before or during the build. Check these first, in this order.**
1. `git fetch -q` and `git merge origin/main` into the new branch. Re-read only what changed in `src/home/`, `src/map/createMap.ts`,
   `data/photos.json` and `src/home/photoCrops.json` (`git diff --stat <base> origin/main -- <paths>`).
2. Open PR #214 (Portugal batch 1: country pages /es/ and /pt/, Guides as a country index) touches `src/home/guideCount.ts`, `home.css`,
   `guides.ts`, `photoCrops.json` and `src/map/createMap.ts` [V]. Those are the same files this slice touches.
   Wait until #214 is merged, then merge main. If it is still open, ask the owner one line: wait, or build on top of `origin/claude/guides-pt-1`.
3. New countries (Portugal now; France and Italy prep merged on main [V]). With them:
   - Is the home hero still Spain's map with the Rioja card? `SHOWN_COUNTRIES` and `BAND_FEATURED` in `guideCount.ts` decide it.
     If home now opens on a country choice or on another place, the three Rioja prints no longer match the map under them. Stop and show the owner a screenshot.
   - The Atlas cover (option E1, on main) is a separate screen: no prints there.
   - Keep the print code place-agnostic: the hero place id picks its prints from data, so Portugal or France can get theirs later without a code change.
     Only Rioja's three are filled now. Other places show no prints rather than borrowed ones.
4. Other open PRs at the time of this brief: #211 (auto-merge rule, docs) and #210 (France WSET names). Neither touches home [A]. Run `gh pr list` again before the first edit.

**Photo route (rules in CLAUDE.md, "Photos hard rule").**
- Add the three photos to `data/photos.json` (author, licence, Commons page, "cropped and resized") and to `public/photos/` at a hero size (about 1200 px wide;
  the current 800 px is too small). Originals are in `mocks/brand-photos/originals/` (main folder) on the owner's Mac.
- Check each crop against its original with `Tools/guides/crop_sheet.mjs` and record it in `src/home/photoCrops.json`. The unit test fails without it.
- Commons is already in `data/SOURCES.md`. Nothing new there unless the build adds a source.

**Checks and route.**
- A new screen element with photo credits, so ReviewBot runs (credit visibility is a licence question).
- `npm test`, the home UI specs only, `npm run build`. Screenshots at 1440 and 400 go to the owner before the PR. Remind him to hard-reload (Cmd+Shift+R).
- PR on a new `claude/home-photo-prints` branch off `origin/main`, not on `claude/brand-photos`. This branch holds the tools and handoffs only.
  Bring `Tools/brand/` and this handoff along by merging `claude/brand-photos` in, or open a small docs PR for it first.

**Estimate [A, from measured numbers in PROJECT.md: ~140K base context per call].** About 25-35 calls in the main session (~4-5M re-read, ~0.3M new)
plus one Sonnet builder (~150K) and ReviewBot (~100K). Pilot nothing: it is one slice.

**Still open for the owner.**
- Priorat c02, c11, c14, c16 and c17 may show DO Montsant vines. This does not block this slice (Rioja only).
- The dark gallery direction is parked. It would reopen "NO dark mode" if it comes back.

**Update from the Portugal session (23 Oct 2026) [R], for the build:**
- First-load download limit is now 2.1 MB (`Tools/check.sh`, PR #234; decision #38). First load was 2,000,515 bytes, so only ~100 KB is left.
  The three hero prints load with home, so they probably count [A]. Size them to fit (WebP, sized to the frame, ~30 KB each), or lazy-load them.
  Check how the check treats `public/photos/` before choosing. Never raise the limit to make it pass.
- Raw downloads live outside the repo in `~/Developer/Atlaslope-raw` (or `$ATLASLOPE_RAW`), merged in #229. Move the Commons originals there from
  `mocks/brand-photos/originals/` and point `Tools/brand/commons_photos.py` at it. Nothing in the repo may be a symlink (CI check).
- PR #234 adds Portugal photos to `src/home/photoCrops.json`: merge main before adding the three Rioja crops.

## Countries check (23 Oct 2026), replaces the #214 wait in the build brief
Checked on origin/main and atlaslope.com [V]:
- #214 (Portugal, country pages, Guides as country index) is merged and live (release 70). Live is release 72. No need to wait any more: just merge main.
- Home today: hero headline + Spain map with the Rioja card (unchanged), then a new "Pick a country." row. It holds Spain (106 guides),
  Portugal (28), France (96) and Italy (87). Each card has a photo mosaic, with one credit line under the row. 317 places in total.
- Country pages: `/es/`, `/pt/` (and the other shown countries) come from `src/home/countryPages.ts`. Adding a country = one entry there, one in
  `src/countries.ts` and its tree, with no page code.
- Germany: pilot merged (#245); it has an entry in `countryPages.ts` [V]. Austria and Greece are planned after Germany (decisions #81-#92).
- Since the brief, main has changed `src/home/guideCount.ts`, `countryPages.ts`, `countries.css`, `guides.ts`, `photoCrops.json` (+203 lines),
  `src/map/createMap.ts` and `Tools/check.sh` (2.1 MB limit). Guides load on demand (#214), so first load is about 2.0 MB.
- Open PR at this check: #249 (merge guards for shared records: union merge, per-country rows). It may change how `photoCrops.json` and
  `data/photos.json` merge. Read it before adding rows.
- Owner (23 Oct): "Make it futureproof for other countries as well because more will be added." A new mock round is running
  (country hero place + prints in data, fallback without prints, country row at 7 countries). The build brief's "only Rioja" scope waits on that pick.
- Futureproof mock (23 Oct): https://claude.ai/artifact/67VkQawSMbhnfh9sAxJfAq, source `mocks/brand-photo-countries/` (main folder, git-ignored). One Sonnet builder, 124K tokens [V].
  Rule: each country names one hero place + three prints in data. Home rotates the hero country per visit (A); each country page has its own hero (B); recommended A+B.
  Prints: Rioja c18/c06/c14, Douro 3/2/1, Chablis 2/3/4, Chianti Classico 3/5/4. No prints = map + card as today. Country row: 4+3 wrap at 1440, scroll row at 400.
  Open before building: the atlas credit for Portugal, France and Italy names only "Esri, Vantor"; add the boundary-data source. The Germany/Austria/Greece "—" cards are builder placeholders (no copy exists).
  Shared records (owner, #249): append lines to PROJECT.md "Current state", handoffs README and spend log; never edit another session's line.

## Parked (owner, 23 Oct 2026) [O]
"Let's park this for later." Open when it resumes: home behaviour A+B (recommended) or B only; boundary-data credit for Portugal, France and Italy maps;
copy for countries without guides. Start from the build brief above and the countries check; merge main first, things will have moved.
