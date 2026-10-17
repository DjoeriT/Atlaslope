import { strings } from '../strings';
import type { QuizRoute } from '../url';

const t = strings.quiz;

/** The quiz card. A shell for now: the doors, questions and results arrive in the next cards. */
export function QuizScreen({ route }: { route: QuizRoute }) {
  return (
    <section className="card glass" aria-label={t.cardLabel} data-sub={route.sub ?? ''}>
      <div className="body">
        <h1>{t.heading}</h1>
      </div>
    </section>
  );
}
