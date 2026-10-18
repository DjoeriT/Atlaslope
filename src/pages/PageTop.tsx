import { SiteBar } from '../app/TopBar';
import type { Go } from '../cards/Link';
import type { Tree } from '../tree';
import type { Selection } from '../url';

/** The bar over every full page (place and region alike): the site's own bar, the same as on the atlas, with Atlas marked current
 * since a guide is part of the atlas. Atlas goes back to the page's place on the map (site visual review, 18 Oct 2026: one bar on every
 * page, no "Back to map" beside Atlas, two controls that meant the same).
 * `title` is the page's name, which slides into the bar once the big title has scrolled away (pages.css, scroll-linked motion). */
export function PageTop({ tree, go, back, title }: { tree: Tree; go: Go; back: Selection; title?: string }) {
  return <SiteBar tree={tree} onOpen={go} current="atlas" onAtlas={() => go(back)} className="pg-top" title={title} />;
}
