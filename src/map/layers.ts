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

/** Layer ids in draw order. `satellite` is absent from the style when the build has no key. */
export const LAYER_IDS = ['land', 'satellite', 'hillshade', 'ocean', 'coast', 'borders', 'dos-casing', 'dos-fill', 'dos-line'] as const;
export type LayerId = (typeof LAYER_IDS)[number];

/** `imagery` is false when satellite is missing or has failed: the atlas base shows whatever the menu says. */
export function layerVisibility(menu: MenuState, imagery: boolean): Record<LayerId, Visibility> {
  const sat = menu.satellite && imagery;
  const v = (on: boolean): Visibility => (on ? 'visible' : 'none');
  return {
    land: 'visible',
    satellite: v(sat),
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
    hillshadeExaggeration: sat ? 0.25 : 0.5,
    // A hovered place shows even where it is dimmed, so a row in a card always finds its place on the map.
    dosFillOpacity: ['case', sel, sat ? 0.82 : 0.65, hover, 0.85, dim, 0.06, sat ? 0.6 : 0.5],
    dosLineOpacity: ['case', hover, 1, dim, 0.2, 0.7],
    dosLineWidth: ['case', sel, 3, hover, 2.8, sat ? 1.6 : 0.9],
    dosLineDash: [10, 0],
  };
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
