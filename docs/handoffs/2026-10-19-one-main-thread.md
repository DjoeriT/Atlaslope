# One main thread (19 Oct 2026)

**Done:** `CLAUDE.md` and `docs/env-local.md` now say one main thread, no side sessions, helpers are one-shot subagents. This PR also
carries the repo-cleanup handoff from #131, which had a conflict in the handoff index.

**Why:** the main thread started a Meseta pilot session, which started batch 1, plus a cleanup session. Every new session cold-read the
rules and every child turn woke its parent for a full re-read of its history. The owner called it a cloud-era setup and stopped it.

**State:** pilot, batch 1 and cleanup sessions archived. Release 50 (Meseta, 12 of 25 guides) is tagged on 06326d1.

**Open:** Meseta batch 2 (13 places), to run from the main thread with `Tools/guides/headless.py`.

**Also:** `Review/release-49-what-to-test.md` moved to `Review/archive/`.
