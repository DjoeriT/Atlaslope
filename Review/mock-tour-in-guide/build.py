"""Tour-in-guide mock, round 1 (21 Oct 2026): the map tour folded into the Rioja guide page.

Builds ONE index.html. The guide markup and photos are the real Rioja guide page, taken from the built app by extract.mjs
(real/guide.html); the Guides page cards come from dist/guides/index.html. Map data: data/dops.geojson, data/rioja-zones.geojson,
data/koppen-spain.geojson; cameras from content/stories/rioja.json; live tiles: IGN PNOA (no key), Esri below zoom 8, IGME geology, Terrarium DEM.
Run: npm run build; node Review/mock-tour-in-guide/extract.mjs (needs `vite preview` on :4789); python3 Review/mock-tour-in-guide/build.py [out]
Default out: <main checkout>/mocks/tour-in-guide/index.html (git-ignored).
"""
import base64, json, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
MAIN = ROOT.parents[2] if ROOT.parent.name == 'worktrees' else ROOT
NM = next(p for p in (ROOT / 'node_modules', MAIN / 'node_modules') if p.exists())
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else MAIN / 'mocks/tour-in-guide/index.html'
OUT.parent.mkdir(parents=True, exist_ok=True)
DIST = ROOT / 'dist'


def b64(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(pathlib.Path(path).read_bytes()).decode()


def r4(c):
    return [round(c[0], 4), round(c[1], 4)] if isinstance(c[0], (int, float)) else [r4(x) for x in c]


def bbox(geom):
    xs, ys = [], []
    def walk(c):
        if isinstance(c[0], (int, float)): xs.append(c[0]); ys.append(c[1])
        else:
            for x in c: walk(x)
    walk(geom['coordinates'])
    return [min(xs), min(ys), max(xs), max(ys)]


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
        pts = clip(pts, ins, it)
        if not pts: return []
    return pts + [pts[0]]


# ---------- map data ----------
dops = json.loads((ROOT / 'data/dops.geojson').read_text())
zones = json.loads((ROOT / 'data/rioja-zones.geojson').read_text())
do_rioja = next(f for f in dops['features'] if f['properties']['code'] == 'DO23')
ZID = {'Rioja Alta': 'rioja-alta', 'Rioja Alavesa': 'rioja-alavesa', 'Rioja Oriental': 'rioja-oriental'}
BOUNDS = {'rioja': bbox(do_rioja['geometry'])}
ZONES = {'type': 'FeatureCollection', 'features': []}
for f in zones['features']:
    zid = ZID[f['properties']['zone']]
    BOUNDS[zid] = bbox(f['geometry'])
    ZONES['features'].append({'type': 'Feature', 'properties': {'id': zid, 'name': f['properties']['zone']}, 'geometry': {'type': f['geometry']['type'], 'coordinates': r4(f['geometry']['coordinates'])}})
RIOJA = {'type': 'Feature', 'properties': {}, 'geometry': {'type': do_rioja['geometry']['type'], 'coordinates': r4(do_rioja['geometry']['coordinates'])}}

# Koppen names and colours from src/map/climate.ts (the app's own legend)
KOP = {'Cfb': ('Oceanic', '#1F5F85'), 'Csb': ('Mild Mediterranean', '#D2D45A'), 'Csa': ('Hot Mediterranean', '#D1761C'),
       'BSk': ('Cool, dry steppe', '#B4A2DB'), 'BSh': ('Hot semi-arid', '#9E2A1B'), 'Cfa': ('Humid subtropical', '#4FAE86')}
kb = [BOUNDS['rioja'][0] - .2, BOUNDS['rioja'][1] - .2, BOUNDS['rioja'][2] + .2, BOUNDS['rioja'][3] + .2]
kfeat, legend = [], []
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
        col = KOP.get(code, ('Cold mountain', '#9A948A'))
        kfeat.append({'type': 'Feature', 'properties': {'color': col[1]}, 'geometry': {'type': 'MultiPolygon', 'coordinates': outp}})
        if any(clip_ring(p[0], BOUNDS['rioja']) for p in outp) and [col[0], col[1]] not in legend: legend.append([col[0], col[1]])
KOPPEN = {'type': 'FeatureCollection', 'features': kfeat}

story = json.loads((ROOT / 'content/stories/rioja.json').read_text())
stops = [s for s in story['steps'] if s['id'] != 'intro']
assert len(stops) == 9, len(stops)  # the real "9 places to fly to"
STOPS = [{'id': s['id'], 'chapter': s['chapter'], 'camera': s['camera']} for s in stops]
DATA = json.dumps({'rioja': RIOJA, 'zones': ZONES, 'koppen': KOPPEN, 'legend': legend, 'bounds': BOUNDS, 'stops': STOPS,
                   'intro': story['steps'][0]['camera']}, separators=(',', ':'))

# ---------- app CSS and fonts ----------
css = ''.join((DIST / 'assets' / n).read_text() for n in sorted(p.name for p in (DIST / 'assets').glob('main-*.css')))
APP_CSS = css
PAGE_CSS = ''.join(p.read_text() for p in sorted((DIST / 'assets').glob('atlas-*.css')))  # holds .pg* and maplibre css
GUIDES_CSS = ''.join(p.read_text() for p in sorted((DIST / 'assets').glob('guides-*.css')))
FONTS = ''.join(f"@font-face{{font-family:{fam};src:url({b64(DIST / 'fonts' / fn, 'font/woff2')}) format('woff2');font-weight:{w};font-display:block}}"
                for fam, fn, w in (("Newsreader", 'newsreader-latin-opsz-normal.woff2', '200 800'),
                                   ("'IBM Plex Sans'", 'ibm-plex-sans-latin-400-normal.woff2', '400'),
                                   ("'IBM Plex Sans'", 'ibm-plex-sans-latin-500-normal.woff2', '500'),
                                   ("'IBM Plex Sans'", 'ibm-plex-sans-latin-600-normal.woff2', '600')))
ML_JS = (NM / 'maplibre-gl/dist/maplibre-gl.js').read_text()
ML_CSS = (NM / 'maplibre-gl/dist/maplibre-gl.css').read_text()

# ---------- real markup ----------
guide_html = (HERE / 'real/guide.html').read_text()
guide_html = re.sub(r'<a class="story-open".*?</a>', '<!--TOURBTN-->', guide_html, count=1, flags=re.S)
guide_html = re.sub(r'<div class="pg-top".*?</div>\s*(?=<div class="pg-listing")', '', guide_html, count=1, flags=re.S) if '<div class="pg-top"' in guide_html else guide_html
assert '<!--TOURBTN-->' in guide_html

gp = (DIST / 'guides/index.html').read_text()
sitebar = re.search(r'<header class="sitebar">.*?</header>', gp, re.S).group(0)
sitebar = sitebar.replace('<a href="../map-tours/">Map tours</a>', '')  # owner decision 3: "Map tours" leaves the top bar
sitebar = re.sub(r'href="\.\./[^"]*"', 'href="#"', sitebar)
page_head = re.search(r'<header class="page-head">.*?</header>', gp, re.S).group(0)
jump = re.search(r'<nav class="jump".*?</nav>', gp, re.S).group(0)
jump = re.sub(r'<a href="#r-(?!rioja|cataluna)[^"]*">[^<]*</a>', '', jump)  # keep two region links, the rest is the same list
feat = re.search(r'<div class="feat">.*?</div></div>\n', gp, re.S).group(0)
regions = {m.group(1): m.group(0) for m in re.finditer(r'<section class="region" aria-labelledby="(r-[^"]+)">.*?</section>', gp, re.S)}
guides_body = feat + regions['r-rioja'] + regions['r-cataluna']
TOUR_IDS = ('place=rioja&amp;page', 'place=priorat&amp;page')


def inline_imgs(h):
    def sub(m):
        src = m.group(1)
        p = (DIST / src.replace('../', '', 1)) if src.startswith('../') else None
        if p and p.exists():
            return 'src="' + b64(p, 'image/webp' if p.suffix == '.webp' else 'image/jpeg') + '"'
        return m.group(0)
    h = re.sub(r' srcset="[^"]*"', '', h)
    return re.sub(r'src="([^"]+)"', sub, h)


def mark_cards(h):
    # a plain "Map tour" line on the cards of guides that have a tour (Rioja, Priorat); data-tour drives the filter
    def card(m):
        tag = m.group(0)
        if any(t in m.group(1) for t in TOUR_IDS):
            tag = tag.replace('class="gcard-c"', 'class="gcard-c has-tour"')
        return tag
    h = re.sub(r'<a class="gcard-c" href="([^"]+)"', lambda m: card(m), h)
    h = re.sub(r'(<a class="gcard-c has-tour".*?<em>[^<]*</em>)', r'\1<span class="tl">Map tour</span>', h, flags=re.S)
    h = re.sub(r'(<span class="kick">[^<]*</span><h2>Rioja</h2>)', r'\1<span class="tl">Map tour</span>', h)
    h = h.replace('<div class="feat">', '<div class="feat has-tour">')
    return h


guides_body = inline_imgs(mark_cards(guides_body))
guide_html = inline_imgs(guide_html)
SHARED = {'fonts': FONTS, 'appcss': APP_CSS, 'pagecss': PAGE_CSS, 'guidescss': GUIDES_CSS, 'mlcss': ML_CSS, 'mljs': ML_JS,
          'guide': guide_html, 'sitebar': sitebar, 'guidesPage': page_head + '<div class="page-body"><div class="wrap"><div class="gl"><p class="tourlink"><a href="#" id="tf">Guides with a map tour (2)</a></p>' + jump + guides_body + '</div></div></div>',
          'data': DATA}

tpl = (HERE / 'page.html').read_text()
page = tpl.replace('/*SHARED*/null', json.dumps(SHARED).replace('</', '<\\/'))
OUT.write_text(page)
print('wrote', OUT, round(len(page) / 1e6, 1), 'MB')
