# Meseta unsure fact-sheet edits, slice B (19 Oct 2026)

## Done
- Settled the six unsure items from `2026-10-19-doors-case-fix.md` against their extracts; decisions in
  `Review/guides-pipeline/meseta/fact-sheet-fixes.md` ("unsure items, decided in slice B").
- Applied in `content/facts/meseta.json`: Campo de Calatrava `soil.text`, Finca Élez `why.text`, Campo de la Guardia grapes
  (main p4, others p8), Manchuela `styles.text` (+ cites p2, p3), Méntrida `famous.styles.1.text`.
- Kept not applied: Uclés `grapes.main` (no secondary list in the pliego; batch-1 rule).
- `npm test`: 308 of 308 pass [V].

## Open
- Still marked unsure in the log, not in this slice: Valdepeñas `grapes.main`/`others` (pliego has p6 PRINCIPALES and p11 SECUNDARIAS,
  so the batch-1 rule would allow it) and Vallegarcía `grapes.others`. Owner to say whether they go in a next small slice.
- Not checked in the app: the guide pages show the new lines (data-only change, covered by the facts check).
