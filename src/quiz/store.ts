// Progress storage: one versioned record behind one interface, so sync can plug in later. No React, no map.
import type { LogEntry, MemoryName, QuestionType } from './types';

export const RECORD_VERSION = 1;
const KEY = 'atlaslope.quiz';
const BACKUP_KEY = 'atlaslope.quiz.backup';

/** Everything a learner has: the answer log (boxes, shades and due dates are replayed from it) and the focus (study region or place ids). */
export interface QuizRecord {
  version: number;
  log: LogEntry[];
  focus: string[];
  /** ISO time of the last save; empty for a record never saved. */
  savedAt: string;
}

/** What migrate() makes of stored or loaded data. `newer` is the version number when the data was written by a later app version. */
export type Migrated = { ok: true; record: QuizRecord } | { ok: false; newer: number | null; message: string };

/** `persistent` false: storage is blocked, progress lasts for this visit only. `newerVersion`: the stored record is from a later app version and is left untouched. */
export interface StoreStatus {
  persistent: boolean;
  newerVersion: number | null;
}

export type ImportResult = { ok: true } | { ok: false; message: string };

export interface QuizStore {
  status(): StoreStatus;
  /** The current record: the stored one, migrated; an empty version-1 record when there is none. */
  load(): QuizRecord;
  /** Stamps `savedAt` and keeps the record (in storage when possible, else in memory). Never overwrites a newer-version record in storage. */
  save(record: { log: LogEntry[]; focus: string[] }): QuizRecord;
  /** The record as the text of a file to save. */
  exportFile(): string;
  /** Replaces the record with a file's; the previous record is kept as a backup. A bad file is refused and changes nothing. */
  importFile(text: string): ImportResult;
  /** Brings back the record that the last import replaced. False when there is none. */
  restoreBackup(): boolean;
  hasBackup(): boolean;
}

export const emptyRecord = (): QuizRecord => ({ version: RECORD_VERSION, log: [], focus: [], savedAt: '' });

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const isIso = (x: unknown): x is string => typeof x === 'string' && !Number.isNaN(Date.parse(x));
const MEMORIES: MemoryName[] = ['where', 'what'];
const TYPES: QuestionType[] = ['what-is-this', 'find-it', 'fact'];
const NOT_A_FILE = 'This is not a progress file.';

function validEntry(e: unknown): e is LogEntry {
  if (!isObject(e) || typeof e.place !== 'string' || !isIso(e.at)) return false;
  if (e.kind === 'intro') return true;
  return e.kind === 'answer' && MEMORIES.includes(e.memory as MemoryName) && TYPES.includes(e.type as QuestionType)
    && typeof e.right === 'boolean' && typeof e.seconds === 'number' && (e.slip === undefined || typeof e.slip === 'boolean');
}

/** Brings a stored or loaded record to the current version. Version 0 was `{ answers: [...] }` with the same fields and no `kind`. */
export function migrate(raw: unknown): Migrated {
  if (!isObject(raw)) return { ok: false, newer: null, message: NOT_A_FILE };
  const version = raw.version === undefined ? 0 : raw.version;
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 0) return { ok: false, newer: null, message: NOT_A_FILE };
  if (version > RECORD_VERSION) {
    return { ok: false, newer: version, message: `This progress was saved by a newer version of Atlaslope (version ${version}).` };
  }
  const source = version === 0 ? raw.answers : raw.log;
  if (!Array.isArray(source)) return { ok: false, newer: null, message: NOT_A_FILE };
  const log = version === 0 ? source.map((a) => (isObject(a) && a.kind === undefined ? { kind: 'answer', ...a } : a)) : source;
  const bad = log.findIndex((e) => !validEntry(e));
  if (bad >= 0) return { ok: false, newer: null, message: `Entry ${bad + 1} of the progress is damaged.` };
  const focus = Array.isArray(raw.focus) && raw.focus.every((f) => typeof f === 'string') ? (raw.focus as string[]) : [];
  return { ok: true, record: { version: RECORD_VERSION, log: log as LogEntry[], focus, savedAt: typeof raw.savedAt === 'string' ? raw.savedAt : '' } };
}

function parse(text: string | null): Migrated | null {
  if (text === null) return null;
  try { return migrate(JSON.parse(text)); } catch { return { ok: false, newer: null, message: NOT_A_FILE }; }
}

/** The browser's localStorage, or null when it is blocked. */
export function browserStorage(): Storage | null {
  try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; }
}

/**
 * Progress storage over `storage` (pass `browserStorage()`). A null or throwing storage falls back to memory for the visit
 * and `status().persistent` turns false. `now` is the caller's clock.
 */
export function createStore(storage: Storage | null, now: () => Date = () => new Date()): QuizStore {
  let persistent = storage !== null;
  let newerVersion: number | null = null;
  let current: QuizRecord | null = null;
  let memoryBackup: QuizRecord | null = null;

  const read = (key: string): string | null => {
    if (!storage || !persistent) return null;
    try { return storage.getItem(key); } catch { persistent = false; return null; }
  };
  const write = (key: string, r: QuizRecord): void => {
    if (!storage || !persistent) return;
    try { storage.setItem(key, JSON.stringify(r)); } catch { persistent = false; }
  };
  const backup = (): QuizRecord | null => {
    const stored = parse(read(BACKUP_KEY));
    return stored?.ok ? stored.record : memoryBackup;
  };

  function load(): QuizRecord {
    if (current) return current;
    const stored = parse(read(KEY));
    if (stored?.ok) current = stored.record;
    else {
      if (stored && stored.newer !== null) newerVersion = stored.newer;
      current = emptyRecord();
    }
    return current;
  }

  const store: QuizStore = {
    status: () => { load(); return { persistent, newerVersion }; },
    load: () => structuredClone(load()),
    save(input) {
      load();
      current = { version: RECORD_VERSION, log: structuredClone(input.log), focus: [...input.focus], savedAt: now().toISOString() };
      if (newerVersion === null) write(KEY, current);
      return structuredClone(current);
    },
    exportFile: () => JSON.stringify({ ...load(), savedAt: now().toISOString() }, null, 1),
    importFile(text) {
      load();
      const m = parse(text);
      if (!m || !m.ok) return { ok: false, message: m ? m.message : NOT_A_FILE };
      if (newerVersion !== null) return { ok: false, message: 'Progress from a newer version of Atlaslope is stored here and is left untouched.' };
      memoryBackup = structuredClone(current!);
      write(BACKUP_KEY, memoryBackup);
      store.save(m.record);
      return { ok: true };
    },
    restoreBackup() {
      load();
      const b = backup();
      if (!b || newerVersion !== null) return false;
      store.save(b);
      return true;
    },
    hasBackup: () => { load(); return backup() !== null; },
  };
  return store;
}
