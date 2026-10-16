// The shape of data/places.json (built by Tools/data/build_places.py). A second country joins by adding a country, a course
// and places; nothing here names Spain. Ids are stable slugs (decision #41); study regions group places, they are not parents (#42).

export interface Country {
  id: string;
  name: string;
  /** Level names from the top down: [country, region, place, zone, ...]. Each country names its own. */
  levels: string[];
}

export interface Region {
  id: string;
  name: string;
  /** Position in the course. */
  order: number;
  country: string;
  course: string;
}

export interface Place {
  id: string;
  name: string;
  /** Official name; alternative names are separated by " / ". */
  official?: string;
  kind: string;
  /** One of the country's level names. */
  level: string;
  /** The home parent: the country id or another place id. */
  parent: string;
  /** Study region id. */
  region: string;
  alsoWithin?: string[];
  quiz: 'core' | 'vc' | 'zone' | 'none';
  courseOrder?: number;
  northSouth?: number;
  community?: string;
  boundary?: string;
  layerCode?: string | null;
  centroid?: [number, number] | null;
}

/** A step in a breadcrumb or a search hit. `level` is the country's own level name. */
export interface Crumb {
  level: string;
  id: string;
  name: string;
}

export type TreeNode = Region | Place;

/** Which kind of node an id means, where a region and a place share an id (Rioja). */
export type NodeKind = 'country' | 'region' | 'place';
