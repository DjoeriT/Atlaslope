import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Story, StoryStep } from '../../src/story/format';
import { loadStory, storyCount, storyIds } from '../../src/story/load';

const json = <T>(p: string): T => JSON.parse(readFileSync(p, 'utf8'));
interface Fly { label: string; cite: string[] }
interface Chapter { id: string; cite: string[]; fly?: Fly[]; cards?: Array<{ fly: Fly }>; [k: string]: unknown }
interface Guide { chapters: Chapter[] }

const photos = json<{ photos: Record<string, unknown> }>('data/photos.json').photos;
const measures = json<{ places: Record<string, unknown> }>('data/place-measures.json').places;
const squareCrops = json<Record<string, unknown>>('src/home/photoCrops.json');
const pageCrops = json<Record<string, unknown>>('src/pages/pageCrops.json');
const places = new Set(json<{ places: Array<{ id: string }> }>('data/places.json').places.map((p) => p.id));
const LAYERS = ['koppen', 'geology', 'zonelabels'];
const KINDS = ['median', 'top', 'low', 'steep'];

// Verbs that link a tightened fact ("a valley at most 40 km wide" becomes "The valley is never more than 40 km wide").
const LINKING = ['is', 'are'];
const words =(s: string): string[] => s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
const strings = (o: unknown): string[] =>
  typeof o === 'string' ? [o]
    : Array.isArray(o) ? o.flatMap(strings)
      : o && typeof o === 'object' ? Object.entries(o).filter(([k]) => k !== 'cite' && k !== 'id').flatMap(([, v]) => strings(v))
        : [];

describe('story files', () => {
  it('lists every story', () => {
    expect(storyIds()).toEqual(['priorat', 'ribeira-sacra', 'ribera-del-duero', 'rioja', 'txakoli-alava', 'txakoli-bizkaia', 'txakoli-getaria']);
    expect(storyCount()).toBe(7);
  });

  for (const id of ['priorat', 'ribeira-sacra', 'ribera-del-duero', 'rioja', 'txakoli-alava', 'txakoli-bizkaia', 'txakoli-getaria']) {
    const story = loadStory(id) as Story;
    const guide = json<Guide>(`content/guides/${id}.json`);
    const names = new Set(json<{ features: Array<{ properties: { name: string } }> }>(`data/story/names-${id}.geojson`).features.map((f) => f.properties.name));
    const chapter = (s: StoryStep) => guide.chapters.find((c) => c.id === s.chapter);
    const stepsWithChapter = story.steps.filter((s) => s.chapter !== null);
    const shownPhotos = [story.cover.photo, ...story.steps.flatMap((s) => (s.photo ? [s.photo] : []))];

    describe(id, () => {
      it('has unique step ids and an opening view', () => {
        expect(new Set(story.steps.map((s) => s.id)).size).toBe(story.steps.length);
        expect(story.steps[0].chapter).toBeNull();
      });

      it('names a chapter, fly stop or card the guide has', () => {
        for (const s of stepsWithChapter) {
          const c = chapter(s);
          expect(c, `${s.id}: chapter ${s.chapter}`).toBeDefined();
          if (s.fly !== undefined) expect(c!.fly?.[s.fly], `${s.id}: fly ${s.fly}`).toBeDefined();
          if (s.card !== undefined) expect(c!.cards?.[s.card], `${s.id}: card ${s.card}`).toBeDefined();
          expect(s.fly !== undefined && s.card !== undefined, `${s.id}: both fly and card`).toBe(false);
        }
        for (const c of guide.chapters) expect(story.steps.some((s) => s.chapter === c.id), `chapter ${c.id} has no step`).toBe(true);
      });

      it('uses known layers and outlines', () => {
        for (const s of story.steps) {
          for (const l of s.layers ?? []) expect(LAYERS).toContain(l);
          expect(s.focus === 'zones' || places.has(s.focus), `${s.id}: focus ${s.focus}`).toBe(true);
          if (s.camera.place) expect(places.has(s.camera.place), `${s.id}: camera place`).toBe(true);
          expect(s.facts?.length ?? 0).toBeLessThanOrEqual(3);
        }
      });

      it('takes every cite from the cite lists of its own chapter or stop', () => {
        for (const s of stepsWithChapter) {
          const c = chapter(s)!;
          const own = s.fly !== undefined ? c.fly![s.fly] : s.card !== undefined ? c.cards![s.card].fly : undefined;
          const allowed = new Set([...c.cite, ...(own?.cite ?? [])]);
          for (const f of s.facts ?? []) {
            expect(f.cite.length, `${s.id}: fact without cite`).toBeGreaterThan(0);
            for (const q of f.cite) expect(allowed.has(q), `${s.id}: cite ${q} is not in the guide's lists`).toBe(true);
          }
        }
      });

      it('builds every fact from words of its own chapter', () => {
        for (const s of stepsWithChapter) {
          const have = new Set(words(strings(chapter(s)).join(' ')));
          for (const f of s.facts ?? []) {
            const missing = words(f.text).filter((w) => !have.has(w) && !LINKING.includes(w));
            expect(missing, `${s.id}: "${f.text}" uses words the chapter does not`).toEqual([]);
          }
        }
      });

      it('has every photo in data/photos.json', () => {
        for (const p of shownPhotos) expect(photos[p], `photo ${p}`).toBeDefined();
      });

      it('has a checked crop for every photo (square-card crops or the page crops)', () => {
        const missing = shownPhotos.filter((p) => !(p in squareCrops) && !(p in pageCrops));
        expect(missing, 'run Tools/guides/crop_sheet.mjs and add the crop').toEqual([]);
      });

      it('measures only places data/place-measures.json has', () => {
        for (const s of story.steps.filter((x) => x.measure)) {
          expect(measures[s.measure!.place], `${s.id}: measure place`).toBeDefined();
          expect(KINDS).toContain(s.measure!.kind);
        }
      });

      it('names only markers data/story/names-<id>.geojson has', () => {
        const ats = story.steps.flatMap((s) => [...(s.facts ?? []), ...(s.markers ?? [])].map((m) => m.at));
        for (const at of ats) {
          if (typeof at === 'string') expect(names.has(at), `name ${at}`).toBe(true);
          else expect(at).toHaveLength(2);
        }
      });
    });
  }
});
