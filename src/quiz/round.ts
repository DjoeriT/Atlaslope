// Rounds for the Study and Review doors: up to 20 questions, due memories first, new places shown in a batch and asked later in the round.
import type { Place, Tree } from '../tree';
import { findsIt, questionType, replay } from './memory';
import { askable, dueNow, inCourseOrder, REVIEW_KINDS, studyPlan, type PlanOptions } from './plan';
import { seededRandom, shuffled } from './questions';
import type { LogEntry, MemoryName, MemoryRef, QuizState, Round, RoundItem } from './types';

/** Questions in a round, before re-asked misses. [O] */
export const ROUND_SIZE = 20;
/** New places are shown in batches of up to this many intros in a row, then asked later in the round, mixed with other questions. [A] */
export const INTRO_BATCH = 5;
/** Two screens about the same place sit at least this far apart (three other screens between) where the round allows it. [A] */
export const MIN_DISTANCE = 4;

export interface RoundOptions {
  /** Questions in the round (Review offers 10 or 20). Default 20. */
  size?: number;
  /** Memories already asked in this sitting (see memoryKey); "Keep going" passes the earlier rounds' keys so it builds from what is left. */
  asked?: Iterable<string>;
  /** Seed for the round's order; the same seed gives the same order. Default 1. */
  seed?: number;
}

/** A round's seed: the day and how long the log is, so each round of a sitting has its own order and the same moment gives the same round. */
export function roundSeed(now: Date, logLength: number): number {
  return Math.floor(now.getTime() / 86_400_000) * 100_003 + logLength;
}

/** The key of one memory of one place, as used in `asked`. */
export function memoryKey(place: string, memory: MemoryName): string {
  return `${place}/${memory}`;
}

/** Every memory key a round asks, for the next round's `asked`. */
export function roundKeys(round: Round): string[] {
  return round.items.flatMap((i) => (i.kind === 'question' ? [memoryKey(i.place, i.memory)] : []));
}

/** Picks what a round asks, in priority order: due memories, then new places, then any other memories; then `arrange` orders it. [A: priority] */
function fill(tree: Tree, state: QuizState, due: MemoryRef[], fresh: string[], rest: MemoryRef[], opts: RoundOptions): Round {
  const size = opts.size ?? ROUND_SIZE;
  const asked = new Set(opts.asked);
  const left = (r: MemoryRef) => !asked.has(memoryKey(r.place, r.memory));
  const queue = [
    ...due.filter(left).map((r) => ({ ref: r })),
    ...fresh.filter((id) => !asked.has(memoryKey(id, 'where'))).map((id) => ({ fresh: id })),
    ...rest.filter(left).map((r) => ({ ref: r })),
  ];
  const picked = queue.slice(0, size);
  const reviews: RoundItem[] = picked.flatMap((q) =>
    'ref' in q ? [{ kind: 'question' as const, place: q.ref.place, memory: q.ref.memory, type: questionType(state.places[q.ref.place], q.ref.memory, findsIt(tree.getPlace(q.ref.place)))! }] : []);
  const news = picked.flatMap((q) => ('fresh' in q ? [q.fresh] : []));
  return { items: arrange(reviews, news, seededRandom(opts.seed ?? 1)), more: queue.length > size };
}

/** Takes `n` items off the front of `xs`. */
const take = <T>(xs: T[], n: number): T[] => xs.splice(0, n);

/**
 * Orders a round: the questions shuffled (so places learned together do not come back in the same order), a share of them first,
 * then each batch of new places (intros in a row) with their first questions, in a different order, mixed among the rest; `spread` then keeps screens about
 * the same place apart.
 */
function arrange(reviews: RoundItem[], fresh: string[], rng: () => number): RoundItem[] {
  // The greedy `spread` can paint itself into a corner at the end of a round (two memories of one place left); another shuffle usually avoids it.
  let best: RoundItem[] = [];
  for (let attempt = 0; attempt < ARRANGE_TRIES; attempt++) {
    const items = arrangeOnce(reviews, fresh, rng);
    if (closest(items) >= MIN_DISTANCE) return items;
    if (!best.length || closest(items) > closest(best)) best = items;
  }
  return best;
}

const ARRANGE_TRIES = 20;

/** How close the nearest two screens about the same place are (Infinity when every place shows once). */
function closest(items: RoundItem[]): number {
  const lastAt = new Map<string, number>();
  let min = Infinity;
  items.forEach((i, at) => {
    const before = lastAt.get(i.place);
    if (before !== undefined) min = Math.min(min, at - before);
    lastAt.set(i.place, at);
  });
  return min;
}

function arrangeOnce(reviews: RoundItem[], fresh: string[], rng: () => number): RoundItem[] {
  const pool = shuffled(reviews, rng);
  const batches: string[][] = [];
  for (let i = 0; i < fresh.length; i += INTRO_BATCH) batches.push(fresh.slice(i, i + INTRO_BATCH));
  const plan: RoundItem[] = take(pool, Math.floor(pool.length / (batches.length + 1)));
  // The batch before the last holds back its last few questions to sit between the last batch's intros and its questions,
  // so a short last batch (a Review set of six new places: five, then one) is not asked straight after its intro.
  let held: string[] = [];
  batches.forEach((batch, b) => {
    plan.push(...batch.map((place): RoundItem => ({ kind: 'intro', place })));
    const mine = take(pool, Math.ceil(pool.length / (batches.length - b)));
    const asks = [...held, ...shuffled(batch, rng)];
    held = b === batches.length - 2 ? asks.splice(-(MIN_DISTANCE - 1)) : [];
    asks.forEach((place, i) => {
      plan.push(...take(mine, Math.ceil(mine.length / (asks.length - i))));
      plan.push({ kind: 'question', place, memory: 'where', type: 'what-is-this' });
    });
  });
  return spread(plan, new Set(fresh));
}

/** Places items in plan order, but each time takes the first item at least MIN_DISTANCE from the last screen about its place; a new place's question always after its intro. When nothing fits (a round about one or two places), the farthest one goes next. */
function spread(plan: RoundItem[], fresh: Set<string>): RoundItem[] {
  const left = [...plan];
  const out: RoundItem[] = [];
  const lastAt = new Map<string, number>();
  const shown = new Set<string>();
  const distance = (i: RoundItem) => out.length - (lastAt.get(i.place) ?? -Infinity);
  while (left.length) {
    const allowed = left.filter((i) => i.kind === 'intro' || !fresh.has(i.place) || shown.has(i.place));
    const next = allowed.find((i) => distance(i) >= MIN_DISTANCE) ?? allowed.reduce((a, b) => (distance(b) > distance(a) ? b : a));
    left.splice(left.indexOf(next), 1);
    if (next.kind === 'intro') shown.add(next.place);
    lastAt.set(next.place, out.length);
    out.push(next);
  }
  return out;
}

/** A Study round at `now`: what is due (most overdue first), then today's intake. `more` is false once nothing is due and the intake is used. */
export function studyRound(tree: Tree, log: readonly LogEntry[], now: Date, opts: RoundOptions & PlanOptions = {}): Round {
  const state = replay(log);
  const plan = studyPlan(tree, state, now, opts);
  return fill(tree, state, plan.due, plan.intake, [], opts);
}

/** A Review round over a set of place ids (places with `quiz: "none"` are dropped): due first, then new places with their intro, then the set's other memories, soonest due first. A right answer before due moves nothing (see applyAnswer). */
export function reviewRound(tree: Tree, set: readonly string[], log: readonly LogEntry[], now: Date, opts: RoundOptions = {}): Round {
  const state = replay(log);
  const places = set.map((id) => tree.getPlace(id)).filter((p): p is Place => p !== undefined && REVIEW_KINDS.includes(p.quiz));
  const ids = places.map((p) => p.id);
  const due = dueNow(tree, ids, state, now);
  const dueKeys = new Set(due.map((r) => memoryKey(r.place, r.memory)));
  const rest = askable(tree, ids, state).filter((r) => !dueKeys.has(memoryKey(r.place, r.memory)));
  const fresh = inCourseOrder(tree, places).filter((p) => !state.places[p.id]).map((p) => p.id);
  return fill(tree, state, due, fresh, rest, opts);
}

/** After an answer to item `index`: a miss is asked once more at the end of the round, typed for the memory as it is now (`log` ends with the miss), unless that would be the very next screen about its place (a miss on the last question waits for its next review). A slip counts as right: pass `right: true`. Pass `tree` so a place without "find it" is re-asked as what is this. */
export function afterAnswer(round: Round, index: number, right: boolean, log: readonly LogEntry[], tree?: Tree): Round {
  const item = round.items[index];
  if (right || !item || item.kind !== 'question' || item.reask) return round;
  let last = index;
  round.items.forEach((i, at) => { if (at > index && i.place === item.place) last = at; });
  if (round.items.length - last < 2) return round;
  const type = questionType(replay(log).places[item.place], item.memory, findsIt(tree?.getPlace(item.place))) ?? item.type;
  return { ...round, items: [...round.items, { ...item, type, reask: true }] };
}
