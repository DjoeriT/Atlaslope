#!/usr/bin/env python3
"""Atlaslope flow sketch generator. Writes ../index.html (self-contained: fonts inlined).
Run: python3 gen.py  (from this folder). Fonts are read from the round 2.2 mock assets."""
import base64, html, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = "/mnt/project-files/atlaslope/mocks/atlas-v2.2/assets/fonts"

# ---- screens -------------------------------------------------------------
# panels: (x, y, w, h, kind)  on a 160x100 frame; kind: card | sheet | bar | chip | dim
S = []
def screen(id, mode, title, status, what, outs, panels, note=""):
    S.append(dict(id=id, mode=mode, title=title, status=status, what=what, outs=outs, panels=panels, note=note))

screen("first-run", "home", "First run", "new",
 ["Three lines on what Atlaslope is, over the map of Spain",
  "Pick where to start: a study region, or all of Spain",
  "How to tilt and turn the map (the hint you missed in round 2)"],
 [("Start", "home")],
 [(40,22,80,56,"card")], "Shown once, to you and each friend. Skippable.")

screen("home", "home", "Home: the map with Today", "new",
 ["Atlas base of Spain, satellite off by default. Home is the Explore map with the Today card open",
  "Floating Today card: “12 due · Review”, “Continue Castilla y León, 6 of 14 known”, “Read next: Toro”",
  "Top bar: the Atlaslope wordmark (home), search, Explore · Quiz · Progress, layers, light/dark"],
 [("Review (the one main button)", "quiz-q"), ("Continue a region", "region"), ("Read next", "guide"),
  ("Tap a place", "card"), ("Quiz tab (custom quiz, tucked away)", "quiz-start"), ("Progress", "mastery"), ("Layers", "layers")],
 [(0,0,160,9,"bar"),(6,14,46,34,"card")], "Nothing due? The card says so and offers five new places from the next region. Close the card and you are simply on the map.")

screen("region", "explore", "Explore: Spain or a region", "changed",
 ["The round 2.2 map, now on the atlas base with towns, rivers and serif DO names",
  "Preset views: Spain and each of the ten study regions",
  "DOCas show their zones when you zoom in"],
 [("Tap a place", "card"), ("Layers", "layers"), ("Quiz tab", "quiz-start"), ("Progress", "mastery"), ("Wordmark", "home")],
 [(0,0,160,9,"bar"),(118,74,36,20,"chip")], "Mocked as 01 and 02 in round 2.2. The map base and labels change.")

screen("layers", "explore", "Layers", "new",
 ["Satellite on or off",
  "Climate: Atlantic, continental, Mediterranean, shaded across Spain",
  "3D terrain on or off"],
 [("Close, back to the map", "region")],
 [(0,0,160,9,"bar"),(112,11,44,40,"sheet")], "A small menu, not a screen. Soil isn't here: it lives in the guide.")

screen("card", "explore", "Place card", "changed",
 ["Name, level (DOCa, DO, zone), study region",
  "Three fact lines: main grape, climate, altitude",
  "Overlap cycling where two places share ground"],
 [("Read the guide", "guide"), ("Test me on this", "quiz-q"), ("Close", "region")],
 [(0,0,160,9,"bar"),(104,14,50,46,"card")], "The round 2.2 card, with facts and two ways on.")

screen("guide", "explore", "Place guide", "new",
 ["Where it sits, and why the wine tastes as it does: climate, altitude, soil, grapes",
  "“Fly there” buttons that move the map to the point being made (the Sierra de Cantabria, the Ebro)",
  "Fact sheet with a source on every row; zones and neighbours as links"],
 [("Fly there (map moves, guide stays)", "guide"), ("A zone or neighbour", "guide"),
  ("Test me on this", "quiz-q"), ("Back to the map", "region")],
 [(0,0,160,9,"bar"),(96,9,64,91,"sheet")], "A side panel on desktop, a bottom sheet on iPad portrait. One template for every place in the world.")

screen("quiz-start", "quiz", "Quiz start", "changed",
 ["Main button: “Review 12 due”",
  "Tucked away: a custom quiz (area, question types, count)"],
 [("Review", "quiz-q"), ("Start the custom quiz", "quiz-q"), ("Back to the map", "home")],
 [(0,0,160,9,"bar"),(45,24,70,50,"card")], "Round 2.2 setup (00), shrunk to one main action. Reached from the Quiz tab; the Today card's Review skips it.")

screen("quiz-q", "quiz", "Question", "mocked",
 ["Find it on the map (03)",
  "What is this? Four choices (03b)",
  "The fact question: which climate, soil or grape (03c)",
  "Only place names are hidden; rivers, towns and ranges stay"],
 [("Answer", "feedback"), ("Skip (counts as a miss, says so)", "feedback"), ("Stop", "results")],
 [(0,0,160,9,"bar"),(40,78,80,18,"card")], "Mocked in round 2.2. The leak fixes are behaviour, not look.")

screen("feedback", "quiz", "Answer feedback", "mocked",
 ["Right or wrong; on a wrong find, both the place you tapped and the right one",
  "One why line (“Toro sits west of Rueda, on the Duero”)"],
 [("Next question", "quiz-q"), ("Open the guide, then back to the quiz", "guide"), ("Last question", "results")],
 [(0,0,160,9,"bar"),(40,70,80,26,"card")], "Mocked inside 03, 03b and 03c.")

screen("results", "quiz", "Results", "changed",
 ["Score for this round, and how many places you can now place",
  "Misses circled on the map, each one a link to its guide",
  "When each place comes back (tomorrow, in three days)"],
 [("A miss", "guide"), ("Review the misses", "quiz-q"), ("See your mastery map", "mastery"), ("Home", "home")],
 [(0,0,160,9,"bar"),(6,14,52,70,"card")], "Round 2.2 results (04), with links on misses and the memory added.")

screen("mastery", "progress", "Mastery map", "new",
 ["Spain shaded by how well you know each place: new, learning, known, solid",
  "Per study region: 6 of 14 known",
  "Tucked away: reset progress, with an undo"],
 [("Tap a place", "card"), ("Review the weakest", "quiz-q"), ("A region", "region"), ("Home", "home")],
 [(0,0,160,9,"bar"),(6,14,44,50,"card"),(0,0,0,0,"shade")], "Progress lives in this browser only in v1.")

LATER = [("Elevation profile", "#3"), ("Rioja guided tour", "#4"), ("Mock exam", "#7"),
         ("Progress sync", "#8"), ("Producers", "slot in the place tree"), ("Other countries", "same template")]

MODES = [("home", "Home"), ("explore", "Explore"), ("quiz", "Quiz"), ("progress", "Progress")]
STATUS = {"mocked": "Mocked in 2.2", "changed": "2.2, changes", "new": "New, not mocked"}

GAPS = [
 ("How fast new places come in", "Spaced memory says when to re-ask, not when to add. Today needs a rule, for example five new places a session, in course order."),
 ("What “known” means on the mastery map", "Four shades need four thresholds. My default is right on the last two tries for known, and three spaced passes for solid."),
 ("Do zones join the quiz?", "Rioja's three zones and Priorat's villages are now in scope. Do they get asked like DOs, or only after the DOCa itself is known?"),
 ("Course order", "“Continue Castilla y León” assumes an order through the ten regions. The Spanish Wine Scholar order, or yours to pick?"),
]

# ---- checks: every screen has a way out, every screen is reachable --------
ids = {s["id"] for s in S}
for s in S:
    for _, t in s["outs"]:
        assert t in ids, (s["id"], t)
    assert s["outs"], s["id"]
reach = {"first-run"}; frontier = ["first-run"]
while frontier:
    cid = frontier.pop()
    cur = next(x for x in S if x["id"] == cid)
    for _, t in cur["outs"]:
        if t not in reach: reach.add(t); frontier.append(t)
missing = ids - reach
assert not missing, missing

# ---- render ----------------------------------------------------------------
def thumb(s):
    parts = ['<svg viewBox="0 0 160 100" aria-hidden="true" class="thumb">',
             '<rect class="t-map" x="0" y="0" width="160" height="100" rx="4"/>',
             '<path class="t-coast" d="M22 30 Q40 18 70 22 T120 20 Q140 24 146 40 L140 70 Q120 90 80 88 Q50 92 30 78 Q16 60 22 30Z"/>',
             '<path class="t-river" d="M40 44 Q70 40 100 52 T138 56"/>']
    if s["id"] == "mastery":
        for (x,y,r,c) in [(60,40,9,"s3"),(80,50,8,"s2"),(98,36,7,"s1"),(112,60,9,"s0"),(70,66,7,"s2"),(124,44,6,"s3")]:
            parts.append(f'<circle class="{c}" cx="{x}" cy="{y}" r="{r}"/>')
    for (x,y,w,h,k) in s["panels"]:
        if k == "shade": continue
        parts.append(f'<rect class="t-{k}" x="{x}" y="{y}" width="{w}" height="{h}" rx="{0 if k=="bar" else 3}"/>')
    parts.append("</svg>")
    return "".join(parts)

def esc(t): return html.escape(t, quote=False)
title_of = {s["id"]: s["title"] for s in S}

cols = []
for key, name in MODES:
    cards = []
    for s in [x for x in S if x["mode"] == key]:
        outs = "".join(f'<li><a href="#{t}">{esc(lbl)}</a> <span class="to">→ {esc(title_of[t])}</span></li>' for lbl, t in s["outs"])
        what = "".join(f"<li>{esc(w)}</li>" for w in s["what"])
        ins = [x["title"] for x in S if any(t == s["id"] for _, t in x["outs"]) and x["id"] != s["id"]]
        cards.append(f'''<article class="scr" id="{s["id"]}" tabindex="-1">
  {thumb(s)}
  <div class="scr-head"><h3>{esc(s["title"])}</h3><span class="tag tag-{s["status"]}">{STATUS[s["status"]]}</span></div>
  <ul class="what">{what}</ul>
  <h4>Ways on</h4><ul class="outs">{outs}</ul>
  <p class="from"><span>Reached from:</span> {esc(", ".join(ins)) if ins else "opening Atlaslope the first time"}</p>
  <p class="note">{esc(s["note"])}</p>
</article>''')
    cols.append(f'<section class="col" aria-labelledby="h-{key}"><h2 id="h-{key}">{name}</h2>{"".join(cards)}</section>')

later = "".join(f"<li><b>{esc(a)}</b> <span>{esc(b)}</span></li>" for a, b in LATER)
gaps = "".join(f"<li><b>{esc(a)}</b><p>{esc(b)}</p></li>" for a, b in GAPS)

def font(name):
    with open(os.path.join(FONTS, name), "rb") as f:
        return "data:font/woff2;base64," + base64.b64encode(f.read()).decode()
fontcss = "".join(
    f'@font-face{{font-family:"{fam}";src:url({font(fn)}) format("woff2");font-weight:{w};font-style:{st};font-display:swap}}'
    for fam, fn, w, st in [("Newsreader","newsreader-latin-500-normal.woff2",500,"normal"),
                           ("Newsreader","newsreader-latin-600-normal.woff2",600,"normal"),
                           ("Newsreader","newsreader-latin-400-italic.woff2",400,"italic"),
                           ("IBM Plex Sans","ibm-plex-sans-latin-400-normal.woff2",400,"normal"),
                           ("IBM Plex Sans","ibm-plex-sans-latin-600-normal.woff2",600,"normal")])

tpl = open(os.path.join(HERE, "template.html")).read()
out = (tpl.replace("/*FONTS*/", fontcss).replace("<!--COLS-->", "".join(cols))
          .replace("<!--LATER-->", later).replace("<!--GAPS-->", gaps)
          .replace("<!--COUNT-->", str(len(S))))
with open(os.path.join(HERE, "..", "index.html"), "w") as f: f.write(out)
print("ok", len(S), "screens, all reachable, no dead ends")
