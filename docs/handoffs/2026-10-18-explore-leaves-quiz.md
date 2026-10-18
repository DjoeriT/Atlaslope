# Explore leaves the quiz behind (18 Oct 2026)

**Done.** Issue #71. "Back to the quiz" shows only on the place card opened from the quiz (`backTo` in `src/app/App.tsx`).
The quiz stays mounted out of sight once opened, so leaving it by the Explore tab, browser Back or a place card pauses the round,
and the Quiz tab picks it up. The Today card's start button resumes a paused round instead of replacing it (`src/quiz-ui/QuizScreen.tsx`).
Escape in Explore ignores a hidden End round prompt. ReviewBot (`Review/explore-leaves-quiz-code-review.md`): any Explore move now ends the button, and a map tap from before is not replayed on resume. New UI tests: `tests/ui/quiz-leave.spec.ts`; `quiz-map.spec.ts` now looks at the visible card.

**Decided.** Leaving the quiz pauses rather than discards the round (coordinator default, reversible). Owner card "Once a day": the Today card on the Explore home stays away for the local day once closed or started (`atlaslope.today-closed` in localStorage, `src/app/App.tsx`).

**Open.** Nothing. Release 18 went to the polish pack, so this ships as release 19 on "publish release 19"; merge waits for the release-18 tag. Tester note: `Review/release-18-what-to-test.md`.
