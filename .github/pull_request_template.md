<!-- One slice per PR. Rules: CLAUDE.md. Words: docs/glossary.md. -->
## What changes for a visitor
Before:

After:

## Slice
- [ ] Small (fix or tweak, no new screen, data or content)
- [ ] Big
Every slice merges on green CI and publishes only on his words "publish release N".

## Done checklist
- [ ] Specs this change touches pass locally; CI runs the rest
- [ ] ReviewBot has reported, if it runs: new screen, new or changed user-facing copy, licence or legal question (small findings fixed in this PR). Fixes, tweaks and docs: green CI alone
- [ ] New UI: rough look shown early; checked against `Review/visual-style.md` at desktop, iPad and phone width, large text, reduced motion
- [ ] New data, layer, photo or fact source is in `data/SOURCES.md`
- [ ] New third-party host: added to `docs/operations.md`, `docs/privacy.md` (and the CSP once one exists)
- [ ] Handoff in `docs/handoffs/`; tester note `Review/release-N-what-to-test.md` if it ships
- [ ] Issue linked (`#n`)
