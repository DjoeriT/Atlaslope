// Story guide mock, round 2: the map follows whichever step is in the middle of the reading area. Normal scrolling, no scroll-jacking, no autoplay.
(function () {
  const SG = window.SG;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 61rem)');
  const PNOA = 'https://www.ign.es/wmts/pnoa-ma?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=OI.OrthoimageCoverage&STYLE=default&FORMAT=image/jpeg&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}';
  const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const DEM = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
  const CHAMP = '#E9D8B4';
  let guide = 'rioja', exag = 1.5;

  const map = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      sources: {
        esri: { type: 'raster', tiles: [ESRI], tileSize: 256, maxzoom: 18 },
        pnoa: { type: 'raster', tiles: [PNOA], tileSize: 256, minzoom: 8, maxzoom: 19, bounds: [-9.5, 35.8, 4.4, 43.9] },
        dem: { type: 'raster-dem', tiles: [DEM], tileSize: 256, maxzoom: 14, encoding: 'terrarium' },
        demhs: { type: 'raster-dem', tiles: [DEM], tileSize: 256, maxzoom: 14, encoding: 'terrarium' },
        tintRioja: { type: 'image', url: SG.tints.rioja.url, coordinates: SG.tints.rioja.coordinates },
        tintPriorat: { type: 'image', url: SG.tints.priorat.url, coordinates: SG.tints.priorat.coordinates },
        focus: { type: 'geojson', data: SG.focus },
      },
      layers: [
        { id: 'bg', type: 'background', paint: { 'background-color': '#1b1b1b' } },
        { id: 'esri', type: 'raster', source: 'esri' },
        { id: 'pnoa', type: 'raster', source: 'pnoa' },
        // Low sun so slopes read: light from the west-north-west, strong relief, soft highlight (design choice).
        { id: 'hs', type: 'hillshade', source: 'demhs', paint: {
          'hillshade-illumination-direction': 295, 'hillshade-illumination-anchor': 'map', 'hillshade-exaggeration': 0.7,
          'hillshade-shadow-color': '#1a1410', 'hillshade-highlight-color': '#fff6e0', 'hillshade-accent-color': '#3a2a1a' } },
        { id: 'tintRioja', type: 'raster', source: 'tintRioja', paint: { 'raster-resampling': 'linear', 'raster-fade-duration': 0 } },
        { id: 'tintPriorat', type: 'raster', source: 'tintPriorat', paint: { 'raster-resampling': 'linear', 'raster-fade-duration': 0 } },
        // Thin outline of the focus area; the landscape stays bright (no dimming).
        { id: 'focus-casing', type: 'line', source: 'focus', filter: ['==', ['get', 'id'], ''], paint: { 'line-color': '#141414', 'line-width': 4, 'line-opacity': 0.55, 'line-blur': 1 } },
        { id: 'focus-line', type: 'line', source: 'focus', filter: ['==', ['get', 'id'], ''], paint: { 'line-color': CHAMP, 'line-width': 1.8 } },
      ],
    },
    center: SG.views.rioja.intro.center, zoom: SG.views.rioja.intro.zoom,
    scrollZoom: false, keyboard: false, dragRotate: true, touchPitch: false, attributionControl: false, maxPitch: 80,
  });
  window.__map = map;
  map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'top-right');

  let ready = false, current = null, userMoved = false, markers = [];
  const el = (cls, text) => { const d = document.createElement('div'); d.className = cls; if (text) d.textContent = text; return d; };
  const zoneNames = { 'rioja-alta': 'Rioja Alta', 'rioja-alavesa': 'Rioja Alavesa', 'rioja-oriental': 'Rioja Oriental' };
  const zoneLabels = {};
  for (const id in SG.labels) zoneLabels[id] = new maplibregl.Marker({ element: el('mk zl', zoneNames[id]) }).setLngLat(SG.labels[id]);
  const chip = document.querySelector('.chip');
  const recentre = document.querySelector('.recentre');

  function setTint() {
    map.setLayoutProperty('tintRioja', 'visibility', 'visible');
    map.setLayoutProperty('tintPriorat', 'visibility', 'visible');
  }
  function setExag(k) {
    exag = k;
    map.setTerrain({ source: 'dem', exaggeration: k });
    document.querySelector('.kx').textContent = k.toFixed(1);
    document.querySelectorAll('.exag button').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.k === k)));
  }
  map.on('load', () => { ready = true; setTint(); setExag(exag); go(current || 'intro', true); });
  document.querySelectorAll('.exag button').forEach((b) => b.addEventListener('click', () => setExag(+b.dataset.k)));

  function padding() {
    const r = map.getContainer().getBoundingClientRect();
    const p = Math.round(Math.min(r.width, r.height) * 0.1);
    return { top: p + 40, bottom: p + 30, left: p, right: p + 30 };
  }

  function go(id, instant) {
    const v = SG.views[guide][id];
    if (!v) return;
    chip.textContent = v.chip || '';
    current = id;
    if (!ready) return;
    userMoved = false; recentre.hidden = true;

    // outline of the focus area (decision: outline, not dimming)
    const ids = v.focus === 'zones' ? ['rioja-alta', 'rioja-alavesa', 'rioja-oriental'] : [v.focus];
    const f = ['in', ['get', 'id'], ['literal', ids]];
    map.setFilter('focus-casing', f); map.setFilter('focus-line', f);
    for (const z in zoneLabels) {
      const lab = zoneLabels[z];
      if (v.zonelabels && (v.focus === 'zones' || v.focus === z)) {
        lab.addTo(map);
        lab.getElement().classList.toggle('on', v.focus === z);
        lab.getElement().classList.toggle('off', v.focus !== z && v.focus !== 'zones');
      } else lab.remove();
    }
    markers.forEach((m) => m.remove()); markers = [];
    (v.markers || []).forEach(([name, ll]) => markers.push(new maplibregl.Marker({ element: el('mk', name) }).setLngLat(ll).addTo(map)));
    if (v.dot) markers.push(new maplibregl.Marker({ element: el('dot') }).setLngLat(v.dot).addTo(map));

    const pitch = v.pitch || 0, bearing = v.bearing || 0;
    let target;
    if (v.bounds && !v.center) {
      const cam = map.cameraForBounds(v.bounds, { padding: padding() });
      target = { center: cam.center, zoom: cam.zoom + (v.zadj !== undefined ? v.zadj : pitch > 0 ? -0.3 : 0), pitch, bearing };
    } else target = { center: v.center, zoom: v.zoom, pitch, bearing };
    if (instant || reduce.matches) map.jumpTo(target);
    else map.flyTo({ ...target, speed: 0.9, curve: 1.3, maxDuration: 3200, essential: false });
  }

  map.on('movestart', (e) => { if (e.originalEvent) { userMoved = true; recentre.hidden = false; } });
  recentre.addEventListener('click', () => go(current));

  // steps of the guide on show
  let steps = [];
  const whereN = document.querySelector('.where-n');
  const DWELL = 1600; // each map move gets time to land before the next starts
  let lastGo = 0, wanted = null, timer = 0;
  function want(id) {
    wanted = id;
    clearTimeout(timer);
    const wait = reduce.matches ? 0 : Math.max(0, lastGo + DWELL - performance.now());
    const run = () => { if (wanted !== current) { lastGo = performance.now(); go(wanted); } };
    if (wait) timer = setTimeout(run, wait); else run();
  }
  function setActive(step) {
    steps.forEach((s) => { s.classList.toggle('is-on', s === step); if (s === step) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current'); });
    const n = +step.dataset.ch;
    whereN.textContent = n ? `Chapter ${n} of ${SG.chapters[guide].length}` : '';
    want(step.dataset.view);
  }
  function pick() {
    if (!steps.length) return;
    const sg = document.getElementById('story').getBoundingClientRect();
    const mapB = document.querySelector('.mapwrap').getBoundingClientRect().bottom;
    const top = narrow.matches ? mapB : document.querySelector('.top').getBoundingClientRect().bottom;
    const mid = top + (innerHeight - top) * (narrow.matches ? 0.3 : 0.45);
    let best = steps[0];
    for (const s of steps) if (s.getBoundingClientRect().top <= mid) best = s;
    if (!best.classList.contains('is-on')) setActive(best);
    const max = sg.height - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, -sg.top / max)) : 0;
    document.querySelector('.progress i').style.setProperty('--p', p.toFixed(4));
  }
  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pick(); }); }, { passive: true });
  addEventListener('resize', () => { map.resize(); pick(); });

  // Rioja / Priorat switch
  function setGuide(g, scroll) {
    guide = g;
    document.querySelectorAll('.text,.opt-body').forEach((t) => { t.hidden = t.dataset.guide !== g; });
    document.querySelectorAll('.switch button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.guide === g)));
    const name = g === 'rioja' ? 'Rioja' : 'Priorat';
    const back = document.querySelector('.back'); back.textContent = 'Back to ' + name; back.href = SG.back[g];
    steps = [...document.querySelectorAll(`.text[data-guide="${g}"] .step`)];
    clearTimeout(timer); lastGo = 0; current = null;
    steps.forEach((s) => s.classList.remove('is-on'));
    if (scroll) document.getElementById('story').scrollIntoView({ behavior: 'auto' });
    pick();
    if (ready) { const first = steps[0]; setActive(first); go('intro', true); }
  }
  document.querySelectorAll('.switch button').forEach((b) => b.addEventListener('click', () => setGuide(b.dataset.guide, document.getElementById('story').getBoundingClientRect().top < 0)));

  // the entry buttons open the story
  document.querySelectorAll('[data-go="story"]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('story').scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth' });
  }));

  const q = new URLSearchParams(location.search).get('guide');
  setGuide(q === 'priorat' ? 'priorat' : 'rioja', false);
})();
