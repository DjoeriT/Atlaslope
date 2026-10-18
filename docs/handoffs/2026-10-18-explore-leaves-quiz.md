# Explore leaves the quiz behind (18 Oct 2026)

**Done.** Issue #71. "Back to the quiz" shows only on the place card opened from the quiz (`backTo` in `src/app/App.tsx`).
The quiz stays mounted out of sight once opened, so leaving it by the Explore tab, browser Back or a place card pauses the round,
and the Quiz tab picks it up. The Today card's start button resumes a paused round instead of replacing it (`src/quiz-ui/QuizScreen.tsx`).
Escape in Explore ignores a hidden End round prompt. New UI tests: `tests/ui/quiz-leave.spec.ts`; `quiz-map.spec.ts` now looks at the visible card.

**Decided.** Leaving the quiz pauses rather than discards the round (coordinator default, reversible).

**Open.** Whether the Today card on the Explore home (approved mock 10) should stay; asked on a card in the thread.
Goes live as release 18 on "publish release 18" (mastery map moves to 19). Tester note: `Review/release-18-what-to-test.md`.
