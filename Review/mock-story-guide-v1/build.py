"""Story guide mock, round 1 (18 Oct 2026): the Rioja guide where the map follows the text.

Builds one self-contained index.html from the repo: guide text from content/guides/rioja.json (unchanged),
sources from content/sources.json, photos from public/photos/800 with credits from data/photos.json,
the DOCa outline from data/dops.geojson (DO23) and the zones from data/rioja-zones.geojson.
Map: MapLibre from node_modules, PNOA imagery (IGN, Spain) over Esri World Imagery, AWS Terrarium terrain.
Run: python3 Review/mock-story-guide-v1/build.py [out_dir]   (default: next to this file)
"""
import base64, json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path(__file__).parent
OUT.mkdir(parents=True, exist_ok=True)

guide = json.loads((ROOT / 'content/guides/rioja.json').read_text())
sources = json.loads((ROOT / 'content/sources.json').read_text())
photos = json.loads((ROOT / 'data/photos.json').read_text())['photos']


def b64(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(pathlib.Path(path).read_bytes()).decode()


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


# ---------- map data ----------
dops = json.loads((ROOT / 'data/dops.geojson').read_text())
do = next(f for f in dops['features'] if f['properties']['code'] == 'DO23')
zones = json.loads((ROOT / 'data/rioja-zones.geojson').read_text())
ZID = {'Rioja Alta': 'rioja-alta', 'Rioja Alavesa': 'rioja-alavesa', 'Rioja Oriental': 'rioja-oriental'}
for f in zones['features']:
    f['properties'] = {'id': ZID[f['properties']['zone']], 'name': f['properties']['zone']}
do['properties'] = {'id': 'rioja', 'name': 'Rioja'}


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
    """Area centroid of the largest ring: good enough for a label inside these zones."""
    rings = [geom['coordinates'][0]] if geom['type'] == 'Polygon' else [p[0] for p in geom['coordinates']]
    def area(r):
        return sum(r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1] for i in range(len(r) - 1)) / 2
    r = max(rings, key=lambda r: abs(area(r)))
    a = area(r); cx = cy = 0
    for i in range(len(r) - 1):
        k = r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]
        cx += (r[i][0] + r[i + 1][0]) * k; cy += (r[i][1] + r[i + 1][1]) * k
    return [round(cx / (6 * a), 4), round(cy / (6 * a), 4)]


BOUNDS = {'rioja': bbox(do['geometry'])}


def mask(fid, geom):
    # The world with the place cut out: the map dims everything but the place in focus.
    outer = [[-179, -85], [179, -85], [179, 85], [-179, 85], [-179, -85]]
    polys = [geom['coordinates']] if geom['type'] == 'Polygon' else geom['coordinates']
    holes = [p[0] for p in polys]
    return {'type': 'Feature', 'properties': {'id': fid}, 'geometry': {'type': 'Polygon', 'coordinates': [outer] + holes}}


MASKS = {'type': 'FeatureCollection', 'features': [mask('rioja', do['geometry'])] + [mask(f['properties']['id'], f['geometry']) for f in zones['features']]}
LABELS = {}
for f in zones['features']:
    BOUNDS[f['properties']['id']] = bbox(f['geometry'])
    LABELS[f['properties']['id']] = label_point(f['geometry'])

# ---------- sources ----------
def cite_html(cites):
    by = {}
    for c in cites:
        sid, page = c.split(':p')
        by.setdefault(sid, []).append(page)
    parts = []
    for sid, pages in by.items():
        s = sources[sid]
        pg = 'p. ' + ', '.join(pages)
        parts.append(f'<a href="{esc(s["url"])}" target="_blank" rel="noopener">{esc(s["title"])}, {pg}</a>')
    return '<p class="src">Source: ' + '; '.join(parts) + '</p>'


# ---------- photos ----------
USED = []
def photo(pid, cls, ratio_note=''):
    p = photos[pid]
    USED.append(pid)
    src = b64(ROOT / f'public/photos/800/{pid}.webp', 'image/webp')
    return f'<img class="{cls}" src="{src}" alt="{esc(p["alt"])}" loading="lazy" decoding="async">'


def credit(pid):
    p = photos[pid]
    return f'<a href="{esc(p["page"])}" target="_blank" rel="noopener">{esc(p["artist"])}</a>, {esc(p["licence"])}'


# ---------- views (what the map shows for each step) ----------
# kind: 'place' fits a boundary; 'point' flies to a point. pitch/bearing are mock choices, not facts.
VIEWS = {
    'intro': {'center': [-2.5, 42.3], 'zoom': 6.7, 'pitch': 0, 'bearing': 0, 'focus': 'rioja', 'chip': 'Rioja in northern Spain'},
}
PIN = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>'


def view_for(fly, vid, extra=None):
    v = {'chip': fly['label']}
    if 'place' in fly:
        v.update({'bounds': BOUNDS[fly['place']], 'focus': fly['place'], 'pitch': 0, 'bearing': 0})
    else:
        v.update({'center': fly['point'], 'zoom': fly['zoom'], 'focus': 'rioja', 'pitch': 0, 'bearing': 0, 'dot': fly['point']})
    if extra: v.update(extra)
    VIEWS[vid] = v
    return vid


def stop_html(fly, vid, standalone=False):
    cls = 'stop solo' if standalone else 'stop'
    return (f'<div class="{cls}"><p class="stop-lab">'
            f'{PIN}<span><small>On the map</small>{esc(fly["label"])}</span></p>'
            f'<p class="cap">{esc(fly["caption"])}</p>{cite_html(fly["cite"])}</div>')


ch = {c['id']: c for c in guide['chapters']}
steps = []  # (view id, chapter number or 0, html)

# Intro
cover = 'rioja-2'
steps.append(('intro', 0, f'''
<figure class="cover">{photo(cover, 'cover-img')}<figcaption class="pill">Photo: {credit(cover)}</figcaption></figure>
<p class="kicker">Terroir · {guide["minutes"]}-minute read</p>
<h1 id="title">{esc(guide["title"])}</h1>
<p class="lede">{esc(guide["lede"]["text"])}</p>
{cite_html(guide["lede"]["cite"])}
<nav class="toc" aria-label="Chapters"><ol>{''.join(f'<li><a href="#ch-{c["id"]}">{esc(c["title"])}</a></li>' for c in guide["chapters"])}</ol></nav>
<p class="hint"><span aria-hidden="true">↓</span> Scroll to read. The map follows the text.</p>'''))

# 1 Valley
c = ch['valley']
f0, f1 = c['fly']
view_for(f0, 'valley', {'markers': [['Haro', [-2.847, 42.577]], ['Alfaro', [-1.750, 42.180]]]})
view_for(f1, 'sierra', {'center': [-2.62, 42.545], 'zoom': 10.9, 'pitch': 64, 'bearing': 0, 'dot': None})
steps.append(('valley', 1, f'''<h2 id="ch-valley"><span class="n">1</span>{esc(c["title"])}</h2>
{''.join(f'<p>{esc(p)}</p>' for p in c["paras"])}
{cite_html(c["cite"])}
{stop_html(f0, 'valley')}'''))
steps.append(('sierra', 1, stop_html(f1, 'sierra', True)))

# 2 Climate
c = ch['climate']
VIEWS['climate'] = {'bounds': BOUNDS['rioja'], 'focus': 'zones', 'pitch': 0, 'bearing': 0, 'chip': 'Rioja’s three zones', 'zonelabels': True}
steps.append(('climate', 2, f'''<h2 id="ch-climate"><span class="n">2</span>{esc(c["title"])}</h2>
{''.join(f'<p>{esc(p)}</p>' for p in c["paras"])}
{cite_html(c["cite"])}'''))
ZPHOTO = {'Rioja Alta': 'rioja-alta-1', 'Rioja Alavesa': 'rioja-alavesa-1', 'Rioja Oriental': 'rioja-oriental-1'}
for card in c['cards']:
    fl = card['fly']
    vid = view_for(fl, 'z-' + fl['place'])
    VIEWS[vid]['zonelabels'] = True
    pid = ZPHOTO[card['title']]
    steps.append((vid, 2, f'''<article class="zone" aria-labelledby="h-{vid}">
<figure>{photo(pid, 'zone-img')}<figcaption class="credit">Photo: {credit(pid)}</figcaption></figure>
<h3 id="h-{vid}">{esc(card["title"])}</h3>
<p class="lab">Climate</p><p>{esc(card["climate"])}</p>
<p class="lab">Wine</p><p>{esc(card["wine"])}</p>
{cite_html(fl["cite"])}
</article>'''))

# 3 Soils
c = ch['soils']
fs = c['fly'][0]
view_for(fs, 'soils', {'pitch': 45, 'bearing': -15})
steps.append(('soils', 3, f'''<h2 id="ch-soils"><span class="n">3</span>{esc(c["title"])}</h2>
{''.join(f'<p>{esc(p)}</p>' for p in c["paras"])}
{cite_html(c["cite"])}
{stop_html(fs, 'soils')}'''))

# 4 Barrel
c = ch['barrel']
fb = c['fly'][0]
VIEWS['barrel'] = {'bounds': BOUNDS['rioja'], 'focus': 'rioja', 'pitch': 0, 'bearing': 0, 'chip': 'Rioja', 'markers': [['Haro', [-2.847, 42.577]]]}
view_for(fb, 'haro', {'pitch': 50, 'bearing': 20, 'zoom': 14})
p1, p2 = c['paras']
steps.append(('barrel', 4, f'''<h2 id="ch-barrel"><span class="n">4</span>{esc(c["title"])}</h2>
<p>{esc(p1)}</p>'''))
steps.append(('haro', 4, f'''<p>{esc(p2)}</p>
{cite_html(c["cite"])}
{stop_html(fb, 'haro')}'''))

# End
# The end keeps the last view (Haro): an overview here pulled the map out before Haro had landed (owner, 07:46Z).
credits = ''.join(f'<li>{esc(photos[p]["alt"])}: {credit(p)}</li>' for p in dict.fromkeys(USED))
steps.append(('haro', 0, f'''<div class="end">
<p class="kicker">You reached the end</p>
<p class="endq">Can you place the three zones?</p>
<a class="btn" href="#quiz=test&amp;set=rioja-alta,rioja-alavesa,rioja-oriental">Test me on Rioja’s zones</a>
</div>
<div class="photos"><p class="lab">Photos</p><ul>{credits}</ul></div>
<p class="mapsrc">Map: imagery PNOA © IGN (scne.es, CC BY 4.0) and Esri World Imagery; terrain Mapzen Terrarium on AWS Open Data; DOCa boundary © MAPA; zones CC-BY 4.0 ign.es.</p>'''))

CHAPTERS = [c['title'] for c in guide['chapters']]

step_html = '\n'.join(
    f'<section class="step{" step-intro" if vid == "intro" else ""}{" step-end" if 'class="end"' in h else ""}" data-view="{vid}" data-ch="{n}"><div class="step-in">{h}</div></section>'
    for vid, n, h in steps)

# ---------- assets ----------
fonts = ROOT / 'public/fonts'
FONT_CSS = f'''
@font-face{{font-family:"Newsreader";font-style:normal;font-weight:200 800;font-display:swap;src:url({b64(fonts/'newsreader-latin-opsz-normal.woff2','font/woff2')}) format("woff2")}}
@font-face{{font-family:"Newsreader";font-style:italic;font-weight:400;font-display:swap;src:url({b64(fonts/'newsreader-latin-400-italic.woff2','font/woff2')}) format("woff2")}}
@font-face{{font-family:"IBM Plex Sans";font-weight:400;font-display:swap;src:url({b64(fonts/'ibm-plex-sans-latin-400-normal.woff2','font/woff2')}) format("woff2")}}
@font-face{{font-family:"IBM Plex Sans";font-weight:500;font-display:swap;src:url({b64(fonts/'ibm-plex-sans-latin-500-normal.woff2','font/woff2')}) format("woff2")}}
@font-face{{font-family:"IBM Plex Sans";font-weight:600;font-display:swap;src:url({b64(fonts/'ibm-plex-sans-latin-600-normal.woff2','font/woff2')}) format("woff2")}}
'''
ML_JS = (ROOT / 'node_modules/maplibre-gl/dist/maplibre-gl.js').read_text()
ML_CSS = (ROOT / 'node_modules/maplibre-gl/dist/maplibre-gl.css').read_text()
CSS = (pathlib.Path(__file__).parent / 'story.css').read_text()
JS = (pathlib.Path(__file__).parent / 'story.js').read_text()
DATA = json.dumps({'masks': MASKS, 'views': VIEWS, 'do': do, 'zones': zones, 'labels': LABELS, 'chapters': CHAPTERS}, ensure_ascii=False, separators=(',', ':'))

html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Story guide mock · Rioja · AtlaSlope</title>
<style>{FONT_CSS}</style><style>{ML_CSS}</style><style>{CSS}</style>
<script>try{{var t=new URLSearchParams(location.search).get('theme')||localStorage.getItem('sg-theme');if(t)document.documentElement.dataset.theme=t;else if(matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.dataset.theme='dark'}}catch(e){{}}</script>
</head><body>
<a class="skip" href="#title">Skip to the text</a>
<header class="top">
  <a class="back" href="#place=rioja&amp;page=1"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>Back to Rioja</span></a>
  <p class="where"><span class="where-n"></span><span class="where-t">{esc(guide["title"])}</span></p>
  <button class="theme" type="button" aria-label="Switch light or dark"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg></button>
  <div class="progress" aria-hidden="true"><i></i></div>
</header>
<main class="sg">
  <div class="mapwrap" aria-label="Map of Rioja that follows the text" role="region">
    <div id="map"></div>
    <p class="chip"></p>
    <button class="recentre" type="button" hidden>Back to the story view</button>
  </div>
  <div class="text">
{step_html}
  </div>
</main>
<script>{ML_JS}</script>
<script>window.SG={DATA};</script>
<script>{JS}</script>
</body></html>'''
(OUT / 'index.html').write_text(html)
print(OUT / 'index.html', round(len(html) / 1e6, 2), 'MB', 'views', len(VIEWS), 'steps', len(steps))
