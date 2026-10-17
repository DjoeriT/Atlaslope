import { useEffect, useRef } from 'react';
import type { Round } from '../quiz';
import { strings } from '../strings';
import type { Tree } from '../tree';
import { quizToHash } from '../url';
import { focusNames, listOf, nextDue, questionCount } from './doors';
import type { QuizApi } from './useQuiz';

const t = strings.quiz;
const d = t.doors;

export const dayName = (date: Date, withDate = true) =>
  date.toLocaleDateString('en-GB', { weekday: 'long', ...(withDate ? { day: 'numeric', month: 'long' } : {}) });

interface Props {
  tree: Tree;
  quiz: QuizApi;
  /** Today's round as the Study door would play it. */
  round: Round;
  /** Nothing asked at all: the last tap found nothing to ask. */
  empty: boolean;
  /** Plays today's round, or with `learnMore` the next five new places. */
  onStudy(learnMore: boolean): void;
}

/** The Quiz screen: the Study door (today's round), the Review door (Practise any mix). Mocks 20-quiz and 20b. */
export function Doors({ tree, quiz, round, empty, onStudy }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (document.activeElement === document.body) heading.current?.focus({ preventScroll: true }); }, []);
  const due = quiz.plan.due.length;
  const fresh = quiz.plan.intake;
  const freshNames = listOf(fresh.map((id) => (tree.getPlace(id)?.name ?? id).split(' / ')[0])); // the first form of a two-language name
  const focus = quiz.focus;
  const next = nextDue(tree, quiz.state, quiz.now());
  const questions = questionCount(round);
  return (
    <section className="card glass" aria-labelledby="qh" data-sub="">
      <div className="body">
        <div className="kicker">{t.kicker(dayName(quiz.now()))}</div>
        <h1 id="qh" ref={heading} tabIndex={-1}>{t.heading}</h1>
        {!quiz.persistent && <p className="note" role="status">{t.storageBlocked}</p>}
        {quiz.store.status().damaged && <p className="note" role="status">{t.storageDamaged}</p>}
        {empty && <p className="note" role="status">{t.nothingToAsk}</p>}
        <section className="door" aria-labelledby="d1">
          <h2 id="d1">{d.study}</h2>
          {due > 0 ? (
            <>
              <p>{d.studyLede}</p>
              <p className="big"><b>{d.due(due)}</b>{d.and}<b>{d.newCount(fresh.length)}</b>{d.today}</p>
              {fresh.length > 0 && <p className="sub">{(focus.length ? d.newFromFocus : d.newPlain)(freshNames)}</p>}
              <button className="btn primary wide" onClick={() => onStudy(false)}>{d.start(questions)}</button>
            </>
          ) : (
            <>
              <p>{d.nothingDue}</p>
              {fresh.length > 0 && <p className="sub">{d.readyNew(freshNames)}</p>}
              {fresh.length > 0
                ? <button className="btn primary wide" onClick={() => onStudy(false)}>{d.learnNew(fresh.length)}</button>
                : <button className="btn primary wide" onClick={() => onStudy(true)}>{d.learnExtra}</button>}
            </>
          )}
          <p className="focusline">
            {d.focusLine} <b>{focus.length ? listOf(focusNames(tree, focus)) : d.focusNone}</b>{' '}
            <a href={quizToHash({ sub: 'focus' })}>{focus.length ? d.change : d.setFocus}</a>
          </p>
        </section>
        <section className="door" aria-labelledby="d2">
          <h2 id="d2">{d.review}</h2>
          <p>{d.reviewLede}</p>
          <a className="btn wide" href={quizToHash({ sub: 'practise' })}>{d.practise}</a>
        </section>
        {due === 0 && next && <p className="note">{d.nextDue(dayName(next.day, false), next.places)}</p>}
      </div>
    </section>
  );
}
