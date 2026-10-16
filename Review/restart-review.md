# Restart review (a300a8f): MERGE AFTER FIXES. 0 blocker, 3 should fix, 4 note
Ran: Tools/check.sh ui in a git-archive copy: all pass (7 unit, data ledger, build, no debug flags, 1 UI placeholder) [V].
Hooks run with sample JSON [V]: narrow-read blocks data.js, maplibre-gl.js, data/*.geojson, *.tif (also with limit), allows src/data/foo.ts and SOURCES.md; context-after-release fires on `gh workflow run publish`, `git push origin release-N`, workflow_id publish.yml, silent on other commands.
## Should fix
1. publish.yml:5-15 no guard on the ref the workflow runs from. A dispatch from a claude/ branch uses that branch's publish.yml, so a modified copy could skip the "on main" check and tag/deploy. Fix: `if: github.ref == 'refs/heads/main'` on every job (or first-step check). [R]
2. publish.yml tag job precedes build/deploy. If build or deploy fails, release-N exists with nothing live, and rules forbid re-pushing/deleting tags, so N is burned and deploy.yml cannot be re-triggered. Fix: build and deploy first, tag last (tag after deploy succeeds), or document "burn N, next number" in SKILL.md B.3. [R]
3. CLAUDE.md:85 cites `src/debug.ts` (does not exist, src/ has only dops.ts). Reword as "when the app has debug flags". CLAUDE.md:30 `~/Developer/Paraje/mocks/` is Mac path, fine; SOURCES.md:41 `src/basemap.ts` is a future file, mark as planned.
## Notes
- GITHUB_TOKEN-pushed tag does not trigger deploy.yml (documented GitHub behaviour), so no double deploy [R, not run]. Both share concurrency group `pages`; a third queued run cancels the pending one, harmless.
- Tag job's checkout/inputs are passed via env, not interpolated into run: no injection; regexes are strict (^[1-9][0-9]*$, 40 hex) [V read]. Permissions are least-privilege per job (write only in tag, pages/id-token only in deploy).
- Any older ancestor of main can be published (is-ancestor only); consider requiring commit == origin/main head if intended.
- check.sh "Typecheck" prints nothing on success, fine; Debug-flag grep is vacuous until an app exists.
## Brief items verified [V]
Rename done (README, CLAUDE.md, package); repo paths /Paraje/ kept (vite, playwright); NOTICE.md present, README licence section; src/ reduced to dops.ts (needed by kept data test); no data.js/maplibre in Review/mock-atlas-v3; data/, SOURCES.md, ci/deploy, .claude kept; no stale refs to public/mocks or development-plan in live docs (only in dated handoffs/Review, acceptable). No contradiction found between CLAUDE.md, AGENT_ROLES.md, SKILL.md and README on branch/merge/publish/tag rules. Not checked: PROJECT_CONTEXT/scope content, mock-atlas-v3 visuals.
