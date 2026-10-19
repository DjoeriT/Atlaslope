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
- Share card keeps "The wine study atlas for WSET and Wine Scholar students"; home subline "Spain's wine places from above, and why each one
  tastes the way it does."; headline "Know the land behind the glass." About must not repeat the home page.
- Look: black band + champagne, white page, no dark mode, 6px corners, no pills, no drawn illustrations, owner's photos at their own aspect
  ratio. Detail: `Review/visual-style.md`.

## Current state (19 Oct 2026)
- Release 48 is live (tag `release-48`; `git tag -l 'release-*'` for the latest). Guides: 62 of 109 places [R]: Andalucía, Cataluña,
  Baleares, Ebro (11, PR #119) plus earlier ones (Rioja, Green Spain).
- In progress: Mediterranean guides PR (11 places) and Canarias guides PR (11 places), each in its own clone/branch; check `gh api
  repos/DjoeriT/Atlaslope/pulls` for their state. Left after those: Meseta, 25 places. Each region runs only on the owner's "use a workflow
  for X" (the sources step, then `region.workflow.js`).
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
  satellite deferred (#108). Per-sentence Opus check stays (Sonnet drafts need fixes on 36% of sentences).
- Models: Opus 5.5 main session; Sonnet 5.5 helpers. Sonnet re-reads at the same price as Opus, so a switch saves only ~20% [V].

## Cost lessons (measured)
- 17 Oct: 11 sessions cost $143 for releases 6-15; ~60% was sessions re-reading their own history (428M cached reads); agents were under 1% [V].
- 19 Oct audit: 485M tokens over 10 sessions, 97% re-reads [V].
- Guide cost per place [V]: Andalucía 2.6M; Cataluña ~3.1M all-in (12 guides ~37M, write step 20.1M vs 5-8M estimated); packs ~25K.
  Baleares workflow 0.42M per guide, but the session around it cost 14.7M re-read. Ebro (11 guides) ~10.4M re-read + 0.9M new, ~1.0M per
  guide all-in, one third of Cataluña. Use ~1.0M/guide for estimates, split re-read vs new.
- Four estimate overruns on 19 Oct: Cataluña write 20.1M vs 5-8M; re-check 8.5M vs 4-6M (a step was left out); copy fixes 7.9M vs 1.2-2M
  (~100 calls x ~70K); Guides-page fix 5.8M vs 1-1.5M (~45 calls x ~130K). Rule: estimate = calls x ~100K + work, count every step.
- A second Opus check finds ~7 misses per guide (patterns in `Tools/guides/CHECKER.md`). Pair agents ran long: re-read per guide 3x Baleares.

## Open issues (GitHub, DjoeriT/Atlaslope)
#57, #42, #83 (flaky Study tests), #96 (alt texts), #101 (travel flags), #103 (enrich guides from more sources), #106 (later guide ideas),
#108 (running/content costs, zoomed-out satellite), #29, #30, #18. Also: Cangas and Álava have no vineyard photos; Ribeira Sacra yield
conflict; Getaria/Cangas pliego versions; Navarra pliego unstamped (INTIA file). Website slice 3 (static guide pages, /spain/ index, share
cards, sitemap) only on his go, pilot 2 guides first (`Review/website-plan.md`). Later: globe intro (needs MapLibre 5, with France), Cmd-K.

## Open questions for the owner
- Home donation line asks for money with no way to give; About feedback email link is "later".
- Next region order after Mediterranean and Canarias (Meseta 25), and whether to approve a next country (France core ~2.5-3.5M [A], then re-measure).
- Safari, iPad, phone check and WSET-student testers (a Dutch invite draft was given 19 Oct): when?
- Offered, unanswered: "no handoff when 5 or fewer turns remain".
- Website slice 3 and Google indexing: go or wait.

## Where things live
`README.md` layout and commands; `docs/scope.md`, `architecture-decisions.md`, `guides.md` (guide format), `glossary.md`, `operations.md`
(rollback, incidents, keys), `privacy.md`, `AGENT_ROLES.md`, `PROJECT_CONTEXT.md`; `docs/handoffs/README.md` index of what each session did;
`Review/` briefs, mocks, tester notes, `visual-style.md`; `content/facts` fact sheets, `content/guides` guides; `data/SOURCES.md`;
`Tools/guides/` guide pipeline (`WRITER.md`, `CHECKER.md`, `pack.py`, `check_guide.py`, `usage.py`, `region.workflow.js`); `.claude/skills/release`.

## Run a region locally
1. Owner says "use a workflow for <region>". Pilot one or two places first and project cost from Ebro's ~1.0M/guide.
2. Sources step: put each place's pliego extract in `Review/guides-pipeline/<region>/` with a `manifest.json` (see `Tools/guides/extract.py`).
   EUR-Lex blocks scripts: use the Publications Office Cellar SPARQL on the CELEX number. Try hosts directly; refused ones via a GitHub Actions run.
3. Run `Tools/guides/region.workflow.js` with args `{ region, facts, places: [{id, source}] }`: per place one writer (Sonnet) from a
   packed brief, a machine check (`check_guide.py`), a per-sentence Opus check, then a ship step that applies the sure fact-sheet edits.
   Without a workflow runner, do the same by hand with one subagent per place, using `pack.py write|check|sheet`.
4. Watch `python3 Tools/guides/usage.py --budget`; stop at 1.5x. Swap "no guide" UI-test fixtures when a place gains a guide (Jumilla/Navarra
   style) and add the region's satellite view for the Guides page.
5. One PR on a `claude/guides-<region>` branch with the handoff and tester note; CI green; ReviewBot (new copy); merge; ask for release N.

## Run a release locally
1. Slice PR merged on green CI (it carries `Review/release-N-what-to-test.md` and the handoff).
2. N = latest `release-*` tag + 1. Follow part A of `.claude/skills/release/SKILL.md`, end with one line asking "publish release N".
3. Only after his typed "publish release N": start the `publish` workflow (`gh workflow run publish.yml -f release=N -f commit=<full hash>`
   or the Actions page; check input names in `.github/workflows/publish.yml`). It reuses the green main run, deploys, then tags.
4. Check the live site once. Rollback is publish again with the next number and the previous good commit (`docs/operations.md`).
