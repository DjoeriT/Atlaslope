# Austria plan (owner approved, 22 Oct 2026, issue #149)

Decisions `docs/architecture-decisions.md` #79-#84, all option A [O]. No country report yet: every fact here is [A] until the desk report.

## Phases
0. Gate: Germany pilot merged (#79).
1. Desk report (one Sonnet helper, ~0.1M): DAC list against eAmbrosia, WSET L3 Austria names, outline and Rieden layers per state,
   terrain and imagery licences. Re-ask only a decision it contradicts.
2. Prep slice, data only (as Germany prep): specs, licences, pilot outlines, German text through `extract.py`.
3. Pilot: Wachau and Südsteiermark at `/at/<place>/`; Rieden as zones where a layer exists (#82). Screenshots, ReviewBot, one PR.
4. Rest: the other DAC areas by state (Niederösterreich; Burgenland; Steiermark and Wien), each on the owner's word.

## Effort (tokens)
Rate 0.75M a guide [V, Portugal]; engineering [A]. Pilot ~6-11M; rest ~16 x 0.75M = ~12M plus outlines ~2M. About 90 percent re-read.

## Risks
DAC count and Rieden layers unchecked; nine states, nine portals; Vinea Wachau and ÖTW are private (text only, #83).
