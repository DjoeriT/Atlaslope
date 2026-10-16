# First-principles check of mock round 3 (16 Oct 2026)

Checked against the scope page: wine lovers understanding regions deeply first, exams second, the why with every answer; a world place tree (country, study region, appellation, zone); the quiz with memory as the spine. Tags: [V] verified in the mock, [O] your decision, [A] my judgement.

## The one structural finding
**The place tree is invisible.** The scope says Paraje is built on country › study region › appellation › zone, but the screens show a flat Spain with a region dropdown and a search box in the top bar. Nothing on screen tells you Rioja sits in the Rioja study region in Spain, or lets you walk down from Spain to a zone. [V]

Proposal: make the tree the navigation. Explore with nothing selected shows a **Spain card** (ten study regions, each with its known count). Tap a region: a **region card** (its places, the "continue here" button). Tap a place: the place card, then the guide. Every card carries a breadcrumb (Spain › Castilla y León › Toro) and the breadcrumb is clickable. The region dropdown goes, the search box stays (it finds regions, places, towns and grapes). This is also what makes France drop in later without a new UI. [A]

## Remove
1. **"Custom quiz" on the Today card.** The Quiz tab already opens the setup. Two controls, one meaning. [V]
2. **"About eight minutes" on the Today card.** A time promise the app cannot keep; the due count is enough. [A]
3. **The region dropdown top left**, replaced by the tree navigation above. [A]
4. **The progress bar on the Toro card.** A bar implies a percentage; the state is one of four words. Show the word ("Known") and when it comes back. [A]

## Move
5. **The fact sheet in the guide** goes above "Why it tastes as it does", as a compact strip under the lede (level, grapes, climate, altitude). The narrative is the product for wine lovers, but the facts are what you look up when a question is in front of you, and today they are below the fold. [A]
6. **The light/dark toggle** out of the top bar into a small menu under the Paraje wordmark (with "about" and, later, settings). It is a preference, not a map control, and the top bar should hold only mode and search. [A]

## Change
7. **Region colours have no legend.** Ten colours encode study region on Explore and nobody is told. Either add a legend (in the Spain card, the colours next to the region names, which the tree navigation gives for free) or drop the encoding. Recommend the legend. [V]
8. **The "why" paragraphs cite nothing.** The fact sheet has a source per row; the narrative, which is the part that teaches, has none. Add a "Sources" line at the end of every guide, and mark Paraje's own synthesis as such. This matters because a wrong why teaches a wrong answer (scope risk 1). [V]
9. **Kickers say "DOCa · Rioja" and "DO · Castilla y León".** They mix level and region. The breadcrumb replaces them. [V]
10. **Test me on Rioja** starts the 2.2 find-it quiz on all of Spain. It should start a short quiz scoped to the place and its zones; the quiz pages are not re-mocked, so this is a note for the build. [V]

## Add
11. **"Next: Navarra" at the foot of the guide**, so reading has a path through the course order, not a dead end. [A]
12. **Mastery map: "due today" marker.** The map shows how well you know a place but not what is due; a small ring on due places ties the Progress screen to the Today card. [A]
13. **Zones on the mastery map** once the parent is known (your rule): Rioja shaded by zone, not as one block. [O]
14. **Empty state of the Today card** is described in a note, not shown. Mock it as a second state (toggle in the mock) so the wording is decided now. [A]

## Keeping, on purpose
- One map menu bottom right with satellite first (your call today).
- Satellite on with the atlas drawn over it (your call today).
- The Today card as home. Nothing in this pass argued against it.
- Serif names on the map, towns and rivers as anchors.

## What I would do now
Apply 1, 2, 4, 5, 8, 9, 11 straight away (no decision of yours changes). Items 3, 6, 7, 12, 13, 14 and the tree navigation go to you as one card, because they move controls you have already seen.
