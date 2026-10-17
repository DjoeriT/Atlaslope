// The quiz engine: plain TypeScript, no React, no map, no storage, no clock (the caller passes `now`). One engine for Study and Review.
export type { Answer, Intro, LogEntry, MemoryName, MemoryRef, MemoryState, PlaceMemory, QuestionType, QuizState, Round, RoundItem, Shade } from './types';
export {
  applyAnswer, BOX_GAPS_DAYS, clockStart, countsAsRight, DAY_MS, FIRST_BOX, gapDays, MAX_BOX, MIN_BOX, newMemory, placeKnown, placeShade,
  questionType, replay, SHADES, withSlip,
} from './memory';
export { askable, courseKey, dueNow, inCourseOrder, INTAKE_PER_DAY, REVIEW_KINDS, STUDY_KINDS, studyPlan, studySet, type PlanOptions, type StudyPlan } from './plan';
export { afterAnswer, memoryKey, reviewRound, ROUND_SIZE, roundKeys, studyRound, type RoundOptions } from './round';
export {
  browserStorage, createStore, emptyRecord, migrate, RECORD_VERSION,
  type ImportResult, type Migrated, type QuizRecord, type QuizStore, type StoreStatus,
} from './store';
export {
  askableFacts, FACT_KINDS, makeQuestion, revealFact, seededRandom, type FactKind, type FactSource, type Question, type QuestionContext,
} from './questions';
