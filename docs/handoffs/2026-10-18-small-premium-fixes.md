# Small premium fixes (18 Oct 2026, release 33)

## Done
Five fixes from the approved mockup https://claude.ai/artifact/8gCGvXzZtu8iQg9JwAfDTB (owner "Yes", 18:06Z), PR #100:
1. Map labels show the first name of a two-name place: `mapName()` in `src/map/labels.ts`, also used for the Study answer labels in `createMap.ts`.
   Four places affected (Bizkaia, Getaria, Álava, Cataluña). Cards and guides keep both names.
2. Atlas panel (`src/cards/Cards.tsx` `Lede`): hover hints gone on the Spain and region cards; "Sources: A, B" tag; tile counts sentence case.
3. Study (`src/quiz-ui/Doors.tsx`): no date kicker; "Up next: N places in <region>." via `sharedRegion()` (`doors.ts`), "Up next: N new
   places." when they span regions, "Up next from your focus: …" with a focus; plain focus line "Following the course order." / "Focus: X."
4. Home SPAIN badge `.3rem` corners (`src/home/home.css`).
5. Home kickers "How it works" and "From the Rioja guide" removed (`index.html`); sources label normal case, 0.9rem, 500.
`Review/visual-style.md`: kickers only where they carry a fact; no pills anywhere.

## Decided
- "Jerez-Xérès-Sherry" stays whole on the map: it is the DO's one official name in three languages and no longer than the shortened Basque names.
- The "About" and "Guides" page kickers went too (owner card "Remove both", 18:16Z): they only repeated the bar item. `.eyebrow` CSS removed.

## Open
- Three-beat home heading: copy options for the owner (not started).
- Fly caption kicker "From the Rioja guide" on the map (FlyCaption.tsx) is untouched: it names the guide the caption quotes.

## Where
PR #100, branch `claude/small-premium-fixes-27gy5i`, tester note `Review/release-33-what-to-test.md`, review `Review/pr-100-review.md`.
