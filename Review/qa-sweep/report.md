# QA sweep of atlaslope.com (release 61), 21 Oct 2026 (issue #146)

**Verdict: not ready to grow, but close. No blocker.** Counts: blocker 0, should fix 5, nice 7.
Method: Playwright (installed Chromium) on the live site at 1440, 1024 and 390, fresh browser (first-time visitor), under 2 requests/s. Tags: [V] ran and seen, [R] read, [A] inferred. Map-tour findings F1-F12 not repeated.
Shots in `Review/qa-sweep/shots/` (full pages: home, guides, about, 404 at three widths).

What passed [V]: 93 internal link targets all return 200 (HEAD); no console errors or failed requests on home, Guides, About, atlas, 10 guide pages and Study (only the 404 test and WebGL "GPU stall" driver notes in headless); no horizontal overflow on home, Guides, About, 10 guide pages at 1440 and 390; one h1 per page; no image without `alt`; photo credit with "cropped and resized" on every guide page that has photos; champagne nav on the band 11.7:1; back button returns to the previous map state; deep links `#place=x&page`, `#region=`, `#study` open correctly; search finds places by grape ("albillo"), shows "No place or region matches.", Enter opens the first hit; redirects `/read-with-the-map/` and `/map-tours/` land on `guides/#map-tours` (meta refresh, with a visible link); Study round (learn, question, wrong answer) works and moves focus to the feedback.

## Should fix

**S1. 404 page is the GitHub Pages default.** Page: any bad URL, e.g. /nonexistent-xyz. Width: all; worst at 390 where it scrolls sideways (scrollWidth 700 vs 390). Shot: `404-1440.png`, `404-390.png`. Title "Page not found · GitHub Pages", grey, no AtlaSlope band, no way home, English dev text ("make sure the filename case matches"). Fix: add `404.html` in the site root with the band, one line and a link to Home, Atlas, Guides. Effort S. Issue: none. [V]

**S2. Study start for a new visitor says "Nothing due today. Everything you've learned is on schedule."** Page: atlas#study, fresh browser, 390 and 1440. Shot: `study-start-390.png`. A first-time visitor has learned nothing; the line reads as a bug and delays the real message ("Up next: 5 places in Green Spain"). Fix: for a user with no history, drop the "nothing due" line and lead with "Start with 5 places in Green Spain." (wording is the owner's). Effort S. Issue: none. [V]

**S3. Home hero card credit says only "resized" although the photos are cropped.** Page: home, 1440 (the strip bottom right of the map: "Card photos: Mentxuwiki, Basotxerri (CC BY-SA 4.0), Manuel Velazquez (CC BY 3.0), resized"). The Photos rule is "cropped and resized"; the same photos lower on the page say it correctly. Shot: `home-top-1440.png`. Fix: same wording as the lower credit. Effort S. Issue: #154 (same rule). [V]

**S4. On the phone, the Guides filter jump hides the section heading under the sticky bar.** Page: guides, 390, after "Show only guides with a map tour" (url `#map-tours`). The view starts at "Show all guides", heading "Guides with a map tour" is cut off behind the two-row bar. Shot: `guides-filter-390.png`. Fix: `scroll-margin-top` on the target equal to the bar height (also for the region jump row `#r-...`, not checked). Effort S. Issue: F-class of #148 map tours (new Guides band). [V]

**S5. Study "miss" link is called "Open X's card", not the guide, and looks like plain text.** Page: Study, wrong answer, 1440. Shot: `study-wrong-1440.png`. The line under the facts ("Open Bizkaiko Txakolina / Txakolí de Bizkaia's card") has no underline or button look, and "card" is not in the glossary where "the guide = the whole place page". Owner's task asked that a miss links to the guide: it does, but is easy to miss and the word is off. Fix: style as a text link (underlined) and ask the owner for the word (e.g. "Read the guide"). Effort S. Issue: none. [V] wording [R] glossary

## Nice

**N1. Phone top bar on the atlas and Study shows only Atlas and Study; home, Guides and About show all four.** Page: atlas, 390. Guides and About are unreachable from the map on a phone without going Home. Shot: `study-start-390.png` vs `guides-top-390.png`. Fix: confirm it is intended (space); else a menu. Effort M. [V]

**N2. Tab order on Study starts in the card, the site nav comes after eight stops.** Page: atlas#study, 1440. Order: Learn 5 new places, Set a focus, Practise, Save or load progress, "Got it, hide this note", then the header. A "Skip to the content" link exists on plain pages only (Guides: yes). Fix: header first in DOM or a skip link on the atlas. Effort M. [V]

**N3. Two buttons named "Got it" in Study.** The intro "Got it" and the map-hint close ("Got it, hide this note"). Screen readers and tests collide (my script hit a strict-mode clash). Fix: rename the hint button "Hide this note". Effort S. [V]

**N4. Home hero map labels are tiny (about 9 px) at 1440.** "Haro", "Sierra de Cantabria", "Ebro" are hard to read; the photo card covers the lower left. Shot: `home-top-1440.png`. Fix: bigger labels or fewer. Effort S. [V]

**N5. Guides intro has a list sentence.** "(the pliego de condiciones, the EU single document, MAPA)" breaks "no X, Y and Z lists" (CLAUDE.md copy rule). Shot: `guides-top-390.png`. Fix: one idea per line, owner decides words. Effort S. [V]

**N6. Rioja appears three times at the top of Guides** (showcase, map-tour band, region section) and the showcase photo is soft and over-exposed at 390. Shot: `guides-filter-390.png`. Fix: check the crop; accept the repeat or drop one. Effort S. Issue: #148. [V]

**N7. Photo credit lines are long and repeat "cropped and resized" after every name** (Rioja card at 390 is 5 lines; Spain card at 1440 3 lines). Rule allows one always-visible line per set: "Photos: A, B, C · licences · cropped and resized" once. Shots: `guide-rioja-390.png`, `atlas-spain-1440.png`. Effort S. Issue: #154. [V]

Also seen, no action: the Spain card "Sources:" lists two place names (Getariako Txakolina, Lanzarote) as if those were the sources of the Spain card [V, `atlas-spain-1440.png`]: probably the photo sources; label it "Photo places" or drop (S, counted under N7). Study map shows a beige hillshade tile block over satellite at the Basque coast [V, `study-wrong-1440.png`]: looks like the intended study highlight with a square edge, not a loading fault, but the square edge is odd (S, tell owner). 95 links under 24 px on Guides are the inline photo-credit links (exempt as inline text under WCAG 2.5.8) [A].

## Not checked
Safari, iPad, real phones; large text, reduced motion; the 1024 width beyond overflow and headings (no shots read); the whole Study round past the first wrong answer and the end screen; progress save/load; keyboard through every Study state; search on every plain page (home and atlas only); all 109 guides (10 opened); Guides region jump row (`#r-...`) scroll offsets; Guides page filter result count; contrast of text on map overlays; screen reader. External links (Wikimedia Commons credits) not requested. Cost: about 135K tokens, mostly re-read of one context plus 7 scripts.
