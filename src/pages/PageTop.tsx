import { SiteBar } from '../app/TopBar';
import { Link, type Go } from '../cards/Link';
import { strings } from '../strings';
import type { Tree } from '../tree';
import { SPAIN, type Selection } from '../url';

/** The bar over every full page (place and region alike; UX sweep, 17 Oct 2026): the site's bar, with Back to map on the right.
 * `title` is the page's name, which slides into the bar once the big title has scrolled away (pages.css, scroll-linked motion). */
export function PageTop({ tree, go, back, title }: { tree: Tree; go: Go; back: Selection; title?: string }) {
  return (
    <SiteBar tree={tree} onOpen={go} current={null} onAtlas={() => go(SPAIN)} className="pg-top" title={title}>
      <Link className="btn" to={back} go={go}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 7zM9 4v13M15 7v12.5" /></svg>
        {strings.place.page.backToMap}
      </Link>
    </SiteBar>
  );
}
