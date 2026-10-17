import { useEffect, useMemo, useRef, useState } from 'react';
import type { QuizView } from '../map/quiz';
import { memoryKey, studyRound, type Round } from '../quiz';
import { strings } from '../strings';
import type { Tree } from '../tree';
import type { QuizRoute } from '../url';
import { makeClock } from './helpers';
import { debugNow } from '../debug';
import { RoundEnd } from './RoundEnd';
import { RoundPlayer, type MapPick, type RoundResult } from './RoundPlayer';
import { useQuiz } from './useQuiz';
import '../styles/quiz.css';

const t = strings.quiz;

/** What the quiz map shows when no question is in play: flat, names hidden, nothing picked. */
export const IDLE_VIEW: QuizView = { hideNames: true, dimExcept: null, select: null, reveal: null };

interface Props {
  route: QuizRoute;
  tree: Tree;
  /** The latest tap on the map. */
  pick: MapPick | null;
  onView(view: QuizView): void;
  onOpenPlace(id: string): void;
}

type Mode = { at: 'idle' } | { at: 'playing'; round: Round; id: number } | { at: 'ended'; result: RoundResult };

/** The quiz card. For now: one "Start today's round" button, the round, and its end; the doors arrive in the next card. */
export function QuizScreen({ route, tree, pick, onView, onOpenPlace }: Props) {
  const now = useMemo(() => makeClock(debugNow()), []);
  const quiz = useQuiz(tree, now);
  const [mode, setMode] = useState<Mode>({ at: 'idle' });
  const [empty, setEmpty] = useState(false);
  const asked = useRef(new Set<string>()); // memories answered in earlier rounds of this sitting, for "Keep going"
  const ids = useRef(0);

  useEffect(() => { if (mode.at !== 'playing') onView(IDLE_VIEW); }, [mode.at]);
  useEffect(() => () => onView(IDLE_VIEW), []);

  const play = (round: Round) => {
    setEmpty(!round.items.length);
    if (round.items.length) setMode({ at: 'playing', round, id: ++ids.current });
  };
  const build = (learnMore: boolean) => studyRound(tree, quiz.log, quiz.now(), { asked: asked.current, learnMore });
  const keepGoing = useMemo(
    () => (mode.at === 'ended' && mode.result.round.more ? studyRound(tree, quiz.log, quiz.now(), { asked: asked.current }) : null),
    [mode, quiz.log],
  );

  if (mode.at === 'playing') {
    return (
      <RoundPlayer
        key={mode.id} kind="study" round={mode.round} tree={tree} quiz={quiz} pick={pick} onView={onView} onOpenPlace={onOpenPlace}
        onExit={(result) => {
          Object.values(result.outcomes).forEach((o) => asked.current.add(memoryKey(o.place, o.memory)));
          setMode({ at: 'ended', result });
        }}
      />
    );
  }
  if (mode.at === 'ended') {
    return (
      <RoundEnd
        result={mode.result} tree={tree} quiz={quiz} keepGoing={keepGoing} onOpenPlace={onOpenPlace}
        onKeepGoing={() => keepGoing && play(keepGoing)}
        onLearnMore={() => play(build(true))}
        onDone={() => setMode({ at: 'idle' })}
      />
    );
  }
  return (
    <section className="card glass" aria-label={t.cardLabel} data-sub={route.sub ?? ''}>
      <div className="body">
        <h1>{t.heading}</h1>
        {empty && <p className="note" role="status">{t.nothingToAsk}</p>}
      </div>
      <div className="foot">
        <button className="btn primary" onClick={() => { asked.current.clear(); play(build(false)); }}>{t.startToday}</button>
      </div>
    </section>
  );
}
