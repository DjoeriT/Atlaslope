// Story guide mock, round 3: the map follows whichever step is in the middle of the reading area. Normal scrolling, no scroll-jacking, no autoplay.
(function () {
  const SG = window.SG;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 61rem)');
  const PNOA = 'https://www.ign.es/wmts/pnoa-ma?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=OI.OrthoimageCoverage&STYLE=default&FORMAT=image/jpeg&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}';
  const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const DEM = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
  const GEO = 'https://mapas.igme.es/gis/services/Cartografia_Geologica/IGME_MAGNA_50/MapServer/WMSServer?service=WMS&version=1.3.0&request=GetMap&layers=0&styles=&format=image/png&transparent=true&crs=EPSG:3857&width=512&height=512&bbox={bbox-epsg-3857}';
  const CHAMP = '#E9D8B4';
  const NOFILTER = ['==', ['get', 'id'], ''];
  let guide = 'rioja', exag = 1.5;

  const map = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf', // stand-in face: Open Sans Semibold (house face would need its own glyph build)
      sources: {
        esri: { type: 'raster', tiles: [ESRI], tileSize: 256, maxzoom: 18 },
        pnoa: { type: 'raster', tiles: [PNOA], tileSize: 256, minzoom: 8, maxzoom: 19, bounds: [-9.5, 35.8, 4.4, 43.9] },
        dem: { type: 'raster-dem', tiles: [DEM], tileSize: 256, maxzoom: 14, encoding: 'terrarium' },
        demhs: { type: 'raster-dem', tiles: [DEM], tileSize: 256, maxzoom: 14, encoding: 'terrarium' },
        tintRioja: { type: 'image', url: SG.tints.rioja.url, coordinates: SG.tints.rioja.coordinates },
        tintPriorat: { type: 'image', url: SG.tints.priorat.url, coordinates: SG.tints.priorat.coordinates },
        focus: { type: 'geojson', data: SG.focus },
        inverse: { type: 'geojson', data: SG.inverse },
        koppen: { type: 'geojson', data: SG.koppen },
        geo: { type: 'raster', tiles: [GEO], tileSize: 512, minzoom: 10, maxzoom: 14, bounds: [-3.4, 40.9, 1.1, 42.9] },
        riversRioja: { type: 'geojson', data: SG.rivers.rioja },
        riversPriorat: { type: 'geojson', data: SG.rivers.priorat },
        namesRioja: { type: 'geojson', data: SG.names.rioja },
        namesPriorat: { type: 'geojson', data: SG.names.priorat },
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
        // Climate classes (chapter 2 only): soft fill in the app's own Köppen colours.
        { id: 'koppen', type: 'fill', source: 'koppen', layout: { visibility: 'none' }, paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.36, 'fill-antialias': false } },
        // Geology raster (soils and slate stops only).
        { id: 'geo', type: 'raster', source: 'geo', layout: { visibility: 'none' }, paint: { 'raster-opacity': 0.55, 'raster-fade-duration': 150 } },
        // Fade of the land outside the focus: black at 25% darkens without shifting the satellite hues (white would wash them out).
        { id: 'fade', type: 'fill', source: 'inverse', filter: NOFILTER, paint: { 'fill-color': '#000000', 'fill-opacity': 0.25, 'fill-antialias': false } },
        // Focus border: 3 px champagne over a 5 px dark casing.
        { id: 'focus-casing', type: 'line', source: 'focus', filter: NOFILTER, layout: { 'line-join': 'round' }, paint: { 'line-color': '#000000', 'line-width': 5.5, 'line-opacity': 0.6 } },
        { id: 'focus-line', type: 'line', source: 'focus', filter: NOFILTER, layout: { 'line-join': 'round' }, paint: { 'line-color': CHAMP, 'line-width': 3 } },
        ...['Rioja', 'Priorat'].flatMap((G) => {
          const src = 'rivers' + G;
          return [
            { id: src + '-minor', type: 'line', source: src, filter: ['==', ['get', 'main'], 0], minzoom: 9, layout: { 'line-cap': 'round', 'line-join': 'round' },
              paint: { 'line-color': '#8FB0C4', 'line-opacity': 0.8, 'line-width': ['interpolate', ['linear'], ['zoom'], 9, 0.5, 14, 1.4] } },
            { id: src + '-main', type: 'line', source: src, filter: ['==', ['get', 'main'], 1], layout: { 'line-cap': 'round', 'line-join': 'round' },
              paint: { 'line-color': '#86B0CC', 'line-opacity': 0.95, 'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 10, 2, 14, 3.6] } },
            { id: src + '-label', type: 'symbol', source: src, filter: ['==', ['get', 'main'], 1], minzoom: 8,
              layout: { 'symbol-placement': 'line', 'text-field': ['get', 'name'], 'text-font': ['Open Sans Semibold'], 'text-size': 12, 'text-letter-spacing': 0.1, 'symbol-spacing': 200, 'text-max-angle': 75 },
              paint: { 'text-color': '#DCEBF5', 'text-halo-color': 'rgba(20,28,36,.85)', 'text-halo-width': 1.6 } },
          ];
        }),
        // Place names: only those near the active stop (filter set in go()); collision-avoided by the symbol layer.
        ...['Rioja', 'Priorat'].flatMap((G) => {
          const src = 'names' + G;
          const t = (k) => ['==', ['get', 'type'], k];
          const halo = { 'text-color': '#FFFFFF', 'text-halo-color': 'rgba(20,20,20,.9)', 'text-halo-width': 1.4 };
          return [
            { id: src + '-dot', type: 'circle', source: src, filter: ['all', NOFILTER, t('town')], paint: { 'circle-radius': 2.6, 'circle-color': '#FFFFFF', 'circle-stroke-color': 'rgba(20,20,20,.9)', 'circle-stroke-width': 1 } },
            { id: src + '-town', type: 'symbol', source: src, filter: ['all', NOFILTER, t('town')],
              layout: { 'text-field': ['get', 'name'], 'text-font': ['Open Sans Semibold'], 'text-size': 13, 'text-anchor': 'left', 'text-offset': [0.6, 0], 'symbol-sort-key': 1 }, paint: halo },
            { id: src + '-range', type: 'symbol', source: src, filter: ['all', NOFILTER, t('range')],
              layout: { 'text-field': ['upcase', ['get', 'name']], 'text-font': ['Open Sans Semibold'], 'text-size': 11, 'text-letter-spacing': 0.14, 'text-max-width': 8, 'symbol-sort-key': 0 }, paint: halo },
            { id: src + '-peak', type: 'symbol', source: src, minzoom: 10, filter: ['all', NOFILTER, t('peak')],
              layout: { 'text-field': ['get', 'name'], 'text-font': ['Open Sans Semibold'], 'text-size': 11, 'text-max-width': 7, 'symbol-sort-key': 2 }, paint: halo },
          ];
        }),
      ],
    },
    center: SG.views.rioja.intro.center, zoom: SG.views.rioja.intro.zoom,
    scrollZoom: false, keyboard: false, dragRotate: true, touchPitch: false, attributionControl: false, maxPitch: 80,
  });
  window.__map = map;
  map.addControl(new maplibregl.NavigationControl({ showCompass: false, visualizePitch: true }), 'top-right');

  let flight = 0, ready = false, current = null, userMoved = false, markers = [];
  const el = (cls, text) => { const d = document.createElement('div'); d.className = cls; if (text) d.textContent = text; return d; };
  const zoneNames = { 'rioja-alta': 'Rioja Alta', 'rioja-alavesa': 'Rioja Alavesa', 'rioja-oriental': 'Rioja Oriental' };
  const zoneLabels = {};
  for (const id in SG.labels) zoneLabels[id] = new maplibregl.Marker({ element: el('mk zl', zoneNames[id]) }).setLngLat(SG.labels[id]);
  const chip = document.querySelector('.chip');
  const recentre = document.querySelector('.recentre');
  const credit = document.querySelector('.mapcredit');
  const legend = document.querySelector('.legend');
  const koppenHTML = 'Climate: ' + SG.koppenLegend.map(([n, c, sh]) => `<span><i style="background:${c}"></i><b class="lg">${n}</b><b class="sh">${sh}</b></span>`).join('');
  legend.innerHTML = koppenHTML;

  // Locator inset: the camera centre and the visible box on the outline of Spain.
  const L = SG.loc, lsvg = document.querySelector('.loc'), lbox = lsvg.querySelector('.lbox'), ldot = lsvg.querySelector('.ldot');
  const lx = (lon) => (lon * L.cosk - L.ox) * L.s, ly = (lat) => (-lat - L.oy) * L.s;
  function locate() {
    const c = map.getCenter(), b = map.getBounds();
    ldot.setAttribute('cx', lx(c.lng).toFixed(1)); ldot.setAttribute('cy', ly(c.lat).toFixed(1));
    const x0 = lx(b.getWest()), x1 = lx(b.getEast()), y0 = ly(b.getNorth()), y1 = ly(b.getSouth());
    lbox.setAttribute('x', Math.min(x0, x1).toFixed(1)); lbox.setAttribute('y', Math.min(y0, y1).toFixed(1));
    lbox.setAttribute('width', Math.max(2, Math.abs(x1 - x0)).toFixed(1)); lbox.setAttribute('height', Math.max(2, Math.abs(y1 - y0)).toFixed(1));
  }
  map.on('move', locate);

  // Names near a stop: within about the visible half-width of the target view (the filter is set before the camera moves).
  function nearNames(center, zoom, pitch) {
    const kmPerPx = 78.27 * Math.cos(center[1] * Math.PI / 180) / Math.pow(2, zoom); // 512 px world at zoom 0: 78.27 km per px
    const r = kmPerPx * Math.max(innerWidth * 0.5, 420) * (pitch > 40 ? 1.7 : 1.15);
    const near = [], skip = new Set((SG.views[guide][current] && SG.views[guide][current].markers || []).map((m) => m[0]));
    for (const f of SG.names[guide].features) {
      const [lon, lat] = f.geometry.coordinates;
      const dx = (lon - center[0]) * 111.3 * Math.cos(center[1] * Math.PI / 180), dy = (lat - center[1]) * 111.2;
      if (Math.hypot(dx, dy) <= r && !skip.has(f.properties.name)) near.push(f.properties.name);
    }
    return near;
  }
  function setNames(near) {
    for (const G of ['Rioja', 'Priorat']) {
      const on = G.toLowerCase() === guide;
      const f = on ? ['in', ['get', 'name'], ['literal', near]] : NOFILTER;
      for (const k of ['dot', 'town', 'range', 'peak']) {
        const type = k === 'dot' ? 'town' : k;
        map.setFilter('names' + G + '-' + k, ['all', f, ['==', ['get', 'type'], type]]);
      }
    }
  }

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

  // fact markers: a small black card with one sentence from the guide and its source; Escape closes and returns focus
  let pop = null, popFrom = null;
  function closeFact(refocus) {
    if (pop) { const p = pop; pop = null; p.remove(); if (refocus && popFrom) popFrom.focus(); }
  }
  function openFact(f, btn) {
    closeFact(false);
    const root = document.createElement('div');
    const w = document.createElement('p'); w.className = 'fw'; w.textContent = f.where;
    const t = document.createElement('p'); t.className = 'ft'; t.textContent = f.text;
    const s = document.createElement('p'); s.className = 'fs'; s.innerHTML = f.src;
    root.append(w, t, s);
    popFrom = btn;
    pop = new maplibregl.Popup({ className: 'factpop', offset: 16, maxWidth: '15rem', closeButton: true, closeOnClick: true, focusAfterOpen: true }).setLngLat(f.ll).setDOMContent(root).addTo(map);
    pop.on('close', () => { if (pop) pop = null; });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFact(true); });

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
    map.setFilter('fade', v.focus === 'zones' ? ['==', ['get', 'id'], 'zones'] : f);
    // climate fill + legend, geology raster and its credit, only where the view asks for them
    map.setLayoutProperty('koppen', 'visibility', v.koppen ? 'visible' : 'none');
    legend.hidden = !v.koppen;
    map.setLayoutProperty('geo', 'visibility', v.geo ? 'visible' : 'none');
    credit.classList.toggle('with-geo', !!v.geo); credit.classList.toggle('with-kop', !!v.koppen);
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
    closeFact(false);
    (v.facts || []).forEach((f) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'fk'; b.setAttribute('aria-label', 'Fact: ' + f.where);
      b.addEventListener('click', (e) => { e.stopPropagation(); openFact(f, b); });
      markers.push(new maplibregl.Marker({ element: b }).setLngLat(f.ll).addTo(map));
    });
    // the legend line doubles for geology: the service's own legend lists about 230 numbered colours and no names
    if (v.geo) { legend.textContent = 'Colours: rock types, IGME MAGNA 50'; legend.hidden = false; } else legend.innerHTML = koppenHTML;

    const pitch = v.pitch || 0, bearing = v.bearing || 0;
    let target;
    if (v.bounds && !v.center) {
      const cam = map.cameraForBounds(v.bounds, { padding: padding() });
      target = { center: cam.center, zoom: cam.zoom + (v.zadj !== undefined ? v.zadj : pitch > 0 ? -0.3 : 0), pitch, bearing };
    } else target = { center: v.center, zoom: v.zoom, pitch, bearing };
    setNames(nearNames(target.center.lng !== undefined ? [target.center.lng, target.center.lat] : target.center, target.zoom, pitch));
    const token = ++flight;
    if (instant || reduce.matches) { map.jumpTo(target); return; } // jumps: first load and prefers-reduced-motion only
    const c = map.getCenter(), from = map.getZoom();
    const to = target.zoom, dz = Math.abs(to - from);
    const km = Math.hypot((c.lng - (target.center.lng ?? target.center[0])) * 80, (c.lat - (target.center.lat ?? target.center[1])) * 111);
    if (dz > 3.5 || km > 150) {
      // big gap: leg 1 swings over to the target at a mid zoom, leg 2 comes in (or out) to the final frame
      const mid = to > from ? Math.max(from, to - 3.2) : Math.min(from, to + 3.2);
      map.flyTo({ center: target.center, zoom: mid, pitch: (pitch + map.getPitch()) / 2, bearing, duration: 2400, curve: 1.5, essential: true });
      map.once('moveend', () => { if (token === flight) map.flyTo({ ...target, duration: 2600, curve: 1.3, essential: true }); });
    } else map.flyTo({ ...target, duration: Math.min(4000, 2500 + dz * 250 + km * 6), curve: 1.4, essential: true });
  }

  map.on('movestart', (e) => { if (e.originalEvent) { userMoved = true; recentre.hidden = false; } });
  recentre.addEventListener('click', () => go(current));

  // steps of the guide on show
  let steps = [];
  const whereN = document.querySelector('.where-n');
  const DWELL = 2200; // each map move gets time to land before the next starts
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
