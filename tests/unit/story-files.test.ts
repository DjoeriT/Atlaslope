import { describe, expect, it } from 'vitest';
import { storyFiles } from '../../src/story/files';
import { storyIds } from '../../src/story/load';

describe('story map files, found by name in data/story/', () => {
  it('has names, rivers and a slope tint for every story', () => {
    for (const id of storyIds()) {
      const f = storyFiles(id);
      expect(f.names, `${id} names`).toBeTruthy();
      expect(f.rivers, `${id} rivers`).toBeTruthy();
      expect(f.slope, `${id} slope`).toBeTruthy();
    }
  });
  it('gives nothing for a story with no files, so its layers are skipped', () => {
    expect(storyFiles('no-such-story')).toEqual({ names: undefined, rivers: undefined, slope: undefined });
  });
});
