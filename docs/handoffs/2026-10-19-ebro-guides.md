# Ebro guides (19 Oct 2026)

- Shipped (PR #119, `claude/guides-ebro`): 11 guides: Navarra, Somontano, Campo de Borja, Cariñena, Calatayud, Ayles, Urbezo, and the
  Navarra Vinos de Pago Otazu, Prado de Irache, Arinzano and Bolandín. Plus the Guides-page tile `public/guides/ebro.webp` (138 KB,
  re-encoded with Pillow because the ImageMagick build ignores `-quality` for WebP) and the roster in `tests/unit/guides.test.ts`.
- Sources: the Aragón and Navarra pliegos (EU PDO documents on file in `Review/sources/fetched/`); Urbezo cites its existing pliego text.
- Owner decision needed: the four Navarra Vinos de Pago are written from the current EU single documents only. navarra.es refused every
  fetch and INTIA does not host their pliegos. `docs/guides.md` requires a pliego for Terroir, so these four need the owner's OK, or a
  pliego fetch through a GitHub Actions run.
- Navarra's pliego (INTIA file 2026-05-21) carries no approval stamp; the 2024 BON text returned 404, so versions were not compared.
  Somontano uses the approved 2012 pliego; the 2026 amendment (AM01) is still in consultation and is not used.
- Fact sheet: 19 sure edits applied to `content/facts/ebro.json` (navarra 2, prado-de-irache 1, somontano 2, campo-de-borja 2,
  cariñena 2, calatayud 1, ayles 3, urbezo 6 cite fixes). UNSURE edits left for the owner: navarra `why.text` (acidity wording) and
  Crianza/Reserva colours; otazu `tastes.text` (young reds only); prado-de-irache `climate`/`why`/`soil`/`grapes.others` synonyms;
  bolandin `styles.text` and others; campo-de-borja `grapes.main`; cariñena `grapes.main` and `styles.text`; calatayud `styles.kinds`
  aguja and the Superior "mineral" note; ayles "crianza red"; urbezo whites "lively"; arinzano cites lack page numbers.
- CI: `ui (1/4)` failed because `tests/ui/guide.spec.ts` used Navarra as the "no guide" place; it now uses Jumilla.
- Tokens measured: workflow 10.38M re-read + 0.88M new.
