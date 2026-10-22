#!/usr/bin/env python3
"""Photo-led brand round, step 1: full-size Commons originals for the hero places plus new candidates.

Hero places are the four featured guides (`BAND_FEATURED` in src/home/guideCount.ts). For each:
- the photos already in data/photos.json: original URL and size, original downloaded to mocks/brand-photos/originals/;
- new candidates from Commons search (golden-hour and landscape terms), filtered to free licences, landscape
  orientation and at least MIN_W px wide; a 500 px thumbnail each for the contact sheet.
Writes mocks/brand-photos/candidates.json. Source: Wikimedia Commons (data/SOURCES.md). Run with python3 -I.
"""
import json, os, re, sys, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'mocks', 'brand-photos')
API = 'https://commons.wikimedia.org/w/api.php'
UA = 'Atlaslope/1.0 (https://github.com/DjoeriT/Atlaslope; brand photo sourcing)'
MIN_W = 2400
PER_PLACE = 25
FREE = re.compile(r'^(CC0|Public domain|PD|CC BY(-SA)? [0-9.]+)', re.I)
GOLDEN = re.compile(r'sunset|sunrise|atardecer|amanecer|ocaso|posta de sol|solpor|capvespre|alba|golden|dorad|autumn|otoño|tardor|outono|udazken', re.I)

PLACES = {
    'rioja': {'prefix': ('rioja',), 'q': [
        'Rioja vineyards sunset', 'viñedos Rioja atardecer', 'viñedos Rioja otoño', 'Rioja vineyard autumn',
        'viñedos Haro', 'viñedos Briones', 'viñedos San Vicente de la Sonsierra', 'viñedos Laguardia',
        'viñedos Labastida', 'Rioja Alavesa viñedos', 'viñedos Cenicero', 'viñedos Elciego', 'Sierra de Cantabria viñedos']},
    'priorat': {'prefix': ('priorat',), 'q': [
        'Priorat vineyards', 'vinyes Priorat', 'vinyes Gratallops', 'vinyes Porrera', 'Priorat capvespre',
        'vinyes Torroja del Priorat', 'vinyes Poboleda', 'Montsant vinyes', 'Priorat landscape', 'vinyes la Vilella']},
    'ribeira-sacra': {'prefix': ('ribeira-sacra',), 'q': [
        'Ribeira Sacra viñedos', 'Ribeira Sacra socalcos', 'Ribeira Sacra viñas', 'Canón do Sil viñas',
        'Cañón del Sil viñedos', 'Belesar viñedos', 'Amandi viñas', 'Ribeira Sacra atardecer', 'Ribeira Sacra solpor', 'Sil vendimia']},
    'txakoli-getaria': {'prefix': ('txakoli-getaria',), 'q': [
        'Getaria viñedos', 'Getaria mahastiak', 'Getariako Txakolina', 'txakoli viñedo Getaria', 'Zarautz viñedos',
        'Askizu', 'Getaria atardecer', 'txakoli vineyard', 'Zarautz mahastiak']},
}


def api(params):
    params = {**params, 'format': 'json', 'formatversion': '2'}
    req = urllib.request.Request(API + '?' + urllib.parse.urlencode(params), headers={'User-Agent': UA})
    for i in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except Exception as e:  # 429 or a timeout: back off
            time.sleep(2 + 4 * i)
            err = e
    raise err


def fetch(url, path):
    if os.path.exists(path):
        return
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    for i in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180) as r, open(path + '.part', 'wb') as f:
                f.write(r.read())
            os.replace(path + '.part', path)
            return
        except Exception:
            time.sleep(3 + 5 * i)
    print('FAILED', url, file=sys.stderr)


def strip(html):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', html or '')).strip()


def info(titles):
    """imageinfo for up to 50 titles: size, original URL, 500 px thumb, licence, artist, date."""
    out = {}
    for i in range(0, len(titles), 50):
        d = api({'action': 'query', 'titles': '|'.join(titles[i:i + 50]), 'prop': 'imageinfo',
                 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': '500'})
        for p in d['query']['pages']:
            if 'imageinfo' not in p:
                continue
            ii = p['imageinfo'][0]
            m = ii.get('extmetadata', {})
            g = lambda k: strip(m.get(k, {}).get('value', ''))
            out[p['title']] = {
                'title': p['title'], 'w': ii['width'], 'h': ii['height'], 'mime': ii.get('mime'),
                'url': ii['url'], 'thumb': ii.get('thumburl'), 'page': ii['descriptionurl'],
                'licence': g('LicenseShortName'), 'artist': g('Artist')[:80], 'date': g('DateTimeOriginal')[:10],
                'desc': g('ImageDescription')[:160]}
    return out


def main():
    os.makedirs(os.path.join(OUT, 'originals'), exist_ok=True)
    os.makedirs(os.path.join(OUT, 'thumbs'), exist_ok=True)
    have = json.load(open(os.path.join(ROOT, 'data', 'photos.json')))['photos']
    result = {}
    for place, cfg in PLACES.items():
        own = {k: v['title'] for k, v in have.items() if k.startswith(cfg['prefix'])}
        oi = info(list(own.values()))
        picked = []
        for k, t in own.items():
            e = oi.get(t)
            if not e:
                continue
            e['id'] = k
            ext = os.path.splitext(e['url'])[1].lower()
            fetch(e['url'], os.path.join(OUT, 'originals', k + ext))
            fetch(e['thumb'], os.path.join(OUT, 'thumbs', k + '.jpg'))
            e['file'] = 'thumbs/' + k + '.jpg'
            picked.append(e)
        hits = {}
        for q in cfg['q']:
            d = api({'action': 'query', 'list': 'search', 'srsearch': q + ' filetype:bitmap', 'srnamespace': '6', 'srlimit': '50'})
            for s in d['query']['search']:
                hits.setdefault(s['title'], set()).add(q)
            time.sleep(0.3)
        ci = info([t for t in hits if t not in own.values()])
        cands = []
        for t, e in ci.items():
            if e['mime'] != 'image/jpeg' or e['w'] < MIN_W or e['w'] < 1.2 * e['h'] or not FREE.match(e['licence']):
                continue
            e['golden'] = bool(GOLDEN.search(t + ' ' + e['desc'])) or any(GOLDEN.search(q) for q in hits[t])
            e['hits'] = len(hits[t])
            cands.append(e)
        cands.sort(key=lambda e: (-e['golden'], -e['hits'], -e['w']))
        cands = cands[:PER_PLACE]
        for n, e in enumerate(cands, 1):
            e['id'] = f'{place}-c{n:02d}'
            fetch(e['thumb'], os.path.join(OUT, 'thumbs', e['id'] + '.jpg'))
            e['file'] = 'thumbs/' + e['id'] + '.jpg'
        result[place] = {'have': picked, 'new': cands}
        print(place, 'have', len(picked), 'search hits', len(hits), 'kept', len(cands))
    json.dump(result, open(os.path.join(OUT, 'candidates.json'), 'w'), indent=1, ensure_ascii=False)


if __name__ == '__main__':
    main()
