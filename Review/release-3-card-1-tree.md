# Release 3, card 1: the tree model and search index

    Goal:        Every screen can walk Spain › study region › place › zone, and find a place or region by name, from one tested model over data/places.json that a second country joins with data only.
    Task:        Write src/tree/ (plain TypeScript, no React, no map): load and validate places.json, expose the tree, breadcrumbs and a search index.
    Role/model:  BuilderBot (Opus): the tree model is named as complex work in the brief.
    Budget:      250k; stop and report at ~70% or after two failed tries
    Branch:      agent/builder/r3-tree (worktree)
    Context:     Review/release-3-digest.md ("Decisions that apply", "Data"); tests/unit/places.test.ts; src/dops.ts lines 1 to 40
    May edit:    src/tree/, tests/unit/tree*.test.ts, tests/fixtures/places-two-countries.json
    Must not:    change data/, other tests, or anything outside the files above; add React or map code to src/tree/
    Tests:       unit tests: ids unique and slug-shaped; every parent exists; levels match the country's level names; counts (69 core, 6 vc, 31 none, 3 zones; ten study regions in course order); breadcrumb for a zone (Spain › Rioja region › Rioja › Rioja Alta); children of a region in course order then north to south; alsoWithin resolves; a two-place fixture country loads with no code change; search finds "toro", "Rioja Alta", "castilla" (accents and case folded), regions before places on equal match; npm test green
    Done when:   API covers: getPlace(id), children(id), regionsOf(country) in course order, placesInRegion(regionId), breadcrumb(id), levelName(place), search(query, limit); invalid data throws with a message naming the place
    Report:      300 words in the final message; [V]/[R]/[A]
    Stop and ask if: the data contradicts a decision in the digest, an existing test fails
