import { useEffect, useRef } from 'react';
import { courseOf, NO_COURSE, studySet, type Round } from '../quiz';
import { strings } from '../strings';
import type { Tree } from '../tree';
import { quizToHash } from '../url';
import { focusNames, listOf, nextDue, questionCount, startRegion } from './doorsModel';
import { CourseMenu } from './CourseMenu';
import { PhotoCredit, PlacePhotos } from './PlacePhotos';
import type { QuizApi } from './useQuiz';

const t = strings.quiz;
const d = t.doors;
const c = t.course;

export const dayName = (date: Date, withDate = true) =>
  date.toLocaleDateString('en-GB', { weekday: 'long', ...(withDate ? { day: 'numeric', month: 'long' } : {}) });

interface Props {
  tree: Tree;
  quiz: QuizApi;
  /** Today's round as Learn would play it. */
  round: Round;
  /** Nothing asked at all: the last tap found nothing to ask. */
  empty: boolean;
  /** Plays today's round, or with `learnMore` the next five new places. */
  onStudy(learnMore: boolean): void;
}

/** The Learn screen, mock round 2 option D (Review/mock-study-start): the intro on a first visit, else the card. The course filters both. */
export function Doors({ tree, quiz, round, empty, onStudy }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (document.activeElement === document.body) heading.current?.focus({ preventScroll: true }); }, []);
  const fresh = quiz.plan.intake;
  const region = startRegion(tree, fresh);
  const notes = (
    <>
      {!quiz.persistent && <p className="note" role="status">{t.storageBlocked}</p>}
      {quiz.store.status().damaged && <p className="note" role="status">{t.storageDamaged}</p>}
      {empty && <p className="note" role="status">{t.nothingToAsk}</p>}
    </>
  );
  const menu = <CourseMenu tree={tree} course={quiz.course} onChoose={quiz.setCourse} />;

  // A first visit (no history) opens with the intro: what Learn is, and where it starts (owner, 21 Oct 2026).
  if (!quiz.hasProgress) {
    return (
      <section className="card glass learn" aria-labelledby="qh" data-sub="">
        <div className="body">
          <h1 id="qh" ref={heading} tabIndex={-1}>{d.introHeading}</h1>
          {notes}
          <PlacePhotos tree={tree} ids={fresh} label={d.photosLabel} />
          {d.intro.map((p) => <p key={p}>{p}</p>)}
          {menu}
          {fresh.length > 0
            ? <div className="stick"><button className="btn primary wide" onClick={() => onStudy(false)}>{d.begin(fresh.length, region)}</button></div>
            : <div className="stick"><button className="btn primary wide" onClick={() => onStudy(true)}>{d.learnExtra}</button></div>}
          <PhotoCredit tree={tree} ids={fresh} />
        </div>
      </section>
    );
  }

  const due = quiz.plan.due.length;
  const focus = quiz.focus;
  const course = courseOf(quiz.course);
  const chosen = course.id !== NO_COURSE;
  const count = studySet(tree, quiz.course).length;
  const next = nextDue(tree, quiz.state, quiz.now(), quiz.course);
  return (
    <section className="card glass learn" aria-labelledby="qh" data-sub="">
      <div className="body">
        {menu}
        <p className="scope">{chosen ? c.scopeCourse(count) : c.scopeAll(count)}</p>
        {notes}
        <h1 id="qh" ref={heading} tabIndex={-1}>{chosen ? d.upNextCourse : d.upNext}</h1>
        {due > 0 && <p className="big"><b>{d.due(due)}</b>{d.and}<b>{d.newCount(fresh.length)}</b>{d.today}</p>}
        {due === 0 && fresh.length === 0 && <p>{d.nothingDue}</p>}
        {fresh.length > 0 && <p className="sub">{d.newPlaces(fresh.length, region)}</p>}
        <PlacePhotos tree={tree} ids={fresh} label={d.photosLabel} />
        <div className="stick">
          {due > 0
            ? <button className="btn primary wide" onClick={() => onStudy(false)}>{d.start(questionCount(round))}</button>
            : fresh.length > 0
              ? <button className="btn primary wide" onClick={() => onStudy(false)}>{d.startThese(fresh.length)}</button>
              : <button className="btn primary wide" onClick={() => onStudy(true)}>{d.learnExtra}</button>}
        </div>
        <p className="focusline">
          {focus.length ? d.focusOn(listOf(focusNames(tree, focus))) : d.focusNone}{' '}
          <a href={quizToHash({ sub: 'focus' })}>{focus.length ? d.change : d.setFocus}</a>
        </p>
        {due === 0 && next && <p className="note">{d.nextDue(dayName(next.day, false), next.places)}</p>}
        <section className="door" aria-labelledby="d2">
          <h2 id="d2">{chosen ? d.practiseCourse(course.label) : d.practiseAll}</h2>
          <p>{chosen ? d.practiseLedeCourse : d.practiseLedeAll}</p>
          <a className="btn wide" href={quizToHash({ sub: 'practise' })}>{d.practise}</a>
        </section>
        {/* Moved here from the logo's menu in website slice 2: the logo now goes home, and the file is Learn's progress. */}
        <p className="note saveload"><a href={quizToHash({ sub: 'progress-file' })}>{strings.topBar.saveLoad}</a></p>
        <PhotoCredit tree={tree} ids={fresh} />
      </div>
    </section>
  );
}
