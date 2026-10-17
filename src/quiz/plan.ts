// What to ask: memories due, and the Study intake of new places (focus first, then course order; zones after their parent).
import type { Place, Tree } from '../tree';
import { DAY_MS, placeKnown, questionType } from './memory';
import type { MemoryName, MemoryRef, QuizState } from './types';

/** New places a day in Study; "Learn 5 more" takes this many again. [O] */
export const INTAKE_PER_DAY = 5;
/** Quiz kinds in the Study curriculum: core places and zones. Vinos de Calidad are asked only in Review. [A] */
export const STUDY_KINDS: readonly Place['quiz'][] = ['core', 'zone'];
/** Quiz kinds a Review set can ask. */
export const REVIEW_KINDS: readonly Place['quiz'][] = ['core', 'zone', 'vc'];

export interface PlanOptions {
  /** Study region ids or place ids; intake takes new places from these first. */
  focus?: readonly string[];
  /** "Learn 5 more": take the next five new places, whatever today's count. */
  learnMore?: boolean;
  /** The learner's offset from UTC, for where a day starts. Default 0. */
  utcOffsetMinutes?: number;
}

export interface StudyPlan {
  /** Memories due now, most overdue first. */
  due: MemoryRef[];
  /** New places to introduce now, in order. */
  intake: string[];
  /** New places first seen today, each counted once. */
  seenToday: number;
}

const LAST = Number.MAX_SAFE_INTEGER;
const MEMORIES: readonly MemoryName[] = ['where', 'what'];

/** Course order as a key: study region order, then courseOrder, then northSouth; a zone sorts straight after its parent. */
export function courseKey(tree: Tree, p: Place): number[] {
  const own = [p.courseOrder ?? LAST, p.northSouth ?? LAST];
  const parent = tree.getPlace(p.parent);
  if (parent) return [...courseKey(tree, parent), ...own];
  return [tree.getRegion(p.region)?.order ?? LAST, ...own];
}

function compareKeys(a: number[], b: number[]): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i];
  return a.length - b.length;
}

/** Places in course order (a stable sort, so equal keys keep the data's order). */
export function inCourseOrder(tree: Tree, places: readonly Place[]): Place[] {
  const keys = new Map(places.map((p) => [p.id, courseKey(tree, p)]));
  return [...places].sort((a, b) => compareKeys(keys.get(a.id)!, keys.get(b.id)!));
}

/** Seen memories of these places that can be asked now or later (`what` only once `where` is known), soonest due first, course order on a tie. */
export function askable(tree: Tree, placeIds: readonly string[], state: QuizState): MemoryRef[] {
  const refs: MemoryRef[] = [];
  const order = inCourseOrder(tree, placeIds.map((id) => tree.getPlace(id)).filter((p): p is Place => p !== undefined));
  for (const place of order) {
    const p = state.places[place.id];
    if (!p) continue;
    for (const memory of MEMORIES) if (questionType(p, memory)) refs.push({ place: place.id, memory, due: p[memory].due });
  }
  return refs.sort((a, b) => Date.parse(a.due) - Date.parse(b.due));
}

/** Memories of these places due at `now`, most overdue first. */
export function dueNow(tree: Tree, placeIds: readonly string[], state: QuizState, now: Date): MemoryRef[] {
  return askable(tree, placeIds, state).filter((r) => Date.parse(r.due) <= now.getTime());
}

/** The Study curriculum: every core place and zone, in course order. */
export function studySet(tree: Tree): Place[] {
  return inCourseOrder(tree, tree.places.filter((p) => STUDY_KINDS.includes(p.quiz)));
}

const dayOf = (t: number, offsetMinutes: number) => Math.floor((t + offsetMinutes * 60_000) / DAY_MS);

/** The Study plan at `now`: what is due, and today's intake (five new places a day, focus first, then course order; a zone only once its parent is known). */
export function studyPlan(tree: Tree, state: QuizState, now: Date, opts: PlanOptions = {}): StudyPlan {
  const curriculum = studySet(tree);
  const offset = opts.utcOffsetMinutes ?? 0;
  const today = dayOf(now.getTime(), offset);
  const seenToday = Object.values(state.places).filter((p) => dayOf(Date.parse(p.seenAt), offset) === today).length;

  const focus = new Set(opts.focus ?? []);
  const inFocus = (p: Place) => focus.has(p.id) || focus.has(p.region) || focus.has(p.parent);
  const ready = (p: Place) => !state.places[p.id] && (p.quiz !== 'zone' || placeKnown(state.places[p.parent]));
  const fresh = curriculum.filter(ready);
  const count = opts.learnMore ? INTAKE_PER_DAY : Math.max(0, INTAKE_PER_DAY - seenToday);
  const intake = [...fresh.filter(inFocus), ...fresh.filter((p) => !inFocus(p))].slice(0, count).map((p) => p.id);

  return { due: dueNow(tree, curriculum.map((p) => p.id), state, now), intake, seenToday };
}
