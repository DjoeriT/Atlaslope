import { useEffect, useMemo, useRef, useState } from 'react';
import type { QuizView } from '../map/quiz';
import { memoryKey, reviewRound, studyRound, type Round } from '../quiz';
import type { Tree } from '../tree';
import { quizToHash, type QuizRoute } from '../url';
import { Doors } from './Doors';
import { FocusScreen } from './FocusScreen';
import { PractiseScreen } from './PractiseScreen';
import { ProgressFile } from './ProgressFile';
import { RoundEnd } from './RoundEnd';
import { RoundPlayer, type MapPick, type RoundKind, type RoundResult } from './RoundPlayer';
import { localDay, type QuizApi } from './useQuiz';
import '../styles/quiz.css';

/** What the quiz map shows when no question is in play: flat, names hidden, nothing picked. */
export const IDLE_VIEW: QuizView = { hideNames: true, dimExcept: null, select: null, reveal: null };

interface Props {
  route: QuizRoute;
  tree: Tree;
  quiz: QuizApi;
  /** The latest tap on the map. */
  pick: MapPick | null;
  /** True while a place card is open over the quiz: the round stays in memory, out of sight. */
  hidden?: boolean;
  /** Start today's round as soon as the screen opens (the Today card's button). */
  autoStart?: boolean;
  onAutoStarted?(): void;
  onView(view: QuizView): void;
  /** Leaves for a place's card; the quiz comes back with "Back to the quiz". */
  onOpenPlace(id: string): void;
}

/** A review round remembers its picked places and size, so "Keep going" asks from the same set. */
interface Review { set: string[]; size: 10 | 20 }
type Mode =
  | { at: 'idle' }
  | { at: 'playing'; round: Round; id: number; kind: RoundKind; review?: Review }
  | { at: 'ended'; result: RoundResult; review?: Review };

const go = (sub: QuizRoute['sub']) => { location.hash = quizToHash({ sub }); };

/** The quiz card: the doors, focus, practise any mix, the progress file, a round and its end. */
export function QuizScreen({ route, tree, quiz, pick, hidden, autoStart, onAutoStarted, onView, onOpenPlace }: Props) {
  const [mode, setMode] = useState<Mode>({ at: 'idle' });
  const [empty, setEmpty] = useState(false);
  const asked = useRef(new Set<string>()); // memories answered in earlier rounds of this sitting, for "Keep going"
  const ids = useRef(0);
  const shell = useRef<HTMLDivElement>(null);
  const wasHidden = useRef(false);

  useEffect(() => { if (mode.at !== 'playing') onView(IDLE_VIEW); }, [mode.at]);
  useEffect(() => () => onView(IDLE_VIEW), []);

  const play = (round: Round, kind: RoundKind = 'study', review?: Review) => {
    setEmpty(!round.items.length);
    if (round.items.length) setMode({ at: 'playing', round, id: ++ids.current, kind, review });
  };
  const study = (learnMore: boolean) => studyRound(tree, quiz.log, quiz.now(), { asked: asked.current, learnMore, focus: quiz.focus, ...localDay(quiz.now()) });
  const startStudy = (learnMore: boolean) => { asked.current.clear(); play(study(learnMore)); };
  const startReview = (set: string[], size: 10 | 20) => {
    asked.current.clear();
    go(null);
    play(reviewRound(tree, set, quiz.log, quiz.now(), { size }), 'review', { set, size });
  };

  const today = useMemo(() => studyRound(tree, quiz.log, quiz.now(), { focus: quiz.focus, ...localDay(quiz.now()) }), [tree, quiz.log, quiz.focus]);
  const keepGoing = useMemo(() => {
    if (mode.at !== 'ended' || !mode.result.round.more) return null;
    return mode.review
      ? reviewRound(tree, mode.review.set, quiz.log, quiz.now(), { size: mode.review.size, asked: asked.current })
      : studyRound(tree, quiz.log, quiz.now(), { asked: asked.current, focus: quiz.focus, ...localDay(quiz.now()) });
  }, [mode, quiz.log]);

  // Coming back from a place card puts the keyboard on the question again.
  useEffect(() => {
    if (!hidden && wasHidden.current) shell.current?.querySelector<HTMLElement>('[tabindex="-1"]')?.focus();
    wasHidden.current = !!hidden;
  }, [hidden]);

  // #quiz=test&set=a,b (a place page's "Test me") starts a review round of 10 on those places at once; the address then reads plain #quiz.
  const testSet = route.sub === 'test' ? route.set?.join(',') ?? '' : '';
  useEffect(() => {
    if (testSet) startReview(testSet.split(','), 10);
  }, [testSet]);

  const started = useRef(false);
  useEffect(() => {
    if (!autoStart || started.current || route.sub) return;
    started.current = true;
    onAutoStarted?.();
    startStudy(quiz.plan.due.length === 0 && quiz.plan.intake.length === 0);
  }, [autoStart]);

  const screen = (() => {
    if (mode.at === 'playing') {
      return (
        <RoundPlayer
          key={mode.id} kind={mode.kind} round={mode.round} tree={tree} quiz={quiz} pick={hidden ? null : pick} onView={onView} onOpenPlace={onOpenPlace}
          onExit={(result) => {
            Object.values(result.outcomes).forEach((o) => asked.current.add(memoryKey(o.place, o.memory)));
            setMode({ at: 'ended', result, review: mode.review });
          }}
        />
      );
    }
    if (route.sub === 'focus') return <FocusScreen tree={tree} quiz={quiz} onLeave={() => go(null)} />;
    if (route.sub === 'practise') return <PractiseScreen tree={tree} quiz={quiz} onStart={startReview} onLeave={() => go(null)} />;
    if (route.sub === 'progress-file') return <ProgressFile quiz={quiz} onLeave={() => go(null)} />;
    if (mode.at === 'ended') {
      return (
        <RoundEnd
          result={mode.result} tree={tree} quiz={quiz} keepGoing={keepGoing} onOpenPlace={onOpenPlace}
          onKeepGoing={() => keepGoing && play(keepGoing, mode.result.kind, mode.review)}
          onLearnMore={() => startStudy(true)}
          onDone={() => setMode({ at: 'idle' })}
        />
      );
    }
    return <Doors tree={tree} quiz={quiz} round={today} empty={empty} onStudy={startStudy} />;
  })();
  // Out of sight, not unmounted: the question in play stays as it was while a place card is open.
  return <div ref={shell} hidden={hidden}>{screen}</div>;
}
