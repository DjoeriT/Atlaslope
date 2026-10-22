# ReviewBot: Learn copy (PR #227)

Verdict: ship with fixes. Blocker 0, should fix 1, note 3. Read-only review: strings diff, curriculum courses, 3 screenshots (intro-phone, course-menu-phone, returning-desktop). Not run: the app; the other 3 screenshots; tests.

## Should fix
1. src/strings.ts:~345 (intro[1]) "When you miss one, it takes you to that place's guide so you can read why." Untrue of the code: nothing navigates. src/quiz-ui/RoundPlayer.tsx:244-246 shows the guide's why line after every answer, and on a miss adds a button "Read the X guide". Proposed: "When you miss one, it shows you why and links to that place's guide."

## Notes
2. src/strings.ts (intro[1]) "just before you would forget it" is a promise; the schedule only approximates it. Proposed softer: "Learn asks about each place again around the time you would forget it."
3. src/strings.ts practiseCourse: heading "Practise WSET Level 2 · Spain places" (shot returning-desktop) reads awkwardly with the dot. Proposed: `Practise the ${label} places`.
4. Phone intro (intro-phone.png): the sticky "Begin with five places in "Green Spain"" bar covers the third intro paragraph at first view. It scrolls, so not broken. Check that the sheet leaves bottom padding equal to the bar height.

## Checks
1. "Study" -> "Learn": confirmed (read). Remaining user-facing "Study" is only "Study region(s)" (strings.ts:25,27,93,107,206,280). The old "Study" in code comments, identifiers and the url keys (`study`, `quiz`) is internal. Home tagline untouched.
2. Claims vs code: course filter scope confirmed (read): studySet and the plan take `course` (plan.ts:74,82), and Doors passes it to the scope line (Doors.tsx:73). Practise "Places that aren't due keep their schedule" matches the old lede; the dropped "a miss brings a place back sooner" is a deliberate, honest cut. The guide claim is item 1. I did not verify the practice picker filter in code (inferred from the QuizScreen props).
3. House rules: no "X, Y and Z" lists found in the added strings (read). Counts as words and quoted study regions are consistent. Users see "AtlaSlope" in the shot header. Corners look 6px and there are no pills (the course chip and the menu are rectangles).
4. Phone shots: the layout holds (no overflow or clipping; the course menu fits, counts right-aligned 75/72/19/8). Satellite notice ignored as told.
