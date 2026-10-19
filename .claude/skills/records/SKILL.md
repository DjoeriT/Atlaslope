---
name: records
description: Bring memory and project documentation up to date with what this session did. Use when the owner asks "any update to memory or to project documentation?", "update the records", "/records", or at the end of a slice before the handoff.
---

# Update memory and project documentation

Source of truth: `CLAUDE.md` ("Done" means, Git, Memory rules in the system prompt). If they disagree with this file, they win; say so.
Lean: read with `grep -n` and line ranges, never whole files. One docs PR at most. No helpers.

## 1. What changed (from this session, not from memory)
List from the conversation and `git log --oneline origin/main -15`: merges, releases (latest `release-*` tag), owner decisions [O],
reversed rules, new or closed issues, incidents (something that went wrong and why).

## 2. Project documentation: check each, fix only what is stale
- `docs/PROJECT.md`: "Current state" (latest release and what it holds), "Key decisions" (each owner decision with its date),
  "Open issues" (new issues, what is next), "Open questions for the owner" (drop answered ones, add new ones). Grep the section headers,
  read only those lines.
- `CLAUDE.md`: only when an owner rule changed or an incident needs a rule; a new rule names its incident and date. Keep its line width.
- `docs/handoffs/`: the session's handoff exists, is listed in `README.md` there, and its "Open" part is current (close items done since).
- `docs/guides.md` + Format log: only when the guide format, source rules or checks changed.
- `data/SOURCES.md`: only when a data file, layer, photo or image method changed.
- `docs/architecture-decisions.md`: only for a structural decision.
- Decisions recorded on a GitHub issue stay there until their plan writes them into the docs; do not copy them twice.

## 3. Memory (`~/.claude/projects/-Users-djoeri-Developer-Atlaslope/memory/`)
Save only what the repo does not hold and what matters beyond this session: how the owner wants to work (feedback, with why),
who he is. Never repo state, decisions or rules (those go in the docs above; repo wins over memory). Update or delete a memory
that is now wrong or duplicated by the repo. Usually the answer is "no change", and that is fine.

## 4. Ship
Docs edits go on a `claude/docs-...` branch, one PR, merged on green CI (docs need no ReviewBot). Never push `main`.

## 5. Tell the owner (normal message, not before a decision box)
Per file: what changed in one line, or "no change" with the reason. Memory: what changed, or "no change" and why. PR link and CI state.
