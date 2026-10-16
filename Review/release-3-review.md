# Release 3 code review (claude/release-3-atlas-kupj5t vs origin/main)

**Verdict: merge after fixes.** Blockers 0 · should fix 4 · nits 7.

Ran on a `git archive` copy: `Tools/check.sh ui` all green (typecheck, 64 unit, 13 UI tests, debug-flag grep clean, gzipped download 1,035,336 bytes against the 2,000,000 limit) [V]. The data-ledger step ran without `.git`, so it proved nothing here. A throwaway Playwright probe (deleted afterwards) checked focus, back and Escape [V].

## Should fix
1. **Keyboard focus falls to `<body>` when the card type changes.** `src/cards/CardShell.tsx:119-124` with `src/app/App.tsx:138`. Going Spain › region › place swaps `SpainCard`/`RegionCard`/`PlaceCard`, so `CardShell` remounts, `first` is reset and the title never gets focus. The probe got `BODY` both after Spain›region and after region›place [V]. The UI test only covers place›zone (`tests/ui/cards.spec.ts:109-111`). Fix: move focus from App when the selection changes (skip only the first render), or keep one `CardShell` instance. Then add the Spain›region case to the test.
2. **Escape in the search results loses focus.** `src/cards/SearchBox.tsx:191` (and `:175`). The list unmounts while focus is inside it, and the probe got `BODY` [V]. Fix: put focus back on the input.
3. **Boundary data failure is a dead end.** `src/map/createMap.ts:111` swallows a failed fetch of the four GeoJSON files. The map shows no places and no note, and there is no retry. Fix: add an `onDataFailed` event and show a note from `strings.ts` [R].
4. **Targets below 44 px.** `src/styles/app.css:91`: breadcrumb links are `min-height:1.6rem` (about 26 px). The study-region and "also within" links in `Cards.tsx:79-80` have no minimum at all. They pass WCAG 2.2 AA (24 px) but break the project's 44 px rule. Check this against the mock [R].

## Nits
5. `src/cards/nav.ts:59` and `src/cards/Cards.tsx:34` use `countries[0]` levels for every crumb. A second country's crumbs would be given the wrong kind, which goes against card 1's "joins with data only". Use the crumb's own country [R].
6. `src/map/layers.ts:61-63`: fallback only happens if no imagery tile ever loaded. If the key is revoked or the quota runs out mid-visit, the user gets blank tiles and no note. This may be acceptable, but say so in a comment [R].
7. `src/map/createMap.ts:203-205`: `select()` is never called. Dead code [R].
8. `src/debug.ts:149-159`: `fixture` is returned but nothing reads it. `?fixture=` only switches tiles off (`src/map/tiles.ts:9`). Drop the field, or wire up the dataset it claims to pick [R].
9. `Tools/check.sh:42`: the pattern `fixture=` would miss `get("fixture")`. The production bundle has no `fixture` string at all today [V], so the grep could match plain `fixture` [R].
10. `.github/workflows/live-map-check.yml:179-215`: the script is written to one place and then copied to another. Write it once at the repo root [R].
11. `src/app/TopBar.tsx:52`: Explore `href="./"` reloads the page and drops the open card [R].

## Checked, no finding
- **URL and history** [V/R]: `go` pushes one entry per card. The camera uses `replaceState`. Back restores the card (the probe went back to `#region=green-spain&view=...`). Unknown ids fall back to Spain. `parseView` bounds-checks. A restored view is not framed over (test plus `skipFrame`).
- **Imagery failure** [R]: with no key, or tiles off, the note shows at once. Three satellite errors with nothing loaded switch to the atlas paint and hide the satellite layer, so it stops fetching. The menu disables satellite with a reason. The note can be dismissed (`role=status`).
- **Live map check** [R]: runs on `workflow_run` of `publish` (name matches) when it succeeds, and on demand. It counts OK responses for Esri `World_Imagery/tile` and Terrarium. It fails if either count is zero, uploads the screenshot `if: always()`, and logs failed URLs with the query string removed, so the token is never printed. Not run.
- **Key** [R]: read only from `import.meta.env.VITE_ESRI_API_KEY` (`createMap.ts:43`). No logging. Only `.env.example` is tracked. CI takes it from secrets. The key is visible in every tile URL by nature, so make sure it is referrer-restricted in the Esri dashboard [A].
- **Network** [R]: the only tile hosts are Esri and Terrarium on AWS, and fonts are self-hosted.
- **Debug flags** [V]: the production build is clean, and the UI tests use a separate `dist/uitest` build. Publish builds in a fresh job, so `uitest` is never deployed [R].
- **Tree validation and search** [R]: correct. Also checked: noindex meta and `robots.txt` are present, interface text lives in `strings.ts`, and screen-reader labels are on the icon buttons.

## Not checked
Real satellite and terrain loading; the live workflow on GitHub; the MapLibre tile-error event shape (I assume tile errors carry `sourceId`); the mock for visual match; the unit-test contents beyond passing; `domain-check.yml` and `manifest.json` changes (outside the cards).
