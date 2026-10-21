import type { Story } from './format';

// One file per story in content/stories/, found at build time like the guides are (src/home/guideCount.ts).
const files = import.meta.glob<Story>('../../content/stories/*.json', { eager: true, import: 'default' });

const stories: Record<string, Story> = {};
for (const [path, story] of Object.entries(files)) stories[path.replace(/^.*\/(.+)\.json$/, '$1')] = story;

export const storyIds = (): string[] => Object.keys(stories).sort();
export const storyCount = (): number => storyIds().length;
export const loadStory = (id: string): Story | undefined => stories[id];
