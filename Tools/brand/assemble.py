"""Merge the brand round's parts (parts/a.html, b.html, c.html) into ONE page, index.html.

    python3 Tools/brand/assemble.py <round folder> [recommended id, e.g. a1 or dir-d] [round.json]

round.json (optional) sets the page: {"parts": {"d": "D · Geological sheet", ...}, "title": "...", "h1": "...", "lines": ["..."]}.

Each part follows the contract in the round's BRIEF.md: Google Fonts links in the head, one <style>, maps.js plus one inline script,
one <section class="dir dir-x">. Inline scripts are wrapped in their own function so their names cannot clash.
"""
import html, json, os, re, sys

ROOT = sys.argv[1]
REC = sys.argv[2] if len(sys.argv) > 2 else ''
CFG = json.load(open(sys.argv[3])) if len(sys.argv) > 3 else {}
NAMES = CFG.get('parts', {'a': 'A · Swiss topographic', 'b': 'B · Survey', 'c': 'C · Nautical chart'})
TITLE = CFG.get('title', 'AtlaSlope Identity R1')
H1 = CFG.get('h1', 'Three map flavours. Three ways to show the land.')
LINES = CFG.get('lines', ['Nine blocks, each with the same four screens: logo, home, field guide entry, map.',
                          'Every map is real data: IGN terrain, MAPA boundaries. Every photo is a credited Rioja vineyard.'])

links, styles, sections, scripts = [], [], [], []
for x in NAMES:
    p = os.path.join(ROOT, 'parts', x + '.html')
    if not os.path.exists(p):
        print('missing', p)
        continue
    s = open(p).read().replace('../assets/', 'assets/')
    for l in re.findall(r'<link[^>]+>', s):
        if 'fonts.g' in l and l not in links:
            links.append(l)
    styles += re.findall(r'<style[^>]*>(.*?)</style>', s, re.S)
    sections += re.findall(r'(<section class="dir dir-' + x + r'.*?</section>)\s*(?:<script|</body|$)', s, re.S)
    for sc in re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', s, re.S):
        scripts.append('(function () {\n' + sc + '\n})();')

nav = ''.join(f'<a href="#dir-{x}">{html.escape(n)}</a>' for x, n in NAMES.items())
page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(TITLE)}</title>
{chr(10).join(links)}
<style>
:root {{ --page: #EDEDEA; --ink: #1A1A1A; --muted: #555; --line: #CFCFCA; }}
html, body {{ margin: 0; background: var(--page); color: var(--ink); font-family: -apple-system, system-ui, sans-serif; }}
.r1-top {{ position: sticky; top: 0; z-index: 50; display: flex; gap: 1.5rem; align-items: center; padding: .75rem 2rem;
  background: rgba(237,237,234,.94); backdrop-filter: blur(6px); border-bottom: 1px solid var(--line); font-size: .9rem; }}
.r1-top strong {{ font-weight: 600; margin-right: auto; }}
.r1-top a {{ color: var(--ink); text-decoration: none; padding: .4rem 0; }}
.r1-top a:hover {{ text-decoration: underline; }}
.r1-intro {{ max-width: 60rem; padding: 3rem 2rem 1rem; line-height: 1.5; }}
.r1-intro h1 {{ font-size: 2rem; margin: 0 0 .75rem; font-weight: 600; }}
.r1-intro p {{ margin: .25rem 0; color: var(--muted); }}
.r1-rec {{ outline: 4px solid #111; outline-offset: 6px; }}
.r1-rec-tag {{ display: inline-block; background: #111; color: #fff; font: 600 .8rem/1 system-ui; padding: .45rem .6rem; border-radius: 3px; margin-bottom: .75rem; }}
</style>
{''.join('<style>' + s + '</style>' for s in styles)}
</head><body>
<nav class="r1-top"><strong>{html.escape(TITLE)}</strong>{nav}</nav>
<header class="r1-intro">
<h1>{html.escape(H1)}</h1>
{''.join('<p>' + html.escape(l) + '</p>' for l in LINES)}
<p id="r1-rec-line"></p>
</header>
{chr(10).join(sections)}
<script src="assets/maps.js"></script>
<script>
{chr(10).join(scripts)}
(function () {{
  var rec = {REC!r};
  if (!rec) return;
  var el = document.getElementById(rec) || document.querySelector('[id^="' + rec + '"]');
  if (!el) return;
  el.classList.add('r1-rec');
  var t = document.createElement('div'); t.className = 'r1-rec-tag'; t.textContent = 'Recommended';
  el.insertBefore(t, el.firstChild);
  var line = document.getElementById('r1-rec-line');
  line.innerHTML = 'Recommended: <a href="#' + el.id + '">' + rec.replace('dir-', '').toUpperCase() + '</a>.';
}})();
</script>
</body></html>
'''
open(os.path.join(ROOT, 'index.html'), 'w').write(page)
print('index.html', len(page) // 1024, 'KB;', len(sections), 'sections,', len(links), 'font links,', len(scripts), 'scripts')
