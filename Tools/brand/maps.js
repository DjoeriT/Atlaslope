// Brand round 1: draws the real Rioja and Spain layers (made by Tools/brand/make_assets.py) into an element.
// Atlas.mount(el, 'rioja' | 'spain', opts) -> Promise. Every colour comes from opts, so each direction styles its own map.
//
// opts (all optional):
//   view: [x, y, w, h]          crop in frame pixels (rioja frame 1800 x ~1205, spain 1600 x 1222); default whole frame
//   bg: '#fff'                  paper colour behind everything
//   relief: { opacity: .5, blend: 'multiply' }   hillshade image; omit or false for none
//   tint: { opacity: .3, blend: 'multiply' }     grey elevation image (dark = low, light = high); omit for none
//   contours: { step: 100, stroke: '#000', width: .6, index: 500, indexStroke: '#000', indexWidth: 1.2, opacity: 1 }   rioja only
//   zones: { stroke, width, fill, opacity, highlight: 'Rioja Alta', highlightFill, highlightStroke, highlightWidth }      rioja only
//   land: { fill, stroke, width }                spain only
//   dops: { stroke, width, fill, opacity }       spain only
//   rioja: { fill, stroke, width }               spain only: the Rioja DOCa outline
//   pins: { names: ['Haro', 'Logroño'], color, size, font, fontSize, labels: true }   rioja only
//   grid: { every: 100, stroke, width, opacity }  a plain frame-pixel grid (no fake coordinates)
// Pin names available: Haro, Logroño, Laguardia, Alfaro, Nájera, Calahorra.
(function () {
  const base = (document.currentScript && document.currentScript.src.replace(/maps\.js.*$/, '')) || 'assets/';
  const cache = {};
  const load = (n) => (cache[n] ||= fetch(base + n + '.json').then((r) => r.json()));
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  async function mount(el, which, o = {}) {
    const d = await load(which);
    const W = d.frame.w, H = d.frame.h;
    const [vx, vy, vw, vh] = o.view || [0, 0, W, H];
    const s = [];
    s.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" preserveAspectRatio="xMidYMid slice" style="display:block;width:100%;height:100%">`);
    if (o.bg) s.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${o.bg}"/>`);
    // Portugal, France and Andorra as quiet land, so they never read as sea
    if (which === 'spain' && o.land) s.push(`<path d="${d.neighbours}" fill="${(o.neighbours && o.neighbours.fill) || o.land.fill || '#ddd'}" fill-opacity="${(o.neighbours && o.neighbours.opacity) ?? .45}" stroke="none"/>`);
    if (which === 'spain' && o.land) s.push(`<path d="${d.land}" fill="${o.land.fill || 'none'}" stroke="${o.land.stroke || 'none'}" stroke-width="${o.land.width || 1}"/>`);
    // On the Spain map, relief and tint stay on land so the sea keeps its own colour
    const uid = 'm' + Math.random().toString(36).slice(2, 8);
    const clip = which === 'spain' ? ` clip-path="url(#${uid})"` : '';
    if (which === 'spain') s.push(`<defs><clipPath id="${uid}"><path d="${d.land}"/></clipPath></defs>`);
    if (o.tint) s.push(`<image href="${base}${which}-dem.png" width="${W}" height="${H}"${clip} opacity="${o.tint.opacity ?? .3}" style="mix-blend-mode:${o.tint.blend || 'multiply'}"/>`);
    if (o.relief) s.push(`<image href="${base}${which}-relief.png" width="${W}" height="${H}"${clip} opacity="${o.relief.opacity ?? .5}" style="mix-blend-mode:${o.relief.blend || 'multiply'}"/>`);
    if (o.grid) {
      const g = o.grid, e = g.every || 100;
      let p = '';
      for (let x = 0; x <= W; x += e) p += `M${x},0V${H}`;
      for (let y = 0; y <= H; y += e) p += `M0,${y}H${W}`;
      s.push(`<path d="${p}" fill="none" stroke="${g.stroke || '#000'}" stroke-width="${g.width || .5}" opacity="${g.opacity ?? .3}" vector-effect="non-scaling-stroke"/>`);
    }
    if (which === 'rioja' && o.contours) {
      const c = o.contours, step = c.step || 100, idx = c.index || 500;
      for (const [lvl, p] of Object.entries(d.contours)) {
        const v = +lvl;
        if (v % step) continue;
        const isIdx = v % idx === 0;
        s.push(`<path d="${p}" fill="none" stroke="${isIdx ? (c.indexStroke || c.stroke || '#000') : (c.stroke || '#000')}" stroke-width="${isIdx ? (c.indexWidth || 1.2) : (c.width || .6)}" opacity="${c.opacity ?? 1}" stroke-linejoin="round"/>`);
      }
    }
    if (which === 'spain' && o.dops) {
      const p = Object.values(d.dops).join('');
      s.push(`<path d="${p}" fill="${o.dops.fill || 'none'}" fill-opacity="${o.dops.opacity ?? 1}" stroke="${o.dops.stroke || '#000'}" stroke-width="${o.dops.width || .6}" stroke-linejoin="round"/>`);
    }
    if (which === 'spain' && o.rioja) s.push(`<path d="${d.rioja}" fill="${o.rioja.fill || 'none'}" stroke="${o.rioja.stroke || '#000'}" stroke-width="${o.rioja.width || 1.5}" stroke-linejoin="round"/>`);
    if (which === 'rioja' && o.zones) {
      const z = o.zones;
      for (const [n, p] of Object.entries(d.zones)) {
        const hi = n === z.highlight;
        s.push(`<path d="${p}" fill="${hi ? (z.highlightFill || z.fill || 'none') : (z.fill || 'none')}" fill-opacity="${z.opacity ?? 1}" stroke="${hi ? (z.highlightStroke || z.stroke || '#000') : (z.stroke || '#000')}" stroke-width="${hi ? (z.highlightWidth || z.width || 2) : (z.width || 1)}" stroke-linejoin="round"/>`);
      }
    }
    if (which === 'rioja' && o.pins) {
      const p = o.pins, r = p.size || 5;
      for (const n of p.names || Object.keys(d.pins)) {
        const [x, y] = d.pins[n] || [];
        if (x == null) continue;
        s.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${p.color || '#000'}"/>`);
        if (p.labels !== false) s.push(`<text x="${x + r + 4}" y="${y + 4}" font-family="${p.font || 'sans-serif'}" font-size="${p.fontSize || 16}" fill="${p.color || '#000'}">${esc(n)}</text>`);
      }
    }
    s.push('</svg>');
    el.innerHTML = s.join('');
    return d;
  }
  window.Atlas = { mount, load, credit: (w) => load(w).then((d) => d.credit) };
})();
