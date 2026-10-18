# ReviewBot scope (18 Oct 2026)

- Done: one rule everywhere. ReviewBot runs only on PRs with a new screen, new or changed user-facing copy, or a licence or legal
  question; fixes, tweaks and docs merge on green CI alone. Updated `CLAUDE.md`, `docs/AGENT_ROLES.md`, `docs/scope.md`,
  `docs/PROJECT_CONTEXT.md`, `Review/builder-brief.md` and the PR template (which also lost its stale "small publishes itself" line).
- Decided: owner said "Yeah let's do that" to the coordinator's proposal (project chat, 17:56Z).
- Config: none needed. ReviewBot is an agent a thread starts, not a CI job or required check, so nothing to make conditional [V, grep of
  `.github/workflows/`]. The release skill never mentioned it.
- Open: nothing.
- Also in this PR (owner, 17:58Z): mockups are one HTML page with the before and after or all options (A / B / C / D), published as an
  Artifact with its link in the reply, never separate files. In `CLAUDE.md`, `docs/AGENT_ROLES.md` (Mocks) and `Review/visual-style.md`.
