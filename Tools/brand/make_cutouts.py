"""Brand round 4 data: real aerial photos cut to each DO outline, and each DO's palette measured from them.

    python3 Tools/brand/make_cutouts.py <main checkout root> [--all]

Imagery: IGN PNOA (the WMS twin of the WMTS the atlas uses, src/map/imagery.ts), credit «PNOA © IGN». Outlines: data/dops.geojson.
Writes mocks/brand-identity-r4/assets/:
  cut/<id>.jpg      aerial photo of the DO's bounding box (1400 px on the long side; 320 px with --all for the rest)
  cutouts.json      per DO: name, kind, image size, outline as an SVG path in image pixels, palette (6 colours, share of the land)
The palette is k-means on the pixels inside the outline, so it is the land's own colour, not a choice.
"""
import colorsys, json, math, os, sys, urllib.request
import numpy as np
from osgeo import gdal, ogr, osr

gdal.UseExceptions()
ROOT = sys.argv[1]
ALL = '--all' in sys.argv
OUT = os.path.join(ROOT, 'mocks/brand-identity-r4/assets')
os.makedirs(os.path.join(OUT, 'cut'), exist_ok=True)
WMS = ('https://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=OI.OrthoimageCoverage&STYLES='
       '&CRS=EPSG:4326&BBOX={s},{w},{n},{e}&WIDTH={W}&HEIGHT={H}&FORMAT=image/jpeg')
SHOW = {'Priorato': 'Priorat', 'Vino de Rioja': 'Rioja', 'Vino Navarra': 'Navarra', 'Jerez-Xeres-Sherry': 'Jerez'}
HERO = ['Rioja', 'Priorat', 'Ribera del Duero', 'Rías Baixas', 'Jerez', 'Ribeira Sacra', 'Bierzo', 'Rueda']


def slug(s):
    return ''.join(c if c.isalnum() else '-' for c in s.lower().replace('í', 'i').replace('á', 'a').replace('é', 'e')
                   .replace('ó', 'o').replace('ú', 'u').replace('ñ', 'n')).strip('-')


def kmeans(px, k=6, it=12):
    rng = np.random.default_rng(1)
    c = px[rng.choice(len(px), k, replace=False)].astype(float)
    for _ in range(it):
        lab = ((px[:, None, :] - c[None]) ** 2).sum(-1).argmin(1)
        for j in range(k):
            if (lab == j).any():
                c[j] = px[lab == j].mean(0)
    share = np.bincount(lab, minlength=k) / len(lab)
    order = np.argsort(-share)
    return [{'hex': hexof(c[j]), 'vivid': vivid(c[j]), 'share': round(float(share[j]), 3)} for j in order]


def hexof(rgb):
    return '#%02X%02X%02X' % tuple(int(round(min(255, max(0, v)))) for v in rgb)


def vivid(rgb):
    """Same hue, saturation raised: aerial colour is hazy, the land itself is brighter. Labelled 'brightened' wherever shown."""
    h, l, s = colorsys.rgb_to_hls(*(v / 255 for v in rgb))
    return hexof([v * 255 for v in colorsys.hls_to_rgb(h, min(.62, max(.32, l)), min(1, s * 2.2 + .12))])


ds = ogr.Open(os.path.join(ROOT, 'data/dops.geojson'))
out = json.load(open(os.path.join(OUT, 'cutouts.json'))) if os.path.exists(os.path.join(OUT, 'cutouts.json')) else {}
for f in ds.GetLayer():
    name = SHOW.get(f.GetField('name'), f.GetField('name'))
    if name not in HERO and not ALL:
        continue
    if name in out and 'vivid' in (out[name]['palette'] or [{}])[0] and os.path.exists(os.path.join(OUT, 'cut', out[name]['id'] + '.jpg')):
        continue
    g = f.GetGeometryRef()
    w, e, s, n = g.GetEnvelope()
    pad = 0.02 * max(e - w, n - s); w -= pad; e += pad; s -= pad; n += pad
    kx = math.cos(math.radians((s + n) / 2))  # keep the photo's shape true at this latitude
    long_side = 1400 if name in HERO else 320
    if (e - w) * kx >= (n - s):
        W = long_side; H = max(1, round(long_side * (n - s) / ((e - w) * kx)))
    else:
        H = long_side; W = max(1, round(long_side * (e - w) * kx / (n - s)))
    sid = slug(name)
    jpg = os.path.join(OUT, 'cut', sid + '.jpg')
    try:
        req = urllib.request.Request(WMS.format(s=s, w=w, n=n, e=e, W=W, H=H), headers={'User-Agent': 'atlaslope-brand-mock'})
        data = urllib.request.urlopen(req, timeout=90).read()
        if data[:2] != b'\xff\xd8':
            print('not a jpeg', name, data[:120]); continue
        open(jpg, 'wb').write(data)
    except Exception as ex:
        print('fetch failed', name, ex); continue

    img = gdal.Open(jpg).ReadAsArray()  # bands, rows, cols
    mem = gdal.GetDriverByName('MEM').Create('', W, H, 1, gdal.GDT_Byte)
    mem.SetGeoTransform((w, (e - w) / W, 0, n, 0, -(n - s) / H))
    srs = osr.SpatialReference(); srs.ImportFromEPSG(4326); srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    mem.SetProjection(srs.ExportToWkt())
    lyr_ds = ogr.GetDriverByName('MEM').CreateDataSource('m'); lyr = lyr_ds.CreateLayer('l', srs)
    ft = ogr.Feature(lyr.GetLayerDefn()); ft.SetGeometry(g.Clone()); lyr.CreateFeature(ft)
    gdal.RasterizeLayer(mem, [1], lyr, burn_values=[1])
    mask = mem.ReadAsArray().astype(bool)
    px = img[:3].reshape(3, -1).T[mask.reshape(-1)]
    px = px[(px.sum(1) > 30) & (px.sum(1) < 740)]  # drop no-data black and blown-out white
    if len(px) > 40000:
        px = px[np.random.default_rng(0).choice(len(px), 40000, replace=False)]

    d = []
    def ring(r):
        pts = [((r.GetX(i) - w) / (e - w) * W, (n - r.GetY(i)) / (n - s) * H) for i in range(r.GetPointCount())]
        d.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + 'Z')
    def walk(gg):
        t = ogr.GT_Flatten(gg.GetGeometryType())
        if t == ogr.wkbPolygon:
            for i in range(gg.GetGeometryCount()): ring(gg.GetGeometryRef(i))
        else:
            for i in range(gg.GetGeometryCount()): walk(gg.GetGeometryRef(i))
    walk(g)
    out[name] = {'id': sid, 'name': name, 'kind': f.GetField('kind'), 'w': W, 'h': H, 'path': ''.join(d),
                 'palette': kmeans(px) if len(px) > 100 else [], 'center': [round((w + e) / 2, 3), round((s + n) / 2, 3)]}
    json.dump(out, open(os.path.join(OUT, 'cutouts.json'), 'w'), ensure_ascii=False)
    print(name, W, H, ' '.join(p['hex'] for p in out[name]['palette']))
print('done', len(out), 'places; credit: Aerial photos: PNOA © IGN · DOP boundaries © MAPA')
