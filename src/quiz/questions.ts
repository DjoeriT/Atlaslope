// Question making: turns an engine RoundItem into a question with fair choices. Plain data in, plain data out; no React, no map.
import type { Measures, Sheet } from '../facts/types';
import type { Place, Tree } from '../tree';
import type { RoundItem } from './types';

/** The kinds of fact question. Level (DO, DOCa) is not asked: 68 of the 73 Study places are a DO, so "DO" was nearly always right (owner card, 17 Oct 2026). */
export const FACT_KINDS = ['grape', 'style', 'climate'] as const;
export type FactKind = (typeof FACT_KINDS)[number];

/** The facts the questions read; `src/facts` has the real ones (`sheetOf`, `measuresOf`), tests pass small ones. */
export interface FactSource {
  sheetOf(placeId: string): Sheet | undefined;
  measuresOf(placeId: string): Measures | undefined;
}

export type Question =
  | { type: 'find-it'; place: string }
  /** `choices` are place ids, `answer` is one of them. */
  | { type: 'what-is-this'; place: string; choices: string[]; answer: string }
  /** `choices` are the texts shown, `answer` is the true one. */
  | { type: 'fact'; place: string; fact: FactKind; choices: string[]; answer: string };

export interface QuestionContext {
  tree: Tree;
  facts: FactSource;
  /** Place ids that may appear as wrong choices; default: every place the quiz can ask (core, Vinos de Calidad, zones). */
  pool?: readonly string[];
  /** Returns [0, 1); pass `seededRandom(seed)` so the choice order is fixed. */
  rng: () => number;
}

/** A small seeded random generator (mulberry32): the same seed gives the same sequence. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A copy of `items` in random order (Fisher-Yates with `rng`). */
export function shuffled<T>(items: readonly T[], rng: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** A main grape as shown: the place's own name, with the usual name after it when they differ ("local (usual)"). */
const grapeText = (g: { local: string; grape?: string }): string => (g.grape && g.grape !== g.local ? `${g.local} (${g.grape})` : g.local);

/** The one fact shown after every answer: the place's main grape(s), "local (usual)". Undefined when the place has no sheet or no main grape. */
export function revealFact(placeId: string, facts: FactSource): string | undefined {
  const main = facts.sheetOf(placeId)?.grapes.main ?? [];
  return main.length ? main.map(grapeText).join(', ') : undefined;
}

/** The why shown after every answer: the place guide's own why line (its lede, "why it tastes the way it does"), cited as the guide. Undefined when the place has no guide. */
export function revealWhy(placeId: string, guideOf: (id: string) => { lede: { text: string } } | undefined): string | undefined {
  return guideOf(placeId)?.lede.text;
}

/** Every text of this kind that is true of the place (empty: the place has nothing to ask). Climate: the class with the largest share only. */
function truths(kind: FactKind, place: Place, ctx: QuestionContext): { asked: string | undefined; all: string[] } {
  if (kind === 'grape') {
    const main = ctx.facts.sheetOf(place.id)?.grapes.main ?? [];
    return { asked: main[0] ? grapeText(main[0]) : undefined, all: main.flatMap((g) => [grapeText(g), g.local, ...(g.grape ? [g.grape] : [])]) };
  }
  if (kind === 'style') {
    const names = ctx.facts.sheetOf(place.id)?.famous?.styles.map((s) => s.name) ?? [];
    return { asked: names[0], all: names };
  }
  const koppen = ctx.facts.measuresOf(place.id)?.koppen ?? [];
  const top = koppen.reduce<(typeof koppen)[number] | undefined>((best, k) => (!best || k.share > best.share ? k : best), undefined);
  // A wrong choice must not be any climate class the place has, not just its largest.
  return { asked: top?.name, all: koppen.map((k) => k.name) };
}

/** The main words of a style name: lowercase, accents and plural s removed, words under 6 letters dropped ("Txakolis blancos fermentado en barrica" gives blanco, fermentado, barrica). */
const styleWords = (name: string): string[] =>
  name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z]+/).map((w) => w.replace(/s$/, '')).filter((w) => w.length >= 6);

/** Two style names are the same style when they share a main word, so spelling variants ("Txacoli blanco ...", "Txakoli blanco ...") and a shared "Tostado" are not offered as wrong choices. */
const sameStyle = (a: string, b: string): boolean => styleWords(a).some((w) => styleWords(b).includes(w));

function poolPlaces(ctx: QuestionContext): Place[] {
  const ids = ctx.pool ?? ctx.tree.places.filter((p) => p.quiz !== 'none').map((p) => p.id);
  return ids.map((id) => ctx.tree.getPlace(id)).filter((p): p is Place => p !== undefined);
}

/** Fact kinds that can be asked of this place: it has the fact and the pool holds at least three other places with different true values. */
export function askableFacts(placeId: string, ctx: QuestionContext): FactKind[] {
  const place = ctx.tree.getPlace(placeId);
  if (!place) return [];
  return FACT_KINDS.filter((kind) => factChoices(kind, place, ctx, (xs) => xs) !== undefined);
}

function factChoices(kind: FactKind, place: Place, ctx: QuestionContext, order: <T>(xs: T[]) => T[]): { answer: string; wrong: string[] } | undefined {
  const own = truths(kind, place, ctx);
  if (!own.asked) return undefined;
  const mine = new Set(own.all.map((t) => t.toLowerCase()));
  const seen = new Set<string>();
  const candidates: string[] = [];
  for (const other of poolPlaces(ctx)) {
    if (other.id === place.id) continue;
    const t = truths(kind, other, ctx).asked;
    if (!t || mine.has(t.toLowerCase()) || seen.has(t.toLowerCase())) continue;
    if (kind === 'style' && own.all.some((n) => sameStyle(n, t))) continue;
    // A wrong text must be true of some other place and false of this one; `asked` of the other place is true of it.
    seen.add(t.toLowerCase());
    candidates.push(t);
  }
  if (candidates.length < 3) return undefined;
  return { answer: own.asked, wrong: order(candidates).slice(0, 3) };
}

/**
 * Builds the question for a round item: find-it has the target only; what-is-this has the place and three others from the pool
 * (neighbours in the same study region first); fact picks one of the fact kinds the place can be asked (grape, style,
 * climate), with three wrong choices that are true of other places and not of this one. Choices are shuffled with `ctx.rng`.
 * Returns undefined for an intro, an unknown place, or a fact question when no fact kind is available.
 */
export function makeQuestion(item: RoundItem, ctx: QuestionContext): Question | undefined {
  if (item.kind !== 'question') return undefined;
  const place = ctx.tree.getPlace(item.place);
  if (!place) return undefined;
  if (item.type === 'find-it') return { type: 'find-it', place: place.id };

  if (item.type === 'what-is-this') {
    const others = poolPlaces(ctx).filter((p) => p.id !== place.id);
    const near = shuffled(others.filter((p) => p.region === place.region), ctx.rng);
    const far = shuffled(others.filter((p) => p.region !== place.region), ctx.rng);
    const wrong = [...near, ...far].slice(0, 3).map((p) => p.id);
    if (wrong.length < 3) return undefined;
    return { type: 'what-is-this', place: place.id, choices: shuffled([place.id, ...wrong], ctx.rng), answer: place.id };
  }

  const kinds = askableFacts(place.id, ctx);
  if (!kinds.length) return undefined;
  const fact = kinds[Math.floor(ctx.rng() * kinds.length)]!;
  const { answer, wrong } = factChoices(fact, place, ctx, (xs) => shuffled(xs, ctx.rng))!;
  return { type: 'fact', place: place.id, fact, choices: shuffled([answer, ...wrong], ctx.rng), answer };
}
