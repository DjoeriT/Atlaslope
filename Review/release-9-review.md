# Release 9 review (design + code), c18b463..83566e1

Verdict: merge after fixes. Blockers 0, should-fix 4, notes 6.
Checked: diff read (src), CSS read, 15 screenshots viewed (card, page, region, nophoto, large text; light/dark; desktop/iPad). NOT run: Tools/check.sh ui, unit tests, mocks side by side (mock files not opened), keyboard walk-through, page at 125% below the fold.

## Should-fix
1. Region page tells people to use a map that is covered. src/strings.ts:42 `regionLede` ends "Tap a place on the map or in the list." and is reused at src/pages/RegionPage.tsx:66; the page covers the map (map is inert, App.tsx:96-99). Dead-end wording (region-desktop-dark.png). Fix: a page-specific line, e.g. `${n} places, in course order. Tap a place to open it.` (wording is the lead's call).
2. Links on the full page drop you off the page. Zone, "Also within", "Study region" and "Next in course" links (PlacePage.tsx:249,265,269,274-276) and region tiles (RegionPage.tsx:21,79) go to the map card, not that place's page, and nothing says so. Back from the card remounts the page at the top, so reading position is lost. Fix: either send page-to-page links with `page: true` (keeps people reading; "Back to map" stays the way out), or label them. Needs an owner/lead choice; I recommend page-to-page for zones and tiles.
3. Facts without a source link in the "at a glance" box (PlacePage.tsx:92-98, 285-291) and the teaser glance row (Glance.tsx). Altitude "360-890 m", grapes, wine types are shown with no source link; visual-style says a highlight links to the section that holds its source. Fix: make each value row link to its section (#grapes, #land) via the existing jump handler, or add a one-line "Sources are in the sections below" link. Same for the card's glance cells.
4. Region page cover repeats the only tile photo. RegionPage.tsx:44 takes the first photo of the first place; with one place (Rioja) the cover and the first tile are the same picture stacked (region-ipad-light.png). Fix: when `learn.length` is 1, pick the cover from the place's second photo, or use the last photo of the list for the cover.

## Notes
1. No-photo place page (nophoto-desktop-light.png): the name cover repeats the h1 directly above it, and its rule is brown (Andalucia region colour). visual-style says "no browns" for chrome; map region colour is arguably allowed, but the repeated name looks like a bug. Fix: smaller name cover or a quiet "No photo yet" line under it.
2. Rioja cover photo shows a road and a car (Mosaic first photo; page-desktop-light.png). visual-style.md Photos: no roads as first photo. Reorder the Rioja photo list (data, with SOURCES.md entry if any change).
3. Jump bar links all share one href (the page hash, PlacePage.tsx:126), so "copy link" and open-in-new-tab give the page top, not the section. Fix: href `#overview` style ids are not possible in a hash router; acceptable, but aria-current is set only on click (no scroll spy). Low priority.
4. "Show Jerez-Xerez-Sherry on the map" wraps to two lines in the glance box (nophoto-desktop-light.png). Fine, but 21rem box could use `text-wrap:balance`.
5. iPad map card top bar: search placeholder cut "Search places anc" (card-ipad-dark.png). Pre-existing layout, not from this release; note only.
6. Pages have no Escape-to-close; "Back to map" covers it. region role="region" aria-label duplicates the h1 (RegionPage.tsx:50); harmless.

## Checked and fine
- Contrast: ink3 (#6E6E6E on white, #9A968F on #121212) clears 4.5:1 for credits; credit pills sit on paper, not over the photo. [read]
- Photo credits are visible and linked on card, mosaic ("Photos:" line), region cover and tiles. Alt text comes from data. [read, viewed]
- Targets: jump bar 3rem, rback 2.75rem, rows 2.75rem. Focus ring on h1/h2 via :focus-visible, global ring on links. Map made inert while a page is open (App.tsx:98). [read]
- Charts: SVG has role=img with a text label; legend aria-hidden duplicates it; words carry the meaning, not colour alone. Tints are accent-only. [read]
- `sentences()` cuts only at sentence ends, first sentence kept whole, so no mid-sentence cut on tiles. [read]
- Broken-image fallback in Mosaic, Cover and Tile (drops out, name cover when none left). [read]
- Large text (place-desktop-light-large.png): top of page fine, nothing clipped; lower sections not seen. [viewed]
- Both "Back to map" and "Show X on the map" exist on the page: owner-approved, not raised.

Verdict: merge after fixes (should-fix 1, 3, 4 are small; 2 needs a lead/owner choice, or name it in the tester note).

## LeadBot follow-up (17 Oct)
- Should-fix 1, done: the region page has its own line ("Open a place to read its page"), no mention of the covered map.
- Should-fix 2, done (LeadBot default): links inside a page stay in reading mode. Zones, "also within", study region, "All places in this
  region", "Next in the course" and region tiles open the page of the place or region; only "Back to map" and "Show on the map" go to the map.
- Should-fix 3, done: every "at a glance" value has a "Source" link that moves to the section holding its source.
- Should-fix 4, done: the region cover takes a photo no tile shows (a second photo of a place), else the first place photo.
- Notes kept for later: no-photo cover repeats the name; Rioja's first photo shows a road (photo issue #42); jump-bar current-section marking;
  Escape to close a page; iPad search placeholder clipping (existed before).
- Checks after the fixes: Tools/check.sh ui, 232 unit and 67 UI tests green.
