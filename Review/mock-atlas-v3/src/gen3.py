#!/usr/bin/env python3
"""Atlaslope mock-ups, round 3 (the system round). Writes the five new screens and an index into
/mnt/project-files/atlaslope/mocks/atlas-v3/. Shared assets (fonts, MapLibre, data bundle, app.js, app.css) live there already.
Run: python3 gen3.py  (dos.json beside it is dumped from assets/data.js)."""
import json, os, html
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = "/mnt/project-files/atlaslope/mocks/atlas-v3"
D = json.load(open(os.path.join(HERE, "dos.json")))
DOS, MACRO = D["dos"], D["macro"]
Q22 = "../atlas-v2.2/"          # round 2.2 screens that still stand (quiz chain)
ORDER = ["green-spain","castilla-y-leon","rioja","ebro","cataluna","mediterranean","meseta","andalucia","baleares","canarias"]

# ---- mastery sample: what the map shades. 0 new, 1 learning, 2 known, 3 solid ----
M = {"Rioja":3, "Rías Baixas":3, "Ribeiro":2, "Ribeira Sacra":2, "Valdeorras":2, "Monterrei":1,
     "Getariako Txakolina":1, "Bizkaiko Txakolina":1, "Arabako Txakolina":1,
     "Ribera del Duero":3, "Rueda":3, "Toro":2, "Bierzo":2, "Cigales":2, "Arribes":2, "Arlanza":1, "León":1, "Tierra del Vino de Zamora":1,
     "Navarra":1}
def counts(macro=None):
    pool = [d for d in DOS if d["weight"]=="core" and (macro is None or d["macro"]==macro)]
    c = [0,0,0,0]
    for d in pool: c[M.get(d["name"],0)] += 1
    return c, len(pool)

def esc(t): return html.escape(t, quote=True)

SVG = {
 "search": '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 13l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 "layers": '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17l9 5 9-5"/></svg>',
 "theme": '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>',
 "plus": '<svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
 "minus": '<svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
 "north": '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 5l3 7-3 7-3-7z" fill="currentColor"/></svg>',
 "sat": '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>',
 "fly": '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l16-7-7 16-2-7z"/></svg>',
 "close": '<svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
}

def chrome(mode, sub, menu_open=False, climate=False, region_pick=None, mock_tag="mock · DO boundaries © MAPA 2014"):
    cur = lambda m: ' aria-current="page"' if m==mode else ''
    return f'''<div class="topleft"><button id="brand-btn" class="brand glass" aria-haspopup="menu" aria-expanded="false" aria-controls="brand-menu"><b>Atlaslope</b><small>{esc(sub)}</small></button>
<div class="search glass">{SVG["search"]}<input type="search" placeholder="Search places, regions, towns, grapes" aria-label="Search places, regions, towns and grapes"></div></div>
<div id="brand-menu" class="glass menu tl" role="menu" hidden><a role="menuitem" href="10-home-today.html">Home: today</a><a role="menuitem" href="15-explore-spain.html">Spain, the place tree</a><button role="menuitem" id="theme" aria-pressed="false"><span>Dark interface</span>{SVG["theme"]}</button><a role="menuitem" href="index.html">About this round</a></div>
<div class="topright"><span class="mock glass">{esc(mock_tag)}</span><nav class="seg glass" aria-label="Mode"><a href="15-explore-spain.html"{cur("explore")}>Explore</a><a href="{Q22}00-quiz-setup.html"{cur("quiz")}>Quiz</a><a href="13-mastery.html"{cur("progress")}>Progress</a></nav></div>
<div id="layers-menu" class="glass menu br"{'' if menu_open else ' hidden'}><h4>Map</h4>
<label><input type="checkbox" data-layer="satellite" checked>Satellite imagery</label>
<label><input type="checkbox" data-layer="climate"{' checked' if climate else ''}>Climate<small>schematic</small></label>
<label><input type="checkbox" data-layer="relief" checked>3D relief</label>
<label><input type="checkbox" data-layer="dos" checked>Place boundaries</label>
<p class="note" style="margin:.4rem .6rem .2rem;max-width:14rem">Soil is in each place guide. No open soil map is fine enough to draw.</p></div>
<div class="bottomright"><div class="glass"><button id="zin" class="iconbtn" aria-label="Zoom in">{SVG["plus"]}</button><button id="zout" class="iconbtn" aria-label="Zoom out">{SVG["minus"]}</button></div>
<div class="glass"><button id="layers-btn" class="iconbtn" aria-label="Map layers" aria-expanded="{'true' if menu_open else 'false'}" aria-controls="layers-menu">{SVG["layers"]}</button><button id="tilt" class="iconbtn text" aria-label="3D view" aria-pressed="false">3D</button><button id="north" class="iconbtn" aria-label="Reset to north" hidden>{SVG["north"]}</button></div></div>'''

def page(fn, title, body, PAGE, extra_script="", aria="Map of Spain. Click a place to select it."):
    doc = f'''<!doctype html><html lang="en" data-theme="paper"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Atlaslope · {esc(title)}</title><link rel="stylesheet" href="assets/maplibre-gl.css"><link rel="stylesheet" href="assets/app.css"></head><body>
<div id="map" role="application" aria-label="{esc(aria)}"></div>
{body}
<script>window.PAGE={json.dumps(PAGE, ensure_ascii=False)};</script>
<script src="assets/maplibre-gl.js"></script><script src="assets/data.js"></script><script src="assets/app.js"></script>
<script>{COMMON}{extra_script}</script>
</body></html>'''
    open(os.path.join(OUT, fn), "w").write(doc)

REGION_BOUNDS = {"spain":[[-9.4,35.9],[3.4,43.9]], "green-spain":[[-9.3,41.8],[-1.7,43.8]], "castilla-y-leon":[[-7.1,40.1],[-1.8,43.2]], "rioja":[[-3.15,42.05],[-1.65,42.75]],
 "ebro":[[-2.3,40.9],[0.8,43.3]], "cataluna":[[0.1,40.5],[3.4,42.9]], "mediterranean":[[-2.4,37.3],[0.6,40.8]], "meseta":[[-7.4,38.0],[-0.8,41.3]],
 "andalucia":[[-7.6,36.0],[-1.6,38.7]], "baleares":[[1.1,38.6],[4.4,40.2]], "canarias":[[-18.4,27.5],[-13.3,29.5]]}
REGION_SCRIPT = ""
COMMON = "(function(){const b=document.getElementById('brand-btn'),m=document.getElementById('brand-menu');if(!b||!m)return;b.addEventListener('click',()=>{const o=m.hidden;m.hidden=!o;b.setAttribute('aria-expanded',String(o));});document.addEventListener('click',e=>{if(!m.hidden&&!m.contains(e.target)&&!b.contains(e.target)){m.hidden=true;b.setAttribute('aria-expanded','false');}});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!m.hidden){m.hidden=true;b.setAttribute('aria-expanded','false');b.focus();}});})();"

def flybtn(label, cam, pressed=False):
    return f'<button class="fly" type="button" data-fly=\'{json.dumps(cam)}\' aria-pressed="{"true" if pressed else "false"}">{SVG["fly"]}{esc(label)}</button>'

# ---------- 10 Home: the map with Today ----------
c_cyl, n_cyl = counts("castilla-y-leon"); known_cyl = c_cyl[2]+c_cyl[3]
body = f'''<section class="card glass" aria-label="Today"><button id="close-card" class="iconbtn close" aria-label="Close, show the map">{SVG["close"]}</button><div class="body"><div class="kicker">Today · Thursday 16 October</div><h1>12 due</h1>
<p class="lede">Nine from Castilla y León, two from Rioja, one from Rías Baixas.</p>
<ul class="today">
<li><a href="16-region-castilla.html"><b>Continue Castilla y León</b><small>{known_cyl} of {n_cyl} known · five new places today: Arlanza, León, Tierra del Vino, Valtiendas, Valles de Benavente</small></a><div class="bar" aria-hidden="true"><i style="width:{round(100*known_cyl/n_cyl)}%"></i></div></li>
<li><a href="12-guide-rioja.html"><b>Read next: Rioja</b><small>The place guide, before Rioja's zones come into the quiz</small></a></li>
</ul>
<p class="note">Nothing due? This card says so and offers five new places from the next region instead.</p></div>
<div class="foot"><a class="btn primary" href="{Q22}03-quiz-find.html">Review 12 due</a></div></section>
{chrome("explore", "Spain", region_pick="spain")}'''
page("10-home-today.html", "Today", body, {"page":"spain","basemap":"satellite"}, REGION_SCRIPT)

# ---------- 11 Layers menu with the climate layer ----------
body = f'''{chrome("explore", "Spain · layers", menu_open=True, climate=True, region_pick="spain")}
<div id="climate-legend" class="legend glass climate" aria-label="Climate legend"><span><i style="background:#5E9A8E"></i>Atlantic: mild, wet, cloudy</span><span><i style="background:#C8A054"></i>Continental: hot days, cold nights, dry</span><span><i style="background:#D9774F"></i>Mediterranean: warm, dry summers</span><span class="sub">Schematic, by province. A real climate layer (AEMET or Köppen) comes with the build.</span></div>'''
page("11-layers-climate.html", "Layers", body, {"page":"spain","basemap":"satellite"}, REGION_SCRIPT + "document.body.classList.add('nocard');")

# ---------- 12 Place guide: Rioja ----------
CAM = {
 "sierra": {"center":[-2.58,42.60],"zoom":11.4,"pitch":66,"bearing":25},
 "haro":   {"center":[-2.85,42.56],"zoom":12,"pitch":55,"bearing":-30},
 "oriental": {"center":[-1.80,42.20],"zoom":11.2,"pitch":55,"bearing":-60},
 "demanda": {"center":[-2.95,42.22],"zoom":10.4,"pitch":60,"bearing":160},
 "all": {"center":[-2.42,42.42],"zoom":9.1,"pitch":55,"bearing":-15},
}
body = f'''<section class="card glass guide" aria-label="Place guide: Rioja"><div class="body"><nav class="kicker crumb" aria-label="Where this sits"><a href="15-explore-spain.html">Spain</a> › <a href="16-region-castilla.html">Rioja</a> › <span>Rioja · DOCa</span></nav><h1>Rioja</h1>
<p class="lede">A 100 km trough along the Ebro, walled by the Sierra de Cantabria to the north and the Sierra de la Demanda to the south. Three zones, three climates, one grape above all.</p>
<dl class="strip" aria-label="At a glance"><div><dt>Grapes</dt><dd>Tempranillo, Garnacha · Viura</dd></div><div><dt>Climate</dt><dd>Atlantic to Mediterranean</dd></div><div><dt>Altitude</dt><dd>300 to 700 m</dd></div><div><dt>Zones</dt><dd>Alta · Alavesa · Oriental</dd></div></dl>
<h2>Where it sits</h2>
<p>The vineyards follow the Ebro from Haro down to Alfaro. The northern wall stops Atlantic cloud, so the valley is drier and sunnier than Bilbao, 80 km away.</p>
<div class="flyrow">{flybtn("The whole valley", CAM["all"], True)}{flybtn("Sierra de Cantabria", CAM["sierra"])}{flybtn("Haro and the Ebro", CAM["haro"])}</div>
<h2>Why it tastes as it does</h2>
<p><b>West to east, cool to warm.</b> Rioja Alta and Alavesa sit at 500 to 700 m under Atlantic influence: Tempranillo ripens slowly and keeps its acidity. Rioja Oriental drops to 300 m and turns Mediterranean, which is why Garnacha, not Tempranillo, is its traditional grape.</p>
<div class="flyrow">{flybtn("Rioja Oriental, low and warm", CAM["oriental"])}{flybtn("Sierra de la Demanda", CAM["demanda"])}</div>
<p><b>Three soils, three textures.</b> Clay-calcareous on the Alavesa slopes gives the finest, most fragrant wines. Ferrous clay around Haro gives body and colour. Alluvial terraces by the river give lighter, earlier wines.</p>
<h2>Fact sheet</h2>
<dl class="facts"><dt>Level</dt><dd>DOCa, since 1991<span class="src">Pliego de condiciones, MAPA 2025</span></dd>
<dt>Zones</dt><dd>Rioja Alta · Rioja Alavesa · Rioja Oriental<span class="src">Pliego, section 4: municipality lists</span></dd>
<dt>Main grapes</dt><dd>Tempranillo, Garnacha, Graciano, Mazuelo · Viura, Malvasía<span class="src">Pliego, section 6</span></dd>
<dt>Altitude</dt><dd>300 m at Alfaro to 700 m above Laguardia<span class="src">IGN 25 m elevation model, to re-sample [A]</span></dd>
<dt>Climate</dt><dd>Atlantic in the west, Mediterranean in the east, continental between<span class="src">Schematic, AEMET normals to add [A]</span></dd>
<dt>Main soils</dt><dd>Clay-calcareous, ferrous clay, alluvial<span class="src">Consejo Regulador description [A]</span></dd></dl>
<h3>Zones</h3><div class="chips" role="group" aria-label="Zones"><button class="chip" data-zone="all" aria-checked="true">All</button><button class="chip" data-zone="Rioja Alta" aria-checked="false">Rioja Alta</button><button class="chip" data-zone="Rioja Alavesa" aria-checked="false">Rioja Alavesa</button><button class="chip" data-zone="Rioja Oriental" aria-checked="false">Rioja Oriental</button></div>
<h3>Neighbours</h3><p><a href="12-guide-rioja.html">Navarra</a>, east along the Ebro · <a href="12-guide-rioja.html">Ribera del Duero</a>, over the Demanda to the south · <a href="12-guide-rioja.html">Arabako Txakolina</a>, over the Cantabria to the north</p>
<h3>Sources</h3><p class="note" style="margin-top:0">Facts: Pliego de condiciones DOCa Rioja (MAPA, 2025), IGN elevation model. The story above is Atlaslope's own synthesis of those and of the WSET and Spanish Wine Scholar syllabi, written in our words. Where a line is still unchecked it says [A].</p>
<p class="note">Every place in the world gets this template: where it sits, why it tastes as it does, the fact sheet with a source per row, zones, neighbours, sources, and a test.</p></div>
<div class="foot"><a class="btn primary" href="{Q22}03-quiz-find.html">Test me on Rioja</a><a class="btn" href="12-guide-rioja.html">Next: Navarra</a><a class="btn quiet" href="16-region-castilla.html">Back to the region</a></div></section>
{chrome("explore", "Rioja · guide", mock_tag="mock · zones from the official municipality lists")}'''
page("12-guide-rioja.html", "Rioja, the guide", body, {"page":"guide","basemap":"satellite","bounds":[[-3.15,42.05],[-1.65,42.75]],"pitch":55,"bearing":-15}, "", "Map of Rioja in 3D. The guide's fly-there buttons move it.")

# ---------- 13 Mastery map ----------
tot, n = counts(); known = tot[2]+tot[3]
rows = []
for k in ORDER:
    c, nn = counts(k)
    if nn == 0: continue
    kn = c[2]+c[3]; le = c[1]
    rows.append(f'<li><a href="16-region-castilla.html">{esc(MACRO[k]["name"])}</a><div class="bar" aria-hidden="true"><i style="width:{round(100*kn/nn)}%"></i></div><span>{kn} of {nn}</span></li>')
body = f'''<section class="card glass" aria-label="Your map"><div class="body"><div class="kicker">Progress · Spain</div><h1>{known} of {n} <small style="font-size:1.2rem;color:var(--ink3)">known</small></h1>
<p class="lede">Shaded by how well you know each place. A miss drops a place back a step. Rioja shows its zones because you know Rioja itself.</p>
<ul class="steps" aria-label="Shades"><li><i style="background:#D8D1C3"></i>New, not asked yet<b>{tot[0]}</b></li><li><i style="background:#D9B98A"></i>Learning<b>{tot[1]}</b></li><li><i style="background:#9CB07A"></i>Known: right the last two times<b>{tot[2]}</b></li><li><i style="background:#2F6B3E"></i>Solid: three spaced passes in a row<b>{tot[3]}</b></li><li><i class="ring"></i>Due today<b>12</b></li></ul>
<h3>By study region</h3><ul class="regions">{"".join(rows)}</ul>
<p id="pick" class="status" aria-live="polite">Tap a place on the map to see where it stands.</p>
<p class="note">Progress lives in this browser only in v1.</p></div>
<div class="foot"><a class="btn primary" href="{Q22}03-quiz-find.html">Review the weakest</a><button class="btn quiet" id="reset">Reset progress</button></div></section>
{chrome("progress", "Progress")}'''
MS = """const MM=%s;const NAMES=['new, not asked yet','learning','known','solid'];document.addEventListener('do-pick',e=>{const m=MM[e.detail.name]||0;document.getElementById('pick').textContent=e.detail.name+': '+NAMES[m]+(m?'. Next review '+['','tomorrow','in 3 days','in 10 days'][m]+'.':'.');});
const rb=document.getElementById('reset');rb.addEventListener('click',()=>{if(rb.dataset.armed){rb.textContent='Progress reset. Undo';rb.dataset.armed='';rb.dataset.undo='1';return;}if(rb.dataset.undo){rb.textContent='Reset progress';rb.dataset.undo='';return;}rb.textContent='Sure? Tap again to reset';rb.dataset.armed='1';setTimeout(()=>{if(rb.dataset.armed){rb.textContent='Reset progress';rb.dataset.armed='';}},4000);});""" % json.dumps(M, ensure_ascii=False)
page("13-mastery.html", "Your map", body, {"page":"mastery","basemap":"satellite","mastery":M,"masteryZones":{"Rioja Alta":3,"Rioja Alavesa":2,"Rioja Oriental":1},"marks":[{"name":n,"kind":"due"} for n in ["Toro","Bierzo","Cigales","Arribes","Arlanza","León","Tierra del Vino de Zamora","Rueda","Ribera del Duero","Rías Baixas"]]}, MS, "Map of Spain shaded by how well you know each place. Click a place to see where it stands.")

# ---------- 14 Explore a region, satellite on, place card ----------
body = f'''<section class="card glass" aria-label="Toro"><a href="16-region-castilla.html" class="iconbtn close" aria-label="Close, back to Castilla y León">{SVG["close"]}</a><div class="body"><nav class="kicker crumb" aria-label="Where this sits"><a href="15-explore-spain.html">Spain</a> › <a href="16-region-castilla.html">Castilla y León</a> › <span>Toro · DO</span></nav><h1>Toro</h1>
<p class="lede">Hot, high and dry on the Duero west of Rueda. Tinta de Toro is Tempranillo with its sleeves rolled up.</p>
<dl class="facts"><dt>Main grape</dt><dd>Tinta de Toro (Tempranillo)<span class="src">Pliego de condiciones DO Toro</span></dd><dt>Climate</dt><dd>Continental, under 400 mm of rain<span class="src">Schematic [A]</span></dd><dt>Altitude</dt><dd>620 to 750 m<span class="src">IGN elevation model</span></dd></dl>
<p class="status" style="margin-top:1rem"><b>Known</b> · right the last two times · comes back in 3 days</p>
</div>
<div class="foot"><a class="btn primary" href="12-guide-rioja.html">Read the guide</a><a class="btn" href="{Q22}03-quiz-find.html">Test me on this</a></div></section>
{chrome("explore", "Castilla y León", region_pick="castilla-y-leon")}'''
page("14-explore-region.html", "Toro", body, {"page":"spain","basemap":"satellite","bounds":REGION_BOUNDS["castilla-y-leon"],"selected":"Toro","maxZoom":8.4}, REGION_SCRIPT)

# ---------- 15 Explore: the Spain card (top of the place tree) ----------
NAMES = ['new','learning','known','solid']
rows = []
for k in ORDER:
    c, nn = counts(k)
    if nn == 0: continue
    kn = c[2]+c[3]
    rows.append(f'<li><i style="background:{MACRO[k]["color"]}"></i><a href="16-region-castilla.html"><b>{esc(MACRO[k]["name"])}</b><small>{nn} places · {kn} known</small></a><span class="go" aria-hidden="true">›</span></li>')
body = f'''<section class="card glass" aria-label="Spain"><div class="body"><nav class="kicker crumb" aria-label="Where this sits"><span>Spain</span></nav><h1>Spain</h1>
<p class="lede">Ten study regions in course order, north to south. Colours on the map are the regions.</p>
<ul class="tree">{"".join(rows)}</ul>
<p class="note">Canary Islands fall outside the bundled geography in this mock. Other countries join this list later, same template.</p></div>
<div class="foot"><a class="btn primary" href="16-region-castilla.html">Continue Castilla y León</a><a class="btn quiet" href="10-home-today.html">Today</a></div></section>
{chrome("explore", "Spain")}'''
page("15-explore-spain.html", "Spain", body, {"page":"spain","basemap":"satellite"}, "document.addEventListener('do-pick',e=>{location.href='14-explore-region.html';});", "Map of Spain, the ten study regions in colour. Click a place to open its card.")

# ---------- 16 Explore: a region card ----------
cyl = sorted([d for d in DOS if d["macro"]=="castilla-y-leon"], key=lambda d:(d["weight"]!="core", d["name"]))
rows = []
for d in cyl:
    m = M.get(d["name"],0)
    rows.append(f'<li><i class="m{m}"></i><a href="14-explore-region.html"><b>{esc(d["name"])}</b><small>{d["level"]}{" · secondary" if d["weight"]!="core" else ""} · {NAMES[m]}</small></a><span class="go" aria-hidden="true">›</span></li>')
c_cyl, n_cyl = counts("castilla-y-leon"); known_cyl = c_cyl[2]+c_cyl[3]
body = f'''<section class="card glass" aria-label="Castilla y León"><div class="body"><nav class="kicker crumb" aria-label="Where this sits"><a href="15-explore-spain.html">Spain</a> › <span>Castilla y León</span></nav><h1>Castilla y León</h1>
<p class="lede">The Duero's wine country: high, dry and continental, from Bierzo's slopes to Toro's gravel. {known_cyl} of {n_cyl} places known.</p>
<ul class="tree">{"".join(rows)}</ul>
<p class="note">Dots: new, learning, known, solid. Tap a place on the map or in the list.</p></div>
<div class="foot"><a class="btn primary" href="{Q22}03-quiz-find.html">Continue here: 5 new, 9 due</a><a class="btn quiet" href="15-explore-spain.html">All of Spain</a></div></section>
{chrome("explore", "Castilla y León")}'''
page("16-region-castilla.html", "Castilla y León", body, {"page":"spain","basemap":"satellite","bounds":REGION_BOUNDS["castilla-y-leon"],"maxZoom":8.4,"dim":[d["name"] for d in cyl]}, "document.addEventListener('do-pick',e=>{location.href='14-explore-region.html';});", "Map of Castilla y León with its places. Click a place to open its card.")

# ---------- 10b Home: nothing due ----------
body = f'''<section class="card glass" aria-label="Today"><button id="close-card" class="iconbtn close" aria-label="Close, show the map">{SVG["close"]}</button><div class="body"><div class="kicker">Today · Friday 17 October</div><h1>Nothing due</h1>
<p class="lede">Everything you have learned is safe until tomorrow. Next due: 4 places on Saturday.</p>
<ul class="today">
<li><a href="16-region-castilla.html"><b>See today's five new places on the map</b><small>Arlanza, León, Tierra del Vino, Valtiendas, Valles de Benavente, all in Castilla y León</small></a></li>
<li><a href="12-guide-rioja.html"><b>Read next: Rioja</b><small>The place guide, before Rioja's zones come into the quiz</small></a></li>
</ul></div>
<div class="foot"><a class="btn primary" href="{Q22}03-quiz-find.html">Learn five new places</a><a class="btn quiet" href="15-explore-spain.html">Just explore</a></div></section>
{chrome("explore", "Spain")}'''
page("10b-home-nothing-due.html", "Today, nothing due", body, {"page":"spain","basemap":"satellite"}, "")

# ---------- 17 First run ----------
opts = "".join(f'<button class="chip" role="radio" aria-checked="{"true" if k=="green-spain" else "false"}" data-start="{k}"><i style="display:inline-block;width:.7rem;height:.7rem;border-radius:.2rem;background:{MACRO[k]["color"]}"></i>{esc(MACRO[k]["name"])}</button>' for k in ORDER if counts(k)[1])
body = f'''<section class="card glass first" aria-label="Welcome to Atlaslope"><div class="body"><div class="kicker">Welcome</div><h1>Atlaslope</h1>
<p class="lede">The wine atlas that quizzes you. Learn where Spain's wine places are, why their wines taste as they do, and keep it: Atlaslope asks again just before you would forget.</p>
<h3>Where do you want to start?</h3>
<div class="chips" role="radiogroup" aria-label="Start with">{opts}<button class="chip" role="radio" aria-checked="false" data-start="spain">All of Spain, in course order</button></div>
<p class="note">Course order starts in Green Spain. You can change this any time from the Spain card.</p>
<h3>Moving the map</h3>
<ul class="hints"><li><b>Drag</b> to move, <b>pinch or scroll</b> to zoom.</li><li><b>Two fingers up or down</b>, or <b>right-drag</b> with a mouse, to tilt into 3D. The <b>3D</b> button does the same.</li><li><b>Two fingers twist</b>, or <b>Ctrl-drag</b>, to turn. The compass button points north again.</li></ul></div>
<div class="foot"><a class="btn primary" href="10-home-today.html">Start with Green Spain</a><a class="btn quiet" href="15-explore-spain.html">Skip, just explore</a></div></section>
{chrome("explore", "Welcome")}'''
FR = "const go=document.querySelector('.first .btn.primary');document.querySelectorAll('[data-start]').forEach(c=>c.addEventListener('click',()=>{document.querySelectorAll('[data-start]').forEach(x=>x.setAttribute('aria-checked','false'));c.setAttribute('aria-checked','true');go.textContent=c.dataset.start==='spain'?'Start with all of Spain':'Start with '+c.textContent.trim();}));"
page("17-first-run.html", "Welcome", body, {"page":"spain","basemap":"satellite","pitch":35}, FR)

# ---------- index ----------
items = [
 ("17-first-run.html","First run · welcome","Shown once: what Atlaslope is in three lines, where to start (a study region or all of Spain), how to tilt and turn the map."),
 ("10-home-today.html","Home · the map with Today","Atlas base, the Today card: what is due, where to continue, what to read. Close it and you are on the map."),
 ("10b-home-nothing-due.html","Home · nothing due","The Today card on a day with nothing to review: five new places or just explore."),
 ("11-layers-climate.html","Layers · climate on","The map menu open (bottom right, with zoom and 3D): satellite, climate, 3D relief, boundaries."),
 ("12-guide-rioja.html","Place guide · Rioja","Where it sits, why it tastes as it does, fly-there buttons, a cited fact sheet, zones, neighbours, test me."),
 ("13-mastery.html","Progress · your map","Spain shaded in four steps by how well you know each place, counts per study region, reset with an undo."),
 ("15-explore-spain.html","Explore · Spain, the place tree","The Spain card: ten study regions with their colours and known counts. The top of the tree."),
 ("16-region-castilla.html","Explore · a region","Castilla y León: its places with their state, continue here, the rest of Spain dimmed."),
 ("14-explore-region.html","Explore · a place","Toro selected on satellite: breadcrumb, the place card with three cited facts, read the guide or test me."),
]
li = "".join(f'<li><a href="{f}" style="font-family:var(--serif);font-size:1.25rem;text-decoration:none">{esc(t)}</a><span style="color:var(--ink3);font-size:.9rem;max-width:55%;text-align:right">{esc(d)}</span></li>' for f,t,d in items)
open(os.path.join(OUT,"index.html"),"w").write(f'''<!doctype html><html lang="en" data-theme="paper"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Atlaslope · mock-ups, round 3</title>
<link rel="stylesheet" href="assets/app.css"><style>body{{overflow:auto;background:#F6F1E7}}.wrap{{max-width:52rem;margin:3rem auto;padding:0 1.25rem}}</style></head><body><div class="wrap">
<div class="kicker">Mock-ups, round 3 · the system round, 16 Oct 2026</div><h1>Atlaslope</h1><p class="lede">The five screens the flow sketch marked new, on the real map: atlas base by default (relief, rivers, towns, serif names), satellite one tap away, 3D terrain streamed live. Boundaries are the official MAPA layer; Rioja's zones come from the official municipality lists. The quiz chain is unchanged and still lives in round 2.2, linked from these pages.</p>
<ul class="list">{li}</ul>
<p class="note">Satellite imagery and terrain need internet. Type: Newsreader and IBM Plex Sans. Map: MapLibre GL. Geography: Natural Earth. Terrain: Mapzen tiles on AWS Open Data. Imagery: Esri World Imagery, attribution on the map. The climate layer is schematic by province and says so.</p></div></body></html>''')
print("ok", len(items), "pages")
