// The shape of content/facts/<region>.json (see Review/release-4-fact-sheet-template.md), content/sources.json,
// data/place-measures.json and data/photos.json.

/** "<sourceId>" or "<sourceId>:p<N>". */
export type Cite = string;

export const STYLE_KINDS = ['red', 'white', 'rose', 'sparkling', 'fortified', 'sweet'] as const;
export type StyleKind = (typeof STYLE_KINDS)[number];

export interface MainGrape {
  /** The name used in the place's own rules. */
  local: string;
  /** The grape's usual name, when it differs. */
  grape?: string;
}

export interface TextRow {
  text: string;
  cite: Cite[];
}

export interface Sheet {
  id: string;
  why: TextRow;
  grapes: {
    main: MainGrape[]; cite: Cite[]; others: string[]; othersCite: Cite[];
    /** The cited document is an amendment or a cut extract, so `others` is not every allowed grape. */
    othersPartial?: boolean;
  };
  styles: { kinds: StyleKind[]; text: string; cite: Cite[] };
  climate: TextRow;
  soil: TextRow;
  altitude?: TextRow;
}

export interface SheetFile {
  region: string;
  sheets: Sheet[];
}

export interface Source {
  title: string;
  url: string;
  /** ISO date or a year. */
  date: string;
  kind: 'official' | 'wikipedia' | 'measured';
}
export type Sources = Record<string, Source>;

export interface KoppenShare {
  code: string;
  name: string;
  share: number;
}

export interface Measures {
  altitude: { p10: number; median: number; p90: number; samples: number };
  koppen: KoppenShare[];
}

/** One entry of data/photos.json, keyed by the file name without extension (`<placeId>-<n>`; the file is public/photos/<key>.webp). */
export interface Photo {
  alt: string;
  artist: string;
  licence: string;
  /** The Wikimedia Commons page. */
  page: string;
}
