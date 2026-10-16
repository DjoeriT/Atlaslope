# Hand-off from "first principles questions" (resolved by Claude, 16 Oct 2026 12:10Z)

Nothing built or pushed. Building still waits on the owner's **go**.

## What happened
The owner asked which first-principles decisions would be hard to change later. Claude separated one-way doors from two-way doors and put the one-way ones to him on cards.

## Decided by the owner
- **Name: Atlaslope** (his idea, 12:08Z), replacing Paraje. Address atlaslope.com, with atlasslope.com as a redirect. paraje.app was taken. 205 names checked from his Mac (RDAP and whois, lookups only, nothing bought): /mnt/project-files/paraje/naming/name-candidates.md. Web search found no brand called Atlaslope.
- **Writing licence**: code MIT; his fact sheets, guides and why lines all rights reserved; repo stays public (10:59Z).
- **Phasing**: a release 8 "ready for friends" now carries Sentry, PostHog, the privacy note and the offline service worker (11:02Z).

## Defaults set by Claude (stand unless he objects), architecture-decisions.md #41 to #44
Stable ids that never contain the parent; overlapping places with one home parent, study regions stored as a course grouping; an answer log with boxes computed from it; photos committed as resized copies only.

## Where it is written
scope.md ("One-way doors check", "Waiting on the owner"), architecture-decisions.md (#41 to #47), builder-brief.md (step 0 rename and content notice, release 4 domain, release 8).

## Still open
- Owner buys atlaslope.com and atlasslope.com before release 4 (about €25 a year [A]; prices unchecked).
- Renaming the GitHub repo and Pages path: ask him at the restart commit.
- PostHog cookieless mode can't show whether friends return; revisit at release 8.
- Domain lookups need his Mac: the cloud container and the Mac folder VM can't reach registries; a Remote Control session can.
