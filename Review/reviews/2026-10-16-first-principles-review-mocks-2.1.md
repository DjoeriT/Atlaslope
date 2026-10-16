# First principles review of the Paraje mock-ups, round 2.1

Reviewer: a fresh Fable 5.1 session, 16 Oct 2026. Read: the product brief, the six mock pages, `assets/app.js`, `assets/app.css`, the mock data. Not changed: anything in the mocks.
Tags: [V] verified in the files, [O] observed, [R] reported from memory, not re-checked, [A] assumed.

## The one-line verdict
The mocks are a good atlas and a thin quiz. Round 2 solved "does it look real". It has not yet solved "does it make the geography stay", which is the job in the brief. The gap is not on the screens, it is in what the quiz knows and asks.

## What is right and should stay
- One map, Explore and Quiz as two modes on it, the floating card. This is the whole idea and it works. [O]
- Real boundaries, real terrain, real type. The "vibecoded" problem is gone. [O]
- Feedback on a wrong answer names the right place and a reason to remember it ("east of Valladolid"). That is the one piece of learning science already in. [V]
- Misses circled where they really are on the results map. [V]

## Findings, in priority order

### 1. The quiz has no memory, so it cannot beat flashcards
The brief's own success measure is "locate 40 DOs after three sessions". The mock quiz picks questions at random per session and keeps a running percentage ("DOs seen 42 of 70", "Right 61%"). [V results page] Nothing decides what to ask next from what you got wrong last week. "Better than last time (5/10)" compares two random samples, which is noise, not progress.
Why it matters: retention comes from being asked again about the things you miss, at growing intervals. Anki does that with zero geography. A map quiz without it is a prettier Anki with worse scheduling, and the brief's risk ("opened twice, then a reference") comes true.
Fix: a per-DO memory (a handful of boxes, Leitner style; due today or not). "Start quiz" picks what is due, misses come back sooner, known DOs fade out. Results show "DOs you can place: 31 of 70" (right on the last two attempts), not a lifetime percentage. This is small code, maybe a day, and it is the product. Effort [A].

### 2. The miss leads nowhere
Results list the three misses as text, not links. [V] The only ways out are "Retry missed" and "New quiz". The student who just mistook Toro for Rueda cannot tap Toro and read its card. Retest without a look in between is the weakest form of study.
Fix: every miss is a link to its Explore card, and the card has a "Test me on this again" button. The loop is miss, look, retest. One change, highest value per line of code after finding 1.

### 3. The exam-shaped question type is missing
Setup offers three types; two are mocked. "Region, climate or soil" has no screen. [V] It is the one closest to the exam, which is text multiple choice on facts [R], and the only type that joins the atlas (place) to the manual (facts). "Show the place, ask the fact" is where Paraje stops being a geography toy.
Fix: mock it before anything is built. Same choices layout as "What is this?", question like "The highlighted DO: which soil dominates?" with the map tilted and the soil layer off until the answer.

### 4. Three leaks let you pass the quiz without knowing anything
- "Find X" has a type-the-name field with every DO name in a datalist. Typing the name from the question answers it. [V 03-quiz-find, lines 113 to 114] It was added for keyboard and iPad. It also makes the question free.
- After a tap, the status line says "You picked a DO in the Duero Valley" before Confirm. [V line 116] Tap around until the region matches, then confirm. The hint is given before the answer is locked.
- The search box is on every quiz page. [V] Not functional in the mock [O], but when it works it is a map of the answer.
- Quiz mode hides DO names, and with them every city, river and mountain label. [V app.js line 101 and 109 to 110, pages set hideNames] The anchors the student must learn against (the Duero, Valladolid, the Sierra de Cantabria) vanish, so "find" becomes shape matching, not geography. The exam asks relative location [R].
Fix: drop type-in on "find" (keyboard users get the choices variant, or a list of four map positions), hide the status hint until Confirm, hide search during a quiz, hide DO names only.

### 5. The macro-regions are the mock author's, not the course's
README says so. [V] Bierzo sits under Green Spain in the data [V]; the course places it with Castilla y León [R, not re-checked]. Six "Vino de Calidad" areas (Cangas, Granada, Lebrija, Sierra de Salamanca, Valtiendas, Valles de Benavente) sit in the pool as equals of Rioja. [V data] A "which macro-region" question built on the wrong grouping teaches the wrong answer for the exam, which is worse than no question.
Fix: before any region question ships, one person checks the grouping and the DO list against the Spanish Wine Scholar table of contents (facts, not wording) and the pool gets a weight per DO (core, secondary, ignore).

### 6. Set-up is three decisions where one tap should do
Area, types, count every time. [V] The common case is "continue studying". With finding 1 in place the primary button is "Continue (12 due)" and the three groups move under "Custom quiz".

### 7. Progress lives in one browser
"Stored in this browser only." [V] The brief's student studies at a desk and on an iPad. Two histories, two schedules. Decision for the owner: accept for v1, add export and import, or a small sync (needs his OK, it is a networked service).

### 8. Explore tells what, not why
The Rioja card gives three one-line zone facts and placeholder photos. [V] The brief's third job is "why does the wine taste the way it does". The 3D terrain shows the Sierra de Cantabria; the card does not say "rain shadow, 300 mm less than the coast" or give altitude ranges per zone. Numbers in the card, and a "Why" line per DO, are what make it an atlas rather than a legend. Lower priority than 1 to 5, but it is what the deep region promise means.

### Smaller, for the mocks thread
- Skip: unclear whether it counts as a miss. Decide and show it.
- After a wrong "find", show both the tapped DO and the right one with labels, not only the right one. [V only right one selected]
- "What is this?" flies to a fixed zoom with the whole neighbourhood outlined. For a tiny DO ringed by one big one (Priorat in Montsant) the outline is the answer. Vary zoom and dim neighbours.
- "Rioja (3 zones)" is an Area chip, but no zone question is mocked.
- The quiz count (10 or 20) and "DOs seen 42 of 70" use 70; the data has 73 polygons. Cosmetic, but it shows the pool is not pinned yet.

## What this review did not do
Not opened in a browser with satellite tiles (blocked from this container), so layout, dark mode and 3D are judged from markup and CSS only. [O] Not checked the SWS syllabus; every claim about it is [R] or [A].

## Context, upside, risks, effort
Context: round 2.1 is visually done; the quiz logic is where the product is decided.
Upside, measured: the brief's own test, the owner's score on 40 DOs at session one versus session three. Findings 1 and 2 are what make session three differ from session one. Finding 4 is what makes the score honest.
Risks: finding 5 (wrong taxonomy) is the one that can teach wrong answers. Finding 1 adds state and a schedule to a static site; keep it in localStorage, plain JSON, exportable.
Effort [A]: findings 1, 2, 4 and 6 together are two or three days of build after a one-day mock. Finding 3 is a mock first. Finding 5 is an hour with the course contents and no code.

## Decisions (owner, 16 Oct 2026, on the cards in the review thread)
1. Quiz memory: spaced boxes per DO (Leitner style); Start quiz asks what is due.
2. Type-the-name field on "Find X": dropped; keyboard users get the choices variant.
3. Map during a quiz: hide DO names only; rivers, cities and ranges stay.
4. "Region, climate or soil" question: mock it now (round 2.2), after the taxonomy check against the course contents.
5. Progress: browser only in v1.
