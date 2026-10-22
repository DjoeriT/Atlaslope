"""Brand identity round 1: real map assets for the mock page.

Reads only files listed in data/SOURCES.md (MDT25 Rioja and MDT200 Spain DEMs, rioja-zones, dops, spain-mask)
and writes to the git-ignored mocks/brand-identity-r1/assets/. Nothing is fetched.

    python3 Tools/brand/make_assets.py <main checkout root>

Outputs (all in one frame per map, so layers stack):
  rioja-relief.png, rioja-dem.png (grey elevation, for tinting), rioja.json (contour paths by level, zone paths,
  frame size, place pins); spain-relief.png, spain.json (land, DO outlines, Rioja outline, frame size).
"""
import json, os, subprocess, sys, tempfile
from osgeo import gdal, ogr, osr

gdal.UseExceptions()
ROOT = sys.argv[1]
OUT = os.path.join(ROOT, 'mocks/brand-identity-r1/assets')
os.makedirs(OUT, exist_ok=True)
TMP = tempfile.mkdtemp()

UTM = osr.SpatialReference(); UTM.ImportFromEPSG(25830)
WGS = osr.SpatialReference(); WGS.ImportFromEPSG(4326)
WGS.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
UTM.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
TO_UTM = osr.CoordinateTransformation(WGS, UTM)


def run(*a):
    subprocess.run(a, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def frame(x0, y0, x1, y1, w):
    h = round(w * (y1 - y0) / (x1 - x0))
    return dict(x0=x0, y0=y0, x1=x1, y1=y1, w=w, h=h)


def px(f, x, y):
    return ((x - f['x0']) / (f['x1'] - f['x0']) * f['w'], (f['y1'] - y) / (f['y1'] - f['y0']) * f['h'])


def path_of(geom, f, wgs=True, tol=0.6):
    """SVG path for an OGR geometry; drops points closer than tol px."""
    g = geom.Clone()
    if wgs:
        g.Transform(TO_UTM)
    d = []

    def ring(r, close):
        pts, last = [], None
        for i in range(r.GetPointCount()):
            p = px(f, r.GetX(i), r.GetY(i))
            if last is None or abs(p[0] - last[0]) + abs(p[1] - last[1]) >= tol:
                pts.append(p); last = p
        if len(pts) < 2:
            return
        d.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + ('Z' if close else ''))

    def walk(g):
        t = ogr.GT_Flatten(g.GetGeometryType())
        if t == ogr.wkbLineString:
            ring(g, False)
        elif t == ogr.wkbPolygon:
            for i in range(g.GetGeometryCount()):
                ring(g.GetGeometryRef(i), True)
        else:
            for i in range(g.GetGeometryCount()):
                walk(g.GetGeometryRef(i))
    walk(g)
    return ''.join(d)


def relief(src, f, res, name):
    dem = os.path.join(TMP, name + '-dem.tif')
    run('gdalwarp', '-q', '-overwrite', '-t_srs', 'EPSG:25830', '-te', str(f['x0']), str(f['y0']), str(f['x1']), str(f['y1']),
        '-ts', str(f['w']), str(f['h']), '-r', 'average', src, dem)
    hs = os.path.join(TMP, name + '-hs.tif')
    run('gdaldem', 'hillshade', '-q', '-multidirectional', '-z', str(res), '-compute_edges', dem, hs)
    run('gdal_translate', '-q', '-of', 'PNG', hs, os.path.join(OUT, name + '-relief.png'))
    run('gdal_translate', '-q', '-of', 'PNG', '-ot', 'Byte', '-scale', '0', '1600', '0', '255', dem, os.path.join(OUT, name + '-dem.png'))
    return dem


# Rioja: the DOCa and its three zones, with margin, 1800 px wide
zones_ds = ogr.Open(os.path.join(ROOT, 'data/rioja-zones.geojson'))
zones = zones_ds.GetLayer()
env = None
zone_geoms = []
for feat in zones:
    g = feat.GetGeometryRef().Clone()
    zone_geoms.append((feat.GetField('zone'), g))
    u = g.Clone(); u.Transform(TO_UTM)
    e = u.GetEnvelope()
    env = e if env is None else (min(env[0], e[0]), max(env[1], e[1]), min(env[2], e[2]), max(env[3], e[3]))
mx = 6000
# MDT25 coverage ends at y 4640000 and x 625000: keep the frame inside it
R = frame(max(env[0] - mx, 486000), max(env[2] - mx, 4641000), min(env[1] + mx, 624000), env[3] + mx, 1800)
rdem = relief(os.path.join(ROOT, 'data/raw/dem/mdt25_rioja.vrt'), R, 1, 'rioja')

cont = os.path.join(TMP, 'contours.geojson')
smooth = os.path.join(TMP, 'rioja-smooth.tif')
run('gdalwarp', '-q', '-overwrite', '-tr', '150', '150', '-r', 'cubicspline', rdem, smooth)
run('gdal_contour', '-q', '-a', 'elev', '-i', '50', '-f', 'GeoJSON', smooth, cont)
levels = {}
cont_ds = ogr.Open(cont)
for feat in cont_ds.GetLayer():
    e = int(round(feat.GetField('elev')))
    if e < 300:  # the Ebro leaves Rioja at about 280 m; lower rings are edge artefacts
        continue
    p = path_of(feat.GetGeometryRef(), R, wgs=False, tol=1.2)
    if p:
        levels.setdefault(e, []).append(p)

pins = {'Haro': (-2.847, 42.577), 'Logroño': (-2.445, 42.465), 'Laguardia': (-2.585, 42.553), 'Alfaro': (-1.750, 42.178),
        'Nájera': (-2.729, 42.416), 'Calahorra': (-1.966, 42.305)}
rioja = dict(
    frame=dict(w=R['w'], h=R['h'], epsg=25830, bounds=[R['x0'], R['y0'], R['x1'], R['y1']]),
    contours={str(k): ''.join(v) for k, v in sorted(levels.items())},
    zones={n: path_of(g, R) for n, g in zone_geoms},
    pins={n: [round(c, 1) for c in px(R, *TO_UTM.TransformPoint(lon, lat)[:2])] for n, (lon, lat) in pins.items()},
    credit='Relief and contours: MDT25 CC-BY 4.0 scne.es · Zones: Pliego de condiciones DOCa Rioja (MAPA)',
)
json.dump(rioja, open(os.path.join(OUT, 'rioja.json'), 'w'))

# Spain: mainland and Balearics, 1600 px wide
S = frame(-20000, 3980000, 1140000, 4865900, 1600)
relief(os.path.join(ROOT, 'data/raw/dem/mdt200_spain.vrt'), S, 5, 'spain')  # 725 m pixels: exaggerate so the relief reads
mask = json.load(open(os.path.join(ROOT, 'data/spain-mask.json')))
land = ogr.CreateGeometryFromJson(json.dumps({'type': 'MultiPolygon', 'coordinates': mask['land']}))
dops_ds = ogr.Open(os.path.join(ROOT, 'data/dops.geojson'))
dops = dops_ds.GetLayer()
do_paths = {}
for feat in dops:
    p = path_of(feat.GetGeometryRef(), S, tol=1.0)
    if p:
        do_paths[feat.GetField('name')] = p
spain = dict(
    frame=dict(w=S['w'], h=S['h'], epsg=25830, bounds=[S['x0'], S['y0'], S['x1'], S['y1']]),
    land=path_of(land, S, tol=1.0),
    neighbours=''.join(path_of(ogr.CreateGeometryFromJson(json.dumps({'type': 'Polygon', 'coordinates': n})), S, tol=1.0) for n in mask['neighbours']),
    dops=do_paths,
    rioja=do_paths.get('Vino de Rioja', ''),
    credit='Relief: MDT200 CC-BY 4.0 scne.es · DOP boundaries © MAPA',
)
json.dump(spain, open(os.path.join(OUT, 'spain.json'), 'w'))
print('rioja', R['w'], R['h'], 'levels', len(levels), 'zones', list(rioja['zones']), 'spain', S['w'], S['h'], 'dops', len(do_paths),
      'rioja-do', bool(spain['rioja']))
