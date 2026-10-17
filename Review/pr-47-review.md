# Review: PR #47 (claude/social-share-preview-vreoiv at b1ba5de)
Verdict: merge after fixes (0 blockers, 3 should fix, 2 notes).

Checked (read + grep, whole repo minus docs/handoffs, Review/archive, data.js, geojson, maplibre): the diff, old-phrase grep, tests.

## Handled consistently (ran grep)
- Title: index.html:7, src/strings.ts:6 (pageTitleHome), tests/ui/cards.spec.ts:161,165, tests/ui/placeholder.spec.ts:10 all say "AtlaSlope · The Wine Study Atlas". No test still has the old title.
- Welcome lede: src/strings.ts:182 new wording; no test asserts on the lede text (grep found none).
- Manifest description: public/manifest.webmanifest:4 opens with the decided phrase. No test reads it.
- Place titles (pageTitle) unchanged. og:/twitter: tags in index.html untouched (og:title "AtlaSlope", og:description already the new phrase). App.tsx unchanged, so no behaviour change beyond strings.

## Findings
Blocking: none.

Should fix
1. docs/PROJECT_CONTEXT.md:11 still states the old tagline and "wine lovers first, exam students second", and :94 records the home title as "Atlaslope · The wine atlas that quizzes you". Now contradicts the decision; the repo rule says context is updated, and the PR is meant to carry its own records. Add a dated [O] line (do not rewrite history in :94).
2. README.md:3 (first user-facing line of the repo) still "The wine atlas that quizzes you. For passionate wine lovers first and exam students second". Align.
3. Review/builder-brief.md:8 says the same; it is a source of truth for builders, so note the change there (or a pointer to scope).

Notes
4. docs/scope.md:9 (Job) is accurate to the decision (exam students first, tab title, link previews, welcome text). But line 10 "Spine" still says "even though exams come second" (docs/scope.md:10): now contradicts line 9. Small edit: drop "even though exams come second".
5. Review/mock-atlas-v3/17-first-run.html:5 and src/gen3.py:199 hold the old welcome lede. Approved mocks are not to be edited here; the built welcome now differs from the mock in its first sentence, so name it in the tester note (the new lede also drops the mock's "and keep it: ... asks again" tail, which was already the case before this PR).

Missed user-visible places: none in src/, public/, index.html, tests.

## LeadBot follow-up
- 1 to 4 done in the next commit. 5: mock left unchanged, gap named in the handoff.
