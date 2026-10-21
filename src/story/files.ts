// A story's own map files, found by name: data/story/<names|rivers|slope|koppen>-<story id>.<geojson|png>. A new story needs no code edit; a file that is
// missing just skips its layer.
const urls = import.meta.glob('../../data/story/*-*.{geojson,png}', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

export type StoryFiles = Partial<Record<'names' | 'rivers' | 'slope' | 'koppen', string>>;

export function storyFiles(id: string): StoryFiles {
  const find = (layer: string, ext: string) => urls[`../../data/story/${layer}-${id}.${ext}`];
  return { names: find('names', 'geojson'), rivers: find('rivers', 'geojson'), slope: find('slope', 'png'), koppen: find('koppen', 'geojson') };
}
