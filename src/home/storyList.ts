import { readdirSync, readFileSync } from 'node:fs';
import squareFile from '../../data/story/photo-focus-square.json';
import { sentences } from '../pages/sentence';
import { loadTree } from '../tree';
import { creditLine, photoCrops, photoImg, type PhotoCredit } from './guideCount';

// The "Read with the map" page and the home tile list the stories the way the Guides page lists guides: from the files in
// content/stories/ at build time, so a new story file adds a row and bumps the count with no page edit (build card 5, 21 Oct 2026).
export interface StoryRow { id: string; name: string; lede: string; minutes: number; photo: string; focus: string | null }
export interface StoryList { rows: StoryRow[]; photos: Record<string, PhotoCredit> }
export interface StorySources { dir: string; guidesDir: string; placesFile: string; photosFile: string }
export const STORY_SOURCES: StorySources = { dir: 'content/stories', guidesDir: 'content/guides', placesFile: 'data/places.json', photosFile: 'data/photos.json' };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = <T>(f: string) => JSON.parse(readFileSync(f, 'utf8')) as T;
/** Checked square focus for the listing's square frames (Tools/guides/crop_sheet.mjs sheet, Review/story-build/shots/crops-square.png). */
export const squareFocus = squareFile as Record<string, { focus: string; file: string }>;
const focusOf = (photo: string): string | null => (squareFocus[photo] ?? photoCrops[photo])?.focus ?? null;
const storyFiles = (dir: string) => readdirSync(dir).filter((f) => f.endsWith('.json')).sort();

export const storyCount = (dir = STORY_SOURCES.dir): number => storyFiles(dir).length;

export const fillStoryCount = (html: string, n: number): string => html.replace(/(data-count="stories">)\d+(<)/g, `$1${n}$2`);

export const storyRows = (src: Partial<StorySources> = {}): StoryList => {
  const { dir, guidesDir, placesFile, photosFile } = { ...STORY_SOURCES, ...src };
  const tree = loadTree(json(placesFile));
  const photos = json<{ photos: Record<string, PhotoCredit> }>(photosFile).photos;
  const rows = storyFiles(dir).map((f) => {
    const story = json<{ id: string; cover: { photo: string } }>(`${dir}/${f}`);
    const place = tree.getPlace(story.id);
    if (!place) throw new Error(`content/stories/${f}: no place in data/places.json for ${story.id}`);
    const guide = json<{ minutes: number; lede: { text: string } }>(`${guidesDir}/${story.id}.json`);
    return { id: story.id, name: place.name.split(' / ')[0], lede: sentences(guide.lede.text, 120), minutes: guide.minutes, photo: story.cover.photo, focus: focusOf(story.cover.photo) };
  });
  return { rows, photos };
};

const card = (g: StoryRow, photos: Record<string, PhotoCredit>): string =>
  `<a class="gcard-c" href="../atlas/#place=${esc(g.id)}&amp;page&amp;story"><span class="ct">${photoImg(g.photo, photos, '(max-width:700px) 90vw, 300px', false, true, g.focus)}</span>`
  + `<span class="cb"><b>${esc(g.name)}</b></span><em>${g.minutes}-minute read</em><span class="lede">${esc(g.lede)}</span></a>`;

export const fillStoryList = (html: string, list: StoryList): string => {
  const marked = /(<!-- story-list -->\n)[\s\S]*?(\n\s*<!-- \/story-list -->)/;
  if (!marked.test(html)) throw new Error('read-with-the-map/index.html: the <!-- story-list --> markers are missing, so the list would ship empty');
  const body = `<div class="rowg">${list.rows.map((r) => card(r, list.photos)).join('')}</div>${creditLine(list.rows.map((r) => r.photo), list.photos)}`;
  return html.replace(marked, (_m, open: string, close: string) => open + body + close);
};
