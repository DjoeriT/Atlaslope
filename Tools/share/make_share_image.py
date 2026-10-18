"""Build the link-preview image (public/share.jpg, 1200x630) shown when atlaslope.com is pasted into a chat or a post.

Website slice 2 (18 Oct 2026): the home page's look, Salon book in black and champagne. The tagline on white on the left, the atlas on
satellite (the home page's hero, public/home/hero.webp) on the right. Writes an HTML page of the card and renders it with Playwright's Chromium:
  python3 Tools/share/make_share_image.py && npx playwright screenshot --viewport-size=1200,630 \
    file://$PWD/Tools/share/share.html /tmp/share.png && python3 -c "from PIL import Image; \
    Image.open('/tmp/share.png').convert('RGB').save('public/share.jpg', quality=84, optimize=True, progressive=True)"
JPEG, not PNG: the satellite makes a 700 KB PNG, and chat apps skip preview images that large (code review, website slice 2).
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
W, H = 1200, 630
BAND, FOIL, INK, INK2, INK3 = '#141414', '#E9D8B4', '#1A1714', '#46403A', '#6F6860'

# The app's own mark (BrandMark in src/app/TopBar.tsx): a champagne tile, the black hill, champagne rows.
logo = (
    '<svg width="52" height="52" viewBox="0 0 64 64"><defs><clipPath id="t"><rect width="64" height="64" rx="14"/></clipPath>'
    '<clipPath id="h"><path d="M-2 52 C 14 50 30 40 44 26 C 50 20 56 17 66 16 L66 66 L-2 66 Z"/></clipPath></defs>'
    f'<g clip-path="url(#t)"><rect width="64" height="64" fill="{FOIL}"/><g clip-path="url(#h)"><rect width="64" height="64" fill="{BAND}"/>'
    f'<g fill="none" stroke="{FOIL}" stroke-width="3.6" stroke-linecap="round"><path d="M8 66 L20 49"/><path d="M22 66 L31 40.5"/>'
    '<path d="M36 66 L41 30.5"/><path d="M50 66 L51 22.5"/><path d="M64 66 L61 17"/></g></g></g></svg>'
)

html = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family: Newsreader; src: url('../../public/fonts/newsreader-latin-opsz-normal.woff2'); font-weight: 200 800; }}
@font-face {{ font-family: 'IBM Plex Sans'; src: url('../../public/fonts/ibm-plex-sans-latin-400-normal.woff2'); font-weight: 400; }}
@font-face {{ font-family: 'IBM Plex Sans'; src: url('../../public/fonts/ibm-plex-sans-latin-500-normal.woff2'); font-weight: 500; }}
html, body {{ margin: 0; width: {W}px; height: {H}px; overflow: hidden; background: #fff; font-optical-sizing: auto; }}
.band {{ position: absolute; left: 0; right: 0; top: 0; height: 12px; background: {BAND}; border-bottom: 2px solid {FOIL}; }}
.text {{ position: absolute; left: 64px; top: 14px; bottom: 0; width: 470px; display: flex; flex-direction: column; justify-content: center; }}
.brand {{ display: flex; align-items: center; gap: 14px; font: 500 34px/1 Newsreader, serif; color: {INK}; }}
h1 {{ font: 300 74px/1 Newsreader, serif; letter-spacing: -2px; color: {INK}; margin: 40px 0 26px; }}
.tag {{ font: 400 24px/1.35 Newsreader, serif; color: {INK2}; }}
.map {{ position: absolute; left: 590px; right: 0; top: 14px; bottom: 0; background: url('../../public/home/hero.webp') 40% 60% / cover; }}
.credit {{ position: absolute; right: 14px; bottom: 12px; font: 400 13px/1 'IBM Plex Sans', sans-serif; color: #fff;
  background: rgba(20,20,20,.8); padding: 6px 9px; border-radius: 4px; }}
</style></head><body>
<div class="band"></div>
<div class="map"><div class="credit">Imagery: Esri, Maxar · Spain: PNOA © IGN</div></div>
<div class="text"><div class="brand">{logo}AtlaSlope</div><h1>Know the land behind the glass.</h1>
<div class="tag">The wine study atlas for WSET and<br>Wine Scholar students</div></div>
</body></html>"""
(ROOT / 'Tools/share/share.html').write_text(html)
print('wrote Tools/share/share.html')
