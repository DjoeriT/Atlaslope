# Operations: rollback, incidents, keys

What to do when the live site breaks. Added 18 Oct 2026 (docs gap audit): releases happen often, and nothing said how to undo one.

## Rollback
The site is whatever commit the latest `release-*` tag points at. Tags are never moved or deleted, so a rollback is a new release.

1. **Fast (about 5 to 15 minutes, no code change):** find the highest tag N (`git fetch --tags && git tag -l 'release-*' | sort -t- -k2 -n | tail -1`)
   and the last good release's commit (`git rev-list -n 1 release-<good>`). Start the `publish` workflow with N+1 and that full hash.
   The workflow accepts any commit on `main` (it checks only that the commit is on `main` and the number is next), reuses that commit's
   earlier green checks if there are any or else runs them (about 5 minutes), deploys it and tags it `release-(N+1)`. The live map check runs after it.
2. **Then fix `main`:** `main` still holds the bad change. In a fresh `claude/...` branch, `git revert -m 1 <bad merge>` (or fix forward),
   PR, green CI, merge. That ships with the next release as usual. Never publish `main` before this lands, or the bad change returns.
3. Write it up as an incident (below).

Who may roll back: only on his words "publish release N", like any release (owner, 18 Oct 2026). When the live check fails, the thread
tells him at once with the commit it would publish, so he can say the words.

If the `publish` workflow itself is broken: say so and stop. Don't deploy by hand or push a tag (a hand-pushed `release-*` tag starts
the fallback `deploy.yml`).

## Incidents
An incident is anything that broke for visitors on a live release, or a near miss that would have. Each gets a short file
`docs/incidents/<date>-<topic>.md` in the PR that fixes it, and `CLAUDE.md`'s "a new rule names its incident" points there.

```markdown
# <date>: <what broke, in visitor words>
- Release: release-N (commit), found by: <owner / live map check / visitor>, at <time Z>
- Impact: what visitors saw, for how long
- Cause: the change and why tests didn't catch it
- Fix: rollback release and/or fix PR
- Rule or test added: <the test that now catches it, or the rule and where it lives; "none" with a reason>
```

How breakage is found today: the owner, and `live-map-check.yml` after every publish (and on demand). No error service yet
(Sentry and PostHog were decided on 16 Oct, `docs/architecture-decisions.md` #40 and #46, and are not built).

## Esri key
- Repo secret `VITE_ESRI_API_KEY`, baked into the build by Vite. It is visible in the page by nature; the protection is the referrer lock
  to `https://atlaslope.com` in the ArcGIS developer dashboard (decision #21, revised: `docs/architecture-decisions.md` "#21 referrer").
  So the satellite view only works on atlaslope.com, not on previews or local builds.
- **Build without the key** (local, CI, forks): with the variable empty, `createMap.ts` turns satellite off (PNOA included) and shows the
  atlas base with its note from the start (`hasImagery` in `src/map/createMap.ts`). UI tests use fixtures and never need it. Mocks in the cloud can set `VITE_ESRI_API_KEY=mock` and route
  tiles to the public World_Imagery server (see `/mnt/project-files/atlaslope/mocks/light-palette/sat.mjs`).
- **Rotate** (leaked to a place without the referrer lock, abuse, or yearly): the owner creates a new key in the ArcGIS dashboard with
  the same referrer lock, replaces the repo secret, and the next release carries it; then he deletes the old key. Only he holds the account.
- **Quota or abuse:** the free tier caps tile requests; if the dashboard shows use far above our visitors or tiles stop loading, rotate
  the key and tell him. Satellite failing falls back to the atlas base, so the site stays usable.
- Never print the key; check it exists with `grep -c VITE_ESRI_API_KEY .env.local`.

## Third-party hosts the live site calls
Only these see a visitor's IP address [V, 18 Oct 2026, from `src/`]: Esri (`ibasemaps-api.arcgis.com`, satellite), OpenFreeMap
(`tiles.openfreemap.org`, the atlas base), AWS (`s3.amazonaws.com`, Terrarium elevation tiles) and IGN (`www.ign.es`, PNOA orthophoto
in Spain). Photos and fonts are self-hosted. Adding a host means updating this list, `docs/privacy.md` and the CSP once one exists (planned, not built).
