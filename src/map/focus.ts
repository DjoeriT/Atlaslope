// What the map shows for the open card: where to look, what to dim and what to highlight. Pure; createMap.ts applies it.
import type { Bounds } from '../countries';
import type { Box, Collection } from './boundaries';

export interface Focus {
  /** Where to look: a study region, a place or a Rioja zone by id, or a point at a zoom (a guide's named spot). Null means the whole country. */
  frame: { region: string } | { place: string } | { zone: string } | { point: [number, number]; zoom: number } | null;
  /** The country a null frame shows (src/countries.ts); Spain when unset. */
  country?: string;
  /** Where a null frame looks instead of at one country: the atlas cover fits every live country. */
  bounds?: Bounds;
  /** A labelled pin at the framed point. */
  pin?: string;
  /** Places outside this study region are dimmed (null: nothing dimmed). */
  dimRegion: string | null;
  /** The highlighted place (a place id) or zone (a zone id). */
  select: string | null;
  /** The three Rioja zones are drawn while a Rioja card is open. */
  showZones: boolean;
}

type Position = [number, number];

function* positions(c: unknown): Generator<Position> {
  if (Array.isArray(c) && typeof c[0] === 'number') yield c as Position;
  else if (Array.isArray(c)) for (const x of c) yield* positions(x);
}

/** The box around some features; null for none. */
export function boundsOf(features: Collection['features']): Box | null {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  for (const f of features) {
    for (const [x, y] of positions((f.geometry as { coordinates: unknown }).coordinates)) {
      w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y);
    }
  }
  return Number.isFinite(w) ? [w, s, e, n] : null;
}

/** The features a focus frames; empty when there is nothing to frame (a place with no boundary yet). */
export function framedFeatures(frame: Exclude<NonNullable<Focus['frame']>, { point: unknown }>, places: Collection, zones: Collection): Collection['features'] {
  if ('region' in frame) return places.features.filter((f) => f.properties.region === frame.region);
  if ('place' in frame) return places.features.filter((f) => f.properties.id === frame.place);
  return zones.features.filter((f) => f.properties.id === frame.zone);
}

/** Zone features for the map: the file names zones ("Rioja Alta"); the places list ids them ("rioja-alta"). */
export function withZoneIds(zones: Collection, idOf: (name: string) => string | undefined): Collection {
  const features = zones.features.flatMap((f) => {
    const id = idOf(String(f.properties.zone));
    return id ? [{ ...f, properties: { ...f.properties, id, name: f.properties.zone } }] : [];
  });
  return { type: 'FeatureCollection', features };
}

/** Zone features from the added outlines (France's Premier and Grand Cru and their climats, #55): that file ids them already. */
export function addedZones(added: Collection, nameOf: (id: string) => string | undefined): Collection['features'] {
  return added.features.flatMap((f) => {
    const name = nameOf(String(f.properties.id));
    return name ? [{ ...f, properties: { ...f.properties, zone: name, name } }] : [];
  });
}
