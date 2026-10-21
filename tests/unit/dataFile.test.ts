import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadJson } from '../../src/map/dataFile';

afterEach(() => vi.unstubAllGlobals());

describe('loadJson', () => {
  it('fetches a file once for two callers', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ a: 1 }) }));
    vi.stubGlobal('fetch', fetchMock);
    const [a, b] = await Promise.all([loadJson('/once.json'), loadJson('/once.json')]);
    expect(a).toBe(b);
    expect(await loadJson('/once.json')).toEqual({ a: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('tries again after a failure', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false, status: 500 }).mockResolvedValue({ ok: true, json: async () => 1 });
    vi.stubGlobal('fetch', fetchMock);
    await expect(loadJson('/retry.json')).rejects.toThrow('500');
    await new Promise((r) => setTimeout(r, 0));
    expect(await loadJson('/retry.json')).toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
