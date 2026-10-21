# Study plan: first principles (#147)

AnalystBot (Opus), 21 Oct 2026. Read-only report; saved by LeadBot (the helper could not write files). About 110K tokens, nearly all new.
Tags: [V] the helper ran or read it, [R] from a document, [A] assumed. LeadBot re-checked: Cava and Catalunya are `quiz: "none"` in data/places.json [V].

## Summary
1. Study today asks only where a place is and one thin fact (grape, style or Köppen class). It never uses the guides. [V]
2. The guides already hold the "why" that WSET Level 3 and Wine Scholar test: the four beats exist for ~106 of 109 places, each cited. [V]
3. Three separate course tracks would mean three setups of one engine. A course works better as a lens that picks the place set and the depth. [A]
4. Recommendation, option D: one course setting (WSET 2, WSET 3, Wine Scholar, or no course); one engine; a third memory per place, "why",
   with cards written from the guide's own cited sentences.
5. Pilot: the WSET Level 2 setting (8 places), with why cards for those 8; the owner and two friends test it for two weeks.

## 1. Who uses Study, and for what
- Scope: "the wine study atlas for WSET and Wine Scholar students"; exam students first since 17 Oct. [R, docs/scope.md "Job"]
- Guides stay a general, fun reference; only a small "Test me" link leads into Study. [R]
- So the guide is the wine lover's door and Study the student's door. Course framing belongs in Study, not in the guides. [A]
- The student's job: for each place my course names, know where it is, what it makes and why; before the exam, then keep it. [A]
- The wine lover's job: check what I took in from a guide. A "Test me" round on one guide fits. [A]

Works today [V, src/quiz]:
- One engine over sets of places; one memory per place shared by Study and Review (`plan.ts`, `round.ts`).
- Two memories per place: where (map) and what (fact).
- Known needs two rights a day apart; boxes 1, 3, 7, 14, 30 days (`memory.ts`).
- Course order follows the Wine Scholar regions; focus and "practise any mix" exist.
- Every answer is logged (`store.ts`).
- Wrong choices are fair: each is true of another place and false of this one.

Weak [V unless tagged]:
- The fact question has three kinds only: main grape, a famous style name, or the largest Köppen class. Never soil, altitude or a reason.
  No course asks the Köppen class. [A]
- The answer reveal shows only the main grape (`revealFact`); the guide's why line never appears in a round.
- No course setting: `content/curriculum.json` lists 8 WSET 2 and 19 WSET 3 places, and only drives a badge (`PlacePage.tsx:383`).
- Gap: Cava and Catalunya are `quiz: "none"`, yet both are named at WSET Level 2 and 3.
- Study asks 73 places (70 core plus 3 zones); Review also asks 6 VC; the 27 Vinos de Pago and Islas Canarias are never asked.
- Country-level knowledge has no home (the engine only knows places): the legal ladder, the ageing terms, how Sherry and Cava are made.
- Goal 1 (40 of 68 places known after three weeks) cannot be read: the answer log stays in each browser. [A]

## 2. What each course expects about Spain
Course structure only, paraphrased:
- WSET Level 2 spec, issue 2.1, Apr 2026: https://www.wsetglobal.com/media/19132/wset_l2wines_specification_en_april2026_issue21.pdf [V]
- WSET Level 3 spec, issue 2, May 2022: https://www.wsetglobal.com/media/11731/wset_l3wines_specification_en_highres_may2022_issue2.pdf [V]
- Wine Scholar Guild, Spanish Wine Scholar: https://www.winescholarguild.com/spanish-wine-scholar [V]

WSET Level 2 (by grape) [V]: Garnacha (Rioja, Navarra, Priorat); Tempranillo (Rioja, Ribera del Duero, Catalunya); Rías Baixas.
The legal ladder and ageing terms (Joven to Gran Reserva). Cava under sparkling; Sherry under fortified. Depth: place to grape to style
to label term, no causes. Exam: 50 multiple-choice questions in 60 minutes.

WSET Level 3 (by region) [V]: six areas (Upper Ebro, Catalunya, Duero Valley, North West, Levante, Castilla-La Mancha); 19 appellations,
the same list as `curriculum.json`. Per area: grapes, natural factors (climate, soil), growing and winemaking choices, labelling.
Depth: why the wine tastes as it does. Exam: 50 multiple-choice, four short written answers, blind tasting. Why cards pay off most in
the written part. A Castilla y León line follows the six areas; not checked whether it means a Vino de la Tierra. [A]

Spanish Wine Scholar [V]: every appellation in regional clusters (Atlaslope's ten study regions follow it [R]). Depth: geography,
climate, soils, grapes (native in focus), styles, viticulture and winemaking, history and food, laws. Exam: multiple choice, pass 75/100,
no tasting; about 100 study hours.

Mapped to what Atlaslope has [V, counted from content/]:

| Need | Have | Missing |
|---|---|---|
| Name and where | 109 on the map, 73 asked | Cava and Catalunya not asked |
| Main grapes | `grapes.main` on 109 sheets | — |
| Styles | `styles`, `famous` on 109 | style type (sparkling, fortified) not asked |
| Climate and soil | on 109 sheets | not asked; Köppen asked instead |
| Altitude | 30 sheets | 79 without |
| Why it tastes so | guide beats: place 106, weather 106, ground 105, rules 106 | not asked |
| Label terms | "Read the label" extra | not asked; Spain-wide ageing rules have no home |
| History and food | guide extras | not asked (Wine Scholar only) |
| Legal ladder, Sherry and Cava making | partly in the Jerez and Cava guides [A] | no country-level cards |

Level 2 is covered by data we have, apart from Cava, Catalunya and label terms. Level 3 and Wine Scholar need the why, which sits in the guides.

## 3. Options
Basis: docs/PROJECT.md "Cost lessons" (a full guide 0.4-0.6M a place on the local route); CLAUDE.md small slice under 0.3M. All [A] until a pilot measures.

- **A. Course filter (small).** A "My course" setting sets the Study place list; `curriculum.json` plus a Wine Scholar entry (all core
  places); Cava and Catalunya in with "what is this" and fact questions only. No new facts. Low risk; questions stay thin for WSET 3
  and Wine Scholar. ~0.3-0.5M (≈0.25M re-read, 0.1M new).
- **B. Separate tracks (big).** Three tracks with own lists, pace, progress and depth. Breaks "one memory per place" [R]; triples the
  screens; reads exam-centric. ~4-6M over 3-4 sessions, mostly re-read. Not recommended.
- **C. Why cards from guide sentences (content-heavy).** 3-6 cause-to-taste questions per place; after each answer the guide paragraph
  and its cite. `content/study/<id>.json`: question, right answer, three wrong answers true of other places, guide cite. Only guide
  sentences (which cite official rules); a check script fails any card whose cite is not in that chapter; no course text. Risk: wrong
  answers can be half true in wine (same fairness rule as today). ~0.15-0.3M a place; all 106: ~16-32M, over the 20M line.
- **D. One engine, a course setting and a why memory (recommended).** The setting picks depth: WSET 2 asks where and what (grape,
  style type, label term); WSET 3 and Wine Scholar add why. A third memory `why` unlocks once `what` is known and counts toward shading
  only under a setting that asks it. The reveal shows the guide's one-line why. "Test me" on a guide runs a short round on that place.
  ~10-15 Spain-wide cards held as place id `spain` (legal ladder, ageing terms, Cava and Sherry making), sourced from Spanish wine law
  and the official rules (source to confirm in data/SOURCES.md [A]). Risks: a new memory changes log replay (version bump in
  `store.ts`) and shading; needs a mock round. Engine and setting ~1.5-2.5M (~80% re-read); cards 0.15-0.3M a place: 8 places ≈1.5-2.5M,
  19 ≈3-6M, all ≈16-32M.

## 4. Recommendation and pilot
D in two steps; skip B.
- Step 1 (small slice, ~0.5M): the course setting; Cava and Catalunya into Study; the why line in the answer reveal.
- Step 2 (big slice, mock first): the why memory, plus cards for the 8 WSET 2 places (Rioja, Navarra, Priorat, Ribera del Duero,
  Catalunya, Rías Baixas, Cava, Jerez). Pilot the card writing on Rioja and Jerez (~0.5M), then the other 6. All 8 have guides and are
  also in WSET 3 and Wine Scholar.

How to tell it works (owner plus two friends, two weeks, each exports the progress file):
- all three memories of the chosen places reach "known";
- why-card miss rate 20-50% [A];
- at least one "Test me" round per person per week;
- zero cards whose cite is missing from the guide;
- the owner spot-checks 10 cards against the official rules;
- ask each tester: "Did a why card teach you something the guide alone did not?"

## 5. Open questions for the owner (recommended first)
1. Tracks or one engine with a course setting? (a) one course setting; (b) separate tracks.
2. Pilot course? (a) WSET 2, 8 places; (b) WSET 3, 19 places; (c) Wine Scholar in course order.
3. Cava and Catalunya in Study? (a) yes, without the map question; (b) keep them out.
4. Who writes the why cards? (a) a headless run per place, a script checks every cite, you spot-check 10; (b) you approve each card.
5. Spain-wide cards? (a) a small "Spain" set after the pilot; (b) leave it to the guides.
6. Default for a new visitor? (a) no course, all places as today; (b) ask on the first visit.
7. Shared numbers? (a) the log stays on each device, testers export their file; (b) anonymous counts (needs the #151 backend and a privacy decision).
