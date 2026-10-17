import re, sys, pathlib
SRC = pathlib.Path('/home/user/atlaslope/Review/mock-travel-v1')
OUT = pathlib.Path('/mnt/project-files/atlaslope/mocks/guides-v1'); OUT.mkdir(parents=True, exist_ok=True)

LIGHT = """:root{
  --serif:"Newsreader",Georgia,serif;--sans:"IBM Plex Sans",-apple-system,"Segoe UI",sans-serif;
  --paper:#FFFFFF;--paper2:#F4F4F2;--raise:#FFFFFF;--ink:#1F1F1F;--ink2:#484848;--ink3:#6E6E6E;
  --line:#EBEBEB;--line2:#DDDDDD;
  --accent:#8C2340;--accent-ink:#FFFFFF;--focus:#2F5F9E;
  --red:#7A1F2B;--white:#E6D9A2;--rose:#E9A6A0;
  --s1:#8C2340;--s2:#D9677E;--s3:#F2C4CD;--s4:#F7E6EA;
  --shadow:0 1px 2px rgba(0,0,0,.06),0 8px 28px rgba(0,0,0,.14);
  --shadow-lg:0 2px 6px rgba(0,0,0,.08),0 24px 60px rgba(0,0,0,.22);
  --pill:#1F1F1F;--pill-ink:#fff;
}"""
DARK = """:root[data-theme="dark"]{
  --paper:#121212;--paper2:#1E1E1E;--raise:#1A1A1A;--ink:#F3F1EC;--ink2:#CFCBC3;--ink3:#9A968F;
  --line:#2A2A2A;--line2:#3A3A3A;
  --accent:#C9A54E;--accent-ink:#141210;--focus:#8AB4F8;
  --red:#B4414F;--white:#E6D9A2;--rose:#E9A6A0;
  --s1:#C9A54E;--s2:#8F7536;--s3:#4A3F25;--s4:#2A251B;
  --shadow:0 1px 2px rgba(0,0,0,.3),0 8px 28px rgba(0,0,0,.45);
  --shadow-lg:0 2px 6px rgba(0,0,0,.3),0 24px 60px rgba(0,0,0,.6);
  --pill:#F3F1EC;--pill-ink:#121212;
}"""

def retoken(h):
    h = re.sub(r':root\{\n  --serif.*?\n\}', lambda m: LIGHT, h, count=1, flags=re.S)
    h = re.sub(r':root\[data-theme="dark"\]\{\n  --paper.*?\n\}', lambda m: DARK, h, count=1, flags=re.S)
    return h

PIN = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>'
QUIZ = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.6"/><circle cx="12" cy="16.6" r=".6" fill="currentColor"/></svg>'
PLIEGO = 'https://riojawine.com/wp-content/uploads/2023/07/pliego-de-condiciones-de-la-doca-rioja-en-vigor.pdf'
DOC = 'https://webgate.ec.europa.eu/eambrosia-api/api/v1/attachments/30985'
def src(*pages, doc=False):
    s = f'<a href="{PLIEGO}" target="_blank" rel="noopener">Pliego de condiciones DOCa Rioja (Consejo Regulador copy, amendments to AM10), p. {", ".join(pages)}</a>'
    if doc: s += f'; <a href="{DOC}" target="_blank" rel="noopener">Documento único PDO-ES-A0117, p. 5</a>'
    return f'<span class="src">Source: {s}</span>'
def fly(label, href='2-fly-there.html'):
    return f'<a class="fly" href="{href}" aria-label="Show {label} on the map">{PIN}<span><small>On the map</small>{label}</span></a>'

GUIDE = f'''
<section id="why" aria-labelledby="why-h" class="guide"><p class="kicker">Terroir · 4-minute read</p><h2 id="why-h">Why Rioja tastes the way it does</h2>
<p class="read">Two climates that rarely meet share one sheltered valley. That is where Rioja's wines get their body, their colour and their acidity.</p>
{src("15", "19")}

<div class="gch" id="why-valley"><h3>A valley with walls</h3>
<p>The vineyards follow the Ebro for 100 km, from Haro in the west to Alfaro in the east, in a valley never more than about 40 km wide. They climb in terraces to about 700 m. The mountains around it make Rioja a natural region of its own, and the Sierra de Cantabria to the north protects the vines.</p>
<p>Three provinces share the vineyard: La Rioja, Álava and Navarra, 63,593 hectares across 144 municipalities.</p>
<div class="flies">{fly("Haro to Alfaro, the whole valley")}{fly("Sierra de Cantabria")}</div>
{src("15", "20")}</div>

<div class="gch" id="why-climate"><h3>Cool in the west, warm in the east</h3>
<p>The whole valley sits where the Atlantic and the Mediterranean meet, so temperatures stay mild and about 400 mm of rain falls in a year. Moving east, the climate turns Mediterranean and the wine changes with it.</p>
<div class="zguide">
<div><b>Rioja Alta</b><p class="cl">Atlantic. More rain and fewer hours of sun than the south.</p><p>Wines of medium strength with body and high acidity, made for the barrel.</p>{fly("Rioja Alta")}</div>
<div><b>Rioja Alavesa</b><p class="cl">Both climates meet. As sunny as Rioja Alta, a little drier, and the most sheltered by the Sierra de Cantabria.</p><p>A touch more alcohol and less acidity. Good young or aged.</p>{fly("Rioja Alavesa")}</div>
<div><b>Rioja Oriental</b><p class="cl">Mediterranean. The least rain and the most sun. Older documents call it Rioja Baja.</p><p>More alcohol and extract. Used in blends for barrel ageing, and also drunk young.</p>{fly("Rioja Oriental")}</div>
</div>
{src("15", "20", doc=True)}</div>

<div class="gch" id="why-soils"><h3>Three soils, three weights</h3>
<p>Clay-limestone covers a quarter of the vineyard, on terraces and small plots in Rioja Alavesa, the Sonsierra and parts of Rioja Alta. It is the main source of wines for ageing. Ferrous clay, red and rolling, covers another quarter. Alluvial soil near the rivers, flat, deep and full of stones, covers half. Both of these give wines with less body than the clay-limestone.</p>
<p>Most of Rioja's soil is balanced between sand, silt and clay, slightly alkaline, poor in organic matter, and holds a moderate amount of water through the summer.</p>
<div class="flies">{fly("Clay-limestone terraces, Rioja Alavesa")}</div>
{src("15", "16", "20")}</div>

<div class="gch" id="why-barrel"><h3>Made for the barrel</h3>
<p>Wine is about a fifth of the region's economy, and Rioja's long focus on ageing has built one of the largest concentrations of oak barrels in the world. Crianza, Reserva and Gran Reserva are the result: see <a href="#styles">Famous styles</a>.</p>
<p>Rioja makes sparkling wine too. Wines "made by the Champagne method" from Rioja Alta and Alavesa were shown in Madrid in 1857, and in 1890 a French firm in Haro's station quarter hired a champagne maker from Reims. The cool end of the Winkler heat scale keeps the base wines fresh and acidic. Since 2017 the rules cover traditional-method sparkling whites and rosés.</p>
<div class="flies">{fly("Haro's station quarter")}</div>
{src("19", "20")}</div>

<div class="testme"><div><b>Test me on Rioja</b><span>A short round on Rioja and its three zones: where they sit and what they are known for.</span></div><a class="btn accent" href="#">{QUIZ}Test me</a></div>
</section>
'''

CSS = '''
/* ---------- guide (release 10 mock) ---------- */
.guide .kicker{margin:0 0 .5rem;color:var(--accent)}
.guide > .src{margin-top:.6rem}
.gch{margin-top:2.2rem;max-width:40rem}
.gch h3{font:500 1.25rem/1.3 var(--serif);margin:0 0 .6rem}
.gch p{margin:0 0 .8rem;color:var(--ink2);max-width:38rem}
.gch p a{color:var(--accent);text-underline-offset:2px}
.flies{display:flex;flex-wrap:wrap;gap:.6rem;margin:.4rem 0 .2rem}
.fly{display:inline-flex;align-items:center;gap:.6rem;min-height:2.75rem;padding:.35rem 1rem .35rem .75rem;border:1px solid var(--line2);border-radius:999px;text-decoration:none;color:var(--ink);background:var(--raise);font-size:.92rem;line-height:1.2}
.fly .icon{width:1.2rem;height:1.2rem;color:var(--accent)}
.fly small{display:block;font-size:.7rem;color:var(--ink3);letter-spacing:.04em}
.fly:hover{border-color:var(--accent)}
.zguide{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:1rem 0 .4rem;max-width:none}
.gch:has(.zguide){max-width:none}
.zguide > div{border:1px solid var(--line);border-radius:1rem;padding:1.1rem;background:var(--raise);display:flex;flex-direction:column}
.zguide b{font:500 1.15rem var(--serif);margin-bottom:.4rem}
.zguide p{font-size:.92rem;margin:0 0 .6rem}
.zguide p.cl{color:var(--ink3)}
.zguide .fly{margin-top:auto;align-self:flex-start}
.testme{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;margin-top:2.4rem;padding:1.3rem 1.5rem;border-radius:1.25rem;background:var(--paper2)}
.testme b{display:block;font:500 1.25rem var(--serif)}
.testme span{color:var(--ink2);font-size:.92rem}
.btn.accent{border-color:var(--accent);color:var(--accent);font-weight:600;flex:none}
.btn.accent:hover{background:var(--accent);color:var(--accent-ink)}
.sub a{color:var(--accent);text-underline-offset:2px}
@media (max-width:760px){.zguide{grid-template-columns:1fr}.testme{flex-direction:column;align-items:flex-start}}
@media (min-width:761px) and (max-width:1100px){.zguide{grid-template-columns:1fr}}
'''

h = retoken((SRC/'2-place-listing.html').read_text())
h = h.replace('</style></head>', CSS + '</style></head>', 1)
h = h.replace('<p class="sub">DOCa · study region Rioja · three zones</p>', '<p class="sub">DOCa · study region Rioja · three zones · <a href="#why">terroir, 4-minute read</a></p>')
h = h.replace('<a href="#overview" aria-current="true">Overview</a>', '<a href="#overview">Overview</a><a href="#why" aria-current="true">Terroir</a>')
i = h.index('<section id="taste">'); h = h[:i] + GUIDE + h[i:]
h = h.replace('<title>', '<title>', 1)
h = re.sub(r'<title>.*?</title>', '<title>Rioja guide · Atlaslope mock</title>', h, count=1)
h = h.replace('href="1-map-card.html"', 'href="2-fly-there.html"')
(OUT/'1-place-guide.html').write_text(h)

# fly-there state on the map
m = retoken((SRC/'1-map-card.html').read_text())
m = re.sub(r'<title>.*?</title>', '<title>On the map from the guide · Atlaslope mock</title>', m, count=1)
FCSS = '''
.flycap{position:fixed;left:1rem;bottom:1.6rem;width:24rem;z-index:6;background:var(--paper);border-radius:1.25rem;box-shadow:var(--shadow-lg);padding:1.2rem 1.4rem 1.3rem}
.flycap .kicker{color:var(--accent);margin:0 0 .3rem}
.flycap h1{font:500 2rem/1.05 var(--serif);margin:0 0 .5rem;letter-spacing:-.01em}
.flycap p{margin:0;color:var(--ink2)}
.flycap .row{display:flex;gap:.6rem;margin-top:1rem}
.flycap .row .btn.primary{flex:1}
.flycap .close{position:absolute;right:.8rem;top:.8rem;background:var(--paper2);color:var(--ink);box-shadow:none}
.mpin{position:fixed;left:58%;top:31%;z-index:4;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;pointer-events:none}
.mpin span{background:var(--pill);color:var(--pill-ink);font:600 .85rem var(--sans);padding:.35rem .75rem;border-radius:999px;box-shadow:var(--shadow);white-space:nowrap}
.mpin i{width:2px;height:1.4rem;background:var(--pill)}
.mpin b{width:.8rem;height:.8rem;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px rgba(255,255,255,.85)}
@media (max-width:760px){.flycap{left:.6rem;right:.6rem;width:auto;bottom:.6rem}}
'''
m = m.replace('</style></head>', FCSS + '</style></head>', 1)
CAP = f'''<div class="mpin" aria-hidden="true"><span>Sierra de Cantabria</span><i></i><b></b></div>
<section class="flycap" aria-labelledby="fc-h"><p class="kicker">From the Rioja guide</p><h1 id="fc-h">Sierra de Cantabria</h1>
<p>The mountain wall on Rioja's northern side. It shelters Rioja Alta, and Rioja Alavesa even more.</p>
{src("20")}
<div class="row"><a class="btn primary" href="1-place-guide.html#why-valley"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>Back to the guide</a></div>
<a class="round close" href="#" aria-label="Close and stay on the map"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></a>
</section>'''
m = re.sub(r'<section class="pcard".*?</section>', lambda _: CAP, m, count=1, flags=re.S)
(OUT/'2-fly-there.html').write_text(m)

IDX = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Guides mock · Atlaslope</title>
<style>body{font:1rem/1.5 "IBM Plex Sans",system-ui,sans-serif;max-width:40rem;margin:3rem auto;padding:0 1rem;color:#1F1F1F;background:#fff}h1{font:500 2rem Georgia,serif}a{color:#8C2340}li{margin:.5rem 0}@media (prefers-color-scheme:dark){body{background:#121212;color:#F3F1EC}a{color:#C9A54E}}</style></head>
<body><h1>Release 10 mock: place guides</h1><ol>
<li><a href="1-place-guide.html">Rioja place page with the guide</a>: a new "The guide" section after the overview, fly-there buttons, Test me at the end.</li>
<li><a href="2-fly-there.html">After a fly-there button</a>: the map moves to the spot, a caption says why it matters, one button goes back to the guide.</li>
</ol><p>Rioja Alta, Rioja Alavesa and Rioja Oriental get the same section, shorter. Other places get no guide yet, only the Test me box.</p></body></html>'''
(OUT/'index.html').write_text(IDX)
print('ok', [ (p.name, p.stat().st_size) for p in OUT.iterdir()])
