# Running locally (the owner's Mac)

Loaded only by a local Claude Code session, through the git-ignored `CLAUDE.local.md` (one line: `@docs/env-local.md`). Cloud threads and the
hosted coordinator never see this file; their part is `docs/env-cloud.md`. Checked 19 Oct 2026 [V] unless tagged.

## Role
- This session is **LeadBot** for its slice. There is no coordinator here: the owner and this session cover that part (what's open, memory).
- Read `docs/AGENT_ROLES.md` by section, not whole: "LeadBot" when starting a slice; "Task card" and "Token budget" before spawning.
- Helpers are the `builder`, `reviewer` and `analyst` agent types; builders run with worktree isolation and never push.
- One main thread does the work; follow-ups are listed in plain text, not started as side sessions. Long per-place runs are a script
  (`Tools/guides/headless.py`) the main thread starts. Before editing shared files, check open PRs and `gh run list` for other branches.

## Access
- `gh` is the owner's own login, with admin rights. `main` is protected (owner, 20 Oct 2026): PR only, `scope` and `check` must pass,
  no force-push or delete, admins included. The four `ui (n/4)` checks are not required yet: a docs-only PR reports one skipped `ui`.
  Only `CLAUDE.md` stops a self-publish or a tag move here (the cloud's safety check does not run locally). Keep to the release route word for word.
- Hosts load directly, including the ones the cloud is refused (mapa.gob.es, navarra.es, portalagrari.gva.es, INTIA, jumilla.wine, EU Cellar,
  Esri, IGN). The data workflows on GitHub Actions are no longer needed as a detour. Fetching stays limited to sources in `data/SOURCES.md`.

## Tools
- Playwright's own Chromium is installed (`npx playwright install chromium` again after a Playwright version bump). CI still runs the full
  UI suite; locally run only the specs your change touches.
- Homebrew's Python refuses `pip install`. `pdfplumber` lives in a git-ignored `.venv`: run `Tools/guides/unstrike.py` with
  `.venv/bin/python3`. Rebuild with `python3 -m venv .venv && .venv/bin/pip install pdfplumber`. The other guide scripts use plain `python3`.
- No workflow runner: `Tools/guides/region.workflow.js` does not run here. Regions use the local route in `docs/PROJECT.md` ("Run a region
  locally"): a script starts one fresh headless `claude -p` run per place (installed here) with `pack.py write|check|sheet`.

## Keys and files
- The Esri key is only in `.env.local`, which the owner fills in himself; check presence with `grep -c`. Without it the local map has no
  close-in imagery. CI and the live site take it from the repo secret.
- Map mocks that need live satellite go to `mocks/` in this folder (git-ignored), as one page, with its file:/// path.
- For a long run, ask the app to keep the Mac awake.
