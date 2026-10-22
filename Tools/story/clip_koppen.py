#!/usr/bin/env python3 -I
"""Clip data/koppen-spain.geojson (main box only) to each story's box plus a margin, for stories whose steps use the `koppen` layer.
Output: data/story/koppen-<story id>.geojson (the story loads it by name; see src/story/files.ts). Usage: python3 -I Tools/story/clip_koppen.py
Boxes are the story boxes of fetch_layers.py (lon/lat); polygons are cut with Sutherland-Hodgman (rings stay closed, holes kept)."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BBOX = {"rioja": (-3.15, 42.05, -1.65, 42.70), "priorat": (0.65, 41.05, 1.00, 41.35)}  # same as fetch_layers.py
BBOX["ribeira-sacra"] = (-7.95, 42.20, -7.05, 42.90)  # as fetch_layers.py
BBOX["ribera-del-duero"] = (-4.5, 41.35, -2.85, 41.95)
BBOX["txakoli-getaria"] = (-2.40, 43.18, -1.85, 43.42)  # as fetch_layers.py
BBOX["txakoli-bizkaia"] = (-3.20, 43.05, -2.40, 43.50)
BBOX["txakoli-alava"] = (-3.30, 42.95, -2.80, 43.25)
BBOX["cangas"] = (-7.05, 42.85, -6.25, 43.50)  # as fetch_layers.py
BBOX["valdeorras"] = (-7.30, 42.15, -6.65, 42.60)
BBOX["monterrei"] = (-7.70, 41.75, -7.10, 42.15)
MARGIN = 0.4  # 0.2 left bare bands at the top and bottom of a 1400x850 view


def clip_ring(ring, box):
    x0, y0, x1, y1 = box
    pts = ring[:-1]
    for axis, lim, keep_ge in ((0, x0, True), (0, x1, False), (1, y0, True), (1, y1, False)):
        if not pts:
            break
        inside = (lambda p: p[axis] >= lim) if keep_ge else (lambda p: p[axis] <= lim)
        out = []
        for i, p in enumerate(pts):
            q = pts[i - 1]
            if inside(p) != inside(q):
                t = (lim - q[axis]) / (p[axis] - q[axis])
                out.append([lim, q[1] + t * (p[1] - q[1])] if axis == 0 else [q[0] + t * (p[0] - q[0]), lim])
            if inside(p):
                out.append(p)
        pts = out
    return pts + [pts[0]] if len(pts) >= 3 else None


def clip_polygon(poly, box):
    outer = clip_ring(poly[0], box)
    if not outer:
        return None
    return [outer] + [r for r in (clip_ring(h, box) for h in poly[1:]) if r]


def main():
    src = json.load(open(os.path.join(ROOT, "data/koppen-spain.geojson")))
    for sid in sorted(f[:-5] for f in os.listdir(os.path.join(ROOT, "content/stories")) if f.endswith(".json")):
        story = json.load(open(os.path.join(ROOT, "content/stories/%s.json" % sid)))
        if not any("koppen" in (s.get("layers") or []) for s in story["steps"]):
            continue
        b = BBOX[sid]
        box = (b[0] - MARGIN, b[1] - MARGIN, b[2] + MARGIN, b[3] + MARGIN)
        feats = []
        for f in src["features"]:
            if f["properties"].get("box") != "main":
                continue
            g = f["geometry"]
            polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
            cut = [c for c in (clip_polygon(p, box) for p in polys) if c]
            if cut:
                feats.append({"type": "Feature", "properties": f["properties"], "geometry": {"type": "MultiPolygon", "coordinates": cut}})
        path = os.path.join(ROOT, "data/story/koppen-%s.geojson" % sid)
        json.dump({"type": "FeatureCollection", "features": feats}, open(path, "w"), separators=(",", ":"))
        print("%s: %d classes, %d bytes" % (sid, len(feats), os.path.getsize(path)))


if __name__ == "__main__":
    main()
