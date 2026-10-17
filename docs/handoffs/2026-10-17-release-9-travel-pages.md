# Handoff: release 9, travel pages and photos (17 Oct 2026)

## Done
- Teaser place card, full place page (`#place=<id>&page`) and region page (`#region=<id>&page`) from `Review/mock-travel-v1/` (cards
  `Review/release-9-card-1-place-page.md`, `-card-2-region-page.md`). Charts are plain SVG: measured climate and altitude only.
- Photo pass (owner card "fix and fill"): audit of 77 first photos, 11 reordered, Commons fill run for 50 places (Actions), 5 places
  filled, 5 off-topic first photos dropped. Tools: `Tools/data/photo_candidates.py fill`, `photo_ship.py` now re-fetches reordered keys.
- Fixes on the way: welcome card no longer hides under a page opened by link; the long quiz-round UI test gets `test.slow()`.

## Decided (owner)
- Two releases (8 colours, 9 pages); photos "fix and fill", three per place (cards 17 Oct 06:48Z). "Publish release 9 after everything's done" (08:01Z).
- LeadBot defaults: region cover = first photo of the first place in course order that has one; soil and ageing stay text, no invented chart.

## Open
- #42: 26 places without a photo (mostly Vinos de Pago, plus Jerez, Manzanilla, Islas Canarias) and 10 first photos that are landscape or village.
- Not built from the mock: mini map in the at-a-glance box, "Show all photos" viewer.

## Where things are
Audit `/mnt/project-files/atlaslope/photo-pass/2026-10-17-audit.md`; reviews `Review/release-9-review.md`; plan `Review/release-8-9-plan.md`.
