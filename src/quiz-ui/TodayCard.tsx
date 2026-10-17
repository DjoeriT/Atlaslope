import { strings } from '../strings';
import type { Tree } from '../tree';
import { selectionToHash, type Selection } from '../url';
import { dayName } from './Doors';
import { dueByRegion, listOf, nextDue } from './doors';
import type { QuizApi } from './useQuiz';

const t = strings.quiz.today;

interface Props {
  tree: Tree;
  quiz: QuizApi;
  go(to: Selection): void;
  /** Opens the quiz and starts today's round (or the new places). */
  onStart(): void;
  /** Closing the card shows the Spain card. */
  onClose(): void;
}

/** The Today card on Home (atlas mocks 10 and 10b): what is due, today's new places, one button to start. */
export function TodayCard({ tree, quiz, go, onStart, onClose }: Props) {
  const due = quiz.plan.due.length;
  const fresh = quiz.plan.intake;
  const freshPlaces = fresh.map((id) => tree.getPlace(id)).filter((p) => p !== undefined);
  const region = tree.getRegion(freshPlaces[0]?.region ?? '');
  const regions = dueByRegion(tree, quiz.plan.due);
  const next = nextDue(tree, quiz.state, quiz.now());
  const nextText = next ? strings.quiz.doors.nextDue(dayName(next.day, false), next.places) : '';
  const names = listOf(freshPlaces.map((p) => p.name));
  const toRegion = region ? ({ kind: 'region', id: region.id } as const) : null;
  return (
    <section className="card glass" aria-label={t.label}>
      <button className="iconbtn close" aria-label={t.close} onClick={onClose}>
        <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <div className="body">
        <div className="kicker">{t.kicker(dayName(quiz.now()))}</div>
        <h1>{due ? t.due(due) : t.nothingDue}</h1>
        <p className="lede">
          {due ? t.dueLede(listOf(regions.map((r) => t.dueFrom(r.count, r.name)))) : t.safeLede(nextText)}
        </p>
        {freshPlaces.length > 0 && toRegion && (
          <ul className="today">
            <li>
              <a
                href={selectionToHash(toRegion)}
                onClick={(e) => { e.preventDefault(); go(toRegion); }}
              >
                <b>{due ? t.continue(region!.name) : t.seeNew}</b>
                <small>{t.newToday(freshPlaces.length, names)}</small>
              </a>
            </li>
          </ul>
        )}
      </div>
      <div className="foot">
        {due > 0 || fresh.length > 0
          ? <button className="btn primary" onClick={onStart}>{due ? t.reviewDue(due) : t.learnNew(fresh.length)}</button>
          : null}
        {due === 0 && <button className="btn quiet" onClick={onClose}>{t.justExplore}</button>}
      </div>
    </section>
  );
}
