# ReviewBot: PR 172 (copy and security look)
Verdict: merge after fixes (0 blockers, 2 should fix, 2 notes). Read only, nothing run.
Should fix
1. index.html (home tile, dd): "map tours, the map follows the text" is two ideas on one line. Proposed: "map tours" with the sub line "The map follows the text." on its own line, or just "map tours".
2. src/home/search.ts (kind label): `h.crumb.level` goes to the user raw (code word, lowercase). Check it reads as plain words ("region", "place"); map through strings if any level is a code term.
Notes
3. public/read-with-the-map/index.html:7-8: canonical "/map-tours/" is root-absolute (fine on atlaslope.com, would break under a subpath host). Use the same relative "../map-tours/" for consistency. noindex plus canonical is a mixed signal but harmless. The meta refresh is relative, so https://atlaslope.com/read-with-the-map/ goes to /map-tours/. Fixed target, no query use, no open redirect. No JS; add a viewport meta if the fallback link is ever seen on a phone.
4. search.ts: input has aria-label and type=search; results are real links, ArrowDown/Up/Escape/Enter work (read). The list has no combobox/aria-expanded, acceptable. Enter with no match does nothing silently (the status text shows, so fine).
Confirmed (read)
- Naming consistent: button "Map tour", page/bar/footer/home "Map tours"; AtlaSlope in titles. No user-visible "Read with the map" left in the diff (remaining hits are docs/comments or the glossary "avoid" column).
- Search escaping: only textContent and createElement; href built from data ids via template, never from typed text. No innerHTML. Safe.
- Copy of the page head unchanged ("Every guide here is a walk through one place.").
