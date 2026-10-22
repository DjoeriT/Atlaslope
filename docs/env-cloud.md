# Running in the cloud or the hosted project

For cloud Claude Code threads and the hosted coordinator. A local session on the owner's Mac reads `docs/env-local.md` instead.

## Roles
- **Coordinator** (the hosted project chat): starts a thread per ask, keeps project memory, answers "what's open", proposes the fortnightly
  rules retro. Never edits the repo. Its instructions are `docs/OWNER-RULES.md`, verbatim.
- **Thread**: one piece of work; it is **LeadBot** for that slice (`docs/AGENT_ROLES.md`, section "LeadBot").
- Project files (`/mnt/project-files/...`) are a drafting workshop only; the repo wins.

## Limits of the cloud container
- `gh pr create` fails (GraphQL blocked): open PRs with `gh api` REST.
- Some hosts refuse the container (mapa.gob.es, navarra.es; portalagrari.gva.es pliego links 404). Use the Consejo Regulador copy or EU
  Cellar SPARQL; otherwise a GitHub Actions data workflow, or a session on the owner's Mac started by the thread that needs it.
- Playwright stays pinned to the version that matches the container's preinstalled Chromium.
- The cloud safety check refuses self-publishing; only the owner's typed "publish release N" starts the `publish` workflow anyway.
- Anything needing the owner's keychain or clipboard goes to a session on his Mac.
- Raw downloads live outside the repo, in `~/Developer/Atlaslope-raw/` (`ATLASLOPE_RAW` overrides it). A fresh container has none: `python3 Tools/data/refetch_raw.py --check`, then fetch only what the task needs (`--only`); hosts the cloud refuses are fetched on the owner's Mac.
