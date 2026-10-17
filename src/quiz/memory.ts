// Memories from the answer log: boxes, due dates and shades. Rules tagged [A] in the release 7 digest are each one constant or one function here.
import type { Answer, LogEntry, MemoryName, MemoryState, PlaceMemory, QuestionType, QuizState, Shade } from './types';

export const DAY_MS = 86_400_000;
/** Days until a memory in box 1 to 5 is due again. [O] */
export const BOX_GAPS_DAYS = [1, 3, 7, 14, 30] as const;
/** A miss can drop a memory out of the boxes, to box 0 (ruling 17 Oct 2026). */
export const MIN_BOX = 0;
export const MAX_BOX = BOX_GAPS_DAYS.length;
/** The box a memory enters on its first right answer. [A] */
export const FIRST_BOX = 1;
/** Days until a memory in a box (0 to 5) is due again; box 0 (after a miss out of box 1, or before any right answer) waits a day. */
export function gapDays(box: number): number {
  return box === 0 ? 1 : BOX_GAPS_DAYS[box - 1];
}
/** Shades from lowest to highest. */
export const SHADES: readonly Shade[] = ['new', 'learning', 'known', 'solid'];

const time = (iso: string) => Date.parse(iso);
const addDays = (iso: string, days: number) => new Date(time(iso) + days * DAY_MS).toISOString();

/** Whether an answer counts as right for the schedule: a miss marked as a slip does. [A: slip log form] */
export function countsAsRight(a: Answer): boolean {
  return a.right || a.slip === true;
}

/** When a seen place's memories start being due: the intro (or first answer) starts the clock. [A] */
export function clockStart(seenAt: string): string {
  return seenAt;
}

/** A memory nobody has answered yet. */
export function newMemory(due: string): MemoryState {
  return { box: 0, due, shade: 'new', answers: 0, streak: 0, streakDays: [] };
}

/** Known: two rights in a row on different days (at least a day apart), so cramming in one sitting does not count (owner card, 17 Oct 2026). Solid: three. */
function shadeFrom(answers: number, streakDays: string[]): Shade {
  if (answers === 0) return 'new';
  if (streakDays.length >= 3) return 'solid';
  return streakDays.length >= 2 ? 'known' : 'learning';
}

/** One answer applied to a memory: right when due moves up a box (max 5); right before due changes no box or due date (so a miss re-asked in the same round moves nothing); a miss drops a box (min 0) and is due after that box's gap. */
export function applyAnswer(m: MemoryState, at: string, right: boolean): MemoryState {
  const answers = m.answers + 1;
  if (!right) {
    const box = Math.max(MIN_BOX, m.box - 1);
    return { box, due: addDays(at, gapDays(box)), shade: shadeFrom(answers, []), answers, streak: 0, streakDays: [] };
  }
  const streak = m.streak + 1;
  const last = m.streakDays[m.streakDays.length - 1];
  const streakDays =
    m.streakDays.length < 3 && (last === undefined || time(at) - time(last) >= DAY_MS) ? [...m.streakDays, at] : m.streakDays;
  const shade = shadeFrom(answers, streakDays);
  if (time(at) < time(m.due)) return { ...m, shade, answers, streak, streakDays };
  const box = m.box === 0 ? FIRST_BOX : Math.min(MAX_BOX, m.box + 1);
  return { box, due: addDays(at, gapDays(box)), shade, answers, streak, streakDays };
}

/** Replays the log, oldest first, into every seen place's memories. The log is the only record; the same log always gives the same state. */
export function replay(log: readonly LogEntry[]): QuizState {
  const places: Record<string, PlaceMemory> = {};
  for (const e of log) {
    let p = places[e.place];
    if (!p) {
      const due = clockStart(e.at);
      p = places[e.place] = { seenAt: e.at, where: newMemory(due), what: newMemory(due) };
    }
    if (e.kind === 'answer') p[e.memory] = applyAnswer(p[e.memory], e.at, countsAsRight(e));
  }
  return { places };
}

const rank = (s: Shade) => SHADES.indexOf(s);
const isKnown = (s: Shade) => rank(s) >= rank('known');

/** A place's shade follows `where`, capped by `what`: new while `where` is new, known only when both are known, solid only when both are solid, otherwise learning (ruling 17 Oct 2026). */
export function placeShade(p: PlaceMemory | undefined): Shade {
  if (!p || p.where.shade === 'new') return 'new';
  if (p.where.shade === 'solid' && p.what.shade === 'solid') return 'solid';
  return isKnown(p.where.shade) && isKnown(p.what.shade) ? 'known' : 'learning';
}

/** Whether both of a place's memories are known or solid. */
export function placeKnown(p: PlaceMemory | undefined): boolean {
  return p !== undefined && isKnown(p.where.shade) && isKnown(p.what.shade);
}

/** The question for a memory: `where` new is what is this, `where` asked is find it; `what` is the fact question, asked only once `where` is known. Null when the memory cannot be asked yet. */
export function questionType(p: PlaceMemory | undefined, memory: MemoryName): QuestionType | null {
  if (memory === 'where') return !p || p.where.shade === 'new' ? 'what-is-this' : 'find-it';
  return p && isKnown(p.where.shade) ? 'fact' : null;
}

/** Marks the last answer, if it is an unmarked miss, as "That was a slip". The log keeps the miss; replay counts it as right. Otherwise the log comes back unchanged. */
export function withSlip(log: readonly LogEntry[]): LogEntry[] {
  const last = log[log.length - 1];
  if (!last || last.kind !== 'answer' || last.right || last.slip) return [...log];
  return [...log.slice(0, -1), { ...last, slip: true }];
}
