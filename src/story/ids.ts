// What the guide page needs before a tour opens: which guides have a story, and how many stops. Lazy, so the atlas bundle holds no tour
// content; a guide loads only its own story file (one chunk per file), which the page hands to the band and the map column.
import type { Story } from './format';

const loaders = import.meta.glob<Story>('../../content/stories/*.json', { import: 'default' });
const byId: Record<string, () => Promise<Story>> = {};
for (const [path, load] of Object.entries(loaders)) byId[path.replace(/^.*\/(.+)\.json$/, '$1')] = load;

export const hasStory = (id: string): boolean => id in byId;
/** How many guides have a map tour. */
export const storyCount = (): number => Object.keys(byId).length;
/** The one story file of a guide; no other guide's tour loads with it. */
export const storyOf = (id: string): Promise<Story> => byId[id]();
