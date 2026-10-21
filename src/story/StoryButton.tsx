// Button C on the guide page, under the lede (owner pick, mock round 3): solid black, champagne text, a folded-map glyph on the right.
// The glyph is an owner-approved exception to "no icons". Shown only where a story file exists (PlacePage checks loadStory).
import { Link, type Go } from '../cards/Link';
import { strings } from '../strings';

const t = strings.story;

export function StoryButton({ id, minutes, stops, go }: { id: string; minutes: number; stops: number; go: Go }) {
  return (
    <Link className="story-open" to={{ kind: 'place', id, page: true, story: true }} go={go}>
      <span className="tx"><span className="t">{t.open}</span><span className="s">{t.openSub(minutes, stops)}</span></span>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#E9D8B4" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
        <path d="M1.5 3.5 6.5 2v12.5l-5 1.5zM6.5 2l5 1.5v12.5l-5-1.5zM11.5 3.5 16.5 2v12.5l-5 1.5z" />
      </svg>
    </Link>
  );
}
