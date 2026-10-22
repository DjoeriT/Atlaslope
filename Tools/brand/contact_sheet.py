#!/usr/bin/env python3
"""Contact sheet for the photo-led brand round: mocks/brand-photos/candidates.json -> mocks/brand-photos/index.html.

One page, thumbnails embedded, click to pick; the picks show as a code line the owner pastes back. Run with python3 -I.
"""
import base64, html, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'mocks', 'brand-photos')
NAMES = {'rioja': 'Rioja', 'priorat': 'Priorat', 'ribeira-sacra': 'Ribeira Sacra', 'txakoli-getaria': 'Getariako Txakolina'}

CSS = """
:root{--bg:#141210;--panel:#1d1a17;--fg:#ece6dc;--mute:#9a9187;--line:#2c2824;--pick:#b23a48;
--sans:'IBM Plex Sans',system-ui,sans-serif;--mono:'IBM Plex Mono',ui-monospace,monospace;color-scheme:dark}
/* layout: one band per place, two rows (have / new), even grid of 3:2 tiles */
body{background:var(--bg);color:var(--fg);font:15px/1.5 var(--sans)}
.wrap{max-width:1500px;margin:0 auto;padding-block:32px 120px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
h1{font-weight:500;font-size:28px;margin:0 0 6px;text-wrap:balance}
.lede{color:var(--mute);max-width:70ch;margin:0 0 28px}
h2{font-weight:500;font-size:22px;margin:48px 0 4px}
h3{font:500 12px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin:20px 0 10px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.t{all:unset;cursor:pointer;display:flex;flex-direction:column;gap:6px;background:var(--panel);border-radius:6px;padding:6px;outline:2px solid transparent;outline-offset:0}
.t:focus-visible{outline-color:var(--fg)}
.t[aria-pressed=true]{outline-color:var(--pick)}
.t img{width:100%;aspect-ratio:3/2;object-fit:cover;border-radius:4px;display:block;background:var(--line)}
.m{display:flex;justify-content:space-between;gap:8px;font:12px/1.4 var(--mono);color:var(--mute);padding:0 2px}
.m b{color:var(--fg);font-weight:500}
.m a{color:var(--mute)}
.cap{font-size:12px;color:var(--mute);padding:0 2px 2px;min-height:2.8em;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.g{color:#d8a657}
.bar{position:fixed;left:0;right:0;bottom:0;background:#0c0b0a;border-top:1px solid var(--line);
padding-block:12px calc(12px + env(safe-area-inset-bottom,0px));padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));
display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.bar code{font:13px var(--mono);flex:1;min-width:0;overflow-wrap:anywhere;user-select:all}
.bar button{font:500 13px var(--sans);background:var(--pick);color:#fff;border:0;border-radius:6px;padding:8px 14px;cursor:pointer}
"""

JS = """
const KEY='brand-photo-picks-v2';let picks=new Set(DEFAULT);
try{const s=localStorage.getItem(KEY);if(s)picks=new Set(JSON.parse(s))}catch(e){}
const code=document.getElementById('code');
function show(){document.querySelectorAll('.t').forEach(b=>b.setAttribute('aria-pressed',picks.has(b.dataset.id)));
code.textContent=picks.size?[...picks].sort().join(' '):'Click photos to pick them. Your picks appear here.';
document.getElementById('n').textContent=picks.size+' picked';try{localStorage.setItem(KEY,JSON.stringify([...picks]))}catch(e){}}
document.addEventListener('click',e=>{const b=e.target.closest('.t');if(!b||e.target.closest('a'))return;
picks.has(b.dataset.id)?picks.delete(b.dataset.id):picks.add(b.dataset.id);show()});
document.getElementById('copy').addEventListener('click',()=>{navigator.clipboard.writeText(code.textContent).then(()=>{document.getElementById('copy').textContent='Copied'},()=>{getSelection().selectAllChildren(code)})});
show();
"""


def tile(e):
    p = os.path.join(OUT, e['file'])
    if not os.path.exists(p):
        return ''
    src = 'data:image/jpeg;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
    lic = html.escape(e['licence'])
    gold = ' <span class="g">golden/autumn tag</span>' if e.get('golden') else ''
    cap = html.escape(e['title'][5:].rsplit('.', 1)[0])
    return (f'<button class="t" data-id="{e["id"]}" aria-pressed="false"><img src="{src}" alt="{cap}" loading="lazy">'
            f'<span class="m"><b>{e["id"]}</b><span>{e["w"]}×{e["h"]}</span></span>'
            f'<span class="cap">{cap}{gold}</span>'
            f'<span class="m"><span>{html.escape(e["artist"][:34])} · {lic}</span><a href="{e["page"]}" target="_blank" rel="noopener">Commons</a></span></button>')


def main():
    data = json.load(open(os.path.join(OUT, 'candidates.json')))
    pf = os.path.join(OUT, 'picks.json')
    default = [i for ids in json.load(open(pf)).values() for i in ids] if os.path.exists(pf) else []
    parts = []
    for place, d in data.items():
        parts.append(f'<h2>{NAMES[place]}</h2>')
        parts.append(f'<h3>Already on the site · {len(d["have"])} · originals pulled</h3><div class="grid">' + ''.join(map(tile, d['have'])) + '</div>')
        parts.append(f'<h3>New from Commons · {len(d["new"])}</h3><div class="grid">' + ''.join(map(tile, d['new'])) + '</div>')
    page = f"""<title>Brand Photo Contact Sheet</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap">
<style>{CSS}</style>
<div class="wrap"><h1>Photos for the dark gallery</h1>
<p class="lede">The four featured places. Top row per place: photos the site already uses, now at full size. Below: new Commons candidates, all free licences, landscape, at least 2400 px wide, golden-hour and autumn hits first. Outlined in red: my picks for the dark gallery mock (wide land, warm or moody light, no towns or people). Click to change them, then copy the code line at the bottom and paste it to me.</p>
{''.join(parts)}</div>
<div class="bar"><span id="n">0 picked</span><code id="code"></code><button id="copy" type="button">Copy picks</button></div>
<script>const DEFAULT={json.dumps(default)};{JS}</script>"""
    open(os.path.join(OUT, 'index.html'), 'w').write(page)
    print('size MB', round(len(page) / 1e6, 1))


if __name__ == '__main__':
    main()
