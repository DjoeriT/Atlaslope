import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import places from '../../data/places.json';
import { PlaceCard, RegionCard, SpainCard } from '../cards/Cards';
import { focusFor, validSelection } from '../cards/nav';
import { grapeNames } from '../facts';
import { debugNow, exposeQuizPick } from '../debug';
import { MapView } from '../map/MapView';
import type { QuizView } from '../map/quiz';
import { makeClock } from '../quiz-ui/helpers';
import { IDLE_VIEW, QuizScreen } from '../quiz-ui/QuizScreen';
import { TodayCard } from '../quiz-ui/TodayCard';
import { useQuiz } from '../quiz-ui/useQuiz';
import { strings } from '../strings';
import type { MapPick } from '../quiz-ui/RoundPlayer';
import { loadTree } from '../tree';
import { parseQuizRoute, parseSelection, parseView, quizToHash, selectionToHash, type QuizRoute, type Selection, type View } from '../url';
import { FirstRun } from './FirstRun';
import { TopBar } from './TopBar';
import { useTheme } from './theme';

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
    if (to.kind === selRef.current.kind && to.id === selRef.current.id) return;
    history.pushState(null, '', here() + selectionToHash(to));
    setQuiz(null);
    setSel(to);
  }, []);
  const lastQuiz = useRef<QuizRoute>({ sub: null }); // where the quiz was, for "Back to the quiz"
  if (quiz) lastQuiz.current = quiz;
  // A round left for a place's card stays in memory (QuizScreen stays mounted, out of sight) until the learner is back or goes to Explore.
  const [keepQuiz, setKeepQuiz] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [todayClosed, setTodayClosed] = useState(false);
  const openQuiz = useCallback((sub: QuizRoute['sub'] = null) => {
    if (quizRef.current && quizRef.current.sub === sub) return;
    const route = { sub };
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
  const focus = useMemo(() => focusFor(tree, sel), [tree, sel]);
  const place = sel.kind === 'place' ? tree.getPlace(sel.id) : undefined;
  const region = sel.kind === 'region' ? tree.getRegion(sel.id) : undefined;
  return (
    <>
      <MapView focus={focus} restored={restored.current} quiz={quizView} onPick={(id) => { if (quizRef.current) pickOnMap(id); else go({ kind: 'place', id }); }} onView={onView} />
      <TopBar theme={theme} onToggleTheme={toggleTheme} tree={tree} onOpen={go} quizOpen={!!quiz} onQuiz={() => openQuiz()} onExplore={openExplore} onProgressFile={() => openQuiz('progress-file')} />
      {(quiz || keepQuiz) && (
        <QuizScreen
          route={quiz ?? lastQuiz.current} tree={tree} quiz={progress} pick={mapPick} hidden={!quiz} autoStart={autoStart}
          onAutoStarted={() => setAutoStart(false)} onView={setMapView} onOpenPlace={openPlaceFromQuiz}
        />
      )}
      {!quiz && keepQuiz && (
        <button className="back-quiz glass" onClick={backToQuiz} aria-label={strings.quiz.backToQuizLabel}>‹ {strings.quiz.backToQuiz}</button>
      )}
      {quiz ? null : place ? <PlaceCard tree={tree} go={go} place={place} /> : region ? <RegionCard tree={tree} go={go} region={region} />
        : progress.hasProgress && !todayClosed ? (
          <TodayCard tree={tree} quiz={progress} go={go} onClose={() => setTodayClosed(true)} onStart={() => { setAutoStart(true); openQuiz(); }} />
        ) : <SpainCard tree={tree} go={go} />}
      <FirstRun />
    </>
  );
}
