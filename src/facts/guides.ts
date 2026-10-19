// The Terroir sections of the guides (a guide is the whole place page), under content/guides/<place id>.json: chapters of plain text, each with its sources and "fly there" targets.
import type { Cite } from './types';

export interface FlyTarget {
  label: string;
  caption: string;
  cite: Cite[];
  /** Frame this place's boundary... */
  place?: string;
  /** ...or fly to a named point. */
  point?: [number, number];
  zoom?: number;
}

export interface ZoneNote { title: string; climate: string; wine: string; fly: FlyTarget }

export interface Chapter {
  id: string;
  title: string;
  paras: string[];
  cite: Cite[];
  fly?: FlyTarget[];
  cards?: ZoneNote[];
}

export interface Guide {
  id: string;
  title: string;
  minutes: number;
  lede: { text: string; cite: Cite[] };
  chapters: Chapter[];
}

const modules = import.meta.glob<Guide>('../../content/guides/*.json', { eager: true, import: 'default' });

export const guides: Guide[] = Object.values(modules);
const byPlace = new Map(guides.map((g) => [g.id, g]));

export const guideOf = (placeId: string): Guide | undefined => byPlace.get(placeId);

/** The pills of a chapter in page order: its own, then one per zone note. A pill's index in this list is the `fly=` number in the address. */
export const chapterFlies = (chapter: Chapter): FlyTarget[] => [...(chapter.fly ?? []), ...(chapter.cards ?? []).map((c) => c.fly)];

export function flyTargetOf(guide: Guide, chapterId: string, index: number): FlyTarget | undefined {
  const chapter = guide.chapters.find((c) => c.id === chapterId);
  return chapter ? chapterFlies(chapter)[index] : undefined;
}
