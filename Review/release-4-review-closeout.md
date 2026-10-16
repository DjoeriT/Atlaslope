# Release 4 closeout review (PR #25)
Verdict: merge. Blockers 0, should fix 0, notes 2.

- CI concurrency [read]: group `ci-${{ github.event.pull_request.number || github.ref }}` is valid. On main, `cancel-in-progress` is `github.ref != 'refs/heads/main'`, which evaluates to false, so main runs are never cancelled. PR runs share a group per PR number and cancel older runs. Not run on GitHub.
- Docs claims [ran ls/git]: the named files exist (measure_places.py, photo_ship.py, place-measures.json, photos.json, content/sources.json, spend log, Review/sources/fetched, release-4-* reports). 149 photos in public/photos (matches). b5c773b is in the log as "Release 4 ... (#24)".
- Secrets [ran grep]: none in the diff.
- Note 1: tag `release-4` is not in the local clone (tags stop at release-3), so the tag claim and run 38958091012 are unverified here.
- Note 2: counts of 79 sheets, 77 places with photos and 0.84 M tokens not re-run; `content/facts` has 10 files (per region), consistent with the layout.
