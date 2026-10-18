# Code review: PR #73 polish pack (claude/polish-pack-uy8nb0), read-only, diff read not run

Verdict: MERGE AFTER FIXES. 0 blockers, 3 should fix, 4 notes.

## Should fix
1. Hero photo after the view transition starts blurred (src/cards/Cover.tsx:43 vs src/pages/Mosaic.tsx:307-310, src/pages/RegionPage.tsx:57; src/styles/ux.css:8,20-21).
   The teaser card loads photos/480 (sizes "100vw / 25rem"); the full page asks 800 or 1200 (sizes 100vw / 72rem), a different file the cache does not have. Before, both used the same file and it showed at once. Now the hero Img starts in ph-wait (blur background) or ph-fade (animation ph-in, filter blur 12px), and the "hero" shared-element snapshot is taken then. Scenario: tap "Open page" on a place: the card photo morphs into a blurred hero that then sharpens. Fix: let the page Img reuse the card's already loaded candidate (e.g. a prop to treat hero as eager and skip fade when the same src was shown, or keep the 800 candidate in the card sizes), and check the vt hero in a screenshot.
2. data/SOURCES.md:59 (Typefaces row) is not updated for the new 132 KB public/fonts/newsreader-latin-opsz-normal.woff2 (source package/variable build, date, licence). Rule: every file under public/ fonts/data has a paper trail.
3. index.html:29-30 dropped the 600 file from @font-face. Browsers that skip "woff2-variations" fall back to the 500 file only, so the 600 weight (brand b, .pg-top .brand b, headings) is faux-bold. Keep the 600 face as the fallback (a second src does not help: the weight range covers it), or use format("woff2") tech(variations).

## Notes
4. src/cards/Img.tsx:184-203 state is not reset when photo.src changes without a remount. Cover and Mosaic key by src, but RegionPage Tile (:22) and Cards TileRow/ZoneRow do not. After onBroken swaps a tile's photo the new image has state "done"/"fade" (no blur preview, no sharpen-in). Fix: key={photo.src} inside Img's call sites or reset state on src.
5. Img.tsx: state "fade" never reaches "done", so the blur background stays under every loaded photo; harmless for opaque WebP but wasteful and the ref only sets "done" at mount. No onError at Cards.tsx:64,146 and PlacePage.tsx:318 (alt="" images): a missing file leaves a blurred swatch instead of the old fallback tile. Acceptable, say so.
6. src/styles/pages.css:486 .pg-ttl is absolutely placed after the brand with max-width clamp(0,50vw-25rem,14rem): at 1024 px about 112 px minus 1.8 rem padding, so most names truncate to a few letters, and it sits next to the centred search. Not seen in a screenshot; check at 1024 and 1280. Reduced motion and aria-hidden are handled; the title is not announced (fine, the h1 is).
7. Weight: three extra copies of ~51 MB public/photos and the photo workflow (data-photos-ship.yml) now reruns the networked photo_ship.py when only photo_sizes.py changes. Consider a separate trigger. sizes values match the CSS slots checked (pg-mosaic 76rem, 66/50/34/25 vw, 3.6 rem tiles); the 12rem photo figure and 24rem region tile are guesses I did not measure.

## Checked and fine
Animation shorthand conflicts: .pg-mosaic img.ph-fade (pages.css:209) wins on specificity and re-sets timeline and range, so ph-in runs on time and pg-drift on scroll. Reduced motion and @supports gating correct; .rcover overflow:clip is explained. photosOf/sizesOf tolerate a photo with no entry; unit test covers every key. Python script is idempotent and offline. Cached image: ref callback marks "done" for complete images.
Not run: UI tests, screenshots, Safari/Firefox behaviour of initial-letter and view-timeline.
