# Release 32: what to test

## General (every release)
Open https://atlaslope.com/ in Chrome or Safari on a Mac or iPad. Reload once with a hard refresh if a page looks stale. Anything odd: a screenshot plus the page address and what you expected is enough.

## This release
1. **Meseta.** Open Vinos de Madrid. The trail reads "Spain › Meseta" on one line, with no stray ›.
2. **Ledes.** Read three place cards (Vinos de Madrid, Manchuela, Pla i Llevant): two short sentences each, no comma chains.
3. **Citation.** Under the lede: "Documento único … · 2014 · pp. 5–6".
4. **Photo hover.** Hover the cover photo: only the photographer and licence, no file name.
5. **Search.** Type "Extremadura": Meseta comes up.
6. **Photo credits.** Under photos: "Name · CC BY-SA 4.0 · resized", no "Unknown author" twice, no "→ (Talk)", no "from City, Country".

## For you
One PR (#97) from `claude/place-card-cleanup-wmnr3e`. Handoff `docs/handoffs/2026-10-18-place-card-commas.md`. Checks: CI on PR #97 (check plus four UI parts); ReviewBot `Review/pr-97-review.md`, small findings fixed. Release 31 tester note moved to `Review/archive/`.
Not verified: Safari, iPad, real phones.
