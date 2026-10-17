import type { MouseEvent, ReactNode } from 'react';
import { selectionToHash, type Selection } from '../url';

export type Go = (to: Selection) => void;

interface Props {
  to: Selection;
  go: Go;
  children: ReactNode;
  className?: string;
  /** Overrides the link's name for screen readers. */
  label?: string;
}

/** A real link (so it can be copied, opened in a new tab and reached by keyboard) that moves the card without a reload. */
export function Link({ to, go, children, className, label }: Props) {
  const onClick = (e: MouseEvent) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(to);
  };
  return <a className={className} aria-label={label} href={selectionToHash(to) || './'} onClick={onClick}>{children}</a>;
}
