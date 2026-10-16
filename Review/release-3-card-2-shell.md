# Release 3, card 2: the app shell

    Goal:        Opening the site shows the Atlaslope frame from the approved mock (top bar, wordmark menu with the theme toggle, search box, Explore · Quiz · Progress) in light and dark, link-only, within the download budget, and a deploy proves the live map loads.
    Task:        Set up React on Vite with strict TypeScript and build the frame, strings file, first-run screen, debug flags, size check and the live map check workflow.
    Role/model:  BuilderBot (Sonnet)
    Budget:      150k; stop and report at ~70% or after two failed tries
    Branch:      agent/builder/r3-shell (worktree)
    Context:     Review/release-3-digest.md (all); Review/mock-atlas-v3/assets/app.css lines 1 to 62 and 186 to 249; app.js lines 201 to 221; 15-explore-spain.html (top bar); 17-first-run.html
    May edit:    package.json, package-lock.json, tsconfig.json, vite.config.ts, index.html, src/main.tsx, src/app/, src/strings.ts, src/debug.ts, src/styles/, public/robots.txt, public/fonts/, Tools/check.sh, .github/workflows/live-map-check.yml, tests/ui/placeholder.spec.ts
    Must not:    print or commit the Esri key; add any network service; touch src/tree/ or src/map/ beyond an empty mount point
    Tests:       Playwright on the built site: frame renders, theme toggle switches and persists, Quiz and Progress disabled with a label, first run shows once then not with ?fresh=1 resetting it, noindex meta present; check.sh fails if dist/ contains "?fixture" or "fresh=1" handling, or if the gzipped download (excluding imagery) passes 2 MB
    Done when:   Tools/check.sh ui green; live-map-check.yml runs after the publish workflow (workflow_run) and on demand, opens the live URL in Chromium, waits for map idle and fails if no satellite tile and no terrain tile loaded (network responses), with a screenshot as an artifact
    Report:      300 words in the final message; [V]/[R]/[A]
    Stop and ask if: a dependency other than react, react-dom and their types is needed; anything outward
