# Release 49: what to test (Mediterranean and Canarias guides, home study line)

22 places get their Terroir guide: 11 Mediterranean and 11 Canarias.
The Guides page gets a Mediterranean row and a Canarias row, each with its satellite tile.
The home hero gets one more sentence.
The guide count goes from 62 to 84.

Hard-reload first (Cmd+Shift+R).

1. Open the Guides page. A Mediterranean row lists 11 guides, with a satellite tile of the coast from Valencia to Murcia
   and the credit line under it. A Canarias row lists 11 guides with a satellite tile of the islands.
2. Open Jumilla's page. It now has guide chapters; each chapter's source tag opens the Jumilla pliego.
3. Open Yecla's fact sheet. Monastrell is the main grape and Viognier is in the other grapes.
4. Open Tharsys, Chozas Carrascal, Vera de Estenas or El Terrerazo. Each now has guide chapters. Chozas Carrascal, Vera de Estenas and
   El Terrerazo are built from the EU single document only (your OK); Tharsys from its pliego, the EU application text.
5. Open Lanzarote, Gran Canaria, La Palma, El Hierro and La Gomera. Each has "Why X tastes the way it does" with its parts, a short summary and sources.
6. Open the five Tenerife places: Tacoronte-Acentejo, Valle de Güímar, Valle de la Orotava, Ycoden-Daute-Isora and Abona. Same shape.
7. Open Islas Canarias (the all-islands DO, outside Study). It now has a written Terroir section; it still shows no photos, charts or Test me.
8. In any new guide, tap a fly-there pill. The map flies to the named place and Back returns to the chapter.
9. Open the home page. Under the headline the subline now ends with "The wine study atlas for WSET and Wine Scholar students."

## For you
- Commits: PR #123 (Mediterranean guides), PR #124 (Canarias guides, with `main` merged in), PR #125 (home study line).
- Checks: CI on each PR head, reused by the publish run.
- Open: unsure items in `docs/handoffs/2026-10-19-mediterranean-guides.md` (Vera de Estenas soil and yield limits, Chozas Blanco hedge,
  El Terrerazo 1,5 km) and unsure fact-sheet edits in `docs/handoffs/2026-10-19-canarias-guides.md`.
- Not verified: Safari, iPad, real phones.
