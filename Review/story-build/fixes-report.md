# Story fixes report (BuilderBot, branch agent/builder/story-fixes)

In progress. One line per finding.

- B1 fixed: label set after addTo; story-mk/story-dot get aria-hidden; UI test checks a "Fact: ..." button.
- B2 fixed: credit and short form are "Source: IGME, MAGNA 50" (strings.ts); unit test updated.
- B3 fixed: square crops for rioja-2 (40% 50%) and priorat-1 (10% 30%, moved left to keep the cypresses) in data/story/photo-focus-square.json (with file hash). Photo-crops.json not usable: its test rejects photos the Guides page does not show. Sheet: Review/story-build/shots/crops-square.png. storyList.ts uses it; test asserts focus and hash per listed photo.
