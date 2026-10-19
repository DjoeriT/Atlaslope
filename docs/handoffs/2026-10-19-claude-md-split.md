# CLAUDE.md split: local vs cloud (19 Oct 2026)

First session run locally on the owner's Mac (Claude desktop app, Code tab).

## Done
- `CLAUDE.md` keeps what applies everywhere and names the roles (LeadBot, BuilderBot, ReviewBot, AnalystBot). Cloud-only lines moved to
  `docs/env-cloud.md`; Mac-only facts are in `docs/env-local.md`, loaded through the git-ignored `CLAUDE.local.md` (one import line).
- `docs/AGENT_ROLES.md`: coordinator row says there is none locally; LeadBot keeps `docs/PROJECT.md` current (not PROJECT_CONTEXT);
  "Pace" pointer fixed to "Token budget"; hosted plan paths replaced by the repo handoffs; spend log no longer says "none yet";
  mock drafts can live in the scratchpad; the rules retro has an owner when only local sessions ran.
- Canarias handoff: release 50 corrected to release 49 (its note is `Review/release-49-what-to-test.md`).
- `.gitignore`: `CLAUDE.local.md` and `/mocks/`.
- Token route for Meseta (owner 19 Oct): `docs/PROJECT.md` "Run a region locally" rewritten (sources by script, one headless
  run per place, 2-place pilot, batches of ~8, one PR per batch); CLAUDE.md gains "loops are scripts", quiet commands, the ~80K call-out
  and "answers never just before a decision box".
- Local setup [V]: Playwright Chromium installed; `pdfplumber` in a git-ignored `.venv`.

## Decided
- [O] Meseta runs on the script route; the per-sentence Opus check stays. Estimate ~12-15M [A] until the pilot measures it.
- [O] Split CLAUDE.md by environment; locally the session works as LeadBot with AGENT_ROLES read by section.

## Open (owner)
- Branch protection on `main`: locally the `gh` login is admin and `main` is unprotected; only the rules stop a direct push.
- Release digests: the rule asks for one per big release, the last is release 7. Keep, or drop the rule.
- Locally, may test runs go to the background instead of a Sonnet subagent ("never wait on your own tools")?
- `.env.local` with the Esri key: the owner fills it in for local satellite imagery.
- `docs/OWNER-RULES.md` is the verbatim hosted text; any change there is made in the hosted project by the owner.

## Where
Branch `claude/claude-md-split`.
