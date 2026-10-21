# Atlaslope

The wine study atlas for WSET and Wine Scholar students, and for passionate wine lovers, starting with Spain.
Static web app: Vite, TypeScript, React, MapLibre GL, hosted on GitHub Pages (atlaslope.com from release 3). Free, no accounts, progress stored in the browser.
Renamed from Paraje on 16 Oct 2026; the repository is DjoeriT/Atlaslope (renamed the same day; GitHub forwards the old URL).

## Start here (state on 18 Oct 2026)
- Live: the latest `release-*` tag on https://atlaslope.com . Planned numbers and what is in flight:
  `docs/PROJECT_CONTEXT.md` sections 5 and 6, and the open issues.
- Coverage: Spain (DOs, Vinos de Pago, Rioja's three zones); a guide (place page) for every place; its written Terroir section so far only for Rioja and its zones (`content/guides/`, folder name kept from release 10).
- Rules: `CLAUDE.md` (short) and `docs/AGENT_ROLES.md` (detail). Releases: `.claude/skills/release/SKILL.md`; records after a slice: `.claude/skills/records/SKILL.md`. Rollback, incidents, keys:
  `docs/operations.md`. Words: `docs/glossary.md`. Guides: `docs/guides.md`. Privacy facts: `docs/privacy.md`.
- Keep this section current in the slice PR that changes it.

## Layout
    index.html           the home page (plain HTML, no map); src/home/ holds its styles
    atlas/index.html     the atlas (the React app) at atlas/; it reaches public/ files through src/site.ts
    src/app/             shell: App, the site bar (TopBar.tsx), first run
    src/map/             MapLibre map: imagery, boundaries, climate colours, hover, focus, map menu
    src/cards/           floating cards on the map (place, region, Spain), search box
    src/pages/           place page and region page (photo mosaic, charts)
    src/quiz/            Study engine (code name quiz): questions, rounds, memory, progress store (no UI)
    src/quiz-ui/         Study screens: doors, round player, round end, Today card, progress file
    src/tree/            the place tree (country to zone) and search
    src/facts/           fact sheets and guides: types, formatting, checks
    src/debug.ts         debug-only query flags (?fixture=, ?fresh=1, ?noguide=<id>), stripped from production builds
    content/             fact sheets (content/facts), guides (content/guides: Terroir chapters by beat, optional sections), sources.json
    data/                map layers and facts; SOURCES.md lists origin, date, licence and processing of every file
    tests/unit/          Vitest unit tests
    tests/ui/            Playwright UI tests against the built site with fixtures (tests/fixtures), no network
    docs/                scope, architecture decisions, PROJECT_CONTEXT (state and history), AGENT_ROLES, handoffs/
    Review/              builder brief, digests, task cards, reviews, approved mocks (Review/mock-<topic>/), tester notes; Review/archive/
    Tools/check.sh       every check, one command
    .github/workflows/   ci.yml (pull requests and main), publish.yml (checks unless main already passed, deploys, tags release-N),
                         live-map-check.yml, data-*.yml (fetches the container cannot reach), deploy.yml (fallback)
    .claude/             agents, release skill, hooks, settings

## Commands
- Install: `npm ci` (Node 22). Playwright browsers once: `npx playwright install chromium`.
- Dev server: `npm run dev` (home http://localhost:5173/, atlas http://localhost:5173/atlas/).
- Unit tests: `npm test` (`npm test -- tests/unit/dops.test.ts` for one file).
- Build: `npm run build` → `dist/`.
- UI tests: `npm run test:ui` (builds first, serves `dist/`, runs Playwright).
- Screenshots: `npm run shots` builds the UI-test build and writes `shots/<view>-<size>.png` (home, atlas, rioja, study, question at desktop, ipad, phone; ignored by git).
  Filter with `--only home,study` and `--sizes desktop,phone`; `--no-build` reuses `dist/uitest`; `--url <base>` uses a running server.
  Needs the Chromium Playwright already has; a failed view logs one line and the run goes on (15 s per view, 3 min overall).
- Tour screenshots: `npm run shots:tour -- <id> [--sizes phone,desktop]` makes a normal build with map tiles on (network needed; the Esri key comes from `.env.local`),
  opens the guide with the tour open and shoots every stop in order. It writes `shots/tour-<id>-<n>-<size>.png` and a labelled contact sheet `shots/tour-<id>-<size>.png`.
  A stop whose imagery does not load in 30 s is flagged in the log and the sheet. About 1.5 min per size for Rioja; 6 min cap.
- Every check: `Tools/check.sh` (`quick` skips the UI tests and the build; `ui` adds the full UI suite, which CI runs in four parts on every PR; locally run only the specs you touched).

## Data
Every file in `data/` has an entry in `data/SOURCES.md`: source, URL, date fetched, licence, and the processing steps. Raw downloads stay
out of the repo (`data/raw/` is git-ignored); only processed, simplified files are committed. Attribution for each layer is shown in the app.

## Releasing (GitHub Pages)
Releases start only with the owner's words "publish release N" in the thread; the thread then starts `publish` (`.claude/skills/release/SKILL.md`).
1. The slice's pull request, with its tester note and handoff, is merged on green CI.
2. Start the `publish` workflow (Actions › publish › Run workflow; works in the GitHub phone app) with N and the full commit hash.
   It checks the inputs (the commit is on `main`, `release-N` is new and next in line), reuses the green `main` run for that exact commit
   (or the PR's green run when the merge changed nothing), or else runs `Tools/check.sh ui`, deploys, then creates the tag (only after a successful deploy).
3. Check the live site once. No records PR, and no "live" line to update: the tag is the record.
4. Undo a bad release: run `publish` again with the next number and the previous release's commit (`git rev-list -n1 release-<N-1>`).
   When a live check fails, the thread tells the owner at once and asks for "publish release N+1" with that commit.

## Licence
Code: MIT (`LICENSE`). Writing (fact sheets, guides, Study text, interface copy): all rights reserved (`NOTICE.md`).
Data files under `data/` keep their own licences, listed per file in `data/SOURCES.md`, and the app shows their credit lines.

## Notes
- The site is free for the owner and friends, not a business. Licences in `data/SOURCES.md` are checked for non-commercial use with attribution.
- Course structure from the Wine Scholar Guild and WSET (which places, how they are grouped, what the exam asks) guides what is covered; nothing of their text, maps or images is used, and facts come from official sources.
