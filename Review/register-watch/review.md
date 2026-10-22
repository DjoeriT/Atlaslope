# ReviewBot: PR #178 (EU register snapshot). Verdict: MERGE (one should-fix to the SOURCES row)
Blockers 0, should fix 1, notes 2. Read the diff; no network.
- SOURCES row [read]: URL, date 2026-10-21, method, kept fields all present. Terms cell is thin: "No terms statement found ... [A: not checked for the list endpoint itself]".
- Should fix: before merge, check the eAmbrosia legal notice once and replace the [A] with what it says, or state plainly "Commission Decision 2011/833/EU (reuse with acknowledgement), by analogy". Inferred: that decision covers Commission documents and data, so a snapshot of names, file numbers, status and OJ dates (facts) is low risk. Attribution to "European Commission, eAmbrosia" should be in the row.
- Script [read]: UA is "Atlaslope data check", no personal details. One URL constant, one urlopen; no other host is contacted (--oj reads the stored data). Timeout 120 s.
- Note 1: 90 KB and 3,185 lines of JSON committed; fine under the data size rules.
- Note 2: README line is accurate and gives the flags.
