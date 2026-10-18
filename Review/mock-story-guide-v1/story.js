// Story guide mock: the map follows whichever step is in the middle of the reading area. Normal scrolling, no scroll-jacking.
(function () {
  const SG = window.SG;
  const root = document.documentElement;
  const css = (n) => getComputedStyle(root).getPropertyValue(n).trim();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 61rem)');
  const PNOA = 'https://www.ign.es/wmts/pnoa-ma?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=OI.OrthoimageCoverage&STYLE=default&FORMAT=image/jpeg&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}';
  const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const DEM = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';

  const map = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      sources: {
        esri: { type: 'raster', tiles: [ESRI], tileSize: 256, maxzoom: 18, attribution: 'Esri World Imagery' },
        pnoa: { type: 'raster', tiles: [PNOA], tileSize: 256, minzoom: 8, maxzoom: 19, bounds: [-9.5, 35.8, 4.4, 43.9], attribution: 'PNOA © IGN' },
        dem: { type: 'raster-dem', tiles: [DEM], tileSize: 256, maxzoom: 14, encoding: 'terrarium', attribution: 'Terrain: Mapzen' },
        do: { type: 'geojson', data: SG.do },
        zones: { type: 'geojson', data: SG.zones, promoteId: 'id' },
        masks: { type: 'geojson', data: SG.masks },
      },
      layers: [
        { id: 'bg', type: 'background', paint: { 'background-color': '#0b1016' } },
        { id: 'esri', type: 'raster', source: 'esri' },
        { id: 'pnoa', type: 'raster', source: 'pnoa' },
        { id: 'shade', type: 'background', paint: { 'background-color': '#000', 'background-opacity': 0.18 } },
        { id: 'mask', type: 'fill', source: 'masks', filter: ['==', ['get', 'id'], 'rioja'], paint: { 'fill-color': '#000', 'fill-opacity': 0.42 } },
        { id: 'zone-line', type: 'line', source: 'zones', paint: { 'line-color': '#fff', 'line-width': ['case', ['boolean', ['feature-state', 'on'], false], 2.5, 1], 'line-opacity': 0 } },
        { id: 'do-line', type: 'line', source: 'do', paint: { 'line-color': '#fff', 'line-width': 2.5, 'line-opacity': 0.95 } },
      ],
    },
    center: SG.views.intro.center, zoom: SG.views.intro.zoom,
    scrollZoom: false, keyboard: false, dragRotate: true, touchPitch: false, attributionControl: false, maxPitch: 70,
  });
  window.__map = map;
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'top-right');

  function paintTheme() {
    const a = css('--accent');
    if (!ready) return;
    map.setPaintProperty('do-line', 'line-color', a);
    map.setPaintProperty('zone-line', 'line-color', root.dataset.theme === 'dark' ? a : '#fff');
  }

  let ready = false;
  map.on('load', () => {
    ready = true;
    map.setTerrain({ source: 'dem', exaggeration: 1.4 });
    paintTheme();
    go(current || 'intro', true);
  });

  // markers
  let markers = [];
  const zoneLabels = {};
  function clearMarkers() { markers.forEach((m) => m.remove()); markers = []; }
  function el(cls, text) { const d = document.createElement('div'); d.className = cls; if (text) d.textContent = text; return d; }
  const zoneNames = { 'rioja-alta': 'Rioja Alta', 'rioja-alavesa': 'Rioja Alavesa', 'rioja-oriental': 'Rioja Oriental' };
  for (const id in SG.labels) {
    zoneLabels[id] = new maplibregl.Marker({ element: el('mk zl', zoneNames[id]) }).setLngLat(SG.labels[id]);
  }

  const chip = document.querySelector('.chip');
  const recentre = document.querySelector('.recentre');
  let current = null, userMoved = false;

  function padding() {
    const r = map.getContainer().getBoundingClientRect();
    const p = Math.round(Math.min(r.width, r.height) * 0.12);
    return { top: p + 40, bottom: p, left: p, right: p + 30 };
  }

  function go(id, instant) {
    const v = SG.views[id];
    if (!v) return;
    chip.textContent = v.chip || '';
    if (!ready) { current = id; return; }
    current = id;
    userMoved = false;
    recentre.hidden = true;

    // highlight
    for (const z of ['rioja-alta', 'rioja-alavesa', 'rioja-oriental']) {
      const on = v.focus === z || v.focus === 'zones';
      map.setFeatureState({ source: 'zones', id: z }, { on: v.focus === z });
      const lab = zoneLabels[z];
      if (v.zonelabels && (v.focus === 'zones' || v.focus === z)) {
        lab.addTo(map);
        lab.getElement().classList.toggle('on', v.focus === z);
        lab.getElement().classList.toggle('off', v.focus !== z && v.focus !== 'zones');
      } else lab.remove();
      void on;
    }
    map.setFilter('mask', ['==', ['get', 'id'], v.focus === 'zones' ? 'rioja' : v.focus]);
    const zonesShown = v.focus !== 'rioja';
    map.setPaintProperty('zone-line', 'line-opacity', zonesShown ? 0.9 : 0);

    clearMarkers();
    (v.markers || []).forEach(([name, ll]) => markers.push(new maplibregl.Marker({ element: el('mk', name) }).setLngLat(ll).addTo(map)));
    if (v.dot) markers.push(new maplibregl.Marker({ element: el('dot') }).setLngLat(v.dot).addTo(map));

    const jump = instant || reduce.matches;
    const opts = { pitch: v.pitch || 0, bearing: v.bearing || 0, padding: padding() };
    if (v.bounds) {
      const cam = map.cameraForBounds(v.bounds, { padding: opts.padding, bearing: opts.bearing });
      const target = { center: cam.center, zoom: cam.zoom, pitch: opts.pitch, bearing: opts.bearing };
      jump ? map.jumpTo(target) : map.flyTo({ ...target, speed: 0.9, curve: 1.3, maxDuration: 3200, essential: false });
    } else {
      const target = { center: v.center, zoom: v.zoom, pitch: opts.pitch, bearing: opts.bearing };
      jump ? map.jumpTo(target) : map.flyTo({ ...target, speed: 0.9, curve: 1.3, maxDuration: 3200, essential: false });
    }
  }

  // the person moved the map: offer the way back, don't fight them
  map.on('movestart', (e) => { if (e.originalEvent) { userMoved = true; recentre.hidden = false; } });
  recentre.addEventListener('click', () => go(current));

  // which step is active: the one crossing the middle of the reading area
  const steps = [...document.querySelectorAll('.step')];
  const whereN = document.querySelector('.where-n');
  // Each map move gets time to land before the next starts; while you scroll fast it goes straight to the latest step.
  const DWELL = 1600;
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
    whereN.textContent = n ? `Chapter ${n} of ${SG.chapters.length}` : '';
    want(step.dataset.view);
  }
  function pick() {
    const top = narrow.matches ? document.querySelector('.mapwrap').getBoundingClientRect().bottom : document.querySelector('.top').getBoundingClientRect().bottom;
    const mid = top + (innerHeight - top) * (narrow.matches ? 0.3 : 0.45);
    let best = steps[0];
    for (const s of steps) if (s.getBoundingClientRect().top <= mid) best = s;
    if (!best.classList.contains('is-on')) setActive(best);
    const max = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('.progress i').style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
  }
  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pick(); }); }, { passive: true });
  addEventListener('resize', () => { map.resize(); pick(); });


  // theme
  document.querySelector('.theme').addEventListener('click', () => {
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t;
    try { localStorage.setItem('sg-theme', t); } catch (e) {}
    paintTheme();
  });

  pick();
})();
