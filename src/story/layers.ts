// The story's own map layers: the slope tint, climate (Köppen), geology, rivers and names, with the one-line legend (build card 4).
// storyMap.ts calls `setup` once the map has loaded and `show` on every step; `show` returns what is on the map now, for the credit line.
// Colours, widths and opacities are design choices from the approved mock (Review/mock-story-guide-v3/README.md, "Fact or design choice").
import type { ExpressionSpecification, FilterSpecification, Map as MapLibreMap } from 'maplibre-gl';
import koppenUrl from '../../data/koppen-spain.geojson?url';
import zonesUrl from '../../data/rioja-zones.geojson?url';
import namesRioja from '../../data/story/names-rioja.geojson?url';
import namesPriorat from '../../data/story/names-priorat.geojson?url';
import riversRioja from '../../data/story/rivers-rioja.geojson?url';
import riversPriorat from '../../data/story/rivers-priorat.geojson?url';
import slopeRioja from '../../data/story/slope-rioja.png?url';
import slopePriorat from '../../data/story/slope-priorat.png?url';
import slopeTints from '../../data/story/slope-tints.json';
import { CLIMATE_GROUPS, NO_CLIMATE_COLOR } from '../map/climate';
import { strings } from '../strings';
import type { Cam } from './camera';
import { legendClasses, nearNames, type NamePoint } from './layerRules';
import type { LngLat, Story } from './format';
import type { StopView } from './storyMap';
import type { Credited } from './view';

export interface StoryLayers {
  setup(map: MapLibreMap, story: Story): void;
  /** `cam` is where the camera is going (null: not known yet, the map's own camera stands in). */
  show(map: MapLibreMap, view: StopView, cam: Pick<Cam, 'center' | 'zoom' | 'pitch'> | null): Credited[];
  remove(): void;
}

const FONT = ['Plex Sans Medium'];
const FILES: Record<string, { names: string; rivers: string; slope: string }> = {
  rioja: { names: namesRioja, rivers: riversRioja, slope: slopeRioja },
  priorat: { names: namesPriorat, rivers: riversPriorat, slope: slopePriorat },
};
const GEOLOGY = 'https://mapas.igme.es/gis/services/Cartografia_Geologica/IGME_MAGNA_50/MapServer/WMSServer?service=WMS&version=1.3.0&request=GetMap&layers=0&styles=&format=image/png&transparent=true&crs=EPSG:3857&width=512&height=512&bbox={bbox-epsg-3857}';
const KINDS = ['dot', 'town', 'range', 'peak'] as const;
const HALO = { 'text-color': '#FFFFFF', 'text-halo-color': 'rgba(20,20,20,.9)', 'text-halo-width': 1.4 };
const NONE: never[] = [];

export function storyLayers(): StoryLayers {
  let story: Story | null = null;
  let names: NamePoint[] = [];
  let legend: HTMLElement | null = null;
  let last: { map: MapLibreMap; view: StopView; cam: Pick<Cam, 'center' | 'zoom' | 'pitch'> | null } | null = null;
  const added = new Set<string>();

  const vis = (map: MapLibreMap, id: string, on: boolean) => { if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none'); };

  // The climate shapes are about 1 MB and the geology streams tiles: both are added only when a step first asks for them.
  function ensure(map: MapLibreMap, what: 'koppen' | 'geology') {
    if (added.has(what)) return;
    added.add(what);
    if (what === 'koppen') {
      map.addSource('story-koppen', { type: 'geojson', data: koppenUrl });
      map.addLayer({
        id: 'story-koppen', type: 'fill', source: 'story-koppen', filter: ['==', ['get', 'box'], 'main'], layout: { visibility: 'none' },
        paint: {
          'fill-color': ['match', ['get', 'code'], ...CLIMATE_GROUPS.flatMap((g) => g.codes.flatMap((c) => [c, g.color])), NO_CLIMATE_COLOR] as unknown as ExpressionSpecification,
          'fill-opacity': 0.36, 'fill-antialias': false,
        },
      }, 'story-fade');
    } else {
      map.addSource('story-geology', { type: 'raster', tiles: [GEOLOGY], tileSize: 512, minzoom: 10 });
      map.addLayer({ id: 'story-geology', type: 'raster', source: 'story-geology', layout: { visibility: 'none' }, paint: { 'raster-opacity': 0.55, 'raster-fade-duration': 150 } }, 'story-fade');
    }
  }

  function showLegend(view: StopView, climate: boolean, geology: boolean) {
    if (!legend) return;
    const l = strings.story.legend;
    legend.replaceChildren();
    legend.hidden = !(climate || geology);
    if (geology) { legend.textContent = l.geology; return; } // the service's own legend lists about 230 numbered colours and no names
    if (!climate) return;
    legend.append(l.climate);
    for (const c of legendClasses(view.step.focus)) {
      const item = document.createElement('span');
      const swatch = document.createElement('i');
      swatch.style.background = c.color;
      const long = document.createElement('b'), short = document.createElement('b');
      long.className = 'lg'; long.textContent = c.label;
      short.className = 'sh'; short.textContent = c.short;
      item.append(swatch, long, short);
      legend.append(item);
    }
  }

  function showNames(map: MapLibreMap, view: StopView, cam: Pick<Cam, 'center' | 'zoom' | 'pitch'> | null) {
    const c = map.getCenter();
    const at = cam ?? { center: [c.lng, c.lat] as LngLat, zoom: map.getZoom(), pitch: map.getPitch() };
    const near = nearNames(names, at, window.innerWidth, view.markers.map((m) => m.label));
    for (const k of KINDS) {
      map.setFilter(`story-names-${k}`, ['all', ['in', ['get', 'name'], ['literal', near]], ['==', ['get', 'kind'], k === 'dot' ? 'town' : k]]);
    }
  }

  return {
    setup(map, s) {
      story = s;
      const f = FILES[s.id];
      if (!f) return;
      const t = (slopeTints as Record<string, { coordinates: number[][] }>)[s.id];
      map.addSource('story-slope', { type: 'image', url: f.slope, coordinates: t.coordinates as [LngLat, LngLat, LngLat, LngLat] });
      map.addLayer({ id: 'story-slope', type: 'raster', source: 'story-slope', paint: { 'raster-resampling': 'linear', 'raster-fade-duration': 0 } }, 'story-fade');

      map.addSource('story-rivers', { type: 'geojson', data: f.rivers });
      const main: FilterSpecification = ['==', ['get', 'main'], true];
      map.addLayer({ id: 'story-rivers-minor', type: 'line', source: 'story-rivers', filter: ['!=', ['get', 'main'], true], minzoom: 9, layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#8FB0C4', 'line-opacity': 0.8, 'line-width': ['interpolate', ['linear'], ['zoom'], 9, 0.5, 14, 1.4] } });
      map.addLayer({ id: 'story-rivers-main', type: 'line', source: 'story-rivers', filter: main, layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#86B0CC', 'line-opacity': 0.95, 'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 10, 2, 14, 3.6] } });
      map.addLayer({ id: 'story-rivers-label', type: 'symbol', source: 'story-rivers', filter: main, minzoom: 8,
        layout: { 'symbol-placement': 'line', 'text-field': ['get', 'name'], 'text-font': FONT, 'text-size': 12, 'text-letter-spacing': 0.1, 'symbol-spacing': 200, 'text-max-angle': 75 },
        paint: { 'text-color': '#DCEBF5', 'text-halo-color': 'rgba(20,28,36,.85)', 'text-halo-width': 1.6 } });

      // Names: every one is in the source; only those near the stop pass the filter that `show` sets.
      map.addSource('story-names', { type: 'geojson', data: f.names });
      const hide: FilterSpecification = ['in', ['get', 'name'], ['literal', NONE]];
      const of = (k: string): FilterSpecification => ['all', hide, ['==', ['get', 'kind'], k]];
      map.addLayer({ id: 'story-names-dot', type: 'circle', source: 'story-names', filter: of('town'),
        paint: { 'circle-radius': 2.6, 'circle-color': '#FFFFFF', 'circle-stroke-color': 'rgba(20,20,20,.9)', 'circle-stroke-width': 1 } });
      map.addLayer({ id: 'story-names-town', type: 'symbol', source: 'story-names', filter: of('town'),
        layout: { 'text-field': ['get', 'name'], 'text-font': FONT, 'text-size': 13, 'text-anchor': 'left', 'text-offset': [0.6, 0], 'symbol-sort-key': 1 }, paint: HALO });
      map.addLayer({ id: 'story-names-range', type: 'symbol', source: 'story-names', filter: of('range'),
        layout: { 'text-field': ['upcase', ['get', 'name']], 'text-font': FONT, 'text-size': 11, 'text-letter-spacing': 0.14, 'text-max-width': 8, 'symbol-sort-key': 0 }, paint: HALO });
      map.addLayer({ id: 'story-names-peak', type: 'symbol', source: 'story-names', minzoom: 10, filter: of('peak'),
        layout: { 'text-field': ['get', 'name'], 'text-font': FONT, 'text-size': 11, 'text-max-width': 7, 'symbol-sort-key': 2 }, paint: HALO });

      // The three Rioja zone names (step layer "zonelabels", the climate and zone steps); the polygon source puts each name inside its zone.
      if (s.id === 'rioja') {
        map.addSource('story-zones', { type: 'geojson', data: zonesUrl });
        map.addLayer({ id: 'story-zonelabels', type: 'symbol', source: 'story-zones', layout: { visibility: 'none', 'text-field': ['upcase', ['get', 'zone']], 'text-font': FONT, 'text-size': 13, 'text-letter-spacing': 0.14, 'text-max-width': 6 }, paint: HALO });
      }

      legend = document.createElement('p');
      legend.className = 'story-legend';
      legend.hidden = true;
      map.getContainer().append(legend);

      // The positions the radius filter needs; the filter is applied again once they are in.
      void fetch(f.names).then((r) => r.json()).then((fc: { features: Array<{ properties: { name: string }; geometry: { coordinates: LngLat } }> }) => {
        names = fc.features.map((g) => ({ name: g.properties.name, at: g.geometry.coordinates }));
        if (last && story === s) showNames(last.map, last.view, last.cam);
      }).catch(() => {});
    },

    show(map, view, cam) {
      last = { map, view, cam };
      const on = view.step.layers ?? [];
      const koppen = on.includes('koppen'), geology = on.includes('geology');
      if (koppen) ensure(map, 'koppen');
      if (geology) ensure(map, 'geology');
      vis(map, 'story-koppen', koppen);
      vis(map, 'story-geology', geology);
      vis(map, 'story-zonelabels', on.includes('zonelabels'));
      showLegend(view, koppen, geology);
      if (map.getLayer('story-names-town')) showNames(map, view, cam);
      return ['rivers', ...on];
    },

    remove() { legend?.remove(); legend = null; last = null; },
  };
}
