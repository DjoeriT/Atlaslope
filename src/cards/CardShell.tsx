import { useEffect, useRef, type ReactNode } from 'react';
import { strings } from '../strings';
import type { Crumb, Tree } from '../tree';
import { Link, type Go } from './Link';
import { selectionOf } from './nav';

const t = strings.cards;

interface ShellProps {
  tree: Tree;
  go: Go;
  /** The trail ending at this card; the card shows the steps above it as links. */
  trail: Crumb[];
  title: string;
  /** A close button that goes up one step (place cards). */
  close?: { to: Crumb };
  /** A cover photo above the title (place cards); the card then scrolls as a whole and the close button sits on the photo. */
  cover?: ReactNode;
  children: ReactNode;
  foot?: ReactNode;
}

/** The trail key of the card shown last, kept across card types (Spain, region and place cards are different components). */
let lastKey: string | null = null;

/** The full place page counts as a card shown, so coming back from it to the map card puts the keyboard on the title. */
export function noteCardKey(key: string) { lastKey = key; }
/** False until the first card or page has shown, so a page opened from a link does not grab the keyboard on load. */
export const cardShownBefore = () => lastKey !== null;

/** The floating card: breadcrumb, title, body. After the first card, moving to another puts the keyboard on the new title. */
export function CardShell({ tree, go, trail, title, close, cover, children, foot }: ShellProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  const key = trail.map((c) => c.id).join('/');
  useEffect(() => {
    if (lastKey !== null && lastKey !== key) heading.current?.focus();
    lastKey = key;
  }, [key]);
  // The trail names only what lies above: the title right under it names the card itself (owner, 18 Oct 2026: "Spain and Spain in one screen").
  const up = trail.slice(0, -1);
  const body = (
    <div className="body">
      {up.length > 0 && (
        <nav className="kicker crumb" aria-label={t.whereThisSits}>
          {up.map((c, i) => <span key={c.id + i} className="step">{i > 0 && ' › '}<Link to={selectionOf(tree, c)} go={go}>{c.name}</Link></span>)}
        </nav>
      )}
      <h1 ref={heading} tabIndex={-1}>{title}</h1>
      {children}
    </div>
  );
  return (
    <section className={cover ? 'card glass has-cover' : 'card glass'} aria-label={title}>
      {close && (
        <Link className="iconbtn close" to={selectionOf(tree, close.to)} go={go}>
          <span className="sr-only">{t.closeBackTo(close.to.name)}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </Link>
      )}
      {cover ? <div className="scroll">{cover}{body}</div> : body}
      {foot && <div className="foot">{foot}</div>}
    </section>
  );
}
