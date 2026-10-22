"""Guides page redesign, mock round 1 (22 Oct 2026): four calmer versions (A Trim, B Index, C Map first, D Start here + index) of the Guides page.
Builds ONE page, <main checkout>/mocks/guides-r1/index.html (git-ignored), from data.json (capture.mjs: real guide data read from the built page),
the app's own photos (img/, copied by capture.mjs) and real screenshots of the app's map (maps/, from maps.mjs).
Run order: npm run build; npx vite preview --port 4173; node capture.mjs; node maps.mjs; python3 -I build.py
Open one option alone: index.html#solo=a (b, c, d).
"""
import html, json, pathlib, shutil, subprocess

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
MAIN = ROOT.parents[2] if ROOT.parent.name == 'worktrees' else ROOT
OUT = MAIN / 'mocks/guides-r1'
OUT.mkdir(parents=True, exist_ok=True)
D = json.loads((HERE / 'data.json').read_text())
CSS = (HERE / 'page.css').read_text()
JS = (HERE / 'page.js').read_text()
e = html.escape

# The region photo in B and D, chosen by hand from the contact sheets of every guide photo (fix round, 22 Oct 2026): the most telling landscape
# of the region, not one of the four Start here photos, no face, glass or bottle. Focus comes from data.json (src/home/photoCrops.json).
PICK = {'green-spain': 'txakoli-alava', 'castilla-y-leon': 'toro', 'rioja': 'rioja-alavesa', 'ebro': 'somontano', 'cataluna': 'catalunya',
        'mediterranean': 'jumilla', 'meseta': 'vinos-de-madrid', 'andalucia': 'sierras-de-malaga', 'baleares': 'pla-i-llevant', 'canarias': 'lanzarote'}

# ---- assets next to index.html (fonts, logo); cropped map frames (the app keeps room for its side panel: sips cuts the free part)
(OUT / 'fonts').mkdir(exist_ok=True)
for f in ('newsreader-latin-opsz-normal', 'ibm-plex-sans-latin-400-normal', 'ibm-plex-sans-latin-500-normal'):
    shutil.copy(ROOT / f'public/fonts/{f}.woff2', OUT / f'fonts/{f}.woff2')
shutil.copy(ROOT / 'public/favicon.svg', OUT / 'favicon.svg')
M = OUT / 'maps'
for name in ['spain'] + [r['id'] for r in D['regions']]:
    if (M / f'{name}.jpg').exists():
        subprocess.run(['sips', '-c', '640', '640', '--cropOffset', '80', '360', str(M / f'{name}.jpg'), '--out', str(M / f'{name}-c.jpg')], check=True, capture_output=True)

GUIDES = {g['id']: g for r in D['regions'] for g in r['guides']}
NAV = '<header class="sitebar"><div class="in"><a class="brand" href="#"><img src="favicon.svg" alt=""><span>AtlaSlope</span></a><nav aria-label="Main"><a href="#">Atlas</a><a href="#">Study</a><a href="#" aria-current="page">Guides</a><a href="#">About</a></nav></div></header>'
HEAD = f'<div class="page-head"><div class="wrap"><h1>{e(D["headline"])}</h1><p class="sub">{D["sub"]}</p></div></div>'
TOGGLE = '<label class="tourtoggle"><input type="checkbox" id="tours"> Show only guides with a map tour</label>'
MARK = '<span class="mark">Map tour</span>'


def link(g):
    return f'https://atlaslope.com/atlas/#place={g["id"]}&page'


def meta(g):
    """Kind and minutes; the kind is dropped when it is plain "DO" (the common case, so it is noise)."""
    return (f'{e(g["kind"])} · ' if g['kind'] != 'DO' else '') + f'{g["minutes"]} min'


def credit(keys):
    seen, parts = set(), []
    for k in keys:
        c = D['credits'][k]
        name = 'Wikimedia Commons' if c['artist'].lower().startswith('unknown') else c['artist']
        if (name, c['licence']) in seen:
            continue
        seen.add((name, c['licence']))
        a = lambda h, t: f'<a href="{e(h)}" target="_blank" rel="noopener noreferrer">{e(t)}</a>' if h else e(t)
        parts.append(f'{a(c["page"], name)} · {a(c["licenceUrl"], c["licence"])}' + (' · cropped and resized' if c['licence'].startswith('CC BY') else ''))
    return f'<p class="credit">Photos: {"; ".join(parts)}</p>' if parts else ''


def photo(g, size, lazy=True):
    pos = f' style="object-position:{g["focus"]}"' if g['focus'] and g['focus'] != '50% 50%' else ''
    return f'<span class="sqbox"><img class="sq" src="img/{size}/{g["photo"]}.webp" alt=""{pos} loading="{"lazy" if lazy else "eager"}"></span>'


def jump(prefix):
    return '<nav class="jump" aria-label="Jump to a region">' + ''.join(f'<a href="#{prefix}-{r["id"]}">{e(r["name"])}</a>' for r in D['regions']) + '</nav>'


def tourattr(g):
    return ' data-tour' if g['tour'] else ''


def card(g, size='480', extra=''):
    return (f'<a class="card" href="{link(g)}" target="_blank" rel="noopener"{tourattr(g)}{extra}>{photo(g, size)}'
            f'<span class="nm">{e(g["name"])}{MARK if g["tour"] else ""}</span><span class="meta">{meta(g)}</span></a>')


def rows(guides):
    return ''.join(f'<li{tourattr(g)}><a href="{link(g)}" target="_blank" rel="noopener"><span class="nm">{e(g["name"])}{MARK if g["tour"] else ""}</span>'
                   f'<span class="meta">{meta(g)}</span></a></li>' for g in guides)


def count(r):
    return f'{len(r["guides"])} guides'


def page(k, body):
    return (f'<!doctype html><html lang="en" data-k="{k}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>Guides · AtlaSlope (mock {k.upper()})</title><style>{CSS}</style></head><body>{NAV}{body}<script>{JS}</script></body></html>')


# ---- A Trim: same structure as the live page, no duplicate tours section, no showcase, small squares, one line per card.
# A guide without a photo gets no tile: it is named in a text line under the grid.
def opt_a():
    secs, keys = [], []
    for r in D['regions']:
        first, rest = r['guides'][:6], r['guides'][6:]
        cards = ''.join(card(g) for g in first if g['photo']) + ''.join(card(g, extra=' data-x') for g in rest if g['photo'])
        also = ''.join(f'<a href="{link(g)}" target="_blank" rel="noopener"{tourattr(g)}{"" if g in first else " data-x"}>{e(g["name"])}{MARK if g["tour"] else ""}<span class="meta">{meta(g)}</span></a>' for g in r['guides'] if not g['photo'] and (g in first or g['tour']))
        keys += [g['photo'] for g in first if g['photo']] + [g['photo'] for g in rest if g['photo'] and g['tour']]
        more = f'<p class="more"><a href="https://atlaslope.com/atlas/#region={r["id"]}&page" target="_blank" rel="noopener">All {len(r["guides"])} {e(r["name"])} guides</a></p>' if len(r['guides']) > 6 else ''
        secs.append(f'<section class="region" id="r-{r["id"]}"><div class="rowh"><h2>{e(r["name"])}</h2><span class="n">{count(r)}</span></div><div class="cards">{cards}</div><div class="also">{also}</div>{more}</section>')
    body = HEAD + f'<div class="wrap">{jump("r")}<div class="bar"><span></span>{TOGGLE}</div>' + ''.join(secs) + f'<div class="foot">{credit(keys)}</div></div>'
    return page('a', body)


# ---- the index with one hand-picked square photo per region (B, and D under its Start here row)
def index_sections(prefix):
    secs, keys = [], []
    for r in D['regions']:
        lead = GUIDES[PICK[r['id']]]
        keys.append(lead['photo'])
        ph = photo(lead, '480')
        head = f'<div class="rowh"><h2>{e(r["name"])}</h2><span class="n">{count(r)}</span></div>'
        secs.append(f'<section class="region" id="{prefix}-{r["id"]}"><div class="bhead">{head}</div><div class="bblock"><div class="ph">{ph}</div><div><div class="bphone">{ph}{head}</div><ul class="idx two">{rows(r["guides"])}</ul></div></div></section>')
    return ''.join(secs), keys


def opt_b():
    secs, keys = index_sections('b')
    body = HEAD + f'<div class="wrap">{jump("b")}<div class="bar"><span></span>{TOGGLE}</div>' + secs + f'<div class="foot">{credit(keys)}</div></div>'
    return page('b', body)


# ---- C Map first: one real map of Spain, the regions open one at a time beside it
def opt_c():
    imgs = '<img data-r="spain" src="maps/spain-c.jpg" alt="The AtlaSlope map of Spain with every wine area outlined">' + ''.join(f'<img data-r="{r["id"]}" src="maps/{r["id"]}-c.jpg" alt="The AtlaSlope map at {e(r["name"])}" loading="lazy">' for r in D['regions'])
    acc = []
    for r in D['regions']:
        t = sum(1 for g in r['guides'] if g['tour'])
        long_ = f'{count(r)} · {t} with a map tour' if t else count(r)
        short = f'{count(r)} · {t} tours' if t else count(r)
        acc.append(f'<details name="region" data-r="{r["id"]}" id="c-{r["id"]}"><summary><span class="t">{e(r["name"])}</span><span class="meta"><span class="long">{long_}</span><span class="short">{short}</span></span></summary><ul class="idx">{rows(r["guides"])}</ul></details>')
    body = HEAD + (f'<div class="wrap"><div class="bar"><span></span>{TOGGLE}</div><div class="cmain"><figure class="cmap"><div class="frame">{imgs}</div>'
                   '<figcaption class="maptag">Map: the AtlaSlope atlas · OpenFreeMap © OpenStreetMap · wine areas from the official DOP boundaries</figcaption></figure>'
                   f'<div class="acc">{"".join(acc)}</div></div></div>')
    return page('c', body)


# ---- D Start here + index: region links first, then four photo cards, then B's index
def opt_d():
    st = [GUIDES[i] for i in D['start']]
    start = '<section class="start"><h2>Start here</h2><div class="cards">' + ''.join(card(g, '800') for g in st) + '</div></section>'
    secs, keys = index_sections('d')
    allbar = f'<div class="bar toph"><h2 class="allh">All guides</h2>{TOGGLE}</div>'
    body = HEAD + f'<div class="wrap">{jump("d")}{start}{allbar}{secs}<div class="foot">{credit([g["photo"] for g in st] + keys)}</div></div>'
    return page('d', body)


# ---- E (D and A combined, owner 22 Oct 2026; round 2: the satellite stills are gone): a black "Read with the map" band of the tour guides' own
# square photos, then every region as small squares. Every tour tile carries a champagne "Map tour" chip on the photo (the owner's one exception
# to "no text on photos"; credits stay off photos).
GLYPH = ('<svg class="glyph" width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true">'
         '<path d="M1.5 3.5 6.5 2v12.5l-5 1.5zM6.5 2l5 1.5v12.5l-5-1.5zM11.5 3.5 16.5 2v12.5l-5 1.5z"/></svg>')
CHIP = f'<span class="chip">{GLYPH}<span>Map tour</span></span>'


def ephoto(g):
    p = photo(g, '480')
    return p[:-len('</span>')] + (CHIP if g['tour'] else '') + '</span>'


def ecard(g):
    kind = f'<span class="meta">{e(g["kind"])}</span>' if g['kind'] != 'DO' else ''
    return f'<a class="ecard" href="{link(g)}" target="_blank" rel="noopener"{tourattr(g)}>{ephoto(g)}<span class="nm">{e(g["name"])}</span>{kind}</a>'


def opt_e():
    order = [g for r in D['regions'] for g in r['guides'] if g['tour']]
    order.sort(key=lambda g: {'rioja': 0, 'priorat': 1}.get(g['id'], 2))
    assert all(g['photo'] for g in order)
    featured = [next(g for g in order if g['id'] == i) for i in ('rioja', 'priorat', 'ribeira-sacra', 'txakoli-getaria')]
    rest = [g for g in order if g not in featured]
    tile = lambda g: f'<a href="{link(g)}" target="_blank" rel="noopener">{ephoto(g)}<span class="nm">{e(g["name"])}</span></a>'
    band = (f'<section class="band"><div class="wrap"><div class="rowh"><h2>Explore with the map</h2><span class="n">{len(order)} guides</span></div>'
            f'<div class="stills feat">{"".join(tile(g) for g in featured)}</div>'
            f'<div class="stills more" id="more-tours" hidden>{"".join(tile(g) for g in rest)}</div>'
            f'<button type="button" class="morebtn" id="morebtn" aria-expanded="false" aria-controls="more-tours" data-more="Show all {len(order)} map tours" data-less="Show fewer">Show all {len(order)} map tours</button>'
            '</div></section>')
    secs, keys = [], [g['photo'] for g in order]
    for r in D['regions']:
        withp = [g for g in r['guides'] if g['photo']]
        nop = [g for g in r['guides'] if not g['photo']]
        keys += [g['photo'] for g in withp]
        also = ('<span class="al">Also</span>' + ''.join(f'<a href="{link(g)}" target="_blank" rel="noopener"{tourattr(g)}>{e(g["name"])}</a>' for g in nop)) if nop else ''
        secs.append(f'<section class="region" id="e-{r["id"]}"><div class="rowh"><h2>{e(r["name"])}</h2><span class="n">{count(r)}</span></div>'
                    f'<div class="ecards">{"".join(ecard(g) for g in withp)}</div><div class="also">{also}</div></section>')
    body = HEAD + band + f'<div class="wrap">{jump("e")}<div class="bar"><span></span>{TOGGLE}</div>' + ''.join(secs) + f'<div class="foot">{credit(keys)}</div></div>'
    return page('e', body)


OPTS = {'a': opt_a(), 'b': opt_b(), 'c': opt_c(), 'd': opt_d(), 'e': opt_e()}
INFO = {
    'a': ('A', 'Trim', 'The live structure, trimmed. Small square photos, five to six to a row. A card is a photo, a name and one line. A guide without a photo is named under the grid. The tours section and the showcase are gone; the checkbox is the only way to see tours.'),
    'b': ('B', 'Index', 'One hand-picked photo for each region, then every guide as a calm contents list. One hairline per row. No summaries.'),
    'c': ('C', 'Map first', 'One real map of Spain as the first thing, sticky while you read. Regions open one at a time beside it, and the map follows. No photos.'),
    'd': ('D', 'Start here + index', 'Region links, four photo cards to begin with (a swipe row on a phone), then the index for every region, each opening with one photo.'),
    'e': ('E', 'Map tours band + small squares', 'D and A combined. A black band of the own square photos of the map-tour guides. Then every region as small photo squares; every tour tile carries a champagne Map tour chip on the photo. Recommended.'),
}
sections = ''
for k, (L, n, txt) in INFO.items():
    rec = '<em>Recommended</em>' if k == 'e' else ''
    sections += (f'<section class="opt" id="opt-{k}" data-k="{k}"><header><div><h2>{L} · {n}{rec}</h2><p>{e(txt)}</p></div>'
                 '<div class="seg" role="group" aria-label="Width"><button data-m="desktop" aria-pressed="true">Desktop</button><button data-m="phone" aria-pressed="false">Phone</button></div></header>'
                 f'<div class="frame desktop"><iframe title="Option {L}" loading="lazy"></iframe></div><p class="solo"><a href="#solo={k}">Open {L} alone</a></p></section>')
opts_json = json.dumps(OPTS).replace('</', '<\\/')
HUB_CSS = (CSS.split(':root')[0] + (HERE / 'hub.css').read_text())
hub = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Guides page, mock round 1</title><style>{HUB_CSS}</style></head><body>'
       '<nav class="switch" aria-label="Options"><b>AtlaSlope · Guides, round 1</b>' + ''.join(f'<a href="#opt-{k}">{k.upper()}</a>' for k in OPTS) + '</nav>'
       + sections + '<p class="note">Mock: the guide names, kinds, minutes, tour marks and photos are the real ones from the built Guides page. Links open the live guide.</p>'
       f'<script type="application/json" id="opts">{opts_json}</script><script>{(HERE / "hub.js").read_text()}</script></body></html>')
(OUT / 'index.html').write_text(hub)
print('wrote', OUT / 'index.html', f'{len(hub) // 1024} KB')
