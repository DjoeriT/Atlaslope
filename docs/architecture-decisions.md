# Atlaslope v1: architecture, services and data decisions (16 Oct 2026)

Renamed from Paraje to Atlaslope on 16 Oct 2026; the repo (DjoeriT/Atlaslope) and the address (atlaslope.com) followed the same day. Moved into the repo at the restart commit; the copy in the project files is superseded.
Words: `docs/glossary.md`. Operations (rollback, keys, third-party hosts): `docs/operations.md`. Privacy facts: `docs/privacy.md`.

One page for the builder brief to stand on. Tags: **[O]** the owner decided, **[A]** my proposed default (stands unless the owner objects), **[V]** checked in the repo. When building resumes these move into `docs/PROJECT_CONTEXT.md` (decisions log) as one commit.

## 1. Shape of the app
| # | Decision | Why | Tag |
|---|---|---|---|
| 1 | A static web app: Vite, TypeScript, MapLibre GL. No server, no database, no accounts. | Free to run, nothing to operate, works for the owner and friends. | [O] 15 Oct |
| 2 | Hosted on GitHub Pages from the public repo; the `publish` workflow deploys a commit on `main`, then tags it `release-N` (a tag no longer deploys by itself). | Free, already set up and proven by releases 1 and 2. | [O] 15 Oct |
| 3 | The build starts from scratch. Kept: `data/`, `data/SOURCES.md`, the data tests and the repo rules. Binned: the app code and the old plan. Mocks are reference only. | The old code grew from a different design. | [O] 16 Oct |
| 4 | Desktop and iPad are the designed sizes. Phone works but is not polished. | It is a study-at-the-desk tool. | [A] |
| 5 | English interface. Place names as they are officially written (Rías Baixas, Penedès). All interface text sits in one strings file, so a translation is a file and not a rewrite. | Cheap now, expensive later. | [A] |

## 2. The world model (the scaffolding for Europe and the world)
| # | Decision | Why | Tag |
|---|---|---|---|
| 6 | One place tree: country › study region › appellation › zone. Each place has an id, parent, level, names, boundary, sources, fact sheet, guide and quiz weight (core, secondary, not asked). | Spain is the first instance, not a special case. | [O] 16 Oct |
| 7 | Ids are paths: `es`, `es/rioja`, `es/rioja/rioja-alta`. Level names belong to each country (DOCa in Spain, Grand Cru in France). | Readable, stable, and nothing in the code is Spain-shaped. | [A] |
| 8 | A producer attaches to a place id later. In v1 there is no producer table, only the rule. | It keeps the slot open without building it. | [O] 16 Oct |
| 9 | The navigation is the place tree: Spain card › region card › place card › guide, with breadcrumbs. | The model becomes something you can walk. | [O] 16 Oct |

## 3. Content
| # | Decision | Why | Tag |
|---|---|---|---|
| 10 | Facts live as data, one file per place, with a source on every row. A check fails the build on a row without a source. Guides are Markdown, one per place, with a sources line (since release 10: the Terroir text is JSON in `content/guides/`; the guide is the whole place page, glossary). | A wrong fact teaches a wrong answer. A contract catches the missing source before a person reads it. | [O] facts cited; [A] format |
| 11 | Launch: fact sheets for all 68 core places. Terroir written for Green Spain, Castilla y León and Rioja first, then region by region. | The quiz works everywhere from day one. | [O] 16 Oct |
| 12 | Sources: official pliegos, IGN, MAPA, AEMET. Wine Scholar Guild and WSET course structure (which places, how they are grouped, what the exam asks) may set coverage; their text, maps and images are never used. The why text is Atlaslope's own synthesis and says so. | Their terms forbid reproducing their materials; the syllabus angle is the study value. The first wording (a blanket ban, written by Claude at setup on 15 Oct and tagged as the owner's) was narrowed by the owner on 17 Oct. | [O] 17 Oct |
| 13 | LeadBot drafts, the owner spot-checks. | The owner knows wine, LeadBot does the legwork. | [O] |

## 4. The quiz and memory
| # | Decision | Why | Tag |
|---|---|---|---|
| 14 | Spaced boxes per place; misses come back sooner. Question types: find it, what is this (four choices), the fact question. No type-in field. Only place names hide in a quiz; rivers and towns stay. | | [O] 16 Oct |
| 15 | Five new places a session, in course order. Known means right the last two times; solid means three spaced passes in a row. Zones join once their parent is known. | | [O] 16 Oct |
| 16 | Memory is kept per place, not per place and question type. Box intervals are 1, 3, 7, 14 and 30 days. | Simple to explain and enough for 68 places. A tuning knob, not a promise. | [A] |
| 17 | Find-it never asks for a place it cannot draw. | No unfair questions. | [A] |
| 18 | The quiz engine is pure TypeScript with no map in it, unit-tested on its own. | The spine of the product gets the most tests. | [A] |

## 5. Storage and privacy
| # | Decision | Why | Tag |
|---|---|---|---|
| 19 | Progress lives in this browser only (localStorage), in one versioned record with a migration step. No sync in v1 (#8 later). | Nothing to host, nothing to leak. A version number means a later change can't wipe progress. | [O] browser-only; [A] versioning |
| 20 | No cookies, no accounts. Two third-party services only: an error service (EU, no personal data) and usage analytics (EU, cookieless), both listed in a privacy note in About. | The owner wants to know when it breaks and how it is used (16 Oct 10:52Z). | [O] 16 Oct |

## 6. Map and outside services (all free)
| # | Service | Used for | Key or cost | Tag |
|---|---|---|---|---|
| 21 | Esri World Imagery, keyed endpoint | Satellite, the default view | Free ArcGIS developer key, restricted to `https://atlaslope.com` (see "#21 referrer" below; handling in `docs/operations.md`). The key is visible in the page by nature; the referrer lock is its protection. Repo secret `VITE_ESRI_API_KEY`. The owner creates the key once. | [O] 16 Oct |
| 22 | Mapzen Terrarium tiles on AWS Open Data | 3D terrain and hillshade | Free, no key | [V] in use |
| 23 | Natural Earth, bundled | Atlas base: land, sea, coast, rivers, towns. Also the offline fallback. | Public domain | [V] in mocks |
| 24 | Köppen-Geiger climate map (Beck et al.), bundled | Climate layer | CC BY 4.0, entry in SOURCES.md first | [A] |
| 25 | Map labels as page elements in Newsreader and IBM Plex Sans, self-hosted (as in the mocks) | Labels | No glyph server: drops the OpenFreeMap font endpoint the old app used [V] | [A] |
| 26 | GitHub Pages and Actions | Hosting, checks, deploy | Free on a public repo | [O] |

Nothing paid. Any new service is a question to the owner first (repo rule).

## 7. Data before the build
| # | Decision | Tag |
|---|---|---|
| 27 | Boundaries for the 16 places missing from the 2014 ministry layer are fetched before v1. Two of them are quizzed (Campo de Calatrava, Cebreros); fourteen are Vinos de Pago, which are never asked. This runs through a session on the owner's Mac, because cloud threads cannot reach Spanish government hosts. | [O] 16 Oct; counts [V] |
| 28 | The Canary Islands are drawn in an inset map. Cava stays one multi-region appellation, shown under Cataluña. | [A] |
| 29 | Every new file under `data/` gets its entry in `data/SOURCES.md` first. | [O] rule |

## 8. Quality gates
| # | Decision | Why | Tag |
|---|---|---|---|
| 30 | Contracts and tests come before behaviour. That means unit tests for the quiz engine, the place tree and the data contracts, plus Playwright on the built site with fixtures and no network. | Repo rule. | [O] rule |
| 31 | **New rule:** after each deploy, a GitHub workflow loads the live site in a real browser on the real network and fails if satellite or terrain is blank; the owner glances at map releases himself. No Mac needed. | Incident: release 2 showed a black or grey map on his screen while CI was green. | [O] 16 Oct 10:38Z |
| 32 | Every mock and screen is checked at desktop and iPad width, with large text, on the atlas and on satellite (one light theme since 18 Oct 2026). | Repo rule. | [O] rule |

## Still open (not blocking the brief)
- ~~A name for the app's home address~~: settled by #47, atlaslope.com.

## Updates from the decisions interview (16 Oct 2026)
- **#14 refined [O]**: question type follows the box: new = what is this, learning and known = find it, solid = fact question.
- **#15 refined [O]**: the five Vinos de Calidad join after their region's core places are known; within a region, new places come north to south.
- **#21 refined [O]**: when imagery fails, the atlas base shows with a note. No second satellite source.
- **#33 [O] Models**: the builder thread runs on Opus 5.5. Builder subagents default to Sonnet 5.5; Opus only for complex work (quiz engine, place tree model).
- **#34 [O]**: Atlaslope's long-term home is its own domain, fully online. The owner's Mac is never a host.
- **#15 refined [O] 10:39Z**: due places come in rounds of 20, most overdue first, with Keep going or Stop after each round and no limit on rounds. Five new places a day by default; "Learn 5 more" once nothing is due, no limit.
- **#19 refined [O] 10:37Z**: no accounts in v1. Progress in the browser plus a save and load progress file; a Home Screen web app manifest so Safari's 7-day storage wipe doesn't apply there; storage behind one interface so sync (#8) plugs in later.
- **#26 refined [O] 10:37Z**: GitHub Pages stays the host. Own domain bought (owner's word) and connected before release 4, because browser progress is tied to the address.
- **#35 [O] 10:41-10:46Z, product and usability**: link-only visibility before v1 (noindex, robots.txt); shareable URLs that carry the place and map view; English only; friends at v1. Quiz: right answers move on after one second, misses wait with the why line; find-it counts a tap within about 44 px outside the boundary; one "That was a slip" undo per miss; quiz map flat and north up, Explore tilted 3D.
- **#36 [O] 10:46Z Offline**: a service worker caches the app shell, bundled data, fonts and atlas base so everything but satellite and terrain works offline. Playwright runs one offline test.
- **#37 [O] 10:47-10:51Z, content**: zones in v1 = Rioja's three only; the fact question asks main grapes, styles, level and climate only; grape names shown "local (main)" with search on both; guides 600 to 800 words in the Rioja mock's voice; up to three open-licence photos per place (Wikimedia, credited, in SOURCES.md, online only, Claude picks, owner swaps); "Report a mistake" opens a prefilled email to an address the owner names; a yearly data check issue.
- **#38 [O] 10:50-10:51Z, platform**: browsers from the last two years, iPadOS 17+, tested on Safari and Chrome; map usable in 3 s on home Wi-Fi, build check fails above about 2 MB download (satellite and photos excluded); Dependabot monthly grouped PRs, security at once, merged by a thread on green CI. House rules [A]: strict TypeScript, format and lint in CI, PR per change with ReviewBot.
- **#39 [O] 10:53Z**: the interface is built with React on Vite and TypeScript; MapLibre is driven directly, not through a wrapper; the quiz engine and place tree stay plain TypeScript with no React in them.
- **#40 [O] 10:52-10:54Z, operations**: Sentry (EU, free, no personal data, no replay) for errors from release 3; PostHog EU cloud (free, cookieless) for usage from release 4; privacy note in About. Running cost up to €100 a year including the domain; a release 50% over its token estimate pauses and asks. Next country: decided later (France is Claude's pick).

## One-way doors check (16 Oct 2026, thread "first principles questions")
Defaults set because they are costly or impossible to change once progress, links or commits exist. They stand unless the owner objects. [A]
- **#7 replaced, #41 Stable ids**: a place id is a short slug that never changes and never contains its parent (`rioja`, `rioja-alta`; a second country prefixes only on a clash). Progress, shared URLs and photos key on it. Why: a path id breaks every saved progress record and shared link the day a place moves parent or a course regroups its regions.
- **#42 Overlaps allowed**: each place has one home parent (breadcrumbs, navigation) plus optional "also within" links, and boundaries may overlap (Cava across regions, DO Catalunya over Penedès; France's nested AOCs need it from day one). Study regions are stored as a course grouping over the tree, so a WSET grouping or an SWS revision moves no place. Navigation as mocked is unchanged. Extends #6.
- **#43 Answer log**: progress keeps every answer (place id, question type, right or wrong, time, seconds taken), and boxes are computed from it. Why: history that isn't recorded can't be rebuilt. The log lets the box rules (#16) change without resetting anyone, measures both goals (40 of 68 by session three, weekly use) from the owner's own record, and makes sync (#8) a merge. Size: tens of KB a year. Refines #19.
- **#44 Photos in git**: commit one resized copy per photo (about 1200 px WebP, about 150 KB), never originals. Git history can't be shrunk under the no-rewrite rule, so 200 originals would stay in the repo forever.
- **Heads-up, two-way, no card**: PostHog cookieless memory mode makes every visit a new visitor, so it cannot show retention or "comes back weekly" for friends. The owner's own goals come from the answer log. Revisit when friends join at v1.
- **#45 [O] 10:59Z Writing licence**: code stays MIT; the owner's writing (fact sheets, guides, why lines) is all rights reserved, with a notice in the repo (`NOTICE.md`, first planned as `CONTENT-LICENSE`, and a line in README) saying MIT covers code only. Photos and data keep their own licences. Repo stays public. Can be loosened later, never tightened.
- **#47 [O] 12:08Z Name and address**: the app is **Atlaslope**, at atlaslope.com (atlasslope.com redirects to it). Browser progress, shared links and the Esri key referrer use atlaslope.com from release 4. The repo and Pages path rename, wordmark and strings follow in the restart commit [A]. Because the domain is owned, the host stays a two-way door.
- **#46 [O] 11:02Z Phasing**: Sentry (was release 3), PostHog (was release 4), the privacy note and the offline service worker (#36) move to release 8, "ready for friends". The Home Screen manifest and progress file stay in release 4; the post-deploy map check stays in release 3.

## Updates after the builder plan review (16 Oct 2026, 12:45Z onwards; they override the lines above)
- **#21 referrer**: the Esri key is locked to `https://atlaslope.com` from the start, since the domain is pointed at Pages in release 3 (review finding 9). [A, brief]
- **#26 and #47 timing**: atlaslope.com is connected in release 3, not "before release 4". [A, brief]
- **#27 fetch location**: the data step runs as one GitHub Actions run, the owner's Mac only as fallback. [A, brief step 1]
- **#40 timing**: superseded by #46; Sentry and PostHog arrive in release 8.
- **#46 status (18 Oct 2026)**: release 8 shipped the new look instead; Sentry, PostHog and the privacy note are still not built [V]. Owner cards, 18 Oct 15:30Z: neither Sentry nor PostHog yet, revisit just before friends get the link; the privacy note stays internal (`docs/privacy.md`) until then; photo credits link their licence and say "resized", and the owner's writing stays all rights reserved.
- **Still open, domain**: closed. atlaslope.com is bought (owner, 12:19Z).

## Second country: Portugal (owner, 22 Oct 2026, issue #149, option B)
- **#48 Country in the URL**: Portugal places get real pages at `/pt/<place>/` (e.g. `/pt/douro/`), built as files for GitHub Pages; home gets a country choice. Spain keeps `atlas/#place=<id>` for now and moves to `/es/<place>/` in its own slice, with redirects from the old hash links. Owner chose this over "hash now, paths later" (22 Oct 2026). [O]
- **#49 Courses per country**: Portugal shows the WSET filter only; Wine Scholar Guild has no Portugal course, so its filter is hidden there. [O]
- **#50 Imagery per country**: Portugal close-in uses DGT OrtoSat 30 cm with Esri as fallback, if a speed test passes; otherwise Esri only. Spain keeps PNOA. [O]
- **#51 Port and Madeira**: each is its own place, using the overlap rule (#42) over Douro and Madeirense. [O]
- Taken on the report's recommendation, reversible [A]: zones built from CAOP parish lists in each spec (as for Rioja); writers read Portuguese sources and write English; Madeira and Açores after the mainland. Source: `Review/portugal/report-first-principles.md` section 6.

## Third country: France (owner, 22 Oct 2026, issue #149; plan `Review/countries/france-plan.md`)
- **#52 France timing**: the France pilot starts after Portugal's mainland is done and #205 is merged. [O]
- **#53 France scope**: the WSET L3 list first, region by region; the other PDOs later, each region on its own word. [O] Kept 22 Oct 2026
  after the prep count: 108 WSET names, about 96 of them appellations (~72M at 0.75M a guide); all 366 PDOs plus 2 WSET-named PGIs under
  Portugal's per-country rule would be 368 guides (~276M), or ~286 (~215M) with Grand Crus as zones (`Review/countries/france-prep/`). [O]
- **#54 France pilot**: Chablis and Pauillac, pages at `/fr/<place>/` (#48). [O]
- **#55 Climats as zones**: Grand and Premier Cru climats are drawn as zones inside their village AOP, from the pilot on. [O]
- **#56 Bordeaux classifications**: a text list in the guide, no map layer (they rank châteaux, not land). [O]
- **#57 France licences**: INAO re-use terms read and a BRGM email drafted for the owner to send, before the pilot ships. [O]
- **#58 France outlines "for information"**: said in the credits line; INAO's plans portal is the only binding map. [O]

## Fourth country: Italy (owner, 22 Oct 2026, issue #149; plan `Review/countries/italy-plan.md`)
- **#59 Italy timing**: the Italy pilot runs right after the France pilot is merged, before France's regions; then both scale. [O]
- **#60 Italy scope**: the WSET L3 list, about 40 places, region by region; not all DOCG, not all 411. [O]
- **#61 Italy pilot**: Barolo and Chianti Classico, pages at `/it/<place>/` (#48). [O]
- **#62 Italy outlines**: official where a region publishes one (Piemonte, maybe Bolzano); else the disciplinare's municipality list plus ISTAT, marked "approximate" in the credits line. [O]
- **#63 Italian sub-zones**: Barolo MGA, Chianti Classico UGA and the like are zones inside their appellation where an outline exists (as #55); else a text list. [O]
- **#64 Umbrella names**: Toscana, Sicilia, Puglia, Terre Siciliane, Delle Venezie are named in their region's text, with no place of their own. [O]
- **#65 Cross-region appellations**: home parent is the region with most of the area, "also within" the other (#42). [O]
- **#66 Italy map layers**: Esri imagery, TINITALY terrain, no geology in the pilot; LeadBot drafts an ISPRA licence email the owner sends. [O]
- **#67 Chianti Classico outline**: traced in the pilot from the disciplinare's UGA annex (Allegato 3), which names the places inside the five partial municipalities; the same work gives the UGA zones (#63). The municipality outline (+33%) is not shipped. [O]
- **#68 Italian families**: Valpolicella (with Classico, Ripasso, Amarone, Recioto) and Soave (with Classico, Recioto di Soave) are one place each, their styles inside the guide; 30 Italian places. [O]
- **#69 Italy first wave** (amends #60): the 30 WSET L3 places (#68) plus every other DOCG, about 55-65 more [A], region by region, each region on the owner's word. The DOCG count comes from MASAF's official DOCG list, not the EU texts (a script on those, 22 Oct 2026, mislabels some DOCs and misses some DOCGs). A DOCG "Superiore" or "Riserva" of a DOC folds into one place with styles (as #68). The other DOCs and the IGTs come later, each on his word. [O]
- **#70 Italy order** (amends #69, same day): the 30 WSET L3 places first, region by region; the other DOCGs (about 55-65 [A]) are a second wave after them, each region on the owner's word. [O]
