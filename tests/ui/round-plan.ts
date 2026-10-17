// The Study round the app builds, computed with the engine itself, so a UI test knows which place each screen asks (rounds are shuffled).
import { readFileSync } from 'node:fs';
import { roundSeed, studyRound, type LogEntry } from '../../src/quiz';
import { loadTree } from '../../src/tree';

const tree = loadTree(JSON.parse(readFileSync('data/places.json', 'utf8')));

/** The first Study round at `now` (the ?now= time) for this log, each item with its place's name. */
export function plannedRound(now: string, log: LogEntry[] = []) {
  const at = new Date(now);
  return studyRound(tree, log, at, { seed: roundSeed(at, log.length) }).items.map((i) => ({ ...i, name: tree.getPlace(i.place)!.name }));
}
