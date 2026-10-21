# Glossary

One meaning per word, used the same way in code, docs, cards and the site. Added 18 Oct 2026 after threads kept mixing up Quiz and
Study, and guide and Terroir (docs gap audit, 18 Oct 2026). A new term goes here before it goes into the site.

## What users see
| Word | Means | Not |
|------|-------|-----|
| **AtlaSlope** | The product name users see. Code, URLs and the repo use `atlaslope`. | Paraje (old name, until 16 Oct 2026) |
| **Atlas** | The map screen (`/atlas/`): explore every place on the map. | |
| **Map tour(s)** | The scroll-along map view of a guide: the page scrolls and the map flies to each place it names. Button "Map tour" on a guide; page and top-bar item "Map tours" (`/map-tours/`). Owner, 21 Oct 2026. Code keeps `story`. | fly-over, Read with the map |
| **Study** | Rounds of questions with spaced memory (find it on the map, what is this, the fact question). Owner, 18 Oct 2026: "Quiz" is "Study" everywhere users look. | Quiz (still the code name: `src/quiz/`, `src/quiz-ui/`; don't rename code just for this) |
| **Round** | One Study session, from "Start" to the results. | |
| **Shade** | How well a place is known in spaced memory: new, learning, known, solid (`SHADES`, `src/quiz/memory.ts`). Older docs call these boxes. Harder questions come with higher shades. | Level, streak |
| **Guide** | A place's own page, in shape C (owner, 19 Oct 2026): "Why X tastes the way it does" told in four beats, then How it tastes, In short and plain sections (Producers, Read the label, Did you know, History, Places to visit, Food to try there, If you like this, try). Every place has one. A reference for anyone who loves wine, not exam prep. Full spec: `docs/guides.md`. Shape and fields: `Review/visual-style.md` "Place page" and `src/facts/guides.ts`. | Lesson, article |
| **Beat** | One of the four steps of a guide: the place, the weather, the ground, what the rules make. A Terroir chapter names its beat; a beat without one shows the fact sheet alone. | Chapter (the written text inside a beat) |
| **In short** | The box of five key facts after How it tastes, each linked to its beat. | At a glance (retired 19 Oct 2026) |
| **Terroir** | The written section of a guide, its chapters told in the four beats, as long as the source allows (Rioja: 322 words). Progress is counted as "Terroir written, N of 79". | Guide (the whole page) |
| **Fact sheet** | The short structured part of a guide: kind, region, grapes, area, producers, each with a source tag. | |
| **Source tag** | The short tag after a fact, pointing to the one Sources list at the end of the guide. | Footnote |
| **Study region** | A group of places studied together (Green Spain, the Ebro valley, ...), following the Wine Scholar Guild grouping. | Autonomous community (that's the political region) |
| **Place** | Anything with a boundary on the map: a DO, DOCa, VP, VC or zone. | Region (ambiguous) |

## Spanish wine terms
| Term | Means |
|------|-------|
| **DOP** | Denominación de Origen Protegida, the EU umbrella term. In Spain it covers DO, DOCa, VP and VC below. |
| **DO** | Denominación de Origen, the main appellation level. |
| **DOCa** (DOQ in Catalan) | Denominación de Origen Calificada, the top level: Rioja and Priorat. |
| **VP** | Vino de Pago, a single estate with its own appellation. |
| **VC** | Vino de Calidad con Indicación Geográfica, a step below DO. |
| **Zone** | A named part of an appellation, such as Rioja Alta, Rioja Alavesa and Rioja Oriental. Enters Study only once its parent is known. |
| **IGP** | Indicación Geográfica Protegida (vino de la tierra). Not covered yet. |
| **Pliego** | The official specification of a DOP; the first source for its facts. |

## How we work
| Word | Means |
|------|-------|
| **Slice** | One piece of work, one thread, one PR. A **small slice** is a fix or tweak with no new screen, data or content; everything else is a **big slice** (`CLAUDE.md`). |
| **Release N** | What is live: the `release-N` tag on `main`, made by the `publish` workflow. N only goes up. |
| **LeadBot** | The thread doing a slice. It plans, briefs helpers, merges and closes. |
| **BuilderBot**, **ReviewBot**, **AnalystBot** | The `builder`, `reviewer` and `analyst` agent types in `.claude/agents/`. |
| **Helper** | A short-lived Sonnet agent that runs noisy work (tests, logs, searches) and reports in 10 to 20 lines. |
| **Card** | A tap-to-pick decision for the owner, one option recommended. |
| **Handoff** | The closing note of a thread in `docs/handoffs/<date>-<topic>.md`: done, decided, open, where. |
| **Tester note** | `Review/release-N-what-to-test.md`, written in the slice PR before publish. |
| **[V] [O] [R] [A]** | Claim tags: verified, owner said so, from a report or memory, assumed. |
