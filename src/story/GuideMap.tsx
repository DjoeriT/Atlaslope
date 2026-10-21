// The map column of a guide with a map tour (#127, #148; owner 21 Oct 2026, layout A, approved mock Review/mock-tour-in-guide/):
// the guide page stays as it is and gains a sticky map (desktop: right column; phone: a 240 px strip under the bar). The map follows the
// chapter in view and the guide's fly links fly it. No autoplay, no scroll-jacking. Lazy: this file and the tour engine load on opening.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Guide } from '../facts';
import { strings } from '../strings';
import type { Place } from '../tree';
import { DWELL_MS, holdSteps, pickStep, readingLine, spreadRows, stopOf, targetOf, type Cam } from './camera';
import type { LngLat, Story } from './format';
import { storyFiles } from './files';
import { anchorOf, stepOfLink } from './steps';
import { createStoryMap, STORY_EXAGGERATION, stopView, type StoryMap } from './storyMap';
import { creditParts, type Credited } from './view';

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
  onHide(): void;
}

export function GuideMap({ place, guide, story, fly, onHide }: Props) {
  const wrap = useRef<HTMLElement>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const smap = useRef<StoryMap | null>(null);
  const [active, setActive] = useState(0);
  const [moved, setMoved] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);
  const [credit, setCredit] = useState<{ shown: Credited[]; imagery: boolean }>({ shown: [], imagery: true });
  const [named, setNamed] = useState<Record<string, LngLat>>({});
  const shownStep = useRef(0);
  const lastGo = useRef(0);
  const timer = useRef(0);
  const hideBtn = useRef<HTMLButtonElement>(null);
  // Focus lands on Hide map when the map opens, so keyboard and screen-reader users arrive in the map column.
  useEffect(() => { hideBtn.current?.focus({ preventScroll: true }); return () => clearTimeout(timer.current); }, []);

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

  const views = useMemo(() => story.steps.map((s) => {
    const stop = stopOf(guide, s);
    return stopView(s, targetOf(s, stop)!, stop?.point, (n) => named[n]);
  }), [story, guide, named]);

  // The map: made once, then each step's view is shown on it (jump on first load, flights after).
  useEffect(() => {
    const first = views[0].target;
    const start: Cam = first.kind === 'view' ? first : { center: [-3.7, 40.4], zoom: 5, pitch: 0, bearing: 0 };
    const m = createStoryMap(mapEl.current as HTMLDivElement, story, start, {
      onUserMove: () => setMoved(true),
      onMove: () => {},
      onLayers: (shown, imagery) => setCredit({ shown, imagery }),
    });
    smap.current = m;
    m.show(views[0], true);
    // The column appears beside text that reflows; MapLibre needs its new size.
    // On a phone and a tablet the credit line is folded behind the map's own "i" button.
    const iBtn = mapEl.current?.querySelector('.maplibregl-ctrl-attrib-button');
    const toggleCredit = () => setCreditOpen((o) => !o);
    iBtn?.addEventListener('click', toggleCredit);
    const ro = new ResizeObserver(() => m.map.resize());
    ro.observe(mapEl.current as HTMLDivElement);
    return () => { iBtn?.removeEventListener('click', toggleCredit); ro.disconnect(); m.remove(); smap.current = null; };
  }, [story]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scrolling: the step whose anchor (its fly link, or its chapter for an overview) is nearest above the reading line (under the bar on a laptop, under the map strip on a phone) is on show.
  useEffect(() => {
    const page = wrap.current?.closest<HTMLElement>('.pg');
    if (!page) return;
    const narrow = matchMedia('(max-width: 47.5em)');
    const anchors = story.steps.map((st) => anchorOf(guide, st));
    let last = -1;
    const pick = () => {
      const bar = page.querySelector('.pg-top')?.getBoundingClientRect().bottom ?? 0;
      const areaTop = narrow.matches ? wrap.current?.getBoundingClientRect().bottom ?? bar : bar;
      const tops = holdSteps(spreadRows(anchors.map((a) => page.querySelector(a)?.getBoundingClientRect().top ?? Infinity)), HOLD_PX);
      const i = pickStep(tops, readingLine(areaTop, innerHeight, narrow.matches));
      if (i !== last) { last = i; setActive(i); }
    };
    let raf = 0;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pick(); }); };
    page.addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    pick();
    return () => { page.removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [story, guide]);

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

  const recentre = () => { setMoved(false); smap.current?.show(views[shownStep.current], false); };
  const step = story.steps[active];
  const label = step.chip ?? stopOf(guide, step)?.label ?? place.name;
  const parts = creditParts(credit.shown, credit.imagery, STORY_EXAGGERATION);

  return (
    <aside className="pg-tourmap" ref={wrap} aria-label={t.mapLabel} data-step={step.id}>
      <div className="pg-tourmap-in">
        <p className="pg-tourcap">
          <span className="k">{active > 0 ? t.stopOf(active, story.steps.length - 1) : t.open}</span>
          <b>{label}</b>
          <button type="button" ref={hideBtn} onClick={onHide}>{t.hide}</button>
        </p>
        <div className="story-map" ref={mapEl} />
        {moved && <button type="button" className="story-recentre" onClick={recentre}>{t.recentre}</button>}
        <p className={creditOpen ? 'story-credit open' : 'story-credit'}>
          {parts.map((p, i) => <span key={i}>{i > 0 && ' · '}<span className="long">{p.long}</span><span className="short">{p.short}</span></span>)}
        </p>
      </div>
    </aside>
  );
}
