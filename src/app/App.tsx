import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import places from '../../data/places.json';
import { PlaceCard, RegionCard, SpainCard } from '../cards/Cards';
import { focusFor, validSelection } from '../cards/nav';
import { grapeNames } from '../facts';
import { MapView } from '../map/MapView';
import type { QuizView } from '../map/quiz';
import { QuizScreen } from '../quiz-ui/QuizScreen';
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
  const openQuiz = useCallback(() => {
    if (quizRef.current) return;
    const route = { sub: null };
    history.pushState(null, '', here() + quizToHash(route));
    setQuiz(route);
  }, []);
  const openExplore = useCallback(() => {
    history.pushState(null, '', here() + selectionToHash(selRef.current));
    setQuiz(null);
  }, []);
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

  // Cards 4 and 5 drive this from the question in play; for now the quiz map is flat and nameless.
  const quizView = useMemo<QuizView | null>(() => (quiz ? { hideNames: true, dimExcept: null, select: null, reveal: null } : null), [!!quiz]);
  const focus = useMemo(() => focusFor(tree, sel), [tree, sel]);
  const place = sel.kind === 'place' ? tree.getPlace(sel.id) : undefined;
  const region = sel.kind === 'region' ? tree.getRegion(sel.id) : undefined;
  return (
    <>
      <MapView focus={focus} restored={restored.current} quiz={quizView} onPick={(id) => { if (!quizRef.current) go({ kind: 'place', id }); }} onView={onView} />
      <TopBar theme={theme} onToggleTheme={toggleTheme} tree={tree} onOpen={go} quizOpen={!!quiz} onQuiz={openQuiz} onExplore={openExplore} />
      {quiz ? <QuizScreen route={quiz} /> : place ? <PlaceCard tree={tree} go={go} place={place} /> : region ? <RegionCard tree={tree} go={go} region={region} /> : <SpainCard tree={tree} go={go} />}
      <FirstRun />
    </>
  );
}
