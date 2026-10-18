import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import places from '../../data/places.json';
import { PlaceCard, RegionCard, SpainCard } from '../cards/Cards';
import { RegionPage } from '../pages/RegionPage';
import { PlacePage } from '../pages/PlacePage';
import { FlyCaption } from '../cards/FlyCaption';
import { flyOf, focusFor, parentOf, validSelection } from '../cards/nav';
import { grapeNames } from '../facts';
import { debugNow, exposeQuizPick } from '../debug';
import { MapView, swoopIn } from '../map/MapView';
import type { Focus } from '../map/focus';
import type { QuizView } from '../map/quiz';
import { makeClock } from '../quiz-ui/helpers';
import { IDLE_VIEW, QuizScreen } from '../quiz-ui/QuizScreen';
import { useQuiz } from '../quiz-ui/useQuiz';
import { strings } from '../strings';
import type { MapPick } from '../quiz-ui/RoundPlayer';
import { loadTree } from '../tree';
import { SPAIN, parseQuizRoute, parseSelection, parseView, quizToHash, selectionToHash, withView, type QuizRoute, type Selection, type View } from '../url';
import { FirstRun } from './FirstRun';
import { SiteBar } from './TopBar';
import { withMotion, type Move } from './motion';
import { Sheet } from './Sheet';

const flyKey = (s: Selection) => (s.kind === 'place' && s.fly ? `${s.fly.chapter}.${s.fly.index}` : '');
const here = () => location.pathname + location.search;
const depth = (s: Selection) => (s.kind === 'place' ? 2 : s.kind === 'region' ? 1 : 0);
/** Which move a change of card or page makes. Guide to guide steps forward, or back up when it goes to a wider guide (owner point 8). */
const moveOf = (from: Selection, to: Selection): Move => (
  to.page && !from.page ? 'page-open'
    : from.page && !to.page ? 'page-close'
      : from.page && to.page && (from.kind !== to.kind || from.id !== to.id) ? (depth(to) < depth(from) ? 'page-up' : 'page-step')
        : 'card');

export function App() {
  const tree = useMemo(() => loadTree(places, grapeNames()), []);
  const [sel, setSel] = useState<Selection>(() => validSelection(tree, parseSelection(location.hash)));
  const selRef = useRef(sel);
  selRef.current = sel;
  const [quiz, setQuiz] = useState<QuizRoute | null>(() => parseQuizRoute(location.hash));
  const quizRef = useRef(quiz);
  quizRef.current = quiz;
  const restored = useRef(parseView(location.hash)); // only the first card keeps the camera from the link

  // A new card is a new history entry; back and forward come back as popstate.
  const go = useCallback((wanted: Selection) => {
    const to = validSelection(tree, wanted);
    const cur = selRef.current;
    if (to.kind === cur.kind && to.id === cur.id && !to.page === !cur.page && flyKey(to) === flyKey(cur) && to.at === cur.at) return;
    // The card and the page of one place share the camera, so the link keeps it (a fly-there moves it, so it keeps nothing).
    const same = to.kind === cur.kind && to.id === cur.id;
    // "Back to map" from a page opened from its own card steps back, so the phone's back gesture doesn't reopen the page just closed.
    if (same && cur.page && !to.page && !to.fly && (history.state as { fromCard?: boolean } | null)?.fromCard) { history.back(); return; }
    const view = same && !to.fly ? parseView(location.hash) : null;
    history.pushState(same && to.page && !cur.page ? { fromCard: true } : null, '', here() + selectionToHash(to, view));
    const move = quizRef.current ? 'card' : moveOf(cur, to);
    withMotion(() => {
      setQuiz(null);
      setStay(null);
      setBackTo((b) => (to.kind === 'place' && to.id === b ? b : null)); // exploring anywhere else ends "Back to the quiz"
      setSel(to);
    }, move);
    // Back on the map from a guide, the camera flies in once the guide has gone (owner, 18 Oct 2026: "Fly to Rueda" did not fly).
    if (move === 'page-close') swoopIn();
  }, [tree]);
  // "Close and stay on the map": the place's card opens over the camera the fly-there set, until anything else is opened.
  const [stay, setStay] = useState<Focus | null>(null);
  const lastQuiz = useRef<QuizRoute>({ sub: null }); // where the quiz was, for "Back to the quiz"
  if (quiz) lastQuiz.current = quiz;
  // Once opened, the quiz stays mounted out of sight in Explore, so a round left by any way out waits for the Quiz tab.
  const keepQuiz = useRef(false);
  if (quiz) keepQuiz.current = true;
  // The place card opened from the quiz offers "Back to the quiz"; anywhere else in Explore says nothing about the quiz (owner, 18 Oct 2026).
  const [backTo, setBackTo] = useState<string | null>(null);
  const clock = useMemo(() => makeClock(debugNow()), []);
  const openQuiz = useCallback((sub: QuizRoute['sub'] = null, set?: string[]) => {
    if (quizRef.current && quizRef.current.sub === sub && !set) return;
    const route: QuizRoute = set ? { sub, set } : { sub };
    history.pushState(null, '', here() + quizToHash(route));
    withMotion(() => setQuiz(route));
  }, []);
  const openExplore = useCallback(() => {
    history.pushState(null, '', here() + selectionToHash(selRef.current));
    withMotion(() => {
      setQuiz(null);
      setBackTo(null);
    });
  }, []);
  const openPlaceFromQuiz = useCallback((id: string) => {
    history.pushState(null, '', here() + selectionToHash({ kind: 'place', id }));
    setBackTo(id);
    setQuiz(null);
    setSel({ kind: 'place', id });
  }, []);
  const backToQuiz = useCallback(() => openQuiz(lastQuiz.current.sub), [openQuiz]);
  useEffect(() => {
    const onPop = () => {
      const to = validSelection(tree, parseSelection(location.hash));
      const q = parseQuizRoute(location.hash);
      const move = q || quizRef.current ? 'card' : moveOf(selRef.current, to);
      withMotion(() => {
        setQuiz(q);
        // A Study address names no card: the atlas keeps the one it had, so Atlas comes back to it (review of website slice 2).
        if (!q) setSel(to);
        setStay(null);
      }, move);
      if (move === 'page-close') swoopIn();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [tree]);

  // Where the map looks goes into the address bar without a new history entry.
  const onView = useCallback((view: View) => {
    history.replaceState(history.state, '', here() + withView(location.hash, view));
  }, []);

  // In quiz mode the question in play decides what the map shows, and a tap on the map is the pick for find it.
  const [mapView, setMapView] = useState<QuizView>(IDLE_VIEW);
  const quizView = quiz ? mapView : null;
  const [mapPick, setMapPick] = useState<MapPick | null>(null);
  const pickCount = useRef(0);
  const pickOnMap = useCallback((id: string) => setMapPick({ id, n: ++pickCount.current }), []);
  useEffect(() => exposeQuizPick(pickOnMap), [pickOnMap]);
  // A tap from before the quiz went out of sight is not replayed when it comes back (review of PR #72).
  useEffect(() => { if (!quiz) setMapPick(null); }, [quiz]);
  const progress = useQuiz(tree, clock);
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
  // Escape closes the full page, or steps up from a card (not while typing, and not when a menu or the caption took it first).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented || quizRef.current) return;
      const el = e.target as HTMLElement;
      if (el.closest('input, textarea, select, [role="menu"], .menu, .flycap')) return;
      // The fly caption marks its Escape handled; the welcome and End round dialogs keep theirs (PR #63 review).
      if (document.querySelector('.flycap, [role="dialog"]:not([hidden]), [role="alertdialog"]:not([hidden] *)')) return;
      const cur = selRef.current;
      if (cur.kind === 'country') return;
      go(cur.page ? { kind: cur.kind, id: cur.id } : parentOf(tree, cur));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, tree]);
  const place = sel.kind === 'place' ? tree.getPlace(sel.id) : undefined;
  const region = sel.kind === 'region' ? tree.getRegion(sel.id) : undefined;
  const titleName = place?.name ?? region?.name;
  useEffect(() => {
    document.title = quiz ? strings.pageTitle(strings.topBar.quiz) : titleName ? strings.pageTitle(titleName) : strings.pageTitleHome;
  }, [titleName, !!quiz]);
  // atlas/#search (the home page's search link until 18 Oct 2026, maybe bookmarked): the atlas opens on Spain with the search field ready.
  useEffect(() => {
    if (location.hash !== '#search') return;
    history.replaceState(history.state, '', here());
    document.querySelector<HTMLInputElement>('.sitebar .search input')?.focus();
  }, []);
  return (
    <>
      {!pageOpen && <SiteBar tree={tree} onOpen={go} current={quiz ? 'study' : 'atlas'} onAtlas={() => { if (quiz) openExplore(); else { setBackTo(null); setStay(null); go(SPAIN); } }} />}
      {/* Everything under the bar: the map and what floats on it are placed against this box, not the window. */}
      <div className="stage">
      <MapView focus={focus} restored={restored.current} quiz={quizView} onPick={(id) => { if (quizRef.current) pickOnMap(id); else go({ kind: 'place', id }); }} onView={onView} regions={tree.regionsOf(tree.countries[0].id)} />
      {keepQuiz.current && (
        <QuizScreen
          route={quiz ?? lastQuiz.current} tree={tree} quiz={progress} pick={mapPick} hidden={!quiz}
          onView={setMapView} onOpenPlace={openPlaceFromQuiz}
        />
      )}
      {!quiz && !pageOpen && place && place.id === backTo && (
        <button className="back-quiz glass" onClick={backToQuiz} aria-label={strings.quiz.backToQuizLabel}>‹ {strings.quiz.backToQuiz}</button>
      )}
      {!quiz && place && sel.page && <PlacePage key={place.id} tree={tree} go={go} place={place} at={sel.at} onTest={(set) => openQuiz('test', set)} />}
      {!quiz && region && sel.page && <RegionPage key={region.id} tree={tree} go={go} region={region} />}
      {!quiz && !pageOpen && (
        <Sheet explore resetKey={`${sel.kind}:${sel.id}:${flyKey(sel)}`}>
          {place && flown && fly ? <FlyCaption place={place} chapter={fly.chapter} target={flown} go={go} onClose={closeFly} />
            : place ? <PlaceCard tree={tree} go={go} place={place} /> : region ? <RegionCard tree={tree} go={go} region={region} />
            // The Atlas shows no Study items: no Today card, no due counts (owner, 18 Oct 2026: "Now I see Study todos in the Atlas").
            : <SpainCard tree={tree} go={go} />}
        </Sheet>
      )}
      {!pageOpen && <FirstRun />}
      </div>
    </>
  );
}
