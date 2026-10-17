# Handoff: travel look for the information screens (17 Oct 2026)

## Done
- Owner asked (06:00Z) for a visual design check on everything and a look closer to "Airbnb and a beautiful coffee-table book".
- Mocked a map card with a cover photo, three place pages (book, listing, a mix), a region page, three light palettes and three dark ones.
- ReviewBot design check (`Review/reviews/2026-10-17-travel-look-design-check.md`): 3 blockers and 8 should-fix items, all fixed in the mocks.
- Approved mocks committed to `Review/mock-travel-v1/` (map card, place page, region page). The style yardstick is `Review/visual-style.md`.
- The visual design check was added to `CLAUDE.md` (Mocks) and `docs/AGENT_ROLES.md` (ReviewBot design mode).

## Decided (owner)
- The listing page, not the book or the mix (06:19Z): readability and the photo mosaic up top won.
- Light: white and wine (06:22Z). Dark: gold on black, matching the dark logo (card, 06:23Z). Cream paper and brown charts are gone.
- The visual check rule as proposed (card, 06:13Z). Mocks OK'd with "OK! Go" (06:28Z).

## Open
- Building it. Needs a plan and his go. The quiz release (7) is in flight, and its screens should take the same colours later.
- Photo picking pass per place before it ships (some first photos are off-topic, for example Calatayud's train).
- The chapter-style headlines in the dropped book page were Claude's copy; the listing uses section names only.
- Rejected variants (book, mix, colours B and C, dark 2 and 3) stay in `/mnt/project-files/atlaslope/mocks/travel-v1/` for reference.

## Where things are
- Mocks also on his Mac: `~/Developer/Atlaslope/mocks/travel-v1/`. Generator (Python, inlines photos and fonts) was in the thread
  scratchpad and is not kept; the HTML files are self-contained.
