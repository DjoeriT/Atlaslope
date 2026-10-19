# Release 49: what to test (Mediterranean guides)

Seven Mediterranean places get their Terroir guide: Valencia, Utiel-Requena, Alicante, Los Balagueses, Yecla, Jumilla and Bullas.
The Guides page gets a Mediterranean row with its satellite tile.

1. Open the Guides page (hard-reload). A Mediterranean row lists seven guides, with a satellite tile of the coast from Valencia to Murcia
   and the credit line under it.
2. Open Jumilla's page. It now has guide chapters; each chapter's source tag opens the Jumilla pliego.
3. In any Mediterranean guide, tap a fly-there pill. The map flies to the named place and Back returns to the chapter.
4. Open Yecla's fact sheet. Monastrell is the main grape and Viognier is in the other grapes.
5. Open Tharsys or El Terrerazo. They still show the fact sheet only, with no guide chapters.

## For you
- Commits: the Mediterranean guides PR (`claude/guides-mediterranean`).
- Checks: guide validation (7 guides, 0 errors), unit tests guides, facts and home, `tests/ui/guide.spec.ts` (16 passed) locally; CI on the PR head.
- Open: Tharsys and El Terrerazo held for your decision; Chozas Carrascal and Vera de Estenas not written (no pliego).
- Not verified: Safari, iPad, real phones.
