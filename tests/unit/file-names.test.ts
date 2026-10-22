import { execSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

// Two files whose names differ only in case are one file on a Mac's disk: src/quiz-ui/Doors.tsx and doors.ts broke the build, the UI
// tests and the dev server there while CI on Linux stayed green (Meseta batch 3, 19 Oct 2026).
describe('file names', () => {
  it('never differ only in case', () => {
    const files = execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean);
    const stem = (f: string) => f.replace(/\.(tsx?|jsx?|mjs)$/, '').toLowerCase();
    const seen = new Map<string, string>();
    const clashes: string[] = [];
    for (const f of files) {
      const k = stem(f);
      const other = seen.get(k);
      if (other && other !== f) clashes.push(`${other} / ${f}`);
      else seen.set(k, f);
    }
    expect(clashes).toEqual([]);
  });

  // A symlink named data/raw was committed with Portugal batch 1 (#214); checking out main then swapped the owner's git-ignored raw
  // downloads (INAO, eAmbrosia, CAOP, IGN) for that link (22 Oct 2026). Nothing under data/raw may be tracked.
  it('never track data/raw', () => {
    const files = execSync('git ls-files data/raw', { encoding: 'utf8' }).split('\n').filter(Boolean);
    expect(files).toEqual([]);
  });
});
