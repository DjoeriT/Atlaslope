#!/usr/bin/env python3
"""Smaller copies and blur previews of the shipped photos (polish pack, 18 Oct 2026).

Reads public/photos/<key>.webp (the 1200 px files photo_ship.py makes) and writes, per photo:
- public/photos/<w>/<key>.webp for w in SIZES (width in px; skipped when the photo is not wider), so a small slot loads a small file;
- an entry in data/photo-sizes.json: the full file's width and height, and a 16 px wide WebP as base64 that the app blurs while the photo loads.
No network. Rerun after the photo workflow changes public/photos/; the unit test photo-sizes.test.ts fails while any copy is missing.
"""
import base64
import io
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
PHOTOS = ROOT / "public/photos"
OUT = ROOT / "data/photo-sizes.json"
SIZES = (160, 480, 800)


def main():
    keys = sorted(p.stem for p in PHOTOS.glob("*.webp"))
    doc = {"$comment": "Made by Tools/data/photo_sizes.py from public/photos/*.webp: full width and height, and a 16 px blur preview (WebP, base64). See data/SOURCES.md.", "sizes": list(SIZES), "photos": {}}
    for key in keys:
        img = Image.open(PHOTOS / f"{key}.webp").convert("RGB")
        w, h = img.size
        for s in SIZES:
            target = PHOTOS / str(s) / f"{key}.webp"
            if s >= w:
                target.unlink(missing_ok=True)
                continue
            target.parent.mkdir(exist_ok=True)
            small = img.resize((s, round(h * s / w)), Image.LANCZOS)
            small.save(target, "WEBP", quality=70, method=6)
        tiny = img.resize((16, max(1, round(h * 16 / w))), Image.LANCZOS)
        buf = io.BytesIO()
        tiny.save(buf, "WEBP", quality=50, method=6)
        doc["photos"][key] = {"w": w, "h": h, "blur": base64.b64encode(buf.getvalue()).decode()}
    for s in SIZES:  # copies of photos that are gone
        for p in (PHOTOS / str(s)).glob("*.webp"):
            if p.stem not in doc["photos"]:
                p.unlink()
    OUT.write_text(json.dumps(doc, indent=1) + "\n")
    print(len(keys), "photos")


if __name__ == "__main__":
    sys.exit(main())
