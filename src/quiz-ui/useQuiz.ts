// The learner's progress as React state: the record in this browser, the memories replayed from its log, today's plan.
import { useCallback, useMemo, useState } from 'react';
import { browserStorage, createStore, replay, studyPlan, withSlip, type LogEntry, type QuizState, type QuizStore, type StudyPlan } from '../quiz';
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
  /** Reads the record again from the store, after a file was loaded or its load undone. */
  reload(): void;
  /** True once the learner has any progress (an intro or an answer). */
  hasProgress: boolean;
}

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
    const saved = store.save({ log, focus: record.focus });
    setRecord(saved);
    return saved.log;
  }, [store, record.focus]);
  const state = useMemo(() => replay(record.log), [record.log]);
  const plan = useMemo(() => studyPlan(tree, state, now(), { focus: record.focus }), [tree, state, record.focus, now]);
  return {
    store, log: record.log, state, plan, now, persistent: store.status().persistent,
    record: (entry) => commit([...record.log, entry]),
    focus: record.focus,
    setFocus: (ids) => setRecord(store.save({ log: record.log, focus: ids })),
    reload: () => setRecord(store.load()),
    hasProgress: record.log.length > 0,
    slip: () => commit(withSlip(record.log)),
    unslip: () => commit(withoutSlip(record.log)),
  };
}
