import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import places from '../../data/places.json';
import { PlaceCard, RegionCard, SpainCard } from '../cards/Cards';
import { RegionPage } from '../pages/RegionPage';
import { PlacePage } from '../pages/PlacePage';
import { FlyCaption } from '../cards/FlyCaption';
import { flyOf, focusFor, validSelection } from '../cards/nav';
import { grapeNames } from '../facts';
import { debugNow, exposeQuizPick } from '../debug';
import { MapView } from '../map/MapView';
import type { Focus } from '../map/focus';
import type { QuizView } from '../map/quiz';
import { makeClock } from '../quiz-ui/helpers';
import { IDLE_VIEW, QuizScreen } from '../quiz-ui/QuizScreen';
import { TodayCard } from '../quiz-ui/TodayCard';
import { useQuiz } from '../quiz-ui/useQuiz';
import { strings } from '../strings';
import type { MapPick } from '../quiz-ui/RoundPlayer';
import { loadTree } from '../tree';
import { SPAIN, parseQuizRoute, parseSelection, parseView, quizToHash, selectionToHash, type QuizRoute, type Selection, type View } from '../url';
import { FirstRun } from './FirstRun';
import { TopBar } from './TopBar';
import { useTheme } from './theme';

const flyKey = (s: Selection) => (s.kind === 'place' && s.fly ? `${s.fly.chapter}.${s.fly.index}` : '');
const here = () => location.pathname + location.search;

export function App() {
  const [theme, toggleTheme] = useTheme();
  const tree = useMemo(() => loadTree(places, grapeNames()), []);
  const [sel, setSel] = useState<Selection>(() => validSelection(tree, parseSelection(location.hash)));
  const selRef = useRef(sel);
  selRef.current = sel;
  const [quiz, setQuiz] = useState<QuizRoute | null>(() => parseQuizRoute(location.hash));
  const quizRef = useRef(quiz);
  quizRef.current = quiz;
  const restored = useRef(parseView(location.hash)); // only the first card keeps the camera from the link

  // A new card is a new history entry; back and forward come back as popstate.
  const go = useCallback((to: Selection) => {
    const cur = selRef.current;
    if (to.kind === cur.kind && to.id === cur.id && !to.page === !cur.page && flyKey(to) === flyKey(cur) && to.at === cur.at) return;
    // The card and the page of one place share the camera, so the link keeps it (a fly-there moves it, so it keeps nothing).
    const same = to.kind === cur.kind && to.id === cur.id;
    // "Back to map" from a page opened from its own card steps back, so the phone's back gesture doesn't reopen the page just closed.
    if (same && cur.page && !to.page && !to.fly && (history.state as { fromCard?: boolean } | null)?.fromCard) { history.back(); return; }
    const view = same && !to.fly ? parseView(location.hash) : null;
    history.pushState(same && to.page && !cur.page ? { fromCard: true } : null, '', here() + selectionToHash(to, view));
    setQuiz(null);
    setStay(null);
    setSel(to);
  }, []);
  // "Close and stay on the map": the place's card opens over the camera the fly-there set, until anything else is opened.
  const [stay, setStay] = useState<Focus | null>(null);
  const lastQuiz = useRef<QuizRoute>({ sub: null }); // where the quiz was, for "Back to the quiz"
  if (quiz) lastQuiz.current = quiz;
  // A round left for a place's card stays in memory (QuizScreen stays mounted, out of sight) until the learner is back or goes to Explore.
  const [keepQuiz, setKeepQuiz] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [todayClosed, setTodayClosed] = useState(false);
  const openQuiz = useCallback((sub: QuizRoute['sub'] = null, set?: string[]) => {
    if (quizRef.current && quizRef.current.sub === sub && !set) return;
    const route: QuizRoute = set ? { sub, set } : { sub };
    history.pushState(null, '', here() + quizToHash(route));
    setQuiz(route);
  }, []);
  const openExplore = useCallback(() => {
    history.pushState(null, '', here() + selectionToHash(selRef.current));
    setQuiz(null);
    setKeepQuiz(false);
  }, []);
  const openPlaceFromQuiz = useCallback((id: string) => {
    history.pushState(null, '', here() + selectionToHash({ kind: 'place', id }));
    setKeepQuiz(true);
    setQuiz(null);
    setSel({ kind: 'place', id });
  }, []);
  const backToQuiz = useCallback(() => openQuiz(lastQuiz.current.sub), [openQuiz]);
  useEffect(() => {
    const onPop = () => {
      setQuiz(parseQuizRoute(location.hash));
      setSel(validSelection(tree, parseSelection(location.hash)));
      setStay(null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [tree]);

  // Where the map looks goes into the address bar without a new history entry.
  const onView = useCallback((view: View) => {
    const route = quizRef.current;
    history.replaceState(history.state, '', here() + (route ? quizToHash(route, view) : selectionToHash(selRef.current, view)));
  }, []);

  // In quiz mode the question in play decides what the map shows, and a tap on the map is the pick for find it.
  const [mapView, setMapView] = useState<QuizView>(IDLE_VIEW);
  const quizView = quiz ? mapView : null;
  const [mapPick, setMapPick] = useState<MapPick | null>(null);
  const pickCount = useRef(0);
  const pickOnMap = useCallback((id: string) => setMapPick({ id, n: ++pickCount.current }), []);
  useEffect(() => exposeQuizPick(pickOnMap), [pickOnMap]);
  const clock = useMemo(() => makeClock(debugNow()), []);
  const progress = useQuiz(tree, clock);
  const dueSet = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of progress.plan.due) m.set(r.place, (m.get(r.place) ?? 0) + 1);
    return m;
  }, [progress.plan]);
  // Keyed on what is selected, not on the card or page showing it, so opening the page and coming back leaves the map's camera alone.
  const flown = flyOf(sel);
  const fly = sel.kind === 'place' ? sel.fly : undefined;
  const focus = useMemo(() => stay ?? focusFor(tree, sel), [tree, sel.kind, sel.id, flyKey(sel), stay]);
  const closeFly = useCallback(() => {
    setStay(focus);
    history.pushState(null, '', here() + selectionToHash({ kind: 'place', id: selRef.current.id }, parseView(location.hash)));
    setSel({ kind: 'place', id: selRef.current.id });
  }, [focus]);
  const pageOpen = !quiz && sel.kind !== 'country' && !!sel.page;
  useEffect(() => {
    document.getElementById('map')?.toggleAttribute('inert', pageOpen); // the page covers the map; keep the keyboard off it
  }, [pageOpen]);
  const place = sel.kind === 'place' ? tree.getPlace(sel.id) : undefined;
  const region = sel.kind === 'region' ? tree.getRegion(sel.id) : undefined;
  const titleName = place?.name ?? region?.name;
  useEffect(() => {
    document.title = titleName ? strings.pageTitle(titleName) : strings.pageTitleHome;
  }, [titleName]);
  return (
    <>
      <MapView focus={focus} restored={restored.current} quiz={quizView} onPick={(id) => { if (quizRef.current) pickOnMap(id); else go({ kind: 'place', id }); }} onView={onView} regions={tree.regionsOf(tree.countries[0].id)} />
      {!pageOpen && <TopBar theme={theme} onToggleTheme={toggleTheme} tree={tree} onOpen={go} quizOpen={!!quiz} onQuiz={() => openQuiz()} onExplore={() => { if (quiz) openExplore(); else { setKeepQuiz(false); go(SPAIN); } }} onProgressFile={() => openQuiz('progress-file')} />}
      {(quiz || keepQuiz) && (
        <QuizScreen
          route={quiz ?? lastQuiz.current} tree={tree} quiz={progress} pick={mapPick} hidden={!quiz} autoStart={autoStart}
          onAutoStarted={() => setAutoStart(false)} onView={setMapView} onOpenPlace={openPlaceFromQuiz}
        />
      )}
      {!quiz && keepQuiz && !pageOpen && (
        <button className="back-quiz glass" onClick={backToQuiz} aria-label={strings.quiz.backToQuizLabel}>‹ {strings.quiz.backToQuiz}</button>
      )}
      {quiz ? null : place && flown && fly && !sel.page ? <FlyCaption place={place} chapter={fly.chapter} target={flown} go={go} onClose={closeFly} />
        : place && sel.page ? <PlacePage tree={tree} go={go} place={place} at={sel.at} onTest={(set) => openQuiz('test', set)} /> : region && sel.page ? <RegionPage tree={tree} go={go} region={region} /> : place ? <PlaceCard tree={tree} go={go} place={place} /> : region ? <RegionCard tree={tree} go={go} region={region} due={dueSet} />
        : progress.hasProgress && !todayClosed ? (
          <TodayCard tree={tree} quiz={progress} go={go} onClose={() => setTodayClosed(true)} onStart={() => { setAutoStart(true); openQuiz(); }} />
        ) : <SpainCard tree={tree} go={go} due={dueSet} onReview={() => { setAutoStart(true); openQuiz(); }} />}
      {!pageOpen && <FirstRun />}
    </>
  );
}
