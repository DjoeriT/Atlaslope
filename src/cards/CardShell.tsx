import { useEffect, useRef, type ReactNode } from 'react';
import { strings } from '../strings';
import type { Crumb, Tree } from '../tree';
import { Link, type Go } from './Link';
import { selectionOf } from './nav';

const t = strings.cards;

interface ShellProps {
  tree: Tree;
  go: Go;
  /** The trail ending at this card; every step but the last is a link. */
  trail: Crumb[];
  /** Shown after the last step, e.g. "DO". */
  suffix?: string;
  title: string;
  /** A close button that goes up one step (place cards). */
  close?: { to: Crumb };
  children: ReactNode;
  foot?: ReactNode;
}

/** The trail key of the card shown last, kept across card types (Spain, region and place cards are different components). */
let lastKey: string | null = null;

/** The floating card: breadcrumb, title, body. After the first card, moving to another puts the keyboard on the new title. */
export function CardShell({ tree, go, trail, suffix, title, close, children, foot }: ShellProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  const key = trail.map((c) => c.id).join('/');
  useEffect(() => {
    if (lastKey !== null && lastKey !== key) heading.current?.focus();
    lastKey = key;
  }, [key]);
  const last = trail.length - 1;
  return (
    <section className="card glass" aria-label={title}>
      {close && (
        <Link className="iconbtn close" to={selectionOf(tree, close.to)} go={go}>
          <span className="sr-only">{t.closeBackTo(close.to.name)}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </Link>
      )}
      <div className="body">
        <nav className="kicker crumb" aria-label={t.whereThisSits}>
          {trail.map((c, i) => (
            i === last
              ? <span key={c.id + i} aria-current="page">{c.name}{suffix ? ` · ${suffix}` : ''}</span>
              : <span key={c.id + i} className="step"><Link to={selectionOf(tree, c)} go={go}>{c.name}</Link> ›</span>
          ))}
        </nav>
        <h1 ref={heading} tabIndex={-1}>{title}</h1>
        {children}
      </div>
      {foot && <div className="foot">{foot}</div>}
    </section>
  );
}
