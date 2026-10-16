# Hand-off from the mocks thread (closed 16 Oct 2026)

## What exists
- Round 2.2 mock-ups: nine screens on a real MapLibre map. Repo `public/mocks/atlas-v2/` (served at djoerit.github.io/Paraje/mocks/atlas-v2/ from release 2), `Review/mock-atlas` symlink, Mac `~/Developer/Paraje/mocks/atlas-v2.2/`, project files `/mnt/project-files/paraje/mocks/atlas-v2.2/`, artifact https://claude.ai/artifact/JeJ5f4keNeUsQcmCqdPBp6 (satellite blocked there by design of the host). README in the folder lists what is real, schematic and open.
- Rounds: 1 hand-drawn (rejected, low fidelity), 2 real map (approved, "pretty cool"), 2.1 after a 24-finding review, 2.2 three new screens per the boundary decision: fact question (03c), Rioja lesson (05, issue #4), elevation profile (06, issue #3), on the ten SWS study regions. Each round had a fresh-eyes review; all findings fixed before the owner saw it.
- Generator: Python in the mocks thread scratchpad (`gen2.py`, `pages22.py`, `realdos.py`, `profile.py`, `app.js`, `app.css`); not in the repo. If a future thread needs to regenerate, copy them into `Tools/mocks/` first.
- Taxonomy check: `/mnt/project-files/paraje/reviews/2026-10-16-taxonomy-check.md`. Ten regions from `data/dop-overrides.json`; Bierzo under Castilla y León; 68 core DOs, 5 VC secondary, Pagos out.
- Releases: release 1 (mocks plus app shell) published from this thread on a card choice; PRs #2 and #6. Tag pushes must run on the owner's Mac (cloud proxy refuses tags). Release 2 was triggered by the owner's words in this thread and handed to the setup thread.

## Decisions taken by the owner here
Paper atlas look; one map, two modes; four-choice answers; real map not hand-drawn; Google Earth feel; chrome follows system light/dark; "Merge and publish" release 1; "Publish release 2".

## Open items for whoever picks up the mocks
1. Lesson hand-off: the find-it quiz is mocked for DOs; the lesson ends on "tap where each stop is" for places and landforms. Needs the owner's yes or a reworded ending (release 6).
2. Lesson facts (altitudes, dates) are the author's; source-check against `data/SOURCES.md` material before build.
3. Rotate and tilt hint: owner could not find how to change the angle. Build adds a visible hint and a draggable compass.
4. Drawing a profile line is tap-only; keyboard route in the build (release 7).
5. Region palette is muted on purpose and fails the strict categorical validator; identity comes from boundaries and labels. Revisit only if the owner asks.
6. Mocks retire from the site per release that ships the screen (boundary decision).
