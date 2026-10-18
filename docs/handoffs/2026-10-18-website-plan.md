# Handoff: website plan and home page mock (18 Oct 2026)

Thread "Website plan" (owner 10:47Z and 11:03Z: a persistent top bar, a home page that explains the tool, the tool as its own menu item).

## Done
- Plan `Review/website-plan.md`: site map, words, how (prerender static pages from the same React components on GitHub Pages), slices 2 to 5,
  Context, Upside, Risks, Effort (1.3 to 2.1 M tokens [A]).
- Home page mock `Review/mock-home-v1/` (`index.html` is self-contained; `gen.py` rebuilds it from `template.html`, the fonts in `public/fonts/`
  and screenshots of the current build). Earlier rounds, all superseded: v1 "Wikipedia-like", four flavours "messy", four skins, Salon book with a photo.
  They live in `/mnt/project-files/atlaslope/mocks/website-v1` to `-v3`, not in the repo.
- First-principles review `Review/home-mock-review.md`, benchmark of ten sites `Review/home-benchmark.md` (GuildSomm, Wine Scholar Guild, Wine Folly,
  Vinous, Decanter, Duna, Felt, Mapbox, Brilliant, Stripe Press; JancisRobinson.com and Wine-Searcher refused the cloud browser).
- Design check `Review/home-mock-design-check.md` (ReviewBot), findings fixed in the mock.
- Style sheet: a "Website pages" section; the stale "pills fully round" radius line now says small corners, soft buttons.
- Context: live line names release 20.

## Decided (owner)
- 11:09Z card: Google listing "decide later"; the site stays link-only (docs/scope.md:92).
- 11:11Z: "Quiz" becomes "Study" across the project. 11:12Z: each place page is its "guide"; the long read is its Terroir section.
- Top bar: logo (home), Atlas, Study, Guides, About, Search. No separate Home item.
- 11:20Z to 11:30Z: visual, premium, "less is more"; likes duna.com; picked the Salon book look.
- 11:34Z card: tagline "Know the land behind the glass." The sub-line was rewritten from his text.
- 11:39Z card: the map is the hero, not a photo. 11:47Z: source logos, not names. 11:49Z: soft buttons.

## Open
- Slice 2 (top bar, home, `/atlas/`, old-link forwarding, Quiz to Study) starts only on his go, in a fresh thread.
- Before the home page goes live: clean official logo files, and an OK from MAPA and IGN (the ministry mark carries Spain's coat of arms;
  the EU emblem may not suggest endorsement).
- "Exam-style questions" was dropped from the sub-line: Study is find-it and four-choice rounds today [V]. Revisit if real exam-format questions arrive.
- The hero shows the selected place as it is live (release 20). The mock's study screen still says "Quiz"; slice 2 renames it.
- Where: plan, mock and reviews above; artifact https://claude.ai/artifact/SSCWtptYLVjmrWn6MTWnQK; shared copies in `/mnt/project-files/atlaslope/`.
