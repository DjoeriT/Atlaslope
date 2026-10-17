// The pure parts of playing a round: what the dots show, what the map is asked to show, the score and the misses. No React.
import type { QuizView } from '../map/quiz';
import type { MemoryName, QuestionType, Round } from '../quiz';

/** What happened to one question. `picked` is a place id (find it, what is this) or the text chosen (fact). */
export interface Outcome {
  place: string;
  memory: MemoryName;
  type: QuestionType;
  reask: boolean;
  right: boolean;
  /** A miss the learner marked "That was a slip". */
  slip: boolean;
  /** "I don't know". */
  skipped: boolean;
  picked?: string;
}

/** Outcomes by item index. */
export type Outcomes = Record<number, Outcome>;

export type DotState = 'ok' | 'bad' | 'cur' | 'todo';

/** A question that counts as right for the learner: right, or a miss marked as a slip. */
export const counted = (o: Outcome): boolean => o.right || o.slip;

/** The dots and the "Question n of N" numbers: questions only, never intros. `index` is the item in play. */
export function progressOf(round: Round, outcomes: Outcomes, index: number): { dots: DotState[]; n: number; of: number; right: number; wrong: number } {
  const dots: DotState[] = [];
  let n = 0, right = 0, wrong = 0;
  round.items.forEach((item, i) => {
    if (item.kind !== 'question') return;
    const o = outcomes[i];
    if (o) {
      dots.push(counted(o) ? 'ok' : 'bad');
      if (counted(o)) right++; else wrong++;
    } else dots.push(i === index ? 'cur' : 'todo');
    if (i <= index) n++;
  });
  return { dots, n, of: dots.length, right, wrong };
}

/** The round without the re-ask that a miss added (the miss was marked as a slip). */
export function withoutReask(round: Round, place: string, memory: MemoryName): Round {
  const at = round.items.map((i) => i.kind === 'question' && i.reask && i.place === place && i.memory === memory).lastIndexOf(true);
  return at < 0 ? round : { ...round, items: round.items.filter((_, i) => i !== at) };
}

/** The score: questions asked for the first time (a re-ask is a second chance, not a second mark). */
export function scoreOf(outcomes: Outcomes): { right: number; of: number } {
  const first = Object.values(outcomes).filter((o) => !o.reask);
  return { right: first.filter(counted).length, of: first.length };
}

/** The first-time misses that stayed misses, in the order asked. */
export function missesOf(outcomes: Outcomes): Outcome[] {
  return Object.entries(outcomes).sort(([a], [b]) => Number(a) - Number(b)).map(([, o]) => o).filter((o) => !o.reask && !counted(o));
}

/** What the map is asked to show. Names stay hidden. */
export interface MapStep {
  place: string;
  /** The place's Rioja zone, so its zones are drawn and can be tapped. */
  zone: boolean;
  type: QuestionType | 'intro';
  /** The place tapped so far (find it), or the one the learner picked in the reveal. */
  picked: string | null;
  revealed: boolean;
}

export function viewFor(step: MapStep): QuizView {
  const base = { hideNames: true, showZones: step.zone };
  if (step.type === 'intro') return { ...base, dimExcept: [step.place], select: step.place, reveal: { answer: step.place } };
  if (step.type === 'find-it' && !step.revealed) return { ...base, dimExcept: null, select: step.picked, reveal: null };
  if (step.type === 'find-it') {
    const shown = step.picked && step.picked !== step.place ? [step.place, step.picked] : [step.place];
    return { ...base, dimExcept: shown, select: step.place, reveal: { answer: step.place, ...(shown.length > 1 ? { picked: step.picked! } : {}) } };
  }
  return { ...base, dimExcept: [step.place], select: step.place, reveal: step.revealed ? { answer: step.place } : null };
}

/** Today's clock for the quiz: the real one, or (debug builds only) a fixed start from `?now=` that keeps counting. */
export function makeClock(fixed: string | null, real: () => number = Date.now): () => Date {
  const base = fixed ? Date.parse(fixed) : NaN;
  if (Number.isNaN(base)) return () => new Date(real());
  const start = real();
  return () => new Date(base + real() - start);
}
