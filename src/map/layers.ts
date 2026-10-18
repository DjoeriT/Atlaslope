// Pure map decisions: which layers show for a menu state, how the paint changes over imagery, when imagery has failed.
export interface MenuState {
  satellite: boolean;
  relief: boolean;
  boundaries: boolean;
  /** What the places' colours mean: climate (the default) or study region. */
  colourBy: 'climate' | 'region';
}

export const DEFAULT_MENU: MenuState = { satellite: true, relief: true, boundaries: true, colourBy: 'climate' };

type Visibility = 'visible' | 'none';

/** Layer ids in draw order. `satellite` and `pnoa` are absent from the style when the build has no key. */
export const LAYER_IDS = ['land', 'satellite', 'pnoa', 'hillshade', 'ocean', 'coast', 'borders', 'dos-casing', 'dos-fill', 'dos-line'] as const;
export type LayerId = (typeof LAYER_IDS)[number];

/** `imagery` is false when satellite is missing or has failed: the atlas base shows whatever the menu says. */
export function layerVisibility(menu: MenuState, imagery: boolean): Record<LayerId, Visibility> {
  const sat = menu.satellite && imagery;
  const v = (on: boolean): Visibility => (on ? 'visible' : 'none');
  return {
    land: 'visible',
    satellite: v(sat),
    pnoa: v(sat),
    hillshade: v(menu.relief),
    ocean: 'visible',
    coast: 'visible',
    borders: 'visible',
    'dos-casing': v(sat && menu.boundaries),
    'dos-fill': v(menu.boundaries),
    'dos-line': v(menu.boundaries),
  };
}

/** Paint that differs between imagery and the plain atlas. DO colours are stronger over imagery so they read. */
export function basemapPaint(sat: boolean) {
  const sel = ['boolean', ['feature-state', 'sel'], false];
  const dim = ['boolean', ['feature-state', 'dim'], false];
  const hover = ['boolean', ['feature-state', 'hover'], false];
  return {
    ocean: { color: sat ? '#1B3A52' : '#9DBCCB', opacity: sat ? 0.45 : 1 },
    coast: sat ? '#E6F0F4' : '#4F6873',
    // Country borders get a halo so they still read over dark relief shading and busy imagery (#40).
    borders: sat ? '#F4EFE6' : '#4A3F38',
    bordersCasing: { color: sat ? '#1A1512' : '#FFFFFF', opacity: sat ? 0.45 : 0.75 },
    // Stronger than release 22 (0.25 and 0.5), which the owner could barely see (18 Oct 2026, point 6); over the photo it stays
    // lighter, because the photo carries its own shadows.
    hillshadeExaggeration: sat ? 0.45 : 0.8,
    // A hovered place shows even where it is dimmed, so a row in a card always finds its place on the map.
    // Over the photo the fills keep the Spain-wide look up to zoom 6, then thin out by zoom 9 (a region) and nearly vanish by 12,
    // so close in the land itself shows (towns, vineyards, rivers) with the outline still drawn; on the plain atlas they stay solid.
    dosFillOpacity: sat
      ? ['interpolate', ['linear'], ['zoom'],
        6, ['case', sel, 0.82, hover, 0.85, dim, 0.06, 0.6],
        9, ['case', sel, 0.4, hover, 0.5, dim, 0.03, 0.22],
        12, ['case', sel, 0.15, hover, 0.25, dim, 0.02, 0.06]]
      : ['interpolate', ['linear'], ['zoom'],
        8, ['case', sel, 0.65, hover, 0.85, dim, 0.06, 0.5],
        // Close in on the plain atlas the road map (src/map/osmBase.ts) shows through, as the photo does.
        // The selected place (and a quiz answer) stays clearly black over the roads.
        11, ['case', sel, 0.55, hover, 0.5, dim, 0.04, 0.22],
        13, ['case', sel, 0.45, hover, 0.3, dim, 0.03, 0.1]],
    // As the fills thin close in over the photo, the outline gets stronger so the place still reads.
    dosLineOpacity: sat
      ? ['interpolate', ['linear'], ['zoom'], 6, ['case', hover, 1, dim, 0.2, 0.7], 9, ['case', hover, 1, dim, 0.25, 0.95]]
      : ['case', hover, 1, dim, 0.2, 0.7],
    dosLineWidth: sat
      ? ['interpolate', ['linear'], ['zoom'], 6, ['case', sel, 3, hover, 2.8, 1.6], 9, ['case', sel, 3.2, hover, 3, 2.2]]
      : ['case', sel, 3, hover, 2.8, 0.9],
    dosLineDash: [10, 0],
  };
}

/**
 * 3D relief height by zoom. Real heights (1x) vanish at country scale and read flat even in a valley; 1.3 everywhere (release 22)
 * was barely visible (owner, 18 Oct 2026, point 6). Strongest Spain-wide so the mountain ranges stand up, about 2 in a wine valley,
 * easing off close in where steep slopes would turn into walls and drag the place outlines.
 */
export const RELIEF_STOPS: Array<[zoom: number, exaggeration: number]> = [[5, 2.8], [8, 2.4], [10, 2.1], [12, 1.8], [14, 1.5]];

export function reliefExaggeration(zoom: number, stops = RELIEF_STOPS): number {
  if (zoom <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [z1, e1] = stops[i];
    if (zoom <= z1) {
      const [z0, e0] = stops[i - 1];
      return e0 + ((zoom - z0) / (z1 - z0)) * (e1 - e0);
    }
  }
  return stops[stops.length - 1][1];
}

export interface ImageryReport {
  hasKey: boolean;
  /** Imagery tile requests that errored. */
  errors: number;
  /** Imagery tiles that loaded. */
  loaded: number;
}

/** Errors before we give up when nothing has loaded: one bad tile is not a failure. */
export const IMAGERY_ERROR_LIMIT = 3;

/** True when the atlas base should show with the note: no key, or imagery erroring and never loading. */
export function imageryFailed(r: ImageryReport): boolean {
  if (!r.hasKey) return true;
  return r.loaded === 0 && r.errors >= IMAGERY_ERROR_LIMIT;
}
