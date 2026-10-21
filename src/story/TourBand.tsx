// B3 on the guide page (owner 21 Oct 2026, mock Review/mock-tour-in-guide/): a black band under the lede with a slowly drifting
// satellite still of the tour's first stop and a champagne "Open the map". Only on guides with a map tour; it replaces "Show on map".
import { lazy, Suspense } from 'react';
import { Link, type Go } from '../cards/Link';
import { strings } from '../strings';
import type { Story } from './format';

const t = strings.story;
const TourStill = lazy(() => import('./TourStill').then((m) => ({ default: m.TourStill })));

export function TourBand({ id, story, minutes, go }: { id: string; story: Story; minutes: number; go: Go }) {
  const stops = story.steps.length - 1;
  return (
    <div className="pg-tour" id="map-tour" tabIndex={-1}>
      <div className="pg-tour-pic"><Suspense fallback={null}><TourStill story={story} /></Suspense></div>
      <div className="pg-tour-tx">
        <span className="k">{t.kickerMap}</span>
        <span className="t">{t.bandTitle(stops)}</span>
        <span className="s">{t.bandSub(minutes)}</span>
        <Link className="story-open" to={{ kind: 'place', id, page: true, story: true }} go={go}>{t.openMap}</Link>
      </div>
    </div>
  );
}
