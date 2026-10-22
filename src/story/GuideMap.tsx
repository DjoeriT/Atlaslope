// The map column of a guide with a map tour (#127, #148; owner 21 Oct 2026, layout A, approved mock Review/mock-tour-in-guide/):
// the guide page stays as it is and gains a sticky map (desktop: right column; phone: a 240 px strip under the bar). The map follows the
// chapter in view and the guide's fly links fly it. No autoplay, no scroll-jacking. Lazy: this file and the tour engine load on opening.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Guide } from '../facts';
import { strings } from '../strings';
import type { Place } from '../tree';
import { DWELL_MS, holdSteps, pickStep, readingLine, spreadRows, stopOf, targetOf, type Cam } from './camera';
import type { LngLat, Story } from './format';
import { storyFiles } from './files';
import { anchorsOf, stepOfLink } from './steps';
import { MAP_IDLE_EVENT } from './unfold';
import { createStoryMap, STORY_EXAGGERATION, stopView, type StoryMap } from './storyMap';
import { creditParts, locator, locatorBox, type Credited } from './view';

/** Each step holds at least this much scroll, so a normal flick cannot skip one whose link sits close to the next (card 3, 21 Oct 2026). */
const HOLD_PX = 120;

const t = strings.story;

/** A fly link the reader followed: `n` changes on every click, so the same link twice flies twice. */
export interface FlyAsk { chapter: string; index: number; n: number }

interface Props {
  place: Place;
  guide: Guide;
  story: Story;
  fly?: FlyAsk;
  /** The chapter (1-based, 0 for the overview and the rest) the reader is in, for "Chapter n of 4" in the mode's band. */
  onChapter?(n: number): void;
}

export function GuideMap({ place, guide, story, fly, onChapter }: Props) {
  const wrap = useRef<HTMLElement>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const smap = useRef<StoryMap | null>(null);
  const [active, setActive] = useState(0);
  const [moved, setMoved] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);
  const [height, setHeight] = useState(STORY_EXAGGERATION);
  const locBox = useRef<SVGRectElement>(null);
  const locDot = useRef<SVGCircleElement>(null);
  const [credit, setCredit] = useState<{ shown: Credited[]; imagery: boolean }>({ shown: [], imagery: true });
  const [named, setNamed] = useState<Record<string, LngLat>>({});
  const shownStep = useRef(0);
  const lastGo = useRef(0);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  // Named points (towns, ranges) for the markers a step names, from the story's names file.
  useEffect(() => {
    const url = storyFiles(story.id).names;
    if (!url) return;
    let live = true;
    fetch(url).then((r) => r.json()).then((fc: { features: Array<{ properties: { name: string }; geometry: { coordinates: LngLat } }> }) => {
      if (live) setNamed(Object.fromEntries(fc.features.map((f) => [f.properties.name, f.geometry.coordinates])));
    }).catch(() => {});
    return () => { live = false; };
  }, [story.id]);

  // One view per step, then `rest` for How it tastes, In short, Producers and the end: the whole place in one still, tilted view (v4 mock).
  const views = useMemo(() => [
    ...story.steps.map((s) => {
      const stop = stopOf(guide, s);
      return stopView(s, targetOf(s, stop)!, stop?.point, (n) => named[n]);
    }),
    stopView({ ...story.steps[0], markers: [], facts: [], dot: false }, { kind: 'bounds', place: place.id, pitch: 50, bearing: 0, zoomShift: 0 }, undefined, () => undefined),
  ], [story, guide, named, place.id]);
  const rest = story.steps.length;

  // The step on show for the reader's place in the guide: the step whose anchor (its fly link, or its chapter for an overview) is nearest
  // above the reading line (under the bar on a laptop, under the map on a phone); past the end of the beats, `rest`.
  const pickIndex = useCallback((): number => {
    const page = wrap.current?.closest<HTMLElement>('.pg');
    if (!page) return 0;
    const narrow = matchMedia('(max-width: 47.5em)');
    const bar = page.querySelector('.pg-top')?.getBoundingClientRect().bottom ?? 0;
    const areaTop = narrow.matches ? wrap.current?.getBoundingClientRect().bottom ?? bar : bar;
    const line = readingLine(areaTop, innerHeight, narrow.matches);
    const restTop = page.querySelector('#taste, #short, #producers')?.getBoundingClientRect().top;
    if (restTop !== undefined && restTop <= line) return rest;
    // The map mode has no page hero, so the cover step (the whole place from afar) has no text: the column opens on beat 1 and its first stop.
    const tops = holdSteps(spreadRows(anchorsOf(guide, story).slice(1).map((a) => page.querySelector(a)?.getBoundingClientRect().top ?? Infinity)), HOLD_PX);
    return 1 + pickStep(tops, line);
  }, [story, guide, rest]);

  // The map: made once, then each step's view is shown on it (jump on first load, flights after).
  useEffect(() => {
    // Opening jumps to the stop of the paragraph being read, then flies from the next stop.
    const at = pickIndex();
    const first = views[at].target;
    const start: Cam = first.kind === 'view' ? first : { center: [-3.7, 40.4], zoom: 5, pitch: 0, bearing: 0 };
    const m = createStoryMap(mapEl.current as HTMLDivElement, story, start, {
      onUserMove: () => setMoved(true),
      onMove: (map) => {
        const c = map.getCenter(), b = map.getBounds();
        const [x, y] = locator.at([c.lng, c.lat]);
        locDot.current?.setAttribute('cx', x.toFixed(1)); locDot.current?.setAttribute('cy', y.toFixed(1));
        const box = locatorBox(b.getWest(), b.getSouth(), b.getEast(), b.getNorth());
        const r = locBox.current;
        if (r) { r.setAttribute('x', box.x.toFixed(1)); r.setAttribute('y', box.y.toFixed(1)); r.setAttribute('width', box.w.toFixed(1)); r.setAttribute('height', box.h.toFixed(1)); }
      },
      onLayers: (shown, imagery) => setCredit({ shown, imagery }),
    });
    smap.current = m;
    m.show(views[at], true);
    shownStep.current = at;
    setActive(at);
    m.map.once('idle', () => window.dispatchEvent(new Event(MAP_IDLE_EVENT)));
    // The column appears beside text that reflows; MapLibre needs its new size.
    // On a phone and a tablet the credit line is folded behind the map's own "i" button.
    const iBtn = mapEl.current?.querySelector('.maplibregl-ctrl-attrib-button');
    const toggleCredit = () => setCreditOpen((o) => !o);
    iBtn?.addEventListener('click', toggleCredit);
    const ro = new ResizeObserver(() => m.map.resize());
    ro.observe(mapEl.current as HTMLDivElement);
    return () => { iBtn?.removeEventListener('click', toggleCredit); ro.disconnect(); m.remove(); smap.current = null; };
  }, [story]); // eslint-disable-line react-hooks/exhaustive-deps

  // The names file arrives after the map is made: the stop on show gets its town and range markers then (the stop is not redrawn otherwise).
  useEffect(() => {
    if (Object.keys(named).length) smap.current?.show(views[shownStep.current], true);
  }, [named]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scrolling: the step whose anchor (its fly link, or its chapter for an overview) is nearest above the reading line (under the bar on a laptop, under the map strip on a phone) is on show.
  useEffect(() => {
    const page = wrap.current?.closest<HTMLElement>('.pg');
    if (!page) return;
    let last = -1;
    const pick = () => { const i = pickIndex(); if (i !== last) { last = i; setActive(i); } };
    let raf = 0;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pick(); }); };
    page.addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    // Lazy photos load as they near the screen and shift the links by a few pixels without a scroll: look again whenever the guide's height changes.
    const grow = new ResizeObserver(onScroll);
    const listing = page.querySelector('.pg-listing');
    if (listing) grow.observe(listing);
    pick();
    return () => { grow.disconnect(); page.removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [pickIndex]);

  // Map moves wait for the last one to land (DWELL_MS), so a fast scroll does not queue flights.
  useEffect(() => {
    clearTimeout(timer.current);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const run = () => {
      if (shownStep.current === active) return;
      shownStep.current = active;
      lastGo.current = performance.now();
      setMoved(false);
      smap.current?.show(views[active], false);
    };
    const wait = reduce ? 0 : Math.max(0, lastGo.current + DWELL_MS - performance.now());
    if (wait) timer.current = window.setTimeout(run, wait); else run();
  }, [active, views]);

  // A fly link in the guide flies the map to its own step at once.
  useEffect(() => {
    const i = fly ? stepOfLink(guide, story, fly.chapter, fly.index) : -1;
    if (i < 0) return;
    clearTimeout(timer.current);
    shownStep.current = i;
    lastGo.current = performance.now();
    setActive(i);
    setMoved(false);
    smap.current?.show(views[i], false);
  }, [fly]); // eslint-disable-line react-hooks/exhaustive-deps

  const chapterNo = active >= rest ? 0 : guide.chapters.findIndex((c) => c.id === story.steps[active].chapter) + 1;
  useEffect(() => { onChapter?.(chapterNo); }, [chapterNo]); // eslint-disable-line react-hooks/exhaustive-deps
  const setHeightK = (k: number) => { setHeight(k); smap.current?.setHeight(k); };
  const recentre = () => { setMoved(false); smap.current?.show(views[shownStep.current], false); };
  const step = story.steps[Math.min(active, rest - 1)];
  const isRest = active === rest;
  const label = isRest ? place.name : step.chip ?? stopOf(guide, step)?.label ?? place.name;
  const parts = creditParts(credit.shown, credit.imagery, height);

  const slopeOn = !!storyFiles(story.id).slope;

  return (
    <aside className="pg-tourmap" ref={wrap} aria-label={t.mapLabel} data-step={isRest ? 'rest' : step.id}>
      <div className="pg-tourmap-in">
        <div className="story-map" ref={mapEl} />
        <p className="story-chip">{label}</p>
        <div className="story-exag" role="group" aria-label={t.terrainHeight}>
          <span>{t.terrainHeight}</span>
          {[STORY_EXAGGERATION, 1.3].map((k) => <button key={k} type="button" aria-pressed={height === k} onClick={() => setHeightK(k)}>×{k.toFixed(1)}</button>)}
        </div>
        {moved && <button type="button" className="story-recentre" onClick={recentre}>{t.recentre}</button>}
        <svg className="story-loc" viewBox={`-3 -3 ${locator.width + 6} ${locator.height + 6}`} role="img" aria-label={t.locator}>
          <path d={locator.path} /><rect ref={locBox} className="lbox" width="4" height="4" /><circle ref={locDot} className="ldot" r="3" />
        </svg>
        <p className={creditOpen ? 'story-credit open' : 'story-credit'}>
          {slopeOn && <><i className="sw" aria-hidden="true" />{t.slopeKey} · </>}
          {parts.map((p, i) => <span key={i}>{i > 0 && ' · '}<span className="long">{p.long}</span><span className="short">{p.short}</span></span>)}
        </p>
      </div>
    </aside>
  );
}
