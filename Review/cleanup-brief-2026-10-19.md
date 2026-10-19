# Brief: repo cleanup after the move to local (19 Oct 2026)

For a fresh local session (LeadBot, `docs/env-local.md`). Found by the CLAUDE.md-split session; handoff
`docs/handoffs/2026-10-19-claude-md-split.md`. Small slice: no screen, data or content. Budget: under 300K tokens; stop at 450K and report.

## 0. First
- Merge PR #129 if CI is green (docs only, no ReviewBot). If CI is still queued (GitHub Actions was degraded on 19 Oct), say so and go on.
- Ask the owner the decisions below in **one batch** (tap-to-pick, recommended option first). Everything here is outward (GitHub), so
  nothing runs before his answer.

## 1. Dependabot PRs #84, #86, #87
Found [V]: #86 typescript 5.9→7.0, vite 6.4→8.3, vitest 2.1→5.0, @types/node 22→26; #87 maplibre-gl 4.7→6.14, react/react-dom 18.3→19.3;
#84 GitHub Actions checkout/setup-node 4→7, upload-pages-artifact 3→5, deploy-pages 4→5, upload-artifact 4→7.
- Recommended: close #86 and #87 with a comment pointing to a new issue "Major upgrades: React 19, MapLibre 6, Vite 8, TS 7, Vitest 5" (label
  `logic`, proposed priority `later`; ties in with the globe intro that needs MapLibre 5). Merge #84 on green CI only; if CI fails, close it into the same issue.
- Alternative: leave all three open.

## 2. Merged branches on GitHub
Found [V]: 66 remote branches fully merged into `main`, plus `mocks-atlas-v2` (its one commit is in `main` by content).
- Recommended: delete those 67 remote branches (list with `git branch -r --merged origin/main`, recheck before deleting; never `main`,
  never a branch with an open PR, never tags). Turn on the repo setting "Automatically delete head branches".
- Alternative: leave them.

## 3. `claude/data-step-8glnhu`
Found [V]: 9 commits not in `main` by content, last 16 Oct "Spend log: Urbezo review measured (#18)". Linked to issue #18 (Vinos de Pago outlines).
- Recommended: read only `git log --stat origin/main..origin/claude/data-step-8glnhu` (no file contents), tell the owner in 3 lines what it
  holds and whether `main` already covers it another way; keep the branch until he decides.

## 4. Issue grooming
Found [V]: 20 open issues. Stale release numbers in titles: #48 ("QA round after release 10", `now`), #16 ("Release 18"), #15 ("Release 17").
No labels or no priority: #96, #101, #103, #106, #108, #126, #127. `docs/PROJECT.md` "Open issues" still lists closed #57 and misses #126, #127, #48, #16.
- Recommended: one table to the owner: issue, proposed kind/actor labels, proposed priority, retitle or close (with reason). He sets
  priorities; then apply his answers in one go and update the `docs/PROJECT.md` list in one PR.
- Read issue titles and labels with `gh issue list --json`; open an issue body only when the title is unclear.

## 5. Local only (owner's Mac)
`mocks/` (git-ignored) has a `_to_delete` folder. Owner's call; default: leave it.

## Done when
#129 merged (or stated as waiting on CI); each item above done per his answer or listed as not done with the reason; one docs PR for the
PROJECT.md issue list; handoff `docs/handoffs/<date>-cleanup.md`; cost reported in re-read vs new tokens.
