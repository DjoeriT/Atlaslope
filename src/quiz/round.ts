// Rounds for the Study and Review doors: up to 20 questions, due memories first, a new place's intro before its first question.
import type { Place, Tree } from '../tree';
import { questionType, replay } from './memory';
import { askable, dueNow, inCourseOrder, REVIEW_KINDS, studyPlan, type PlanOptions } from './plan';
import type { LogEntry, MemoryName, MemoryRef, QuizState, Round, RoundItem } from './types';

/** Questions in a round, before re-asked misses. [O] */
export const ROUND_SIZE = 20;

export interface RoundOptions {
  /** Questions in the round (Review offers 10 or 20). Default 20. */
  size?: number;
  /** Memories already asked in this sitting (see memoryKey); "Keep going" passes the earlier rounds' keys so it builds from what is left. */
  asked?: Iterable<string>;
}

/** The key of one memory of one place, as used in `asked`. */
export function memoryKey(place: string, memory: MemoryName): string {
  return `${place}/${memory}`;
}

/** Every memory key a round asks, for the next round's `asked`. */
export function roundKeys(round: Round): string[] {
  return round.items.flatMap((i) => (i.kind === 'question' ? [memoryKey(i.place, i.memory)] : []));
}

/** Fills a round in order: due memories, then new places (intro, then its first question), then any other memories. [A: order] */
function fill(state: QuizState, due: MemoryRef[], fresh: string[], rest: MemoryRef[], size: number, asked: Set<string>): Round {
  const items: RoundItem[] = [];
  const left = (r: MemoryRef) => !asked.has(memoryKey(r.place, r.memory));
  const queue = [
    ...due.filter(left).map((r) => ({ ref: r })),
    ...fresh.filter((id) => !asked.has(memoryKey(id, 'where'))).map((id) => ({ fresh: id })),
    ...rest.filter(left).map((r) => ({ ref: r })),
  ];
  let questions = 0;
  for (const q of queue) {
    if (questions === size) return { items, more: true };
    if ('fresh' in q) {
      items.push({ kind: 'intro', place: q.fresh }, { kind: 'question', place: q.fresh, memory: 'where', type: 'what-is-this' });
    } else {
      items.push({ kind: 'question', place: q.ref.place, memory: q.ref.memory, type: questionType(state.places[q.ref.place], q.ref.memory)! });
    }
    questions++;
  }
  return { items, more: false };
}

/** A Study round at `now`: what is due (most overdue first), then today's intake. `more` is false once nothing is due and the intake is used. */
export function studyRound(tree: Tree, log: readonly LogEntry[], now: Date, opts: RoundOptions & PlanOptions = {}): Round {
  const state = replay(log);
  const plan = studyPlan(tree, state, now, opts);
  return fill(state, plan.due, plan.intake, [], opts.size ?? ROUND_SIZE, new Set(opts.asked));
}

/** A Review round over a set of place ids (places never asked are dropped): due first, then new places with their intro, then the set's other memories, soonest due first. A right answer before due moves nothing (see applyAnswer). */
export function reviewRound(tree: Tree, set: readonly string[], log: readonly LogEntry[], now: Date, opts: RoundOptions = {}): Round {
  const state = replay(log);
  const places = set.map((id) => tree.getPlace(id)).filter((p): p is Place => p !== undefined && REVIEW_KINDS.includes(p.quiz));
  const ids = places.map((p) => p.id);
  const due = dueNow(tree, ids, state, now);
  const dueKeys = new Set(due.map((r) => memoryKey(r.place, r.memory)));
  const rest = askable(tree, ids, state).filter((r) => !dueKeys.has(memoryKey(r.place, r.memory)));
  const fresh = inCourseOrder(tree, places).filter((p) => !state.places[p.id]).map((p) => p.id);
  return fill(state, due, fresh, rest, opts.size ?? ROUND_SIZE, new Set(opts.asked));
}

/** After an answer to item `index`: a miss is asked once more at the end of the round, typed for the memory as it is now (`log` ends with the miss). A slip counts as right: pass `right: true`. */
export function afterAnswer(round: Round, index: number, right: boolean, log: readonly LogEntry[]): Round {
  const item = round.items[index];
  if (right || !item || item.kind !== 'question' || item.reask) return round;
  const type = questionType(replay(log).places[item.place], item.memory) ?? item.type;
  return { ...round, items: [...round.items, { ...item, type, reask: true }] };
}
