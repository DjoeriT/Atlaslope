# Review: polish slice (claude/project-thread-agx533 vs origin/main)

Verdict: **merge after fixes**. Blockers 1, should-fix 3, notes 5. (Read the diff, viewed all PNGs and webp; ran no tests.)

## Blockers
1. Docs missing. `git diff origin/main...HEAD -- docs` is empty: `docs/handoffs/2026-10-17-polish-icons-photos.md` does not exist, and `docs/PROJECT_CONTEXT.md` still says "Jerez and Manzanilla have no photos" (line 86) and "photo gaps in #42" (line 69). The card (CLAUDE.md: PR carries its own records) needs both before merge; point 4 cannot be checked for accuracy.

## Should fix
1. public/icon-maskable-512.png is the same artwork as icon-512 (no padding). The 4 vine rows and hill run to the right and bottom edges, so under a circular mask rows 3 and 4 are cut. Scale the artwork to the central 80% (background fill full bleed) so the content sits inside the safe zone. Viewed: [V].
2. data/SOURCES.md:19 is the generic photos row and covers the new files, but does not mention the category pass (`cats`), its candidates file or that picks came from it. One line would keep the trail complete. Also no entry for the icon files (own work, fine, but say so).
3. .github/workflows/data-photos.yml:21: switching `fill` to `cats` loses nothing on disk (photo-candidates-fill.json stays committed and is still in the `git add`), but the workflow no longer reruns fill, so a future change to fill logic is never exercised in CI. `cats` skips places already in the output json (Tools/data/photo_candidates.py, `if pid in done: continue`), so a rerun on the same branch is only sheets. Acceptable; say it in the handoff.

## Notes
- Colours: favicon.svg light #8C2340/#FFFFFF, dark #C9A54E/#141210 match app.css lines 8 and 18. Clip ids renamed so they no longer clash with the inline BrandMark ids. [V]
- Logo: favicon uses 4 rows (apple-touch 5) versus BrandMark's 5 rows, by design for small sizes; same hill curve extended. Thick strokes (5.5 vs 3.6). Fine at 32 px. public/favicon.svg lost its trailing newline (harmless).
- Metadata: all five PNGs have no EXIF, no text chunks, no ICC. webp files have only loop/background info and no EXIF. The webp "photos" metadata is clean. [V]
- Licence filter: `OK` regex (photo_candidates.py:40) still gates `cats` (line ~290); candidate licences in photo-candidates-cats.json are only CC BY 2.0/4.0, CC BY-SA 3.0/4.0, CC0, Public domain. All 7 shipped entries have artist, licence, licenceUrl and page; ribera-del-guadiana-3 has licenceUrl null (Public domain), which matches existing entries and the UI only links `page`. [V]
- Candidate quality: txakoli-alava was walked (376 seen, 0 kept), so it still has no photo; the handoff should say so. The `cats` run is tied to guessed category names (comment admits it).
- Photos (viewed): jerez-1 vineyard with Torre de Macharnudo, on-topic; jerez-2 vineyard rows, albariza soil, Trebujena (inside the sherry zone, label says Trebujena in the picks description); jerez-3 Viña la Riva, Jerez, on-topic. manzanilla-1 is a close-up of flor yeast in a butt: correct subject for sherry but abstract, no Sanlúcar sign and reads as an amber texture; weak as a cover image, fine as a stopgap. ribera-del-guadiana-1 Sierra de la Calera vines (Tierra de Barros area), on-topic, small watermark logo top-right; -2 red-soil vines near Zafra, on-topic; -3 Tierra de Barros field, on-topic. [V]
- Test (tests/ui/quiz-doors.spec.ts:175-181) checks sizes and PNG content-type, not the maskable purpose or dimensions; fine.
