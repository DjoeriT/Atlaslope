# Code review: address bar view rewrite (e39bee1)

Verdict: merge. Must-fix 0, should-fix 2, nit 2.
Ran: vitest url-view + cards (12 passed), tsc --noEmit (clean). The race itself was not reproduced; the diagnosis is from reading the code.

## Diagnosis
Consistent with the code [read]. go (App.tsx:44-58) and openQuiz (69-71) pushState the new hash at once and set state inside withMotion, a frame later.
The old onView (before the change) rebuilt the hash from quizRef/selRef, which still held the old screen, so a moveend in that gap rewrote the address back.
Both reported symptoms fit: "#quiz=focus" became "#quiz&view", and Escape then went to the region.
Reading location.hash closes that gap.

## Round trip (read, plus the unit test)
- place, region, page (bare flag), at (needs page and place), fly, view: selectionToHash(parseSelection(h)) keeps all of them. Parse drops fly when page is set, which the writer never emits.
- quiz, practise, focus, progress-file, test with set: quizToHash(parseQuizRoute(h)) keeps them.
- history.state is passed through unchanged. No unused imports: parseView, quizToHash and selectionToHash are all still used (App.tsx:53,71,75,127).

## Behaviour changes
- Should-fix 1 (App.tsx:104): an address with an unknown id (#place=bogus) used to be normalised on the first map move, because selRef holds the validated Spain.
  Now the bogus id stays in the bar while the card shows Spain. Cosmetic, and arguably harmless, but it is a change. Either accept it and say so in the handoff, or validate in onView.
- Should-fix 2 (tests/unit/url-view.test.ts): the test misses the cases the card named.
  Add "#quiz=test" with no set (becomes "#quiz&view=..."; same as before, since state is {sub:null}), "#quiz=bogus", "#place=toro&fly=valley.1", and an unknown place id.
  The "#place=toro&page&at=soil" case does cover at. The last assertion's `{...view, zoom: 5.4}` is redundant.
- "#quiz=test&set=x" is not a no-op for a hash that is only partly formed, but the old code behaved the same.

## Nits
- url.ts:81 the doc comment names release 17 publish runs; that will go stale. Keep the reason, drop the run reference.
- The handoff addendum says "15 runs" locally without the command. Name it. The claim "CI is the check" is honest.

## Records
- The handoff addendum and release-17-what-to-test.md are accurate about the change, with one omission: the tester note says nothing about this fix (nothing for testers to do, so fine). PROJECT_CONTEXT, the archive move and the spacing handoff pointer are consistent.
- No remaining race: the other pushState sites (75, 82, 127) set state in the same tick or in withMotion, and now cannot be overwritten by onView.
