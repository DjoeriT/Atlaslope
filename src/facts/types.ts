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
  /** Release 4.1: colour, nose and palate from the official document's wine descriptions. */
  tastes?: TextRow;
  /** Release 4.1: the named styles the official document defines (Crianza, Fino, Brut Nature...), at most four. */
  famous?: { styles: FamousStyle[]; cite: Cite[] };
  /** Release 4.1: up to three producers or wines that a Wikipedia article about the place singles out. */
  producers?: { items: Producer[]; cite: Cite[] };
}

export interface FamousStyle {
  /** The document's own name for the style, e.g. «Gran Reserva». */
  name: string;
  /** At most 15 words on what makes it that style. */
  text: string;
}

export interface Producer {
  /** The producer (bodega) as the article names it. */
  name: string;
  /** A wine the article names for it, when it does. */
  wine?: string;
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

/** A photo as the app shows it: the file, its smaller copies for `srcset`, and a tiny WebP (base64) to blur while it loads. */
export type ShownPhoto = Photo & { src: string; srcSet?: string; blur?: string };
