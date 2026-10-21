// "Read with the map" (#127, #148): the guide's text on the left, the app's map on the right following it as the reader scrolls
// (phone: map on top). No autoplay, no scroll-jacking. Approved mock: Review/mock-story-guide-v3/ (README "Changed from v2").
import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { BrandMark } from '../app/TopBar';
import type { Go } from '../cards/Link';
import { creditName } from '../cards/Credit';
import { SourceLine } from '../cards/PlaceFacts';
import { guideOf, measuresOf, type Cite, type Guide } from '../facts';
import photosFile from '../../data/photos.json';
import storyFocus from '../../data/story/photo-focus.json';
import squareCrops from '../home/photoCrops.json';
import { ROOT } from '../site';
import { strings } from '../strings';
import type { Place, Tree } from '../tree';
import { selectionToHash } from '../url';
import { DWELL_MS, pickStep, readingLine, stopOf, targetOf, type Cam } from './camera';
import type { LngLat, Story, StoryStep } from './format';
import { storyFiles } from './files';
import { loadStory } from './load';
import { createStoryMap, STORY_EXAGGERATION, stopView, type StoryMap } from './storyMap';
import { creditParts, locator, locatorBox, measureText, type Credited, type Measured } from './view';
import './story.css';

const t = strings.story;
const photos = (photosFile as unknown as { photos: Record<string, { alt: string; artist: string; licence: string; licenceUrl?: string | null; page: string }> }).photos;
const focusOf = (key: string) => (storyFocus as Record<string, string>)[key] ?? (squareCrops as Record<string, { focus: string }>)[key]?.focus ?? '50% 50%';

function Photo({ id, cls }: { id: string; cls: string }) {
  const p = photos[id];
  if (!p) return null;
  return (
    <figure className={cls}>
      <img src={`${ROOT}photos/800/${id}.webp`} srcSet={`${ROOT}photos/480/${id}.webp 480w, ${ROOT}photos/800/${id}.webp 800w`}
        sizes="(max-width: 61rem) 100vw, 34rem" alt={p.alt} style={{ objectPosition: focusOf(id) }} loading="lazy" decoding="async" />
    </figure>
  );
}

const Src = ({ cites }: { cites: Cite[] }) => <p className="story-src"><SourceLine cites={cites} /></p>;

/** One "Photos: Name · licence; Name · licence · cropped and resized" line for every photo the story shows, one entry per author and licence. */
function PhotoCredit({ ids }: { ids: string[] }) {
  const seen = new Set<string>();
  const shown = ids.map((id) => photos[id]).filter((p) => p && !seen.has(`${p.artist}|${p.licence}`) && seen.add(`${p.artist}|${p.licence}`));
  const link = { target: '_blank', rel: 'noopener noreferrer' } as const;
  return (
    <p className="story-photocredit">{t.photos}{' '}
      {shown.map((p, i) => (
        <span key={i}>{i > 0 && '; '}<a href={p.page} {...link}>{creditName(p.artist)}</a>{' · '}
          {p.licenceUrl ? <a href={p.licenceUrl} {...link}>{p.licence}</a> : p.licence}</span>
      ))}
      {' · '}{t.resized}
    </p>
  );
}

/** The text beside one step: the cover, a chapter's opening, a guide stop or a zone card. */
function stepText(tree: Tree, guide: Guide, story: Story, step: StoryStep, i: number, scrollTo: (id: string) => void): ReactNode {
  const prev = story.steps[i - 1];
  const chIndex = guide.chapters.findIndex((c) => c.id === step.chapter);
  const ch = guide.chapters[chIndex];
  const stop = stopOf(guide, step);
  const measure = step.measure && measuresOf(step.measure.place) && (
    <p className="story-measure">
      {measureText(measuresOf(step.measure.place) as Measured, step.measure.kind, step.measure.place !== step.focus ? tree.getPlace(step.measure.place)?.name : undefined)}
      <small>{t.measured}</small>
    </p>
  );
  if (!ch) {
    return (
      <>
        <Photo id={story.cover.photo} cls="story-cover" />
        <p className="story-kicker">{t.kicker(guide.minutes)}</p>
        <h1>{guide.title}</h1>
        <p className="story-lede">{guide.lede.text}</p>
        <Src cites={guide.lede.cite} />
        <nav className="story-toc" aria-label={t.chapters}>
          <ol>{guide.chapters.map((c) => <li key={c.id}><a href={`#story-${c.id}`} onClick={(e) => { e.preventDefault(); scrollTo(`story-${c.id}`); }}>{c.title}</a></li>)}</ol>
        </nav>
        <p className="story-hint">{t.hint}</p>
      </>
    );
  }
  // A chapter that opens on an overview and then flies to a stop keeps its last paragraph for that stop, so the text read beside the
  // flight is the one it proves (Rioja's barrel chapter: the overview, then Haro's station quarter; as in the mock).
  const handsOn = (s: StoryStep | undefined, next: StoryStep | undefined) =>
    !!s && s.fly === undefined && s.card === undefined && next?.chapter === s.chapter && next.fly !== undefined && ch.paras.length > 1;
  const first = prev?.chapter !== step.chapter;
  const kept = first && handsOn(step, story.steps[i + 1]);
  const handed = !first && handsOn(prev, step) && story.steps[i - 2]?.chapter !== step.chapter;
  const opening = first ? (
    <>
      <h2 id={`story-${ch.id}`} tabIndex={-1}><span className="n">{chIndex + 1}</span>{ch.title}</h2>
      {(kept ? ch.paras.slice(0, -1) : ch.paras).map((p, k) => <p key={k}>{p}</p>)}
      {!kept && <Src cites={ch.cite} />}
    </>
  ) : handed && (
    <>
      <p>{ch.paras[ch.paras.length - 1]}</p>
      <Src cites={ch.cite} />
    </>
  );
  const card = step.card !== undefined ? ch.cards?.[step.card] : undefined;
  if (card) {
    return (
      <>
        {opening}
        <article className="story-zone" aria-labelledby={`story-h-${step.id}`}>
          {step.photo && <Photo id={step.photo} cls="story-img" />}
          <h3 id={`story-h-${step.id}`}>{card.title}</h3>
          <p className="story-lab">{t.climate}</p><p>{card.climate}</p>
          <p className="story-lab">{t.wine}</p><p>{card.wine}</p>
          {measure}
          <Src cites={card.fly.cite} />
        </article>
      </>
    );
  }
  return (
    <>
      {opening}
      {stop && (
        <div className={first ? 'story-stop' : 'story-stop solo'}>
          {step.photo && <Photo id={step.photo} cls="story-img" />}
          <p className="story-stop-lab"><small>{t.onTheMap}</small>{stop.label}</p>
          <p className="story-cap">{stop.caption}</p>
          {measure}
          <Src cites={stop.cite} />
        </div>
      )}
    </>
  );
}

interface Props {
  tree: Tree;
  go: Go;
  place: Place;
  /** Starts a review round on these places ("Test me"). */
  onTest(set: string[]): void;
}

export function StoryView({ tree, go, place, onTest }: Props) {
  const story = loadStory(place.id) as Story;
  const guide = guideOf(place.id) as Guide;
  const scroller = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLElement>(null);
  const mapWrap = useRef<HTMLDivElement>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const sections = useRef<Array<HTMLElement | null>>([]);
  const progress = useRef<HTMLElement>(null);
  const locBox = useRef<SVGRectElement>(null);
  const locDot = useRef<SVGCircleElement>(null);
  const smap = useRef<StoryMap | null>(null);
  const [active, setActive] = useState(0);
  const [moved, setMoved] = useState(false);
  const [credit, setCredit] = useState<{ shown: Credited[]; imagery: boolean }>({ shown: [], imagery: true });
  const [named, setNamed] = useState<Record<string, LngLat>>({});

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

  // The guide page stays mounted under the story: keep keyboard and screen reader on the story, and hand focus back to the button on close.
  useEffect(() => {
    const root = scroller.current;
    const held = [...(root?.parentElement?.children ?? [])].filter((n): n is HTMLElement => n instanceof HTMLElement && n !== root && !n.hasAttribute('inert'));
    held.forEach((n) => n.setAttribute('inert', ''));
    root?.querySelector<HTMLElement>('.story-back')?.focus({ preventScroll: true });
    return () => {
      held.forEach((n) => n.removeAttribute('inert'));
      document.querySelector<HTMLElement>('a.story-open')?.focus({ preventScroll: true });
    };
  }, []);

  const views = useMemo(() => story.steps.map((s) => {
    const stop = stopOf(guide, s);
    const target = targetOf(s, stop)!;
    return stopView(s, target, stop?.point, (n) => named[n]);
  }), [story, guide, named]);

  // The map: made once, then each step's view is shown on it (jump on first load, flights after).
  useEffect(() => {
    const first = views[0].target;
    const start: Cam = first.kind === 'view' ? first : { center: [-3.7, 40.4], zoom: 5, pitch: 0, bearing: 0 };
    const m = createStoryMap(mapEl.current as HTMLDivElement, story, start, {
      onUserMove: () => setMoved(true),
      onMove: (map: MapLibreMap) => {
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
    m.show(views[0], true);
    const onResize = () => m.map.resize();
    addEventListener('resize', onResize);
    return () => { removeEventListener('resize', onResize); m.remove(); smap.current = null; };
  }, [story]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scrolling: the step whose top has passed the reading line is on show. Map moves wait for the last one to land (DWELL_MS).
  const shownStep = useRef(0);
  const lastGo = useRef(0);
  const timer = useRef(0);
  useEffect(() => {
    const narrow = matchMedia('(max-width: 61rem)');
    const pick = () => {
      const areaTop = (narrow.matches ? mapWrap.current : top.current)?.getBoundingClientRect().bottom ?? 0;
      const line = readingLine(areaTop, innerHeight, narrow.matches);
      const i = pickStep(sections.current.map((s) => s?.getBoundingClientRect().top ?? Infinity), line);
      setActive(i);
      const el = scroller.current;
      if (el && progress.current) {
        const max = el.scrollHeight - el.clientHeight;
        progress.current.style.setProperty('--p', (max > 0 ? el.scrollTop / max : 0).toFixed(4));
      }
    };
    // The observer wakes the pick when a step crosses the reading line; the scroll listener only moves the progress bar.
    let io: IntersectionObserver | null = null;
    const observe = () => {
      io?.disconnect();
      const areaTop = (narrow.matches ? mapWrap.current : top.current)?.getBoundingClientRect().bottom ?? 0;
      const line = Math.round(readingLine(areaTop, innerHeight, narrow.matches));
      io = new IntersectionObserver(pick, { root: scroller.current, rootMargin: `${-line}px 0px ${line + 1 - innerHeight}px 0px` });
      sections.current.forEach((s) => s && io?.observe(s));
    };
    let raf = 0;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pick(); }); };
    const el = scroller.current;
    el?.addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', observe);
    observe();
    pick();
    return () => { io?.disconnect(); el?.removeEventListener('scroll', onScroll); removeEventListener('resize', observe); cancelAnimationFrame(raf); };
  }, []);

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

  const recentre = () => { setMoved(false); smap.current?.show(views[shownStep.current], false); };
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ block: 'start' });
  const pageHash = selectionToHash({ kind: 'place', id: place.id, page: true });
  const back = (e: MouseEvent) => { e.preventDefault(); go({ kind: 'place', id: place.id, page: true }); };
  const step = story.steps[active];
  const chN = guide.chapters.findIndex((c) => c.id === step.chapter) + 1;
  const chip = step.chip ?? stopOf(guide, step)?.label ?? '';
  const parts = creditParts(credit.shown, credit.imagery, STORY_EXAGGERATION);
  const shownPhotos = [story.cover.photo, ...story.steps.flatMap((s) => (s.photo ? [s.photo] : []))];

  return (
    <div className="story" ref={scroller}>
      <header className="story-top" ref={top}>
        <span className="story-brand"><BrandMark />AtlaSlope</span>
        <p className="story-where">{chN > 0 ? t.chapterOf(chN, guide.chapters.length) : ''}</p>
        <a className="story-back" href={pageHash} onClick={back}>{t.back(place.name)}</a>
        <div className="story-progress" aria-hidden="true"><i ref={progress} /></div>
      </header>
      <div className="story-grid" role="region" aria-label={place.name}>
        <div className="story-mapwrap" ref={mapWrap} role="region" aria-label={t.mapLabel}>
          <div className="story-map" ref={mapEl} />
          {chip && <p className="story-chip">{chip}</p>}
          {moved && <button type="button" className="story-recentre" onClick={recentre}>{t.recentre}</button>}
          <svg className="story-loc" viewBox={`-3 -3 ${locator.width + 6} ${locator.height + 6}`} role="img" aria-label={t.locator}>
            <path d={locator.path} /><rect ref={locBox} className="lbox" width="4" height="4" /><circle ref={locDot} className="ldot" r="3" />
          </svg>
          <p className="story-credit">
            {parts.map((p, i) => <span key={i}>{i > 0 && ' · '}<span className="long">{p.long}</span><span className="short">{p.short}</span></span>)}
          </p>
        </div>
        <div className="story-text">
          {story.steps.map((s, i) => (
            <section key={s.id} ref={(el) => { sections.current[i] = el; }} className={i === 0 ? 'story-step intro' : 'story-step'}
              aria-current={i === active ? 'step' : undefined} data-step={s.id}>
              <div className="story-step-in">{stepText(tree, guide, story, s, i, scrollTo)}</div>
            </section>
          ))}
          <section className="story-step end">
            <div className="story-step-in">
              <p className="story-kicker">{story.end.kicker}</p>
              <p className="story-endq">{story.end.text}</p>
              {story.end.test && <button type="button" className="story-btn" onClick={() => onTest(story.end.test!.set)}>{story.end.test.label}</button>}
              <PhotoCredit ids={shownPhotos} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
