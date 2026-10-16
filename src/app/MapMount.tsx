import { strings } from '../strings';

/** Empty mount point for the map. Card 3 creates the MapLibre map in this element (src/map/); the shell owns only the element. */
export function MapMount() {
  return <div id="map" role="application" aria-label={strings.mapMountLabel} />;
}
