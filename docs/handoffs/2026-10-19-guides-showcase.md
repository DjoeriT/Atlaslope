# Release 48: Binissalem photo and showcased guide (19 Oct 2026)

Done
- Binissalem's photo 404'd on the Guides page: its source is 800 px wide, so no `photos/800/` copy exists. `photoImg` (src/home/guideCount.ts) now builds src/srcset from data/photo-sizes.json like the place page; a unit test checks every photo path on the page exists (failed before, passes after).
- Featured Rioja: "Showcased guide" label; the photo mosaic is replaced by the home hero image (`public/home/hero.webp`) with the Esri/IGN credit. Map in `FEATURED_HERO`; another featured guide needs its own hero image there.

Decided (owner): rotate dropped, Rioja stays; only the featured guide gets the hero treatment; preview approved 13:57Z.

Open
- ReviewBot P2s left as is (owner approved the preview): label is uppercase with a foil rule; satellite credit at .78rem vs the home hero's .65rem.
- P3: "resized" in the credit line is not strictly true for an unresized 800 px original.

Where: PR #120; review Review/release-48-review-guides-showcase.md; preview https://claude.ai/artifact/3drXs49zcU2wMFbyBc82J1
