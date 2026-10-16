# Atlaslope

The wine atlas that quizzes you. For passionate wine lovers first and exam students (WSET, Spanish Wine Scholar) second, starting with Spain.
Static web app: Vite, TypeScript, React, MapLibre GL, hosted on GitHub Pages (atlaslope.com from release 3). Free, no accounts, progress stored in the browser.
Renamed from Paraje on 16 Oct 2026; the repository keeps the old name for now.

**Restart, 16 Oct 2026.** The old app code was removed; the new app is built release by release from `docs/scope.md` and
`Review/builder-brief.md`. Until release 3 the site build is a placeholder page.

## Layout
    src/                 the app; today only src/dops.ts (applies data/dop-overrides.json to the DO layer)
    data/                processed map layers and facts; SOURCES.md lists origin, date, licence and processing of every file
    tests/unit/          Vitest unit tests (today: the data tests)
    tests/ui/            Playwright UI tests (run against the built site with fixtures, no network)
    docs/                scope.md, architecture-decisions.md, PROJECT_CONTEXT.md (state), AGENT_ROLES.md (agents), handoffs/
    Review/              builder brief, release digests, task cards, reviews, approved mocks (Review/mock-<topic>/); Review/archive/ for finished ones
    Tools/check.sh       every check, one command
    .github/workflows/   ci.yml (checks on pull requests and main), publish.yml (tags release-N and deploys), deploy.yml (fallback: deploy on a hand-pushed tag)
    .claude/             agents, release skill, hooks, settings

## Commands
- Install: `npm ci` (Node 22). Playwright browsers once: `npx playwright install chromium`.
- Dev server: `npm run dev` (http://localhost:5173).
- Unit tests: `npm test` (`npm test -- tests/unit/dops.test.ts` for one file).
- Build: `npm run build` → `dist/`.
- UI tests: `npm run test:ui` (builds first, serves `dist/`, runs Playwright).
- Every check: `Tools/check.sh` (`quick` skips the UI tests and the build; `ui` adds the UI tests, always before a merge or release).

## Data
Every file in `data/` has an entry in `data/SOURCES.md`: source, URL, date fetched, licence, and the processing steps. Raw downloads stay
out of the repo (`data/raw/` is git-ignored); only processed, simplified files are committed. Attribution for each layer is shown in the app.

## Releasing (GitHub Pages)
Releases start only with the owner's words "publish release N" (`.claude/skills/release/SKILL.md`).
1. The slice's pull requests are merged and CI is green on `main`.
2. Start the `publish` workflow (Actions › publish › Run workflow; works in the GitHub phone app) with N and the full commit hash.
   It checks the inputs (the commit is on `main`, `release-N` is new and next in line), runs `Tools/check.sh ui`, creates the tag and deploys.
3. Check the live site once. Update `docs/PROJECT_CONTEXT.md` section 5 through a pull request.

## Licence
Code: MIT (`LICENSE`). Writing (fact sheets, guides, quiz text, interface copy): all rights reserved (`NOTICE.md`).
Data files under `data/` keep their own licences, listed per file in `data/SOURCES.md`, and the app shows their credit lines.

## Notes
- The site is free for the owner and friends, not a business. Licences in `data/SOURCES.md` are checked for non-commercial use with attribution.
- Nothing from the Wine Scholar Guild's own maps or study guides is used.
