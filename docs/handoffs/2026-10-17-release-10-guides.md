# Handoff: release 10, place guides (17 Oct 2026)

**Done.** A "Terroir" section on the place page for Rioja, Rioja Alta, Rioja Alavesa and Rioja Oriental (`content/guides/*.json`,
loader `src/facts/guides.ts`), fly-there buttons with a caption card (`src/cards/FlyCaption.tsx`, address `#place=x&fly=chapter.n`),
"Test me" on every quizzed place page (`#quiz=test&set=...`, a review round of 10), and the "1 place to learn" fix. Mock
`Review/mock-guides-v1/`, plan `Review/release-10-plan.md`, review `Review/release-10-review.md`, tester note `Review/release-10-what-to-test.md`.

**Decided** (owner cards 17 Oct 09:13Z): the guide is a section of the place page, named "Terroir". Guide text only from the pliego and the
EU single document, each chapter with its page cites; anything the source does not say was cut (the old mock's Sierra de la Demanda and Bilbao lines).

**Open.** More guides are content only (a JSON file per place): Green Spain and Castilla y León are next in the plan; many smaller pliegos
have a thinner "link with the area" chapter, so guides there come out shorter. Publish waits on "publish release 10". After it, the owner
wants a QA and review round in its own thread.

**Cost.** See `Review/agent-spend-log.md` (release 10 rows) against the 0.4 to 0.6 M estimate.
