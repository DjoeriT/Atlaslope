import { PageTop } from './PageTop';
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { scrollToSection, useJumpMarker, useSectionInView } from '../app/motion';
import { BrandMark } from '../app/TopBar';
import { cardShownBefore, noteCardKey } from '../cards/CardShell';
import { Link, type Go } from '../cards/Link';
import { selectionOf } from '../cards/nav';
import { OtherGrapes, SourceLine, SourceList } from '../cards/PlaceFacts';
import { SearchBox } from '../cards/SearchBox';
import { altitudeText, BEATS, EXTRAS, grapeLabel, guideOf, measuresOf, photoByKey, photosOf, regionMeasuresOf, sheetOf, spainMeasures, tasteLines, wsetLevelsOf, type Beat, type Chapter, type Cite, type ShownPhoto } from '../facts';
import { regionColor } from '../map/regionColors';
import { strings } from '../strings';
import type { Place, Tree } from '../tree';
import { quizToHash, selectionToHash, type Selection } from '../url';
import { AltitudeRange, ClimateBar } from './Charts';
import cardCrops from './cardCrops.json';
import { alikePlaces, mosaicPics, nextRegion, swatchOf } from './helpers';
import { sentences } from './sentence';
import { Mosaic } from './Mosaic';
import '../styles/pages.css';
import '../story/story.css';
import '../styles/guide-c3.css';
import { Img } from '../cards/Img';
import { Credit, oneEach } from '../cards/Credit';
import type { FlyAsk } from '../story/GuideMap';
import { hasStory, storyOf } from '../story/ids';
import type { Story } from '../story/format';
import { flyKey } from '../story/steps';
import type { Measures } from '../facts';
import type { MeasureKind, StoryStep } from '../story/format';
import { crossFade, dropGrow } from '../story/unfold';
import { MapCard } from './MapCard';
import { PHOTO_MAX_REM, Pic, sizesFor } from './Pic';

// The map tour's column and engine load only when it opens (dist/story/, Tools/check.sh).
const GuideMap = lazy(() => import('../story/GuideMap').then((m) => ({ default: m.GuideMap })));

const t = strings.place.page;
const tf = strings.facts;
const ts = strings.story;
const tc = strings.cards;

interface Props {
  tree: Tree;
  go: Go;
  place: Place;
  /** The guide chapter to scroll to on opening ("Back to the guide"). */
  at?: string;
  /** The map tour is open (#place=rioja&page&story): the same page in two columns, guide and map (layout A, owner 21 Oct 2026). */
  tour?: boolean;
  /** Starts a review round of 10 on these places ("Test me"). */
  onTest(set: string[]): void;
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} tabIndex={-1}>{title}</h2>
      {children}
    </section>
  );
}

/** The full page of a place (#place=<id>&page), guide shape C (owner, 19 Oct 2026): photos, a jump bar, then "Why X tastes the way it does"
 *  told in four beats (the place, the weather, the ground, what the rules make), each holding its own facts once, How it tastes as the
 *  answer, an In short box of five facts, plain browse sections, a small Test me door into Study, and the Sources. A place without a
 *  written Terroir section gets the same beats from its fact sheet. */
export function PlacePage({ tree, go, place, at, tour = false, onTest }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const jumpBar = useRef<HTMLElement>(null);
  useEffect(() => {
    if (cardShownBefore()) heading.current?.focus({ preventScroll: true });
    noteCardKey('page');
  }, [place.id]);

  useEffect(() => {
    if (!at) return;
    // The chapter's heading, not its body: a beat's first chapter is titled in the beat's head, above the body.
    const h = document.getElementById(`terroir-${at}-h`);
    (h ?? document.getElementById(`terroir-${at}`))?.scrollIntoView({ block: 'start' });
    h?.focus({ preventScroll: true });
  }, [place.id, at]);

  const trail = tree.breadcrumb(place.id, 'place');
  const region = tree.getRegion(place.region);
  // A study region that holds only this place (Rioja) opens this same guide, so it is named without a link to itself.
  const ownRegion = !!region && tree.soleSameName(region.id)?.id === place.id;
  const also = tree.alsoWithin(place.id);
  const zones = tree.children(place.id, 'place') as Place[];
  const isZone = tree.levelName(place) === 'zone';
  const quizzed = place.quiz !== 'none';
  // A place outside Study can still have a sheet; measures and photos stay with Study places.
  const sheet = sheetOf(place.id);
  const measures = quizzed ? measuresOf(place.id) : undefined;
  const color = regionColor(place.region);
  const official = place.official && place.official !== place.name ? place.official : undefined;
  const level = isZone ? tc.zoneLevel : place.kind;

  const photos = mosaicPics(quizzed ? photosOf(place.id) : [], zones.flatMap((z) => photosOf(z.id).slice(0, 1)));
  const main = sheet?.grapes.main ?? [];
  const others = sheet?.grapes.others ?? [];
  const kinds = (sheet?.styles.kinds ?? []).map((k) => tf.styleKinds[k]);
  const wineTypes = sheet?.styles.text.trim() || kinds.join(', ');
  const tastes = sheet?.tastes?.text.trim();
  const famous = sheet?.famous?.styles ?? [];
  const climate = sheet?.climate.text.trim();
  const soil = sheet?.soil.text.trim();
  const writtenAltitude = sheet?.altitude?.text.trim();
  const koppen = measures?.koppen ?? [];
  const producers = sheet?.producers?.items ?? [];
  const next = nextRegion(tree, place.region);
  const guide = guideOf(place.id);
  // "Map tour" shows only where a story file exists; the stop count loads lazily so the atlas bundle holds no tour content.
  const [story, setStory] = useState<Story>();
  useEffect(() => { if (hasStory(place.id)) storyOf(place.id).then(setStory); }, [place.id]);
  // With the map open, a fly link flies the tour's map instead of leaving for the atlas.
  const [flyAsk, setFlyAsk] = useState<FlyAsk>();
  // Focus follows the map: to "Close the map" in the band on open, back to the "Read with the map" card on hide. A pending fly is dropped on hide.
  const hadTour = useRef(tour);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (tour) closeBtn.current?.focus({ preventScroll: true });
    else if (hadTour.current) document.querySelector<HTMLElement>('.mapcard')?.focus({ preventScroll: true });
    hadTour.current = tour;
  }, [tour]);
  // Opening or closing the map keeps the reader on the same paragraph at the same height under the bar (or under the pinned map on a phone):
  // the paragraph (data-b) at the top of the reading area is noted as the page scrolls, and put back after the layout changes.
  const kept = useRef<{ key: string; off: number }>();
  const areaTop = (page: HTMLElement) => {
    const edge = page.querySelector('.pg-top')?.getBoundingClientRect().bottom ?? 0;
    return matchMedia('(max-width: 47.5em)').matches ? page.querySelector('.pg-tourmap')?.getBoundingClientRect().bottom ?? edge : edge;
  };
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const note = () => {
      const top = areaTop(page);
      const el = Array.from(page.querySelectorAll<HTMLElement>('[data-b]')).find((b) => b.getBoundingClientRect().bottom > top + 4);
      kept.current = el && el.getBoundingClientRect().top < innerHeight ? { key: el.dataset.b!, off: el.getBoundingClientRect().top - top } : undefined;
    };
    note();
    let raf = 0;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; note(); }); };
    page.addEventListener('scroll', onScroll, { passive: true });
    return () => { page.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [place.id, tour]);
  const firstRun = useRef(true);
  useLayoutEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    const page = pageRef.current;
    const k = kept.current;
    const el = k && page?.querySelector<HTMLElement>(`[data-b="${k.key}"]`);
    if (page && k && el) page.scrollTop += el.getBoundingClientRect().top - (areaTop(page) + k.off);
    // Folding back fades the page in (450 ms); opening with reduced motion is a plain cross-fade. The growing photo covers the normal opening.
    if (page && !(tour && document.querySelector('.grow'))) crossFade(page, tour ? 250 : 450);
  }, [tour]);
  const [chapterNo, setChapterNo] = useState(0);
  const hideMap = () => { dropGrow(); setFlyAsk(undefined); go({ kind: 'place', id: place.id, page: true }); };
  const testSet = [place.id, ...zones.filter((z) => z.quiz !== 'none').map((z) => z.id)];
  const testMe = quizzed && (
    <div className="pg-testme">
      <div>
        <b>{t.testTitle(place.name)}</b>
        <span>{t.testText(place.name, testSet.length > 1)}</span>
      </div>
      <a className="btn" href={quizToHash({ sub: 'test', set: testSet })} onClick={(e) => { e.preventDefault(); onTest(testSet); }}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5" /><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.6" /><circle cx="12" cy="16.6" r=".6" fill="currentColor" /></svg>
        {t.testButton}
      </a>
    </div>
  );
  const pill = (chapter: string, index: number, label: string) => {
    const to: Selection = { kind: 'place', id: place.id, fly: { chapter, index } };
    const body = (
      <>
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>
        <span><small>{t.onTheMap}</small>{label}</span>
      </>
    );
    return tour ? (
      <a key={`${chapter}.${index}`} className="fly" data-fly={flyKey(chapter, index)} href={selectionToHash(to)} aria-label={t.flyLabel(label)} title={t.flyLabel(label)}
        onClick={(e) => { if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); setFlyAsk({ chapter, index, n: (flyAsk?.n ?? 0) + 1 }); }}>{body}</a>
    ) : <Link key={`${chapter}.${index}`} className="fly" to={to} go={go} label={t.flyLabel(label)}>{body}</Link>;
  };


  // Every fact carries a short source tag; the tags are gathered as the page draws, in reading order, and the Sources section at the
  // end lists each document once (owner card, 18 Oct 2026). The Sources section is drawn last, so it sees every tag above it.
  const cited: Cite[] = [];
  // The photos drawn below the hero's own set (stops, zone and alike thumbnails): one credit line at the end names them.
  const pics: ShownPhoto[] = [];
  const src = (cites: Cite[]) => {
    cited.push(...cites);
    return <SourceLine cites={cites} short />;
  };

  const parent = isZone && place.parent ? tree.getPlace(place.parent) : undefined;
  const wsetLevels = wsetLevelsOf(place.id);
  const meta = [zones.length > 0 ? t.subZones(zones.length) : '', guide ? t.readMinutes(guide.minutes) : ''].filter(Boolean).join(' · ');
  // The comparison rows for the measured charts (owner point 10, 18 Oct 2026): a zone's appellation, the study region when it is more than
  // this one place, then Spain.
  const regionM = region && !isZone ? regionMeasuresOf(region.id) : undefined;
  const parentM = parent ? measuresOf(parent.id) : undefined;
  const compare = [
    ...(parent && parentM ? [{ label: parent.name, m: parentM }] : []),
    ...(regionM && measures && JSON.stringify(regionM) !== JSON.stringify(measures) ? [{ label: t.regionRow(region!.name), m: regionM }] : []),
    { label: t.allSpain, m: spainMeasures() },
  ];

  // Each written chapter sits in the beat it tells; a chapter without a beat follows the four beats as a section of its own.
  const chaptersOf = (b: Beat): Chapter[] => guide?.chapters.filter((c) => c.beat === b) ?? [];
  const loose = guide?.chapters.filter((c) => !c.beat || !BEATS.includes(c.beat)) ?? [];
  // A guide's zone notes name the zones, so they link to the zone pages and the plain zone list is not drawn twice.
  const zoneByName = new Map(zones.map((z) => [z.name, z]));
  const zoneNotes = guide?.chapters.some((c) => c.cards?.length) ?? false;
  // The fact sheet's own line for a beat shows only when no written chapter tells that beat (one fact, once).
  const told = (b: Beat) => chaptersOf(b).length > 0;

  // The map tour's stops with a photo sit in the beat that tells them: the photo, the stop's caption and its measured line (the mock's stop figures).
  const measureLine = (step: StoryStep): string | undefined => {
    const m = step.measure && (measuresOf(step.measure.place) as (Measures & { slope?: { steepShare: number } }) | undefined);
    if (!m || !step.measure) return undefined;
    const kind: MeasureKind = step.measure.kind;
    const a = m.altitude;
    const text = kind === 'median' ? ts.measures.median(a.median) : kind === 'top' ? ts.measures.top(a.median, a.p90) : kind === 'low' ? ts.measures.low(a.p10) : ts.measures.steep(Math.round((m.slope?.steepShare ?? 0) * 100));
    const name = step.measure.place !== place.id ? tree.getPlace(step.measure.place)?.name : undefined;
    return name ? ts.measureIn(name, text) : text;
  };
  const stopsOf = (ch: Chapter) => (story?.steps ?? []).flatMap((step) => {
    if (step.chapter !== ch.id || !step.photo) return [];
    // A stop with no fly link (Priorat's weather and rules, owner's photo picks 22 Oct 2026) shows its photo without a caption: no new text.
    const fly = step.fly !== undefined ? ch.fly?.[step.fly] : undefined;
    const photo = photoByKey(step.photo);
    return photo ? [{ step, fly, photo, id: ch.id }] : [];
  });
  const stopFigures = (stops: ReturnType<typeof stopsOf>) => stops.map(({ step, fly, photo, id }) => {
    pics.push(photo);
    const line = measureLine(step);
    return (
      <figure key={`${id}.${step.fly ?? step.photo}`} className="pg-fig">
        <Pic photo={photo} slot={stops.length > 1 ? 16 : PHOTO_MAX_REM} alt={photo.alt} />
        {fly && <figcaption>
          {tour && <span className="cap-k">{t.onTheMap}</span>}
          <span className="cap-t">{fly.label}</span>
          <span className="cap-p">{fly.caption}</span>
          {line && <span className="cap-m">{line}<small>{ts.measuredBy}</small></span>}
          {src(fly.cite)}
        </figcaption>}
      </figure>
    );
  });

  const zoneCards = (ch: Chapter) => {
    const own = ch.fly ?? [];
    return ch.cards && (
      <div className="pg-zguide" key={`${ch.id}-cards`}>
        {ch.cards.map((c, i) => {
          const zone = zoneByName.get(c.title);
          const photo = zone ? photosOf(zone.id)[0] : undefined;
          if (photo) pics.push(photo);
          return (
            <div key={c.title}>
              {photo && <Pic photo={photo} slot={24} alt="" />}
              <b>{zone ? <Link to={{ kind: 'place', id: zone.id, page: true }} go={go}>{c.title}</Link> : c.title}</b>
              <dl>
                <dt>{t.beats.weather}</dt><dd>{c.climate}</dd>
                <dt>{t.short.wine}</dt><dd>{c.wine}</dd>
              </dl>
              {pill(ch.id, own.length + i, c.fly.label)}
            </div>
          );
        })}
      </div>
    );
  };
  const chapterBody = (ch: Chapter, heading: boolean, withCards = true) => {
    const own = ch.fly ?? [];
    return (
      <div className="pg-ch" id={`terroir-${ch.id}`} key={ch.id}>
        {heading && <h4 id={`terroir-${ch.id}-h`} tabIndex={-1}>{ch.title}</h4>}
        {ch.paras.map((para, i) => <p key={i} data-b={`${ch.id}.${i}`}>{para}</p>)}
        {own.length > 0 && <div className="pg-flies">{own.map((f, i) => pill(ch.id, i, f.label))}</div>}
        {src(ch.cite)}
        {withCards && zoneCards(ch)}
      </div>
    );
  };

  // The facts each beat holds beside its prose.
  const placeFacts = (
    <>
      <dl className="pg-rows">
        <dt>{t.level}</dt>
        <dd>{isZone ? t.zoneOf(parent?.name ?? '') : t.kindNames[place.kind] ?? level}{sheet && !isZone && src(['mapa-list'])}</dd>
        {official && (<><dt>{t.officialName}</dt><dd>{official}</dd></>)}
        {also.length > 0 && (
          <>
            <dt>{t.alsoWithin}</dt>
            <dd><ul>{also.map((o) => <li key={o.id}><Link to={{ kind: 'place', id: o.id, page: true }} go={go}>{o.name}</Link></li>)}</ul></dd>
          </>
        )}
      </dl>
      {zones.length > 0 && !zoneNotes && (
        <>
          <h4 className="pg-h3">{t.zones}</h4>
          <ul className="pg-zones">
            {zones.map((z) => {
              const photo = photosOf(z.id)[0];
              if (photo) pics.push(photo);
              const why = sheetOf(z.id)?.why;
              return (
                <li key={z.id}>
                  <Link className="zlink" to={{ kind: 'place', id: z.id, page: true }} go={go}>
                    {photo ? <Img key={photo.src} photo={photo} sizes={sizesFor(11)} alt="" lazy /> : <span className="zblank" style={{ background: color }} aria-hidden="true" />}
                    <b>{z.name}</b>
                  </Link>
                  {why && <><p>{why.text}</p>{src(why.cite)}</>}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
  const weatherFacts = (climate && !told('weather')) || koppen.length > 0 ? (
    <>
      {climate && !told('weather') && (
        <div className="pg-fact">
          <h4 className="pg-h3">{t.climateWritten}</h4>
          <p>{climate}</p>
          {src(sheet!.climate.cite)}
        </div>
      )}
      {koppen.length > 0 && (
        <div className="pg-fact">
          <h4 className="pg-h3">{t.climateMeasured}</h4>
          <ClimateBar name={place.name} shares={koppen} compare={compare.map((c) => ({ label: c.label, shares: c.m.koppen }))} />
          {src(['koppen'])}
          <p className="pg-note">{t.compareNote}</p>
        </div>
      )}
    </>
  ) : null;
  const shownAltitude = writtenAltitude && !guide;
  const groundFacts = (soil && !told('ground')) || shownAltitude || measures ? (
    <>
      {soil && !told('ground') && (
        <div className="pg-fact">
          <h4 className="pg-h3">{t.soil}</h4>
          <p>{soil}</p>
          {src(sheet!.soil.cite)}
        </div>
      )}
      {(shownAltitude || measures) && (
        <div className="pg-fact">
          <h4 className="pg-h3">{t.altitude}</h4>
          {measures && <AltitudeRange name={place.name} altitude={measures.altitude} compare={compare.map((c) => ({ label: c.label, altitude: c.m.altitude }))} />}
          {shownAltitude && <p>{writtenAltitude}</p>}
          {measures && <p>{altitudeText(measures.altitude)}</p>}
          {src([...(shownAltitude ? sheet!.altitude!.cite : []), ...(measures ? ['measures'] : [])])}
        </div>
      )}
    </>
  ) : null;
  const rulesFacts = famous.length > 0 || main.length > 0 || others.length > 0 || wineTypes ? (
    <>
      {famous.length > 0 && (
        <div className="pg-fact">
          <h4 className="pg-h3">{t.styles}</h4>
          <ul className="pg-styles">
            {famous.map((f) => <li key={f.name}><strong>{f.name}</strong>{f.text.trim() && <span>{f.text.trim()}</span>}</li>)}
          </ul>
          {src(sheet!.famous!.cite)}
        </div>
      )}
      {main.length > 0 && (
        <div className="pg-fact">
          <h4 className="pg-h3">{t.mainGrapes}</h4>
          <ul className="pg-grapes">{main.map((g) => <li key={g.local}>{grapeLabel(g)}</li>)}</ul>
          {src(sheet!.grapes.cite)}
        </div>
      )}
      {(others.length > 0 || wineTypes) && (
        <dl className="pg-rows">
          {others.length > 0 && (
            <>
              <dt>{sheet!.grapes.othersPartial ? t.otherGrapesPartial : t.otherGrapes}</dt>
              <dd><OtherGrapes names={others} />{src(sheet!.grapes.othersCite)}</dd>
            </>
          )}
          {wineTypes && (
            <>
              <dt>{t.wineTypes}</dt>
              <dd>{wineTypes}{src(sheet!.styles.cite)}</dd>
            </>
          )}
        </dl>
      )}
    </>
  ) : null;
  const factsOf: Record<Beat, ReactNode> = { place: placeFacts, weather: weatherFacts, ground: groundFacts, rules: rulesFacts };

  // A beat shows when it has a chapter or facts of its own; the place beat always has its level. Beats are numbered as they show.
  const beats = BEATS.filter((b) => told(b) || factsOf[b]).map((b, i) => ({ id: b, n: i + 1, chapters: chaptersOf(b) }));
  const beatHeading = (b: (typeof beats)[number]) => (b.chapters[0] ? `terroir-${b.chapters[0].id}-h` : `${b.id}-h`);
  const spine = !!guide || !!sheet;
  const labelTerms = guide?.label?.terms ?? [];
  const extraOf = (k: (typeof EXTRAS)[number]) => (k === 'label' ? undefined : guide?.more?.[k]);
  const extras = EXTRAS.filter((k) => (k === 'label' ? labelTerms.length > 0 : !!extraOf(k)?.paras.length));
  const alike = quizzed ? alikePlaces(tree, place, sheetOf, measuresOf) : [];

  // In short: five facts from the fields the page already holds, one line each, each linked to the beat that tells it in full.
  const firstLine = (text: string) => sentences(text, 110);
  const grapeLine = main.length === 0 ? '' : main.length <= 2 ? main.map(grapeLabel).join(' and ') : `${grapeLabel(main[0])} and ${main.length - 1} more`;
  const altitudeLine = measures ? altitudeText(measures.altitude) : '';
  const short: Array<{ key: string; text: string; to: Beat; cite: Cite[] }> = [
    ...(grapeLine ? [{ key: t.short.grapes, text: grapeLine, to: 'rules' as Beat, cite: sheet!.grapes.cite }] : []),
    ...(climate ? [{ key: t.short.climate, text: firstLine(climate), to: 'weather' as Beat, cite: sheet!.climate.cite }] : []),
    ...(soil ? [{ key: t.short.soil, text: firstLine(soil), to: 'ground' as Beat, cite: sheet!.soil.cite }] : []),
    ...(zones.length > 0
      ? [{ key: t.short.zones, text: t.zonesShort(zones.map((z) => z.name)), to: (zoneNotes ? 'weather' : 'place') as Beat, cite: [] }]
      : altitudeLine ? [{ key: t.short.altitude, text: altitudeLine, to: 'ground' as Beat, cite: ['measures'] }] : []),
    ...(famous[0]
      ? [{ key: t.short.style, text: `${famous[0].name}. ${famous[0].text.trim()}`.trim(), to: 'rules' as Beat, cite: sheet!.famous!.cite }]
      : kinds.length > 0 ? [{ key: t.short.wine, text: wineTypes, to: 'rules' as Beat, cite: sheet!.styles.cite }] : []),
  ].slice(0, 5);

  const sections = [
    ...beats.map((b) => ({ id: b.id, label: t.jump[b.id], focus: beatHeading(b) })),
    ...loose.map((c) => ({ id: `terroir-${c.id}`, label: c.title, focus: `terroir-${c.id}-h` })),
    ...(tastes ? [{ id: 'taste', label: t.sections.taste, focus: 'heading' }] : []),
    ...(short.length >= 3 ? [{ id: 'short', label: t.sections.short, focus: 'heading' }] : []),
    ...(producers.length > 0 ? [{ id: 'producers', label: t.sections.producers, focus: 'heading' }] : []),
    ...(alike.length > 0 ? [{ id: 'alike', label: t.sections.alike, focus: 'heading' }] : []),
    ...extras.map((k) => ({ id: k, label: t.sections[k], focus: 'heading' })),
    ...(sheet || guide ? [{ id: 'sources', label: t.sections.sources, focus: 'heading' }] : []),
  ];

  // The jump bar's marker follows the reading position, and a tab glides the page to its section (owner point 8, 18 Oct 2026).
  const current = useSectionInView(sections.map((s) => s.id), pageRef, place.id);
  useJumpMarker(jumpBar, current);
  const jump = (id: string, focus = 'heading') => (e: MouseEvent) => {
    e.preventDefault();
    scrollToSection(id, focus);
  };
  const beatJump = (b: Beat) => {
    const beat = beats.find((x) => x.id === b);
    return beat ? jump(b, beatHeading(beat)) : undefined;
  };
  // The map card's photo: the one the tour opens on, else the place's first.
  const cardPhoto = story ? photoByKey(story.cover.photo) ?? photosOf(place.id)[0] : undefined;
  if (cardPhoto && !tour) pics.push(cardPhoto);
  const pageHash = selectionToHash({ kind: 'place', id: place.id, page: true });

  const spineHead = spine && (
    <header className="pg-spine">
      <h2 id="why-h" tabIndex={-1}>{guide?.title ?? t.whyTitle(place.name)}</h2>
      {guide ? <><p className="pg-lede">{guide.lede.text}</p>{src(guide.lede.cite)}</> : sheet && <><p className="pg-lede">{sheet.why.text}</p>{src(sheet.why.cite)}</>}
    </header>
  );

  return (
    <div ref={pageRef} className={tour ? 'pg tour' : 'pg'} role="region" aria-label={strings.place.page.pageLabel(place.name)}>
      {tour ? (
        // The map mode has its own black band, no site nav or search (the v3 stage, restored 22 Oct 2026).
        <header className="pg-top story-top">
          <span className="story-brand">AtlaSlope</span>
          <p className="story-where">{chapterNo > 0 ? ts.chapterOf(chapterNo, guide?.chapters.length ?? 0) : ''}</p>
          <button type="button" ref={closeBtn} className="pg-close" onClick={hideMap}>{ts.close}</button>
          <a className="story-back" href={pageHash} aria-label={ts.back(place.name)} onClick={(e) => { e.preventDefault(); hideMap(); }}><span className="long">{ts.back(place.name)}</span><span className="short" aria-hidden="true">{ts.backShort}</span></a>
        </header>
      ) : <PageTop tree={tree} go={go} back={{ kind: 'place', id: place.id }} title={place.name} />}
      <div className="pg-body">
      <div className="pg-listing">
        {!tour && <div className="pg-hero">
          <div className="pg-hero-tt">
            <nav className="kicker crumb" aria-label={tc.whereThisSits}>
              {/* Only the levels above: the title under it names the place (owner, 18 Oct 2026: "Spain and Spain in one screen"). */}
              {trail.slice(0, -1).map((c, i) => <span key={c.id + i} className="step">{i > 0 && <span className="sep" aria-hidden="true">›</span>}<Link to={selectionOf(tree, c)} go={go}>{c.name}</Link></span>)}
            </nav>
            <h1 ref={heading} tabIndex={-1}>{place.name}</h1>
            {guide?.say && <p className="pg-say"><span>{t.say}</span> {guide.say}</p>}
            <ul className="pg-badges" aria-label={t.sections.where}>
              <li className="lvl"><abbr title={isZone ? t.zoneOf(parent?.name ?? '') : t.kindNames[place.kind]}>{level}</abbr></li>
              {region && <li title={t.swsTitle(region.chapter ?? region.name)}>{ownRegion ? t.swsBadge(region.name) : <Link to={{ kind: 'region', id: region.id, page: true }} go={go}>{t.swsBadge(region.name)}</Link>}</li>}
              {wsetLevels.length > 0 && <li title={t.wsetTitle(wsetLevels)}>{t.wsetBadge(wsetLevels)}</li>}
              {meta && <li className="meta">{meta}</li>}
            </ul>
          </div>
          {/* The map card where there is a tour (C3, owner 22 Oct 2026); no tour, no card: the photos and the plain "Fly to" button. */}
          <div className="pg-hero-pic">
            {hasStory(place.id) && !tour ? (
              guide && story
                ? <MapCard id={place.id} photo={cardPhoto} minutes={guide.minutes} stops={story.steps.length - 1} go={go} />
                : <div className="mapcard-wait" aria-hidden="true" />
            ) : <Mosaic key={place.id} photos={photos} name={place.name} color={color} />}
          </div>
          <div className="pg-hero-why">
            {spineHead}
            {!hasStory(place.id) && <div className="pg-actions"><Link className="btn primary" to={{ kind: 'place', id: place.id }} go={go}>{t.showOnMap(place.name)}</Link></div>}
          </div>
        </div>}

        {!tour && <nav ref={jumpBar} className="pg-jump" aria-label={t.jumpLabel}>
          {sections.map((s) => (
            <a key={s.id} href={pageHash} aria-current={current === s.id ? 'true' : undefined} onClick={jump(s.id, s.focus)}>{s.label}</a>
          ))}
        </nav>}

        <div className="pg-cols">
          <main>
            {/* Map mode keeps the spine on top: the place and why it tastes the way it does (owner 22 Oct 2026, picture 2). */}
            {tour && <header className="pg-cover"><h1>{place.name}</h1>{spineHead}</header>}
            {beats.map((b) => {
              const stops = b.chapters.flatMap(stopsOf);
              const figs = stopFigures(stops);
              // The rules beat's facts (styles, grapes) run full width under it; the others sit in the side column with the stop photos.
              const side = b.id === 'rules' ? undefined : factsOf[b.id];
              const below = [...b.chapters.map(zoneCards), b.id === 'rules' && factsOf.rules ? <div key="rules" className="pg-facts pg-below-facts">{factsOf.rules}</div> : null].filter(Boolean);
              return (
                <section key={b.id} id={b.id} className={figs.length > 0 || side ? 'pg-beat' : 'pg-beat solo'} aria-labelledby={beatHeading(b)}>
                  <div className="pg-beat-main">
                    {/* The number lives in the kicker: one left edge for kicker, title and prose (owner picked B, 22 Oct 2026). */}
                    <div className="pg-beat-h">
                      {b.chapters[0] ? (
                        <>
                          <span className="k"><span className="n" aria-hidden="true">{b.n}<span className="dot"> · </span></span>{t.beats[b.id]}</span>
                          <h3 id={beatHeading(b)} tabIndex={-1}><span className="sr-only">{t.beats[b.id]}: </span>{b.chapters[0].title}</h3>
                        </>
                      ) : <><span className="k"><span className="n" aria-hidden="true">{b.n}</span></span><h3 id={beatHeading(b)} tabIndex={-1}>{t.beats[b.id]}</h3></>}
                    </div>
                    {b.chapters.length > 0 && <div className="pg-prose">{b.chapters.map((ch, i) => chapterBody(ch, i > 0, false))}</div>}
                  </div>
                  {(figs.length > 0 || side) && (
                    <aside className="pg-beat-side">
                      {figs.length > 0 && <div className={figs.length > 1 ? 'pg-figs two' : 'pg-figs'}>{figs}</div>}
                      {side && <div className="pg-facts">{side}</div>}
                    </aside>
                  )}
                  {below.length > 0 && <div className="pg-beat-below">{below}</div>}
                </section>
              );
            })}

            {loose.map((ch) => (
              <section key={ch.id} id={`terroir-${ch.id}`} className="pg-beat" aria-labelledby={`terroir-${ch.id}-h`}>
                <h3 id={`terroir-${ch.id}-h`} tabIndex={-1}>{ch.title}</h3>
                {chapterBody({ ...ch, id: `${ch.id}-body` }, false)}
              </section>
            ))}

            {tastes && (
              <section id="taste" className="pg-answer" aria-labelledby="taste-h">
                <h2 id="taste-h" tabIndex={-1}>{t.sections.taste}</h2>
                <div className="pg-cards">
                  {tasteLines(tastes).map((l, i) => {
                    const sw = swatchOf(l.label);
                    return (
                      <div key={i} className={sw ?? undefined}>
                        {l.label && <b>{sw && <i className={`pg-sw ${sw}`} aria-hidden="true" />}{l.label}</b>}
                        <p>{l.text}</p>
                      </div>
                    );
                  })}
                </div>
                {src(sheet!.tastes!.cite)}
              </section>
            )}

            {short.length >= 3 && (
              <section id="short" className="pg-short" aria-labelledby="short-h">
                <h2 id="short-h" tabIndex={-1}>{t.sections.short}</h2>
                <ol>
                  {short.map((s) => (
                    <li key={s.key}>
                      <span className="k">{s.key}</span>
                      <span className="f"><a href={pageHash} onClick={beatJump(s.to)}>{s.text}</a>{s.cite.length > 0 && src(s.cite)}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {(producers.length > 0 || alike.length > 0) && (
              <div className={producers.length > 0 && alike.length > 0 ? 'pg-two' : 'pg-two solo'}>
            {producers.length > 0 && (
              <section id="producers" aria-labelledby="producers-h">
                <h2 id="producers-h" tabIndex={-1}>{t.sections.producers}</h2>
                <ul className="pg-names">{producers.map((p) => <li key={p.name}>{p.wine ? `${p.name} (${p.wine})` : p.name}</li>)}</ul>
                {src(sheet!.producers!.cite)}
              </section>
            )}
            {alike.length > 0 && (
              <section id="alike" aria-labelledby="alike-h">
                <h2 id="alike-h" tabIndex={-1}>{t.sections.alike}</h2>
                <ul className="pg-alike">
                  {alike.map((a) => {
                    const photo = photosOf(a.place.id)[0];
                    if (photo) pics.push(photo);
                    const trim = photo && (cardCrops as Record<string, { trimTop: number }>)[photo.src.replace(/^.*\/|\.webp$/g, '')]?.trimTop;
                    return (
                      <li key={a.place.id}>
                        <Link className="zlink" to={{ kind: 'place', id: a.place.id, page: true }} go={go}>
                          {photo ? <span className="ph" style={trim ? ({ '--trim': trim } as CSSProperties) : undefined}><Img key={photo.src} photo={photo} sizes={sizesFor(21)} alt="" lazy /></span> : <span className="zblank" style={{ background: regionColor(a.place.region) }} aria-hidden="true" />}
                          <b>{a.place.name}</b>
                        </Link>
                        <p>{a.why}</p>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
              </div>
            )}

            {extras.map((k) => {
              if (k === 'label') return (
                <section key={k} id={k} aria-labelledby={`${k}-h`}>
                  <h2 id={`${k}-h`} tabIndex={-1}>{t.sections.label}</h2>
                  <dl className="pg-rows pg-terms">{labelTerms.map((x) => <div key={x.term}><dt>{x.term}</dt><dd>{x.text}</dd></div>)}</dl>
                  {src(guide!.label!.cite)}
                </section>
              );
              const x = extraOf(k)!;
              return (
                <section key={k} id={k} aria-labelledby={`${k}-h`}>
                  <h2 id={`${k}-h`} tabIndex={-1}>{x.title ?? t.sections[k]}</h2>
                  {x.paras.map((para, i) => <p key={i} className="pg-p">{para}</p>)}
                  {src(x.cite)}
                  {k === 'visit' && x.when && (
                    <div className="pg-fact">
                      <h3 className="pg-h3">{t.whenToGo}</h3>
                      <p className="pg-p">{x.when.text}</p>
                      {src(x.when.cite)}
                    </div>
                  )}
                </section>
              );
            })}

            <div className="pg-end">
            {testMe}

            {(region && !ownRegion) || next ? (
              <div className="pg-next">
                {region && !ownRegion && <Link className="btn" to={{ kind: 'region', id: region.id, page: true }} go={go}>{t.allPlacesInRegion}</Link>}
                {next && (
                  <Link className="nextlink" to={{ kind: 'region', id: next.id, page: true }} go={go}>
                    <span className="kicker">{t.nextInCourse}</span>
                    <b>{next.name} →</b>
                  </Link>
                )}
              </div>
            ) : null}
            </div>

            {cited.length > 0 && (
              <Section id="sources" title={t.sections.sources}>
                <SourceList cites={cited} />
              </Section>
            )}
          </main>
          {/* One line for the photos drawn below the hero's own set (the hero's Mosaic carries its own line). */}
          {(() => {
            const inHero = new Set((hasStory(place.id) && !tour ? [] : photos.slice(0, 3)).map((p) => p.src));
            const rest = oneEach(pics.filter((p, i) => !inHero.has(p.src) && pics.findIndex((q) => q.src === p.src) === i));
            return rest.length > 0 && (
              <p className="pg-credits pg-credits-end">
                {t.photosLine}{' '}
                {rest.map((p, i) => <span key={p.src}>{i > 0 && '; '}<Credit photo={p} /></span>)}
              </p>
            );
          })()}
        </div>
      </div>
      {tour && guide && story && (
        <Suspense fallback={<aside className="pg-tourmap" />}>
          <GuideMap place={place} guide={guide} story={story} fly={flyAsk} onChapter={setChapterNo} />
        </Suspense>
      )}
      </div>
    </div>
  );
}

/** A route with two stops, drawn like the "Show map" icon (same stroke, size and rounding), for the Map tour link beside it. */
const TourIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h6a3.5 3.5 0 0 0 0-7h-4a3.5 3.5 0 0 1 0-7h6" /></svg>
);
