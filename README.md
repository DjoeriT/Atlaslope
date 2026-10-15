# Paraje

The wine atlas that quizzes you. A study tool for Wine Scholar Guild students, starting with Spain and Rioja.
Static web app: Vite, TypeScript, MapLibre GL, OpenFreeMap tiles. Free, no accounts, progress stored in the browser.

## Layout
    src/                 the app (map, atlas panel, quiz, progress)
    src/debug.ts         debug-only query flags (?fixture=, ?fresh=1); stripped from production builds
    data/                processed map layers and facts (GeoJSON, JSON); SOURCES.md lists origin and licence of every file
    tests/unit/          Vitest unit tests
    tests/ui/            Playwright UI tests (run against dist/ with fixtures, no network)
    docs/                PROJECT_CONTEXT.md (state, decisions), AGENT_ROLES.md (agents)
    Review/              plans, task cards, reviews, mocks (Review/mock-<topic>/), tester notes; Review/archive/ for finished ones
    Tools/check.sh       every check, one command
    .github/workflows/   ci.yml (checks on pushes to main), deploy.yml (GitHub Pages, on release-N tags)
    .claude/             agents, release skill, hooks, settings

## Commands
- Install: `npm ci` (Node 22). Playwright browsers once: `npx playwright install chromium`.
- Dev server: `npm run dev` (http://localhost:5173).
- Unit tests: `npm test` (`npm test -- tests/unit/quiz.test.ts` for one file).
- Build: `npm run build` → `dist/`.
- UI tests: `npm run test:ui` (builds first, serves `dist/`, runs Playwright with fixtures).
- Every check: `Tools/check.sh` (`quick` skips the UI tests and the build; `ui` adds the UI tests, always before a release).
- Debug query flags, dev builds only: `?fixture=<name>` loads `tests/fixtures/<name>.geojson` instead of `data/`; `?fresh=1` clears stored progress.

## Data
Every file in `data/` has an entry in `data/SOURCES.md`: source, URL, date fetched, licence, and the processing steps. Raw downloads stay
out of the repo (`data/raw/` is git-ignored); only processed, simplified files are committed. Attribution for each layer is shown in the app.

## Releasing (GitHub Pages)
Normally the owner runs `/release`. By hand:
1. `Tools/check.sh ui` green on `main`, clean working copy.
2. N = previous `release-(N-1)` + 1. Commit anything pending; push `main`.
3. `git tag release-N <commit>` and `git push origin release-N`. The deploy workflow builds and publishes to GitHub Pages.
4. Check the live site once. Update `docs/PROJECT_CONTEXT.md` section 5 and commit it on its own.

## Notes
- The site is free for the owner and friends, not a business. Licences in `data/SOURCES.md` are checked for non-commercial use with attribution.
- Nothing from the Wine Scholar Guild's own maps or study guides is used.
