# UX and UI sweep, 17 Oct 2026

Built from `main` at 8526daf (release 14 code) and walked in Chromium at desktop 1440x900, iPad 834x1194, phone 390x844 and phone
landscape 844x390, light and dark, plus a quiz round and a click-through of navigation. 66 screenshots; evidence sheets in the project files, `atlaslope/ux-review/shots/`.
Not checked: satellite imagery, real Safari, real iPad (the container can't reach tiles or devices). The "Satellite imagery is not
available" note in every screenshot only appears because of that and is not a finding.

Tags: [V] seen in a screenshot or the code, [A] my judgement. Severity: **P1** breaks trust or the main flow, fix first.
**P2** clearly worse than best practice, fix in this slice. **P3** polish.

## P1: fix first

1. **"End round" ends the round on one tap, then says "All done for today"** (quiz, every size) [V].
   A plain text button next to the step counter, no confirm and no undo. After it the screen reads "0 / 0, All done for today,
   New places 0 of 5", which is false: nothing was done. Fix: ask "End this round? Your answers so far are kept" with Keep going
   as the main button, and a round ended early says "Round stopped. 0 of 5 new places learned" instead of "All done".
   Evidence: `shots/01-end-round.png`.
2. **Rioja shows up twice in the tree** (region card, place card, page) [V]. The study region "Rioja" holds one place, also called
   "Rioja", so the trail reads "Spain › Rioja › Rioja › Rioja Alta" and the region card lists a single place. Learners will think
   it is a bug. Fix: when a region holds one place with the same name, skip the region level in trails and open the place directly
   (decision card). Evidence: `shots/02-rioja-twice.png`.
3. **Two different full-page designs** [V]. The place page has a white top bar with the logo, search and a "Back to map" button on the
   right; the region page has no top bar, no search, a pill "‹ Back to map" on the left over the photo, and the map's Climate legend
   floating over its cover (a layering bug). One pattern for both: the place page's bar. Evidence: `shots/03-page-chrome.png`.
4. **No transitions anywhere in the interface** [V, code: the only animations are a quiz timer bar and a photo zoom on hover].
   Cards swap with a hard cut while the map flies for 1.2 s, so the new text lands before the map arrives; the full page replaces
   the map in one frame and "Back to map" cuts back. This is the main reason it can feel "web-page-y" rather than premium [A].
   Fix (decision card): a short crossfade-and-rise on the card (180 ms), the page sliding up over the map (250 ms) and down on
   Back, the cover photo carrying over from card to page, and the quiz steps crossfading. All off under "reduce motion"
   (already respected for the map [V]).

## P2: fix in this slice

5. **Phone: the map is hidden behind its own controls** [V]. On 390x844 the map area is about 40% of the screen and holds the
   logo, search, the Explore/Quiz/Progress bar, the Climate button, layers, zoom in/out and reset. Fix: one row on phones
   (logo mark only, search icon that expands, mode bar), zoom buttons hidden on touch (pinch does it), layers and reset stacked
   in one small group. Evidence: `shots/04-phone-map-crowded.png`.
6. **Phone: the bottom sheet can't be dragged** [V, no drag code]. It is a fixed half-screen panel; you can't pull it down to see
   the map or up to read. Best practice on map apps (Apple Maps, Google Maps, Airbnb) is a sheet with three stops: peek (title
   and main button), half, full. This also solves issue #57's "cover photo takes half the sheet": at peek there is no photo, at full
   it has room. Decision card.
7. **"Progress" tab does nothing** [V]. It looks like the other two tabs but is disabled with a "Coming soon" tooltip that touch
   users never see. Fix: hide it until the mastery map ships (release 15), or show it greyed with a small "soon" label.
8. **Too many ways back, with different names** [V]. Card ✕ (goes up one level), "All of Spain", breadcrumbs, the Explore tab,
   "Back to map", "Back to the quiz", browser Back. Fix: breadcrumbs and ✕ on every card (the region card has no ✕ today), drop
   "All of Spain" (the trail and Explore already do it), Escape closes the card or page on desktop (today only the fly caption and
   menus listen to Escape).
9. **Main buttons don't say what they open** [V]. Place card: "Read the full page". Region card: "See the region", while you are
   already looking at the region. Fix: "Open the Rioja page" / "Open the Green Spain page", one verb for both.
10. **Quiz home repeats and contradicts itself** [V]. "Nothing due today. Everything you've learned is on schedule." then, below both
    boxes, "Nothing is scheduled yet. Or explore the map." The new-places line lists five long Basque/Spanish names in a paragraph.
    The kicker "QUIZ · SATURDAY 17 OCTOBER" is clipped by the card's top edge on desktop, and on phones the "Save or load" ✕ sits
    on the kicker. Fix: one status line, the new places as "Learn 5 new places: Txakoli (3), Rías Baixas, Ribeira Sacra", kicker
    spacing fixed. Evidence: `shots/05-quiz-home.png`.
11. **Main actions sit far from the content on desktop** [V]. Card footers are pinned to the bottom of an 800 px card, so in the
    quiz "Got it, ask me" is 600 px below the fact it follows, and the welcome card is two thirds empty. Fix: cards size to their
    content (up to the screen height) and the footer follows the content.
12. **The title gets a heavy blue box after every move** [V]. Moving focus to the new card's title is right for screen readers, but
    the ring shows for mouse users too and it is browser blue, not the accent. Fix: no ring on a title focused by the app; the accent
    ring stays for keyboard focus on controls.
13. **Dark mode keeps a light map** [V in the plain-atlas fallback; with satellite on it's moot]. Dark chrome over a pale grey map
    looks unfinished when imagery fails. Fix: a dark variant of the fallback atlas.

## P3: polish

14. Search placeholder is cut to "Search places a" on phones [V]: use "Search".
15. The welcome card's "Start exploring" sits bottom-left while every other main button is full width [V].
16. Region page for a one-place region shows "1 place, in course order" and a big "1 PLACE TO LEARN" [V]: hide the count under 3.
17. The Spain card and the Rioja region card use the same cover photo [V].
18. Search results stay open until cleared (from the mobile check) [R].
19. Tap targets under 44 px: satellite note ✕, Practise checkboxes (18 px), photo credit links, "terroir, 4-minute read" [R, qa-round-1].
20. Phone landscape: the side card is about 290 px tall and its buttons take half [R, issue #57]. Covered by item 6 if the sheet
    becomes a side panel that scrolls as a whole.

## Already owned elsewhere
- Map colour strength when zoomed in: the "Sharper map" thread. Not touched here.

## Suggested order
One slice for P1 and the cheap P2s (1, 2, 3, 7, 8, 9, 10, 12, 14-17), mocked first where the screen changes (2, 3, 10).
A second slice for motion and the phone layout (4, 5, 6, 11), mocked first because it changes how every screen feels.
