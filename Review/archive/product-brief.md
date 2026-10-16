# Wine World: product brief (draft 2, Spain first)

Written 15 Oct 2026 from the brainstorm in the thread "Set up the new iOS app". Tags: [O] the owner said so, [A] an assumption to confirm, [R] from memory, not re-checked.

## The person and the job
A wine nerd who has finished WSET (level 3 or diploma) and is starting a Wine Scholar Guild course: Spanish Wine Scholar first. [O]
The job: learn the geography of wine well enough to pass, and well enough that it stays. Where is the appellation, what sits under it, why does the wine taste the way it does. They study at a desk or on a sofa with an iPad, in sessions of 20 to 60 minutes, over several months. [A]

What they use today: the WSG's own course maps and manual, the World Atlas of Wine, GuildSomm maps, Wine Folly, and flashcards (Anki, Brainscape). [R] Flashcards test recall but not place. Printed atlases show place but don't test. Nothing does both on one screen.

## What Wine World is
An interactive atlas and study tool. Zoom from a country to a village. Toggle layers: appellation boundaries, soil, elevation, climate, landscape photos. Then test yourself on the same map: point to it, name it, say what's under it.

One line: the wine atlas that quizzes you. Name: Paraje, a named vineyard site (owner, 15 Oct 2026).

## What it is not (for now)
- Not a tasting-note app, cellar app or wine finder. Vintro's job stays Vintro's. [O]
- Not a replacement for the WSG manual. It uses public data and its own wording; it never copies WSG material.
- Not a business. Free for the owner and friends [O]. No accounts, payments, comments or sharing in the first version. Consequence: licensing only has to allow non-commercial use, hosting stays on free tiers, and polish is for us, not for a store listing.
- Not "one stop shop" on day one. That's the destination, and it's reached one region at a time. [A] worth saying out loud: breadth kills this kind of product early, because thin coverage of twenty regions is less useful than one region a student can rely on.

## Platform
Web app, desktop and iPad first, phone usable but secondary. [A] Reasons: study happens on a big screen next to course notes; one build runs everywhere; links to a map view can be shared; no App Store gate. An iOS wrapper is possible later if the App Store matters.
Consequence: the iOS setup drafted earlier (TestFlight, Xcode, Swift package) is replaced by a web setup. Still carried over: all the ways of working, Git as the record, agents, one check script, mocks before code.

## The first slice (what "done" looks like for version 0.1)
Country: Spain [O], because the Spanish Wine Scholar course comes first. Spain has about 70 DOs plus the two DOCa (Rioja, Priorat) and the Vinos de Pago [R]. The SWS exam leans on locating DOs and knowing what sits under them, so the slice is two levels deep rather than one region:
1. Map, whole country: every DO boundary, grouped by the course's macro-regions (Green Spain, the Ebro valley, the Duero, the Mediterranean, the Meseta, Andalusia, the islands [A: check against the SWS syllabus]). Elevation and climate layers for the whole country, since altitude and the Atlantic-to-Mediterranean gradient are the terroir story of Spain.
2. One region deep: Rioja [O]. Rioja gets its three zones, soil types (clay-calcareous, ferrous clay, alluvial), the Ebro and the Sierra de Cantabria, and landscape photos. Why Rioja: it's the biggest chapter in the course, the zones and soils are well documented, and the owner can check it first-hand. Priorat has the more dramatic terroir (llicorella) and is a good second.
3. Atlas panel: click a DO and see its facts (region, level, main grapes, climate, soil, notable sub-zones).
4. Quiz: three question types on the map: "find X", "what is this?", "which macro-region, climate or soil?". A session of 10 questions, score, misses shown on the map afterwards.
5. Progress: right and wrong per DO, stored in the browser (no account).

## Decided (owner, 15 Oct 2026)
- Spain first, Rioja as the deep region. Priorat next.
- Free for the owner and friends; not a business.
- Read-and-test only in version one; no personal notes.
- Atlas and quiz together from day one.

## Context
A niche audience (WSG students, a few thousand a year [A]) with a real, time-bound need and money already spent on the course. The owner is one of them, so taste and correctness can be checked first-hand. No competitor combines map and test.

## Upside (measured where possible)
Nothing is measurable yet; there is no product. What we can measure from day one, in the first slice:
- Can a student locate 40 named Spanish DOs on the map after three sessions? (Baseline: the owner's own score on session one versus session three.)
- Does the quiz get used more than once a week by the owner, unprompted? If not, the "opened twice" problem is real and the product is a reference, not a study tool.
What this slice does not improve: anything outside Spain, sub-zone detail outside Rioja, mobile use, and anything the WSG course itself teaches better (grape varieties, winemaking, tasting).

## Risks
- Data: boundaries, soil and photos come from scattered public sources with different licences and accuracy. The first slice will show how bad this is. Mitigation: one country, one deep region, sources recorded per layer, licences checked before use.
- Cost: map tiles and hosting cost money at scale; free tiers cover a personal project. Every paid service needs the owner's go.
- Scope creep: "one stop shop" invites building everything. The brief's "not for now" list is the guard.
- Legal: the WSG's materials are copyrighted. Facts aren't, but their wording and maps are. The content must be ours or openly licensed.

## Effort
First slice (all Spanish DOs, Rioja deep, three layers, three question types, local progress): several weeks of part-time building, most of it data, not code. [A] A concrete estimate comes after a one-day data scouting spike: find and check sources for Spanish DO boundaries (the Ministry of Agriculture and the regional governments publish geodata [A]), elevation, climate and Rioja soils, and report what exists under what licence. That spike is the proposed next step.
