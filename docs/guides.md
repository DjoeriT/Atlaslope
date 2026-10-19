# Guides: what a guide is and what it holds

The one place that says what a guide is. Owner decisions 19 Oct 2026 (Green Spain pilot thread), on top of release 10 (Terroir) and the
18 Oct page decisions. Words follow `docs/glossary.md`. Look rules live in `Review/visual-style.md` ("Place page: guide shape C"). The field list lives in
`src/facts/guides.ts`.

**Rule (owner, 19 Oct 2026):** any change to the guide format (a section, its order, a field, a source rule, a check) updates this file
in the same PR. When this file and the code disagree, fix whichever is wrong.

## What a guide is
- **A guide is a place's whole page.** Every place has one. **Terroir** is the written section of a guide, never "the Terroir guide".
- **A guide is a reference for anyone who loves wine.** It is meant to be fun to browse, not exam prep. Exam framing ("remember",
  "for the exam") belongs to Study. A guide links into Study only through a small "Test me" at the end.
- **"Why X tastes the way it does"** is the spine of the page: the place, its weather and its ground explain what the rules make and
  how the wine tastes.

## The page, top to bottom (shape C)
Status: chosen by the owner 19 Oct 2026 (mock `https://claude.ai/artifact/P2utJJTSBoYS81CHyC1mR5`, option C). It is being built in its
own slice, and until it ships the live page keeps the release 10 order (Overview, Terroir, then the fact sections).

1. **Title and labels.** Name, the legal level badge, "Wine Scholar · region", "WSET Level N" where WSET's spec names the place, and a
   "Say it" button with the pronunciation (`say`, only from a reliable source).
2. **Photos.** A hero and two beside it, with one credit line under the set.
3. **At a glance.** Level, main grapes, wine types, altitude, zones, Fly to.
4. **Why X tastes the way it does.** A two-sentence lede, then four beats, always in this order. Each beat holds its prose and its facts
   together, so every fact appears once:
   - **The place** (`beat: "place"`): where it lies, the shape of the land, zones, where it sits.
   - **The weather** (`"weather"`): the climate line and the measured Köppen chart next to Spain.
   - **The ground** (`"ground"`): soils and the altitude range next to Spain.
   - **What the rules make** (`"rules"`): main grapes, also allowed, wine types, famous styles.
   A beat the source says nothing about is left out, not filled. Beat titles are our own words per place ("A valley with walls").
5. **How it tastes.** One card per wine colour. It answers the question in the heading.
6. **In short.** Five key facts, each one line with its source tag, built from the fact sheet.
7. **Read the label** (`label`). What the words on a bottle mean here (Crianza, Barrica, Berezia, Tostado). Only what the pliego
   defines, and each term is one sentence with its rule.
8. **Producers.** Up to three, from a Wikipedia article on the place.
9. **More to explore** (`more`): History, Places to visit (with When to go: harvest and festivals), Food to try, Did you know (one
   surprising sourced fact). Shown only when filled. Content waits for the owner's go on outside sources (issue #103).
10. **If you like X, try.** Two or three places with the same grape or a similar climate, computed from data, with no hand-written text.
11. **Test me** (a small door into Study) and **Sources** (each document once, in full).

Later, and only on the owner's go: option D's cause-to-taste chain on top of C (issue #106), if the chains hold up against the
pliegos for the thin places.

## Two formats: with Terroir, and fact sheet only
A guide comes in one of two formats (owner, 19 Oct 2026, "Missing fact sheets" thread: a separate format, logged here). Both use the
shape C order above. Code: `src/pages/PlacePage.tsx` (PR #107).

**With Terroir** (a written `content/guides/<id>.json`): everything above. The lede and chapters tell the beats, the reading time shows
under the title, and a fact sheet line shows in a beat only when no chapter tells that beat (one fact, once).

**Fact sheet only** (no Terroir written yet, or a place outside Study). The same four beats, built from the fact sheet alone:
| Part | Shows | Comes from |
|---|---|---|
| Title, labels | always; no reading time | `data/places.json`, `content/curriculum.json` |
| The place | level, zones, where it sits | places, zone list |
| The weather | the sheet's climate line; the Köppen chart only for Study places | `climate`, measures |
| The ground | soil line, written altitude; the measured altitude range only for Study places | `soil`, `altitude`, measures |
| What the rules make | main grapes, also allowed, wine types, famous styles | `grapes`, `styles`, `famous` |
| How it tastes | when the sheet has `tastes` | `tastes` |
| In short | only with 3 or more lines; fewer lines when climate, soil or altitude are missing | sheet fields, measures |
| Producers, extras | only when filled | sheet, `label` / `more` |
| Sources | always | cites |

What a place outside Study (`quiz: "none"`: the Vinos de Pago, Cava, Catalunya, Islas Canarias) never shows: photos, measured charts
(climate share, altitude range), "Test me", "If you like this, try". Its sheet holds written rows only (`src/facts/check.ts`). No beat is
filled with text to make the page look complete: a short page is the honest page.

## Format log
Each change to the guide format, newest first. Add a row in the same PR as the change (rule in `CLAUDE.md`).
| Date | Change | Where |
|---|---|---|
| 19 Oct 2026 | Fact-sheet-only format recorded as its own format | this file, "Two formats" |
| 19 Oct 2026 | Shape C: four beats as the page, How it tastes, In short, extras; Terroir chapters get `beat`; `label`, `say`, `more`; named-place flights warned on | PR #107, Green Spain pilot PR |
| 19 Oct 2026 | Pliego required for Terroir; guides are a reference, not exam-centric; the guide is the whole page | owner cards, Green Spain pilot thread |
| 18 Oct 2026 | Short source tags with one Sources list; measured charts always next to Spain; course labels under the title | `Review/visual-style.md` |
| 17 Oct 2026 | Terroir is a section of the place page, not its own page (release 10) | PR #45 |

## Flights (fly-to)
- Each beat may carry 1 or 2 flights (`fly`): a place id from `data/places.json`, or a point with a zoom. Each flight has a one-line
  caption with its own cite. Zone cards keep their own "Fly to".
- **Fly to named places worth seeing from above** where the source names them: a canyon, a coast, a river mouth, a valley, a historic
  town tied to the wine. A municipality that is merely listed doesn't count. Where the source names nothing worth flying to, no flight
  is demanded (owner, 19 Oct 2026).
- Check: `guideFlyWarnings()` in `src/facts/check.ts` warns for a guide whose flights only go to the place itself. It warns rather than
  fails, because some sources name nothing (Rioja Oriental names only Alfaro).

## Sources
1. **Pliego** (full rulebook, current version with amendments). **Required for Terroir** (owner card, 19 Oct 2026). A place without a
   current pliego gets no Terroir until one is found. Fetched texts live in `Review/sources/fetched/`, listed in `data/SOURCES.md`.
2. **EU single document.** Fine for the fact sheet, too thin on its own for Terroir.
3. **Wikipedia.** Only main grapes (when the official text is silent) and producers.
4. **Measured.** Altitude and Köppen share inside the boundary, always shown next to Spain's figure.
5. **Outside sources for More to explore** (tourism bodies, Consejo Regulador sites, books): not yet allowed (issue #103).

Course structure from Wine Scholar and WSET decides which places are covered, never what we say about them. Every sentence cites
`<source>:p<page>`, and the check fails a cite to an unknown source.

## Terroir: how it gets written and checked
- Content in `content/guides/<place id>.json` (folder name kept from release 10). Fields: see `src/facts/guides.ts`.
- Copy rules: plain English, one idea per sentence, no "X, Y and Z" lists, no comma splices, no hype words the source doesn't use,
  numbers as written. As long as the source allows and no longer, about 4 minutes at most (words / 200).
- A Sonnet builder drafts one place at a time from the pliego text. An Opus check then reads every sentence, caption, flag line and label
  term against its cited page and logs KEEP, FIX or CUT. Logs live in `Review/guides-check/`.
- The check also looks for lines that talk about the source instead of the place, label terms that only point elsewhere, exam framing,
  named-place flights where they are possible, and agreement between the Terroir text and the fact sheet.

## The rest of the guide
- **Fact sheet** (`content/facts/<region>.json`): the why line, grapes, styles, climate, soil, altitude, tastes, famous styles and
  producers, each with a cite. It feeds the beats' facts, At a glance, In short, the map card and Study. The schema is in
  `src/facts/types.ts`, the check in `src/facts/check.ts`.
- **Photos** (`data/photos.json`): real photos of that place, checked against where they were taken, 3 per place (5 where good ones
  exist). Wikimedia Commons under CC BY, CC BY-SA or public domain. One always-visible credit line. English alt text that says what is
  in the picture.
- **Map flags** (`content/flags.json`): 3 to 5 key places per region, only places the pliego or EU document names, with two short lines,
  the source tag and Fly to. Shown while that place is selected. Positions are OpenStreetMap points.
- **Study** writes its questions from the fact sheets and the map. Terroir text is not quizzed.

## State (keep current)
- Terroir written: Rioja and its three zones (release 10). Nine Green Spain places are in the pilot PR.
- Shape C: being built in its own slice.
- More to explore: slots only, content waits on #103. The D chain waits on #106.
