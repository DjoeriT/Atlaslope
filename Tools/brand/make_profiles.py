"""Brand round 3: real terrain profiles (the "slope line") from the IGN DEMs. Nothing is fetched.

    python3 Tools/brand/make_profiles.py <main checkout root>

Writes mocks/brand-identity-r3/assets/profiles.json:
  spain:  Atlantic to Mediterranean through Rías Baixas, Rioja and Priorat (MDT200), with the DOs it crosses
  rioja:  north to south through Rioja (MDT25): Sierra de Cantabria, Laguardia, the Ebro, Rioja Alta, the Demanda front
  places: a short west-east line through the middle of a few DOs (MDT200), each place's own "fingerprint"
Every profile is {points: [[km, m], ...], marks: [{km, label}], spans: [{from, to, label}], line: [[lon, lat], ...]}.
"""
import json, math, os, sys
from osgeo import gdal, ogr, osr

gdal.UseExceptions()
ROOT = sys.argv[1]
OUT = os.path.join(ROOT, 'mocks/brand-identity-r3/assets')
os.makedirs(OUT, exist_ok=True)

WGS = osr.SpatialReference(); WGS.ImportFromEPSG(4326); WGS.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
UTM = osr.SpatialReference(); UTM.ImportFromEPSG(25830); UTM.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
TO_UTM = osr.CoordinateTransformation(WGS, UTM)


class Dem:
    def __init__(self, path):
        self.ds = gdal.Open(path)
        self.band = self.ds.GetRasterBand(1)
        self.gt = self.ds.GetGeoTransform()
        self.nodata = self.band.GetNoDataValue()
        self.arr = self.band.ReadAsArray()

    def at(self, x, y):
        c = int((x - self.gt[0]) / self.gt[1]); r = int((y - self.gt[3]) / self.gt[5])
        if not (0 <= r < self.arr.shape[0] and 0 <= c < self.arr.shape[1]):
            return None
        v = float(self.arr[r, c])
        return None if (self.nodata is not None and v == self.nodata) or v < -100 else v


dops_ds = ogr.Open(os.path.join(ROOT, 'data/dops.geojson'))
# Names as users see them; the smallest containing DO wins where DOs overlap (Priorat inside Cataluña)
SHOW = {'Priorato': 'Priorat', 'Vino de Rioja': 'Rioja', 'Vino Navarra': 'Navarra', 'Jerez-Xeres-Sherry': 'Jerez'}
DOPS = sorted(((SHOW.get(f.GetField('name'), f.GetField('name')), f.GetGeometryRef().Clone()) for f in dops_ds.GetLayer()),
              key=lambda d: d[1].GetArea())
zones_ds = ogr.Open(os.path.join(ROOT, 'data/rioja-zones.geojson'))
ZONES = [(f.GetField('zone'), f.GetGeometryRef().Clone()) for f in zones_ds.GetLayer()]


def profile(dem, waypoints, step_m, polys=(), marks=()):
    """Sample the DEM along straight legs between (lon, lat) waypoints every step_m metres."""
    pts, line, spans = [], [], []
    utm = [TO_UTM.TransformPoint(lon, lat)[:2] for lon, lat in waypoints]
    back = osr.CoordinateTransformation(UTM, WGS)
    km = 0.0
    cur = None
    for (x0, y0), (x1, y1) in zip(utm, utm[1:]):
        d = math.hypot(x1 - x0, y1 - y0); n = max(1, int(d / step_m))
        for i in range(n):
            t = i / n; x = x0 + (x1 - x0) * t; y = y0 + (y1 - y0) * t
            v = dem.at(x, y)
            lon, lat = back.TransformPoint(x, y)[:2]
            k = km + d * t / 1000
            pts.append([round(k, 2), None if v is None else round(max(v, 0))])
            if i % 5 == 0:
                line.append([round(lon, 4), round(lat, 4)])
            if polys:
                p = ogr.Geometry(ogr.wkbPoint); p.AddPoint_2D(lon, lat)
                name = next((nm for nm, g in polys if g.Contains(p)), None)
                if name != (cur and cur['label']):
                    if cur: cur['to'] = round(k, 2); spans.append(cur)
                    cur = {'from': round(k, 2), 'label': name} if name else None
        km += d / 1000
    if cur: cur['to'] = round(km, 2); spans.append(cur)
    out_marks = []
    for label, (lon, lat) in marks:
        x, y = TO_UTM.TransformPoint(lon, lat)[:2]
        # nearest point on the line, as km along it
        best_d, best_k = 1e18, 0
        k_acc = 0.0
        for (ax, ay), (bx, by) in zip(utm, utm[1:]):
            L = math.hypot(bx - ax, by - ay)
            t = max(0, min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / (L * L)))
            px, py = ax + (bx - ax) * t, ay + (by - ay) * t
            dd = math.hypot(x - px, y - py)
            if dd < best_d: best_d, best_k = dd, k_acc + L * t / 1000
            k_acc += L / 1000
        out_marks.append({'km': round(best_k, 2), 'label': label, 'off_km': round(best_d / 1000, 1)})
    return {'points': pts, 'marks': out_marks, 'spans': [s for s in spans if s['to'] - s['from'] >= 2], 'line': line,
            'length_km': round(km, 1)}


d200 = Dem(os.path.join(ROOT, 'data/raw/dem/mdt200_spain.vrt'))
d25 = Dem(os.path.join(ROOT, 'data/raw/dem/mdt25_rioja.vrt'))

spain = profile(d200, [(-8.95, 42.42), (-2.85, 42.58), (0.80, 41.20), (1.25, 41.05)], 1000, DOPS,
                [('Atlantic', (-8.95, 42.42)), ('Haro', (-2.85, 42.58)), ('Priorat', (0.80, 41.20)), ('Mediterranean', (1.25, 41.05))])
rioja = profile(d25, [(-2.60, 42.66), (-2.585, 42.553), (-2.53, 42.47), (-2.75, 42.21)], 100, ZONES,
                [('Sierra de Cantabria', (-2.60, 42.66)), ('Laguardia', (-2.585, 42.553)), ('Ebro', (-2.53, 42.47))])

places = {}
for name in ['Priorat', 'Ribera del Duero', 'Rías Baixas', 'Jerez', 'Rioja', 'Ribeira Sacra', 'Bierzo', 'Rueda']:
    g = next((gg for nm, gg in DOPS if nm == name), None)
    if g is None:
        continue
    minx, maxx, miny, maxy = g.GetEnvelope()
    c = g.Centroid()
    places[name] = profile(d200, [(minx, c.GetY()), (maxx, c.GetY())], 400)
    places[name]['note'] = 'West to east through the middle of the DO'

json.dump({'spain': spain, 'rioja': rioja, 'places': places,
           'credit': 'Profiles: MDT25 and MDT200 CC-BY 4.0 scne.es · DOP boundaries © MAPA · Zones: Pliego de condiciones DOCa Rioja (MAPA)'},
          open(os.path.join(OUT, 'profiles.json'), 'w'), ensure_ascii=False)
els = lambda p: [v for _, v in p['points'] if v is not None]
print('spain', spain['length_km'], 'km, max', max(els(spain)), 'spans', [s['label'] for s in spain['spans']])
print('rioja', rioja['length_km'], 'km, range', min(els(rioja)), max(els(rioja)), 'spans', [(s['label'], s['from'], s['to']) for s in rioja['spans']], rioja['marks'])
print('places', {k: (v['length_km'], min(els(v)) if els(v) else None, max(els(v)) if els(v) else None) for k, v in places.items()})
