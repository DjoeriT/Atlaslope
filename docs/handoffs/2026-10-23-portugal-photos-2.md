# Portugal photos for the new guides, raw data incident (issue #149, 22-23 Oct 2026)

## Decided (owner)
- 22 Oct: "Go with A": guides load on demand; the 2 MB check counts the first load (decision #38, PR #214, merged).
- 22 Oct: "add Openverse as a source" for places Commons left thin.
- 22 Oct: "Do all three": raw data outside the repo, CI refuses symlinks, one-command re-download (PR #229, merged).
- 22 Oct: re-download the raw files once #223 merged (done, see below).

## Done
- Photos (PR on `claude/pt-photos-2`): 76 photos for 24 places. Commons pass 2 (`PT_CATS` category searches, `photo_candidates.py pt`)
  and Openverse (`Tools/data/openverse_candidates.py`, sheets `ov-<place>.jpg`). Porto uses Douro's photos (Porto is Douro's land).
  Picks by three helper rounds, weak picks cut by LeadBot (flower field, scrub, near-duplicate facades). Square crops checked by eye
  (Távora-Varosa moved to 95% to leave a hiker out; Lagoa trimmed 45 px for a watermark). A CC BY Setúbal file without an author was
  dropped. Kolforn's Commons credit carried an email and a "mail me if you use" request: credit is now "Kolforn", email kept out of the repo.
- Flickr's file host returns 403 to a User-Agent with "Bot" in it: Openverse thumbnails and photo files use "Atlaslope/0.2 (+repo URL)".
- App bundle carries only the photos it can show (`virtual:photo-data`, `src/facts/photoData.ts`): first three per place plus keys a tour
  or the cover names, without the Commons title. Home, Guides and country pages still use the full files at build time.
- Raw data: `data/raw` was wiped on the main checkout (#214 had committed a worktree link; #223 fixed the ignore rule). Now outside the
  repo in `~/Developer/Atlaslope-raw` (#229). Re-fetched 18 of 21 items (2.2 GB), manifest recorded with sizes and sha256.

## Not done (where it goes)
- First load 2,000,515 bytes: 515 over the 2 MB check with the Portugal photos (owner decision in the morning: fact sheets on demand like
  guides, about 55 KB freed, or another route). The photo PR waits on it.
- Places still without photos: Alenquer, DoTejo (nothing usable in Commons or Openverse). Thin: Carcavelos, Tavira, Portimão,
  Távora-Varosa, Beira Interior, Lafões, Encostas d'Aire (1 each).
- Raw: `world/` (needs shapely locally) and `build/` (CI data build) are caches; `countries/fr/cdc/` the France session adds to the manifest.
- `.github/workflows/data-build.yml` runs on any push that touches `Tools/data/remote_build.sh` and rebuilt `data/added-boundaries.geojson`
  without the newer boundaries on #229 (LeadBot kept main's file). Worth a guard.
- Release: guides (#214) and raw fix are on main; publish only on "publish release N".

## Numbers
- Helpers this round: about 0.83M tokens new (spend log). LeadBot main thread: long session, re-reads dominate [A].
