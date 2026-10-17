import { useEffect, useMemo, useRef, useState } from 'react';
import { measuresOf, sheetOf } from '../facts';
import type { QuizView } from '../map/quiz';
import { afterAnswer, makeQuestion, revealFact as grapeOf, seededRandom, type Answer, type Question, type Round } from '../quiz';
import { strings } from '../strings';
import type { Tree } from '../tree';
import { progressOf, viewFor, withoutReask, type Outcome, type Outcomes } from './helpers';
import type { QuizApi } from './useQuiz';

const t = strings.quiz.round;

export type RoundKind = 'study' | 'review';

/** What a round leaves behind for the round end: the round as it grew (re-asks) and what happened to each item. */
export interface RoundResult {
  kind: RoundKind;
  round: Round;
  outcomes: Outcomes;
}

/** A tap on the map in quiz mode; `n` makes a second tap on the same place a new event. */
export interface MapPick { id: string; n: number }

interface Props {
  kind: RoundKind;
  round: Round;
  tree: Tree;
  quiz: QuizApi;
  pick: MapPick | null;
  onView(view: QuizView): void;
  onOpenPlace(id: string): void;
  onExit(result: RoundResult): void;
}

const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const LETTERS = 'ABCD';

export function RoundPlayer({ kind, round: first, tree, quiz, pick, onView, onOpenPlace, onExit }: Props) {
  const [round, setRound] = useState(first);
  const [index, setIndex] = useState(0);
  const [outcomes, setOutcomes] = useState<Outcomes>({});
  const [tentative, setTentative] = useState<string | null>(null);
  const [auto, setAuto] = useState(true);
  const shownAt = useRef(Date.now());
  const firstPick = useRef(pick); // a tap from before this round is not a pick
  const rng = useMemo(() => seededRandom(Date.now()), []);
  const kindName = kind === 'study' ? t.kindStudy : t.kindReview;

  const item = round.items[index];
  const place = item ? tree.getPlace(item.place) : undefined;
  const outcome: Outcome | undefined = outcomes[index];
  const question = useMemo<Question | undefined>(
    () => (item?.kind === 'question' ? makeQuestion(item, { tree, facts: { sheetOf, measuresOf }, rng }) : undefined),
    [index, item, tree],
  );

  const latest = useRef({ next: () => {} });
  const heading = useRef<HTMLElement>(null);
  const result = useRef<HTMLDivElement>(null);

  function next() {
    if (index + 1 >= round.items.length) return onExit({ kind, round, outcomes });
    setIndex(index + 1);
    setTentative(null);
    setAuto(true);
  }
  latest.current.next = next;

  // A question that cannot be made (no facts to ask) is skipped.
  useEffect(() => { if (item?.kind === 'question' && !question) latest.current.next(); }, [index]);
  useEffect(() => { if (!item) onExit({ kind, round, outcomes }); }, [item]);

  // A new step: start the stopwatch and put the keyboard on the question; a reveal moves it to the result.
  // The card scrolls by hand: focus alone left a phone's short card scrolled to wherever the last step ended (mobile check, 17 Oct 2026).
  useEffect(() => {
    shownAt.current = Date.now();
    heading.current?.focus({ preventScroll: true });
    heading.current?.closest('.body')?.scrollTo({ top: 0 });
  }, [index]);
  useEffect(() => {
    const el = result.current;
    if (!outcome || !el) return;
    el.focus({ preventScroll: true });
    const body = el.closest('.body');
    if (body) body.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 12) });
  }, [!!outcome]);

  // Right answers move on after about a second.
  useEffect(() => {
    if (!outcome || !outcome.right || !auto) return;
    const timer = setTimeout(() => latest.current.next(), reducedMotion() ? 2500 : 1000);
    return () => clearTimeout(timer);
  }, [outcome, auto, index]);

  // A tap on the map picks a place for find it.
  useEffect(() => {
    if (pick && pick !== firstPick.current && question?.type === 'find-it' && !outcome) setTentative(pick.id);
  }, [pick]);

  // What the map shows.
  useEffect(() => {
    if (!place || !item) return;
    onView(viewFor({
      place: place.id, zone: place.quiz === 'zone', type: item.kind === 'intro' ? 'intro' : item.type,
      picked: outcome ? (outcome.skipped ? null : outcome.picked ?? null) : tentative, revealed: !!outcome,
    }));
  }, [index, tentative, !!outcome, round.items.length]);

  if (!item || !place) return null;
  const name = (id: string) => tree.getPlace(id)?.name ?? id;
  const progress = progressOf(round, outcomes, index);
  const intros = round.items.filter((i) => i.kind === 'intro').length;
  const introNumber = round.items.slice(0, index + 1).filter((i) => i.kind === 'intro').length;
  const sheet = sheetOf(place.id);
  const grape = grapeOf(place.id, { sheetOf, measuresOf });

  const exit = () => onExit({ kind, round, outcomes });
  const top = (label: string) => (
    <>
      <div className="q-num"><span>{label}</span><button className="btn quiet" style={{ marginRight: '-1rem' }} onClick={exit}>{t.endRound}</button></div>
      <div className="dots" role="img" aria-label={t.dotsLabel(Math.max(progress.n, 1), progress.of, progress.right, progress.wrong)}>
        {progress.dots.map((d, i) => <i key={i} className={d === 'todo' ? '' : d} />)}
      </div>
    </>
  );

  // The intro: a new place is shown before it is asked. It is not a numbered question.
  if (item.kind === 'intro') {
    const seen = () => quiz.record({ kind: 'intro', place: place.id, at: quiz.now().toISOString() });
    return (
      <section className="card glass" aria-labelledby="ih">
        <div className="body">
          {top(t.newPlace(introNumber, intros, kindName))}
          <h1 id="ih" ref={heading as React.RefObject<HTMLHeadingElement>} tabIndex={-1} className="intro-h">{place.name}</h1>
          {sheet && <p className="lede">{sheet.why.text}</p>}
          <dl className="facts">
            {place.community && <><dt>{t.where}</dt><dd>{place.community}</dd></>}
            {grape && <><dt>{t.mainGrape}</dt><dd>{grape}</dd></>}
          </dl>
          <p className="note">{t.introNote}</p>
        </div>
        <div className="foot">
          <button className="btn primary" onClick={() => { seen(); next(); }}>{t.gotIt}</button>
          <button className="btn quiet" onClick={() => { seen(); onOpenPlace(place.id); }}>{t.moreAbout(place.name)}</button>
        </div>
      </section>
    );
  }
  if (!question) return null;

  const seconds = () => Math.round((Date.now() - shownAt.current) / 100) / 10;

  function answer(picked: string | null, right: boolean) {
    if (outcome || item?.kind !== 'question') return;
    const entry: Answer = { kind: 'answer', place: item.place, memory: item.memory, type: item.type, right, at: quiz.now().toISOString(), seconds: seconds() };
    const log = quiz.record(entry);
    setOutcomes({ ...outcomes, [index]: { place: item.place, memory: item.memory, type: item.type, reask: !!item.reask, right, slip: false, skipped: picked === null, ...(picked !== null ? { picked } : {}) } });
    setRound(afterAnswer(round, index, right, log));
  }

  function slip() {
    if (!outcome || item?.kind !== 'question') return;
    quiz.slip();
    setOutcomes({ ...outcomes, [index]: { ...outcome, slip: true } });
    setRound(withoutReask(round, index, item.place, item.memory));
  }
  function unslip() {
    if (!outcome || item?.kind !== 'question') return;
    const log = quiz.unslip();
    setOutcomes({ ...outcomes, [index]: { ...outcome, slip: false } });
    setRound(afterAnswer(round, index, false, log));
  }

  const counts = outcome ? outcome.right || outcome.slip : false;
  const answerText = question.type === 'what-is-this' ? name(question.answer) : question.type === 'fact' ? question.answer : place.name;
  const pickedText = outcome?.picked === undefined ? '' : question.type === 'fact' ? outcome.picked : name(outcome.picked);
  const feedback = !outcome ? '' : outcome.slip ? t.slippedFeedback
    : outcome.right ? (question.type === 'fact' ? t.rightAnswer(answerText) : t.right(place.name))
    : question.type === 'find-it' ? (outcome.skipped ? t.missSkipped(place.name) : t.missFind(pickedText, place.name))
    : t.missChoice(answerText);
  const last = index + 1 >= round.items.length;
  const label = t.questionOf(progress.n, progress.of, kindName);

  return (
    <section className="card glass" aria-labelledby="qq">
      <div className="body">
        {top(label)}
        {question.type === 'fact' && <div className="kicker">{t.factKicker}</div>}
        <p className="q" id="qq" ref={heading as React.RefObject<HTMLParagraphElement>} tabIndex={-1}>
          {question.type === 'find-it' && <>Find <em>{place.name}</em></>}
          {question.type === 'what-is-this' && t.whatIsThis}
          {question.type === 'fact' && <><em>{place.name}</em>: {t.factKinds[question.fact]}?</>}
        </p>
        {question.type === 'find-it' && !outcome && (
          <p className="status" aria-live="polite">{tentative ? t.picked(name(tentative)) : t.findHint}</p>
        )}
        {question.type !== 'find-it' && (
          <div className="choices" role="group" aria-label={t.choicesLabel}>
            {question.choices.map((c, i) => (
              <button
                key={c}
                className={`choice${outcome && c === question.answer ? ' ok' : ''}${outcome && c === outcome.picked && c !== question.answer ? ' bad' : ''}`}
                disabled={!!outcome}
                onClick={() => answer(c, c === question.answer)}
              ><b>{LETTERS[i]}</b>{question.type === 'what-is-this' ? name(c) : c}</button>
            ))}
          </div>
        )}
        <div id="result" ref={result} tabIndex={-1} aria-live="assertive">
          {outcome && (
            <>
              <div className={`feedback${counts ? '' : ' bad'}`}><b aria-hidden="true">{counts ? '✓' : '✗'}</b><span>{feedback}</span></div>
              <dl className="facts reveal">
                <dt>{place.name}</dt><dd>{[place.community, place.kind].filter(Boolean).join(' · ')}</dd>
                {grape && <><dt>{t.mainGrape}</dt><dd>{grape}</dd></>}
                {!counts && sheet && <><dt>{t.why}</dt><dd>{sheet.why.text}</dd></>}
              </dl>
              {!counts && <button className="linkish-open" onClick={() => onOpenPlace(place.id)}>{t.openCard(place.name)}</button>}
              {outcome.right && auto && (
                <div className="autonext"><i /><span>{t.nextSoon}</span> <button className="linkbtn" onClick={() => setAuto(false)}>{t.stay}</button></div>
              )}
              {outcome.slip && <p className="undo" role="status">{t.slipped} <button className="linkbtn" onClick={unslip}>{t.undo}</button></p>}
            </>
          )}
        </div>
      </div>
      <div className="foot">
        {question.type === 'find-it' && !outcome && <button className="btn primary" disabled={!tentative} onClick={() => tentative && answer(tentative, tentative === place.id)}>{t.confirm}</button>}
        {outcome && (!outcome.right || !auto) && <button className="btn primary" onClick={next}>{last ? t.finish : t.next}</button>}
        {outcome && !outcome.right && !outcome.slip && !outcome.skipped && <button className="btn" onClick={slip}>{t.slip}</button>}
        {!outcome && <button className="btn quiet" onClick={() => answer(null, false)}>{t.dontKnow}</button>}
      </div>
    </section>
  );
}
