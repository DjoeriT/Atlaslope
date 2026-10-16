# Release 3, card 3: the map

    Goal:        The Explore map looks like the approved mock: Esri satellite with the atlas drawn over it, DO colours readable on imagery, 3D terrain, and one map menu; when imagery fails the atlas base shows with a note.
    Task:        Write src/map/: MapLibre setup, sources and layers, DOM labels, the map menu and the fallback note, mounted in the shell.
    Role/model:  BuilderBot (Sonnet)
    Budget:      150k; stop and report at ~70% or after two failed tries
    Branch:      agent/builder/r3-map (worktree, from the merged shell)
    Context:     Review/release-3-digest.md (all); Review/mock-atlas-v3/assets/app.js lines 1 to 200; app.css lines 111 to 140 and 186 to 249; 11-layers-climate.html; src/dops.ts
    May edit:    src/map/, src/app/ (mount point only), tests/unit/map*.test.ts
    Must not:    open data/*.geojson (use jq or a script); add a second imagery source; switch the climate layer on
    Tests:       unit tests for the pure parts (layer list per menu state, colour per study region, the fallback decision); the UI tests from card 2 stay green with the fixture (no tile requests)
    Done when:   the menu toggles satellite, relief, boundaries (climate shown, off, labelled "coming"); a failed imagery load shows the atlas and the note; check.sh ui green
    Report:      300 words in the final message; [V]/[R]/[A]
    Stop and ask if: the key is missing at build time in CI; the mock and the digest disagree
