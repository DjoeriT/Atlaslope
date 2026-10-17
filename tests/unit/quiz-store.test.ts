import { describe, expect, it } from 'vitest';
import { createStore, migrate, type LogEntry } from '../../src/quiz';

class MemStorage {
  data = new Map<string, string>();
  getItem(k: string) { return this.data.get(k) ?? null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
}
const asStorage = (s: MemStorage) => s as unknown as Storage;
const blocked = (): Storage => ({
  getItem() { throw new Error('blocked'); },
  setItem() { throw new Error('blocked'); },
} as unknown as Storage);

const NOW = () => new Date('2026-10-17T10:00:00.000Z');
const log = (...places: string[]): LogEntry[] => places.map((place) => ({
  kind: 'answer', place, memory: 'where', type: 'find-it', right: true, at: '2026-10-01T09:00:00.000Z', seconds: 3,
}));

describe('progress store', () => {
  it('gives version 1 with an empty log from empty storage', () => {
    const store = createStore(asStorage(new MemStorage()), NOW);
    expect(store.load()).toMatchObject({ version: 1, log: [], focus: [] });
    expect(store.status()).toEqual({ persistent: true, newerVersion: null });
  });

  it('round-trips save then load, across store instances', () => {
    const s = new MemStorage();
    createStore(asStorage(s), NOW).save({ log: log('a', 'b'), focus: ['rioja'] });
    const back = createStore(asStorage(s), NOW).load();
    expect(back).toEqual({ version: 1, log: log('a', 'b'), focus: ['rioja'], savedAt: '2026-10-17T10:00:00.000Z' });
  });

  it('migrates a version 0 record and keeps every answer', () => {
    const v0 = { answers: log('a', 'b', 'c').map(({ kind: _k, ...rest }) => rest) };
    const s = new MemStorage();
    s.setItem('atlaslope.quiz', JSON.stringify(v0));
    const rec = createStore(asStorage(s), NOW).load();
    expect(rec.version).toBe(1);
    expect(rec.log).toEqual(log('a', 'b', 'c'));
    expect(migrate(v0)).toMatchObject({ ok: true });
  });

  it('reports a newer version and does not overwrite it', () => {
    const s = new MemStorage();
    const future = JSON.stringify({ version: 9, stuff: 1 });
    s.setItem('atlaslope.quiz', future);
    const store = createStore(asStorage(s), NOW);
    expect(store.load().log).toEqual([]);
    expect(store.status().newerVersion).toBe(9);
    store.save({ log: log('a'), focus: [] });
    expect(s.getItem('atlaslope.quiz')).toBe(future);
    expect(store.importFile(store.exportFile()).ok).toBe(false);
    expect(s.getItem('atlaslope.quiz')).toBe(future);
  });

  it('falls back to memory when storage is blocked, and says so', () => {
    const store = createStore(blocked(), NOW);
    expect(store.load().log).toEqual([]);
    store.save({ log: log('a'), focus: [] });
    expect(store.status().persistent).toBe(false);
    expect(store.load().log).toEqual(log('a'));
    expect(createStore(null, NOW).status().persistent).toBe(false);
  });

  it('exports then imports the same log', () => {
    const a = createStore(asStorage(new MemStorage()), NOW);
    a.save({ log: log('a', 'b'), focus: ['x'] });
    const b = createStore(asStorage(new MemStorage()), NOW);
    expect(b.importFile(a.exportFile())).toEqual({ ok: true });
    expect(b.load().log).toEqual(log('a', 'b'));
    expect(b.load().focus).toEqual(['x']);
  });

  it('refuses a bad file with a message and changes nothing', () => {
    const store = createStore(asStorage(new MemStorage()), NOW);
    store.save({ log: log('a'), focus: [] });
    for (const bad of ['not json', '[]', '{"version":1}', '{"version":1,"log":[{"kind":"answer"}]}', '{"version":7,"log":[]}']) {
      const r = store.importFile(bad);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.message).not.toBe('');
    }
    expect(store.load().log).toEqual(log('a'));
    expect(store.hasBackup()).toBe(false);
  });

  it('restores the old record after an import', () => {
    const s = new MemStorage();
    const store = createStore(asStorage(s), NOW);
    store.save({ log: log('old'), focus: ['f'] });
    store.importFile(JSON.stringify({ version: 1, log: log('new'), focus: [] }));
    expect(store.load().log).toEqual(log('new'));
    expect(store.restoreBackup()).toBe(true);
    expect(store.load().log).toEqual(log('old'));
    expect(store.load().focus).toEqual(['f']);
    expect(createStore(asStorage(s), NOW).load().log).toEqual(log('old'));
    expect(createStore(asStorage(new MemStorage()), NOW).restoreBackup()).toBe(false);
  });
});
