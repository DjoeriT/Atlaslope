# Website home mock v4 (18 Oct 2026): Salon book with the map as hero (owner card 11:39Z), after the first-principles review
# (/mnt/project-files/atlaslope/reviews/2026-10-18-home-mock-review.md). Screens are from the current build (release 20).
# Run: python3 gen.py <repo> <screens dir> <photos dir>  -> index.html. Screens: hero, hero-wide, guide, study (PNG, from a
# Playwright run of the current build with VITE_ESRI_API_KEY=mock); photos: rioja-alta-1.jpg from Wikimedia Commons.
import base64, io, sys, pathlib
from PIL import Image
repo, shots, hires = (pathlib.Path(a) for a in sys.argv[1:4])
here = pathlib.Path(__file__).parent
def enc(im, w, q=82):
    im = im.convert('RGB'); im.thumbnail((w, 10000)); buf = io.BytesIO(); im.save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()
font = lambda f: "data:font/woff2;base64," + base64.b64encode((repo / f'public/fonts/{f}').read_bytes()).decode()
sh = lambda n: Image.open(shots / f'{n}.png')
imgs = {
  'i-hero': enc(sh('hero').crop((0, 120, 1600, 1000)), 2200, 84),
  'i-wide': enc(sh('hero-wide').crop((300, 150, 1600, 1000)), 1100, 84),
  'i-guide': enc(sh('guide').crop((0, 60, 980, 900)), 1100, 86),
  'i-study': enc(sh('study').crop((0, 60, 1100, 900)), 1100, 86),
  'i-alta': enc(Image.open(hires / 'rioja-alta-1.jpg'), 1400),
}
v3 = here / 'logos'
def logo_png(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True); return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
strip = Image.open(v3 / 'ign-logo.png').convert('RGBA'); px = strip.load()
for y in range(strip.size[1]):
    for x in range(strip.size[0]):
        r, g_, b, a = px[x, y]
        if r > 200 and g_ > 170 and b < 120: px[x, y] = (255, 255, 255, 0)
logos = {'l-gob': logo_png(strip.crop((0, 0, 112, 60))), 'l-ign': logo_png(strip.crop((205, 0, 300, 60)))}
vars_css = ':root{' + ''.join(f'--{k}:url({v});' for k, v in imgs.items()) + '}'
html = (here / 'template.html').read_text().replace('/*{{images}}*/', vars_css).replace('{{f-news}}', font('newsreader-latin-opsz-normal.woff2'))
for w in ('400', '500', '600'): html = html.replace('{{f-plex-' + w + '}}', font(f'ibm-plex-sans-latin-{w}-normal.woff2'))
for k, v in logos.items(): html = html.replace('{{' + k + '}}', v)
(here / 'index.html').write_text(html)
print('index.html', len(html) // 1024, 'KB')
