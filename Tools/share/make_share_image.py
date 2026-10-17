"""Build the link-preview image (public/share.png, 1200x630) shown when atlaslope.com is pasted into a chat or a post.

Writes an HTML page of the card (logo, name, tagline, the Spanish DO map) and renders it with Playwright's Chromium:
  python3 Tools/share/make_share_image.py && npx playwright screenshot --viewport-size=1200,630 \
    file://$PWD/Tools/share/share.html public/share.png
"""
import json, math, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
# Colours from Review/visual-style.md: white and wine (light), gold on black (dark).
THEMES = {
    'light': dict(bg='#FFFFFF', accent='#8C2340', ink_on='#FFFFFF', name='#1F1F1F', tag='#484848', muted='#6E6E6E',
                  land='#F3F1F1', border='#DDDDDD', do='#D9677E', do_line='#FFFFFF', hair='#DDDDDD'),
    'dark': dict(bg='#121212', accent='#C9A54E', ink_on='#141210', name='#F3F1EC', tag='#CFCBC3', muted='#9A968F',
                 land='#1E1E1E', border='#3A3A3A', do='#8F7536', do_line='#121212', hair='#3A3A3A'),
}
THEME = sys.argv[1] if len(sys.argv) > 1 else 'dark'  # the owner picked dark for the card (17 Oct 2026)
C = THEMES[THEME]
W, H = 1200, 630
# Map box: mainland Spain and the Balearics, drawn in the right part of the card.
LON0, LON1, LAT0, LAT1 = -9.9, 4.6, 35.6, 44.0
MX0, MX1 = 560, 1170  # pixel span the box is fitted into (height follows from Mercator)


def merc_y(lat):
    return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


sx = (MX1 - MX0) / (LON1 - LON0)
sy = sx * 180 / math.pi  # same scale in both directions
top = merc_y(LAT1)
map_h = (top - merc_y(LAT0)) * sy
oy = (H - map_h) / 2


def pt(lon, lat):
    return MX0 + (lon - LON0) * sx, oy + (top - merc_y(lat)) * sy


def ring_path(ring):
    pts = [pt(*c[:2]) for c in ring]
    return 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + 'Z'


def geom_path(g, close=True):
    t, c = g['type'], g['coordinates']
    if t == 'Polygon':
        return ''.join(ring_path(r) for r in c)
    if t == 'MultiPolygon':
        return ''.join(ring_path(r) for p in c for r in p)
    lines = [c] if t == 'LineString' else c
    return ''.join('M' + 'L'.join('%.1f %.1f' % pt(*q[:2]) for q in ln) for ln in lines)


world = json.loads((ROOT / 'data/natural-earth-world.geojson').read_text())
land = ''.join(geom_path(f['geometry']) for f in world['features'] if f['properties']['layer'] == 'land')
border = ''.join(geom_path(f['geometry']) for f in world['features'] if f['properties']['layer'] == 'border')
dops = json.loads((ROOT / 'data/dops.geojson').read_text())['features']
# Canary Islands sit outside the box; Vinos de Pago are estates too small to read here.
do_fill = {k: C['do'] for k in ('DOCa', 'DO', 'DOP', 'VC')}
do_paths = ''.join(
    f'<path d="{geom_path(f["geometry"])}" fill="{do_fill[f["properties"]["kind"]]}"/>'
    for f in dops if f['properties']['kind'] in do_fill
)

# The app's own mark (BrandMark in src/app/TopBar.tsx) in the light theme's colours.
logo = (
    '<svg width="132" height="132" viewBox="0 0 64 64"><defs><clipPath id="t"><rect width="64" height="64" rx="14"/></clipPath>'
    '<clipPath id="h"><path d="M-2 52 C 14 50 30 40 44 26 C 50 20 56 17 66 16 L66 66 L-2 66 Z"/></clipPath></defs>'
    '<g clip-path="url(#t)"><rect width="64" height="64" fill="'+C['accent']+'"/><g clip-path="url(#h)"><rect width="64" height="64" fill="'+C['ink_on']+'"/>'
    '<g fill="none" stroke="'+C['accent']+'" stroke-width="3.6" stroke-linecap="round"><path d="M8 66 L20 49"/><path d="M22 66 L31 40.5"/>'
    '<path d="M36 66 L41 30.5"/><path d="M50 66 L51 22.5"/><path d="M64 66 L61 17"/></g></g></g>'
    # A hairline keeps the tile's white hill from melting into the white card.
    '<rect x="0.25" y="0.25" width="63.5" height="63.5" rx="13.75" fill="none" stroke="'+C['hair']+'" stroke-width="0.5"/></svg>'
)

html = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family: Newsreader; src: url('../../public/fonts/newsreader-latin-600-normal.woff2'); font-weight: 600; }}
@font-face {{ font-family: 'IBM Plex Sans'; src: url('../../public/fonts/ibm-plex-sans-latin-400-normal.woff2'); font-weight: 400; }}
@font-face {{ font-family: 'IBM Plex Sans'; src: url('../../public/fonts/ibm-plex-sans-latin-500-normal.woff2'); font-weight: 500; }}
html, body {{ margin: 0; width: {W}px; height: {H}px; overflow: hidden; background: {C['bg']}; }}
.map {{ position: absolute; inset: 0; }}
.text {{ position: absolute; left: 80px; top: 0; bottom: 0; width: 520px; display: flex; flex-direction: column; justify-content: center; }}
.name {{ font: 600 104px/1 Newsreader, serif; color: {C['name']}; letter-spacing: -1.5px; margin: 36px 0 22px; }}
.tag {{ font: 400 40px/1.3 'IBM Plex Sans', sans-serif; color: {C['tag']}; }}
.credit {{ position: absolute; right: 22px; bottom: 14px; font: 400 13px/1 'IBM Plex Sans', sans-serif; color: {C['muted']}; }}
</style></head><body>
<svg class="map" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<path d="{land}" fill="{C['land']}"/>
<path d="{border}" fill="none" stroke="{C['border']}" stroke-width="1.2"/>
<g stroke="{C['do_line']}" stroke-width="0.6" stroke-linejoin="round">{do_paths}</g>
<rect x="0" y="0" width="600" height="{H}" fill="url(#fade)"/>
<defs><linearGradient id="fade" x1="0" x2="1"><stop offset="0.78" stop-color="{C['bg']}"/><stop offset="1" stop-color="{C['bg']}" stop-opacity="0"/></linearGradient></defs>
</svg>
<div class="text">{logo}<div class="name">AtlaSlope</div><div class="tag">The wine atlas<br>that quizzes you</div></div>
<div class="credit">Map: © MAPA · Natural Earth</div>
</body></html>"""
(ROOT / 'Tools/share/share.html').write_text(html)
print('wrote Tools/share/share.html')
