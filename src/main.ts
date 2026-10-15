// Entry point. Today: a base map of Spain and nothing else. Layers, the atlas panel and the quiz come with their own cards.
import maplibregl from 'maplibre-gl';
import { debugFlags } from './debug';
import { SPAIN_CENTER, SPAIN_ZOOM } from './geo';

const status = document.getElementById('status')!;
const flags = debugFlags(location.search);

const map = new maplibregl.Map({
  container: 'map',
  // OpenFreeMap: free OSM vector tiles, no key; MapLibre adds the attribution. See data/SOURCES.md once layers exist.
  style: flags.fixture ? { version: 8, sources: {}, layers: [] } : 'https://tiles.openfreemap.org/styles/liberty',
  center: SPAIN_CENTER,
  zoom: SPAIN_ZOOM,
});

map.on('load', () => {
  status.textContent = flags.fixture ? `Fixture: ${flags.fixture}` : 'Spain';
  document.body.dataset.ready = 'true';
});
