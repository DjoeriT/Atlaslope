import { useEffect, useMemo, useRef, useState } from 'react';
import { courseOf, NO_COURSE, reviewRound } from '../quiz';
import { strings } from '../strings';
import type { Tree } from '../tree';
import { quizToHash } from '../url';
import { missedToday, practiseTree, questionCount, tickOf } from './doorsModel';
import type { QuizApi } from './useQuiz';

const t = strings.quiz.practiseScreen;

const X = <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>;

/** A region's whole-region tick; the partial state is the checkbox's own "mixed". */
function RegionTick({ label, state, onChange }: { label: string; state: 'all' | 'some' | 'none'; onChange(on: boolean): void }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = state === 'some'; }, [state]);
  return (
    <label>
      <input ref={ref} type="checkbox" aria-label={t.tickRegion(label)} checked={state === 'all'} onChange={(e) => onChange(e.target.checked)} /> {label}
    </label>
  );
}

interface Props {
  tree: Tree;
  quiz: QuizApi;
  onStart(set: string[], size: 10 | 20): void;
  onLeave(): void;
}

/** Practise any mix (mock 22): quick picks, regions that open to their places, 10 or 20, Start with the real question count. */
export function PractiseScreen({ tree, quiz, onStart, onLeave }: Props) {
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set());
  const [size, setSize] = useState<10 | 20>(20);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  // The picker offers only the course's places (owner, 21 Oct 2026: the course is a filter on everything in Learn).
  const groups = useMemo(() => practiseTree(tree, quiz.course), [tree, quiz.course]);
  const missed = useMemo(() => missedToday(quiz.log, quiz.now()), [quiz.log]);
  const all = useMemo(() => groups.flatMap((g) => g.places.map((p) => p.id)), [groups]);
  const set = useMemo(() => all.filter((id) => picked.has(id)), [all, picked]);
  const questions = useMemo(
    () => (set.length ? questionCount(reviewRound(tree, set, quiz.log, quiz.now(), { size })) : 0),
    [tree, set, quiz.log, size],
  );
  const setMany = (ids: readonly string[], on: boolean) => {
    const next = new Set(picked);
    ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
    setPicked(next);
  };
  return (
    <section className="card glass" aria-labelledby="ph">
      <a href={quizToHash({ sub: null })} className="iconbtn close" aria-label={t.close} onClick={(e) => { e.preventDefault(); onLeave(); }}>{X}</a>
      <div className="body">
        <nav className="kicker crumb" aria-label={strings.quiz.focus.crumbLabel}><a href={quizToHash({ sub: null })}>{strings.quiz.focus.crumbQuiz}</a> › <span>{t.crumbReview}</span></nav>
        <h1 id="ph" ref={heading} tabIndex={-1}>{t.heading}</h1>
        <h3>{t.quick}</h3>
        <div className="chips" role="group" aria-label={t.quick}>
          <button className="chip" disabled={!missed.length} onClick={() => setPicked(new Set(missed.filter((id) => all.includes(id))))}>{t.missed(missed.length)}</button>
          <button className="chip" onClick={() => setPicked(new Set(all))}>{quiz.course === NO_COURSE ? t.allOfSpain : t.allOfCourse(courseOf(quiz.course).label)}</button>
        </div>
        <h3 id="rp">{t.regionsAndPlaces}</h3>
        <ul className="tree" aria-labelledby="rp">
          {groups.map(({ region, places }) => {
            const ids = places.map((p) => p.id);
            return (
              <li key={region.id}>
                <details>
                  <summary>
                    <RegionTick label={region.name} state={tickOf(ids, picked)} onChange={(on) => setMany(ids, on)} />
                    <small>{t.places(places.length)}</small>
                  </summary>
                  <ul>
                    {places.map((p) => (
                      <li key={p.id}>
                        <label><input type="checkbox" checked={picked.has(p.id)} onChange={(e) => setMany([p.id], e.target.checked)} /> {p.name}{p.quiz === 'zone' ? ' (zone)' : ''}</label>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            );
          })}
        </ul>
        <h3>{t.howMany}</h3>
        <div className="chips" role="radiogroup" aria-label={t.howMany}>
          {([10, 20] as const).map((n) => (
            <button key={n} className="chip" role="radio" aria-checked={size === n} onClick={() => setSize(n)}>{n}</button>
          ))}
        </div>
        <p className="note">{t.note}</p>
      </div>
      <div className="foot">
        {set.length
          ? <button className="btn primary" onClick={() => onStart(set, size)}>{t.start(questions, set.length)}</button>
          : <button className="btn off" aria-disabled="true">{t.pickOne}</button>}
        <button className="btn quiet" onClick={() => setPicked(new Set())}>{t.clear}</button>
      </div>
    </section>
  );
}
