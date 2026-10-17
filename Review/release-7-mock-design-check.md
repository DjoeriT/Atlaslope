# Quiz mock round (quiz-v4): design check, 17 Oct 2026

**Verdict: fix first.** 3 must-fix, 6 should-fix, 4 nit. Checked: all 10 pages read from the DOM [read]; page 24 miss state at 768x1024 light and 1024x768 dark, large text 20px [ran]; page 22 and 26 large-text overflow numbers [ran]. Not checked: dark on pages other than 24; keyboard order beyond DOM reading; click-through timing of the auto-advance.

## Must-fix
1. **24 (find it, reveal): the answer cannot be seen.** The map stays at whole-Spain scale; "Toro is the one outlined" points at a region a few pixels wide, and the card covers the lower map at 768 wide. Fix: on reveal, fit the map to the answer plus the picked place with padding clear of the card, and show the answer's name label on the map (names reappear on reveal only).
2. **22 (practise): the picker contradicts itself.** Rioja region is ticked but none of its four places is; Castilla y León is unticked while Toro is ticked; the Rioja count reads "1 places"; the button says "20 questions on 2 places" though Rioja plus Toro is more than 2 (and 20 on 2 places is odd). Collapsed regions show developer text "9 places (all listed in the build)". Fix: a region tick selects all its places, a partial tick shows the indeterminate state, counts use the real number ("1 place"), the button counts real places, and collapsed regions list their places. Also name the region "Rioja" and the place "Rioja" differently ("Rioja (whole DO)" or similar).
3. **23/24/25 (round header): the intro eats a question number.** Intro is "Question 7 of 17" and Find Toro is "Question 8 of 17", so one place uses two of the 17 and the dot row counts an intro as a question. The 17 in page 20 (12 due + 5 new) then does not match what a learner sees. Fix: the intro is not numbered ("New place · 1 of 5" only, dots stay on the last question) and its question takes the number.

## Should-fix
4. **24 miss after "I don't know":** "That was a slip" is offered, which makes no sense when the learner skipped. Fix: show it only after a wrong pick. Also the miss shows no why line (the settled rule); add Toro's one-line why under the answer.
5. **24 feedback text:** "It comes back at the end of this round" vs 26 "They come back tomorrow". Say both ("again at the end of this round, and tomorrow"), once, plainly.
6. **24 reveal controls:** Confirm turns into "Next question" in place, the same button holding two jobs; the tap target changes under the learner's finger. Fix: keep the focus order stable and move focus to the feedback block (live region) not to the button, so a screen reader reads the result first. "Stay here" cancels the timer but has no way back to auto mode; fine, but say "Next question" button is now needed (show it).
7. **26 vs 26b:** "Done for today" and "Stop for now" mean the same. Use one phrase on both. On 26, three buttons ("Learn 5 more", "Practise any mix", "Done") compete; keep "Learn 5 more" primary only when new places remain, else the primary is "Done for today". "Learn 5 more" after "New places 5 of 5" is not labelled as optional.
8. **20 (Review door):** "A miss still counts; a right answer before it's due doesn't move a place up" is engine jargon on the first screen. Plain: "Practise anything, any time. It won't change your schedule for places that aren't due." Check this does not contradict the digest (right before due = no change; a miss still drops a box).
9. **21 (focus):** "Rioja" is both a region chip and a single-place chip with the same name; two controls nearly the same. "Clear focus" undo notice sits in the scrolling body while the button is in the footer, so at large text (body 483px tall at 1024x768) the undo can scroll out of sight. Fix: put the undo line above the footer, outside the scroll area. "Save focus" and the Close X both leave; make Close ask nothing but say unsaved changes are kept or lost.

## Nit
10. 20b: "Next due: Monday, 9 places" is tiny grey note text (0.8rem, ink3) holding the only next-step info; promote to body size. "Or close the quiz..." names no close control.
11. All pages: `.note` 0.8rem at 20px root is fine, but at 1024 wide the foot takes 159px of a 644px card at large text on 22/24; shorten footer labels or stack the quiet action as a text link.
12. 24: an empty gap sits under "Find Toro" before the feedback (empty live-status row with min-height); collapse it after the answer.
13. 27: "Last saved: Never" has no hint what to do next beyond the footer buttons; add "Save a copy now". The load result shows an Undo but the file picker state (wrong file) is not mocked.

## Passed
44 px targets throughout (2.75rem rule), labels on map, zoom, close, remove and chip groups, `aria-live` on status, dark palette contrast looks fine on 24, dots have a text alternative, reduced-motion is handled for auto-advance.

## Settled owner rules
None of the fixes above change a settled rule. Fix 4 (hide "slip" after a skip) refines, not removes, the one-undo slip rule; confirm with the owner only if he meant slip to cover skips.
