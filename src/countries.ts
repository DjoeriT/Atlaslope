// What the app does differently per country. The place tree (data/places.json) holds each country's name, levels and courses;
// this holds where its map opens, which photo it uses close in, and how its places are addressed.
// Decisions #48 (real /pt/ pages; Spain keeps atlas/#place= until its own slice), #49 (courses come from the tree), #50 (imagery).

export type Bounds = [[number, number], [number, number]];

export interface CountryConfig {
  id: string;
  /** The URL code, also the folder under data/countries/. */
  code: string;
  /** Where the map opens for the country card. */
  bounds: Bounds;
  /** The close-in photo: Spain's PNOA over Esri, or Esri alone. Portugal stays on Esri until DGT OrtoSat passes a speed test (#50). */
  imagery: 'pnoa' | 'esri';
  /** Its place pages are real files at /<code>/<place>/ (#48). */
  paths: boolean;
}

export const COUNTRIES: Record<string, CountryConfig> = {
  spain: { id: 'spain', code: 'es', bounds: [[-9.4, 35.9], [3.4, 43.9]], imagery: 'pnoa', paths: false },
  // The mainland; Madeira and the Azores come after it.
  portugal: { id: 'portugal', code: 'pt', bounds: [[-9.6, 36.9], [-6.1, 42.2]], imagery: 'esri', paths: true },
  // The mainland. Imagery stays Esri until the France mask exists (Tools/data/build_masks.py), which IGN BD ORTHO needs (#149).
  france: { id: 'france', code: 'fr', bounds: [[-5.2, 42.3], [8.3, 51.1]], imagery: 'esri', paths: true },
};

export const DEFAULT_COUNTRY = 'spain';

export const countryConfig = (id: string | undefined): CountryConfig => COUNTRIES[id ?? DEFAULT_COUNTRY] ?? COUNTRIES[DEFAULT_COUNTRY];

/** The countries whose place pages have real paths, by URL code. */
export const PATH_CODES: Record<string, CountryConfig> = Object.fromEntries(Object.values(COUNTRIES).filter((c) => c.paths).map((c) => [c.code, c]));
