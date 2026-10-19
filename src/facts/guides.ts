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

/** The four beats of "Why X tastes the way it does" (guide shape C, owner 19 Oct 2026): where it is, its weather, its ground, and what its rules make. */
export const BEATS = ['place', 'weather', 'ground', 'rules'] as const;
export type Beat = (typeof BEATS)[number];

export interface Chapter {
  id: string;
  title: string;
  /** The beat this chapter tells. A chapter without one is drawn after the rules beat. */
  beat?: Beat;
  paras: string[];
  cite: Cite[];
  fly?: FlyTarget[];
  cards?: ZoneNote[];
}

/** A browse section beyond the four beats (History, Places to visit, Food to try there). It shows only when written. */
export interface Extra {
  /** A heading of its own; the section's plain name when missing. */
  title?: string;
  paras: string[];
  cite: Cite[];
  /** Places to visit only: harvest months and wine festivals (owner, 19 Oct 2026: inside Places to visit, not its own section). */
  when?: { text: string; cite: Cite[] };
}

/** One term on the bottle (Crianza, Barrica...) and what it means here, from the place's own rules. */
export interface LabelTerm { term: string; text: string }

export const EXTRAS = ['label', 'fact', 'history', 'visit', 'food'] as const;
export type ExtraKind = (typeof EXTRAS)[number];

export interface Guide {
  id: string;
  title: string;
  minutes: number;
  lede: { text: string; cite: Cite[] };
  chapters: Chapter[];
  /** How to say the place's name, written out ("chah-koh-LEE"); shown beside the title. */
  say?: string;
  /** Read the label: the bottle terms and what they mean here, from the pliego (today's fact rule allows it). */
  label?: { terms: LabelTerm[]; cite: Cite[] };
  /** Sections beyond the beats, each shown only when written. History, Places to visit, Food to try there and the one surprising fact
   *  wait on which sources count (issue #103). */
  more?: Partial<Record<Exclude<ExtraKind, 'label'>, Extra>>;
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
