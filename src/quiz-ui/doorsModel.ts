// The pure parts of the doors, Today and the pickers: counts, names and ticks. No React.
import { askable, inCourseOrder, REVIEW_KINDS, type LogEntry, type MemoryRef, type QuizState, type Round } from '../quiz';
import type { Place, Tree } from '../tree';

/** Questions in a round (intros are not questions). */
export const questionCount = (round: Round): number => round.items.filter((i) => i.kind === 'question').length;

const dayOf = (iso: string) => iso.slice(0, 10);

/** Places the learner missed today (a miss marked as a slip does not count), in the order first missed. UTC days, as the plan uses. */
export function missedToday(log: readonly LogEntry[], now: Date): string[] {
  const today = dayOf(now.toISOString());
  const ids: string[] = [];
  for (const e of log) if (e.kind === 'answer' && !e.right && !e.slip && dayOf(e.at) === today && !ids.includes(e.place)) ids.push(e.place);
  return ids;
}

/** The first day after now with something due, and how many places are due that day; null when nothing is scheduled. */
export function nextDue(tree: Tree, state: QuizState, now: Date): { day: Date; places: number } | null {
  const later = askable(tree, Object.keys(state.places), state).filter((r) => Date.parse(r.due) > now.getTime());
  if (!later.length) return null;
  const first = later.map((r) => dayOf(r.due)).sort()[0];
  const places = new Set(later.filter((r) => dayOf(r.due) === first).map((r) => r.place));
  return { day: new Date(`${first}T12:00:00Z`), places: places.size };
}

/** Due memories counted by the study region of their place, biggest first (ties in course order). */
export function dueByRegion(tree: Tree, due: readonly MemoryRef[]): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const r of due) {
    const region = tree.getRegion(tree.getPlace(r.place)?.region ?? '');
    if (region) counts.set(region.id, (counts.get(region.id) ?? 0) + 1);
  }
  return [...counts]
    .map(([id, count]) => ({ count, order: tree.getRegion(id)!.order, name: tree.getRegion(id)!.name }))
    .sort((a, b) => b.count - a.count || a.order - b.order)
    .map(({ name, count }) => ({ name, count }));
}

/** The names a focus list stands for (regions and places), for the focus line. */
export const focusNames = (tree: Tree, focus: readonly string[]): string[] => focus.map((id) => tree.getRegion(id)?.name ?? tree.getPlace(id)?.name ?? id);

/** The study region all the given places share, or null when they come from more than one: "Up next: 5 places in Green Spain." */
export function sharedRegion(tree: Tree, placeIds: readonly string[]): string | null {
  const ids = new Set(placeIds.map((id) => tree.getPlace(id)?.region ?? ''));
  const [only] = ids;
  return ids.size === 1 ? tree.getRegion(only)?.name ?? null : null;
}

/** "A, B and C". */
export function listOf(names: readonly string[]): string {
  return names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/** Places a Review can ask, grouped under their study region, in course order. */
export function practiseTree(tree: Tree): Array<{ region: { id: string; name: string }; places: Place[] }> {
  return tree.regionsOf(tree.countries[0].id)
    .map((region) => ({ region, places: inCourseOrder(tree, tree.placesInRegion(region.id).filter((p) => REVIEW_KINDS.includes(p.quiz))) }))
    .filter((g) => g.places.length > 0);
}

/** A region's tick: all of its places picked, some (the partial state) or none. */
export function tickOf(placeIds: readonly string[], picked: ReadonlySet<string>): 'all' | 'some' | 'none' {
  const n = placeIds.filter((id) => picked.has(id)).length;
  return n === 0 ? 'none' : n === placeIds.length ? 'all' : 'some';
}

/** Places a learner can put in a focus (Study kinds), by name for the "Add a place" box. */
export const focusablePlaces = (tree: Tree): Place[] => tree.places.filter((p) => p.quiz === 'core');
