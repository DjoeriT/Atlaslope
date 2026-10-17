# Release 7 code review (ReviewBot, code review mode)

Diff e8a3f78..fc64668 (src, tests, public, index.html), checked out at fc64668.

**Verdict: merge after fixes.** Blockers 2, should-fix 4, nits 4.

Ran: `npx vitest run` 179/179 green, `npx tsc --noEmit -p .` clean. I also ran a throwaway probe test from the scratchpad (not in the repo) against `createStore`, `withoutReask` and `replay`. UI tests not run, as the card says.

## Blockers

**B1. Two open tabs overwrite each other's progress.** `src/quiz/store.ts:108-127`. *Confirmed (ran).*
`load()` caches `current` once per store. `save()` writes the caller's log to `KEY` without reading storage again, and nothing listens for the `storage` event.
- Steps: tab A and tab B are both open on Atlaslope (common on iPad, where Safari keeps tabs). Tab A plays a round of 20. Then tab B records anything, for example an intro's "Got it".
- What goes wrong: B's save replaces the stored log with B's stale log plus one entry. A's 20 answers are lost.
- Probe: A saved [x, y], then B saved [z]. A fresh store then loads `['z']`.
- Fix: in `save()`, read the stored record again before writing. If its log is not a prefix of the log being saved, merge the two logs by `at` (the entries are append-only; a slip only changes the last entry). Also add a `storage` listener in `useQuiz` that calls `reload()`. Add a unit test with two stores on one storage.

**B2. "That was a slip" on a re-asked miss removes the wrong item and breaks the round.** `src/quiz-ui/helpers.ts:44`, called from `src/quiz-ui/RoundPlayer.tsx:150-155`. *Confirmed (ran) for the helper; the UI path is inferred (read).*
The slip button shows on any miss that is not a skip, including a re-ask (`RoundPlayer.tsx:219`). `afterAnswer` adds no new re-ask for a re-ask, so `withoutReask` finds the **current item** and removes it.
- Steps: items are [A, B, A re-ask, B re-ask]. Miss A, then miss B. Miss the A re-ask and press "That was a slip".
- What goes wrong: item 2 is now the B re-ask, but `outcomes[2]` (A's slipped outcome) is attached to it. The question memo (`[index, tree]`) still shows A's question with B as the place. B's re-ask is never asked or logged, so the rule "a miss is asked again at the end of the round" breaks. If the slipped re-ask was the last item, the round ends at once and the slip's Undo can never be reached.
- Probe: after `withoutReask`, `items[2]` is `{"place":"B",...,"reask":true}` and the round has 3 items.
- Fix: pass `index` and remove only a re-ask *after* it (`i > index`). Add a test for a slip on a re-ask.

## Should fix

**S1. A damaged stored record is replaced with an empty one, silently.** `src/quiz/store.ts:111-114`. *Confirmed (ran).*
- What goes wrong: a record that fails `validEntry` (one bad entry is enough) loads as an empty record, `status()` reports nothing wrong, and the next save overwrites the whole log. No backup is kept.
- Probe: a stored log of 2 entries, the second with `type: 'pair'`. Load gives 0 entries, and after one save the stored log has 1 entry and the backup is null.
- When it bites: today only if the record is edited by hand. Once a later release adds a question type (mixed-up pairs is planned) without bumping the version, an older cached copy of the app (for example from the Home Screen) would wipe the learner's log.
- Fix: treat an unreadable stored record like a newer one. Do not overwrite it; copy its raw text to a backup key; show a status message. Add a test.

**S2. The quiz's day is the UTC day.** `src/quiz-ui/useQuiz.ts:46` and `src/quiz-ui/QuizScreen.tsx:59,67,72`. *Confirmed (read).*
Nothing passes `utcOffsetMinutes`; grep finds no `getTimezoneOffset` in `src/`. The engine supports the offset and has a test for it, but the app never uses it.
- What goes wrong: in Madrid (UTC+2) the day rolls over at 02:00 local. On the US east coast it rolls over at 19:00 or 20:00, so one evening can bring 10 new places.
- Fix: pass `utcOffsetMinutes: -now().getTimezoneOffset()` at all four call sites.

**S3. In quiz mode, a zone selected in Explore stays highlighted.** `src/map/createMap.ts:302-312, 232`. *Confirmed (read).*
Entering the quiz clears the selected DO but not `selectedZone`'s `sel` state, and `applyQuiz` only clears `quizZoneSel`.
- Steps: open the Rioja Alta zone card, go to the Quiz, and get a find-it on a zone.
- What goes wrong: Rioja Alta shows as selected, which misleads the learner or hints at an answer.
- Fix: on entering the quiz, clear `selectedZone`'s state and set `selectedZone = null`. Explore's `render()` puts it back when you leave.

**S4. The tests miss the four failure paths above.** *Confirmed (read).*
The unit tests are named after the digest's rules and do test those rules (boxes, shades, the re-ask moves nothing, slip, intake, zones, Vinos de Calidad, migration, newer version). They do not cover two writers, a damaged record, a slip on a re-ask, or the app passing a timezone offset.
- Fix: add one test for each.

## Nits

- **N1.** `RoundPlayer.tsx:52-55`: the question memo depends only on `[index, tree]`. After B2 is fixed this is safe, but adding `item` to the dependencies is cheap insurance.
- **N2.** `useQuiz.ts:46`: the plan is computed with `now()` only when the log or focus changes. A Today card left open overnight shows yesterday's numbers until the next answer.
- **N3.** `plan.ts:82`: `seenToday` counts places first seen in Review, including Vinos de Calidad, so a Review round uses up Study's daily intake. This is not covered by the digest, so it goes to LeadBot, not to a fix.
- **N4.** `createMap.ts`: in quiz mode, terrain stays on when relief is on, and drag-rotate and pitch are not locked. The digest asks for a flat, north-up map. Pitch and bearing are reset on entry, which is probably enough.

## Checked and fine

- **Boxes and re-ask (read, and ran a replay):** a miss, then a right re-ask in the same round, leaves box 0 due tomorrow. First right answer gives box 1. A right answer before the due date keeps the box and due date.
- **Slip (read):** the log keeps `right: false` with `slip: true`, and unslip adds the re-ask back.
- **Shade and question type (read):** the cap rule and the question-type rules match the digest.
- **Order and intake (read):** due memories come most overdue first; intake takes the focus first, then course order; zones join only after their parent is known.
- **Fact questions (inferred from the data):** the data has 4 distinct kinds, so a fact question can always be made. The "no fact, skip" path cannot loop "Keep going" with today's data.
- **Store (read):** migration from version 0, and the newer-version guard in `save` and `importFile`; import and undo go through `reload()`.
- **Leaving quiz mode (read):** it restores dimming, selection, labels, pitch and bearing, and reframes Explore's focus. A tap in quiz mode goes only to `pickOnMap`.
- **Debug hooks (read):** `?now=` and `__quizPick` are behind `__DEBUG_FLAGS__`.

## LeadBot follow-up (17 Oct 2026)
All fixed on the release branch, each with a unit test; `Tools/check.sh ui` green after (185 unit, 43 UI).
- B1: `save()` reads storage again and merges by entry (`mergeLogs`); a loaded file and its Undo still replace (`put`). `useQuiz` reloads on the `storage` event.
- B2: `withoutReask` takes the index and removes only a later re-ask.
- S1: an unreadable record is copied to `atlaslope.quiz.damaged` before any save, `status().damaged` is set, and the Quiz screen says so.
- S2: `localDay()` passes the local UTC offset at every Study call and the plan; the plan also refreshes when the local date changes (N2).
- S3: entering the quiz clears Explore's zone selection.
- N1: `item` added to the question memo. N3 (a place first seen in Review counts toward Study's five a day) kept: builder's reading, accepted by LeadBot. N4 kept (pitch and bearing reset on entry).
