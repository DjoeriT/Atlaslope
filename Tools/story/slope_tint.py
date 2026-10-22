"""Slope tint for the "Read with the map" story (build card 4, 21 Oct 2026), from the mock's Review/mock-story-guide-v3/tint.py.
Mapzen Terrarium tiles (zoom 12) -> semi-transparent PNG where slope > 30%.
Usage: python3 -I Tools/story/slope_tint.py [terrarium-cache-dir]   (default <repo>/.cache/terrarium, git-ignored; tiles not in the
cache are fetched from Mapzen, see data/SOURCES.md "Story data"). Writes data/story/slope-<id>.png and data/story/slope-tints.json.
Pure standard library (no PIL/numpy)."""
import array, base64, math, struct, time, urllib.request, zlib

Z = 12
URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'


def tile_of(lon, lat, z=Z):
    n = 2 ** z
    x = int((lon + 180) / 360 * n)
    y = int((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)
    return x, y


def lonlat_of(x, y, z=Z):
    n = 2 ** z
    return x / n * 360 - 180, math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))


def fetch(cache, z, x, y):
    f = cache / f'{z}-{x}-{y}.png'
    if not f.exists():
        req = urllib.request.Request(URL.format(z=z, x=x, y=y), headers={'User-Agent': 'atlaslope-story/1.0'})
        for attempt in range(3):
            try:
                f.write_bytes(urllib.request.urlopen(req, timeout=30).read()); break
            except Exception:
                if attempt == 2: raise
                time.sleep(1.5)
    return f.read_bytes()


def decode(data):
    """PNG (8-bit RGB or RGBA, non-interlaced) -> list of rows of RGB bytes."""
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
    pos, idat = 8, b''
    while pos < len(data):
        ln, typ = struct.unpack('>I4s', data[pos:pos + 8])
        body = data[pos + 8:pos + 8 + ln]
        if typ == b'IHDR': w, h, bd, ct, _, _, il = struct.unpack('>IIBBBBB', body)
        elif typ == b'IDAT': idat += body
        pos += 12 + ln
    assert bd == 8 and ct in (2, 6) and il == 0, (bd, ct, il)
    bpp = 3 if ct == 2 else 4
    raw = zlib.decompress(idat)
    stride = w * bpp
    rows, prev = [], bytearray(stride)
    for r in range(h):
        ft = raw[r * (stride + 1)]
        cur = bytearray(raw[r * (stride + 1) + 1:(r + 1) * (stride + 1)])
        if ft == 1:
            for i in range(bpp, stride): cur[i] = (cur[i] + cur[i - bpp]) & 255
        elif ft == 2:
            for i in range(stride): cur[i] = (cur[i] + prev[i]) & 255
        elif ft == 3:
            for i in range(stride): cur[i] = (cur[i] + (((cur[i - bpp] if i >= bpp else 0) + prev[i]) >> 1)) & 255
        elif ft == 4:
            for i in range(stride):
                a = cur[i - bpp] if i >= bpp else 0; b = prev[i]; c = prev[i - bpp] if i >= bpp else 0
                p = a + b - c; pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                cur[i] = (cur[i] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        rows.append(cur); prev = cur
    if bpp == 4:
        return [bytes(v for i, v in enumerate(r) if i % 4 < 3) for r in rows]
    return [bytes(r) for r in rows]


def png_indexed(w, h, rows, colour, alphas):
    """Palette PNG: index i has the colour and alpha alphas[i] (small file)."""
    def chunk(t, b): return struct.pack('>I', len(b)) + t + b + struct.pack('>I', zlib.crc32(t + b) & 0xffffffff)
    raw = b''.join(b'\x00' + r for r in rows)
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 3, 0, 0, 0))
            + chunk(b'PLTE', bytes(colour) * len(alphas)) + chunk(b'tRNS', bytes(alphas))
            + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))


def slope_overlay(cache, bbox, pad, colour, alpha, threshold=30.0):
    """Returns (data-url, [[lon,lat] x4 corners tl,tr,br,bl], stats)."""
    cache.mkdir(parents=True, exist_ok=True)
    x0, y1 = tile_of(bbox[0] - pad, bbox[1] - pad)
    x1, y0 = tile_of(bbox[2] + pad, bbox[3] + pad)
    W, H = (x1 - x0 + 1) * 256, (y1 - y0 + 1) * 256
    elev = [array.array('f', bytes(4 * W)) for _ in range(H)]
    for ty in range(y0, y1 + 1):
        for tx in range(x0, x1 + 1):
            rows = decode(fetch(cache, Z, tx, ty))
            for r in range(256):
                row, o, line = elev[(ty - y0) * 256 + r], (tx - x0) * 256, rows[r]
                for c in range(256):
                    row[o + c] = line[3 * c] * 256 + line[3 * c + 1] + line[3 * c + 2] / 256 - 32768
    mpp0 = 40075016.686 / (256 * 2 ** Z)
    out, steep, total = [], 0, 0
    LEV = 6
    for r in range(H):
        _, lat = lonlat_of(x0, y0 + r / 256)
        px = mpp0 * math.cos(math.radians(lat))
        up, dn, cur = elev[max(r - 1, 0)], elev[min(r + 1, H - 1)], elev[r]
        line = bytearray(W)
        for c in range(1, W - 1):
            dx = (cur[c + 1] - cur[c - 1]) / (2 * px); dy = (dn[c] - up[c]) / (2 * px)
            s = 100 * math.hypot(dx, dy)
            total += 1
            if s > threshold - 3:
                k = min(1.0, (s - (threshold - 3)) / 6)  # soft edge between 27% and 33%
                if s > threshold: steep += 1
                line[c] = max(1, round(k * LEV))
        out.append(bytes(line))
    tl, br = lonlat_of(x0, y0), lonlat_of(x1 + 1, y1 + 1)
    corners = [[tl[0], tl[1]], [br[0], tl[1]], [br[0], br[1]], [tl[0], br[1]]]
    url = 'data:image/png;base64,' + base64.b64encode(png_indexed(W, H, out, colour, [round(alpha * i / LEV) for i in range(LEV + 1)])).decode()
    return url, corners, {'tiles': (x1 - x0 + 1) * (y1 - y0 + 1), 'px': f'{W}x{H}', 'steep_share': round(steep / total, 3), 'kb': len(url) // 1365}


# Fetch boxes of data/story (lon/lat); padded 0.06 degrees so every stop lies inside the overlay.
BOUNDS = {'rioja': [-3.15, 42.05, -1.65, 42.70], 'priorat': [0.65, 41.05, 1.00, 41.35]}
BOUNDS['ribeira-sacra'] = [-7.95, 42.20, -7.05, 42.90]  # as fetch_layers.py
BOUNDS['ribera-del-duero'] = [-4.5, 41.35, -2.85, 41.95]
BOUNDS['navarra'] = [-2.65, 41.90, -1.35, 42.90]  # as fetch_layers.py
TINT_RGB, TINT_ALPHA = (140, 35, 64), 33  # #8C2340 at about 13% at most; soft edge between 27% and 33% slope

if __name__ == '__main__':
    import json, pathlib, sys
    root = pathlib.Path(__file__).resolve().parents[2]
    cache = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else root / '.cache/terrarium'
    import os
    only = os.environ.get('STORY_ONLY')  # e.g. STORY_ONLY=ribera-del-duero: tint just that guide, keep the other entries
    out = json.loads((root / 'data/story/slope-tints.json').read_text()) if only else {}
    for gid, box in BOUNDS.items():
        if only and gid not in only.split(','):
            continue
        url, corners, st = slope_overlay(cache, box, 0.06, TINT_RGB, TINT_ALPHA)
        (root / f'data/story/slope-{gid}.png').write_bytes(base64.b64decode(url.split(',', 1)[1]))
        out[gid] = {'coordinates': corners, 'steepShare': st['steep_share']}
        print(gid, st)
    (root / 'data/story/slope-tints.json').write_text(json.dumps(out, indent=1) + '\n')
