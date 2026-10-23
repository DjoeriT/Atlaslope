# AtlaSlope: project overview for a fresh session

Written 19 Oct 2026 so a plain local Claude Code session in this repo has the context that lived in a hosted project. Tags: [V] verified,
[O] owner said, [R] report, [A] assumed. Re-check numbers before relying on them. Rules are in `CLAUDE.md` (the owner's verbatim standing rules: `docs/OWNER-RULES.md`); this file is the why and the state.

## What it is
AtlaSlope is a free web app, "the wine study atlas": Spain's wine places seen from above on a satellite map, with a guide per place that
explains why the wine tastes the way it does (place, weather, ground, what the rules make), plus a Study mode (flashcard-style rounds for
WSET and Wine Scholar students). Static site on GitHub Pages at atlaslope.com (Vite, TypeScript, React, MapLibre). No accounts; progress is
stored in the browser. Renamed from Paraje on 16 Oct 2026. Users see "AtlaSlope"; code and URLs "atlaslope". Repo: DjoeriT/Atlaslope.

## The owner
Djoeri Timessen: ex-CPO at Xapo, Dutch, WSET 2 and 3, Spanish Wine Scholar in progress, "passionate techie who loves wine". He decides
and does not code. Wants brutal honesty, plain words, rough first looks fast, previews before PRs, and every point answered in full. Writes
English or Dutch. Working style and token rules: `CLAUDE.md`.

## Positioning
- Guides are a general, fun wine reference for anyone who loves wine, not exam prep [O, 19 Oct]. "Why it tastes the way it does" is the spine.
- Share card keeps "The wine study atlas for WSET and Wine Scholar students"; home subline (owner chose, 19 Oct 14:44Z, same paragraph) "Spain's wine places from above, and why each one
  tastes the way it does. The wine study atlas for WSET and Wine Scholar students."; headline "Know the land behind the glass." About must not repeat the home page.
- Look: black band + champagne, white page, no dark mode, 6px corners, no pills, no drawn illustrations; photos may be cropped to their
  frames, never cutting a face, glass or bottle (Guides page cards: square crops, each checked, release 55). Detail: `Review/visual-style.md`.

## Current state (23 Oct 2026)
- Release 74 (23 Oct; handoff `docs/handoffs/2026-10-23-germany-pilot.md`): Germany as the fifth country, pilot Mosel and Rheingau at `/de/` (#245); Rheingau has no outline yet.
- Release 70 (23 Oct; handoffs `docs/handoffs/2026-10-22-portugal-batch-1.md`, `2026-10-23-portugal-photos-2.md`): Portugal with equal
  standing: 28 guides (every mainland DOC, Lisboa VR, Madeira, Madeirense), country pages `/es/` and `/pt/` with Home country cards and
  Guides as the country index (#214); 76 photos for 24 of them from Commons and Openverse (#234; Alenquer and DoTejo have none). Guides
  load on demand and the size check counts the first load, limit 2.1 MB (decision #38). Raw downloads moved outside the repo (#229) after
  #214 committed a `data/raw` link that wiped them. Also in it: Study becomes Learn (#227, handoff `docs/handoffs/2026-10-22-learn-finish.md`):
  intro on a first visit, "Learning for" course filter, `#learn`, Cava and Catalunya in Learn. The release also carries other sessions' merged work since 69
  (`git log --merges release-69..release-70`). Portugal's and France's climate colours,
  altitude and slope, and measures on guide pages of places outside Learn: #241 and #244, release 73.
- Italy's climate, altitude and slope for its 87 places and 9 regions, plus a seventh map climate group, Cold (Dfb, Dfc, ET), for
  the Alps: #247, merged 23 Oct after release 73, not yet released (handoff `docs/handoffs/2026-10-23-italy-climate.md`).
- Release 71 (23 Oct; handoff `docs/handoffs/2026-10-22-france-wset.md`): France, third country, the whole WSET L3 list: 96 places
  (94 AOCs plus the PGIs Côtes de Gascogne and Pays d'Oc), guides from the EU single documents (5 from INAO cahiers), INAO outlines (Champagne and
  the PGIs from INAO commune lists and IGN ADMIN EXPRESS), Chablis climats as zones, nesting measured on outlines, IGN BD ORTHO close-in,
  ~330 Commons photos (Muscat de Beaumes-de-Venise has none) (#228, #232, #238). Size option A (#235, owner): each country's outlines load
  with that country and per-place pages leave the first-load count; from above a light copy of every country shows (#95, ~36 KB). Guides cost 0.95M a place [V usage.py], ~90M in all.
- Releases 64-68 (22 Oct; handoff `docs/handoffs/2026-10-22-guide-c3-build.md`): 64 guide page C3 for every place and the map unfold
  (#187, #189); 65 thirteen more map tours by rule A (#191; 15 tours in all); 66 Guides page E "Explore with the map" (#195), Show map in
  the crumb line (#192), no view transition on the unfold (#194); 67 country data and model, Portugal first (#197, #198, countries
  session; also grouped photo credits #196); 68 map bar B: only the stop name on top, keys at the foot, terrain height behind the "i" (#199).
- Release 62 (PR #175): map tour fixes (each stop by its own link, phone strip 300 px, geology at zoom 10+, English rock key).
  Release 63: 404 page and credit fix (#177), speed wins (#179: terrain at 512 px tiles, relief from zoom 7, tours from 6, one fetch
  per data file); also merged: faster builder loop (#176), register watch script (#178, local only). Learn start card: merged with the Learn PR (#147,
  `docs/handoffs/2026-10-22-learn-finish.md`). Agenda and briefs: `docs/handoffs/2026-10-21-agenda-after-62.md`.
- Release 59 (PR #171): map tours for Rioja and Priorat (#127, first part of #148): scroll the guide, the app map flies to each stop
  named in its text; IGN rivers and names, Köppen climate, IGME geology, slope tint, fact markers; listing page and home tile. Also in it:
  #169 BSk "cool, dry steppe", #170 slope measure for every place. Release 60 (PR #172): renamed "Map tours", search in the top bar of every page, tour code and data load on demand with their own
  150 KB per-tour check. Release 61 (PR #173, `git tag -l 'release-*'` for the latest): the tour folded into the guide page (B3 band, layout A), "Map tours" out of the top bar,
  Guides page "Map tour" line and guides/#map-tours, one set of climate colours and names for chart and map. Next: the other 11 map
  tours (brief in `docs/handoffs/2026-10-21-map-tours.md`).
- Release 56 (PR #161): photo credits say "cropped and resized" on the Guides page and place pages (#154; place-page frames crop
  too, `object-fit:cover`); imagery credit «Esri, Vantor» everywhere, share image rebuilt; Esri terms for the saved screenshots in
  `data/SOURCES.md` (#155).
- Release 55 (`git tag -l 'release-*'` for the latest): Guides page v2 (release 54, PR #143: region jump row, 6 guides per region then
  "All <Region> guides", 10 region tiles from `Tools/guides/region_tile.mjs`) and square photo cards (PR #144). Since PR #145 a unit
  test fails while a shown Guides photo has no checked crop (`src/home/photoCrops.json`, `Tools/guides/crop_sheet.mjs`). Release 52 had
  the last 5 Meseta guides and the home page copy "106 / wine places, each with its own guide" (PR #137). Guides: all 106 places have one, 109 guide files with the 3 Rioja zones [V, unit test roster]. Spain is
  complete; a next country waits on the owner. A region runs only on the owner's word, on the local route ("Run a region locally").
- Local Mac: build, dev server and UI tests work again since PR #138 (Doors/doors.ts case clash; `tests/unit/file-names.test.ts` guards it).
- Source quirks: mapa.gob.es, navarra.es refuse; portalagrari.gva.es pliego links 404. Use the Consejo Regulador copy (Jumilla:
  jumilla.wine; Ebro: INTIA) or EU Cellar SPARQL (works; Canarias newer single documents as `<id>-doc2`). EU single document only is OK
  for Navarra pagos, Chozas Carrascal, Vera de Estenas, El Terrerazo (owner). Where no pliego is reachable, the EU single document alone is OK (Navarra pagos, Chozas Carrascal, Vera de Estenas, El Terrerazo).
  Tharsys was added from its EU application text + OJ C/2025/3093 (file PDO-ES-02980). Islas Canarias keeps its guide although it is outside Study (owner). Detail in
  the region handoffs.
- Not verified anywhere: Safari, iPad, real phones. Photos, flags and Study for new regions are out of scope unless asked. A new region
  needs a satellite view for the Guides page (a test enforces it since release 44).
- Running cost [V]: GitHub Pages free; domain ~EUR 10-15/yr [A]; Esri 2M tiles/month free then $0.15/1k, sessions 1k free then $4/1k;
  ~4k visits/month fit free [A]. IGN free (CC BY 4.0, no SLA). Owner is on a flat plan [A], so tokens mean usage-limit headroom.

## Key decisions (dates 2026)
- 16 Oct: renamed to Atlaslope; Spain first; scope in `docs/scope.md`, one-way doors in `docs/handoffs/2026-10-16-one-way-doors.md`.
- 17 Oct: efficiency plan adopted (short sessions, publish reuses green checks, no records PR; `docs/handoffs/2026-10-17-efficiency.md`).
  Travel-listing look over the "book" look. Quiz round rules (spacing, shuffle, known = two rights a day apart): `src/quiz/`.
- 18 Oct: "Quiz" becomes "Study"; each place page is its guide, "Terroir" its written section. ReviewBot narrowed to new screens, copy,
  licence. Mockups one HTML page. Releases only on his typed "publish release N" (cloud safety check refused self-publish). Privacy page
  deferred to just before friends launch; no Sentry/PostHog until then. "Coming soon" countries is a promise: no next country approved.
  Donations: copy only. Site stays link-only (noindex) for Google, decision revisited later. Map flags style B (release 34). Story-guide
  mock accepted, build only on his ask. Skip 3D showpieces, scroll-jacking, glass, bento, AI chat.
- 19 Oct: guide shape C live (release 36); four beats, each fact once, pliego required. No drawn illustrations; photos never cropped to
  tiles (two complaints). Token budget and overrun guards. Navarra's four Vinos de Pago stay on EU single documents only. Zoomed-out
  satellite deferred (#108). Per-sentence Opus check stays (Sonnet drafts need fixes on 36% of sentences). Later on 19 Oct the owner
  reopened the photo rule for the Guides page only: cards are square crops, each checked against the original (release 55). Guide
  enrichment (travel tips, wineries, history) goes in its own clearly labelled section with its own source rules (#150).
- 20 Oct: Esri screenshots taken from the keyless endpoint stay as they are (option C); imagery credit «Esri, Vantor» (Maxar renamed),
  not Esri's longer IP sentence. Photos no longer keep their own ratio: they may be cropped
  to their frames everywhere, with the same care as the Guides page (the 4:3 place-page frames stay). #127 (Rioja flyby) is a big slice, done together with #148 (which other guides get a fly-over).
- 21 Oct: map tours (owner): round 3 mock approved; IGME geology shipped with credit "Source: IGME, MAGNA 50"; name "Map tours"
  everywhere (guide button "Map tour"); same day folded into the guide page (mock `Review/mock-tour-in-guide/`, button B3 with a
  drifting satellite still, layout A: the same guide page with a map column; "Show on map" stays on guides without a tour), out of the
  top bar, listed at guides/#map-tours (map-tours/ and read-with-the-map/ redirect there); tour data has its own download limit (150 KB per tour) and the main site
  keeps 2 MB (incident: PR #171 went to 2.24 MB); search in the top bar of every page at all times.
- 21 Oct, later (owner; detail in `docs/handoffs/2026-10-21-agenda-after-62.md`): tours stay hand-made, no default-tour generator.
  Map tour: B and a clean-slate round 1 (`Review/mock-tour-clean/`) dropped the same evening; the v3 journey comes back exactly,
  full-screen, opened from a big photo button at the top of the guide, a photo in every stop card (`docs/handoffs/2026-10-21-tour-v3-restore.md`). "Study" becomes "Learn" (lands with the Learn PR; "Study region" and the "wine study atlas" tagline stay, owner 22 Oct 2026). Learn:
  one course setting that filters everything, default all of Spain, Cava and Catalunya in without the map question, WSET Level 2 ·
  Spain pilot next. Launch: wine lovers first (reverses 17 Oct), quiet launch, then testers, noindex until the public step, tip link.
  Speed: page shell, then a service worker; no CDN. Guides current: "Checked on" plus source dates, pilot on 3 places.
- Atlas cover (owner 22 Oct 2026, option E1): clicking Atlas opens a cover card ("See where your wine comes from": map-tour and slopes loops, borders, climate and guide stills, the countries) before any country. The empty hash is the cover; Spain's card is `#country=spain`. Media: `Tools/atlas/cover_media.mjs` into `public/atlas/`.
  Size check (owner, 22 Oct 2026, option A): video (.webm, .mp4) is left out of the 2 MB download check like photos; the cover's two clips are ~1 MB and load only with the cover. Without them the atlas is 1.96 MB: about 40 KB of room left.
  Guides on demand (owner, 22 Oct 2026, PR #214): each guide is its own chunk under `dist/guide-data/`, loaded with its page or fly-there, and left out of the check like `dist/story/`. Incident: Portugal took the whole site to 2.13 MB. First load after: 1.93 MB; the 137 guides are 0.29 MB more, fetched one at a time.
  Limit 2.1 MB (owner, 23 Oct 2026, PR #234): the Portugal photos took the first load to 2,000,515 bytes after the app bundle was trimmed to the photos it can show. Next room: fact sheets on demand (about 55 KB, needs a precomputed grape index for search and all sheets when Study opens).
- Italy (owner, 23 Oct 2026): 87 places covering all 78 official DOCGs is the target; the earlier "96 DOCGs" is dropped. Map climate
  colours get a seventh group, Cold (Dfb, Dfc, ET), for the Alpine places (#247).
- Models: Opus 5.5 main session; Sonnet 5.5 helpers. Sonnet re-reads at the same price as Opus, so a switch saves only ~20% [V].

## Cost lessons (measured)
- Countries data pull (22 Oct 2026, #149) [V]: 10.1M re-read + 0.3M new against 3-6M estimated; ~70 calls at ~140K context. A local session's base context is ~140K, not 100K: estimate calls x 140K, and run probes and checks in one script, not one call each.
- 17 Oct: 11 sessions cost $143 for releases 6-15; ~60% was sessions re-reading their own history (428M cached reads); agents were under 1% [V].
- 19 Oct audit: 485M tokens over 10 sessions, 97% re-reads [V].
- Guide cost per place [V]: Andalucía 2.6M; Cataluña ~3.1M all-in (12 guides ~37M, write step 20.1M vs 5-8M estimated); packs ~25K.
  Baleares workflow 0.42M per guide, but the session around it cost 14.7M re-read. Ebro (11 guides, measured 19 Oct) ~10.4M re-read + 0.9M new, ~1.0M per
  guide all-in, one third of Cataluña. Use ~1.0M/guide for estimates, split re-read vs new.
- Mediterranean (11) 21.2M re-read + 1.0M new: the prep agent alone took 14.5M over 107 calls (one agent fetching every source while
  hosts refused); writers ~0.4M/guide; ship 3.2M. Canarias (11) 12.1M re-read + 1.0M new, same prep. Canarias was ~1.2M/guide all-in. Writers, one place per agent,
  ~0.4M/guide. Fix: one small prep agent per place with a call cap, stop on a refused host. Subagents cannot merge + publish (auto-mode needs the
  owner's typed words); in the hosted project releases ran in a thread, locally the owner approves directly.
- Four further estimate overruns on 19 Oct: Cataluña write 20.1M vs 5-8M; re-check 8.5M vs 4-6M (a step was left out); copy fixes 7.9M vs 1.2-2M
  (~100 calls x ~70K); Guides-page fix 5.8M vs 1-1.5M (~45 calls x ~130K). Rule: estimate = calls x ~100K + work, count every step.
- A second Opus check finds ~7 misses per guide (patterns in `Tools/guides/CHECKER.md`). Pair agents ran long: re-read per guide 3x Baleares.

## Map tours (renamed from "Read with the map" 21 Oct 2026; part of the guide page, listed at guides/#map-tours)
Live for 15 guides since release 65 (Rioja and Priorat since 59), opened from the guide's "Read with the map" card, which unfolds into the
full-screen v3/v4 map mode (release 64). Format in `docs/guides.md` "Story files". A stop comes up at the paragraph that names it; flights 1.5-2.5 s (owner 22 Oct).
Owner 21 Oct 2026: a prominent "Read with the map" button (renamed: guide button "Map tour", then folded into the guide page, same day); map stops only from the guide text; first PR Rioja plus Priorat. Which guides
get it (#148; story data has its own download limit, owner 21 Oct 2026, plan in `docs/handoffs/2026-10-21-story-guide-build.md`): at least 4 map stops, and either big (a DOCa or top 8 by vineyard area, MAPA DOP
report 2023/2024) or steep (top quarter of the 96 places by share of land over 30% slope, `place-measures.json`). Result 13 guides (list never written down).
**Rule A (owner 22 Oct 2026, replaces the above):** at least 4 fly stops in the guide's own text, and the land shows from above: steep (top quarter by
share over 30%), or at least 500 m between p10 and p90 altitude, or two Köppen classes of at least 20% each, or big (DOCa or top 8 by area: La Mancha,
Rioja, Ribera del Guadiana, Cava, Catalunya, Utiel-Requena, Ribera del Duero, Jumilla, MAPA 2023/24 p. 15). Result 14: Rioja, Priorat, Ribeira Sacra,
Alicante, Campo de Borja, Cangas, Costers del Segre, Monterrei, Navarra, Somontano, Txakoli Getaria, Txakoli Bizkaia, Txakoli Álava, Valdeorras;
plus Ribera del Duero as the owner's own pick (2 fly stops). The rule is meant for every country (owner, 22 Oct 2026): "big" = the country's top
tier (Spain DOCa; e.g. Italy DOCG, Portugal its top DOCs [A]) or its top 8 by vineyard area from the national official register; steep, altitude and
climate come from `place-measures.json` and rank within that country's places. Pilots measured 22 Oct 2026: Ribeira Sacra 97K, Ribera del Duero 117K helper tokens.

## Open issues (GitHub, DjoeriT/Atlaslope)
Big plans the owner raised 19 Oct 2026, each a fresh plan session, priority his: #146 full QA sweep; #147 Study plan; #148 fly-over for
selected guides; #149 more countries (Portugal or France first); #150 guide enrichment; #151 code and backend setup; #152 performance
(#149, #151, #152 hang together). Guides page leftovers (handoff `2026-10-19-guides-page-build.md`): Canarias tile mostly sea, Rioja
tile dark fill, Green Spain neighbour outlines, long phone page (all gone with Guides page E, release 66).
Order set by the owner 20 Oct 2026: #83 flaky Study tests (done 20 Oct), then #126, then #127 with #148 (done 22 Oct: 15 map tours, releases
64-65). Open from 22 Oct: #188 Priorat stop 6 never settles in shots-tour; flaky tests #190 (9-stop story test, made slow), #193 (cards
zoom poll) and #240 (a late map moveend writes #view= after the page changed the URL, 23 Oct); Koppen tint needs a land cut (it only fades). Priority labels set 19 Oct 2026 (cleanup). Next: #126 repetitive "If you like this, try" cards
("Tempranillo here too" x3, Navarra photo white band); #48 QA follow-up (richer Spain and region cards); #96 alt texts; #18 Vinos de Pago
outlines (Urbezo done, 12 left); #42 photos; #29 main grapes; #1 DO layer from 2014. Later: #130 major upgrades
(React 19, MapLibre 6, Vite 8, TS 7, Vitest 5); #106 cause-to-taste chain; #103 enrich guides from more sources; #101 travel flags; #108
Esri tile cost; #30 producers; #16 ready for friends; #15 mastery map and climate layer; #8, #7, #4, #3. Not in issues: Canarias guides
need a polish pass (style lists "white, rosado and red", label terms read like regulation text); source quirks in the Mediterranean and
Canarias handoffs; Cangas and Álava have no vineyard photos; Ribeira Sacra yield conflict; Getaria/Cangas pliego versions; Navarra pliego
unstamped (INTIA file). Website slice 3 (static guide pages, /spain/ index, share cards, sitemap) only on his go, pilot 2 guides first
(`Review/website-plan.md`). Later: globe intro (needs MapLibre 5, with France), Cmd-K.

## Open questions for the owner
- Home donation line asks for money with no way to give; About feedback email link is "later".
- Meseta (25, last Spanish region): all 25 written after batch 3 (`docs/handoffs/2026-10-19-meseta-batch-3.md`), 0.55-0.62M a place measured on the local route; every place has a guide. Guides page and Meseta unsure edits done (releases 53-55). Next countries: Portugal, then France (owner, 22 Oct 2026; France plan `Review/countries/france-plan.md`, decisions #52-#58, pilot waits for Portugal's mainland and #205); Italy pilot right after the France pilot (owner, 22 Oct 2026; plan `Review/countries/italy-plan.md`, decisions #59-#66).; Germany fifth: prep slice now, pilot (Mosel, Rheingau) after the Italy pilot (owner, 22 Oct 2026; plan `Review/countries/germany-plan.md`, decisions #71-#78).; Austria and Greece after Germany (owner, 22 Oct 2026; decisions #81-#92).
- Portugal photos (23 Oct 2026): Alenquer and DoTejo have no usable open photo; seven places have one. A wine commission's media library
  (CVR Lisboa, Tejo, Algarve) needs written permission, his to ask. Kolforn (Lagos photos) asks on Commons to be mailed when used.
- France copy to rewrite: the France intro, tile lines and the footer ("Spain and Portugal"). The 14 WSET names that are
  districts or sub-names (Champagne's five, Beaujolais-Villages...) live inside their parent's guide: OK?
- From 22 Oct: Raimat (Costers del Segre) "far east" per the pliego while the map shows west, add a note? Cangas rock key shows "Sandstones and
  slates" twice (two colours, one unit). Guides page: bring back "More regions are being written"? Map tour chip text is about 10.5 px on a phone.
- Safari, iPad, phone check and WSET-student testers (a Dutch invite draft was given 19 Oct): when?
- Offered, unanswered: "no handoff when 5 or fewer turns remain".
- Website slice 3 and Google indexing: go or wait.

## Where things live
`README.md` layout and commands; `docs/env-local.md` and `docs/env-cloud.md` what differs by where a session runs; `docs/scope.md`, `architecture-decisions.md`, `guides.md` (guide format), `glossary.md`, `operations.md`
(rollback, incidents, keys), `privacy.md`, `AGENT_ROLES.md`, `PROJECT_CONTEXT.md`; `docs/handoffs/README.md` index of what each session did;
`Review/` briefs, mocks, tester notes, `visual-style.md`; `content/facts` fact sheets, `content/guides` guides; `data/SOURCES.md`;
`Tools/guides/` guide pipeline (`WRITER.md`, `CHECKER.md`, `pack.py`, `check_guide.py`, `usage.py`, `region.workflow.js`); `.claude/skills/release`.

## Run a region locally
Route set 19 Oct 2026 (owner) for Meseta, to cut the session re-reads that dominated every region's cost (see "Cost lessons"). Steps 2 and 3
are new and not yet measured: the pilot proves them before the rest runs.
1. Owner says "use a workflow for <region>", in a fresh session. Estimate from Ebro's measured ~1.0M/guide; target ~0.5-0.6M/guide on this
   route [A] until the pilot measures it.
2. Sources step by script, not agent: a script reads the manifest, fetches each pliego (hosts load directly on the Mac,
   `docs/env-local.md`), extracts it into `Review/guides-pipeline/<region>/` (`Tools/guides/extract.py`) and writes a one-line status per
   place. EUR-Lex blocks scripts: use the Publications Office Cellar SPARQL on the CELEX number. Only places the script cannot do get an agent:
   one small agent per place, with a step cap, stopping on a refused host.
3. Write and check outside the chat: a script starts one fresh headless run per place (`claude -p` with that place's packed brief from
   `pack.py write|check|sheet`): Sonnet writer, machine check (`check_guide.py`), per-sentence Opus check (stays, owner 19 Oct). Each run
   writes its result to a file. The session starts the script and reads only a 10-20 line summary, never each place's output.
   (`Tools/guides/region.workflow.js` is the cloud equivalent; it needs the workflow runner.)
4. Pilot 2 places, measure with `python3 Tools/guides/usage.py --budget`, project the total and continue only if it fits; stop at 1.5x.
   Then batches of ~8 places, each batch in a fresh session that starts from the last handoff.
5. Per batch: swap "no guide" UI-test fixtures when a place gains a guide (Jumilla/Navarra style); the region's satellite view for the Guides
   page goes in once. One PR per batch on a `claude/guides-<region>-<n>` branch, pushed once, with the handoff and tester note; CI green;
   ReviewBot (new copy); merge; ask for release N.

## Run a release locally
1. Slice PR merged on green CI (it carries `Review/release-N-what-to-test.md` and the handoff).
2. N = latest `release-*` tag + 1. Follow part A of `.claude/skills/release/SKILL.md`, end with one line asking "publish release N".
3. Only after his typed "publish release N": start the `publish` workflow (`gh workflow run publish.yml -f release=N -f commit=<full hash>`
   or the Actions page; check input names in `.github/workflows/publish.yml`). It reuses the green main run, deploys, then tags.
4. Check the live site once. Rollback is publish again with the next number and the previous good commit (`docs/operations.md`).
