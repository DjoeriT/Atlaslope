# Release 49: what to test (Mediterranean guides)

Eleven Mediterranean places get their Terroir guide: Valencia, Utiel-Requena, Alicante, Los Balagueses, Yecla, Jumilla, Bullas, Tharsys, Chozas Carrascal, Vera de Estenas and El Terrerazo.
The Guides page gets a Mediterranean row with its satellite tile.

1. Open the Guides page (hard-reload). A Mediterranean row lists 11 guides, with a satellite tile of the coast from Valencia to Murcia
   and the credit line under it.
2. Open Jumilla's page. It now has guide chapters; each chapter's source tag opens the Jumilla pliego.
3. In any Mediterranean guide, tap a fly-there pill. The map flies to the named place and Back returns to the chapter.
4. Open Yecla's fact sheet. Monastrell is the main grape and Viognier is in the other grapes.
5. Open Tharsys, Chozas Carrascal, Vera de Estenas or El Terrerazo. Each now has guide chapters. Chozas Carrascal, Vera de Estenas and El Terrerazo are built from the EU single document only (your OK); Tharsys from its pliego, the EU application text.

## For you
- Commits: the Mediterranean guides PR (`claude/guides-mediterranean`).
- Checks: guide validation (11 guides, 0 errors), unit tests guides, facts and home, `tests/ui/guide.spec.ts` (16 passed) locally; CI on the PR head.
- Open: unsure items in `docs/handoffs/2026-10-19-mediterranean-guides.md` (Vera de Estenas soil and yield limits, Chozas Blanco hedge, El Terrerazo 1,5 km).
- Not verified: Safari, iPad, real phones.
