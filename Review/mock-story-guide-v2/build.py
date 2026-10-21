"""Story guide mock, round 2 (21 Oct 2026): "Read with the map" for Rioja and Priorat, owner decisions built in.

Builds ONE self-contained index.html (CSS, JS, fonts, photos, slope tint inline; map tiles load live) from the repo:
guide text from content/guides/{rioja,priorat}.json (unchanged), sources from content/sources.json, photos from public/photos/800,
outlines from data/dops.geojson (DO23 Rioja, DO70 Priorat) and data/rioja-zones.geojson, slope tint from Mapzen Terrarium tiles.
Run: python3 Review/mock-story-guide-v2/build.py [out_file]
Default out: <main checkout>/mocks/story-guide-v2/index.html (git-ignored folder).
"""
import base64, json, pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
# A worktree has no node_modules or mocks folder of its own: fall back to the main checkout (.claude/worktrees/<name>).
MAIN = ROOT.parents[2] if ROOT.parent.name == 'worktrees' else ROOT
NM = next(p for p in (ROOT / 'node_modules', MAIN / 'node_modules') if p.exists())
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else MAIN / 'mocks/story-guide-v2/index.html'
OUT.parent.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(HERE))
import tint

GUIDES = {k: json.loads((ROOT / f'content/guides/{k}.json').read_text()) for k in ('rioja', 'priorat')}
sources = json.loads((ROOT / 'content/sources.json').read_text())
photos = json.loads((ROOT / 'data/photos.json').read_text())['photos']
# No entry in data/photos.json has a recorded location (keys: title, alt, page, licenceUrl, licence, artist), so there are no photo pins [V].
PHOTOS_WITH_LOCATION = [k for k, v in photos.items() if any(x in v for x in ('lat', 'lon', 'lng', 'location', 'coords', 'gps'))]


def b64(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(pathlib.Path(path).read_bytes()).decode()


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


# ---------- map data ----------
dops = json.loads((ROOT / 'data/dops.geojson').read_text())
zones = json.loads((ROOT / 'data/rioja-zones.geojson').read_text())
ZID = {'Rioja Alta': 'rioja-alta', 'Rioja Alavesa': 'rioja-alavesa', 'Rioja Oriental': 'rioja-oriental'}
for f in zones['features']:
    f['properties'] = {'id': ZID[f['properties']['zone']], 'name': f['properties']['zone']}
do_rioja = next(f for f in dops['features'] if f['properties']['code'] == 'DO23')
do_priorat = next(f for f in dops['features'] if f['properties']['code'] == 'DO70')
do_rioja['properties'] = {'id': 'rioja', 'name': 'Rioja'}
do_priorat['properties'] = {'id': 'priorat', 'name': 'Priorat'}
FOCUS = {'type': 'FeatureCollection', 'features': [do_rioja, do_priorat] + zones['features']}


def bbox(geom):
    xs, ys = [], []
    def walk(c):
        if isinstance(c[0], (int, float)):
            xs.append(c[0]); ys.append(c[1])
        else:
            for x in c: walk(x)
    walk(geom['coordinates'])
    return [min(xs), min(ys), max(xs), max(ys)]


def label_point(geom):
    rings = [geom['coordinates'][0]] if geom['type'] == 'Polygon' else [p[0] for p in geom['coordinates']]
    def area(r):
        return sum(r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1] for i in range(len(r) - 1)) / 2
    r = max(rings, key=lambda r: abs(area(r)))
    a = area(r); cx = cy = 0
    for i in range(len(r) - 1):
        k = r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]
        cx += (r[i][0] + r[i + 1][0]) * k; cy += (r[i][1] + r[i + 1][1]) * k
    return [round(cx / (6 * a), 4), round(cy / (6 * a), 4)]


BOUNDS = {'rioja': bbox(do_rioja['geometry']), 'priorat': bbox(do_priorat['geometry'])}
LABELS = {}
for f in zones['features']:
    BOUNDS[f['properties']['id']] = bbox(f['geometry'])
    LABELS[f['properties']['id']] = label_point(f['geometry'])

# ---------- slope tint (decision 4): one calm wine colour, low opacity, land steeper than 30% ----------
TINT_RGB, TINT_ALPHA = (140, 35, 64), 70  # #8C2340 at about 27% at most; soft edge 27 to 33%
TINTS = {}
for gid in ('rioja', 'priorat'):
    # padding 0.06 degrees so every stop (Sierra de Cantabria, Montsant) lies inside the overlay
    url, corners, st = tint.slope_overlay(ROOT / '.cache/terrarium', BOUNDS[gid], 0.06, TINT_RGB, TINT_ALPHA)
    TINTS[gid] = {'url': url, 'coordinates': corners}
    print('tint', gid, st)


# ---------- sources and photos ----------
def cite_html(cites):
    by = {}
    for c in cites:
        sid, page = c.split(':p')
        by.setdefault(sid, []).append(page)
    parts = []
    for sid, pages in by.items():
        s = sources[sid]
        parts.append(f'<a href="{esc(s["url"])}" target="_blank" rel="noopener">{esc(s["title"])}, p. {", ".join(pages)}</a>')
    return '<p class="src">Source: ' + '; '.join(parts) + '</p>'


def photo(pid, cls):
    p = photos[pid]
    return f'<img class="{cls}" src="{b64(ROOT / f"public/photos/800/{pid}.webp", "image/webp")}" alt="{esc(p["alt"])}" loading="lazy" decoding="async">'


def credit_line(pid):
    p = photos[pid]
    return (f'<figcaption class="credit">Photos: <a href="{esc(p["page"])}" target="_blank" rel="noopener">{esc(p["artist"])}</a>'
            f' · {esc(p["licence"])} · cropped and resized</figcaption>')


def figure(pid, cls):
    return f'<figure class="{cls}">{photo(pid, "ph")}{credit_line(pid)}</figure>'


# ---------- views: what the map shows for each step ----------
# DESIGN CHOICES (not facts): pitch, bearing and zoom of every stop below were picked to prove the sentence the stop sits by
# (a wall seen from the north, slate slopes seen low from the valley, ...). `focus` is the outline drawn; `zadj` shifts the
# fitted zoom for tilted bounds. All coordinates of towns marked [A] are approximate.
HARO, ALFARO = [-2.847, 42.577], [-1.750, 42.180]  # [A]



def fly_view(fly, base, **over):
    v = {'chip': fly['label'], 'focus': base}
    if 'place' in fly:
        v['bounds'] = BOUNDS[fly['place']]
    else:
        v.update({'center': fly['point'], 'zoom': fly['zoom'], 'dot': fly['point']})
    v.update(over)
    return v


def stop_html(fly, solo=False):
    return (f'<div class="stop{" solo" if solo else ""}"><p class="stop-lab"><small>On the map</small>{esc(fly["label"])}</p>'
            f'<p class="cap">{esc(fly["caption"])}</p>{cite_html(fly["cite"])}</div>')


def chapter_head(gid, c, n):
    return f'<h2 id="{gid}-ch-{c["id"]}"><span class="n">{n}</span>{esc(c["title"])}</h2>' + ''.join(f'<p>{esc(p)}</p>' for p in c['paras'])


def cover_html(gid, g, pid):
    toc = ''.join(f'<li><a href="#{gid}-ch-{c["id"]}">{esc(c["title"])}</a></li>' for c in g['chapters'])
    return (f'{figure(pid, "cover")}<p class="kicker">Terroir · {g["minutes"]}-minute read</p>'
            f'<h1 id="{gid}-title">{esc(g["title"])}</h1><p class="lede">{esc(g["lede"]["text"])}</p>{cite_html(g["lede"]["cite"])}'
            f'<nav class="toc" aria-label="Chapters"><ol>{toc}</ol></nav><p class="hint">Scroll to read. The map follows the text.</p>')


# ---- Rioja ----
def build_rioja():
    g = GUIDES['rioja']
    V, S, used = {}, [], []
    ch = {c['id']: c for c in g['chapters']}
    V['intro'] = {'center': [-2.5, 42.3], 'zoom': 6.7, 'pitch': 0, 'bearing': 0, 'focus': 'rioja', 'chip': 'Rioja in northern Spain'}
    S.append(('intro', 0, cover_html('rioja', g, 'rioja-2')))
    # 1 Valley: looking up the valley from Alfaro towards Haro; the Sierra seen from the north as a wall.
    c = ch['valley']; f0, f1 = c['fly']
    V['valley'] = fly_view(f0, 'rioja', bounds=None, center=[-2.30, 42.37], zoom=8.6, pitch=55, bearing=-65, dot=None, markers=[['Haro', HARO], ['Alfaro', ALFARO]])
    V['sierra'] = fly_view(f1, 'rioja', center=[-2.62, 42.60], zoom=10.7, pitch=72, bearing=180)
    S.append(('valley', 1, chapter_head('rioja', c, 1) + cite_html(c['cite']) + stop_html(f0)))
    S.append(('sierra', 1, stop_html(f1, True)))
    # 2 Climate: west to east, flat and north-up so the west-east change reads; then one tilted view per zone.
    c = ch['climate']
    V['climate'] = {'bounds': BOUNDS['rioja'], 'focus': 'zones', 'pitch': 0, 'bearing': 0, 'chip': 'Rioja’s three zones', 'zonelabels': True}
    S.append(('climate', 2, chapter_head('rioja', c, 2) + cite_html(c['cite'])))
    zphoto = {'Rioja Alta': 'rioja-alta-1', 'Rioja Alavesa': 'rioja-alavesa-1', 'Rioja Oriental': 'rioja-oriental-1'}
    # Alta: Atlantic weather arrives from the west, so look west; Alavesa: look north to the Sierra behind it; Oriental: look east.
    zcam = {'rioja-alta': dict(pitch=45, bearing=270, zadj=-0.2), 'rioja-alavesa': dict(pitch=50, bearing=0, zadj=-0.2),
            'rioja-oriental': dict(pitch=45, bearing=90, zadj=-0.2)}
    for card in c['cards']:
        fl = card['fly']; vid = 'z-' + fl['place']
        V[vid] = fly_view(fl, fl['place'], zonelabels=True, **zcam[fl['place']])
        V[vid].pop('dot', None)
        S.append((vid, 2, f'<article class="zone" aria-labelledby="h-{vid}">{figure(zphoto[card["title"]], "zone-img")}'
                          f'<h3 id="h-{vid}">{esc(card["title"])}</h3><p class="lab">Climate</p><p>{esc(card["climate"])}</p>'
                          f'<p class="lab">Wine</p><p>{esc(card["wine"])}</p>{cite_html(fl["cite"])}</article>'))
        used.append(zphoto[card['title']])
    # 3 Soils: the Alavesa terraces seen low from the Ebro side, looking up at the steps.
    c = ch['soils']; fs = c['fly'][0]
    V['soils'] = fly_view(fs, fs['place'], pitch=62, bearing=15, zadj=0.4)
    S.append(('soils', 3, chapter_head('rioja', c, 3) + cite_html(c['cite']) + stop_html(fs)))
    # 4 Barrel: back out to Rioja, then in to Haro's station quarter.
    c = ch['barrel']; fb = c['fly'][0]
    V['barrel'] = {'bounds': BOUNDS['rioja'], 'focus': 'rioja', 'pitch': 0, 'bearing': 0, 'chip': 'Rioja', 'markers': [['Haro', HARO]]}
    V['haro'] = fly_view(fb, 'rioja', pitch=60, bearing=20, zoom=14.2)
    p1, p2 = c['paras']
    S.append(('barrel', 4, f'<h2 id="rioja-ch-barrel"><span class="n">4</span>{esc(c["title"])}</h2><p>{esc(p1)}</p>'))
    S.append(('haro', 4, f'<p>{esc(p2)}</p>{cite_html(c["cite"])}{stop_html(fb)}'))
    end = ('<div class="end"><p class="kicker">You reached the end</p><p class="endq">Can you place the three zones?</p>'
           '<a class="btn" href="#quiz=test&amp;set=rioja-alta,rioja-alavesa,rioja-oriental">Test me on Rioja’s zones</a></div>')
    S.append(('haro', 0, end))
    return V, S, ['rioja-2'] + used


# ---- Priorat ----
def build_priorat():
    g = GUIDES['priorat']
    V, S = {}, []
    ch = {c['id']: c for c in g['chapters']}
    V['intro'] = {'center': [1.05, 41.55], 'zoom': 7.6, 'pitch': 0, 'bearing': 0, 'focus': 'priorat', 'chip': 'Priorat in Catalonia'}
    S.append(('intro', 0, cover_html('priorat', g, 'priorat-1')))
    # 1 Bowl: from the south, Montsant closes the north as a wall; along the Siurana depression; Scala Dei at the foot of Montsant.
    c = ch['bowl']; f0, f1, f2 = c['fly']
    V['montsant'] = fly_view(f0, 'priorat', center=[0.80, 41.235], zoom=10.4, pitch=68, bearing=0)
    V['siurana'] = fly_view(f1, 'priorat', center=[0.786, 41.20], zoom=10.7, pitch=62, bearing=45)
    V['scala'] = fly_view(f2, 'priorat', center=[0.8104, 41.2565], zoom=12.4, pitch=64, bearing=0)
    S.append(('montsant', 1, chapter_head('priorat', c, 1) + cite_html(c['cite']) + stop_html(f0)))
    S.append(('siurana', 1, stop_html(f1, True)))
    S.append(('scala', 1, stop_html(f2, True)))
    # 2 Air: no map stop in the guide; an overview looking north (Montsant behind) is added as in Rioja's chapter 2 and 4 overviews.
    c = ch['air']
    V['air'] = {'bounds': BOUNDS['priorat'], 'focus': 'priorat', 'pitch': 50, 'bearing': 0, 'zadj': -0.3, 'chip': 'Priorat, looking north to the Montsant'}
    S.append(('air', 2, chapter_head('priorat', c, 2) + cite_html(c['cite'])))
    # 3 Licorella: slate slopes seen low and from the valley, looking up.
    c = ch['licorella']; fl = c['fly'][0]
    V['licorella'] = fly_view(fl, 'priorat', pitch=72, bearing=330, zadj=0.5)
    S.append(('licorella', 3, chapter_head('priorat', c, 3) + cite_html(c['cite']) + stop_html(fl)
              + figure('priorat-2', 'zone-img')))
    # 4 Wines
    c = ch['wines']
    V['wines'] = {'bounds': BOUNDS['priorat'], 'focus': 'priorat', 'pitch': 0, 'bearing': 0, 'chip': 'Priorat'}
    terms = ''.join(f'<dt>{esc(t["term"])}</dt><dd>{esc(t["text"])}</dd>' for t in c.get('terms', []))
    S.append(('wines', 4, chapter_head('priorat', c, 4) + (f'<dl class="terms">{terms}</dl>' if terms else '') + cite_html(c['cite'])))
    S.append(('wines', 0, '<div class="end"><p class="kicker">You reached the end</p><p class="endq">That is Priorat.</p></div>'))
    return V, S, ['priorat-1', 'priorat-2']


BUILT = {'rioja': build_rioja(), 'priorat': build_priorat()}
VIEWS = {k: v[0] for k, v in BUILT.items()}
CHAPTERS = {k: [c['title'] for c in GUIDES[k]['chapters']] for k in GUIDES}


def steps_html(gid):
    out = []
    for vid, n, h in BUILT[gid][1]:
        cls = ' step-intro' if vid == 'intro' else ' step-end' if 'class="end"' in h else ''
        out.append(f'<section class="step{cls}" data-view="{vid}" data-ch="{n}"><div class="step-in">{h}</div></section>')
    return '\n'.join(out)


STOPS = {k: len({s[0] for s in BUILT[k][1] if s[0] != 'intro'}) for k in BUILT}

# ---------- the four entry options (decision 1) ----------
def esri_tile(lon, lat, z):
    import math
    n = 2 ** z
    x = int((lon + 180) / 360 * n); y = int((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)
    return f'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'


THUMB = {'rioja': esri_tile(-2.62, 42.55, 10), 'priorat': esri_tile(0.80, 41.22, 11)}
NAME = {'rioja': 'Rioja', 'priorat': 'Priorat'}


def options_html(gid):
    g = GUIDES[gid]; nm = NAME[gid]; mins = g['minutes']; n = STOPS[gid]
    sec = (f'<p class="kicker">Terroir</p><h3>{esc(g["title"])}</h3><p class="lede-s">{esc(g["lede"]["text"])}</p>')
    go = 'data-go="story"'
    return {
        'A': (f'{sec}<p class="opt-a-row"><a class="opt-a" href="#story" {go}>Read with the map</a><span class="sub">{mins} min</span></p>'),
        'B': (f'{sec}<a class="opt-b" href="#story" {go}><span class="t">Read with the map</span>'
              f'<span class="s">Text on the left, the land on the right</span></a>'),
        'C': (f'{sec}<a class="opt-c" href="#story" {go}><span class="t">Read with the map</span>'
              f'<span class="s">{mins} minutes · {n} places to fly to</span></a>'),
        'D': (f'{sec}<a class="opt-d" href="#story" {go}><img src="{THUMB[gid]}" alt="Satellite view of {nm}" width="96" height="96" loading="lazy">'
              f'<span class="body"><span class="t">Read with the map</span>'
              f'<span class="s">Fly over {nm} as you read. {n} places, {mins} minutes.</span></span><span class="go">Start</span></a>'),
    }


OPTION_NAMES = {'A': 'Text link', 'B': 'Outlined button', 'C': 'Solid black button', 'D': 'Full-width band with a satellite thumbnail'}
RECOMMENDED = 'C'
WHY = ('C is the app’s own main-button style (black with champagne text), so it reads as the one action of the section '
       'without taking over the page the way the band does; A and B are easy to miss, D pushes the plain text down.')
opts = {g: options_html(g) for g in GUIDES}
cards = ''
for k in 'ABCD':
    rec = '<span class="rec">Recommended</span>' if k == RECOMMENDED else ''
    inner = ''.join(f'<div class="opt-body" data-guide="{g}"{" hidden" if g != "rioja" else ""}>{opts[g][k]}</div>' for g in GUIDES)
    cards += (f'<article class="opt{" is-rec" if k == RECOMMENDED else ""}" aria-labelledby="opt-{k}"><header><h3 id="opt-{k}">'
              f'<span class="k">{k}</span>{OPTION_NAMES[k]}</h3>{rec}</header>{inner}</article>')

# ---------- assets ----------
fonts = ROOT / 'public/fonts'
FONT_CSS = f'''
@font-face{{font-family:"Newsreader";font-style:normal;font-weight:200 800;font-display:swap;src:url({b64(fonts/'newsreader-latin-opsz-normal.woff2','font/woff2')}) format("woff2")}}
@font-face{{font-family:"IBM Plex Sans";font-weight:400;font-display:swap;src:url({b64(fonts/'ibm-plex-sans-latin-400-normal.woff2','font/woff2')}) format("woff2")}}
@font-face{{font-family:"IBM Plex Sans";font-weight:500;font-display:swap;src:url({b64(fonts/'ibm-plex-sans-latin-500-normal.woff2','font/woff2')}) format("woff2")}}
@font-face{{font-family:"IBM Plex Sans";font-weight:600;font-display:swap;src:url({b64(fonts/'ibm-plex-sans-latin-600-normal.woff2','font/woff2')}) format("woff2")}}
'''
ML_JS = (NM / 'maplibre-gl/dist/maplibre-gl.js').read_text()
ML_CSS = (NM / 'maplibre-gl/dist/maplibre-gl.css').read_text()
CSS = (HERE / 'story.css').read_text()
JS = (HERE / 'story.js').read_text()
DATA = json.dumps({'views': VIEWS, 'focus': FOCUS, 'labels': LABELS, 'chapters': CHAPTERS, 'tints': TINTS,
                   'back': {k: f'#place={k}&page=1' for k in GUIDES}}, ensure_ascii=False, separators=(',', ':'))
used = sorted(set(BUILT['rioja'][2] + BUILT['priorat'][2]))

texts = ''.join(f'<div class="text" data-guide="{g}"{" hidden" if g != "rioja" else ""}>\n{steps_html(g)}\n</div>' for g in GUIDES)

html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Read with the map, round 2 · AtlaSlope</title>
<style>{FONT_CSS}</style><style>{ML_CSS}</style><style>{CSS}</style>
</head><body>
<a class="skip" href="#story">Skip to the story</a>
<header class="top">
  <p class="brand">AtlaSlope</p>
  <div class="switch" role="group" aria-label="Guide"><button type="button" data-guide="rioja" aria-pressed="true">Rioja</button><button type="button" data-guide="priorat" aria-pressed="false">Priorat</button></div>
  <p class="where"><span class="where-n"></span></p>
  <a class="back" href="#place=rioja&amp;page=1">Back to Rioja</a>
  <div class="progress" aria-hidden="true"><i></i></div>
</header>
<section class="options" aria-labelledby="opt-h">
  <p class="kicker">Mock · round 2</p>
  <h2 id="opt-h">How the story opens, in four strengths</h2>
  <p class="opt-note">This sits in the guide’s Terroir section. The plain text stays. Pick one.</p>
  <div class="opt-grid">{cards}</div>
  <p class="opt-why"><strong>Recommended: {RECOMMENDED}.</strong> {esc(WHY)}</p>
</section>
<main id="story" class="sg">
  <div class="mapwrap" aria-label="Map that follows the text" role="region">
    <div id="map"></div>
    <p class="chip"></p>
    <div class="exag" role="group" aria-label="Terrain height"><span>Terrain height</span><button type="button" data-k="1.5" aria-pressed="true">×1.5</button><button type="button" data-k="1.3" aria-pressed="false">×1.3</button></div>
    <button class="recentre" type="button" hidden>Back to the story view</button>
    <p class="mapcredit"><i class="sw" aria-hidden="true"></i>Tint: slopes over 30% · terrain height ×<span class="kx">1.5</span> · Imagery PNOA © IGN, Esri · Terrain Mapzen</p>
  </div>
{texts}
</main>
<p class="foot">Photos in this page: {len(used)}, each with its credit line. Outlines: DOCa Rioja and DO Priorat © MAPA; Rioja zones CC-BY 4.0 ign.es. No photo has a recorded location, so none is pinned on the map.</p>
<script>{ML_JS}</script>
<script>window.SG={DATA};</script>
<script>{JS}</script>
</body></html>'''
OUT.write_text(html)
print(OUT, round(len(html) / 1e6, 2), 'MB', 'views', {k: len(v) for k, v in VIEWS.items()}, 'photos with location', len(PHOTOS_WITH_LOCATION))
