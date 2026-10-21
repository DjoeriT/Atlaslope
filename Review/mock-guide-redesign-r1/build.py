"""Guide redesign, round 1 (21 Oct 2026): four designed Rioja guide pages (A-D), each topped by the big photo button; option C unfolds into the v4 map mode.
Head (map data, steps) is the v4 build.py, copied; the tail builds the options and the hub page.
v3 plus: the rest of the guide page (guide-rest-rioja.json, rendered by the app, see README), Close/Show the map button. Rioja only.

Builds ONE self-contained index.html (CSS, JS, fonts, photos, slope tint inline; map tiles load live) from the repo:
guide text from content/guides/{rioja,priorat}.json (unchanged), sources from content/sources.json, photos from public/photos/800,
outlines from data/dops.geojson (DO23 Rioja, DO70 Priorat) and data/rioja-zones.geojson, slope tint from Mapzen Terrarium tiles.
Run: python3 Review/mock-guide-redesign-r1/build.py [out_file]
Default out: <main checkout>/mocks/guide-redesign-r1/index.html (git-ignored folder).
"""
import base64, json, math, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
# A worktree has no node_modules or mocks folder of its own: fall back to the main checkout (.claude/worktrees/<name>).
MAIN = ROOT.parents[2] if ROOT.parent.name == 'worktrees' else ROOT
NM = next(p for p in (ROOT / 'node_modules', MAIN / 'node_modules') if p.exists())
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else MAIN / 'mocks/guide-redesign-r1/index.html'
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
TINT_RGB, TINT_ALPHA = (140, 35, 64), 33  # #8C2340 at about 13% at most (LeadBot 21 Oct: 27% hid the land); soft edge 27 to 33%
TINTS = {}
for gid in ('rioja', 'priorat'):
    # padding 0.06 degrees so every stop (Sierra de Cantabria, Montsant) lies inside the overlay
    url, corners, st = tint.slope_overlay(next(p for p in (ROOT / '.cache/terrarium', MAIN / '.cache/terrarium') if p.exists()), BOUNDS[gid], 0.06, TINT_RGB, TINT_ALPHA)
    TINTS[gid] = {'url': url, 'coordinates': corners}
    print('tint', gid, st)


# ---------- round 3 layers ----------
LAYER_DIR = next(p for p in (MAIN / 'mocks/story-layers', ROOT / 'mocks/story-layers') if p.exists())
MAIN_RIVERS = {'rioja': ['Ebro', 'Oja', 'Tirón', 'Najerilla', 'Iregua'], 'priorat': ['Siurana', 'Montsant']}


def r4(c):
    return [round(c[0], 4), round(c[1], 4)] if isinstance(c[0], (int, float)) else [r4(x) for x in c]


def build_rivers(gid):
    d = json.loads((LAYER_DIR / f'rivers-{gid}.geojson').read_text())
    keep = ('río', 'rio', 'riu', "l'ebre")
    out = []
    for f in d['features']:
        n = f['properties']['name']
        if not n.lower().startswith(keep) or n.lower().startswith('riuet'):
            continue
        short = n.replace(' o Glera', '')
        short = re.sub(r"^(Río|Riu de|Riu|L'Ebre/Río)\s+", '', short)
        main = short.lower() in [m.lower() for m in MAIN_RIVERS[gid]] or (gid == 'priorat' and short == 'Ebro')
        label = ''
        if main:
            label = 'Ebre' if (gid == 'priorat' and short == 'Ebro') else ('Río ' if gid == 'rioja' else 'Riu ') + short
        out.append({'type': 'Feature', 'properties': {'name': label, 'main': 1 if main else 0}, 'geometry': {'type': 'MultiLineString', 'coordinates': r4(f['geometry']['coordinates'])}})
    return {'type': 'FeatureCollection', 'features': out}


RIVERS = {g: build_rivers(g) for g in ('rioja', 'priorat')}
print('rivers', {g: len(v['features']) for g, v in RIVERS.items()})
NAMES = {}
for g in ('rioja', 'priorat'):
    d = json.loads((LAYER_DIR / f'names-{g}.geojson').read_text())
    d['features'] = [f for f in d['features'] if f['properties']['type'] != 'valley']  # LAYERS.md: the valley class is weak, dropped
    for f in d['features']: f['geometry']['coordinates'] = r4(f['geometry']['coordinates'])
    NAMES[g] = d


def siurana_centre():
    for f in RIVERS['priorat']['features']:
        if f['properties']['name'] == 'Riu Siurana':
            pts = [p for l in f['geometry']['coordinates'] for p in l]
            return pts[len(pts) // 2]


def clip_ring(ring, b):
    x0, y0, x1, y1 = b
    def clip(pts, inside, inter):
        out = []
        for i in range(len(pts)):
            a, c = pts[i - 1], pts[i]
            if inside(c):
                if not inside(a): out.append(inter(a, c))
                out.append(c)
            elif inside(a): out.append(inter(a, c))
        return out
    def ix(xv): return lambda a, c: [xv, a[1] + (c[1] - a[1]) * (xv - a[0]) / (c[0] - a[0])]
    def iy(yv): return lambda a, c: [a[0] + (c[0] - a[0]) * (yv - a[1]) / (c[1] - a[1]), yv]
    pts = ring[:-1]
    for ins, it in ((lambda p: p[0] >= x0, ix(x0)), (lambda p: p[0] <= x1, ix(x1)), (lambda p: p[1] >= y0, iy(y0)), (lambda p: p[1] <= y1, iy(y1))):
        if not pts: return None
        pts = clip(pts, ins, it)
    return pts + [pts[0]] if len(pts) >= 3 else None


# Koppen names and colours from src/map/climate.ts (the app's own legend); other classes use its NO_CLIMATE_COLOR.
KOP = {'Cfb': ('Oceanic', '#1F5F85'), 'Csb': ('Mild Mediterranean', '#D2D45A'), 'Csa': ('Hot Mediterranean', '#D1761C'),
       'BSk': ('Cool, dry steppe', '#B4A2DB'), 'BSh': ('Hot semi-arid', '#9E2A1B'), 'Cfa': ('Humid subtropical', '#4FAE86')}
kb = [BOUNDS['rioja'][0] - .2, BOUNDS['rioja'][1] - .2, BOUNDS['rioja'][2] + .2, BOUNDS['rioja'][3] + .2]
kfeat = []
for f in json.loads((ROOT / 'data/koppen-spain.geojson').read_text())['features']:
    if f['properties'].get('box') != 'main': continue
    polys = f['geometry']['coordinates'] if f['geometry']['type'] == 'MultiPolygon' else [f['geometry']['coordinates']]
    outp = []
    for poly in polys:
        bb = bbox({'coordinates': poly})
        if bb[2] < kb[0] or bb[0] > kb[2] or bb[3] < kb[1] or bb[1] > kb[3]: continue
        rings = [clip_ring(r, kb) for r in poly]
        if rings[0]: outp.append([r4(r) for r in rings if r])
    if outp:
        code = f['properties']['code']
        kfeat.append({'type': 'Feature', 'properties': {'code': code, 'color': KOP.get(code, ('', '#9A948A'))[1]}, 'geometry': {'type': 'MultiPolygon', 'coordinates': outp}})
KOPPEN = {'type': 'FeatureCollection', 'features': kfeat}
KOP_LEGEND = []  # classes that actually reach the Rioja outline's box (the clip is padded, so more are drawn than listed)
for f in kfeat:
    if any(clip_ring(poly[0], BOUNDS['rioja']) for poly in f['geometry']['coordinates']):
        SH = {'BSk': 'Steppe', 'Csa': 'Hot Med.', 'Csb': 'Mild Med.', 'Cfa': 'Humid', 'Cfb': 'Oceanic'}
        c = f['properties']['code']
        e = [KOP[c][0], f['properties']['color'], SH[c]] if c in KOP else ['Cold mountain (D classes)', f['properties']['color'], 'Cold mtn']
        if e not in KOP_LEGEND: KOP_LEGEND.append(e)
print('koppen classes', [f['properties']['code'] for f in kfeat])


# Fade outside the focus: a rectangle with the focus outline(s) cut out, one feature per focus id (+ 'zones' = all three).
def inverse(polys):
    return {'type': 'Polygon', 'coordinates': [[[-10, 35], [6, 35], [6, 45], [-10, 45], [-10, 35]]] + [poly[0] for poly in polys]}


INV = []
for f in FOCUS['features']:
    g = f['geometry']; polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    INV.append({'type': 'Feature', 'properties': {'id': f['properties']['id']}, 'geometry': inverse(polys)})
INV.append({'type': 'Feature', 'properties': {'id': 'zones'}, 'geometry': inverse([f['geometry']['coordinates'] for f in zones['features']])})
INVERSE = {'type': 'FeatureCollection', 'features': INV}

# Locator inset: peninsula and Balearics from data/spain-mask.json (x scaled by cos 40 deg), Canarias left out.
mask = json.loads((ROOT / 'data/spain-mask.json').read_text())['spain']
COSK = math.cos(math.radians(40))
LOC_POLYS = [poly[0] for poly in mask if min(p[1] for p in poly[0]) > 35.5]
allp = [p for r in LOC_POLYS for p in r]
LX0, LX1 = min(p[0] for p in allp) * COSK, max(p[0] for p in allp) * COSK
LY0, LY1 = -max(p[1] for p in allp), -min(p[1] for p in allp)
LOC_S = 100.0 / (LX1 - LX0)
LOC_PATH = ''.join('M' + 'L'.join(f'{(p[0] * COSK - LX0) * LOC_S:.1f} {(-p[1] - LY0) * LOC_S:.1f}' for p in r) + 'Z' for r in LOC_POLYS)
LOC = {'ox': LX0, 'oy': LY0, 's': LOC_S, 'cosk': COSK, 'w': 100.0, 'h': round((LY1 - LY0) * LOC_S, 1)}


# ---------- sources and photos ----------
def src_inner(cites):
    by = {}
    for c in cites:
        sid, page = c.split(':p')
        by.setdefault(sid, []).append(page)
    parts = []
    for sid, pages in by.items():
        s = sources[sid]
        parts.append(f'<a href="{esc(s["url"])}" target="_blank" rel="noopener">{esc(s["title"])}, p. {", ".join(pages)}</a>')
    return 'Source: ' + '; '.join(parts)


def cite_html(cites):
    return '<p class="src">' + src_inner(cites) + '</p>'


# photos: the app's own (data/photos.json, public/photos/800) plus the ones found for this mock (photos/credits.json)
NEWPH = {}


def PH(pid):
    return NEWPH.get(pid) or photos[pid]


def photo(pid, cls):
    p = PH(pid)
    if pid in NEWPH:
        src = b64(HERE / f'photos/{pid}.jpg', 'image/jpeg'); style = f' style="object-position:{p["focus"]}"'
    else:
        src = b64(ROOT / f'public/photos/800/{pid}.webp', 'image/webp'); style = ''
    return f'<img class="{cls}" src="{src}" alt="{esc(p["alt"])}"{style} loading="lazy" decoding="async">'


def credits_line(pids):
    seen = []
    for p in pids:
        if p not in seen: seen.append(p)
    ent = '; '.join(f'<a href="{esc(PH(p)["page"])}" target="_blank" rel="noopener">{esc(PH(p)["artist"])}</a> · {esc(PH(p)["licence"])}' for p in seen)
    return f'<p class="photocredit">Photos: {ent} · cropped and resized</p>'


def figure(pid, cls):
    return f'<figure class="{cls}">{photo(pid, "ph")}</figure>'


# ---------- measured heights (data/place-measures.json, Mapzen Terrarium) ----------
MEAS = json.loads((ROOT / 'data/place-measures.json').read_text())['places']


def measure(pid, kind):
    m = MEAS[pid]; a = m['altitude']
    txt = {'median': f'Half the land lies above {a["median"]} m.', 'top': f'Half the land lies above {a["median"]} m. The highest tenth lies above {a["p90"]} m.',
           'low': f'The lowest tenth of the land lies below {a["p10"]} m.', 'steep': f'{round(m["slope"]["steepShare"] * 100)}% of the land is steeper than 30%.'}[kind]
    if pid == 'rioja-alta': txt = 'In Rioja Alta, ' + txt[0].lower() + txt[1:]
    return f'<p class="measure">{txt}<small>Measured by AtlaSlope · Terrain: Mapzen</small></p>'


REST = json.loads((HERE / 'guide-rest-rioja.json').read_text())
FLYHREF = '#place=rioja&fly='
MORE_BTN = re.compile(r'\s*<button type="button" class="more"[^>]*>[^<]*</button>')  # "and 8 more" is a React toggle; the list is saved open


def facts_html(beat):
    h = REST['facts'][beat]
    return f'<div class="facts-b">{MORE_BTN.sub("", h)}</div>' if h else ''


def rest_html(key, links=()):
    h = MORE_BTN.sub('', REST[key])
    for target in links:  # In short: each line links to the beat that tells it in full (the app's own hrefs only point at the page)
        h = h.replace('href="#place=rioja&amp;page"', f'href="#{target}"', 1)
    return f'<div class="rest">{h}</div>'


def fact(ll, text, cites, where):
    return {'ll': ll, 'where': where, 'text': text, 'src': src_inner(cites)}


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


STOPCARDS = {}  # vid -> card html, reused in the closed (live page) view


def stop_html(fly, solo=False, pic=None, meas='', href='', vid=''):
    img = figure(pic, 'stop-img') if pic else ''
    # The label is the guide's fly link: map open = flies the map here again; map closed = a plain link to the place page's map (the app's own href).
    lab = f'<a class="fly-link" href="{href}" data-fly="{vid}">{esc(fly["label"])}</a>'
    html = (f'<div class="stop{" solo" if solo else ""}">{img}<p class="stop-lab"><small>On the map</small>{lab}</p>'
            f'<p class="cap">{esc(fly["caption"])}</p>{meas}{cite_html(fly["cite"])}</div>')
    if vid: STOPCARDS[vid] = html
    return html


def river_near(gid, name, ll):
    best = None
    for f in RIVERS[gid]['features']:
        if f['properties']['name'] != name: continue
        for line in f['geometry']['coordinates']:
            for p in line:
                d = (p[0] - ll[0]) ** 2 + (p[1] - ll[1]) ** 2
                if best is None or d < best[0]: best = (d, p)
    return best[1]


def town(gid, name):
    for f in NAMES[gid]['features']:
        if f['properties']['name'] == name: return f['geometry']['coordinates']


def chapter_head(gid, c, n):
    return f'<h2 id="{gid}-ch-{c["id"]}"><span class="n">{n}</span>{esc(c["title"])}</h2>' + ''.join(f'<p>{esc(p)}</p>' for p in c['paras'])


def cover_html(gid, g, pid):
    toc = ''.join(f'<li><a href="#{gid}-ch-{c["id"]}">{esc(c["title"])}</a></li>' for c in g['chapters'])
    if gid == 'rioja': toc += ''.join(f'<li><a href="#{k}">{n}</a></li>' for k, n in (('taste', 'How it tastes'), ('short', 'In short'), ('producers', 'Producers')))
    return (f'{figure(pid, "cover")}<p class="kicker">Terroir · {g["minutes"]}-minute read</p>'
            f'<h1 id="{gid}-title">{esc(g["title"])}</h1><p class="lede">{esc(g["lede"]["text"])}</p>{cite_html(g["lede"]["cite"])}'
            f'<nav class="toc" aria-label="Chapters"><ol>{toc}</ol></nav><p class="hint">Scroll to read. The map follows the text.</p>')


# ---- Rioja ----
ZFACT = {'rioja-alta': 'Atlantic. More rain and fewer hours of sun than the south.',
         'rioja-alavesa': 'Both climates meet. The most sheltered by the Sierra de Cantabria.',
         'rioja-oriental': 'Mediterranean. The least rain and the most sun.'}


def build_rioja():
    g = GUIDES['rioja']
    V, S, used = {}, [], []
    ch = {c['id']: c for c in g['chapters']}
    V['intro'] = {'center': [-2.5, 42.3], 'zoom': 6.7, 'pitch': 0, 'bearing': 0, 'focus': 'rioja', 'chip': 'Rioja in northern Spain'}
    S.append(('intro', 0, cover_html('rioja', g, 'rioja-2')))
    # 1 Valley: looking up the valley from Alfaro towards Haro; the Sierra seen from the north as a wall.
    c = ch['valley']; f0, f1 = c['fly']
    V['valley'] = fly_view(f0, 'rioja', bounds=None, center=[-2.30, 42.37], zoom=8.6, pitch=55, bearing=-65, dot=None, markers=[['Haro', HARO], ['Alfaro', ALFARO]])
    V['sierra'] = fly_view(f1, 'rioja', center=[-2.70, 42.60], zoom=11.7, pitch=70, bearing=180)
    V['valley']['facts'] = [
        fact(town('rioja', 'Haro'), 'The vineyards run 100 km along the Ebro, from Haro in the west to Alfaro in the east.', f0['cite'], 'Haro'),
        fact(town('rioja', 'Alfaro'), 'The valley is never more than about 40 km wide.', f0['cite'], 'Alfaro')]
    V['sierra']['facts'] = [
        fact(town('rioja', 'Sierra de Cantabria'), 'The Sierra de Cantabria to the north protects the vines.', c['cite'], 'Sierra de Cantabria'),
        fact(town('rioja', 'Laguardia'), 'The mountains protect Rioja Alta, and Rioja Alavesa even more.', f1['cite'], 'Laguardia')]
    S.append(('valley', 1, chapter_head('rioja', c, 1) + cite_html(c['cite']) + stop_html(f0, pic='rioja-3', meas=measure('rioja', 'top'), href=FLYHREF + 'valley.0', vid='valley')))
    S.append(('sierra', 1, stop_html(f1, True, pic='rioja-sierra-1', href=FLYHREF + 'valley.1', vid='sierra') + facts_html('place')))
    used += ['rioja-3', 'rioja-sierra-1']
    # 2 Climate: west to east, flat and north-up so the west-east change reads; then one tilted view per zone.
    c = ch['climate']
    V['climate'] = {'bounds': BOUNDS['rioja'], 'focus': 'zones', 'pitch': 0, 'bearing': 0, 'chip': 'Rioja’s three zones', 'zonelabels': True, 'koppen': True}
    S.append(('climate', 2, chapter_head('rioja', c, 2) + cite_html(c['cite'])))
    zphoto = {'Rioja Alta': 'rioja-alta-1', 'Rioja Alavesa': 'rioja-alavesa-1', 'Rioja Oriental': 'rioja-oriental-1'}
    # Alta: Atlantic weather arrives from the west, so look west; Alavesa: look north to the Sierra behind it; Oriental: look east.
    zcam = {'rioja-alta': dict(pitch=45, bearing=270, zadj=-0.2), 'rioja-alavesa': dict(pitch=50, bearing=0, zadj=-0.2),
            'rioja-oriental': dict(pitch=45, bearing=90, zadj=-0.2)}
    for card in c['cards']:
        fl = card['fly']; vid = 'z-' + fl['place']
        V[vid] = fly_view(fl, fl['place'], zonelabels=True, koppen=True, **zcam[fl['place']])
        V[vid].pop('dot', None)
        V[vid]['facts'] = [fact(LABELS[fl['place']], ZFACT[fl['place']], fl['cite'], card['title'])]
        S.append((vid, 2, f'<article class="zone" aria-labelledby="h-{vid}">{figure(zphoto[card["title"]], "zone-img")}'
                          f'<h3 id="h-{vid}">{esc(card["title"])}</h3><p class="lab">Climate</p><p>{esc(card["climate"])}</p>'
                          f'<p class="lab">Wine</p><p>{esc(card["wine"])}</p>{measure(fl["place"], "top")}{cite_html(fl["cite"])}</article>'))
        used.append(zphoto[card['title']])
    # The measured climate is about all of Rioja, so it gets its own step on the three-zone view, not the last zone's (ReviewBot, 21 Oct 2026).
    S.append(('climate', 2, facts_html('weather')))
    # 3 Soils: the Alavesa terraces seen low from the Ebro side, looking up at the steps.
    c = ch['soils']; fs = c['fly'][0]
    V['soils'] = fly_view(fs, fs['place'], pitch=62, bearing=15, zadj=0.4, geo=True)
    V['soils']['facts'] = [
        fact(town('rioja', 'Laguardia'), 'Clay-limestone covers a quarter of the vineyard, on terraces and small plots in Rioja Alavesa.', c['cite'], 'Laguardia'),
        fact(town('rioja', 'San Vicente de la Sonsierra'), 'Clay-limestone also lies in the Sonsierra.', c['cite'], 'San Vicente de la Sonsierra'),
        fact(river_near('rioja', 'Río Ebro', town('rioja', 'Elciego')), 'Alluvial soil near the rivers is flat, deep and full of stones.', c['cite'], 'Ebro')]
    S.append(('soils', 3, chapter_head('rioja', c, 3) + cite_html(c['cite']) + stop_html(fs, pic='rioja-alavesa-2', meas=measure('rioja-alavesa', 'steep'), href=FLYHREF + 'soils.0', vid='soils') + facts_html('ground')))
    used.append('rioja-alavesa-2')
    # 4 Barrel: back out to Rioja, then in to Haro's station quarter.
    c = ch['barrel']; fb = c['fly'][0]
    V['barrel'] = {'bounds': BOUNDS['rioja'], 'focus': 'rioja', 'pitch': 0, 'bearing': 0, 'chip': 'Rioja', 'markers': [['Haro', HARO]]}
    V['haro'] = fly_view(fb, 'rioja', pitch=60, bearing=20, zoom=14.2)
    p1, p2 = c['paras']
    S.append(('barrel', 4, f'<h2 id="rioja-ch-barrel"><span class="n">4</span>{esc(c["title"])}</h2><p>{esc(p1)}</p>'))
    V['haro']['facts'] = [fact([-2.851, 42.585], 'In 1890 a French firm in Haro’s station quarter hired a champagne maker from Reims.', fb['cite'], 'Haro’s station quarter')]
    S.append(('haro', 4, f'<p>{esc(p2)}</p>{cite_html(c["cite"])}{stop_html(fb, pic="rioja-haro-1", meas=measure("rioja-alta", "median"), href=FLYHREF + "barrel.0", vid="haro")}{facts_html("rules")}'))
    used.append('rioja-haro-1')
    # How it tastes, In short, Producers: no stop, so the map holds one still, tilted view of the whole of Rioja (looking north).
    V['rest'] = {'bounds': BOUNDS['rioja'], 'focus': 'rioja', 'pitch': 50, 'bearing': 0, 'zadj': -0.3, 'chip': 'Rioja'}
    S.append(('rest', 5, rest_html('taste')))
    S.append(('rest', 6, rest_html('short', ('rioja-ch-barrel', 'rioja-ch-climate', 'rioja-ch-soils', 'rioja-ch-climate', 'rioja-ch-barrel'))))
    S.append(('rest', 7, rest_html('producers')))
    end = ('<div class="end"><p class="kicker">You reached the end</p><p class="endq">Can you place the three zones?</p>'
           '<a class="btn" href="#quiz=test&amp;set=rioja-alta,rioja-alavesa,rioja-oriental">Test me on Rioja’s zones</a></div>')
    S.append(('rest', 0, end))
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
    SIU = siurana_centre()  # mid-point of the river line itself, so the river is in view (v2 centred on a point beside it)
    V['siurana'] = fly_view(f1, 'priorat', center=SIU, zoom=11.2, pitch=45, bearing=0, dot=None, markers=[['Riu de Siurana', SIU]])
    V['scala'] = fly_view(f2, 'priorat', center=[0.8104, 41.2565], zoom=12.4, pitch=64, bearing=0)
    V['montsant']['facts'] = [
        fact(f0['point'], 'The Sierra de Montsant closes Priorat to the north.', f0['cite'], 'Sierra de Montsant'),
        fact(town('priorat', 'El Lloar'), 'The crests of El Lloar and La Figuera lie to the west.', c['cite'], 'El Lloar')]
    V['siurana']['facts'] = [fact(SIU, 'The Siurana river crosses the zone from northeast to southwest.', f1['cite'], 'Riu de Siurana')]
    V['scala']['facts'] = [fact(f2['point'], 'The charterhouse at the foot of the Montsant put seven villages under the Prior.', f2['cite'], 'Scala Dei')]
    S.append(('montsant', 1, chapter_head('priorat', c, 1) + cite_html(c['cite']) + stop_html(f0, pic='catalunya-2', meas=measure('priorat', 'top'))))
    S.append(('siurana', 1, stop_html(f1, True, pic='siurana', meas=measure('priorat', 'low'))))
    S.append(('scala', 1, stop_html(f2, True, pic='scala')))
    # 2 Air: no map stop in the guide; an overview looking north (Montsant behind) is added as in Rioja's chapter 2 and 4 overviews.
    c = ch['air']
    V['air'] = {'bounds': BOUNDS['priorat'], 'focus': 'priorat', 'pitch': 50, 'bearing': 0, 'zadj': -0.3, 'chip': 'Priorat, looking north to the Montsant'}
    S.append(('air', 2, chapter_head('priorat', c, 2) + cite_html(c['cite'])))
    # 3 Licorella: slate slopes seen low and from the valley, looking up.
    c = ch['licorella']; fl = c['fly'][0]
    V['licorella'] = fly_view(fl, 'priorat', pitch=72, bearing=330, zadj=0.5, geo=True)
    V['licorella']['facts'] = [
        fact(town('priorat', 'Porrera'), 'The hills are made of ancient slate, formed between 416 and 318 million years ago.', c['cite'], 'Porrera'),
        fact(town('priorat', 'Gratallops'), 'Licorella: flaky, brittle stones the colour of darkened copper.', c['cite'], 'Gratallops')]
    S.append(('licorella', 3, chapter_head('priorat', c, 3) + cite_html(c['cite']) + stop_html(fl, pic='porrera', meas=measure('priorat', 'steep'))))
    # 4 Wines
    c = ch['wines']
    V['wines'] = {'bounds': BOUNDS['priorat'], 'focus': 'priorat', 'pitch': 0, 'bearing': 0, 'chip': 'Priorat'}
    terms = ''.join(f'<dt>{esc(t["term"])}</dt><dd>{esc(t["text"])}</dd>' for t in c.get('terms', []))
    S.append(('wines', 4, chapter_head('priorat', c, 4) + (f'<dl class="terms">{terms}</dl>' if terms else '') + cite_html(c['cite'])))
    S.append(('wines', 0, '<div class="end"><p class="kicker">You reached the end</p><p class="endq">That is Priorat.</p></div>'))
    return V, S, ['priorat-1', 'catalunya-2', 'siurana', 'scala', 'porrera']


BUILT = {'rioja': build_rioja()}  # Priorat is not on this page (its code above stays unused, as in v4)
VIEWS = {k: v[0] for k, v in BUILT.items()}
CHAPTERS = {k: [c['title'] for c in GUIDES[k]['chapters']] + (['How it tastes', 'In short', 'Producers'] if k == 'rioja' else []) for k in GUIDES}


def steps_html(gid):
    out = []
    for vid, n, h in BUILT[gid][1]:
        cls = ' step-intro' if vid == 'intro' else ' step-end' if 'class="end"' in h else ''
        # main = running text, aside = the stop card and the fact blocks (two columns when the map is closed)
        cut = min([i for i in (h.find('<div class="stop'), h.find('<div class="facts-b')) if i >= 0], default=len(h))
        out.append(f'<section class="step{cls}" data-view="{vid}" data-ch="{n}"><div class="step-in"><div class="main">{h[:cut]}</div><div class="aside">{h[cut:]}</div></div></section>')
    return '\n'.join(out)


STOPS = {k: len({s[0] for s in BUILT[k][1] if s[0] != 'intro'}) for k in BUILT}


# =====================================================================================================
# Round 1 tail: the four options. Content comes from the captured live page (CAP), the guide JSON and the app's own fact blocks (REST).
# =====================================================================================================
CAP = (HERE / 'guide-page-rioja.html').read_text()
G = GUIDES['rioja']
CH = {c['id']: c for c in G['chapters']}
FOCUS_OBJ = {'rioja-2': '28% 55%', 'rioja-sierra-1': '50% 40%', 'rioja-haro-1': '50% 45%', 'rioja-alta-1': '50% 45%', 'rioja-alavesa-2': '50% 45%',
             'rioja-alavesa-1': '50% 50%', 'rioja-oriental-1': '50% 55%', 'rioja-oriental-2': '50% 50%', 'rioja-3': '50% 55%', 'rioja-1': '50% 60%'}
USED = []


def div_at(html, start):
    """The balanced <div>...</div> that starts at index start."""
    depth = 0
    for m in re.finditer(r'<div\b|</div>', html[start:]):
        depth += 1 if m.group(0) == '<div' else -1
        if depth == 0:
            return html[start:start + m.end()]
    raise ValueError


def ph(pid, cls='', alt=None):
    if pid not in USED: USED.append(pid)
    a = esc(alt if alt is not None else PH(pid)['alt'])
    return f'<img class="{cls}" data-p="{pid}" alt="{a}" style="object-position:{FOCUS_OBJ.get(pid, "50% 50%")}" decoding="async">'


SRC_SPAN = re.compile(r'<span class="src short">.*?</span></span>', re.S)

# ---- beats ----
BEATS = []
STOP = {}
for i, (key, cid, kick) in enumerate((('place', 'valley', 'The place'), ('weather', 'climate', 'The weather'), ('ground', 'soils', 'The ground'), ('rules', 'barrel', 'What the rules make'))):
    inner = div_at(CAP, CAP.index(f'<div class="pg-ch" id="terroir-{cid}">'))
    head = inner.split('<span class="src short">')[0]
    ps = re.findall(r'<p>.*?</p>', head, re.S)
    assert len(ps) == len(CH[cid]['paras']), cid
    BEATS.append({'key': key, 'id': 'c-' + key, 'n': i + 1, 'kick': kick, 'title': CH[cid]['title'], 'paras': ps, 'cite': SRC_SPAN.search(inner).group(0), 'cid': cid, 'stops': [], 'flies': []})
BEAT = {b['key']: b for b in BEATS}
v0, v1 = CH['valley']['fly']; s0 = CH['soils']['fly'][0]; b0 = CH['barrel']['fly'][0]
for vid, fly, pic, meas, href in (('valley', v0, 'rioja-3', measure('rioja', 'top'), 'valley.0'), ('sierra', v1, 'rioja-sierra-1', '', 'valley.1'),
                                  ('soils', s0, 'rioja-alavesa-2', measure('rioja-alavesa', 'steep'), 'soils.0'), ('haro', b0, 'rioja-haro-1', measure('rioja-alta', 'median'), 'barrel.0')):
    STOP[vid] = {'vid': vid, 'label': fly['label'], 'caption': fly['caption'], 'cite': src_inner(fly['cite']), 'meas': meas.replace('class="measure"', 'class="cap-m"'), 'pic': pic, 'href': FLYHREF + href}
BEAT['place']['stops'] = [STOP['sierra'], STOP['valley']]
BEAT['ground']['stops'] = [STOP['soils']]
BEAT['rules']['stops'] = [STOP['haro']]
BEAT['place']['flies'] = [STOP['valley'], STOP['sierra']]
BEAT['ground']['flies'] = [STOP['soils']]
BEAT['rules']['flies'] = [STOP['haro']]
ZID_ = ['rioja-alta', 'rioja-alavesa', 'rioja-oriental']
ZONES = [{'name': c['title'], 'climate': c['climate'], 'wine': c['wine'], 'pic': p, 'caption': c['fly']['caption'], 'cite': src_inner(c['fly']['cite']), 'href': '#place=%s&page' % c['fly']['place'], 'zid': 'z-' + c['fly']['place']}
         for c, p in zip(CH['climate']['cards'], ('rioja-alta-1', 'rioja-alavesa-1', 'rioja-oriental-1'))]


# ---- the app's fact blocks, split ----
def fact_blocks(html):
    out, i = [], 0
    while True:
        j = html.find('<div class="pg-fact">', i)
        if j < 0: return out
        d = div_at(html, j); out.append(d); i = j + len(d)


RULES_HTML = MORE_BTN.sub('', REST['facts']['rules'])
FX = {}
FX['level'] = re.search(r'<dl class="pg-rows">.*?</dl>', REST['facts']['place'], re.S).group(0)
FX['climate'] = fact_blocks(REST['facts']['weather'])[0]
FX['altitude'] = fact_blocks(REST['facts']['ground'])[0]
_rb = fact_blocks(RULES_HTML)
FX['styles'], FX['grapes'] = _rb[0], _rb[1]
FX['rows'] = re.search(r'<dl class="pg-rows">.*?</dl>', RULES_HTML, re.S).group(0)
for k in ('climate', 'altitude'): FX[k] = FX[k].replace('class="pg-chart', 'data-seen="" class="pg-chart')

TASTE = re.findall(r'<div class="(red|white|rose)"><b><i class="pg-sw \w+" aria-hidden="true"></i>(\w+)</b><p>(.*?)</p></div>', REST['taste'])
TASTE_CITE = SRC_SPAN.search(REST['taste']).group(0)
assert len(TASTE) == 3
SHORT = re.findall(r'<li><span class="k">(.*?)</span><span class="f"><a href="[^"]*">(.*?)</a>(<span class="src short">.*?</span></span>)?</span></li>', REST['short'], re.S)
assert len(SHORT) == 5, len(SHORT)
SHORT_LINK = ['c-rules', 'c-weather', 'c-ground', 'c-weather', 'c-rules']  # as in v4: each line links to the beat that tells it in full
PRODUCERS = re.findall(r'<li>(.*?)</li>', re.search(r'<ul class="pg-names">.*?</ul>', REST['producers'], re.S).group(0))
PROD_CITE = SRC_SPAN.search(REST['producers']).group(0)
ALIKE = re.findall(r'<a class="zlink" href="(#place=[\w-]+&amp;page)">.*?<b>(.*?)</b></a><p>(.*?)</p>', CAP, re.S)
assert len(ALIKE) == 3
ALIKE_PIC = {'Valtiendas': 'valtiendas-1', 'Navarra': 'navarra-1', 'La Mancha': 'la-mancha-1'}
SOURCES = re.search(r'<ol class="pg-sources">.*?</ol>', CAP, re.S).group(0)
BADGES = [re.sub(r'\s+', ' ', b) for b in re.findall(r'<li[^>]*>(.*?)</li>', re.search(r'<ul class="pg-badges".*?</ul>', CAP, re.S).group(0), re.S)]
JUMP_LABELS = [('c-place', 'The place'), ('c-weather', 'The weather'), ('c-ground', 'The ground'), ('c-rules', 'The rules'), ('c-taste', 'How it tastes'),
               ('c-short', 'In short'), ('c-producers', 'Producers'), ('c-alike', 'If you like this, try'), ('c-sources', 'Sources')]
LEDE = f'<p class="lede">{esc(G["lede"]["text"])}</p>'
LEDE_CITE = re.search(r'<header class="pg-spine">.*?(<span class="src short">.*?</span></span>)</header>', CAP, re.S).group(1)
GLYPH = ('<svg class="glyph" width="26" height="26" viewBox="0 0 18 18" fill="none" stroke="#E9D8B4" stroke-width="1.3" stroke-linejoin="round" aria-hidden="true">'
         '<path d="M1.5 3.5 6.5 2v12.5l-5 1.5zM6.5 2l5 1.5v12.5l-5-1.5zM11.5 3.5 16.5 2v12.5l-5 1.5z"/></svg>')
NPLACES = 9  # "9 places to fly to", as in the live page's map card and the v3 button


def bigbtn(variant, rec=False):
    """The big photo button: the Rioja valley photo and the black label part with the folded-map glyph (v3 part B, option C style)."""
    cls = 'c-bigbtn' if rec else 'g-bigbtn'
    return (f'<button type="button" class="{cls} bb bb-{variant}"><span class="bb-ph">{ph("rioja-sierra-1", "bb-img", "The Sierra de Cantabria above the Rioja vineyards")}</span>'
            f'<span class="bb-lab"><span class="bb-txt"><span class="bb-t">Read with the map</span><span class="bb-s">{G["minutes"]} minutes · {NPLACES} places to fly to</span></span>{GLYPH}</span></button>')


def badges(cls):
    return f'<ul class="{cls}">' + ''.join(f'<li>{b}</li>' for b in BADGES) + '</ul>'


def jump(cls='g-jump pg-jump'):
    return f'<nav class="{cls}" aria-label="In this guide">' + ''.join(f'<a href="#{i}">{t}</a>' for i, t in JUMP_LABELS) + '</nav>'


def fx(*keys, cls=''):
    return f'<div class="g-fx {cls}">' + ''.join(FX[k] for k in keys) + '</div>'


def flies(b, cls='g-flies'):
    if not b['flies']: return ''
    return f'<p class="{cls}">' + ''.join(f'<a class="fly-link" href="{s["href"]}" data-fly="{s["vid"]}"><small>On the map</small>{esc(s["label"])}</a>' for s in b['flies']) + '</p>'


def paras(b): return ''.join(b['paras'])


def stopcap(s, cls='g-cap'):
    """Photo caption block of a stop (kept from the guide: label, caption, measured line, source)."""
    return (f'<figcaption class="{cls}"><span class="cap-t">{esc(s["label"])}</span><span class="cap-p">{esc(s["caption"])}</span>'
            f'{s["meas"]}<span class="src">Source: {s["cite"][8:]}</span></figcaption>')


def stopfig(s, cls='g-fig', pcls='g-ph'):
    return f'<figure class="{cls}" data-view="{s["vid"]}">{ph(s["pic"], pcls)}{stopcap(s)}</figure>'


def zone_items(cls, pcls):
    return ''.join(f'<article class="{cls}" data-view="{z["zid"]}">{ph(z["pic"], pcls)}'
                   f'<h4><a href="{z["href"]}">{esc(z["name"])}</a></h4><p class="z-k">The weather</p><p>{esc(z["climate"])}</p><p class="z-k">Wine</p><p>{esc(z["wine"])}</p>'
                   f'<p class="src">Source: {z["cite"][8:]}</p></article>' for z in ZONES)


def taste_items(cls):
    return ''.join(f'<div class="{cls} {c}"><b><i class="sw {c}" aria-hidden="true"></i>{n}</b><p>{t}</p></div>' for c, n, t in TASTE)


def short_items():
    return ''.join(f'<li><span class="k">{k}</span><span class="f"><a href="#{SHORT_LINK[i]}">{t}</a>{c or ""}</span></li>' for i, (k, t, c) in enumerate(SHORT))


def alike_items(cls, pcls):
    return ''.join(f'<li class="{cls}"><a href="{h}">{ph(ALIKE_PIC[n], pcls, "")}<b>{n}</b></a><p>{t}</p></li>' for h, n, t in ALIKE)


def testme(cls='g-test'):
    return (f'<p class="{cls}"><a href="#study=test&amp;set=rioja,rioja-alta,rioja-alavesa,rioja-oriental">Test me on Rioja</a>'
            f'<span>A short round in Study on Rioja and its zones.</span></p>')


NEXT = '<a class="g-next" href="#region=ebro&amp;page"><small>Next in the course</small><b>Navarra and Aragón →</b></a>'


def sources(cls='g-sources'):
    return f'<section id="c-sources" class="{cls}"><h2>Sources</h2>{SOURCES}</section>'


def credits_all():
    return credits_line(USED).replace('class="photocredit"', 'class="g-credit"')


def band():
    return ('<header class="top g-band"><p class="brand">AtlaSlope</p><p class="where-r off-map">Rioja</p><nav class="topnav off-map" aria-label="Site">'
            '<a href="#atlas">Atlas</a><a href="#study">Study</a><a href="#guides" aria-current="page">Guides</a><a href="#about">About</a></nav>'
            '<p class="where on-map"><span class="where-n"></span></p><button type="button" class="mapbtn on-map" aria-controls="map story-text">Close the map</button>'
            '<a class="back on-map" href="#place=rioja&amp;page=1">Back to Rioja</a><div class="progress" aria-hidden="true"><i></i></div></header>')


def why(cls='g-why'):
    return f'<header class="{cls}"><h2>{esc(G["title"])}</h2>{LEDE}{LEDE_CITE}</header>'


def sec_head(b, cls='g-bh'):
    return f'<div class="{cls}"><span class="n" aria-hidden="true">{b["n"]}</span><span class="k">{b["kick"]}</span><h3 id="h-{b["key"]}"><span class="sr-only">{b["kick"]}: </span>{esc(b["title"])}</h3></div>'


# =====================================================================================================
# The four options. Each returns the body of the guide page (map closed). Classes: a-, b-, c-, d- per option; g- and the app's pg- chart classes are shared.
# =====================================================================================================
def end_blocks(cls_prod='g-prod'):
    prods = ''.join(f'<li>{p}</li>' for p in PRODUCERS)
    return prods


def opt_a():
    b = BEAT
    def beat(k, side, below='', prose_extra=''):
        x = b[k]
        return (f'<section id="{x["id"]}" class="a-beat" aria-labelledby="h-{k}"><div class="a-main">{sec_head(x, "a-bh")}<div class="a-prose">{paras(x)}{flies(x)}<p class="src-line">{x["cite"]}</p></div></div>'
                f'<aside class="a-side">{side}</aside>{below}</section>')
    p_side = f'<div class="a-figs2">{stopfig(STOP["sierra"])}{stopfig(STOP["valley"])}</div>' + fx('level', cls='a-level')
    w_side = fx('climate')
    w_below = f'<div class="a-zones">{zone_items("a-zone", "g-ph")}</div>'
    g_side = stopfig(STOP['soils']) + fx('altitude')
    r_side = stopfig(STOP['haro'])
    r_below = f'<div class="a-rulefacts">{fx("styles")}<div>{fx("grapes", "rows")}</div></div>'
    return (
        f'<div class="a-wrap"><header class="a-head"><p class="a-kick">Terroir · {G["minutes"]}-minute read</p><h1>Rioja</h1>{badges("a-badges")}</header>'
        f'{bigbtn("a")}'
        f'<div class="a-mosaic">{ph("rioja-2", "m1")}{ph("rioja-1", "m2")}{ph("rioja-oriental-2", "m3")}</div>'
        f'{jump()}{why("a-why")}'
        f'{beat("place", p_side)}{beat("weather", w_side, w_below)}{beat("ground", g_side)}{beat("rules", r_side, r_below)}'
        f'<section id="c-taste" class="a-taste" aria-labelledby="taste-h"><h2 id="taste-h">How it tastes</h2><div class="a-cards">{taste_items("a-card")}</div><p class="src-line">{TASTE_CITE}</p></section>'
        f'<section id="c-short" class="a-short" aria-labelledby="short-h"><h2 id="short-h">In short</h2><ol class="pg-short">{short_items()}</ol></section>'
        f'<div class="a-two"><section id="c-producers" aria-labelledby="prod-h"><h2 id="prod-h">Producers</h2><ul class="a-names">{end_blocks()}</ul><p class="src-line">{PROD_CITE}</p></section>'
        f'<section id="c-alike" aria-labelledby="alike-h"><h2 id="alike-h">If you like this, try</h2><ul class="a-alike">{alike_items("a-al", "g-ph")}</ul></section></div>'
        f'<div class="a-end">{testme()}{NEXT}</div>'
        f'{sources("a-sources")}'
        f'@@CREDITS@@</div>')


def opt_b():
    b = BEAT
    def beat(k, photo, rail, after=''):
        x = b[k]
        return (f'<section id="{x["id"]}" class="b-beat" aria-labelledby="h-{k}">{photo}'
                f'<div class="b-grid"><div class="b-bh"><span class="n" aria-hidden="true">{x["n"]}</span><span class="k">{x["kick"]}</span><h3 id="h-{k}"><span class="sr-only">{x["kick"]}: </span>{esc(x["title"])}</h3></div>'
                f'<div class="b-prose">{paras(x)}{flies(x)}<p class="src-line">{x["cite"]}</p></div><aside class="b-rail">{rail}</aside></div>{after}</section>')
    def bleed(*figs):
        return f'<div class="b-bleed n{len(figs)}">{"".join(figs)}</div>'
    def capline(s):  # caption in the calm column under the photo
        return f'<div class="b-grid b-capline">{stopcap(s, "b-cap")}</div>'
    p_photo = bleed(f'<figure data-view="valley">{ph("rioja-3", "g-ph")}</figure>', f'<figure data-view="sierra">{ph("rioja-sierra-1", "g-ph")}</figure>') + \
        f'<div class="b-grid b-capline b-two">{stopcap(STOP["valley"], "b-cap")}{stopcap(STOP["sierra"], "b-cap")}</div>'
    w_photo = bleed(*[f'<figure data-view="{z["zid"]}">{ph(z["pic"], "g-ph")}</figure>' for z in ZONES])
    w_after = ('<div class="b-grid b-zones">' + ''.join(f'<article data-view="{z["zid"]}"><h4><a href="{z["href"]}">{esc(z["name"])}</a></h4><p class="z-k">The weather</p><p>{esc(z["climate"])}</p>'
                                                       f'<p class="z-k">Wine</p><p>{esc(z["wine"])}</p><p class="src">Source: {z["cite"][8:]}</p></article>' for z in ZONES) + '</div>')
    g_photo = bleed(f'<figure data-view="soils">{ph("rioja-alavesa-2", "g-ph")}</figure>') + capline(STOP['soils'])
    r_photo = bleed(f'<figure data-view="haro">{ph("rioja-haro-1", "g-ph")}</figure>') + capline(STOP['haro'])
    return (
        f'<header class="b-open">{bigbtn("b")}<div class="b-title"><p class="b-kick">Terroir · {G["minutes"]}-minute read</p><h1>Rioja</h1>{badges("b-badges")}{why("b-why")}</div></header>'
        f'{jump()}'
        f'{beat("place", p_photo, fx("level"))}{beat("weather", w_photo, fx("climate"), w_after)}{beat("ground", g_photo, fx("altitude"))}'
        f'{beat("rules", r_photo, fx("styles", "grapes"), f"<div class=\"b-grid b-more\">{fx("rows")}</div>")}'
        f'<section id="c-taste" class="b-taste" aria-labelledby="taste-h"><div class="b-tasteph">{ph("rioja-2", "g-ph")}</div><div class="b-tastetx"><h2 id="taste-h">How it tastes</h2>{taste_items("b-t")}<p class="src-line">{TASTE_CITE}</p></div></section>'
        f'<section id="c-short" class="b-short" aria-labelledby="short-h"><div class="b-grid"><h2 id="short-h">In short</h2><ol class="pg-short">{short_items()}</ol></div></section>'
        f'<section id="c-producers" class="b-prod" aria-labelledby="prod-h"><div class="b-grid"><h2 id="prod-h">Producers</h2><ul class="b-names">{end_blocks()}</ul><p class="src-line">{PROD_CITE}</p></div></section>'
        f'<section id="c-alike" class="b-alike" aria-labelledby="alike-h"><h2 id="alike-h">If you like this, try</h2><ul>{alike_items("b-al", "g-ph")}</ul></section>'
        f'<div class="b-grid b-end">{testme()}{NEXT}</div>{sources("b-sources")}@@CREDITS@@')


def opt_c():
    b = BEAT
    def beat(k, open_html, strip, after_prose=''):
        x = b[k]
        return (f'<section id="{x["id"]}" class="c-beat" aria-labelledby="h-{k}">{open_html}'
                f'<div class="c-bh"><span class="n" aria-hidden="true">{x["n"]}</span><div><span class="k">{x["kick"]}</span><h3 id="h-{k}"><span class="sr-only">{x["kick"]}: </span>{esc(x["title"])}</h3></div></div>'
                f'<div class="c-prose">{paras(x)}</div><div class="c-meta">{flies(x)}<p class="src-line">{x["cite"]}</p></div>{after_prose}<div class="c-strip">{strip}</div></section>')
    def photos(*stops):
        return f'<div class="c-photos n{len(stops)}">{"".join(stopfig(s, "c-fig", "g-ph") for s in stops)}</div>'
    z_open = '<div class="c-zph">' + ''.join(f'<div data-view="{z["zid"]}">{ph(z["pic"], "g-ph")}</div>' for z in ZONES) + '</div>'
    z_tx = '<div class="c-ztx">' + ''.join(f'<article><h4><a href="{z["href"]}">{esc(z["name"])}</a></h4><p class="z-k">The weather</p><p>{esc(z["climate"])}</p>'
                                              f'<p class="z-k">Wine</p><p>{esc(z["wine"])}</p><p class="src">Source: {z["cite"][8:]}</p></article>' for z in ZONES) + '</div>'
    r_strip = f'<div class="c-cell">{FX["styles"]}</div><div class="c-cell">{FX["grapes"]}{FX["rows"]}</div>'
    return (
        f'<section class="c-hero">{bigbtn("c", True)}<div class="c-title"><div><p class="c-kick">Terroir · {G["minutes"]}-minute read</p><h1>Rioja</h1>{badges("c-badges")}</div>{why("c-why")}</div></section>'
        f'{jump()}'
        f'{beat("place", photos(STOP["sierra"], STOP["valley"]), f"<div class=\"c-cell\">{fx("level")}</div>")}'
        f'{beat("weather", z_open, f"<div class=\"c-cell wide\">{FX["climate"]}</div>", z_tx)}'
        f'{beat("ground", photos(STOP["soils"]), f"<div class=\"c-cell wide\">{FX["altitude"]}</div>")}'
        f'{beat("rules", photos(STOP["haro"]), r_strip)}'
        f'<section id="c-taste" class="c-taste" aria-labelledby="taste-h"><div class="c-in"><h2 id="taste-h">How it tastes</h2><div class="c-tcols">{taste_items("c-t")}</div><p class="src-line">{TASTE_CITE}</p></div></section>'
        f'<div class="c-in"><section id="c-short" class="c-short" aria-labelledby="short-h"><h2 id="short-h">In short</h2><ol class="pg-short">{short_items()}</ol></section>'
        f'<div class="c-two"><section id="c-producers" aria-labelledby="prod-h"><h2 id="prod-h">Producers</h2><ul class="c-names">{end_blocks()}</ul><p class="src-line">{PROD_CITE}</p></section>'
        f'<section id="c-alike" aria-labelledby="alike-h"><h2 id="alike-h">If you like this, try</h2><ul class="c-alike">{alike_items("c-al", "g-ph")}</ul></section></div>'
        f'<div class="c-end">{testme()}{NEXT}</div>{sources("c-sources")}@@CREDITS@@</div>')


def opt_d():
    b = BEAT
    def nums(items):
        return '<div class="d-nums">' + ''.join(f'<div><b>{n}</b><span>{t}</span></div>' for n, t in items) + '</div>'
    def beat(k, tone, photo, numbers, extra='', facts=''):
        x = b[k]
        return (f'<section id="{x["id"]}" class="d-beat d-{tone}" aria-labelledby="h-{k}"><div class="d-in"><div class="d-bh"><span class="n" aria-hidden="true">{x["n"]}</span><span class="k">{x["kick"]}</span>'
                f'<h3 id="h-{k}"><span class="sr-only">{x["kick"]}: </span>{esc(x["title"])}</h3></div></div>{photo}'
                f'<div class="d-in"><div class="d-prose">{paras(x)}</div>{flies(x)}<p class="src-line">{x["cite"]}</p>{numbers}{extra}{facts}</div></section>')
    def bleed(*figs):
        return f'<div class="d-bleed n{len(figs)}">{"".join(figs)}</div>'
    def caps(*stops):
        return '<div class="d-in d-caps">' + ''.join(stopcap(s, 'd-cap') for s in stops) + '</div>'
    pair = bleed(f'<figure data-view="valley">{ph("rioja-3", "g-ph")}</figure>', f'<figure data-view="sierra">{ph("rioja-sierra-1", "g-ph")}</figure>') + caps(STOP['valley'], STOP['sierra'])
    trio = bleed(*[f'<figure data-view="{z["zid"]}">{ph(z["pic"], "g-ph")}</figure>' for z in ZONES])
    z_tx = '<div class="d-ztx">' + ''.join(f'<article><h4><a href="{z["href"]}">{esc(z["name"])}</a></h4><p class="z-k">The weather</p><p>{esc(z["climate"])}</p>'
                                              f'<p class="z-k">Wine</p><p>{esc(z["wine"])}</p><p class="src">Source: {z["cite"][8:]}</p></article>' for z in ZONES) + '</div>'
    return (
        f'<section class="d-hero"><div class="d-in"><p class="d-kick">Terroir · {G["minutes"]}-minute read</p><h1>Rioja</h1>{badges("d-badges")}</div>{bigbtn("d")}</section>'
        f'<section class="d-lede"><div class="d-in">{why("d-why")}</div></section>{jump("g-jump pg-jump d-jump")}'
        + beat('place', 'white', pair, nums([('100 km', 'along the Ebro, from Haro to Alfaro'), ('40 km', 'across, at the widest'), ('700 m', 'where the terraces end'), ('63,593 ha', 'in La Rioja, Álava and Navarra')]), '', fx('level'))
        + beat('weather', 'champ', trio, nums([('400 mm', 'of rain in a year'), ('3', 'zones, Atlantic in the west, Mediterranean in the east')]), z_tx, fx('climate'))
        + beat('ground', 'white', bleed(f'<figure data-view="soils">{ph("rioja-alavesa-2", "g-ph")}</figure>') + caps(STOP['soils']),
               nums([('¼', 'clay-limestone, the main source of wines for ageing'), ('¼', 'ferrous clay'), ('½', 'alluvial soil near the rivers')]), '', fx('altitude'))
        + beat('rules', 'black', bleed(f'<figure data-view="haro">{ph("rioja-haro-1", "g-ph")}</figure>') + caps(STOP['haro']),
               nums([('1857', 'Champagne-method wines shown in Madrid'), ('1890', 'a champagne maker from Reims hired in Haro'), ('60 months', 'for Gran Reserva, 24 of them in barrel'), ('2017', 'the rules cover traditional-method sparkling')]), '',
               f'<div class="d-rules">{fx("styles")}<div>{fx("grapes", "rows")}</div></div>')
        + f'<section id="c-taste" class="d-taste d-champ" aria-labelledby="taste-h"><div class="d-in d-split"><div class="d-tph">{ph("rioja-2", "g-ph")}</div><div><h2 id="taste-h">How it tastes</h2>{taste_items("d-t")}<p class="src-line">{TASTE_CITE}</p></div></div></section>'
        f'<section id="c-short" class="d-short d-white" aria-labelledby="short-h"><div class="d-in"><h2 id="short-h">In short</h2><ol class="pg-short">{short_items()}</ol></div></section>'
        f'<section id="c-producers" class="d-prod d-black" aria-labelledby="prod-h"><div class="d-in"><h2 id="prod-h">Producers</h2><ul class="d-names">{end_blocks()}</ul><p class="src-line">{PROD_CITE}</p></div></section>'
        f'<section id="c-alike" class="d-alike d-white" aria-labelledby="alike-h"><div class="d-in"><h2 id="alike-h">If you like this, try</h2><ul>{alike_items("d-al", "g-ph")}</ul>'
        f'<div class="d-end">{testme()}{NEXT}</div></div></section>'
        f'<div class="d-champl">{sources("d-sources")}</div><div class="d-in">@@CREDITS@@</div>')


OPTS = {}
USED_BY = {}
for k, fn in (('a', opt_a), ('b', opt_b), ('c', opt_c), ('d', opt_d)):
    USED.clear()
    h = fn()
    USED_BY[k] = list(USED)
    OPTS[k] = h.replace('@@CREDITS@@', credits_line(USED).replace('class="photocredit"', 'class="g-credit"'))
    print('option', k, len(h), 'chars', len(USED), 'photos')


# =====================================================================================================
# Documents: options A, B, D are plain pages; option C is the v4 map document with the redesigned page as its closed view.
# =====================================================================================================
fonts = ROOT / 'public/fonts'
FONT_CSS = f'''
@font-face{{font-family:"Newsreader";font-style:normal;font-weight:200 800;font-display:swap;src:url({b64(fonts/'newsreader-latin-opsz-normal.woff2','font/woff2')}) format("woff2")}}
@font-face{{font-family:"IBM Plex Sans";font-weight:400;font-display:swap;src:url({b64(fonts/'ibm-plex-sans-latin-400-normal.woff2','font/woff2')}) format("woff2")}}
@font-face{{font-family:"IBM Plex Sans";font-weight:500;font-display:swap;src:url({b64(fonts/'ibm-plex-sans-latin-500-normal.woff2','font/woff2')}) format("woff2")}}
@font-face{{font-family:"IBM Plex Sans";font-weight:600;font-display:swap;src:url({b64(fonts/'ibm-plex-sans-latin-600-normal.woff2','font/woff2')}) format("woff2")}}
'''
ML_JS = (NM / 'maplibre-gl/dist/maplibre-gl.js').read_text()
ML_CSS = (NM / 'maplibre-gl/dist/maplibre-gl.css').read_text()
CHARTS_CSS = (HERE / 'charts.css').read_text()
BASE_CSS = (HERE / 'base.css').read_text() + CHARTS_CSS
NR_JS = (HERE / 'nr.js').read_text()
CEXTRA_CSS = (HERE / 'c-extra.css').read_text()
TITLES = {'a': 'A · Subtle', 'b': 'B · Magazine', 'c': 'C · Photo-led', 'd': 'D · Bold'}
HEAD = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<title>Rioja guide, option {t} · AtlaSlope</title><style>/*FONTS*/</style>{css}</head>')


def simple_doc(k):
    css = f'<style>{BASE_CSS}{(HERE / f"opt-{k}.css").read_text()}</style>'
    top = ('<header class="top g-band"><p class="brand">AtlaSlope</p><p class="where-r">Rioja</p><nav class="topnav" aria-label="Site"><a href="#atlas">Atlas</a><a href="#study">Study</a>'
           '<a href="#guides" aria-current="page">Guides</a><a href="#about">About</a></nav></header>')
    return HEAD.format(t=TITLES[k], css=css) + f'<body class="o-{k} nr">{top}<main>{OPTS[k]}</main><script>{NR_JS}</script></body></html>'


story_used = sorted(set(BUILT['rioja'][2]))
texts = f'<div class="text" id="story-text" data-guide="rioja">\n{steps_html("rioja")}\n{credits_line(BUILT["rioja"][2])}\n</div>'
C_CSS = ''.join((HERE / f).read_text() for f in ('story.css', 'story-b.css', 'story-v4.css')) + BASE_CSS + (HERE / 'opt-c.css').read_text() + CEXTRA_CSS
DATA = json.dumps({'views': VIEWS, 'focus': FOCUS, 'labels': LABELS, 'chapters': CHAPTERS, 'nch': len(GUIDES['rioja']['chapters']), 'tints': TINTS, 'rivers': RIVERS, 'names': NAMES, 'koppen': KOPPEN,
                   'koppenLegend': KOP_LEGEND, 'inverse': INVERSE, 'loc': LOC, 'back': {k: f'#place={k}&page=1' for k in GUIDES}}, ensure_ascii=False, separators=(',', ':'))
C_JS = (HERE / 'story.js').read_text()
MAPBLOCK = f'''<main id="story" class="sg">
  <div class="mapwrap" aria-label="Map that follows the text" role="region">
    <div id="map"></div>
    <p class="chip"></p>
    <div class="exag" role="group" aria-label="Terrain height"><span>Terrain height</span><button type="button" data-k="1.5" aria-pressed="true">×1.5</button><button type="button" data-k="1.3" aria-pressed="false">×1.3</button></div>
    <button class="recentre" type="button" hidden>Back to the story view</button>
    <p class="legend" hidden aria-label="Climate classes"></p>
    <svg class="loc" viewBox="-3 -3 {LOC["w"] + 6:.0f} {LOC["h"] + 6:.1f}" role="img" aria-label="Where the map is in Spain"><path d="{LOC_PATH}"/><rect class="lbox" x="0" y="0" width="4" height="4"/><circle class="ldot" r="3" cx="0" cy="0"/></svg>
    <p class="mapcredit"><i class="sw" aria-hidden="true"></i>Slopes &gt;30% · height ×<span class="kx">1.5</span><span class="more"> · Imagery PNOA © IGN, Esri · Terrain Mapzen</span><span class="short"> · PNOA © IGN, Esri, Mapzen</span><span class="more"> · Rivers, names: IGN/SCNE CC BY 4.0</span><span class="short"> · Rivers, names IGN</span><span class="gcr"><span class="more"> · Geology: IGME MAGNA 50</span><span class="short"> · IGME MAGNA 50</span></span><span class="kcr"><span class="more"> · Climate: Beck et al. 2023 CC BY</span><span class="short"> · Beck 2023</span></span></p>
  </div>
{texts}
</main>'''
FOOT = (f'<p class="foot">Photos in this page: {len(story_used)}, each with its credit line. Rivers and names: IGN (Hidrografía INSPIRE WFS, Nomenclátor Geográfico Básico), CC BY 4.0 scne.es. Geology: IGME, Mapa Geológico de España 1:50.000 (MAGNA), WMS. '
        'Climate: Köppen-Geiger 1991-2020, Beck et al. 2023, CC BY 4.0. Outlines: DOCa Rioja © MAPA; Rioja zones CC-BY 4.0 ign.es.</p>')
DOC_C = (HEAD.format(t=TITLES['c'], css=f'<style>{ML_CSS}</style><style>{C_CSS}</style>') +
         f'<body class="map-off o-c-doc"><a class="skip" href="#closed">Skip to the guide</a>{band()}{MAPBLOCK}'
         f'<div id="closed" class="o-c" aria-label="The guide page">{OPTS["c"]}</div>{FOOT}<script>{ML_JS}</script><script>window.SG={DATA};</script><script>{C_JS}</script></body></html>')
DOCS = {'a': simple_doc('a'), 'b': simple_doc('b'), 'c': DOC_C, 'd': simple_doc('d')}

# ---------- the hub page ----------
IMG = {}
for k in USED_BY:
    for pid in USED_BY[k]:
        if pid not in IMG: IMG[pid] = b64(ROOT / f'public/photos/800/{pid}.webp', 'image/webp')


def js_str(s):
    return json.dumps(s).replace('</', '<\\/').replace('<!--', '<\\!--')


HUB_DESC = {
    'a': ('Subtle', 'Today’s page and order, filled in.', 'The facts and the photos move into a second column beside each beat. The boxes are gone. Type and photos are larger.'),
    'b': ('Magazine', 'A full-width photo opens every beat.', 'The text sits in one calm column. The facts are a quiet rail at its side. No boxes at all.'),
    'c': ('Photo-led', 'A big photo hero. Every beat opens with its photo.', 'The facts are one strip under each beat. How it tastes is a toned band. This is the one that unfolds into the map.'),
    'd': ('Bold', 'Black, champagne and white bands.', 'Very large photos and type. The facts are a few big numbers. The most dramatic, and the longest page.'),
}
opts_html = ''
for k in 'abcd':
    name, line, more = HUB_DESC[k]
    rec = k == 'c'
    opts_html += (f'<section class="opt{" rec" if rec else ""}" id="opt-{k}" data-k="{k}"><div class="oh"><span class="ol">{k.upper()}</span><div class="ot"><h2>{name}{" <em>Recommended</em>" if rec else ""}</h2>'
                  f'<p class="od">{line} {more}</p></div><div class="octl"><div class="seg" role="group" aria-label="Screen size for option {k.upper()}"><button type="button" data-m="desktop" aria-pressed="true">Desktop</button>'
                  f'<button type="button" data-m="phone" aria-pressed="false">Phone</button></div><a class="full" href="#solo={k}" target="_blank" rel="noopener">Open full screen</a></div></div>'
                  f'<div class="stage"><div class="frame desktop"><iframe title="Option {k.upper()}" loading="lazy"></iframe><p class="wait">Loading…</p></div></div></section>')
HUB_CSS = (HERE / 'hub.css').read_text()
HUB_JS = (HERE / 'hub.js').read_text()
HUB = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mock · round 1 · The Rioja guide page · AtlaSlope</title><style>{FONT_CSS}</style><style>{HUB_CSS}</style></head>
<body><header class="hb"><p class="brand">AtlaSlope</p><nav class="sw" aria-label="Options"><a href="#opt-a">A<span> Subtle</span></a><a href="#opt-b">B<span> Magazine</span></a><a href="#opt-c" class="rec">C<span> Photo-led</span></a><a href="#opt-d">D<span> Bold</span></a></nav></header>
<main class="hm"><section class="intro"><p class="kick">Mock · round 1</p><h1>Pick one</h1>
<p class="lead">Four designs for the whole Rioja guide page, from subtle to bold. Each is the real page with the map closed: the same text, charts and sources. Each starts with the big photo button.</p>
<p>Use the switch above to jump between them. Each one shows as a desktop and as a phone: pick “Phone” on an option to see it at 390 px. Scroll inside the frame to read it, or open it full screen.</p>
<p><b>Recommended: C.</b> It answers all three complaints at once: photos fill the space beside the text, one facts strip replaces the boxes, and a photo opens every beat. In C, press the button at the top to watch the photo grow into the map. “Close the map” folds back to the same paragraph. The other options show the same button, and pressing it takes you to C.</p></section>
{opts_html}
<p class="foot">Photos are from the app’s own set (Wikimedia Commons), each with its licence in the credit line under every page. Mock only: nothing here is in the app.</p></main>
<script>window.OPT={{{",".join(k + ":" + js_str(DOCS[k]) for k in DOCS)}}};window.IMG={json.dumps(IMG)};window.FONTS={js_str(FONT_CSS)};</script>
<script>{HUB_JS}</script></body></html>'''
OUT.write_text(HUB)
print(OUT, round(len(HUB) / 1e6, 2), 'MB', {k: round(len(v) / 1e3) for k, v in DOCS.items()}, 'KB per option')
