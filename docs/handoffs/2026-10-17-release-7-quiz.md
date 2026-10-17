# Handoff: release 7, the quiz (planned as release 5, issue #13), 17 Oct 2026

## Done
- Engine (`src/quiz/`, pure TypeScript): answer log replayed into two memories per place (`where`, `what`), boxes 1/3/7/14/30 days,
  shades, Study plan (five new a day, focus first, course order, zones after their parent), rounds of 20 with re-asks and Keep going,
  Review rounds on any set, the slip. Progress store (versioned record in localStorage, migration, two-tab merge, damaged-record copy,
  file save and load with Undo). Question making (what is this, find it, fact: main grape, famous style, level, Köppen climate).
- Screens (`src/quiz-ui/`): Study and Review doors, focus, practise any mix, new-place intro, find it and four-choice questions, the
  reveal (map frames answer and pick), "That was a slip", back to the quiz from a place card, round end, Today card on Home, progress
  file screen, web app manifest. Map quiz mode in `src/map/quiz.ts` (names hidden, flat, 22 px tap tolerance, zones tappable).
- Mocks `Review/mock-quiz-v4/` (owner approved, card 17 Oct 05:44Z), design check and code review with all findings fixed.
- Checks: 185 unit and 43 UI tests, `Tools/check.sh ui` green, 1.35 MB gzipped.

## Decided
- LeadBot rulings in the digest: a miss drops one box (min 0) and is due after that box's gap, so the in-round re-ask moves nothing;
  a place's shade follows `where`, capped by `what`. Vinos de Calidad only in Review. A place first seen in Review counts toward Study's five.
- Issues renumbered: #14 guides is release 8, #15 mastery map and climate release 9, #16 ready for friends release 10.

## Open
- Main grape can be asked for 46 of 73 places (30 sheets lack one, issue #29).
- Manifest has no icons (none in `public/`). Long official names (Txakoli) make long choices; the names come from `places.json`.
- Not verified: Safari, iPad, large text on a device, satellite under the quiz. The quiz screens will take the new "listing" style later.

## Where things are
Digest `Review/release-7-digest.md`; cards `Review/release-7-card-*.md`; reviews `Review/release-7-mock-design-check.md`,
`Review/release-7-review.md`; tester note `Review/release-7-what-to-test.md`; plan and estimate in project files `atlaslope/release-7/plan.md`;
spend `Review/agent-spend-log.md` (agents 0.61 M against 0.66 to 1.25 M).
