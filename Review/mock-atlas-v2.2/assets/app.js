/* Atlaslope mock runtime. PAGE is set by each page; GEO and DOS come from data.js. */
(function(){
const P = window.PAGE || {};
const root = document.documentElement;
const sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
function systemTheme(){ return sysDark && sysDark.matches ? 'dark' : 'paper'; }
let themeOverride = null; try { themeOverride = localStorage.getItem('paraje-theme'); } catch(e){}
root.dataset.theme = themeOverride || systemTheme();
if (sysDark && sysDark.addEventListener) sysDark.addEventListener('change', () => { if (!themeOverride) root.dataset.theme = systemTheme(); });
let basemap; try { basemap = localStorage.getItem('paraje-basemap') || P.basemap || 'satellite'; } catch(e){ basemap = P.basemap || 'satellite'; }

const MACRO = GEO.macro;
const RIOJA = ['rioja','lesson','profile'].includes(P.page);
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const TERRAIN = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';

const style = {
  version: 8,
  sources: {
    terrain: { type:'raster-dem', tiles:[TERRAIN], tileSize:256, encoding:'terrarium', maxzoom:13, attribution:'Terrain: Mapzen, AWS Open Data' },
    satellite: { type:'raster', tiles:[ESRI], tileSize:256, maxzoom:18, attribution:'Imagery: Esri, Maxar, Earthstar Geographics' },
    countries: { type:'geojson', data:GEO.countries },
    provinces: { type:'geojson', data:GEO.provinces },
    rivers: { type:'geojson', data:GEO.rivers },
    lakes: { type:'geojson', data:GEO.lakes },
    dos: { type:'geojson', data:GEO.dos },
    zones: { type:'geojson', data:GEO.zones },
    soils: { type:'geojson', data:GEO.soils },
  },
  layers: [
    { id:'bg', type:'background', paint:{ 'background-color':'#C9D6DB' } },
    { id:'land', type:'fill', source:'countries', paint:{ 'fill-color':'#EFE9DC' } },
    { id:'satellite', type:'raster', source:'satellite', paint:{ 'raster-saturation':-0.15, 'raster-contrast':0.05 } },
    { id:'hillshade', type:'hillshade', source:'terrain', paint:{ 'hillshade-exaggeration':0.45, 'hillshade-shadow-color':'#5A4A3A', 'hillshade-highlight-color':'#FFFFFF', 'hillshade-accent-color':'#8A7A66' } },
    { id:'other-countries', type:'fill', source:'countries', filter:['!=',['get','ADM0_A3'],'ESP'], paint:{ 'fill-color':'#F2EEE6', 'fill-opacity':0.55 } },
    { id:'provinces', type:'line', source:'provinces', paint:{ 'line-color':'#8A7F72', 'line-width':0.5, 'line-opacity':0.5 } },
    { id:'lakes', type:'fill', source:'lakes', paint:{ 'fill-color':'#9FBFCB' } },
    { id:'rivers', type:'line', source:'rivers', paint:{ 'line-color':'#6FA0B4', 'line-width':['interpolate',['linear'],['zoom'],5,0.8,9,2.2] } },
    { id:'borders', type:'line', source:'countries', paint:{ 'line-color':'#5B5048', 'line-width':['interpolate',['linear'],['zoom'],5,0.8,9,1.4], 'line-dasharray':[3,2] } },
    { id:'soils', type:'fill', source:'soils', paint:{ 'fill-color':['get','color'], 'fill-opacity':0.55 } },
    { id:'dos-fill', type:'fill', source:'dos', paint:{ 'fill-color':['case',['boolean',['feature-state','sel'],false],'#7A2E3B',['get','color']], 'fill-opacity':['case',['boolean',['feature-state','dim'],false],0.12,['boolean',['feature-state','sel'],false],0.6,0.42] } },
    { id:'dos-line', type:'line', source:'dos', paint:{ 'line-color':['case',['boolean',['feature-state','sel'],false],'#7A2E3B',['get','color']], 'line-width':['case',['boolean',['feature-state','sel'],false],3,1.2], 'line-dasharray':[2,1.5] } },
    { id:'zones-fill', type:'fill', source:'zones', paint:{ 'fill-color':['get','color'], 'fill-opacity':['interpolate',['linear'],['zoom'],9.5,['case',['boolean',['feature-state','sel'],false],0.45,0.22],11.5,['case',['boolean',['feature-state','sel'],false],0.14,0.05]] } },
    { id:'zones-line', type:'line', source:'zones', paint:{ 'line-color':'#3B2F28', 'line-width':['case',['boolean',['feature-state','sel'],false],3,1.6] } },
  ],
};

const map = new maplibregl.Map({
  container:'map', style, center:P.center||[-3.5,40.2], zoom:P.zoom||5.6, pitch:P.pitch||0, bearing:P.bearing||0,
  attributionControl:{ compact:true }, maxPitch:70, antialias:true
});
window.map = map;

function applyBasemap(){
  const sat = basemap==='satellite';
  map.setLayoutProperty('satellite','visibility', sat?'visible':'none');
  map.setLayoutProperty('other-countries','visibility', sat?'none':'visible');
  map.setLayoutProperty('provinces','visibility', sat?'none':'visible');
  map.setPaintProperty('hillshade','hillshade-exaggeration', sat?0.25:0.5);
  const dosOp = ['case',['boolean',['feature-state','dim'],false],0.12,['boolean',['feature-state','sel'],false],sat?0.55:0.65,sat?0.38:0.45];
  map.setPaintProperty('dos-fill','fill-opacity', RIOJA ? ['interpolate',['linear'],['zoom'],9,dosOp,11,0.06] : dosOp);
  map.setPaintProperty('dos-line','line-width',['case',['boolean',['feature-state','sel'],false],3,sat?1.6:1.2]);
  map.setPaintProperty('borders','line-color', sat?'#F4EFE6':'#5B5048');
  map.setPaintProperty('rivers','line-color', sat?'#9FD2E8':'#6FA0B4');
  root.dataset.basemap = basemap;
  try{ localStorage.setItem('paraje-basemap', basemap);}catch(e){}
}
function applyLayers(){
  const on = id => { const el=document.querySelector(`[data-layer="${id}"]`); return el? el.checked : true; };
  const vis = (layer, v) => map.getLayer(layer) && map.setLayoutProperty(layer,'visibility', v?'visible':'none');
  vis('dos-fill', on('dos')); vis('dos-line', on('dos'));
  vis('hillshade', on('relief'));
  vis('soils', on('soil') && RIOJA);
  vis('zones-fill', on('zones') && RIOJA); vis('zones-line', on('zones') && RIOJA);
  document.querySelectorAll('.lbl.do').forEach(e=>e.style.display = on('dos')?'':'none');
  document.querySelectorAll('.pin').forEach(e=>e.style.display = on('photos')?'':'none');
  map.setTerrain(on('relief') ? { source:'terrain', exaggeration: RIOJA?1.6:1.3 } : null);
}

// ---------- labels as DOM markers (keep screen size, use the web fonts) ----------
const markers = [];
function label(lnglat, text, cls, opts){
  const el = document.createElement('div'); el.className = 'lbl '+cls; el.textContent = text;
  if (opts && opts.minzoom) el.dataset.minzoom = opts.minzoom;
  const m = new maplibregl.Marker({ element:el, anchor: (opts&&opts.anchor)||'center', offset:(opts&&opts.offset)||[0,0] }).setLngLat(lnglat).addTo(map);
  markers.push(m); return el;
}
function updateLabelZoom(){
  const z = map.getZoom();
  markers.forEach(m => { const el = m.getElement(); const mz = parseFloat(el.dataset.minzoom||0); el.style.visibility = z >= mz ? 'visible' : 'hidden'; el.dataset.hidden = z >= mz ? '' : '1'; });
  collide();
}
function collide(){
  const prio = el => el.classList.contains('zone')?0 : el.classList.contains('miss')?1 : el.classList.contains('docalvl')?2 : el.classList.contains('do')?3+(1-parseFloat(el.dataset.r||0)) : el.classList.contains('city')?6 : el.classList.contains('water')?7 : 8;
  const els = markers.map(m=>m.getElement()).filter(el=>!el.dataset.hidden).sort((x,y)=>prio(x)-prio(y));
  const kept=[]; const W=window.innerWidth, H=window.innerHeight;
  els.forEach(el => { el.style.visibility='visible'; const r=el.getBoundingClientRect(); if (r.right<0||r.left>W||r.bottom<0||r.top>H) return;
    const hit = kept.some(k => !(r.right+2<k.left || r.left-2>k.right || r.bottom+1<k.top || r.top-1>k.bottom));
    if (hit) el.style.visibility='hidden'; else kept.push(r); });
}
map.on('zoom', updateLabelZoom); map.on('moveend', collide); map.on('pitchend', collide); map.on('rotate', collide);

const showNames = !P.hideNames;
if (!RIOJA) {
  GEO.dos.features.forEach(f => {
    const p = f.properties;
    if (showNames) label(p.centroid, p.name, 'do'+(p.level==='DOCa'?' docalvl':''), { minzoom: p.r >= 0.3 ? 0 : p.r >= 0.15 ? 6 : 6.8 }).dataset.r = Math.min(1,p.r);
  });
  if (showNames && P.page==='spain') Object.entries(GEO.macroLabels).forEach(([k,ll]) => label(ll, MACRO[k].name, 'macro', {minzoom:0}));
  const doNames = new Set(GEO.dos.features.map(f=>f.properties.name));
  if (showNames) GEO.places.features.forEach(f => { const p=f.properties; if (p.ADM0_A3!=='ESP' || doNames.has(p.NAME)) return; label(f.geometry.coordinates, p.NAME, 'city', { anchor:'left', offset:[4,0], minzoom: p.SCALERANK<=6?5.5:6.8 }); });
  [['Ebro',[-1.3,41.9]],['Duero',[-4.3,41.55]],['Tajo',[-4.2,39.9]],['Guadiana',[-6.9,38.95]],['Guadalquivir',[-5.6,37.55]]].forEach(([n,ll])=>label(ll,n,'water',{minzoom:5.8}));
} else {
  GEO.zones.features.forEach(f => label(f.properties.centroid, f.properties.name, 'zone'));
  [['Haro',[-2.85,42.577]],['Logroño',[-2.445,42.465]],['Laguardia',[-2.585,42.555]],['Calahorra',[-1.965,42.305]],['Alfaro',[-1.75,42.18]],['Nájera',[-2.73,42.416]],['Elciego',[-2.617,42.515]]].forEach(([n,ll])=>label(ll,n,'city',{anchor:'left',offset:[4,0]}));
  label([-2.35,42.4],'Ebro','water'); label([-2.55,42.63],'Sierra de Cantabria','macro'); label([-2.95,42.15],'Sierra de la Demanda','macro');
  (P.photos||[]).forEach((ph,i)=>{ const wrap=document.createElement('div'); wrap.className='pinwrap'; const el=document.createElement('button'); el.className='pin'; el.textContent=i+1; el.setAttribute('aria-label','Photo '+(i+1)+': '+ph.label); wrap.appendChild(el); new maplibregl.Marker({element:wrap}).setLngLat(ph.ll).addTo(map); wrap.removeAttribute('aria-label'); el.setAttribute('aria-label','Photo '+(i+1)+': '+ph.label); el.addEventListener('click',()=>{ const ph=document.querySelectorAll('.photo')[i]; if(ph){ ph.scrollIntoView({behavior:'smooth',block:'center'}); ph.classList.add('flash'); setTimeout(()=>ph.classList.remove('flash'),1500);} }); });
}
updateLabelZoom();

// ---------- selection ----------
let selId = null;
function select(id){
  if (selId!=null) map.setFeatureState({source:'dos', id:selId}, {sel:false});
  selId = id; if (id!=null) map.setFeatureState({source:'dos', id}, {sel:true});
}
function selectZone(name){
  GEO.zones.features.forEach(f => map.setFeatureState({source:'zones', id:f.id}, {sel: f.properties.name===name}));
  document.querySelectorAll('[data-zone]').forEach(c => c.setAttribute('aria-checked', String(c.dataset.zone===(name||'all'))));
}
function dimExcept(pred){ GEO.dos.features.forEach(f => map.setFeatureState({source:'dos', id:f.id}, {dim: !pred(f.properties)})); }
window.paraje = { map, select, selectZone, applyLayers, dimExcept, label, collide, markers, init: ()=>init() };

function pad(){ const rem=parseFloat(getComputedStyle(document.documentElement).fontSize); const card=document.querySelector('.card'); const r=card?card.getBoundingClientRect():null;
  if (window.innerWidth > 820) return { left: Math.round((r?r.right:0)+rem), top: Math.round(rem*4.6), bottom: Math.round(rem*1.5), right: Math.round(rem*5) };
  return { left: Math.round(rem), top: Math.round(rem*4.6), bottom: Math.round(window.innerHeight*0.52+rem), right: Math.round(rem*4) }; }
function frame(animate){ const b = P.bounds || [[-9.4,35.9],[3.4,43.9]]; map.fitBounds(b, { padding: pad(), pitch: P.pitch||0, bearing: P.bearing||0, duration: animate?700:0, maxZoom: P.maxZoom||12 }); }
window.addEventListener('resize', () => { clearTimeout(window.__rf); window.__rf=setTimeout(()=>frame(false), 200); });
function init(){ try {
  applyBasemap(); applyLayers();
  frame(false);
  if (P.dim) GEO.dos.features.forEach(f => { if (!P.dim.includes(f.properties.name)) map.setFeatureState({source:'dos', id:f.id}, {dim:true}); });
  if (P.selected) { const f = GEO.dos.features.find(f=>f.properties.name===P.selected); if (f) select(f.id); }
  if (P.marks) P.marks.forEach(m => { const f = GEO.dos.features.find(f=>f.properties.name===m.name); if(!f) return; const el=document.createElement('div'); el.className='mark '+m.kind; el.innerHTML = m.kind==='ok' ? '<svg viewBox="0 0 20 20" width="22" height="22"><circle cx="10" cy="10" r="9" fill="#2F6B3E" stroke="#fff" stroke-width="2"/><path d="M6 10l3 3 5-6" fill="none" stroke="#fff" stroke-width="2"/></svg>' : '<svg viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="16" fill="none" stroke="#E8533A" stroke-width="3.5"/></svg>'; new maplibregl.Marker({element:el}).setLngLat(f.properties.centroid).addTo(map); if (m.kind==='bad') label(f.properties.centroid, f.properties.name, 'do miss', {anchor:'bottom', offset:[0,-22]}); });
  if (P.flyTo) setTimeout(()=>map.flyTo(Object.assign({duration: matchMedia('(prefers-reduced-motion: reduce)').matches?0:2600, essential:true}, P.flyTo)), 600);
  updateLabelZoom();
  document.body.dataset.ready = '1';
  } catch(e){ console.warn('INIT FAILED', e && e.message, e && e.stack); } }
let inited=false; const initOnce=()=>{ if(inited) return; inited=true; init(); };
map.once('load', initOnce); const pollInit=setInterval(()=>{ if(inited){clearInterval(pollInit);return;} if(map.isStyleLoaded()) { clearInterval(pollInit); initOnce(); } }, 150);
map.on('click', 'dos-fill', e => {
  const f = e.features[0]; select(f.id);
  document.dispatchEvent(new CustomEvent('do-pick', {detail:{ id:f.id, name:f.properties.name, level:f.properties.level, macro:f.properties.macro }}));
});
map.on('mouseenter','dos-fill',()=>map.getCanvas().style.cursor='pointer');
map.on('mouseleave','dos-fill',()=>map.getCanvas().style.cursor='');
map.on('click', 'zones-fill', e => selectZone(e.features[0].properties.name));

// ---------- chrome ----------
document.querySelectorAll('[data-layer]').forEach(i => i.addEventListener('change', applyLayers));
document.querySelectorAll('[name="basemap"]').forEach(i => { i.checked = i.value===basemap; i.addEventListener('change', ()=>{ basemap=i.value; applyBasemap(); }); });
const themeBtn = document.getElementById('theme');
const syncTheme=()=>{ if(themeBtn) themeBtn.setAttribute('aria-pressed', String(root.dataset.theme==='dark')); }; syncTheme();
if (themeBtn) themeBtn.addEventListener('click', () => { themeOverride = root.dataset.theme==='dark'?'paper':'dark'; root.dataset.theme = themeOverride; syncTheme(); try{localStorage.setItem('paraje-theme', themeOverride);}catch(e){} });
const layersBtn = document.getElementById('layers-btn'), menu = document.getElementById('layers-menu');
if (layersBtn) layersBtn.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; layersBtn.setAttribute('aria-expanded', String(open)); });
document.addEventListener('keydown', e => { if (e.key==='Escape' && menu && !menu.hidden) { menu.hidden=true; layersBtn.setAttribute('aria-expanded','false'); layersBtn.focus(); } });
document.addEventListener('click', e => { if (menu && !menu.hidden && !menu.contains(e.target) && e.target!==layersBtn && !layersBtn.contains(e.target)) { menu.hidden = true; layersBtn.setAttribute('aria-expanded','false'); } });
const zin=document.getElementById('zin'), zout=document.getElementById('zout'), tilt=document.getElementById('tilt'), north=document.getElementById('north');
zin && zin.addEventListener('click',()=>map.zoomIn()); zout && zout.addEventListener('click',()=>map.zoomOut());
const syncTilt=()=>{ if(tilt) tilt.setAttribute('aria-pressed', String(map.getPitch()>10)); if(north) north.hidden = Math.abs(map.getBearing())<1; };
tilt && tilt.addEventListener('click',()=>map.easeTo({pitch: map.getPitch()>10?0:60, duration: matchMedia('(prefers-reduced-motion: reduce)').matches?0:900}));
north && north.addEventListener('click',()=>map.easeTo({bearing:0, duration:900}));
map.on('pitchend',syncTilt); map.on('rotateend',syncTilt); map.on('load',syncTilt);
document.querySelectorAll('[data-zone]').forEach(c => c.addEventListener('click', ()=>selectZone(c.dataset.zone==='all'?null:c.dataset.zone)));
})();
