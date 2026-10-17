import { useEffect, useRef } from 'react';
import { INTAKE_PER_DAY, type Round } from '../quiz';
import { strings } from '../strings';
import type { Tree } from '../tree';
import { quizToHash, selectionToHash } from '../url';
import { missesOf, scoreOf, type Outcome } from './helpers';
import type { RoundResult } from './RoundPlayer';
import type { QuizApi } from './useQuiz';

const t = strings.quiz.end;

interface Props {
  result: RoundResult;
  tree: Tree;
  quiz: QuizApi;
  /** The round "Keep going" would play; null when nothing more is due. */
  keepGoing: Round | null;
  onKeepGoing(): void;
  onLearnMore(): void;
  onDone(): void;
  onOpenPlace(id: string): void;
}

/** What the learner got wrong, in a few words. */
function missTag(o: Outcome, tree: Tree): string {
  if (o.skipped || o.picked === undefined) return t.skippedTag;
  if (o.type === 'find-it') return t.pickedTag(tree.getPlace(o.picked)?.name ?? o.picked);
  return t.saidTag(o.type === 'what-is-this' ? tree.getPlace(o.picked)?.name ?? o.picked : o.picked);
}

/** The end of a round: the score, the misses (each links to its place), what is left today, then Keep going or Done for today. */
export function RoundEnd({ result, tree, quiz, keepGoing, onKeepGoing, onLearnMore, onDone, onOpenPlace }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  const { right, of } = scoreOf(result.outcomes);
  const misses = missesOf(result.outcomes);
  const due = quiz.plan.due.length;
  const seen = Math.min(quiz.plan.seenToday, INTAKE_PER_DAY);
  const more = keepGoing ? keepGoing.items.filter((i) => i.kind === 'question').length : 0;
  const kindName = result.kind === 'study' ? strings.quiz.round.kindStudy : strings.quiz.round.kindReview;
  const open = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); onOpenPlace(id); };
  return (
    <section className="card glass" aria-labelledby="rh">
      <div className="body">
        <div className="kicker">{t.kicker(kindName)}</div>
        <h1 id="rh" ref={heading} tabIndex={-1} className="score" aria-label={t.scoreLabel(right, of)}>{right}<small> / {of}</small></h1>
        <p className="lede" aria-live="polite">{more ? t.keepGoingLede(due) : t.doneLede(misses.length)}</p>
        {misses.length > 0 && (
          <>
            <h2>{t.missed}</h2>
            <ul className="list misses">
              {misses.map((o) => (
                <li key={`${o.place}/${o.memory}`}>
                  <a href={selectionToHash({ kind: 'place', id: o.place })} onClick={open(o.place)}>{tree.getPlace(o.place)?.name ?? o.place}</a>
                  <span className="tag">{missTag(o, tree)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <h2>{t.today}</h2>
        <div className="row"><span>{t.dueLeft}</span><div className="bar"><i style={{ width: `${due + of ? (due / (due + of)) * 100 : 0}%` }} /></div><span>{due}</span></div>
        <div className="row"><span>{t.newPlaces}</span><div className="bar"><i style={{ width: `${(seen / INTAKE_PER_DAY) * 100}%` }} /></div><span>{t.of(seen, INTAKE_PER_DAY)}</span></div>
        <p className="note">
          {quiz.persistent ? t.kept : t.notKept}{' '}
          <a href={quizToHash({ sub: 'progress-file' })}>{t.saveCopy}</a>
        </p>
      </div>
      <div className="foot">
        {more ? (
          <>
            <button className="btn primary" onClick={onKeepGoing}>{t.keepGoing(more)}</button>
            <button className="btn quiet" onClick={onDone}>{t.done}</button>
          </>
        ) : (
          <>
            <button className="btn primary" onClick={onDone}>{t.done}</button>
            {result.kind === 'study' && <button className="btn" onClick={onLearnMore}>{t.learnMore}</button>}
            <a className="btn quiet" href={quizToHash({ sub: 'practise' })}>{t.practise}</a>
          </>
        )}
      </div>
    </section>
  );
}
