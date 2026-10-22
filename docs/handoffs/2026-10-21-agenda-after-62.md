# After release 62: tour fixes, reports, Learn, tour B, next country (21 Oct 2026)

Long LeadBot session (far past 150K; builders here were capped at 60 turns, a fresh session gets 120). Release 62 is the latest tag.

## Done [V]
- Release 62 (PR #175): map tour fixes (stop picked by its own link, phone strip 300 px, geology at zoom 10+, English rock key).
- Merged after 62, not yet released: #176 faster loop (`npm run shots:tour`, builder 120 turns), #177 404 page and credit fix,
  #179 speed wins (DEM 512 tiles, relief from zoom 7, tours from 6, one JSON fetch cache), #178 register watch
  (`Tools/guides/watch_register.py`, 83 of 106 places have register changes after our newest cited source).
- Reports (this PR): `Review/qa-sweep/report.md`, `Review/perf/report-first-principles.md`, `Review/guides-current/`, `Review/launch/`,
  `Review/study-plan/`, `Review/story-build/review-first-principles.md`, `Review/portugal/`, `Review/countries/` (France, Italy,
  Germany, and `compare.md` with one cost basis).
- Mocks (this PR): `Review/mock-study-start/` (Learn start, round 2, approved "Build it"), `Review/mock-tour-wow/` (map tour options).
- Not committed (too big, local only): screenshot folders `Review/qa-sweep/*.png` (38 MB) and `Review/story-build/fp-shots/` (31 MB).

## Decided (owner, 21 Oct 2026)
- Tours stay hand-made; no default-tour generator ("I want them to feel special"). Replaces the generator line in
  `2026-10-21-map-tours.md`'s brief.
- Superseded the same evening by `2026-10-21-tour-v3-restore.md` (B dropped; v3 journey back).
- Map tour direction **B** (`Review/mock-tour-wow/README.md`): calm guide map (one view per section, read stop lights up, photo card
  in a map corner, flies only on a tapped link) plus "Fly the tour" restoring the release 59 full-screen tour (StoryView). The guide
  stays the default; a big "Fly the tour" entry with a photo sits at the top of the guide, plus the small one in the map band.
- "Study" becomes **"Learn"** (screen name; code folder `src/quiz` stays). CLAUDE.md "Vocabulary" and `docs/glossary.md` change in the Learn PR.
- Learn: one course setting (All of Spain, Spanish Wine Scholar, WSET Level 3 · Spain, WSET Level 2 · Spain), the course filters
  everything; default all of Spain; Cava and Catalunya in without the map question; next a WSET Level 2 · Spain pilot (8 places),
  why cards by a script plus his spot-check of 10; a small Spain-wide set after the pilot.
- Launch: **wine lovers first** (reverses 17 Oct "students first"); quiet launch, then testers; 3-5 people before analytics; measure
  Esri first; add a tip link (needs his account); noindex until the public step; English only.
- Speed: static page shell; service worker after the speed fixes; no CDN now; three simple CI checks.
- Guides current: "Checked on" plus source dates; pilot on 3 places (Rioja, La Mancha, Priorat); Pagos get a manual yearly look;
  register script runs locally only.

## Open
1. Release 63: started on his word, 21 Oct (tester note PR #181; the tag is the record).
2. **Learn build** on `claude/study-course` (pushed, no PR): 31 of 75 places need checked square crops (crop test must cover Learn
   photos); UI specs that assert "Study"; new specs (intro vs returning, course filter, `#learn`); glossary; CLAUDE.md vocabulary;
   tidy `Doors.tsx` indent; build, `Tools/check.sh`, shots; ReviewBot on copy; show him; PR. Report: `Review/learn-start/card.md`.
   His calls: rename "Study region" and "The wine study atlas"? (About letter is his.) Risk: an old open tab maps new course ids to all of Spain.
3. **Tour B build** (brief below).
4. **Next country:** reports recommend Portugal first, then France, Italy, Germany (`Review/countries/compare.md`). Not answered.
5. Later: Learn step 2 (WSET 2 why cards, pilot Rioja and Jerez); guides-current pilot; speed part 2; launch prep (home and About
   copy for wine lovers, tip link, privacy note, PostHog and Sentry, Esri measurement, noindex); the other 11 hand-made tours after B.

## Brief: map tour B (paste into a fresh session)
```
You are LeadBot for map tour option B (#148). Read docs/handoffs/2026-10-21-agenda-after-62.md ("Decided", "Open") and
Review/mock-tour-wow/README.md and design-check.md; the mock is Review/mock-tour-wow/index.html (2.9 MB, grep only) and
https://claude.ai/artifact/Mi2PNUfEFojLA2v9WWqHxB. Build on Rioja and Priorat:
1. Guide map (A): one camera view per section framing its stops (no flight on the reading line), the stop being read lights up
   with a pulse, its photo card in a map corner (desktop) or small inset (phone 300 px strip), fly only on a tapped stop link.
2. "Fly the tour": restore the release 59 full-screen tour (git show release-59:src/story/StoryView.tsx and its route/styles),
   opened from a big entry with a photo at the top of the guide and a small button in the map band; "Back to the guide" returns
   to the same place. Photo in every stop card; slow flights as in release 59.
3. Check live stop 1 (21 Oct capture kept the map on northern Spain).
Open for him: stops with no photo of their own (no card, or the section photo?). Every shown photo needs a checked crop for its
frame (crop sheet). Tour data keeps its 150 KB per-tour limit. Card per step, one builder at a time; npm run shots:tour for each
stop with imagery counts; ReviewBot (new copy and screen); desktop and phone shots to him before the PR; merge on green CI; then ask
about the release. Estimate [A]: 0.6-1.2M helper tokens, mostly re-reads; hard stop at 1.5x.
```

## Brief: Learn finish (paste into a fresh session)
```
You are LeadBot for the Learn start card (#147). Read docs/handoffs/2026-10-21-agenda-after-62.md ("Open" item 2) and
Review/learn-start/card.md. Branch claude/study-course is pushed; merge main in (never rebase). Finish the list in item 2, ask him
the two naming questions up front, ReviewBot on the copy, shots to him, then one PR with this handoff's Learn part closed.
```
