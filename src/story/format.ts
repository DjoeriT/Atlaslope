// A story ("Read with the map") is one JSON file per guide in content/stories/<id>.json. It adds a map walk to a guide and never carries
// guide text of its own: each step points into content/guides/<id>.json, and a fact marker repeats a sentence of that guide with its cite.
// Camera values are design choices (see the file's $comment); the format is described in docs/guides.md ("Story files").

export type LngLat = [number, number];
export type StoryLayer = 'koppen' | 'geology' | 'zonelabels';
export type MeasureKind = 'median' | 'top' | 'low' | 'steep';

export interface StoryCamera {
  /** Either a fixed view (center + zoom) or a place's bounds; a fly step with neither uses the guide's own fly point or place. */
  center?: LngLat;
  zoom?: number;
  place?: string;
  pitch?: number;
  bearing?: number;
  /** Added to the zoom fitted to the bounds, for tilted views. */
  zoomShift?: number;
}

/** A name in data/story/names-<id>.geojson, or a point. */
export type StoryAt = string | LngLat;

export interface StoryFact { at: StoryAt; label: string; text: string; cite: string[] }
export interface StoryMarker { at: StoryAt; label?: string }
export interface StoryMeasure { place: string; kind: MeasureKind }

export interface StoryStep {
  id: string;
  /** Chapter id in the guide; null for the opening view. */
  chapter: string | null;
  /** Index into the chapter's fly[] or cards[]; neither for a step the guide has no stop for. */
  fly?: number;
  card?: number;
  camera: StoryCamera;
  /** Outline drawn: a place id, or 'zones' for the three Rioja zones. */
  focus: string;
  layers?: StoryLayer[];
  /** Chip text, when the step has no guide stop to take the label from. */
  chip?: string;
  /** false hides the dot a fly stop would draw. */
  dot?: boolean;
  markers?: StoryMarker[];
  photo?: string;
  measure?: StoryMeasure;
  facts?: StoryFact[];
}

export interface Story {
  id: string;
  cover: { photo: string };
  steps: StoryStep[];
  end: { kicker: string; text: string; test?: { label: string; set: string[] } };
}
