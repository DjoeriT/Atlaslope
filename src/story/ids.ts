// What the guide page needs before a tour opens: which guides have a story, and how many stops. Lazy, so the atlas bundle holds no tour
// content; the full file loads with the map column (GuideMap, src/story/load.ts), in the story chunk.
import type { Story } from './format';

const loaders = import.meta.glob<Story>('../../content/stories/*.json', { import: 'default' });
const byId: Record<string, () => Promise<Story>> = {};
for (const [path, load] of Object.entries(loaders)) byId[path.replace(/^.*\/(.+)\.json$/, '$1')] = load;

export const hasStory = (id: string): boolean => id in byId;
/** Number of stops after the opening step. */
export const storyStops = (id: string): Promise<number> => byId[id]().then((s) => s.steps.length - 1);
