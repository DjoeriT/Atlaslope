# Release 7 digest: the quiz (planned as release 5)

One page for every card in this release. Agents read this, the lines named here and their own card; never scope, decisions or the brief whole.
Covered by the owner's go of 16 Oct 2026 12:51Z [O]. Plan and estimate: about 0.95 M agent tokens (0.66 to 1.25 M), brake at about 1.65 M.

## What ships (brief, quiz row; scope "Quiz rules", "Quiz first principles", "Learning engine")
The quiz on the live map: find it, what is this (four choices) and the fact question; the new-place intro; the answer reveal with one
fact; rounds of 20 with "Keep going"; the Study and Review doors on one engine; "Practise any mix"; focus; results with misses linking to
the place; the Today card with something due and with nothing due; progress in this browser, versioned, with save and load to a file and
a Home Screen manifest. Out of v1 (owner, 12:49Z): mixed-up pairs, the Study include list.

## Engine rules (tags from the source; where scope and the older decisions page differ, scope wins)
- **Pool** [V, data/places.json]: 70 core, 6 Vinos de Calidad (`quiz: "vc"`), 3 Rioja zones (`quiz: "zone"`), 30 never asked (`"none"`).
- **Sets**: the engine works on any set of place ids. Study = the curriculum (all core places and zones, course order); Review = any set
  the learner picks (whole regions or single places, 10 or 20 questions). One memory store shared by both. [O]
- **Vinos de Calidad**: not in Study intake; asked in Review when the picked set contains them. [A, from the 2.2 rule "only in an All of Spain quiz"]
- **Two memories per place**: `where` (map questions) and `what` (fact question), each with its own box and due date. [O]
- **Boxes**: five, gaps 1, 3, 7, 14, 30 days. First right answer puts a memory in box 1. A right answer on a due memory moves it up one
  box (max 5); a right answer before it is due changes nothing; a miss drops one box (min 0) and is due after that box's gap (box 0:
  tomorrow). The re-ask at the end of the same round is therefore never due: it is logged, it moves nothing. [O; "first right = box 1" and
  the re-ask ruling LeadBot 17 Oct, A]
- **Shades** per memory: new (never asked), learning (asked), known (right on the last two answers), solid (three right answers in a row
  on three different days, each at least a day apart). Any miss drops it back from known or solid. [O] A place's shade follows `where`, capped
  by `what`: new while `where` is new; known only when both are known; solid only when both are solid; otherwise learning. [O; cap rule A]
- **Question type by memory**: `where` new → what is this (four choices); `where` learning or later → find it; `what` is asked only once
  `where` is known → the fact question. [O, scope 12:37Z replaces decisions #14: "solid gets the fact question"]
- **Show, then ask**: a place's first appearance is the intro (map, name, why line, one fact), then its first question in the same round.
  The intro starts the `what` memory's clock (it counts as seen, not as an answer). [O; clock A]
- **Every answer reveals** the place with one fact, from day one. [O]
- **Intake**: five new places a day in Study, from the focus first, then course order (study region order, then `courseOrder`, then
  `northSouth`). "Learn 5 more" takes the next five. Zones join intake only once their parent's `where` and `what` are known. [O]
- **Focus**: a set of study regions or places; intake takes new places from it first, then course order resumes. [O]
- **Rounds**: up to 20 questions: due memories first (most overdue first), then today's intake (intro then question). A miss is asked
  again at the end of the same round (once), then follows its new schedule. After 20, "Keep going" builds the next round from what is left;
  when nothing is due and intake is used, the round ends with "Learn 5 more" or "Practise any mix". [O; order A]
- **Review**: question type by box as above; a miss drops the memory (as in Study); a right answer before due does not move it. [O]
- **"That was a slip"**: once per miss, right after it; it turns the miss into a right answer for the schedule, and the log keeps both
  the miss and the slip mark. [O; log form A]
- **Answer log** (#43): every answer: place id, memory, question type, right or wrong, slip, time (ISO), seconds taken. Boxes, shades and
  due dates are computed by replaying the log, so the rules can change without resetting anyone. [O]
- **No points, streaks, badges or reminders.** What is due and the mastery map are the only progress shown. [O]
- **Right answers** move on after one second; misses wait with the why line (#35). Find it counts a tap within about 44 px outside the
  boundary; tiny places get a 44 px tap area. Quiz map flat and north up; only place names hide, rivers and towns stay. [O]

## Storage (#19, #43, #46)
One versioned record in localStorage behind one interface (so sync plugs in later); a migration step tested from an empty and from an
older record; save to a file and load from a file; a Home Screen manifest. Storage blocked: the quiz still runs for the visit and says
progress won't be kept. [O; blocked-storage wording A]

## Cards
| Card | Model | Files | Depends on |
|---|---|---|---|
| `release-7-card-1-engine.md`: memories, log replay, shades, due, intake, focus, zones, rounds, slip | Opus | `src/quiz/` engine files, `tests/unit/quiz-*.test.ts` | – |
| Card 2: storage (versioned record, migration, file save and load), question making (distractors, fact choices) | Sonnet | `src/quiz/store*`, `src/quiz/questions*` | card 1 |
| Cards 3 to 5: quiz screens, intro and reveal, doors and picker, Today card and Progress | Sonnet | `src/quiz-ui/` and the shell | card 2 and the approved mocks |

New UI (intro, reveal with fact, Study and Review doors, "Practise any mix" picker, focus) is mocked first in
`/mnt/project-files/atlaslope/mocks/quiz-v4/`, design-checked, and approved by the owner before cards 3 to 5 start.
