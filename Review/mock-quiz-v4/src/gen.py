#!/usr/bin/env python3
"""Quiz mock round (release 7): the screens the brief asks to mock before the quiz is built.
Run: python3 src/gen.py  (writes the HTML pages next to src/). Uses round 3's runtime in assets/."""
import json, os

OUT = os.path.join(os.path.dirname(__file__), '..')

ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
SEARCH = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 13l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'

REGIONS = [('green-spain', 'Green Spain', 9), ('castilla-y-leon', 'Castilla y León', 9), ('rioja', 'Rioja', 1),
           ('ebro', 'Navarra and Aragón', 5), ('cataluna', 'Cataluña', 10), ('mediterranean', 'Valencia and Murcia', 8),
           ('meseta', 'Meseta', 10), ('andalucia', 'Andalucía', 7), ('baleares', 'Balearic Islands', 2), ('canarias', 'Canary Islands', 11)]
CYL = ['Bierzo', 'Ribera del Duero', 'Rueda', 'Toro', 'Cigales', 'Arlanza', 'Arribes', 'León', 'Tierra del Vino de Zamora']


def page(fname, title, card, page_js, script='', mode='quiz', extra_html=''):
    seg = ''.join(f'<a href="{h}"{" aria-current=\"page\"" if m == mode else ""}>{t}</a>'
                  for m, h, t in [('explore', '../atlas-v3/15-explore-spain.html', 'Explore'), ('quiz', '20-quiz.html', 'Quiz'),
                                  ('progress', '../atlas-v3/13-mastery.html', 'Progress')])
    html = f'''<!doctype html><html lang="en" data-theme="paper"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Atlaslope · {title}</title><link rel="stylesheet" href="assets/maplibre-gl.css"><link rel="stylesheet" href="assets/app.css"><link rel="stylesheet" href="assets/quiz.css"></head><body>
<div id="map" role="application" aria-label="Map of Spain"></div>
{card}
<div class="topleft"><button id="brand-btn" class="brand glass" aria-haspopup="menu" aria-expanded="false" aria-controls="brand-menu"><b>Atlaslope</b><small>{title}</small></button>
<div class="search glass">{SEARCH}<input type="search" placeholder="Search places, regions, towns, grapes" aria-label="Search places, regions, towns and grapes"></div></div>
<div id="brand-menu" class="glass menu tl" role="menu" hidden><a role="menuitem" href="../atlas-v3/10-home-today.html">Home: today</a><a role="menuitem" href="../atlas-v3/15-explore-spain.html">Spain, the place tree</a><a role="menuitem" href="27-save-progress.html">Save or load progress</a><button role="menuitem" id="theme" aria-pressed="false"><span>Dark interface</span><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg></button><a role="menuitem" href="index.html">About this round</a></div>
<div class="topright"><span class="mock glass">mock · DO boundaries © MAPA 2014</span><nav class="seg glass" aria-label="Mode">{seg}</nav></div>
<div id="layers-menu" class="glass menu br" hidden><h4>Map</h4>
<label><input type="checkbox" data-layer="satellite" checked>Satellite imagery</label>
<label><input type="checkbox" data-layer="relief" checked>3D relief</label>
<label><input type="checkbox" data-layer="dos" checked>Place boundaries</label></div>
<div class="bottomright"><div class="glass"><button id="zin" class="iconbtn" aria-label="Zoom in"><svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button><button id="zout" class="iconbtn" aria-label="Zoom out"><svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg></button></div>
<div class="glass"><button id="layers-btn" class="iconbtn" aria-label="Map layers" aria-expanded="false" aria-controls="layers-menu"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17l9 5 9-5"/></svg></button></div></div>
{extra_html}
<script>window.PAGE={json.dumps(page_js)};</script>
<script src="assets/maplibre-gl.js"></script><script src="assets/data.js"></script><script src="assets/app.js"></script>
<script>(function(){{const b=document.getElementById('brand-btn'),m=document.getElementById('brand-menu');b.addEventListener('click',()=>{{const o=m.hidden;m.hidden=!o;b.setAttribute('aria-expanded',String(o));}});document.addEventListener('click',e=>{{if(!m.hidden&&!m.contains(e.target)&&!b.contains(e.target)){{m.hidden=true;b.setAttribute('aria-expanded','false');}}}});document.addEventListener('keydown',e=>{{if(e.key==='Escape'&&!m.hidden){{m.hidden=true;b.setAttribute('aria-expanded','false');b.focus();}}}});}})();
const whenReady=f=>{{const t=setInterval(()=>{{if(document.body.dataset.ready){{clearInterval(t);f();}}}},150);}};
{script}</script>
</body></html>'''
    open(os.path.join(OUT, fname), 'w').write(html)


def dots(n, cur, marks):
    out = []
    for i in range(1, n + 1):
        c = marks.get(i, 'cur' if i == cur else '')
        out.append(f'<i class="{c}"></i>' if c else '<i></i>')
    return ''.join(out)


# ---------- 20: the Quiz screen, two doors ----------
focus = ['Bierzo', 'Ribera del Duero', 'Rueda', 'Toro', 'Cigales', 'Arlanza', 'Arribes', 'León', 'Tierra del Vino de Zamora', 'Rioja']
page('20-quiz.html', 'Quiz', f'''<section class="card glass" aria-labelledby="qh"><div class="body"><div class="kicker">Quiz · Friday 17 October</div><h1 id="qh" tabindex="-1">Study or review</h1>
<section class="door" aria-labelledby="d1"><h2 id="d1">Study</h2><p>The course, a little each day. Spaced so it sticks.</p>
<p class="big"><b>12 due</b> and <b>5 new</b> today</p>
<p class="sub">New today, from your focus: Toro, Cigales, Arlanza, Arribes and León.</p>
<a class="btn primary wide" href="23-intro.html">Start today’s round · 17 questions</a>
<p class="focusline">Focus: <b>Castilla y León, Rioja, Priorat</b> <a href="21-focus.html">Change</a></p></section>
<section class="door" aria-labelledby="d2"><h2 id="d2">Review</h2><p>Practise any regions or places, any time, 10 or 20 questions. Places that aren’t due keep their schedule; a miss brings a place back sooner.</p>
<a class="btn wide" href="22-practise.html">Practise any mix</a></section>
<p class="note">No due today? See <a href="20b-quiz-nothing-due.html">this screen with nothing due</a>.</p></div></section>''',
     {"page": "spain", "basemap": "satellite", "dim": focus})

# ---------- 20b: nothing due ----------
page('20b-quiz-nothing-due.html', 'Quiz', '''<section class="card glass" aria-labelledby="qh"><div class="body"><div class="kicker">Quiz · Saturday 18 October</div><h1 id="qh" tabindex="-1">Study or review</h1>
<section class="door" aria-labelledby="d1"><h2 id="d1">Study</h2><p>Nothing due today. Everything you’ve learned is on schedule.</p>
<p class="sub">Five new places are ready: Arribes, León, Tierra del Vino de Zamora, Valles de Benavente, Sierra de Salamanca.</p>
<a class="btn primary wide" href="23-intro.html">Learn 5 new places</a>
<p class="focusline">Focus: <b>none</b>, following the course <a href="21-focus.html">Set a focus</a></p></section>
<section class="door" aria-labelledby="d2"><h2 id="d2">Review</h2><p>Any mix of regions or places, 10 or 20 questions.</p>
<a class="btn wide" href="22-practise.html">Practise any mix</a></section>
<p>Next due: <b>Monday, 9 places</b>. Or <a href="../atlas-v3/15-explore-spain.html">explore the map</a>.</p></div></section>''',
     {"page": "spain", "basemap": "satellite"})

# ---------- 21: focus ----------
chips = ''.join(f'<button class="chip multi" role="checkbox" aria-checked="{"true" if n in ("Castilla y León", "Rioja") else "false"}" data-region="{n}">{n}</button>' for _, n, _ in REGIONS)
page('21-focus.html', 'Focus', f'''<section class="card glass" aria-labelledby="fh"><a href="20-quiz.html" class="iconbtn close" aria-label="Close without saving">{ICON_X}</a><div class="body"><nav class="kicker crumb" aria-label="Where this sits"><a href="20-quiz.html">Quiz</a> › <span>Focus</span></nav><h1 id="fh" tabindex="-1">Focus</h1>
<p class="lede">New places come from your focus first. When they’re all in, the course order carries on.</p>
<h3>Whole regions</h3><div class="chips" role="group" aria-label="Regions in your focus">{chips}</div>
<h3>Or single places</h3><div class="search inline">{SEARCH}<input type="search" id="addplace" list="placenames" placeholder="Add a place, e.g. Toro" aria-label="Add a place to your focus"></div><datalist id="placenames"></datalist>
<ul class="picked" id="picked" aria-label="Places in your focus"><li>Priorat <button class="x" aria-label="Remove Priorat">{ICON_X}</button></li></ul>
<p class="note">Focus only changes which new places come next. Places you’ve started keep their schedule.</p>
</div>
<p class="undo foot-undo" id="undo" role="status" hidden>Focus cleared. <button class="linkbtn" id="undo-btn">Undo</button></p>
<div class="foot"><a class="btn primary" href="20-quiz.html" id="save">Save focus</a><button class="btn quiet" id="clear">Clear focus</button></div></section>''',
     {"page": "spain", "basemap": "satellite", "dim": focus},
     script='''const P2=()=>[...document.querySelectorAll('#picked li')].map(l=>l.firstChild.textContent.trim());
const R2=()=>[...document.querySelectorAll('[data-region][aria-checked=true]')].map(c=>c.dataset.region);
const REG=Object.fromEntries(Object.entries(GEO.macro).map(([k,v])=>[v.name,k]));
const paint=()=>{const r=R2().map(n=>REG[n]),p=P2();paraje.dimExcept(f=>r.includes(f.macro)||p.includes(f.name)||(r.includes(REG['Rioja'])&&f.name==='Rioja'));const s=document.getElementById('save');const n=r.length+p.length;s.textContent=n?'Save focus':'Save: follow the course';};
const addX=li=>li.querySelector('.x').addEventListener('click',()=>{li.remove();paint();});document.querySelectorAll('#picked li').forEach(addX);
document.querySelectorAll('[data-region]').forEach(c=>c.addEventListener('click',()=>{c.setAttribute('aria-checked',String(c.getAttribute('aria-checked')!=='true'));paint();}));
const dl=document.getElementById('placenames');GEO.dos.features.forEach(f=>{const o=document.createElement('option');o.value=f.properties.name;dl.appendChild(o);});
const ap=document.getElementById('addplace');ap.addEventListener('change',()=>{const v=ap.value.trim();if(!v||P2().includes(v))return;const li=document.createElement('li');li.innerHTML=v+' <button class="x" aria-label="Remove '+v+'">'+document.querySelector('.x').innerHTML+'</button>';document.getElementById('picked').appendChild(li);addX(li);ap.value='';paint();});
let saved=null;document.getElementById('clear').addEventListener('click',()=>{saved={r:R2(),html:document.getElementById('picked').innerHTML};document.querySelectorAll('[data-region]').forEach(c=>c.setAttribute('aria-checked','false'));document.getElementById('picked').innerHTML='';document.getElementById('undo').hidden=false;paint();});
document.getElementById('undo-btn').addEventListener('click',()=>{if(!saved)return;document.querySelectorAll('[data-region]').forEach(c=>c.setAttribute('aria-checked',String(saved.r.includes(c.dataset.region))));document.getElementById('picked').innerHTML=saved.html;document.querySelectorAll('#picked li').forEach(addX);document.getElementById('undo').hidden=true;paint();});
whenReady(paint);''')

# ---------- 22: practise any mix ----------
page('22-practise.html', 'Practise', f'''<section class="card glass" aria-labelledby="ph"><a href="20-quiz.html" class="iconbtn close" aria-label="Close, back to the quiz">{ICON_X}</a><div class="body"><nav class="kicker crumb" aria-label="Where this sits"><a href="20-quiz.html">Quiz</a> › <span>Review</span></nav><h1 id="ph" tabindex="-1">Practise any mix</h1>
<h3>Quick picks</h3><div class="chips" role="group" aria-label="Quick picks"><button class="chip" data-quick="missed">Missed today (3)</button><button class="chip" data-quick="all">All of Spain</button></div>
<h3>Regions and places</h3><ul class="tree" id="tree" aria-label="Regions and places"></ul>
<h3>How many questions</h3><div class="chips" role="radiogroup" aria-label="How many questions"><button class="chip" role="radio" aria-checked="false">10</button><button class="chip" role="radio" aria-checked="true">20</button></div>
<p class="note">Places repeat when you pick fewer places than questions. Vinos de Calidad and Rioja’s zones are asked only when you tick them.</p></div>
<div class="foot"><a class="btn primary" href="24-find.html" id="go">Start</a><button class="btn quiet" id="none">Clear</button></div></section>''',
     {"page": "spain", "basemap": "satellite", "dim": ['Rioja', 'Toro']},
     script='''const T=document.getElementById('tree');const regions=Object.entries(GEO.macro);
regions.forEach(([k,v])=>{let names=GEO.dos.features.filter(f=>f.properties.macro===k).map(f=>f.properties.name).sort((a,b)=>a.localeCompare(b));
if(v.name==='Rioja')names=['Rioja (whole DO)','Rioja Alta (zone)','Rioja Alavesa (zone)','Rioja Oriental (zone)'];
const li=document.createElement('li');li.innerHTML='<details'+(v.name==='Castilla y León'?' open':'')+'><summary><label><input type="checkbox" data-region="'+k+'"> '+v.name+'</label><small>'+names.length+(names.length===1?' place':' places')+'</small></summary><ul>'+names.map(n=>'<li><label><input type="checkbox" data-place="'+n+'" data-in="'+k+'"> '+n+'</label></li>').join('')+'</ul></details>';T.appendChild(li);});
T.querySelectorAll('summary label').forEach(l=>l.addEventListener('click',e=>e.stopPropagation()));
const base=n=>n.replace(/ \\((zone|whole DO)\\)$/,'');
const sync=()=>T.querySelectorAll('[data-region]').forEach(r=>{const ps=[...T.querySelectorAll('[data-in="'+r.dataset.region+'"]')];const on=ps.filter(p=>p.checked).length;r.checked=on===ps.length&&on>0;r.indeterminate=on>0&&on<ps.length;});
const picked=()=>[...T.querySelectorAll('[data-place]:checked')].map(p=>base(p.dataset.place));
const q=()=>document.querySelector('[role=radio][aria-checked=true]').textContent;
const paint=()=>{sync();const p=picked(),n=p.length,go=document.getElementById('go');if(!n){go.setAttribute('aria-disabled','true');go.classList.add('off');go.textContent='Pick at least one place';}else{go.removeAttribute('aria-disabled');go.classList.remove('off');go.textContent='Start · '+q()+' questions on '+n+(n===1?' place':' places');}
paraje.dimExcept(f=>p.includes(f.name));};
T.addEventListener('change',e=>{const c=e.target;if(c.dataset.region){T.querySelectorAll('[data-in="'+c.dataset.region+'"]').forEach(x=>x.checked=c.checked);}paint();});
document.querySelectorAll('[role=radio]').forEach(c=>c.addEventListener('click',()=>{document.querySelectorAll('[role=radio]').forEach(x=>x.setAttribute('aria-checked',String(x===c)));paint();}));
const setPlaces=list=>{T.querySelectorAll('[data-place]').forEach(x=>x.checked=list===true||list.includes(base(x.dataset.place)));paint();};
document.querySelectorAll('[data-quick]').forEach(b=>b.addEventListener('click',()=>setPlaces(b.dataset.quick==='all'?true:['Toro','Cigales','Bierzo'])));
document.getElementById('none').addEventListener('click',()=>setPlaces([]));
document.getElementById('go').addEventListener('click',e=>{if(e.currentTarget.getAttribute('aria-disabled'))e.preventDefault();});
whenReady(()=>setPlaces(['Rioja','Rioja Alta','Rioja Alavesa','Rioja Oriental','Toro']));''')

# ---------- 23: new-place intro (not numbered: the question that follows takes the number) ----------
page('23-intro.html', 'Quiz', f'''<section class="card glass" aria-labelledby="ih"><div class="body"><div class="q-num"><span>New place · 1 of 5 today · Study</span><a class="btn quiet" href="26-round-end.html" style="margin-right:-1rem">End round</a></div>
<div class="dots" role="img" aria-label="6 of 17 questions done, 5 right, 1 wrong">{dots(17, 0, {1: 'ok', 2: 'ok', 3: 'bad', 4: 'ok', 5: 'ok', 6: 'ok'})}</div>
<h1 id="ih" tabindex="-1" class="intro-h">Toro</h1>
<p class="lede">Harsh winters, hot sun, iron-rich sandy-loam soils and old bush vines give very deeply coloured, high-alcohol wines.</p>
<dl class="facts"><dt>Where</dt><dd>Castilla y León, on the Duero west of Rueda</dd><dt>Main grape</dt><dd>Tinta de Toro (Tempranillo)<span class="src">Pliego de condiciones DO Toro</span></dd></dl>
<p class="note">Next you’ll find it on the map. Look at its shape and neighbours.</p></div>
<div class="foot"><a class="btn primary" href="24-find.html" id="ask">Got it, ask me</a><a class="btn quiet" href="../atlas-v3/14-explore-region.html">More about Toro</a></div></section>''',
     {"page": "spain", "basemap": "satellite", "selected": "Toro", "dim": ["Toro", "Rueda", "Tierra del Vino de Zamora", "Cigales"],
      "bounds": [[-6.6, 40.9], [-4.4, 42.2]], "maxZoom": 8.6})

# ---------- 24: find it, with the reveal (right flows on, a miss waits) ----------
page('24-find.html', 'Quiz', f'''<section class="card glass" aria-labelledby="qq"><div class="body"><div class="q-num"><span>Question 7 of 17 · Study</span><a class="btn quiet" href="26-round-end.html" style="margin-right:-1rem">End round</a></div>
<div class="dots" role="img" aria-label="Question 7 of 17, 5 right, 1 wrong so far">{dots(17, 7, {1: 'ok', 2: 'ok', 3: 'bad', 4: 'ok', 5: 'ok', 6: 'ok'})}</div>
<p class="q" id="qq" tabindex="-1">Find <em>Toro</em></p>
<p class="status" id="status" aria-live="polite">Tap it on the map, then press Confirm.</p>
<div id="result" tabindex="-1" aria-live="assertive"><div id="fb" class="feedback" hidden><b>✓</b><span id="fbt"></span></div>
<dl class="facts reveal" id="reveal" hidden><dt>Toro</dt><dd>Castilla y León · DO</dd><dt>Main grape</dt><dd>Tinta de Toro (Tempranillo)</dd><dt id="whydt" hidden>Why</dt><dd id="whydd" hidden>Harsh winters, hot sun, iron-rich soils and old bush vines: deeply coloured, high-alcohol reds.</dd></dl><a class="linkish-open" id="open" href="../atlas-v3/14-explore-region.html" hidden>Open Toro’s card</a></div>
<div class="autonext" id="auto" hidden><i></i><span>Next question in a second…</span> <button class="linkbtn" id="stay">Stay here</button></div>
<p class="undo" id="sliprow" role="status" hidden>Counted as right. <button class="linkbtn" id="unslip">Undo</button></p>
<p class="note" id="hint">Mock: tap Toro to see a right answer, anything else to see a miss.</p></div>
<div class="foot"><button class="btn primary" id="confirm" disabled>Confirm</button><button class="btn primary" id="next" hidden>Next question</button><button class="btn" id="slip" hidden>That was a slip</button><button class="btn quiet" id="skip">I don’t know</button></div></section>''',
     {"page": "quiz", "hideNames": True, "basemap": "atlas", "bounds": [[-9.4, 36.0], [3.4, 43.9]]},
     script='''let pick=null,done=false,timer=null;const c=document.getElementById('confirm'),nx=document.getElementById('next'),st=document.getElementById('status'),fb=document.getElementById('fb');
document.addEventListener('do-pick',e=>{if(done)return;pick=e.detail;c.disabled=false;st.textContent='You picked a place in '+GEO.macro[e.detail.macro].name+'. Press Confirm, or tap another.';});
const feat=n=>GEO.dos.features.find(f=>f.properties.name===n);
const bbox=fs=>{let b=[[180,90],[-180,-90]];const walk=c=>{if(typeof c[0]==='number'){b[0][0]=Math.min(b[0][0],c[0]);b[0][1]=Math.min(b[0][1],c[1]);b[1][0]=Math.max(b[1][0],c[0]);b[1][1]=Math.max(b[1][1],c[1]);}else c.forEach(walk);};fs.forEach(f=>walk(f.geometry.coordinates));return b;};
const mid=f=>{const b=bbox([f]);return [(b[0][0]+b[1][0])/2,(b[0][1]+b[1][1])/2];};
const finish=(ok,why,canSlip)=>{done=true;fb.hidden=false;fb.classList.toggle('bad',!ok);fb.querySelector('b').textContent=ok?'✓':'✗';document.getElementById('fbt').textContent=why;document.getElementById('reveal').hidden=false;st.hidden=true;document.getElementById('hint').hidden=true;document.getElementById('skip').hidden=true;c.hidden=true;nx.hidden=false;
const t=feat('Toro'),fs=[t];if(pick&&pick.name!=='Toro')fs.push(feat(pick.name));paraje.select(t.id);paraje.dimExcept(f=>fs.some(x=>x.properties.name===f.name));
fs.forEach(f=>paraje.label(mid(f),f.properties.name,f===t?'answer':'miss'));
const card=document.querySelector('.card').getBoundingClientRect(),narrow=innerWidth<900;map.fitBounds(bbox(fs),{padding:narrow?{top:90,left:40,right:90,bottom:innerHeight-card.top+70}:{left:card.right+40,top:80,right:80,bottom:60},maxZoom:8.5,duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:900});
document.querySelectorAll('.dots i')[6].className=ok?'ok':'bad';
if(ok){document.getElementById('auto').hidden=false;timer=setTimeout(()=>location.href='26-round-end.html',matchMedia('(prefers-reduced-motion: reduce)').matches?2500:1400);}
else{document.getElementById('whydt').hidden=false;document.getElementById('whydd').hidden=false;document.getElementById('slip').hidden=!canSlip;document.getElementById('open').hidden=false;}
document.getElementById('result').focus();};
c.addEventListener('click',()=>{const ok=pick&&pick.name==='Toro';finish(ok,ok?'Right, that’s Toro.':'You picked '+pick.name+'. Toro is the one in red. You’ll get it again at the end of this round, and tomorrow.',true);});
document.getElementById('skip').addEventListener('click',()=>{pick=null;finish(false,'Toro is the one in red. You’ll get it again at the end of this round, and tomorrow.',false);});
nx.addEventListener('click',()=>location.href='26-round-end.html');
document.getElementById('stay').addEventListener('click',()=>{clearTimeout(timer);document.getElementById('auto').hidden=true;});
document.getElementById('slip').addEventListener('click',e=>{e.currentTarget.hidden=true;document.getElementById('sliprow').hidden=false;document.querySelectorAll('.dots i')[6].className='ok';fb.classList.remove('bad');fb.querySelector('b').textContent='✓';document.getElementById('fbt').textContent='Counted as right: you knew it, the tap slipped.';});
document.getElementById('unslip').addEventListener('click',()=>{document.getElementById('sliprow').hidden=true;document.getElementById('slip').hidden=false;document.querySelectorAll('.dots i')[6].className='bad';fb.classList.add('bad');fb.querySelector('b').textContent='✗';document.getElementById('fbt').textContent='You picked '+pick.name+'. Toro is the one in red. You’ll get it again at the end of this round, and tomorrow.';});''')

# ---------- 25: what is this, and the fact question ----------
page('25-fact.html', 'Quiz', f'''<section class="card glass" aria-labelledby="qq"><div class="body"><div class="q-num"><span>Question 12 of 17 · Study</span><a class="btn quiet" href="26-round-end.html" style="margin-right:-1rem">End round</a></div>
<div class="dots" role="img" aria-label="Question 12 of 17">{dots(17, 12, {i: 'ok' for i in range(1, 12)} | {3: 'bad'})}</div>
<div class="kicker">You know where it is. Now what it makes.</div><p class="q" id="qq" tabindex="-1"><em>Ribera del Duero</em>: its main grape?</p>
<div class="choices" role="group" aria-label="Answers"><button class="choice"><b>A</b>Mencía</button><button class="choice" data-ok="1"><b>B</b>Tinto Fino (Tempranillo)</button><button class="choice"><b>C</b>Garnacha Tinta</button><button class="choice"><b>D</b>Verdejo</button></div>
<div id="fb" class="feedback" hidden><b>✓</b><span id="fbt"></span></div>
<dl class="facts reveal" id="reveal" hidden><dt>Why</dt><dd>Tempranillo in a high, strongly continental climate with big temperature swings gains balanced acidity and sweet tannins.</dd></dl></div>
<div class="foot"><button class="btn primary" id="next" hidden>Next question</button><button class="btn" id="slip" hidden>That was a slip</button><button class="btn quiet" id="skip">I don’t know</button></div></section>''',
     {"page": "quiz", "selected": "Ribera del Duero", "dim": ["Ribera del Duero"], "basemap": "atlas", "bounds": [[-5.2, 41.2], [-2.6, 42.1]]},
     script='''let done=false;const show=ok=>{done=true;const fb=document.getElementById('fb');fb.hidden=false;fb.classList.toggle('bad',!ok);fb.querySelector('b').textContent=ok?'✓':'✗';document.getElementById('fbt').textContent=ok?'Right: Tinto Fino, the local name for Tempranillo.':'It’s Tinto Fino, the local name for Tempranillo. It comes back at the end of this round.';document.getElementById('reveal').hidden=false;document.getElementById('next').hidden=false;document.getElementById('slip').hidden=ok;document.getElementById('skip').hidden=true;document.querySelectorAll('.choice').forEach(x=>{x.disabled=true;if(x.dataset.ok)x.classList.add('ok');});document.getElementById('next').focus();};
document.querySelectorAll('.choice').forEach(b=>b.addEventListener('click',()=>{if(done)return;const ok=!!b.dataset.ok;if(!ok)b.classList.add('bad');show(ok);}));
document.getElementById('skip').addEventListener('click',()=>show(false));document.getElementById('next').addEventListener('click',()=>location.href='26-round-end.html');
document.getElementById('slip').addEventListener('click',e=>{e.currentTarget.hidden=true;const fb=document.getElementById('fb');fb.classList.remove('bad');fb.querySelector('b').textContent='✓';document.getElementById('fbt').textContent='Counted as right.';});''')

# ---------- 26: round end with Keep going ----------
missed = [('Toro', 'You picked Cigales'), ('Cigales', 'You picked Toro'), ('Bierzo', 'What is this: you said Valdeorras')]
page('26-round-end.html', 'Quiz', f'''<section class="card glass" aria-labelledby="rh"><div class="body"><div class="kicker">Round done · Study</div><h1 id="rh" tabindex="-1" class="score">14<small> / 17</small></h1>
<p class="lede">All done for today. The three you missed come back tomorrow.</p>
<h2>Missed</h2><ul class="list">{''.join(f'<li><a href="../atlas-v3/14-explore-region.html">{n}</a><span class="tag">{w}</span></li>' for n, w in missed)}</ul>
<h2>Today</h2><div class="row"><span style="width:7rem">Due left</span><div class="bar"><i style="width:0%"></i></div><span>0</span></div>
<div class="row"><span style="width:7rem">New places</span><div class="bar"><i style="width:100%"></i></div><span>5 of 5</span></div>
<h2>Castilla y León</h2><div class="row"><span style="width:7rem">Known</span><div class="bar"><i style="width:67%"></i></div><span>6 of 9</span></div>
<p class="note">Progress is kept in this browser. <a href="27-save-progress.html">Save a copy to a file</a></p></div>
<div class="foot"><a class="btn primary" href="../atlas-v3/10-home-today.html">Done for today</a><a class="btn" href="23-intro.html">Learn 5 extra places</a><a class="btn quiet" href="22-practise.html">Practise any mix</a></div></section>''',
     {"page": "results", "hideNames": True, "basemap": "atlas", "dim": ["Toro", "Cigales", "Bierzo"],
      "marks": [{"name": "Toro", "kind": "bad"}, {"name": "Cigales", "kind": "bad"}, {"name": "Bierzo", "kind": "bad"}],
      "bounds": [[-7.1, 40.1], [-1.8, 43.2]]})

# ---------- 26b: round end mid-day (20 asked, more due) ----------
page('26b-round-keep-going.html', 'Quiz', f'''<section class="card glass" aria-labelledby="rh"><div class="body"><div class="kicker">Round done · Study</div><h1 id="rh" tabindex="-1" class="score">18<small> / 20</small></h1>
<p class="lede">Eight more are due today, and three new places. Keep going, or stop: they wait until next time.</p>
<h2>Missed</h2><ul class="list"><li><a href="../atlas-v3/14-explore-region.html">Montsant</a><span class="tag">You picked Priorat</span></li><li><a href="../atlas-v3/14-explore-region.html">Calatayud</a><span class="tag">You picked Cariñena</span></li></ul>
<h2>Today</h2><div class="row"><span style="width:7rem">Due left</span><div class="bar"><i style="width:28%"></i></div><span>8</span></div>
<div class="row"><span style="width:7rem">New places</span><div class="bar"><i style="width:40%"></i></div><span>2 of 5</span></div>
<p class="note">Progress is kept in this browser. <a href="27-save-progress.html">Save a copy to a file</a></p></div>
<div class="foot"><a class="btn primary" href="24-find.html">Keep going · 11 questions</a><a class="btn quiet" href="../atlas-v3/10-home-today.html">Done for today</a></div></section>''',
     {"page": "results", "hideNames": True, "basemap": "atlas", "dim": ["Montsant", "Calatayud"],
      "marks": [{"name": "Montsant", "kind": "bad"}, {"name": "Calatayud", "kind": "bad"}]})

# ---------- 27: save or load progress ----------
page('27-save-progress.html', 'Progress file', f'''<section class="card glass" aria-labelledby="sh"><a href="20-quiz.html" class="iconbtn close" aria-label="Close">{ICON_X}</a><div class="body"><div class="kicker">Your progress</div><h1 id="sh" tabindex="-1">Save or load</h1>
<p class="lede">Progress lives in this browser only. A file is your backup, and how you move it to another device.</p>
<dl class="facts"><dt>In this browser</dt><dd>412 answers since 17 October · 23 places known</dd><dt>Last saved</dt><dd>Never. Save a copy now, and again every week or so.</dd></dl>
<h2>On iPad or iPhone</h2><p class="note">Add Atlaslope to your Home Screen before you start: Safari can clear a website’s storage after a week away; the Home Screen app keeps it.</p>
<p class="undo" id="loaded" role="status" hidden>Loaded: 380 answers from 15 October. Your earlier progress is kept as a backup. <button class="linkbtn" id="undo-load">Undo</button></p></div>
<div class="foot"><button class="btn primary" id="save">Save to a file</button><button class="btn" id="load">Load from a file</button></div></section>''',
     {"page": "spain", "basemap": "satellite"},
     script='''document.getElementById('save').addEventListener('click',()=>{document.querySelector('.facts dd:last-child').textContent='Just now · atlaslope-progress-2026-10-17.json';});
document.getElementById('load').addEventListener('click',()=>{document.getElementById('loaded').hidden=false;});
document.getElementById('undo-load').addEventListener('click',()=>{document.getElementById('loaded').hidden=true;});''')

# ---------- index ----------
items = [('20-quiz.html', 'Quiz · Study or review', 'The two doors on one engine. Study: what is due plus five new, with your focus. Review: practise any mix.'),
         ('20b-quiz-nothing-due.html', 'Quiz · nothing due', 'Study offers five new places; Review stays one tap away.'),
         ('21-focus.html', 'Focus', 'Whole regions or single places; new places come from here first. Clear has an undo.'),
         ('22-practise.html', 'Practise any mix', 'Replaces the old setup screen: regions open to their places, quick picks, 10 or 20. The map follows your picks.'),
         ('23-intro.html', 'New place · the intro', 'Show, then ask: the place, its why line and one fact, then “Got it, ask me”.'),
         ('24-find.html', 'Find it · the reveal', 'Right flows on after a second (with “Stay here”); a miss waits with the why line, “That was a slip” (undoable) and “Open Toro”.'),
         ('25-fact.html', 'The fact question', 'Asked once you know where a place is: grapes, styles, level or climate.'),
         ('26b-round-keep-going.html', 'Round done · Keep going', 'After 20, more is due: Keep going or stop.'),
         ('26-round-end.html', 'Round done · all done today', 'Misses link to the place; Learn 5 more, Practise any mix, or done.'),
         ('27-save-progress.html', 'Save or load progress', 'From the Atlaslope menu: a file backup, the iPad Home Screen note. Load keeps a backup with an undo.')]
lis = ''.join(f'<li><a href="{h}" style="font-family:var(--serif);font-size:1.25rem;text-decoration:none">{t}</a><span style="color:var(--ink3);font-size:.9rem;max-width:55%;text-align:right">{d}</span></li>' for h, t, d in items)
open(os.path.join(OUT, 'index.html'), 'w').write(f'''<!doctype html><html lang="en" data-theme="paper"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Atlaslope · quiz mock round</title>
<link rel="stylesheet" href="assets/app.css"><style>body{{overflow:auto;background:#F6F1E7}}.wrap{{max-width:52rem;margin:3rem auto;padding:0 1.25rem}}</style></head><body><div class="wrap">
<div class="kicker">Mock-ups · the quiz round (release 7), 17 Oct 2026</div><h1>Atlaslope</h1><p class="lede">The quiz screens the plan asked to mock before building: the two doors, focus, practise any mix, the new-place intro, the reveal, Keep going, and the progress file. Same look and map as round 3. Click through from the first page.</p>
<ul class="list">{lis}</ul>
<p class="note">Facts on these pages are the live fact sheets’ own text. Counts and dates are a sample. Satellite imagery and terrain need internet.</p></div></body></html>''')
print('ok')
