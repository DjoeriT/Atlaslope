# Audience, goals and launch (#156), first principles
AnalystBot, 21 Oct 2026. Tags: [V] verified this session, [R] report or search snippet, [A] assumed, [O] owner said.
Study content (WSET 2/3, Spanish Wine Scholar) is in the Study report, not here.

## 0. Facts that frame the answer
- Site is live at atlaslope.com, `noindex`, link-only [V, page head]. Title "Know the land behind the glass", description says "Free, in your browser" [V].
- scope.md: "For the owner and friends, free" [V]; Job: study atlas for WSET and Wine Scholar students, quiz-with-memory is the spine [V]. PROJECT.md positioning: guides are a general wine reference, Study is a small "Test me" link [V]. These two disagree on who comes first; the share card carries both.
- Content: 106 places, all with a guide; 2 map tours (Rioja, Priorat), 11 more planned [V, PROJECT.md]. Spain only. English only (#160).
- Not built: Sentry, PostHog, privacy note, offline (#16, deferred "to just before friends launch") [V]. Donation line on home with no way to give [V]. Not tested on Safari, iPad, real phones [V].
- Budget rule: up to EUR 100/year including domain; above that, ask [O, scope.md round 6].
- Licence: code MIT; writing all rights reserved; photos Commons with credits [V, NOTICE.md].

## 1. Who it is for
Market size (outside, light):
- WSET reported 108,557 candidates in 2018/19 and 85,487 in 2016/17, all levels, no split by level; UK, China, US are top markets [R: https://wineindustryadvisor.com/2019/08/20/wset-reports-record-annual-candidate-figures-in-50th-year/ , https://www.thedrinksbusiness.com/2017/08/demand-for-wine-and-spirit-education-at-record-high/ ]. No newer year found. Levels 1-2 grew fastest in an older article [R].
- Spanish Wine Scholar launched 14 Oct 2019; guild pages quote 1,152 or 1,651 graduates in total (the pages disagree) [R: https://www.winescholarguild.com/certifications/scholar-programs/spanish-wine-scholar ]. Course about 100 hours, 100-question exam, from about $945 [R]. So the Spain-specific cohort is small: low thousands ever, a few hundred per year [A].
- Course fees show students already pay a lot: Level 3 about CAD 1,800 (Guelph), DKK 14,500 (Copenhagen), S$2,616 [R: https://www.uoguelph.ca/hftm/wset-level-3-award-wines , https://shop.hrs.dk/shop/11-kurser/1303-wset-level-3-award-in-wines , https://class.shatec.sg/course/wset-level-3-award-in-wines ]. A free tool competes with nothing they pay for; it sits beside the course.
- Tools they use [R]: Brainscape decks for WSET 3 (https://brainscape.com/subjects/wset-wine-level-3), FlashWine iOS app for WSET 3/4 (https://apps.apple.com/app/id6755633576), Wine Maps by Jonathan Lord, about 130 maps, paid, offline (https://apps.apple.com/mx/app/wine-maps/id552821843). My search did not find "SommGeo" by that name, nor Quizlet, r/WSET or Facebook group sizes; scope.md's SommGeo claim is [R, owner's earlier check] and I could not re-verify it. Not found: any study tool that links a place's soil, slope and climate to the wine. That gap is the product's real edge [A].
- Where they gather: not verified (search did not index Reddit or Facebook). Plausible: r/WSET, r/wine, WSET and Wine Scholar Guild student Facebook groups, school class chats [A]. The owner should look at these himself before posting (first step below).

Primary: **the Spain-curious WSET 2/3 student** (and Spanish Wine Scholar candidate). Job: "when I read about a region, show me where it is and why the wine is like that, so I remember it." Most likely a self-funded hobbyist or trade person, English-reading, on a laptop or phone [A].
Secondary A: **the wine lover or traveller** planning Spain (Rioja, Priorat). Job: "tell me what makes this place different before I go or buy." The map tour serves this one best.
Secondary B: **educators and school staff** (a teacher who sends students to a free reference). Job: "give my class a trustworthy, sourced reference I can link." Needs credit lines and no-account access, which exist.
Not for now: trade buyers, producers, Spanish speakers (#160).

Tension to settle: the Job line (exam students first) and the positioning (general reference, small Study link) pull apart. Suggest: say plainly "reference for people studying wine" and let the Study report decide how prominent Study is. Primary job should be "understand why", with exam use as the audience, not the pitch.

## 2. Goals for the next 3 months (to 21 Jan 2027)
Measures need analytics, so these only count once PostHog (or equal) is on. Numbers are guesses to be reset after the first 2 weeks of data [A].
1. 10 named outside students use it for 4 weeks (recruited by the owner). Pass: at least 6 return in 3 or more different weeks.
2. Weekly returning users: 15 by week 12 (a user seen in 2+ weeks). Honest context: at 5-15 visits per user, 4,000 visits a month is about 300 to 800 people.
3. Map tours: 30% of guide-page visitors on Rioja/Priorat start the tour; 50% of starters reach the last stop.
4. Study: share of visitors who finish one round (target set after the Study report defines a round).
5. Quality: 0 unfixed wrong-fact reports older than 7 days; error rate in Sentry under 1% of sessions.
6. Cost: stays under EUR 100/year, or the owner is told before it does.
Not a goal: Google ranking, total visits, donations.

Must be true before inviting anyone (friends stage), cheapest honest set:
- Privacy note in About (what PostHog and Sentry collect, EU region, no names). Needed even for friends, since both tools send data to third parties [A on legal; ask a person if unsure].
- Analytics: choose one tool. PostHog EU free tier is the decision on record [V]. It is the biggest build item here; a lighter option is Plausible/self-counted events, but that reopens an owner decision.
- Error reporting: Sentry EU free tier, no replay [V decision].
- Esri cost guard: a monthly usage check at minimum; a hard cap in the Esri account if the account supports one [A, unverified]. Check that the key is restricted by referrer so nobody else burns the quota [A].
- A working feedback route: About mailto is "later" [V]. Without it you learn nothing from friends. Needs an address that is not his personal one (rule: no personal email in repo).
- One real-phone and Safari pass; students will use phones in class [A]. Not verified today [V].
- Remove or fix the donation line (no way to give) [V].
Offline shell (#16) can wait; it is not needed for friends.

## 3. Launch options
| Option | What it is | Needs built first | Main risk |
|---|---|---|---|
| A. Quiet | 10-15 friends and one study group, by direct link, still noindex | privacy note, feedback address, phone/Safari pass, donation line fixed. Analytics and Sentry strongly wanted but can follow in week 1 | Few users, weak signal; friends are polite |
| B. Testers | 30-50 students from a school or two Facebook/Reddit groups, asked to try it for 4 weeks, noindex | A plus PostHog, Sentry, Esri guard, short survey | Cost and facts exposed to strangers; wrong-fact reports |
| C. Public soft | Remove noindex, post once in r/WSET and wine groups, "free, no account" | B plus Study report finished, monitored Esri budget, fact-correction process | Traffic spike could pass 4k visits/month free tier (see section 4); Reddit self-promotion rules vary [A] |
| D. Loud / school partner | A wine school or WSET Approved Programme Provider recommends it to a cohort | C plus a one-page note for teachers, stable URLs, courtesy about not using WSET/WSG text or marks | WSET/WSG trademark and "exam prep" claims; a school expects support and uptime [A] |
Search indexing is separate: turn it on only at C. The `noindex` flag is the cheapest brake the owner has.

## 4. Money lines that move with traffic
Fixed [V]: GitHub Pages free; domain about EUR 10-15/yr [A]; PostHog and Sentry free tiers (limits not checked this session, so check events per month before the testers stage [A]).
Variable: Esri imagery (#108). Rates [V per #108]: 2M tiles/month free, then $0.15 per 1,000 tiles; sessions pricing 1,000 free then $4 per 1,000. Tiles per visit about 500 [A, not measured]. My arithmetic on those inputs:
| Visits/month | Tiles/month | Tile pricing | Session pricing |
|---|---|---|---|
| 4,000 | 2M | $0 | about $12 |
| 10,000 | 5M | about $450 | about $36 |
| 20,000 | 10M | about $1,200 | about $76 |
Note the gap: at 10k visits tile pricing is about 12x session pricing, and $450 a month is far above the EUR 100/year rule. The #108 trigger (act at 1M tiles/month) comes before this. Free tier ends at about 4k visits, which is one successful community post. So before option C: measure real tiles per visit (one afternoon with the Esri usage page), and decide between session pricing (needs MapLibre check) and "lighter Esri" (75% fewer zoomed-out tiles, softer). IGN covers Spain from zoom 10 free [V].
Other lines: donations (#159) have no mechanism; any real one (a tip page) needs the owner's own account and a tax look [A]. Backend (#151) would add cost and privacy duties; avoid until Study progress sync is wanted. Translation (#160): guides cost about 0.55-0.62M tokens each to write [V PROJECT.md]; a Spanish interface alone is cheap, translated guides are not; defer.
Owner time is the real cost: facts corrections, tester mail.

## 5. Recommendation
Do A now, B after two weeks, hold C until Esri cost is measured and the Study report is built. Reasons: audience is small and findable by hand; wrong facts are the stated top risk; free Esri tier is the only cost that can jump.
First step the owner can do himself, this week and with no build: write down 10 people (students or trade) he can name, send the Dutch invite draft to 3 of them, and ask each one thing after a week: "what did you open, what would you have wanted?" At the same time, spend 30 minutes reading r/WSET and one Facebook study group to see what students ask for, and whether self-promotion is allowed. Neither needs analytics.
Build order for the slice behind it: privacy note + feedback address + donation line -> PostHog + Sentry (#16) -> Esri tile measurement and cap -> phone/Safari pass.

## 6. Open questions for the owner
1. Who comes first on the page? (a) Students, "reference for people studying wine" (recommended); (b) wine lovers, Study as small link; (c) keep both lines as now.
2. Launch stage by 21 Jan? (a) A then B (recommended); (b) go straight to C; (c) stay private.
3. Analytics for friends: (a) wait until PostHog is wired, invite only 3-5 people meanwhile (recommended); (b) invite all now and rely on conversation; (c) lighter tool than PostHog.
4. Donation line: (a) remove until there is a way to give (recommended); (b) add a tip link; (c) leave.
5. Esri over budget: (a) measure first, then switch to session pricing if it works with MapLibre (recommended); (b) lighter Esri now; (c) accept cost above EUR 100 up to a set cap.
6. Feedback address: (a) new project address on the domain (recommended; fits the EUR 100 rule); (b) form; (c) none.
7. Indexing: (a) keep noindex until stage C (recommended); (b) open now.
8. Languages (#160): (a) English only through 21 Jan (recommended); (b) Spanish interface; (c) guides translated.

## Not verified
Reddit/Facebook group sizes and rules; SommGeo existence and features; Level 2/3 candidate counts; PostHog/Sentry free limits; Esri cap feature; tiles per visit.
