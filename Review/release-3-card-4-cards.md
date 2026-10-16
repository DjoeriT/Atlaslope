# Release 3, card 4: Spain, region and place cards

    Goal:        A visitor walks Spain › region › place and back with breadcrumbs, the map frames each step, and a copied URL reopens the same place and view.
    Task:        Write the three cards, the URL state and the Playwright walk.
    Role/model:  BuilderBot (Sonnet)
    Budget:      150k; stop and report at ~70% or after two failed tries
    Branch:      agent/builder/r3-cards (worktree, from the merged tree and map)
    Context:     Review/release-3-digest.md ("Defaults for gaps" especially); src/tree/ API; 15-explore-spain.html, 16-region-castilla.html, 14-explore-region.html; app.css lines 63 to 93
    May edit:    src/cards/, src/url.ts, src/app/ (wiring), tests/ui/, tests/fixtures/
    Must not:    show facts, photos, guide or test-me buttons (later releases); change src/tree/ (ask LeadBot)
    Tests:       Playwright with fixtures: Spain card lists ten regions in course order; click Rioja › Rioja › Rioja Alta and back by breadcrumb; search "toro" opens Toro; reload of a place URL restores the place and view; keyboard reaches every card control
    Done when:   check.sh ui green at desktop and iPad width, light and dark
    Report:      300 words in the final message; [V]/[R]/[A]
    Stop and ask if: a gap the digest does not settle
