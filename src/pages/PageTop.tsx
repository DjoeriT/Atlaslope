import { useEffect, useRef } from 'react';
import { SiteBar } from '../app/TopBar';
import { selectionToHash } from '../url';
import { strings } from '../strings';
import type { Go } from '../cards/Link';
import type { Tree } from '../tree';
import type { Selection } from '../url';

/** The bar over every full page (place and region alike): the site's own bar, the same as on the atlas, with Atlas marked current
 * since a guide is part of the atlas. Atlas goes back to the page's place on the map (site visual review, 18 Oct 2026: one bar on every
 * page, no "Back to map" beside Atlas, two controls that meant the same).
 * `title` is the page's name, which slides into the bar once the big title has scrolled away (pages.css, scroll-linked motion). */
export function PageTop({ tree, go, back, title }: { tree: Tree; go: Go; back: Selection; title?: string }) {
  return (
    <>
      <SiteBar tree={tree} onOpen={go} current="atlas" onAtlas={() => go(back)} className="pg-top" title={title} />
      <ShowMap go={go} back={back} name={title} />
    </>
  );
}

/** A black "Show map" button floating at the foot of every guide, the way back to the map that reads at a glance (owner, 18 Oct 2026:
 *  "from the guide there's no way to go back to the atlas in an intuitive way"). It sits apart from the bar, so it never doubles Atlas
 *  there; the map then flies in onto the place (motion.ts, swoopIn). */
function ShowMap({ go, back, name }: { go: Go; back: Selection; name?: string }) {
  // It steps aside while the reader scrolls down through the text, and comes back on any scroll up or at the end (PR #95 review).
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const a = ref.current;
    const page = a?.closest<HTMLElement>('.pg,.rpage');
    if (!a || !page) return;
    let last = page.scrollTop;
    const onScroll = () => {
      const y = page.scrollTop;
      const end = y + page.clientHeight >= page.scrollHeight - 8;
      if (y > last + 4 && y > 240 && !end) a.dataset.away = ''; else if (y < last - 4 || end) delete a.dataset.away;
      last = y;
    };
    page.addEventListener('scroll', onScroll, { passive: true });
    return () => page.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <a ref={ref} className="showmap" href={selectionToHash(back)} aria-label={name ? strings.topBar.showMapLabel(name) : undefined}
      onClick={(e) => { e.preventDefault(); go(back); }}>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z" /><path d="M9 4v14M15 6v14" /></svg>
      {strings.topBar.showMap}
    </a>
  );
}
