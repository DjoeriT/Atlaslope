// The learner's progress as React state: the record in this browser, the memories replayed from its log, today's plan.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { browserStorage, createStore, replay, studyPlan, withSlip, type Course, type LogEntry, type QuizState, type QuizStore, type StudyPlan } from '../quiz';
import type { Tree } from '../tree';

export interface QuizApi {
  store: QuizStore;
  log: LogEntry[];
  state: QuizState;
  plan: StudyPlan;
  /** False: storage is blocked, progress lasts for this visit only. */
  persistent: boolean;
  /** Appends an entry; returns the log as it is now. */
  record(entry: LogEntry): LogEntry[];
  /** "That was a slip": marks the last answer, a miss, as right for the schedule. Returns the log. */
  slip(): LogEntry[];
  /** Takes the slip mark off the last answer again. Returns the log. */
  unslip(): LogEntry[];
  now(): Date;
  /** The focus: study region ids or place ids. */
  focus: string[];
  setFocus(ids: string[]): void;
  /** "My course": which places Study asks. */
  course: Course;
  setCourse(course: Course): void;
  /** Reads the record again from the store, after a file was loaded or its load undone. */
  reload(): void;
  /** True once the learner has any progress (an intro or an answer). */
  hasProgress: boolean;
}

/** The learner's own day: the engine counts today's new places from local midnight, not UTC midnight. */
export const localDay = (d: Date): { utcOffsetMinutes: number } => ({ utcOffsetMinutes: -d.getTimezoneOffset() });

/** The log without the slip mark on its last answer. */
export function withoutSlip(log: readonly LogEntry[]): LogEntry[] {
  const last = log[log.length - 1];
  if (!last || last.kind !== 'answer' || !last.slip) return [...log];
  const { slip: _slip, ...rest } = last;
  return [...log.slice(0, -1), rest];
}

export function useQuiz(tree: Tree, now: () => Date): QuizApi {
  const store = useMemo(() => createStore(browserStorage(), now), [now]);
  const [record, setRecord] = useState(() => store.load());
  const commit = useCallback((log: LogEntry[]) => {
    const saved = store.save({ log, focus: record.focus, course: record.course });
    setRecord(saved);
    return saved.log;
  }, [store, record.focus, record.course]);
  const state = useMemo(() => replay(record.log), [record.log]);
  // A save in another tab of this browser: read the record again so this tab doesn't work from a stale copy.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === null || e.key.startsWith('atlaslope.quiz')) setRecord(store.load()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [store]);
  // The plan is for today: recomputed when the local date changes, not only when the log does.
  const today = now().toDateString();
  const plan = useMemo(() => studyPlan(tree, state, now(), { focus: record.focus, course: record.course, ...localDay(now()) }), [tree, state, record.focus, record.course, now, today]);
  return {
    store, log: record.log, state, plan, now, persistent: store.status().persistent,
    record: (entry) => commit([...record.log, entry]),
    focus: record.focus,
    setFocus: (ids) => setRecord(store.save({ log: record.log, focus: ids, course: record.course })),
    course: record.course,
    setCourse: (course) => setRecord(store.save({ log: record.log, focus: record.focus, course })),
    reload: () => setRecord(store.load()),
    hasProgress: record.log.length > 0,
    slip: () => commit(withSlip(record.log)),
    unslip: () => commit(withoutSlip(record.log)),
  };
}
