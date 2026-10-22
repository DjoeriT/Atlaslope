"""Build data/spain-mask.json: where the map uses IGN's PNOA photo instead of Esri.

Input: Natural Earth 10 m admin 0 countries, v5.1.2 (data/raw/ne/ne_10m_admin_0_countries.geojson, see data/SOURCES.md).
Output: Spain's polygons ('spain') and the neighbours' land near Spain ('neighbours'), simplified to about 200 m,
3 decimals. The app fills Spain plus a strip of sea, then cuts the neighbours out (src/map/imagery.ts).

Run: python3 Tools/data/build_spain_mask.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'data/raw/ne/ne_10m_admin_0_countries.geojson'
# Per country: its Natural Earth code, the box its polygons must touch, and the neighbours' land near it. Only that land matters
# (the strip of sea around the country must not spill onto it), so each neighbour is clipped to a box.
COUNTRIES = {
    'spain': {'code': 'ESP', 'out': 'data/spain-mask.json',
              'box': (-19.0, 27.0, 5.5, 44.5),  # Spain with the Canaries, and a margin
              'neighbours': {'PRT': (-10.0, 36.5, -6.0, 42.5), 'FRA': (-2.0, 42.0, 3.6, 43.6), 'AND': (1.3, 42.3, 1.9, 42.7),
                             'MAR': (-6.5, 34.8, -2.0, 36.2), 'GIB': (-5.5, 36.0, -5.2, 36.3)}},
    'portugal': {'code': 'PRT', 'out': 'data/countries/pt/mask.json',
                 'box': (-10.0, 36.5, -6.0, 42.5),  # the mainland; Madeira and the Azores come after it (decision #51 notes)
                 'neighbours': {'ESP': (-9.5, 36.5, -5.5, 43.0)}},
}
TOLERANCE = 0.002  # degrees, about 200 m


def simplify(points, tol):
    """Douglas-Peucker on an open or closed ring."""
    if len(points) < 4:
        return points
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        a, b = stack.pop()
        ax, ay = points[a]
        bx, by = points[b]
        dx, dy = bx - ax, by - ay
        norm = (dx * dx + dy * dy) ** 0.5
        best, at = -1.0, -1
        for i in range(a + 1, b):
            px, py = points[i]
            d = abs(dy * px - dx * py + bx * ay - by * ax) / norm if norm else ((px - ax) ** 2 + (py - ay) ** 2) ** 0.5
            if d > best:
                best, at = d, i
        if best > tol:
            keep[at] = True
            stack += [(a, at), (at, b)]
    return [p for p, k in zip(points, keep) if k]


def clip(ring, box):
    """Sutherland-Hodgman: the part of a polygon ring inside an axis-aligned box."""
    x0, y0, x1, y1 = box
    edges = [(lambda p: p[0] >= x0, lambda a, b: (x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0]))),
             (lambda p: p[0] <= x1, lambda a, b: (x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0]))),
             (lambda p: p[1] >= y0, lambda a, b: (a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0)),
             (lambda p: p[1] <= y1, lambda a, b: (a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1))]
    out = [tuple(p) for p in ring[:-1]]
    for inside, cross in edges:
        pts, out = out, []
        for i, cur in enumerate(pts):
            prev = pts[i - 1]
            if inside(cur):
                if not inside(prev):
                    out.append(cross(prev, cur))
                out.append(cur)
            elif inside(prev):
                out.append(cross(prev, cur))
        if not out:
            return []
    return out + [out[0]]


def in_box(ring, box):
    xs = [p[0] for p in ring]
    ys = [p[1] for p in ring]
    return max(xs) >= box[0] and min(xs) <= box[2] and max(ys) >= box[1] and min(ys) <= box[3]


def polygons(geom):
    return geom['coordinates'] if geom['type'] == 'MultiPolygon' else [geom['coordinates']]


def clean(poly):
    rings = []
    for ring in poly:
        r = simplify(ring, TOLERANCE)
        if len(r) >= 4:
            rings.append([[round(x, 3), round(y, 3)] for x, y in r])
    return rings


def build(data, cfg):
    own, near = cfg['code'], cfg['neighbours']
    land, neighbours = [], []
    for f in data['features']:
        code = f['properties']['ADM0_A3']
        if code != own and code not in near:
            continue
        for poly in polygons(f['geometry']):
            if not in_box(poly[0], cfg['box']):
                continue
            if code != own:
                poly = [r for r in (clip(ring, near[code]) for ring in poly) if len(r) >= 4]
                if not poly:
                    continue
            rings = clean(poly)
            if rings:
                (land if code == own else neighbours).append(rings)
    out = ROOT / cfg['out']
    out.write_text(json.dumps({'land': land, 'neighbours': neighbours}, separators=(',', ':')) + '\n')
    n = lambda ps: sum(len(r) for p in ps for r in p)
    print(f'land: {len(land)} polygons, {n(land)} points; neighbours: {len(neighbours)} polygons, {n(neighbours)} points')
    print(f'{out.relative_to(ROOT)}: {out.stat().st_size} bytes')


def main():
    data = json.loads(SRC.read_text())
    for cfg in COUNTRIES.values():
        build(data, cfg)


if __name__ == '__main__':
    main()
