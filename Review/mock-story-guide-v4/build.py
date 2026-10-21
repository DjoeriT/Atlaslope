"""Story guide mock, v4 (21 Oct 2026): the whole Rioja guide inside the v3 fly-over journey, with a "Close the map" choice.
v3 plus: the rest of the guide page (guide-rest-rioja.json, rendered by the app, see README), Close/Show the map button. Rioja only.

Builds ONE self-contained index.html (CSS, JS, fonts, photos, slope tint inline; map tiles load live) from the repo:
guide text from content/guides/{rioja,priorat}.json (unchanged), sources from content/sources.json, photos from public/photos/800,
outlines from data/dops.geojson (DO23 Rioja, DO70 Priorat) and data/rioja-zones.geojson, slope tint from Mapzen Terrarium tiles.
Run: python3 Review/mock-story-guide-v4/build.py [out_file]
Default out: <main checkout>/mocks/story-guide-v4/index.html (git-ignored folder).
"""
import base64, json, math, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
# A worktree has no node_modules or mocks folder of its own: fall back to the main checkout (.claude/worktrees/<name>).
MAIN = ROOT.parents[2] if ROOT.parent.name == 'worktrees' else ROOT
NM = next(p for p in (ROOT / 'node_modules', MAIN / 'node_modules') if p.exists())
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else MAIN / 'mocks/story-guide-v4/index.html'
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
NEWPH = json.loads((HERE / 'photos/credits.json').read_text())


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
    S.append(('sierra', 1, stop_html(f1, True, pic='sierra', href=FLYHREF + 'valley.1', vid='sierra') + facts_html('place')))
    used += ['rioja-3', 'sierra']
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
    S.append(('haro', 4, f'<p>{esc(p2)}</p>{cite_html(c["cite"])}{stop_html(fb, pic="haro", meas=measure("rioja-alta", "median"), href=FLYHREF + "barrel.0", vid="haro")}{facts_html("rules")}'))
    used.append('haro')
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


BUILT = {'rioja': build_rioja(), 'priorat': build_priorat()}
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
CSS = ''.join((HERE / f).read_text() for f in ('story.css', 'story-b.css', 'story-v4.css', 'app-page.scoped.css'))
JS = (HERE / 'story.js').read_text()
DATA = json.dumps({'views': VIEWS, 'focus': FOCUS, 'labels': LABELS, 'chapters': CHAPTERS, 'nch': len(GUIDES['rioja']['chapters']), 'tints': TINTS, 'rivers': RIVERS, 'names': NAMES, 'koppen': KOPPEN, 'koppenLegend': KOP_LEGEND, 'inverse': INVERSE, 'loc': LOC,
                   'back': {k: f'#place={k}&page=1' for k in GUIDES}}, ensure_ascii=False, separators=(',', ':'))
used = sorted(set(BUILT['rioja'][2]))

page = (HERE / 'guide-page-rioja.html').read_text()
# The capture points its photos at the local preview server; inline them so the page stands alone.
page = re.sub(r'http://localhost:\d+/(photos/\d+/[\w.-]+\.webp)', lambda m: b64(ROOT / 'public' / m.group(1), 'image/webp'), page)
# controls that cannot work standalone: the "All 5 photos" button (opens the app's lightbox). The mosaic photo buttons stay but do nothing.
page = re.sub(r'<button[^>]*class="all"[^>]*>.*?</button>', '', page, count=1, flags=re.S)
def after_para(chapter, n, cards):
    """Insert the stop cards after the n-th paragraph of the chapter (the paragraph its fly link belongs to)."""
    global page
    # The cards go at the top of the beat's side column, beside the text, so the column next to the prose is not left empty
    # (owner, 21 Oct 2026: "massive white space next to all the boxes of text"). On phone the side column follows the prose.
    m = re.search(r'<div class="pg-ch" id="terroir-%s">' % chapter + r'(?:<p>.*?</p>){%d}' % n, page, flags=re.S)
    assert m, chapter
    k = page.find('<div class="pg-facts', m.end())
    assert k > 0, chapter
    k = page.find('>', k) + 1
    html = ''.join(STOPCARDS[c].replace('<div class="stop', f'<div data-view="{c}" class="stop', 1) for c in cards)
    if len(cards) > 1:  # two cards side by side, so the side column stays near the prose's height
        html = f'<div class="stops2">{html}</div>'
    page = page[:k] + html + page[k:]
after_para('valley', 1, ['valley', 'sierra'])  # both names appear in the first paragraph
after_para('soils', 1, ['soils'])
after_para('barrel', 2, ['haro'])  # the paragraph about Haro's station quarter
page = re.sub(r' (id|aria-labelledby)="([^"]+)"', r' \1="c-\2"', page)  # the story column has the same ids
closed = f'<div id="closed" aria-label="The guide page"><div class="pg">{page}</div></div>'
texts = f'<div class="text" id="story-text" data-guide="rioja">\n{steps_html("rioja")}\n{credits_line(BUILT["rioja"][2])}\n</div>'

html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>The whole guide, with the map · AtlaSlope</title>
<style>{FONT_CSS}</style><style>{ML_CSS}</style><style>{CSS}</style>
</head><body>
<a class="skip" href="#story">Skip to the story</a>
<header class="top">
  <p class="brand">AtlaSlope</p>
  <p class="where"><span class="where-n"></span></p>
  <button type="button" class="mapbtn" aria-controls="map story-text">Close the map</button>
  <a class="back" href="#place=rioja&amp;page=1">Back to Rioja</a>
  <div class="progress" aria-hidden="true"><i></i></div>
</header>
<main id="story" class="sg">
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
</main>
{closed}
<p class="foot">Photos in this page: {len(used)}, each with its credit line. Rivers and names: IGN (Hidrografía INSPIRE WFS, Nomenclátor Geográfico Básico), CC BY 4.0 scne.es. Geology: IGME, Mapa Geológico de España 1:50.000 (MAGNA), WMS; the service asks to contact IGME before any paid product. Climate: Köppen-Geiger 1991-2020, Beck et al. 2023, CC BY 4.0. Outlines: DOCa Rioja and DO Priorat © MAPA; Rioja zones CC-BY 4.0 ign.es. No photo has a recorded location, so none is pinned on the map.</p>
<script>{ML_JS}</script>
<script>window.SG={DATA};</script>
<script>{JS}</script>
</body></html>'''
OUT.write_text(html)
print(OUT, round(len(html) / 1e6, 2), 'MB', 'views', {k: len(v) for k, v in VIEWS.items()}, 'photos with location', len(PHOTOS_WITH_LOCATION))
