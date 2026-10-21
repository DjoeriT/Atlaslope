# Study course setting (Study step 1, QA S2, S5): BuilderBot report

Status: partly done (code and unit tests in; UI specs, Tools/check.sh full and shots not run: turn budget)

## Card
Study step 1 from Review/study-plan/report-first-principles.md section 4 (course setting, Cava and Catalunya, why line), QA S2 and S5.

## Steps (step, commit, tests)
- 1-5 engine + UI + strings + data, one commit "Study: My course, Cava and Catalunya, guide why line, QA S2 and S5"; unit 391/391 green, tsc clean, build green.

## What changed
- `src/quiz/course.ts`: courses none, wset-2, wset-3, wine-scholar. WSET lists from content/curriculum.json; Wine Scholar = every core place (no Rioja zones). curriculum.json unchanged (no data needed).
- `studySet(tree, course)` and `PlanOptions.course` filter intake and due memories. Out-of-course places keep their memory and schedule but are not asked in Study (still in Review).
- Store: `course` added inside record version 1; a save without it reads as "none". No version bump on purpose: a bump makes an older open tab treat the record as newer and stop saving its answers. Old saves (v0, v1) load with every answer.
- `quizFindIt: false` on cava and catalunya (data/places.json, quiz "core", quizNote updated); `questionType(p, memory, findIt)` keeps them on "what is this". Place type gained the optional field (src/tree/types.ts, outside "May edit": needed for the flag).
- Reveal: after every answer, "From the guide" + the guide's lede (`revealWhy`). All 75 Study places have one (test). Lede length 68-311 characters: two sentences, not one line.
- S2: no history -> "Start with 5 places in <region>." instead of "Nothing due today".
- S5: "Read the <place> guide", underlined.
- Course control: one "My course: No course. Change" line that opens four radio choices (details/fieldset, 6px corners).
- Tests changed by the owner decision (not tuned): Study set 73 -> 75, core 70 -> 72, none 30 -> 28, the all-find-it round test.

## Timings
- npm ci 0.9s; tsc ~2s; unit quiz files 1.8-3.4s; full unit 4.0-4.3s; build 3.7s.

## Open points
- Not done: UI specs (pick a course, new-visitor text, miss link), Tools/check.sh full, shots in Review/study-course/shots/.
- `nextDue` on the Study screen still counts places outside the course.
- Lede as the "one-line why" is two sentences; owner may want only the second sentence or a shorter line.
- Cava/Catalunya now show as quizzed elsewhere (place page "Test me", region page list, cards): follows from quiz "core".
