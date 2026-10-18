import type { MouseEvent, ReactNode } from 'react';
import { strings } from '../strings';
import { SearchBox } from '../cards/SearchBox';
import type { Tree } from '../tree';
import type { Selection } from '../url';

const t = strings.topBar;

interface Props {
  tree: Tree;
  onOpen: (to: Selection) => void;
  /** Which of the bar's items is the screen in view; none on a full page. */
  current: 'atlas' | 'study' | null;
  onAtlas: () => void;
  className?: string;
  /** The page's name, which slides into the bar on full pages (pages.css). */
  title?: string;
  children?: ReactNode;
}

/** A plain left click stays in the app; a modified click (new tab, new window) follows the link. */
const inApp = (run: () => void) => (e: MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  run();
};

/** The site's top bar, the black band (website slice 2; approved mock Review/mock-home-v1/): the logo goes home, Atlas and Study are
 *  the atlas's two modes, then search. The home page (index.html) draws the same bar in plain HTML. Guides and About join it when their
 *  pages exist (owner card, 18 Oct 2026). Study is a plain # link: the app follows the address on its own (popstate). */
export function SiteBar({ tree, onOpen, current, onAtlas, className, title, children }: Props) {
  return (
    <header className={`sitebar${className ? ` ${className}` : ''}`}>
      <div className="in">
        <a className="brand" href="../" aria-label={t.home}>
          <BrandMark /><b>{strings.appName}</b>{title && <span className="pg-ttl" aria-hidden="true">{title}</span>}
        </a>
        <nav aria-label={t.modeNav}>
          <a href="./" aria-current={current === 'atlas' ? 'page' : undefined} onClick={inApp(onAtlas)}>{t.explore}</a>
          <a href="#study" aria-current={current === 'study' ? 'page' : undefined}>{t.quiz}</a>
        </nav>
        <SearchBox tree={tree} open={onOpen} />
        {children}
      </div>
    </header>
  );
}

/** The logo: vine rows running up a slope, cut from a champagne tile. Decorative; the button's text names it. */
export function BrandMark() {
  return (
    <svg className="mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="mark-tile"><rect width="64" height="64" rx="14" /></clipPath>
        <clipPath id="mark-hill"><path d="M-2 52 C 14 50 30 40 44 26 C 50 20 56 17 66 16 L66 66 L-2 66 Z" /></clipPath>
      </defs>
      <g clipPath="url(#mark-tile)">
        <rect width="64" height="64" fill="var(--accent)" />
        <g clipPath="url(#mark-hill)">
          <rect width="64" height="64" fill="var(--accent-ink)" />
          <g fill="none" stroke="var(--accent)" strokeWidth="3.6" strokeLinecap="round">
            <path d="M8 66 L20 49" /><path d="M22 66 L31 40.5" /><path d="M36 66 L41 30.5" /><path d="M50 66 L51 22.5" /><path d="M64 66 L61 17" />
          </g>
        </g>
      </g>
    </svg>
  );
}
