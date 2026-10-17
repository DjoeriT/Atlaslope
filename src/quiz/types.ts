// The quiz engine's data: the answer log (#43) and the memories replayed from it. Plain data, no React, no map, no storage.

/** Each place has two memories: `where` (map questions) and `what` (the fact question). */
export type MemoryName = 'where' | 'what';

/** What is this (four choices), find it on the map, or the fact question. */
export type QuestionType = 'what-is-this' | 'find-it' | 'fact';

/** new: never asked; learning: asked; known: two rights in a row, a day apart; solid: three rights in a row, each a day apart. */
export type Shade = 'new' | 'learning' | 'known' | 'solid';

/** One answer. A miss the learner marked "That was a slip" keeps `right: false` and gets `slip: true`. */
export interface Answer {
  kind: 'answer';
  place: string;
  memory: MemoryName;
  type: QuestionType;
  right: boolean;
  slip?: boolean;
  /** ISO time. */
  at: string;
  seconds: number;
}

/** A place's intro was shown: the place counts as seen (and in today's intake), not as answered. */
export interface Intro {
  kind: 'intro';
  place: string;
  /** ISO time. */
  at: string;
}

export type LogEntry = Answer | Intro;

export interface MemoryState {
  /** 0 until the first right answer, then 1 to 5. */
  box: number;
  /** ISO time the memory is due; set from the moment the place is first seen. */
  due: string;
  shade: Shade;
  answers: number;
  /** Right answers since the last miss. */
  streak: number;
  /** Times of right answers in the streak, each at least a day after the one before (at most three are kept). */
  streakDays: string[];
}

export interface PlaceMemory {
  /** ISO time of the place's first intro or answer. */
  seenAt: string;
  where: MemoryState;
  what: MemoryState;
}

/** Every seen place's memories, by place id. A place missing here is new. */
export interface QuizState {
  places: Record<string, PlaceMemory>;
}

/** A memory that can be asked, with when it is due. */
export interface MemoryRef {
  place: string;
  memory: MemoryName;
  due: string;
}

export type RoundItem =
  | { kind: 'intro'; place: string }
  | { kind: 'question'; place: string; memory: MemoryName; type: QuestionType; reask?: boolean };

export interface Round {
  items: RoundItem[];
  /** True: offer "Keep going". False: nothing due and intake used, offer "Learn 5 more" or "Practise any mix". */
  more: boolean;
}
