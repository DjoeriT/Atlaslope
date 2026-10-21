# Card 4: CI fixes for PR #175

Status: done.

## Failure 1 (motion.spec "one way back per screen")
Cause: the top "Map tour" link had class `pg-back pg-tourjump`, so `.pg-back` matched two elements. It now has only `pg-tourjump`;
src/styles/motion.css shares the button look through selector lists (look, svg, hover, focus, inline-flex, phone rule). Old test unchanged, passes.

## Failure 2 (story.spec "scrolling the Rioja guide at 1440 shows stops 1 to 9 in order")
CI log: "Test timeout of 30000ms exceeded" (not a clean assertion failure) on a slow runner.
Evidence for the cause: with the guide at 1440 alone, lazy photos load as they near the screen and move the links without any scroll event
(measured: `[data-fly="soils.0"]` 2644 -> 2630 px, `#terroir-barrel` 3099 -> 3085 px). GuideMap picked the step only on scroll/resize, so after a shift
the shown step stayed stale (the user would see the previous stop until the next scroll). The test also started scrolling while the lazy
chunk's empty placeholder (no data-step) was still shown.
Reproduction: passes alone and at --workers=8; under --workers=20 --repeat-each=40 it failed (stale step "Expected sierra, Received ''/intro", and starved `.pg` evaluates).
Fix: (a) src/story/GuideMap.tsx: a ResizeObserver on `.pg-listing` re-picks the step when the guide's height changes (real behaviour fix);
(b) tests/ui/story.spec.ts: wait for the real column (`data-step="intro"`) before scrolling; assertions unchanged.
Results after: story+motion 21 passed (38 s); 1440 test x10 passed (31 s); 60 runs (both sizes x30) at --workers=8 no failure (112 s);
Tools/check.sh quick passed (5 s); npm run build ok (2.3 s).
Caveat: at 14-20 workers the machine starves and tests still time out in `page.evaluate` (waiting for `.pg`): that is overload, not a logic fault; CI's single failure was most likely the same plus the shift.
