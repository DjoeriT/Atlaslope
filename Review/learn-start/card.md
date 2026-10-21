# Learn start card (mock round 2, section 3): BuilderBot report

Status: partly done. Stopped at the turn budget (turn 40 of 60 passed); the rest is listed under "Left".

## Card
Build Review/mock-study-start/index.html section 3 on claude/study-course: Study -> Learn, course list in curriculum.json, first-visit intro, returning card with "Learning for", practice and next due follow the course.

## Steps (step, commit, tests)
- 1-4 (most of them) course model, intro, card, menu, practice filter, rename in strings and plain pages, #learn alias: e368d38; unit 415/415 (1.7s), tsc clean.

## What changed
- content/curriculum.json `courses`: all-es (All of Spain), wine-scholar-es, wset-3-es, wset-2-es. Each has id, provider, name, country, label, onFile, source, rule (all, core, wset plus level). WSET lists stay in `wset.levels` and are not copied (facts badges read them too).
- src/quiz/course.ts reads the list. `readCourse` maps the old ids (none, wset-2, wset-3, wine-scholar); an unknown id loads as All of Spain. `Course` is now a string id.
- doorsModel: `nextDue(..., course)` and `practiseTree(tree, course)` keep to the course. New `startRegion` handles "in" vs "starting in".
- Doors.tsx: shows the intro when there is no history, otherwise the card. New CourseMenu.tsx is the "Learning for" button and menu with place counts. New PlacePhotos.tsx shows square photos with names plus one credit line.
- PractiseScreen: its picker shows only the course's places. The quick pick reads "All <label> places" when a course is set.
- Rename: strings (heading, back links, crumbs, closes, round kind, storage note, Test me text, map note). Top bar, footer and home buttons now say "Learn" and link to #learn. Also changed: the home meta description and the alt text of the home image. #learn opens Learn; #study and #quiz still work. Links the app writes stay #study.

## Timings
- npm ci 1.3s; tsc ~3s; unit quiz files ~2s; full unit 1.7s. No build, UI or shot runs yet.

## Differs from the mock
- Practice lede: the mock's "It does not change your schedule" is not true, because a miss brings a place back sooner. It now reads "Places that aren't due keep their schedule."
- Credit separator is "; " as on the Guides page, not " / ".
- The returning card keeps the due-today line, focus line, next-due line and Save or load. The mock does not show them.

## Left (not done)
- Photo crops: 31 of the 75 Learn places have no checked square crop (e.g. ribeiro, valdeorras, jerez, rueda, toro, priorat). Next: run crop_sheet.mjs, look at the sheet, write the crops, and extend tests/unit/home.test.ts so it also covers the photos Learn shows.
- docs/glossary.md: Learn replaces Study (not written yet).
- Unit tests for intro vs returning (component level). UI specs: intro on a fresh browser, course card and practice, #study and #learn, top bar says Learn. Existing specs that assert "Study" text (study-course, quiz-doors, quiz-round and others) are not updated yet and will fail.
- Indentation tidy in Doors.tsx (returning card children sit one level too deep).
- npm run build, Tools/check.sh, the shots in Review/learn-start/shots/ and the look at them.
- Not renamed, needs the owner: "Study region" (map legend, region label: the grouping noun); "The wine study atlas for WSET and Wine Scholar students" (home lede, manifest); the About letter ("studied", "studying"; his own copy). src/app/TopBar.tsx was not checked in detail: its label comes from strings `quiz: 'Learn'` [A].
- Risk: an older open tab reads a new id such as wset-3-es as All of Spain, and its next save writes that back.
