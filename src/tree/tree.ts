import { fold, makeSearch, type Entry } from './search';
import type { Country, Crumb, NodeKind, Place, Region, TreeNode } from './types';

export interface Tree {
  countries: Country[];
  places: Place[];
  getPlace(id: string): Place | undefined;
  getRegion(id: string): Region | undefined;
  /** Country: its study regions. Region: its places. Place: its child places (zones). `kind` settles a shared id (Rioja); by default a place wins. */
  children(id: string, kind?: NodeKind): TreeNode[];
  /** Study regions of a country, in course order. */
  regionsOf(countryId: string): Region[];
  /** Top-level places of a study region, in course order, then north to south. */
  placesInRegion(regionId: string): Place[];
  /** Country › study region › place › zone, ending at the node itself. Empty for an unknown id. */
  breadcrumb(id: string, kind?: NodeKind): Crumb[];
  /** The one place of a study region that holds only a place of its own name (Rioja), or undefined. That region is skipped in trails and navigation (owner card, 17 Oct 2026). */
  soleSameName(regionId: string): Place | undefined;
  /** The places named in a place's alsoWithin. */
  alsoWithin(id: string): Place[];
  /** The country's name for the place's level ("place", "zone", ...). */
  levelName(place: Place): string;
  /** Regions and places by name or official name, accents and case folded; regions first on an equal match. Main-grape matches come after all name matches. */
  search(query: string, limit?: number): Crumb[];
}

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const LAST = Number.MAX_SAFE_INTEGER;

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const isText = (x: unknown): x is string => typeof x === 'string' && x.trim() !== '';

/** Validates the parsed places.json and builds the tree. `mainGrapes` (place id to grape names) lets search find a place by its grapes. Throws with a message naming the place (or country, course) at fault. */
export function loadTree(raw: unknown, mainGrapes: Record<string, string[]> = {}): Tree {
  if (!isObject(raw) || !Array.isArray(raw.countries) || !Array.isArray(raw.courses) || !Array.isArray(raw.places)) {
    throw new Error('places.json: expected countries, courses and places');
  }

  const countries = new Map<string, Country>();
  for (const c of raw.countries as unknown[]) {
    if (!isObject(c) || !isText(c.id) || !SLUG.test(c.id)) throw new Error(`places.json: country ${JSON.stringify(c)} needs a slug id`);
    const levels = c.levels;
    if (!isText(c.name) || !Array.isArray(levels) || levels.length < 3 || !levels.every(isText)) {
      throw new Error(`places.json: country ${c.id} needs a name and at least three level names`);
    }
    if (countries.has(c.id)) throw new Error(`places.json: country ${c.id} is a duplicate`);
    countries.set(c.id, { id: c.id, name: c.name, levels: levels as string[] });
  }

  const regions = new Map<string, Region>();
  for (const course of raw.courses as unknown[]) {
    if (!isObject(course) || !isText(course.id) || !Array.isArray(course.groups)) throw new Error('places.json: a course needs an id and groups');
    if (!isText(course.country) || !countries.has(course.country)) {
      throw new Error(`places.json: course ${course.id} names unknown country ${String(course.country)}`);
    }
    for (const g of course.groups as unknown[]) {
      if (!isObject(g) || !isText(g.id) || !SLUG.test(g.id) || !isText(g.name) || typeof g.order !== 'number') {
        throw new Error(`places.json: course ${course.id} has a region without slug id, name and order: ${JSON.stringify(g)}`);
      }
      if (regions.has(g.id)) throw new Error(`places.json: region ${g.id} is a duplicate`);
      if (g.chapter !== undefined && !isText(g.chapter)) throw new Error(`places.json: region ${g.id} has an empty chapter`);
      regions.set(g.id, { id: g.id, name: g.name, order: g.order, country: course.country, course: course.id, ...(isText(g.chapter) ? { chapter: g.chapter } : {}) });
    }
  }

  const byId = new Map<string, Place>();
  for (const p of raw.places as unknown[]) {
    if (!isObject(p) || typeof p.id !== 'string') throw new Error(`places.json: a place has no id: ${JSON.stringify(p)}`);
    const id = p.id;
    if (!SLUG.test(id)) throw new Error(`places.json: place ${id}: id is not a slug`);
    if (byId.has(id)) throw new Error(`places.json: place ${id}: duplicate id`);
    for (const field of ['name', 'level', 'parent', 'region'] as const) {
      if (!isText(p[field])) throw new Error(`places.json: place ${id}: missing ${field}`);
    }
    if (p.alsoWithin !== undefined && !(Array.isArray(p.alsoWithin) && p.alsoWithin.every(isText))) {
      throw new Error(`places.json: place ${id}: alsoWithin must be a list of ids`);
    }
    byId.set(id, p as unknown as Place);
  }

  // Walk each place up to its country: the parents must exist, must not loop, and the depth must match the level name.
  const countryOf = new Map<string, Country>();
  const depthOf = new Map<string, number>();
  for (const p of byId.values()) {
    const seen = new Set<string>([p.id]);
    let node = p;
    while (!countries.has(node.parent)) {
      const up = byId.get(node.parent);
      if (!up) throw new Error(`places.json: place ${node.id}: parent ${node.parent} does not exist`);
      if (seen.has(up.id)) throw new Error(`places.json: place ${p.id}: parent cycle through ${up.id}`);
      seen.add(up.id);
      node = up;
    }
    const country = countries.get(node.parent)!;
    const depth = seen.size + 1; // country 0, region 1, top place 2
    const expected = country.levels[depth];
    if (p.level !== expected) {
      throw new Error(`places.json: place ${p.id}: level ${p.level}, but ${country.id} calls this depth ${expected ?? '(none)'}`);
    }
    const region = regions.get(p.region);
    if (!region || region.country !== country.id) {
      throw new Error(`places.json: place ${p.id}: region ${p.region} is not a study region of ${country.id}`);
    }
    for (const o of p.alsoWithin ?? []) {
      if (!byId.has(o)) throw new Error(`places.json: place ${p.id}: alsoWithin ${o} does not exist`);
    }
    countryOf.set(p.id, country);
    depthOf.set(p.id, depth);
  }

  const places = [...byId.values()];
  const tourOrder = (a: Place, b: Place) =>
    (a.courseOrder ?? LAST) - (b.courseOrder ?? LAST) || (a.northSouth ?? LAST) - (b.northSouth ?? LAST);
  const childPlaces = (parentId: string) => places.filter((p) => p.parent === parentId).sort(tourOrder);
  const regionsOf = (countryId: string) => [...regions.values()].filter((r) => r.country === countryId).sort((a, b) => a.order - b.order);
  const placesInRegion = (regionId: string) => {
    const r = regions.get(regionId);
    return r ? places.filter((p) => p.region === regionId && p.parent === r.country).sort(tourOrder) : [];
  };
  const soleSameName = (regionId: string) => {
    const r = regions.get(regionId);
    const inside = r ? placesInRegion(regionId) : [];
    return r && inside.length === 1 && fold(inside[0].name) === fold(r.name) ? inside[0] : undefined;
  };
  const kindOf = (id: string, kind?: NodeKind): NodeKind | undefined =>
    kind ?? (countries.has(id) ? 'country' : byId.has(id) ? 'place' : regions.has(id) ? 'region' : undefined);

  const breadcrumb = (id: string, kind?: NodeKind): Crumb[] => {
    switch (kindOf(id, kind)) {
      case 'country': {
        const c = countries.get(id);
        return c ? [{ level: c.levels[0], id: c.id, name: c.name }] : [];
      }
      case 'region': {
        const r = regions.get(id);
        if (!r) return [];
        const c = countries.get(r.country)!;
        return [...breadcrumb(c.id, 'country'), { level: c.levels[1], id: r.id, name: r.name }];
      }
      case 'place': {
        const p = byId.get(id);
        if (!p) return [];
        const top = countries.has(p.parent);
        const up = top && soleSameName(p.region)?.id === p.id ? breadcrumb(p.parent, 'country') : top ? breadcrumb(p.region, 'region') : breadcrumb(p.parent, 'place');
        return [...up, { level: p.level, id: p.id, name: p.name }];
      }
      default:
        return [];
    }
  };

  const entries: Entry[] = [
    ...[...regions.values()].filter((r) => !soleSameName(r.id)).map((r) => ({
      hit: { level: countries.get(r.country)!.levels[1], id: r.id, name: r.name }, names: [r.name, r.chapter ?? ''].filter(Boolean).map(fold), rank: 0, order: r.order,
    })),
    ...places.map((p) => ({
      hit: { level: p.level, id: p.id, name: p.name },
      names: [p.name, ...(p.official ?? '').split(' / ')].filter(Boolean).map(fold),
      grapes: mainGrapes[p.id],
      rank: 1,
      order: p.courseOrder ?? LAST,
    })),
  ];

  return {
    countries: [...countries.values()],
    places,
    getPlace: (id) => byId.get(id),
    getRegion: (id) => regions.get(id),
    children: (id, kind) => {
      switch (kindOf(id, kind)) {
        case 'country': return regionsOf(id);
        case 'region': return placesInRegion(id);
        case 'place': return childPlaces(id);
        default: return [];
      }
    },
    regionsOf,
    placesInRegion,
    breadcrumb,
    soleSameName,
    alsoWithin: (id) => (byId.get(id)?.alsoWithin ?? []).map((o) => byId.get(o)!),
    levelName: (place) => countryOf.get(place.id)?.levels[depthOf.get(place.id)!] ?? place.level,
    search: makeSearch(entries),
  };
}
