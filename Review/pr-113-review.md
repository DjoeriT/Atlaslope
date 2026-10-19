# PR #113 review (ReviewBot): verdict MERGE (after optional fixes). 0 blockers, 2 should fix, 3 notes, 2 taste questions

Read via `git diff FETCH_HEAD~1 FETCH_HEAD` (local origin/main is stale; the PR is one commit). Did not run tests or build.

## Should fix
1. src/home/guideCount.ts:53 (fillGuideList): if the `<!-- guide-list -->` markers are removed or reformatted (e.g. CRLF, different indent), `replace` silently matches nothing and the page ships with an empty list. Fix: throw when the regex does not match on a page that was meant to have it, or have a unit test build guides/index.html and assert the row count (tests/unit/home.test.ts may already; confirm it reads the real page).
2. vite.config.ts:11: `guideRows()` runs for every HTML page (index, atlas, about) on each transform, re-reading all guide JSON and rebuilding the tree each time, and a bad guide id (the `throw` at guideCount.ts:~42) now fails the whole build and dev server, not only /guides. Fix: compute once (`const rows = guideRows()` lazily, memoised) and call fillGuideList only when `ctx.filename` ends with guides/index.html. The throw itself is right (fail loud); keep it.

## Notes
3. Coverage: lists every content/guides/*.json whose id is a place or a zone child of a place (guideCount.ts:~33-41). A guide whose id is a region, or a zone of a zone, hits the `missing` throw rather than disappearing silently. Good. Zone guides appear even when the parent place has no guide; fine.
4. HTML escaping: names and labels go through `esc` (&, <, >, "); minutes is a number; `r.id` goes into the href unescaped but ids are slugs (`a-z0-9-`). Low risk; `esc(r.id)` costs nothing. Links `../atlas/#place=<id>&amp;page` match the old hand-written ones.
5. `p.name.split(' / ')[0]` drops the second-language name; intended, but a one-line comment would help. Other pages: the regex touches only pages with the markers, so index/atlas/about are unchanged.

## Copy (about/index.html, guides/index.html), against owner 19 Oct positioning
- Positioning: h1 "A wine atlas for anyone who loves wine." and the "why it tastes" spine are right. "Study rounds" keeps "Study", no "Quiz". Name is AtlaSlope throughout. Facts intact: MAPA, pliego, EU single document, Esri/Maxar/PNOA IGN all still there and now one idea per paragraph.
- Independence line: still clear ("not affiliated with or endorsed by WSET or the Wine Scholar Guild. It uses none of their course text, maps or images."). Splitting it from "AtlaSlope is independent." is fine.
- No grep hit for copy rules in Review/visual-style.md (searched copy/quiz); I applied the card's rules.
- "X, Y and Z" lists: about sub-line has none. Step 2 "the land and the weather" is a pair, fine. "Esri, Maxar, with PNOA" is a credit string, keep.
- Guides sub (guides/index.html:40) repeats the h1 ("why ... tastes the way it does" twice, one under the other). Suggest sub: "The facts come from the official documents. Every place a guide names is one tap away on the map." (drops the repeat, two ideas on two lines).
- "Terroir written for N of M places, across K regions so far" (guideCount.ts:~50) is unchanged tone, fine.

## Taste questions (owner)
A. about "It is useful for WSET and Wine Scholar courses": keeps an exam mention on a page positioned as non-exam. Honest and useful to students, but it is a claim and puts both brand names in a sentence that is not the disclaimer. Alternative: drop "useful for" and keep only the disclaimer sentence.
B. about step 3 "Test yourself, if you like." Study is optional now, good; "Test yourself" is a quiz word in spirit. Alternative: "Study it in short rounds, if you like."

## LeadBot follow-up
- Should-fix 1 fixed: `fillGuideList` throws when the markers are missing; unit test added.
- Should-fix 2 fixed: the list is filled only on `guides/index.html`; the count still on every page.
- `esc(r.id)` added. Guides subline no longer repeats the h1. "Test yourself" became "Study it, if you like".
- Taste A (WSET mention on About) put to the owner on a card; kept for now.
