# Atlaslope scope (owner decisions, 16 Oct 2026)

Renamed from Paraje to Atlaslope on 16 Oct 2026 (product name only; repo and URLs keep Paraje until the owner renames them). Moved into the repo at the restart commit; the copy in the project files is superseded.

From the first-principles scope quiz in the thread "ideate the whole system". These supersede the on-hold development plan wherever they differ. Tags: [O] owner said so, [V] verified, [R] from memory, [A] assumption.

## What Atlaslope is
- **For** the owner and friends, free. [O]
- **Job**: the wine study atlas for WSET and Wine Scholar students: help serious students and passionate wine lovers understand wine regions deeply, to exam depth, and the why comes with every answer. [O] **Change (owner card, 17 Oct 2026):** exam students now come first in how the app presents itself (tab title "AtlaSlope · The Wine Study Atlas", link previews, welcome text); it was wine lovers first, exams second.
- **Spine**: the quiz with memory. It is the one thing SommGeo and the World Atlas of Wine don't do [R, SommGeo check], so it stays central.
- **Coverage**: Spain first, then Europe, then the world. The architecture is built for the world from day one. [O]

## The place tree (world scaffolding)
One model for every country, with Spain as its first instance.
- **Levels**: country, then study region (the course grouping, such as Spain's ten SWS regions), then appellation (DO, DOCa, VC; in France it would be AOC), then zone (Rioja's three zones, Priorat's villages). The smallest unit taught is DOs plus zones. [O]
- **Each place has** an id, parent, level, names, boundary, its source, a short fact sheet, a guide, and a quiz weight (core, secondary, not asked).
- **Level names belong to each country** (DOCa in Spain, Grand Cru in France), so nothing in the code is Spain-shaped [A, design rule].
- **Producers in v1 (reopened by the owner, 16 Oct 2026 19:37Z)**: a producer attaches to a place id. Fact sheets name up to three famous producers or wines per place, only those a Spanish Wikipedia article about the place singles out, cited; the owner can swap any; gaps allowed. Ships in release 4.1. Was: slot empty in v1. [O]

## Boundaries before v1 (owner, 16 Oct 2026 10:10Z)
- Every place is on the map at launch. The 2014 ministry layer lacks 16 current places: 2 that the quiz asks (Campo de Calatrava DO, Cebreros VC) and 14 Vinos de Pago (never asked in v1, fetched for completeness). Cava and the Canary Islands are in the layer already; the Canaries get an inset map. [V, data/dop-overrides.json] This is a data step that runs first, through one GitHub Actions run, the owner's Mac only as fallback (cloud threads cannot reach Spanish government hosts; builder brief step 1, 16 Oct). Each new boundary gets its source, date, licence and steps in `data/SOURCES.md`. [O]

## Content
- **Short fact sheet** for every core DO and zone: main grapes, styles, altitude range, climate, main soil, and one why line. Every row cites a public source (official pliegos), never Guild material. The owner spot-checks. [O]
- **Place guide** for every place, in one template: where it sits, why the wine tastes as it does, and two or three "fly there" buttons that move the map to the point being made. It ends in "test me on this". [O]
- **Writing at launch** (owner, 16 Oct 2026 10:10Z): cited fact sheets for all 68 core places; full guides for Green Spain, Castilla y León and Rioja first, the rest follow region by region in course order. A place without its guide yet shows the fact sheet and fly-there buttons in the guide template. [O]
- **Guides at launch, revised** (owner, card, 16 Oct 2026 12:34Z, to cut tokens): only Rioja and its three zones get full guides in v1; Green Spain and Castilla y León are the first content releases after v1. Fact sheets for all 68 and the climate layer stay in v1; the 14 Pago boundaries are still fetched. His go covers the restart and the atlas, reference and quiz releases (3 to 5, order set 12:43Z); the rest waits on a re-run estimate. [O]
- **No hand-written guided tours in v1.** The Rioja lesson (#4) moves to later. [O, follows from "place guide" over "guide plus tours"]

## The map
- **Default**: satellite on, with the atlas drawn over it (coast, rivers, towns, serif labels, DO boundaries strong enough to read on imagery); one button switches to the plain atlas base, which also works offline. [O, 16 Oct 2026 08:10Z: "It should be satellite on, but the DO colours should pop a bit more"]
- **Imagery** (owner, 16 Oct 2026 10:09Z): Esri World Imagery through a free ArcGIS developer key (the look of the round 3 mocks), not the keyless endpoint and not EOX alone. The builder proves it loads on the owner's Mac before any release. [O]
- **Terroir layers**: 3D terrain, plus a Spain-wide climate layer you can switch on. Soil stays in the card and guide, because no open soil map is fine enough to teach from [R]. [O]

## Navigation is the place tree (owner, 16 Oct 2026, after the first-principles check of round 3)
- Explore opens on the **Spain card**: the ten study regions in course order, each with its colour (the map's legend) and known count. A region opens the **region card** (its places with their state, "continue here"), a place opens the **place card**, then the **guide**. Every card carries a clickable breadcrumb (Spain › Castilla y León › Toro). No region dropdown; search finds regions, places, towns and grapes. The light/dark toggle sits under the Atlaslope wordmark. [O]
- The mastery map marks places due today and shades a known parent by its zones. [O]
- Round 3 review: /mnt/project-files/atlaslope/reviews/2026-10-16-first-principles-review-mocks-3.md.

## Screens and modes
- **Home**: the map, with a floating "today" card (what's due, the place to continue, a guide to read). [O]
- **Explore**: tap a place to get the card, which opens the full place guide.
- **Quiz**: find it on the map, what is this (four choices), and the fact question. Spaced memory per place, misses link back to the guide. [O, earlier decisions]
- **Progress**: a mastery map, with the map shaded by how well you know each place. [O]

## Quiz rules (owner, 16 Oct 2026, flow sketch cards)
- **Intake**: five new places a day (was "a session"; default from the plan review, 16 Oct), in course order, on top of what is due. [O]
- **Mastery shades**: new (never asked), learning (asked), known (right twice in a row, a day apart; was "right on the last two tries" until 17 Oct, see "Known needs two days"), solid (three spaced passes in a row, days apart). A miss drops a place back. [O]
- **Zones**: enter the quiz pool only once their parent appellation is known. Until then they show on the map and in guides. [O]
- **Course order**: the Spanish Wine Scholar sequence through the ten study regions, north to south, drives "continue" and intake. [O]

## Out of v1 (later, in the backlog)
Elevation profile #3, mock exam #7, progress sync #8, Rioja guided tour #4, producers, other countries. [V issues]

## What this means for the mocks
- **Still valid** (round 2.2): the find-it question, choices, fact question, results, and the Explore card style.
- **New screens to mock**: the today card on home, the place guide, the mastery map, the climate layer, and the atlas base as default with the satellite switch.
- **Retired as v1 screens**: the Rioja lesson (05) and the elevation profile (06). They stay as references for later.
- **Separate from scope**: the live site shows a grey map, most likely a tile bug [A]. Diagnosing it needs a look-only test on the owner's Mac.

## When building restarts
Start from scratch on what this thread decides. The old app code and the old development plan are not a base to patch. [O, 16 Oct 2026: "throw the old stuff basically away and start from scratch"] Kept: the `data/` folder with `data/SOURCES.md` and its data tests, plus the repo rules (CLAUDE.md, agent roles). Binned: the app code and the old development plan. The mocks stay as a visual reference only. [O, card "Keep data only"]

## Risks
1. **Writing.** Fact sheets and why lines for 68 DOs plus zones are the real cost, and a wrong fact teaches a wrong answer.
2. **Competition.** "Worldwide for wine lovers" is SommGeo's ground. Atlaslope stays worth building only while the quiz and the depth beat it.
3. **Over-built scaffolding.** Building world scaffolding before France exists can over-engineer. Keep it to the place tree and per-country level names.

## Build decisions, round 1 (owner, 16 Oct 2026 10:30Z, cards in the project chat)
Building does **not** start yet. The owner wants all key decisions cleared first, through an interview by angle (product, usability, content and data, code standards and platform, hosting and accounts, privacy, quality, cost, growth). Answers land here as they come. [O]
- **Question types get harder by box**: a new place asks "what is this" (four choices), learning and known ask "find it", solid gets the fact question. [O] *Superseded 12:38Z: the fact question starts at known; see "Quiz first principles".*
- **Vinos de Calidad** (Cebreros and the other four) join the quiz once their region's core places are known, like zones. [O]
- **Order of new places within a region**: north to south. Regions themselves keep the course order. [O]
- **Altitude and climate facts**: from the pliegos, gaps filled from IGN relief and the Köppen map and marked "measured". An AEMET climate overlay is a later idea, not v1. [O]
- **Satellite fails to load**: show the plain atlas with a note ("Satellite didn't load, showing the atlas"). Never a black map. [O]
- **Live site**: release 2 stays up as it is until release 3. [O]
- **ArcGIS key**: the owner creates it later, after the decisions are cleared. [O]
- **Long-term**: Atlaslope lives fully online under its own domain. Nothing runs from the owner's Mac. [O]
- Still open from round 1: release check on the Mac (decision 31), Safari storage and accounts, the session cap.
- **Accounts** (10:37Z): later, built in. No sign-in in v1; progress stays in the browser with a save-to-file button, and the storage layer is built so sync (#8) can plug in later. [O]
- **Own domain** (10:37Z): bought and connected before release 4 (the quiz), so progress never resets in a move. Paid, so bought only on the owner's word; names proposed in the product round. [O]
- **Hosting** (10:37Z): GitHub Pages, with the own domain pointed at it (free HTTPS). No server code. [O]
- **Release map check** (10:38Z, replaces decision 31 as proposed): after each deploy a GitHub workflow opens the live site in a real browser with real network and fails if satellite or terrain is blank; the owner also glances at map releases on his iPad or Mac. Data downloads move to GitHub Actions too, the Mac only as fallback if GitHub can't reach the Spanish servers [A, untested]. [O]
- **Devices** (10:38Z): the owner quizzes on the web (browser). Progress lives per browser; the save-to-file button moves it until sync. [O]
- **Session cap**: the hard cap is withdrawn (owner: "a cap feels stupid if you want to study for a few hours straight"). Replaced by two open cards: rounds of 20 with "Keep going", and more than five new places a day on request.
- **Rounds of 20** (10:39Z): due places come in rounds of 20, most overdue first; after each round the score and Keep going or Stop. No limit on rounds. [O]
- **More new places** (10:39Z): yes, on request. Once nothing is due, "Learn 5 more" adds the next five (north to south), as often as wanted; the app shows how many reviews that adds tomorrow. [O]

## Build decisions, round 2: product (owner, 16 Oct 2026)
- **What Atlaslope is not** (10:41Z, moved from the old product brief): not a tasting-note, cellar or wine-finder app; not a replacement for the Wine Scholar Guild course (public data, own wording; WSG and WSET course structure (which places, how they are grouped, what the exam asks) guides coverage, their text, maps and images are never used; owner card 17 Oct 2026); not a business (free for the owner and friends, no payments or comments); not a one-stop shop on day one, one region at a time. **Change:** sharing is allowed: a link to a place or a map view can be sent to a friend (the URL carries the place and view). [O]
- **Goals** (10:41Z, moved from the old product brief; goal 1 replaced 12:38Z, see "Quiz first principles"): 1) after three sessions the owner places 40 of the 68 core places on the map (session one versus session three); 2) the owner opens the quiz every week without a reminder. Measured from release 4. [O]
- **Visibility before v1** (10:45Z): link only. Anyone with the link can open it; robots.txt and a noindex tag ask search engines not to list it. [O]
- **Friends** (10:45Z): invited at v1, after release 7. Releases 3 to 6 are tested by the owner alone. [O]
- **Language** (10:45Z): English only, official place names, all interface text in one strings file. [O]
- **Domain name** (10:45Z): to be decided by the owner. Hard deadline: bought and connected before release 4. Shortlist offered: paraje.app, paraje.wine, paraje.es (availability unchecked [A]). [O]

## Build decisions, round 3: usability (owner, 16 Oct 2026)
- **After an answer** (10:46Z): a right answer moves on after one second; a miss shows the tap, the right place and one why line, then waits for Next. [O]
- **Find-it precision** (10:46Z): a tap inside the boundary or within a finger's width (about 44 px on screen) outside it counts as right. [O]
- **Misclick undo** (10:46Z): after a miss, "That was a slip" undoes it once and the question is answered again; the place stays marked shaky (it does not move up a box from that question). [O]
- **Quiz map** (10:46Z): Explore keeps the tilted 3D view; a quiz question shows the map flat, north up, framed on the study region. [O]
- **Offline** (10:46Z): once opened, the app, atlas base, quiz, facts and guides work without internet (service worker, Home Screen app); satellite and 3D terrain need a connection and fall back to the atlas with the note. [O]

## Build decisions, round 4: content and data (owner, 16 Oct 2026)
- **Zones in v1** (10:47Z): Rioja's three zones only (data exists). Priorat's villages and other zones come later as data releases with no code change. [O]
- **Fact question** (10:47Z): asks only exam facts: main grapes, wine styles, level (DO or DOCa) and climate. Altitude and soil stay on the fact sheet, never asked. [O]
- **Grape names** (10:47Z): local name with the main name, "Tinta de Toro (Tempranillo)", everywhere; search finds either. [O]
- **Guides** (10:47Z): as the Rioja mock guide: about 600 to 800 words, a three-minute read, plain and curious, wine-lover first, exam terms explained the first time. [O]
- **Report a mistake** (10:48Z): a link on each fact sheet opens a prefilled email (place, row) to an address the owner chooses; separate from his own. Address still to be named by him (likely on the new domain). [O]
- **Keeping data current** (10:48Z): a yearly reminder issue to check for new or changed DOs and regulations and refresh what changed. [O]
- **Photos** (10:48Z): yes, photos in v1. Open-licence only (Wikimedia Commons public domain, CC BY or CC BY-SA), credited on screen and listed in data/SOURCES.md; never WSG or unlicensed images. Count and selection: see the follow-up card. [O]

## Build decisions, round 5: code standards and platform (owner, 16 Oct 2026)
- House rules (stand unless the owner objects): strict TypeScript, automatic formatting and lint in CI, every change through a PR with green tests and a ReviewBot review, the most tests on the quiz engine. [A]
- **Browsers** (10:50Z): Safari, Chrome, Edge and Firefox from the last two years, iPadOS 17 and later; tested on Safari and Chrome. [O]
- **Speed** (10:50Z): the map is usable within 3 seconds on home Wi-Fi; a build check fails if the download (satellite and photos excluded) grows past about 2 MB. [O]
- **Interface toolkit** (10:53Z): React (after a Preact versus React comparison; size cost about 2% of the budget, larger ecosystem, builders' fluency, React Native path). MapLibre driven directly. [O]
- **Library updates** (10:51Z): Dependabot opens one grouped update PR a month, security fixes at once; a thread merges it once CI is green. [O]
- **Photos per place** (10:51Z): up to three (landscape, vineyard, village), about 200 photos; gaps allowed where no good open photo exists. Claude picks and licence-checks, the owner can swap any. Photos load online only. [O; picker [A]]

## Build decisions, round 6: privacy, quality, cost, growth (owner, 16 Oct 2026)
- **Error reports** (10:52Z): errors go automatically to a free error service (Sentry free tier [A], EU data region, no personal data, no session replay). Needs a short privacy note in About and an account the owner creates when the build reaches it. Replaces "no third-party scripts" in decision 20 for this one service. [O]
- **Running cost** (10:53Z): up to €100 a year, domain included. A paid extra inside that budget (e.g. email for the report address) doesn't need a separate question; it is named in the plan or brief and logged. The owner still creates accounts and pays himself; anything above €100 a year is asked. [O]
- **Token brake** (10:53Z): a release that runs 50% over its token estimate pauses and asks the owner. Estimates are re-run in the brief to include photos, offline and error reporting. [O]
- **Next country** (10:53Z): decide later; v1 does not depend on it. Claude's pick when the time comes: France (open INAO AOC boundaries [R]). [O]
- **Analytics** (10:53Z): yes, real usage analytics, not just a counter ("doesn't have to be simple"). Tool: see the follow-up card. The privacy note in About covers analytics and error reports. [O]
- **Analytics tool** (10:54Z): PostHog, EU cloud, free tier, cookieless (memory persistence), no names or emails sent. Wired in from release 4. The owner creates the account when the build reaches it. [O]

## Waiting on the owner before or during the build (16 Oct 2026, end of the interview)
1. **"Go"** to start building from the builder brief.
2. **Domain**: atlaslope.com bought by the owner (12:19Z); he points it at GitHub Pages in release 3, when the ArcGIS key is created. atlasslope.com optional, not bought.
3. **Accounts he creates when the build reaches them**: ArcGIS key (release 3), Sentry and PostHog (release 8).
4. **Report-a-mistake address**: named before release 4, which ships the fact sheets (likely on the new domain).

## One-way doors check (owner, 16 Oct 2026 10:58-10:59Z)
- **Name** (12:08Z): the app is renamed **Atlaslope** (atlas + slope; the owner's own idea), replacing Atlaslope before any domain is bought. Address: atlaslope.com, with atlasslope.com as a redirect for the misspelling. Both free on .com, .app, .wine and .eu when checked 16 Oct 2026 [V]. No brand called Atlaslope found in a web search [V]; "Atlas" is common in wine (Atlas Wine Co, Atlas Peak AVA), low risk for a free app [A]. All 205 names checked: paraje/naming/name-candidates.md. [O]
- **Writing licence**: code MIT, the owner's writing all rights reserved, repo public. [O]
- Defaults set in architecture-decisions.md #41 to #44: stable ids, overlapping places, an answer log, resized photos in git. [A]
- **Phasing** (11:02Z): releases 3 to 7 are the core for the owner; a release 8 "ready for friends" carries Sentry, PostHog, the privacy note and the offline shell, before friends are invited. [O]

## Quiz first principles (owner, cards in the "Cutting the build cost" thread, 16 Oct 2026 12:37 to 12:38Z)
- **Knowing a place means where it is and what it makes.** Every answer reveals the place with one fact from day one; from known (right twice on the map) the fact question is asked too. Replaces "solid gets the fact question". [O]
- **Show, then ask.** A new place first gets a short intro (map, name, one why line and its fact), then its first question. The intro is new UI and is mocked before it is built. [O]
  **Spaced, not back to back** (owner card "Space it out", 17 Oct 2026 18:09Z, after "it shows me the region and then immediately asks what it is"): new places are shown in a batch of up to five intros in a row, then each is asked later in the same round, mixed with other questions, never on the next screen. Defaults: batches of five, three other screens at least between two screens about one place where the round allows it. [O; numbers A]
- **Rounds are shuffled** (owner card "All of them", 17 Oct 2026 18:15Z): what a round asks is picked as before (due first, most overdue first), but the order inside the round is shuffled, so places learned together do not come back in the same sequence. A miss is asked again at the end of the round unless that would be the very next screen; a miss on the last question waits for its next review. [O]
- **Goal 1:** 40 of the 68 core places known after three weeks of use, read from the answer log, measured from release 5 (the quiz; release order changed 12:43Z). Weekly use without a reminder stays goal 2. [O]
- **Practise any mix** next to the daily round (owner, 12:39Z: "it should not just be a set curriculum in a specific order"): pick whole regions or single places, for example Rioja, Toro and Priorat, and 10 or 20 questions; question type by box; a miss drops the place, a right answer before it is due does not move it up. The 2.2 setup mock is reworked to that picker. [O]
- **The engine works on sets of places, not a fixed list.** The daily round, practice and new-place intake each take a set picked from the place tree; one memory per place is shared by all of them. Course order is the default for "what's next", not a rail. [O, 12:39Z]
- **Focus** (12:39Z): the learner can set a focus (say Rioja and Ribera del Duero); the five new places a day come from the focus first, then course order resumes. [O] Default: a focus place without its fact sheet yet reveals the place only, until release 5. [A]
- **Two doors on the Quiz screen, one engine** (owner, 12:40Z, "a few streams"): **Study** (the exam stream: the daily round through the curriculum in course order, spaced memory, focus pulls chosen areas forward) and **Review** (the review stream: "practise any mix", for double-checking or study reference). Both share one memory per place. The mock exam (#7) stays a later third door. Door names are a mock-round default. [O; names A]
- **Study include list** (12:41Z; moved after v1 by the owner, card, 12:49Z): Study covers only the areas ticked (all by default); counts and the 40-place goal use only those. Left-out areas stay on the map and in Review. [O]
- **No points, streaks, badges or reminders.** What's due and the mastery map are the only progress shown. [O]
- Default: "find it" gives tiny places (Alella and the like) a tap area of at least 44 px. [A]

## Learning engine (owner, cards, 16 Oct 2026 12:41 to 12:42Z)
- **Boxes for v1**: fixed gaps (1, 3, 7, 14, 30 days), matching the four shades. Every answer is logged (#43), so an adaptive model (FSRS) can replace boxes later by replaying the log. [O]
- **Known needs two days** (owner card, 17 Oct 2026; replaces "right on the last two tries" of 16 Oct): a memory is known after two right answers in a row, the second at least a day after the first; solid stays three such days. Two rights in one sitting (Review) no longer count. [A: card open 17 Oct 18:16Z, built on the recommended option]
- **No level question** (owner card, 17 Oct 2026): the fact question asks grape, style or climate, not the level, because 68 of the 73 Study places are a DO and "DO" was nearly always right. [A: card open 17 Oct 18:16Z, built on the recommended option]
- **Two memories per place**: "where it is" (map questions) and "what it makes" (fact questions) each have their own box and schedule. A place shows as known on the mastery map only when both are known; the fact memory starts at the intro. [O; shade rule A]
- **Right or wrong only**, no confidence rating; "That was a slip" stays. [O]
- **A miss drops one step** and the question comes back at the end of the same round, then on its new schedule. [O]
- **Mixed-up pairs** (moved after v1 by the owner, card, 12:49Z; every answer is logged, so pairs can be built from the log later): when you tap one place for another, the pair comes back together (as distractors and in the same round) until you answer both right twice. [O; "twice" A]

## Explore as reference (owner, 16 Oct 2026 12:42Z: "This is very important")
- Explore is the reference mode, next to the Study and Review doors: tap an area and dive in (Spain, region, place card, guide) for the fact sheet, photos and fly-there buttons. The place model keeps the empty producer slot so top producers and other information can be added later without a rebuild. [O]
- **Order** (12:43Z): Explore is filled with all 68 fact sheets and the photos (release 4) before the quiz is built (release 5). [O]

## Network for build threads (owner, 16 Oct 2026 12:46Z)
- **Allow the sites**: the owner adds a cloud environment for the project with the Spanish government, Wikimedia, Natural Earth, Köppen and Esri hosts allowed, so build threads fetch, read and test directly. Whatever is fetched is still committed to the repo. Host list: reviews/2026-10-16-first-principles-review-builder-plan.md, finding 1. [O]

## Release 4 follow-ups (owner cards, 16 Oct 2026 19:31-19:38Z)
- Empty main grapes are filled from planted-area figures (most planted = main), cited, before release 4 ships; places without figures stay empty. [O]
- Release 4.1, right after release 4: a "How it tastes" row (colour, nose, palate) from the official documents' wine descriptions, the famous styles each document defines, and the famous producers above. [O]
